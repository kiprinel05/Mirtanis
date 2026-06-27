"""SQLAlchemy ORM models for the gallery system."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base


def _utc_now() -> datetime:
    return datetime.now(tz=timezone.utc)


def _new_uuid() -> str:
    return uuid.uuid4().hex


class EventStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    EXPIRED = "expired"


class AdminUser(Base):
    """Photographer / studio operator with backend access."""

    __tablename__ = "admin_users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=_new_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str | None] = mapped_column(String(120), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utc_now, nullable=False
    )

    events: Mapped[list["Event"]] = relationship(
        back_populates="owner", cascade="all, delete-orphan"
    )


class Event(Base):
    """A photographic event with its own private gallery."""

    __tablename__ = "events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=_new_uuid)
    # `slug` is the unguessable public token shared with the client.
    # It's separate from `id` so the studio can rotate access without
    # destroying the database row.
    slug: Mapped[str] = mapped_column(String(64), unique=True, default=_new_uuid, index=True)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    client_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cover_image_key: Mapped[str | None] = mapped_column(String(512), nullable=True)

    event_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Optional password protection on top of the unguessable slug.
    access_password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)

    status: Mapped[EventStatus] = mapped_column(
        Enum(EventStatus), default=EventStatus.DRAFT, nullable=False
    )
    allow_download: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    allow_favorites: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    owner_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("admin_users.id"), nullable=False
    )
    owner: Mapped[AdminUser] = relationship(back_populates="events")

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utc_now, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utc_now, onupdate=_utc_now, nullable=False
    )

    images: Mapped[list["EventImage"]] = relationship(
        back_populates="event",
        cascade="all, delete-orphan",
        order_by="EventImage.sort_order",
    )

    @property
    def is_expired(self) -> bool:
        if self.expires_at is None:
            return False
        # SQLite (and some other backends) drop tzinfo on round-trip.
        # Normalise to UTC-aware before comparing.
        expires = self.expires_at
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return _utc_now() > expires


class EventImage(Base):
    """Metadata for a single image (image bytes live in R2)."""

    __tablename__ = "event_images"
    __table_args__ = (UniqueConstraint("event_id", "original_key"),)

    id: Mapped[str] = mapped_column(String(64), primary_key=True, default=_new_uuid)
    event_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("events.id", ondelete="CASCADE"), nullable=False, index=True
    )
    event: Mapped[Event] = relationship(back_populates="images")

    # R2 keys
    original_key: Mapped[str] = mapped_column(String(512), nullable=False)
    thumb_key: Mapped[str | None] = mapped_column(String(512), nullable=True)

    # Display
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(80), default="image/jpeg")
    size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=_utc_now, nullable=False
    )
