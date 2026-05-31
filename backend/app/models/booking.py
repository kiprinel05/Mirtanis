import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, Text, Enum, Index
from app.database import Base


class EventType(str, enum.Enum):
    nunta = "nunta"
    botez = "botez"
    cununie = "cununie"
    aniversare = "aniversare"
    corporate = "corporate"
    private = "private"
    garden = "garden"
    altul = "altul"


class BookingStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    rejected = "rejected"
    cancelled = "cancelled"


class Venue(str, enum.Enum):
    cort = "cort"
    sala = "sala"


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(40), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    event_type = Column(Enum(EventType, name="event_type"), nullable=False)
    venue = Column(Enum(Venue, name="venue"), nullable=False, server_default=Venue.cort.value)
    guests = Column(Integer, nullable=False, default=0)
    event_date = Column(Date, nullable=False, index=True)
    message = Column(Text, nullable=True)
    status = Column(
        Enum(BookingStatus, name="booking_status"),
        nullable=False,
        default=BookingStatus.pending,
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (Index("ix_bookings_date_status", "event_date", "status"),)
