from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


ServiceType = Literal[
    "wedding", "baptism", "event", "studio", "fashion", "other"
]


class BookingRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=40)
    service: ServiceType
    message: str = Field(..., min_length=10, max_length=4000)
    preferred_date: Optional[datetime] = Field(
        None,
        description="Optional date picked in the booking calendar.",
    )


class BookingResponse(BaseModel):
    ok: bool
    message: str
