"""Admin authentication endpoints."""

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.api.deps import CurrentAdmin, DB
from app.core.config import get_settings
from app.core.security import create_access_token, verify_password
from app.db.models import AdminUser
from app.schemas.auth import AdminProfile, LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: DB) -> TokenResponse:
    user = db.scalar(select(AdminUser).where(AdminUser.email == payload.email))
    if not user or not user.is_active or not verify_password(
        payload.password, user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    settings = get_settings()
    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        expires_in=settings.access_token_expire_minutes * 60,
        admin_email=user.email,
    )


@router.get("/me", response_model=AdminProfile)
def me(admin: CurrentAdmin) -> AdminProfile:
    return AdminProfile.model_validate(admin)
