from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class ImageBase(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    width: Optional[int] = None
    height: Optional[int] = None


class ImageAdminOut(ImageBase):
    id: str
    event_id: str
    original_key: str
    thumb_key: Optional[str] = None
    sort_order: int = 0
    created_at: datetime
    preview_url: Optional[str] = None
    thumb_url: Optional[str] = None

    class Config:
        from_attributes = True


class GalleryImageOut(BaseModel):
    """Public-facing image payload — only signed URLs leak to the client."""

    id: str
    filename: str
    width: Optional[int] = None
    height: Optional[int] = None
    size_bytes: int
    preview_url: str
    thumb_url: str
    download_url: Optional[str] = None

    class Config:
        from_attributes = True


class BulkUploadResult(BaseModel):
    uploaded: List[ImageAdminOut]
    failed: List[str] = []


class ImageReorderRequest(BaseModel):
    """Body for PATCH /events/{id}/images/reorder."""

    ordered_ids: List[str]


class BulkDownloadRequest(BaseModel):
    """Subset of image IDs to bundle into a ZIP. Empty = all."""

    image_ids: List[str] = []
