from datetime import date, timedelta
from typing import Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.availability import AvailabilityDay, AvailabilityStatus
from app.models.booking import Booking, BookingStatus
from app.schemas.calendar import AvailabilityUpdate, CalendarRange, DayStatus

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("", response_model=CalendarRange)
def get_calendar(
    start: date = Query(...),
    end: date = Query(...),
    db: Session = Depends(get_db),
):
    if end < start:
        raise HTTPException(status_code=400, detail="`end` trebuie să fie >= `start`")
    if (end - start).days > 400:
        raise HTTPException(status_code=400, detail="Interval prea mare")

    overrides: Dict[date, AvailabilityDay] = {
        a.day: a
        for a in db.query(AvailabilityDay)
        .filter(AvailabilityDay.day >= start, AvailabilityDay.day <= end)
        .all()
    }

    confirmed_dates = {
        b.event_date
        for b in db.query(Booking)
        .filter(
            Booking.event_date >= start,
            Booking.event_date <= end,
            Booking.status == BookingStatus.confirmed,
        )
        .all()
    }
    pending_dates = {
        b.event_date
        for b in db.query(Booking)
        .filter(
            Booking.event_date >= start,
            Booking.event_date <= end,
            Booking.status == BookingStatus.pending,
        )
        .all()
    }

    days = []
    current = start
    while current <= end:
        note = None
        if current in overrides:
            ov = overrides[current]
            status_ = ov.status
            note = ov.note
        elif current in confirmed_dates:
            status_ = AvailabilityStatus.booked
        elif current in pending_dates:
            status_ = AvailabilityStatus.pending
        else:
            status_ = AvailabilityStatus.available
        days.append(DayStatus(day=current, status=status_, note=note))
        current += timedelta(days=1)

    return CalendarRange(start=start, end=end, days=days)


@router.post("/availability", response_model=DayStatus)
def upsert_availability(
    payload: AvailabilityUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    row = db.query(AvailabilityDay).filter(AvailabilityDay.day == payload.day).first()
    if not row:
        row = AvailabilityDay(day=payload.day, status=payload.status, note=payload.note)
        db.add(row)
    else:
        row.status = payload.status
        row.note = payload.note
    db.commit()
    db.refresh(row)
    return DayStatus(day=row.day, status=row.status, note=row.note)


@router.delete("/availability/{day}")
def clear_availability(
    day: date,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    row = db.query(AvailabilityDay).filter(AvailabilityDay.day == day).first()
    if row:
        db.delete(row)
        db.commit()
    return {"ok": True}
