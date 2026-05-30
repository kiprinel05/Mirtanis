import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import OperationalError

from app.api import admin, auth, bookings, calendar, contact, gallery
from app.config import settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.user import User

logger = logging.getLogger("mirtanis")
logging.basicConfig(level=logging.INFO)


def bootstrap_admin() -> None:
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if not existing:
            db.add(
                User(
                    email=settings.ADMIN_EMAIL,
                    full_name="Mirtanis Admin",
                    hashed_password=hash_password(settings.ADMIN_PASSWORD),
                    is_admin=True,
                    is_active=True,
                )
            )
            db.commit()
            logger.info("Admin user bootstrapped: %s", settings.ADMIN_EMAIL)
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        bootstrap_admin()
    except OperationalError as e:
        logger.error("DB not reachable on startup: %s", e)
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    debug=settings.DEBUG,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

prefix = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=prefix)
app.include_router(bookings.router, prefix=prefix)
app.include_router(calendar.router, prefix=prefix)
app.include_router(contact.router, prefix=prefix)
app.include_router(gallery.router, prefix=prefix)
app.include_router(admin.router, prefix=prefix)


@app.get("/api/health", tags=["meta"])
def health():
    return {"status": "ok", "app": settings.APP_NAME, "env": settings.APP_ENV}
