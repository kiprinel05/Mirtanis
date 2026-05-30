from datetime import date, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.booking import Booking, BookingStatus
from app.models.contact import ContactMessage
from app.models.gallery import GalleryImage

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    today = date.today()
    in_30 = today + timedelta(days=30)

    return {
        "bookings": {
            "total": db.query(func.count(Booking.id)).scalar() or 0,
            "pending": db.query(func.count(Booking.id)).filter(Booking.status == BookingStatus.pending).scalar() or 0,
            "confirmed": db.query(func.count(Booking.id)).filter(Booking.status == BookingStatus.confirmed).scalar() or 0,
            "upcoming_30d": db.query(func.count(Booking.id))
            .filter(Booking.event_date >= today, Booking.event_date <= in_30)
            .scalar()
            or 0,
        },
        "messages": {
            "total": db.query(func.count(ContactMessage.id)).scalar() or 0,
            "unread": db.query(func.count(ContactMessage.id)).filter(ContactMessage.is_read == False).scalar() or 0,  # noqa: E712
        },
        "gallery": {
            "total": db.query(func.count(GalleryImage.id)).scalar() or 0,
            "published": db.query(func.count(GalleryImage.id)).filter(GalleryImage.is_published == True).scalar() or 0,  # noqa: E712
        },
    }
