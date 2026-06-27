"""Image upload + thumbnail + retrieval logic.

Originals stay full-resolution in R2 under `event/{eventId}/original/`.
A web-friendly thumbnail (max 1600px on the long edge) is stored under
`event/{eventId}/thumb/` so masonry browsing is fast.
"""

from __future__ import annotations

import io
import logging
import uuid
from typing import BinaryIO, Iterable, Sequence

from PIL import Image as PILImage, ImageOps, UnidentifiedImageError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.r2 import get_r2
from app.db.models import Event, EventImage

logger = logging.getLogger(__name__)

THUMB_MAX_EDGE = 1600
THUMB_QUALITY = 82


def _ext_from_filename(name: str) -> str:
    if "." in name:
        return name.rsplit(".", 1)[-1].lower()
    return "jpg"


def _key_for(event_id: str, kind: str, ext: str) -> str:
    """Build a stable R2 key under event/{id}/{kind}/{uuid}.{ext}."""
    return f"event/{event_id}/{kind}/{uuid.uuid4().hex}.{ext}"


def _next_sort_order(db: Session, event: Event) -> int:
    existing = db.scalar(
        select(EventImage.sort_order)
        .where(EventImage.event_id == event.id)
        .order_by(EventImage.sort_order.desc())
        .limit(1)
    )
    return (existing or 0) + 1


def upload_image(
    db: Session,
    event: Event,
    fileobj: BinaryIO,
    filename: str,
    content_type: str,
) -> EventImage:
    """Upload one image: original + derived thumbnail, persist metadata."""
    settings = get_settings()
    storage = get_r2()

    raw = fileobj.read()
    if not raw:
        raise ValueError("Empty upload")

    max_bytes = settings.max_upload_size_mb * 1024 * 1024
    if len(raw) > max_bytes:
        raise ValueError(
            f"File exceeds the {settings.max_upload_size_mb}MB upload limit."
        )

    # Decode + auto-rotate based on EXIF so portraits don't display sideways.
    try:
        with PILImage.open(io.BytesIO(raw)) as im:
            im = ImageOps.exif_transpose(im)
            width, height = im.size

            # Re-encode the original as a normalised JPEG only if it's not
            # already a web-friendly format. For RAW/TIFF we'd want a
            # different pipeline; we keep JPEG/PNG/WEBP as-is so we don't
            # silently degrade quality.
            ext = _ext_from_filename(filename)
            if ext not in {"jpg", "jpeg", "png", "webp", "avif"}:
                ext = "jpg"

            thumb_buf = io.BytesIO()
            thumb = im.copy()
            thumb.thumbnail((THUMB_MAX_EDGE, THUMB_MAX_EDGE))
            if thumb.mode in ("RGBA", "P"):
                thumb = thumb.convert("RGB")
            thumb.save(thumb_buf, "JPEG", quality=THUMB_QUALITY, optimize=True)
            thumb_bytes = thumb_buf.getvalue()
    except UnidentifiedImageError as exc:
        raise ValueError(f"Not a valid image: {filename}") from exc

    original_key = _key_for(event.id, "original", ext)
    thumb_key = _key_for(event.id, "thumb", "jpg")

    storage.upload_bytes(raw, original_key, content_type)
    storage.upload_bytes(thumb_bytes, thumb_key, "image/jpeg")

    record = EventImage(
        event_id=event.id,
        original_key=original_key,
        thumb_key=thumb_key,
        filename=filename,
        content_type=content_type,
        size_bytes=len(raw),
        width=width,
        height=height,
        sort_order=_next_sort_order(db, event),
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def delete_image(db: Session, image: EventImage) -> None:
    storage = get_r2()
    storage.delete_object(image.original_key)
    if image.thumb_key:
        storage.delete_object(image.thumb_key)
    db.delete(image)
    db.commit()


def list_images(db: Session, event: Event) -> list[EventImage]:
    stmt = (
        select(EventImage)
        .where(EventImage.event_id == event.id)
        .order_by(EventImage.sort_order, EventImage.created_at)
    )
    return list(db.scalars(stmt).all())


def reorder_images(
    db: Session, event: Event, ordered_ids: Sequence[str]
) -> list[EventImage]:
    images = {img.id: img for img in list_images(db, event)}
    for idx, image_id in enumerate(ordered_ids, start=1):
        if image_id in images:
            images[image_id].sort_order = idx
    db.commit()
    return list_images(db, event)


def signed_preview(image: EventImage) -> str:
    settings = get_settings()
    storage = get_r2()
    key = image.thumb_key or image.original_key
    return storage.presigned_get(key, expires_in=settings.preview_url_ttl_seconds)


def signed_thumb(image: EventImage) -> str:
    settings = get_settings()
    storage = get_r2()
    key = image.thumb_key or image.original_key
    return storage.presigned_get(key, expires_in=settings.preview_url_ttl_seconds)


def signed_download(image: EventImage) -> str:
    settings = get_settings()
    storage = get_r2()
    return storage.presigned_get(
        image.original_key,
        expires_in=settings.download_url_ttl_seconds,
        download_filename=image.filename,
    )


def signed_cover(event: Event) -> str | None:
    if not event.cover_image_key:
        return None
    settings = get_settings()
    storage = get_r2()
    return storage.presigned_get(
        event.cover_image_key, expires_in=settings.preview_url_ttl_seconds
    )


def set_cover_from_image(db: Session, event: Event, image: EventImage) -> Event:
    event.cover_image_key = image.thumb_key or image.original_key
    db.commit()
    db.refresh(event)
    return event
