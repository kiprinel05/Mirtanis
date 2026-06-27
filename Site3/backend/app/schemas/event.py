from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.db.models import EventStatus


def _empty_string_to_none(value):
    """Treat an empty string as None — friendlier with HTML form payloads."""
    if isinstance(value, str) and value.strip() == "":
        return None
    return value


class EventBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    client_name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    allow_download: bool = True
    allow_favorites: bool = True

    @field_validator(
        "client_name",
        "description",
        "event_date",
        "expires_at",
        mode="before",
    )
    @classmethod
    def _blank_to_none(cls, value):
        return _empty_string_to_none(value)


class EventCreate(EventBase):
    """Payload for creating a new event."""

    access_password: Optional[str] = Field(
        None, max_length=128,
        description="Optional extra password layered on top of the slug.",
    )

    @field_validator("access_password", mode="before")
    @classmethod
    def _password_blank_to_none(cls, value):
        return _empty_string_to_none(value)


class EventUpdate(BaseModel):
    title: Optional[str] = None
    client_name: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    allow_download: Optional[bool] = None
    allow_favorites: Optional[bool] = None
    status: Optional[EventStatus] = None
    access_password: Optional[str] = None
    clear_access_password: bool = False


class EventAdminOut(EventBase):
    id: str
    slug: str
    status: EventStatus
    cover_image_key: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    image_count: int = 0
    has_password: bool = False
    is_expired: bool = False

    class Config:
        from_attributes = True


class EventListOut(BaseModel):
    items: List[EventAdminOut]
    total: int


# --- Public-facing schemas (for the shared gallery link) -------------------

class PublicEventOut(BaseModel):
    """Lean event payload safe to expose to the public gallery."""

    slug: str
    title: str
    client_name: Optional[str] = None
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    cover_url: Optional[str] = None
    allow_download: bool = True
    allow_favorites: bool = True
    image_count: int = 0
    requires_password: bool = False


class GalleryUnlockRequest(BaseModel):
    password: str = Field(..., min_length=4, max_length=128)


class GalleryUnlockResponse(BaseModel):
    access_token: str
    expires_in: int
