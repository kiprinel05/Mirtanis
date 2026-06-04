import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from sqlalchemy.exc import OperationalError

from app.api import admin, auth, bookings, calendar, contact, gallery
from app.config import settings
from app.core.ratelimit import limiter
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


def ensure_schema() -> None:
    """Lightweight, idempotent migrations for setups without Alembic."""
    from sqlalchemy import inspect, text

    inspector = inspect(engine)
    if "bookings" not in inspector.get_table_names():
        return
    columns = {c["name"] for c in inspector.get_columns("bookings")}
    if "venue" not in columns:
        logger.info("Adding missing 'venue' column to bookings")
        with engine.begin() as conn:
            conn.execute(
                text("ALTER TABLE bookings ADD COLUMN venue VARCHAR(10) NOT NULL DEFAULT 'cort'")
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        ensure_schema()
        bootstrap_admin()
    except OperationalError as e:
        logger.error("DB not reachable on startup: %s", e)
    yield


# Docs are disabled in production unless explicitly enabled.
_docs_on = settings.ENABLE_DOCS and not settings.is_production
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    debug=settings.DEBUG and not settings.is_production,
    docs_url="/api/docs" if _docs_on else None,
    redoc_url="/api/redoc" if _docs_on else None,
    openapi_url="/api/openapi.json" if _docs_on else None,
    lifespan=lifespan,
)

# ---- Rate limiting (slowapi) -------------------------------------------------
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# ---- Trusted hosts (block Host-header spoofing in production) -----------------
if settings.allowed_hosts_list:
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.allowed_hosts_list)

# ---- CORS (explicit origins only) --------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
    max_age=600,
)


# ---- Request body size cap ---------------------------------------------------
@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    # Uploads have their own streaming size check; cap everything else.
    if not request.url.path.endswith("/gallery"):
        cl = request.headers.get("content-length")
        if cl and cl.isdigit() and int(cl) > settings.MAX_REQUEST_BYTES:
            return JSONResponse(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                content={"detail": "Request body too large"},
            )
    return await call_next(request)


# ---- Security headers --------------------------------------------------------
@app.middleware("http")
async def security_headers(request: Request, call_next):
    resp: Response = await call_next(request)
    resp.headers["X-Content-Type-Options"] = "nosniff"
    resp.headers["X-Frame-Options"] = "DENY"
    resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    resp.headers["X-XSS-Protection"] = "0"
    resp.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    if settings.is_production:
        resp.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return resp


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
