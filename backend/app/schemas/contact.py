from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class ContactCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=40)
    subject: Optional[str] = Field(default=None, max_length=255)
    message: str = Field(min_length=5, max_length=4000)


class ContactOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: Optional[str]
    subject: Optional[str]
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True
