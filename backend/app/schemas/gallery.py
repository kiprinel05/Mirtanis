from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.gallery import GalleryCategory


class GalleryImageOut(BaseModel):
    id: int
    title: Optional[str]
    url: str
    thumbnail_url: Optional[str]
    category: GalleryCategory
    sort_order: int
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True


class GalleryImageUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[GalleryCategory] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None
