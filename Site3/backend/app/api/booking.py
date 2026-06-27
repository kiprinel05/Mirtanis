"""Public booking endpoint — receives the contact form and emails the studio."""

import logging

from fastapi import APIRouter, HTTPException, status

from app.schemas.booking import BookingRequest, BookingResponse
from app.services.email_service import send_booking_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/booking", tags=["booking"])


@router.post("", response_model=BookingResponse)
def create_booking(payload: BookingRequest) -> BookingResponse:
    """Validate + ship the booking email."""
    try:
        send_booking_email(
            name=payload.name,
            email=str(payload.email),
            phone=payload.phone,
            service=payload.service,
            message=payload.message,
            preferred_date_iso=(
                payload.preferred_date.isoformat()
                if payload.preferred_date
                else None
            ),
        )
    except RuntimeError as exc:
        logger.error("Booking failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    return BookingResponse(
        ok=True,
        message="Cererea a fost trimisă cu succes.",
    )
