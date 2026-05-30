from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_admin
from app.database import get_db
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate, ContactOut

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
def create_message(payload: ContactCreate, db: Session = Depends(get_db)):
    msg = ContactMessage(**payload.model_dump())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg


@router.get("", response_model=List[ContactOut])
def list_messages(db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.patch("/{msg_id}/read", response_model=ContactOut)
def mark_read(msg_id: int, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    msg = db.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Mesajul nu există")
    msg.is_read = True
    db.commit()
    db.refresh(msg)
    return msg


@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(msg_id: int, db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    msg = db.get(ContactMessage, msg_id)
    if not msg:
        raise HTTPException(status_code=404, detail="Mesajul nu există")
    db.delete(msg)
    db.commit()
