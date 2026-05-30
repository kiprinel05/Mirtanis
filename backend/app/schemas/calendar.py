from datetime import date
from typing import List, Optional
from pydantic import BaseModel
from app.models.availability import AvailabilityStatus


class DayStatus(BaseModel):
    day: date
    status: AvailabilityStatus
    note: Optional[str] = None


class CalendarRange(BaseModel):
    start: date
    end: date
    days: List[DayStatus]


class AvailabilityUpdate(BaseModel):
    day: date
    status: AvailabilityStatus
    note: Optional[str] = None
