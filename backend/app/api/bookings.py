from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.core.ratelimit import limiter
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.availability import AvailabilityDay, AvailabilityStatus
from app.schemas.booking import BookingCreate, BookingOut, BookingUpdate

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.post("", response_model=BookingOut, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute;20/day")
def create_booking(request: Request, payload: BookingCreate, db: Session = Depends(get_db)):
    if payload.event_date < date.today():
        raise HTTPException(status_code=400, detail="Data trebuie să fie în viitor")

    block = (
        db.query(AvailabilityDay)
        .filter(
            AvailabilityDay.day == payload.event_date,
            AvailabilityDay.status.in_([AvailabilityStatus.booked, AvailabilityStatus.blocked]),
        )
        .first()
    )
    if block:
        raise HTTPException(status_code=409, detail="Data nu este disponibilă")

    confirmed = (
        db.query(Booking)
        .filter(Booking.event_date == payload.event_date, Booking.status == BookingStatus.confirmed)
        .first()
    )
    if confirmed:
        raise HTTPException(status_code=409, detail="Data este deja rezervată")

    booking = Booking(**payload.model_dump(), status=BookingStatus.pending)
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("", response_model=List[BookingOut])
def list_bookings(
    status_filter: Optional[BookingStatus] = Query(default=None, alias="status"),
    start: Optional[date] = None,
    end: Optional[date] = None,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    q = db.query(Booking)
    if status_filter:
        q = q.filter(Booking.status == status_filter)
    if start:
        q = q.filter(Booking.event_date >= start)
    if end:
        q = q.filter(Booking.event_date <= end)
    return q.order_by(Booking.event_date.asc()).all()


@router.patch("/{booking_id}", response_model=BookingOut)
def update_booking(
    booking_id: int,
    payload: BookingUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu există")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(booking, field, value)
    db.commit()
    db.refresh(booking)
    return booking


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=404, detail="Rezervarea nu există")
    db.delete(booking)
    db.commit()
