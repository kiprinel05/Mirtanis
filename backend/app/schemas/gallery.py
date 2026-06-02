from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.gallery import GalleryCategory


class GalleryImageOut(BaseModel):
    id: int
    title: Optional[str] = None
    url: str
    thumbnail_url: Optional[str] = None
    category: Optional[GalleryCategory] = None
    sort_order: int = 0
    is_published: bool = True
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class GalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[GalleryCategory] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None
