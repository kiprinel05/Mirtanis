"""Shared FastAPI dependencies — auth + DB session."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import JWTError, decode_token
from app.db.database import get_db
from app.db.models import AdminUser, Event
from app.services import event_service

_bearer = HTTPBearer(auto_error=False)


def get_current_admin(
    creds: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[Session, Depends(get_db)],
) -> AdminUser:
    if creds is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = decode_token(creds.credentials)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {exc}",
        ) from exc

    if payload.get("type") != "admin":
        raise HTTPException(status_code=403, detail="Not an admin token")

    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Token missing subject")

    user = db.get(AdminUser, sub)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive or unknown admin")
    return user


CurrentAdmin = Annotated[AdminUser, Depends(get_current_admin)]
DB = Annotated[Session, Depends(get_db)]


def get_owned_event(event_id: str, db: DB, admin: CurrentAdmin) -> Event:
    event = event_service.get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.owner_id != admin.id:
        raise HTTPException(status_code=403, detail="Not your event")
    return event


OwnedEvent = Annotated[Event, Depends(get_owned_event)]
