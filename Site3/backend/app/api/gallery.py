"""Public gallery endpoints — accessed via the unguessable event slug."""

from __future__ import annotations

import re
from typing import Annotated

from fastapi import APIRouter, Depends, Header, HTTPException, status
from fastapi.responses import StreamingResponse

from app.api.deps import DB
from app.core.config import get_settings
from app.core.security import (
    JWTError,
    create_access_token,
    decode_token,
    verify_password,
)
from app.db.models import Event
from app.schemas.event import (
    GalleryUnlockRequest,
    GalleryUnlockResponse,
    PublicEventOut,
)
from app.schemas.image import BulkDownloadRequest, GalleryImageOut
from app.services import event_service, image_service, zip_service

router = APIRouter(prefix="/gallery", tags=["gallery"])


_GALLERY_TOKEN_PREFIX = "gallery:"


def _ensure_accessible(event: Event | None) -> Event:
    if not event:
        raise HTTPException(status_code=404, detail="Galerie inexistentă")

    # Be explicit about which check fails so we know what to fix.
    status_value = getattr(event.status, "value", str(event.status))
    if status_value != "published":
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=(
                "Galeria nu este încă publicată "
                f"(stare curentă: {status_value})."
            ),
        )
    if event.is_expired:
        raise HTTPException(
            status_code=status.HTTP_410_GONE,
            detail=f"Galeria a expirat la {event.expires_at}.",
        )
    return event


def _check_gallery_password(
    event: Event,
    authorization: str | None,
) -> None:
    """If the event has a password, require a Bearer gallery-token."""
    if event.access_password_hash is None:
        return

    token = None
    if authorization and authorization.lower().startswith("bearer "):
        token = authorization.split(" ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Galerie protejată prin parolă",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(token)
    except JWTError as exc:
        raise HTTPException(status_code=401, detail=f"Token invalid: {exc}") from exc
    if payload.get("type") != "gallery" or payload.get("sub") != event.slug:
        raise HTTPException(status_code=401, detail="Token nepotrivit pentru galerie")


@router.get("/{slug}", response_model=PublicEventOut)
def get_public_event(slug: str, db: DB) -> PublicEventOut:
    event = _ensure_accessible(event_service.get_event_by_slug(db, slug))
    return PublicEventOut(
        slug=event.slug,
        title=event.title,
        client_name=event.client_name,
        description=event.description,
        event_date=event.event_date,
        cover_url=image_service.signed_cover(event),
        allow_download=event.allow_download,
        allow_favorites=event.allow_favorites,
        image_count=event_service.count_images(db, event),
        requires_password=event.access_password_hash is not None,
    )


@router.post("/{slug}/unlock", response_model=GalleryUnlockResponse)
def unlock_gallery(
    slug: str, payload: GalleryUnlockRequest, db: DB
) -> GalleryUnlockResponse:
    event = _ensure_accessible(event_service.get_event_by_slug(db, slug))
    if event.access_password_hash is None:
        # No password required — return a token anyway so the FE can flow uniformly.
        token = create_access_token(
            subject=event.slug, extra={"type": "gallery"}, expires_minutes=60 * 4
        )
        return GalleryUnlockResponse(access_token=token, expires_in=60 * 60 * 4)

    if not verify_password(payload.password, event.access_password_hash):
        raise HTTPException(status_code=401, detail="Parolă incorectă")

    token = create_access_token(
        subject=event.slug, extra={"type": "gallery"}, expires_minutes=60 * 4
    )
    return GalleryUnlockResponse(access_token=token, expires_in=60 * 60 * 4)


@router.get("/{slug}/images", response_model=list[GalleryImageOut])
def list_gallery_images(
    slug: str,
    db: DB,
    authorization: Annotated[str | None, Header()] = None,
) -> list[GalleryImageOut]:
    event = _ensure_accessible(event_service.get_event_by_slug(db, slug))
    _check_gallery_password(event, authorization)

    images = image_service.list_images(db, event)
    out: list[GalleryImageOut] = []
    for img in images:
        out.append(
            GalleryImageOut(
                id=img.id,
                filename=img.filename,
                width=img.width,
                height=img.height,
                size_bytes=img.size_bytes,
                preview_url=image_service.signed_preview(img),
                thumb_url=image_service.signed_thumb(img),
                download_url=(
                    image_service.signed_download(img) if event.allow_download else None
                ),
            )
        )
    return out


@router.get("/{slug}/images/{image_id}/download")
def download_image(
    slug: str,
    image_id: str,
    db: DB,
    authorization: Annotated[str | None, Header()] = None,
) -> dict:
    """Return a one-shot signed URL for a single image."""
    event = _ensure_accessible(event_service.get_event_by_slug(db, slug))
    _check_gallery_password(event, authorization)
    if not event.allow_download:
        raise HTTPException(status_code=403, detail="Descărcările sunt dezactivate")

    img = next(
        (i for i in image_service.list_images(db, event) if i.id == image_id), None
    )
    if not img:
        raise HTTPException(status_code=404, detail="Imagine inexistentă")
    return {"url": image_service.signed_download(img), "filename": img.filename}


_ZIP_NAME_SAFE = re.compile(r"[^A-Za-z0-9._-]+")


@router.post("/{slug}/download")
def download_bulk(
    slug: str,
    payload: BulkDownloadRequest,
    db: DB,
    authorization: Annotated[str | None, Header()] = None,
) -> StreamingResponse:
    """Stream a ZIP of all (or a selected subset of) images."""
    settings = get_settings()  # noqa: F841  (reserved for future per-event quotas)
    event = _ensure_accessible(event_service.get_event_by_slug(db, slug))
    _check_gallery_password(event, authorization)
    if not event.allow_download:
        raise HTTPException(status_code=403, detail="Descărcările sunt dezactivate")

    all_images = image_service.list_images(db, event)
    if payload.image_ids:
        wanted = set(payload.image_ids)
        images = [img for img in all_images if img.id in wanted]
    else:
        images = all_images

    if not images:
        raise HTTPException(status_code=400, detail="Niciun cadru selectat")

    safe_title = _ZIP_NAME_SAFE.sub("_", event.title) or "gallery"
    zip_name = f"{safe_title}-{event.slug[:8]}.zip"

    return StreamingResponse(
        zip_service.stream_event_zip(images),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{zip_name}"'},
    )
