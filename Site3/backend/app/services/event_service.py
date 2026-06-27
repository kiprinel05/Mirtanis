"""Event-level business logic."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Iterable, Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.r2 import get_r2
from app.core.security import hash_password
from app.db.models import AdminUser, Event, EventImage, EventStatus
from app.schemas.event import EventCreate, EventUpdate


def _utcnow() -> datetime:
    return datetime.now(tz=timezone.utc)


def create_event(db: Session, owner: AdminUser, payload: EventCreate) -> Event:
    event = Event(
        title=payload.title,
        client_name=payload.client_name,
        description=payload.description,
        event_date=payload.event_date,
        expires_at=payload.expires_at,
        allow_download=payload.allow_download,
        allow_favorites=payload.allow_favorites,
        owner_id=owner.id,
        slug=uuid.uuid4().hex,
        status=EventStatus.DRAFT,
    )
    if payload.access_password:
        event.access_password_hash = hash_password(payload.access_password)
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def update_event(
    db: Session, event: Event, payload: EventUpdate
) -> Event:
    data = payload.model_dump(exclude_unset=True, exclude={"access_password", "clear_access_password"})
    for k, v in data.items():
        setattr(event, k, v)

    if payload.clear_access_password:
        event.access_password_hash = None
    elif payload.access_password:
        event.access_password_hash = hash_password(payload.access_password)

    event.updated_at = _utcnow()
    db.commit()
    db.refresh(event)
    return event


def delete_event(db: Session, event: Event) -> None:
    """Hard-delete the event row and every related R2 object."""
    storage = get_r2()
    storage.delete_prefix(f"event/{event.id}/")
    db.delete(event)
    db.commit()


def list_events_for_owner(
    db: Session, owner: AdminUser, limit: int = 50, offset: int = 0
) -> tuple[list[Event], int]:
    stmt = (
        select(Event)
        .where(Event.owner_id == owner.id)
        .order_by(Event.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    items = list(db.scalars(stmt).all())
    total = db.scalar(
        select(func.count()).select_from(Event).where(Event.owner_id == owner.id)
    ) or 0
    return items, int(total)


def get_event_by_id(db: Session, event_id: str) -> Optional[Event]:
    return db.get(Event, event_id)


def get_event_by_slug(db: Session, slug: str) -> Optional[Event]:
    return db.scalar(select(Event).where(Event.slug == slug))


def regenerate_slug(db: Session, event: Event) -> Event:
    """Rotate the public link — instantly revokes anyone who had the old one."""
    event.slug = uuid.uuid4().hex
    event.updated_at = _utcnow()
    db.commit()
    db.refresh(event)
    return event


def count_images(db: Session, event: Event) -> int:
    return int(
        db.scalar(
            select(func.count()).select_from(EventImage).where(
                EventImage.event_id == event.id
            )
        )
        or 0
    )


def is_publicly_accessible(event: Event) -> bool:
    # Compare on the underlying string value so both `EventStatus.PUBLISHED`
    # and the raw "published" string (e.g. after `setattr` from a dumped
    # Pydantic model) are treated identically.
    status_value = getattr(event.status, "value", str(event.status))
    if status_value != EventStatus.PUBLISHED.value:
        return False
    if event.is_expired:
        return False
    return True
