from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.config import settings
from app.core.deps import get_current_admin
from app.core.ratelimit import limiter
from app.core.security import create_access_token, dummy_verify, verify_password
from app.database import get_db
from app.models.user import User
from app.schemas.auth import Token, UserOut, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])


def _authenticate(db: Session, email: str, password: str) -> User:
    """Constant-time-ish auth: always run a hash verify, even for unknown users."""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        dummy_verify()  # keep timing uniform → no account enumeration
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email sau parolă greșite")
    if not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email sau parolă greșite")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cont dezactivat")
    return user


@router.post("/login", response_model=Token)
@limiter.limit("5/minute")
def login(request: Request, form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = _authenticate(db, form.username, form.password)
    token = create_access_token(subject=user.email)
    return Token(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.post("/login-json", response_model=Token)
@limiter.limit("5/minute")
def login_json(request: Request, payload: LoginRequest, db: Session = Depends(get_db)):
    user = _authenticate(db, payload.email, payload.password)
    token = create_access_token(subject=user.email)
    return Token(access_token=token, expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)


@router.get("/me", response_model=UserOut)
def me(current: User = Depends(get_current_admin)):
    return current
