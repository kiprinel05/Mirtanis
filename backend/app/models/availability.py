import enum
from datetime import datetime
from sqlalchemy import Column, Integer, Date, DateTime, Enum, String
from app.database import Base


class AvailabilityStatus(str, enum.Enum):
    available = "available"
    pending = "pending"
    booked = "booked"
    blocked = "blocked"


class AvailabilityDay(Base):
    """Admin-managed overrides for the public calendar.

    Anything not present here is considered `available`. Bookings (status=pending|confirmed)
    are merged on top by the calendar service.
    """

    __tablename__ = "availability"

    id = Column(Integer, primary_key=True, index=True)
    day = Column(Date, unique=True, nullable=False, index=True)
    status = Column(
        Enum(AvailabilityStatus, name="availability_status"),
        nullable=False,
        default=AvailabilityStatus.available,
    )
    note = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
