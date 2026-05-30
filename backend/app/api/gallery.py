import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.config import settings
from app.core.deps import get_current_admin
from app.database import get_db
from app.models.gallery import GalleryCategory, GalleryImage
from app.schemas.gallery import GalleryImageOut, GalleryImageUpdate

router = APIRouter(prefix="/gallery", tags=["gallery"])

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp", ".avif"}


@router.get("", response_model=List[GalleryImageOut])
def list_images(
    category: Optional[GalleryCategory] = None,
    db: Session = Depends(get_db),
):
    q = db.query(GalleryImage).filter(GalleryImage.is_published == True)  # noqa: E712
    if category:
        q = q.filter(GalleryImage.category == category)
    return q.order_by(GalleryImage.sort_order.asc(), GalleryImage.created_at.desc()).all()


@router.get("/admin", response_model=List[GalleryImageOut])
def list_all(db: Session = Depends(get_db), _: object = Depends(get_current_admin)):
    return (
        db.query(GalleryImage)
        .order_by(GalleryImage.category.asc(), GalleryImage.sort_order.asc())
        .all()
    )


@router.post("", response_model=GalleryImageOut, status_code=status.HTTP_201_CREATED)
async def upload_image(
    file: UploadFile = File(...),
    category: GalleryCategory = Form(...),
    title: Optional[str] = Form(default=None),
    sort_order: int = Form(default=0),
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXT:
        raise HTTPException(status_code=400, detail=f"Extensia {ext} nu este permisă")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    name = f"{uuid.uuid4().hex}{ext}"
    path = os.path.join(settings.UPLOAD_DIR, name)
    size = 0
    with open(path, "wb") as out:
        while chunk := await file.read(1024 * 1024):
            size += len(chunk)
            if size > settings.MAX_UPLOAD_MB * 1024 * 1024:
                out.close()
                os.remove(path)
                raise HTTPException(status_code=413, detail="Fișier prea mare")
            out.write(chunk)

    url = f"/uploads/{name}"
    img = GalleryImage(
        title=title, url=url, thumbnail_url=url, category=category, sort_order=sort_order
    )
    db.add(img)
    db.commit()
    db.refresh(img)
    return img


@router.patch("/{image_id}", response_model=GalleryImageOut)
def update_image(
    image_id: int,
    payload: GalleryImageUpdate,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    img = db.get(GalleryImage, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Imaginea nu există")
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(img, field, value)
    db.commit()
    db.refresh(img)
    return img


@router.delete("/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    _: object = Depends(get_current_admin),
):
    img = db.get(GalleryImage, image_id)
    if not img:
        raise HTTPException(status_code=404, detail="Imaginea nu există")
    try:
        local = img.url.replace("/uploads/", "", 1)
        path = os.path.join(settings.UPLOAD_DIR, local)
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass
    db.delete(img)
    db.commit()
