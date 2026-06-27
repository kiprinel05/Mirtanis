"""JWT + password hashing helpers.

Uses `bcrypt` directly instead of passlib — passlib 1.7.4 is
incompatible with bcrypt ≥ 4.1 on Python 3.12+ (its internal probe
uses a > 72-byte password which newer bcrypt rejects outright).
"""

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
from jose import JWTError, jwt

from app.core.config import get_settings

_settings = get_settings()

# bcrypt's hard limit. Anything beyond is silently ignored anyway —
# we truncate explicitly so newer bcrypt versions don't raise.
_BCRYPT_MAX_BYTES = 72


def _truncate(plain: str) -> bytes:
    return plain.encode("utf-8")[:_BCRYPT_MAX_BYTES]


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(_truncate(plain), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(_truncate(plain), hashed.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def create_access_token(
    subject: str,
    expires_minutes: int | None = None,
    extra: dict[str, Any] | None = None,
) -> str:
    """Sign a JWT for the admin session."""
    now = datetime.now(tz=timezone.utc)
    expires = now + timedelta(
        minutes=expires_minutes or _settings.access_token_expire_minutes
    )
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": int(now.timestamp()),
        "exp": int(expires.timestamp()),
        "type": "admin",
    }
    if extra:
        payload.update(extra)
    return jwt.encode(payload, _settings.secret_key, algorithm=_settings.jwt_algorithm)


def decode_token(token: str) -> dict[str, Any]:
    """Decode a JWT, raising JWTError if invalid/expired."""
    return jwt.decode(token, _settings.secret_key, algorithms=[_settings.jwt_algorithm])


__all__ = [
    "hash_password",
    "verify_password",
    "create_access_token",
    "decode_token",
    "JWTError",
]
