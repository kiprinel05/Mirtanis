import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean


from app.database import Base


class GalleryCategory(str, enum.Enum):
    nunti = "nunti"
    botezuri = "botezuri"
    petreceri = "petreceri"
    exterior = "exterior"
    lac = "lac"
    cort = "cort"
    sala = "sala"


class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)
    category = Column(Enum(GalleryCategory, name="gallery_category"), nullable=False)
    sort_order = Column(Integer, default=0, nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
