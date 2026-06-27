"""FastAPI entry point for the Foto Bugeac gallery API."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.api import auth, booking, events, gallery
from app.core.config import get_settings
from app.core.security import hash_password
from app.db.database import SessionLocal, init_db
from app.db.models import AdminUser

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("foto_bugeac.api")


def _bootstrap_admin() -> None:
    """Create the first admin if .env provides credentials and the DB is empty."""
    settings = get_settings()
    if not (settings.bootstrap_admin_email and settings.bootstrap_admin_password):
        return
    with SessionLocal() as db:
        existing = db.scalar(select(AdminUser).limit(1))
        if existing:
            return
        admin = AdminUser(
            email=settings.bootstrap_admin_email.lower(),
            password_hash=hash_password(settings.bootstrap_admin_password),
            display_name="Studio Owner",
        )
        db.add(admin)
        db.commit()
        logger.info("Bootstrapped admin user: %s", admin.email)


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    _bootstrap_admin()
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="1.0.0",
        debug=settings.debug,
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url=None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Content-Disposition"],
    )

    @app.get("/health", tags=["meta"])
    def health() -> dict[str, str]:
        return {"status": "ok", "environment": settings.environment}

    app.include_router(auth.router, prefix=settings.api_prefix)
    app.include_router(events.router, prefix=settings.api_prefix)
    app.include_router(gallery.router, prefix=settings.api_prefix)
    app.include_router(booking.router, prefix=settings.api_prefix)

    return app


app = create_app()
