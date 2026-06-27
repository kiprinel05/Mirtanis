"""Admin-only endpoints for managing events + their photos."""

from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status

from app.api.deps import CurrentAdmin, DB, OwnedEvent
from app.db.models import EventImage
from app.schemas.event import (
    EventAdminOut,
    EventCreate,
    EventListOut,
    EventUpdate,
)
from app.schemas.image import (
    BulkUploadResult,
    ImageAdminOut,
    ImageReorderRequest,
)
from app.services import event_service, image_service

router = APIRouter(prefix="/events", tags=["events"])


def _serialise_event(event, db) -> EventAdminOut:
    out = EventAdminOut.model_validate(event)
    out.image_count = event_service.count_images(db, event)
    out.has_password = event.access_password_hash is not None
    out.is_expired = event.is_expired
    return out


def _serialise_image(image: EventImage) -> ImageAdminOut:
    out = ImageAdminOut.model_validate(image)
    out.preview_url = image_service.signed_preview(image)
    out.thumb_url = image_service.signed_thumb(image)
    return out


# ------------------------------------------------------------------ events --

@router.get("", response_model=EventListOut)
def list_events(
    admin: CurrentAdmin,
    db: DB,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> EventListOut:
    items, total = event_service.list_events_for_owner(db, admin, limit, offset)
    return EventListOut(
        items=[_serialise_event(e, db) for e in items],
        total=total,
    )


@router.post("", response_model=EventAdminOut, status_code=status.HTTP_201_CREATED)
def create_event(payload: EventCreate, admin: CurrentAdmin, db: DB) -> EventAdminOut:
    event = event_service.create_event(db, admin, payload)
    return _serialise_event(event, db)


@router.get("/{event_id}", response_model=EventAdminOut)
def get_event(event: OwnedEvent, db: DB) -> EventAdminOut:
    return _serialise_event(event, db)


@router.patch("/{event_id}", response_model=EventAdminOut)
def update_event(payload: EventUpdate, event: OwnedEvent, db: DB) -> EventAdminOut:
    event_service.update_event(db, event, payload)
    return _serialise_event(event, db)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event: OwnedEvent, db: DB) -> None:
    event_service.delete_event(db, event)


@router.post("/{event_id}/rotate-link", response_model=EventAdminOut)
def rotate_link(event: OwnedEvent, db: DB) -> EventAdminOut:
    event_service.regenerate_slug(db, event)
    return _serialise_event(event, db)


# ------------------------------------------------------------------ images --

@router.get("/{event_id}/images", response_model=list[ImageAdminOut])
def list_images(event: OwnedEvent, db: DB) -> list[ImageAdminOut]:
    return [_serialise_image(img) for img in image_service.list_images(db, event)]


@router.post(
    "/{event_id}/images",
    response_model=BulkUploadResult,
    status_code=status.HTTP_201_CREATED,
)
async def upload_images(
    event: OwnedEvent,
    db: DB,
    files: list[UploadFile] = File(...),
) -> BulkUploadResult:
    uploaded: list[ImageAdminOut] = []
    failed: list[str] = []

    for f in files:
        try:
            record = image_service.upload_image(
                db=db,
                event=event,
                fileobj=f.file,
                filename=f.filename or "image.jpg",
                content_type=f.content_type or "image/jpeg",
            )
            uploaded.append(_serialise_image(record))
        except ValueError as exc:
            failed.append(f"{f.filename}: {exc}")
        except Exception as exc:  # noqa: BLE001
            failed.append(f"{f.filename}: unexpected error ({exc})")
        finally:
            await f.close()

    return BulkUploadResult(uploaded=uploaded, failed=failed)


@router.patch("/{event_id}/images/reorder", response_model=list[ImageAdminOut])
def reorder_images(
    payload: ImageReorderRequest, event: OwnedEvent, db: DB
) -> list[ImageAdminOut]:
    items = image_service.reorder_images(db, event, payload.ordered_ids)
    return [_serialise_image(img) for img in items]


@router.post("/{event_id}/images/{image_id}/cover", response_model=EventAdminOut)
def set_cover(image_id: str, event: OwnedEvent, db: DB) -> EventAdminOut:
    img = next(
        (i for i in image_service.list_images(db, event) if i.id == image_id),
        None,
    )
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    image_service.set_cover_from_image(db, event, img)
    return _serialise_event(event, db)


@router.delete(
    "/{event_id}/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_image(image_id: str, event: OwnedEvent, db: DB) -> None:
    img = next(
        (i for i in image_service.list_images(db, event) if i.id == image_id),
        None,
    )
    if not img:
        raise HTTPException(status_code=404, detail="Image not found")
    image_service.delete_image(db, img)
