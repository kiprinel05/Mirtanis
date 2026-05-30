from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.booking import EventType, BookingStatus


class BookingCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    phone: str = Field(min_length=6, max_length=40)
    email: EmailStr
    event_type: EventType
    guests: int = Field(ge=1, le=2000)
    event_date: date
    message: Optional[str] = Field(default=None, max_length=2000)


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    message: Optional[str] = None


class BookingOut(BaseModel):
    id: int
    full_name: str
    phone: str
    email: EmailStr
    event_type: EventType
    guests: int
    event_date: date
    message: Optional[str]
    status: BookingStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
