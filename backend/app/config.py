from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    APP_NAME: str = "Mirtanis Events API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "postgresql+psycopg2://mirtanis:mirtanis@db:5432/mirtanis_events"

    JWT_SECRET_KEY: str = "change-me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 720

    ADMIN_EMAIL: str = "admin@mirtanisevents.ro"
    ADMIN_PASSWORD: str = "ChangeMeNow!2026"

    CORS_ORIGINS: str = "http://localhost:4200"
    # Comma-separated Host header allow-list for production (TrustedHostMiddleware).
    # Empty = allow any (fine behind a trusted reverse proxy in dev).
    ALLOWED_HOSTS: str = ""

    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 15
    # Hard cap on request body size (bytes) to blunt memory-exhaustion attacks.
    MAX_REQUEST_BYTES: int = 1_000_000  # 1 MB for JSON APIs (uploads handled separately)

    # Expose interactive API docs only when explicitly enabled (off in prod).
    ENABLE_DOCS: bool = False

    # --- Cloudflare R2 (S3-compatible) gallery source ---
    # When all of these are set, the public gallery is served from the R2
    # bucket instead of the local DB. Images may be organised in folders named
    # after a category (e.g. "nunti/photo.jpg") to enable filtering.
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET: str = ""
    R2_PUBLIC_BASE: str = ""   # e.g. https://pub-xxxx.r2.dev or https://galerie.mirtanis.ro
    R2_PREFIX: str = ""        # optional sub-folder to list, e.g. "gallery/"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]

    @property
    def allowed_hosts_list(self) -> List[str]:
        return [h.strip() for h in self.ALLOWED_HOSTS.split(",") if h.strip()]

    @property
    def is_production(self) -> bool:
        return self.APP_ENV.lower() in {"production", "prod"}

    @property
    def r2_enabled(self) -> bool:
        return bool(
            self.R2_ACCOUNT_ID
            and self.R2_ACCESS_KEY_ID
            and self.R2_SECRET_ACCESS_KEY
            and self.R2_BUCKET
            and self.R2_PUBLIC_BASE
        )


_WEAK_SECRETS = {"", "change-me", "changeme", "secret", "dev-secret-change-me"}


def _validate(s: Settings) -> Settings:
    """Refuse to boot a production server with insecure defaults."""
    if s.is_production:
        problems = []
        if s.JWT_SECRET_KEY in _WEAK_SECRETS or len(s.JWT_SECRET_KEY) < 32:
            problems.append("JWT_SECRET_KEY is weak/unset (use a long random value)")
        if s.ADMIN_PASSWORD in {"", "ChangeMeNow!2026", "admin", "admin1234", "parolaputernica"}:
            problems.append("ADMIN_PASSWORD is a known default — change it")
        if not s.cors_origins_list or "*" in s.CORS_ORIGINS:
            problems.append("CORS_ORIGINS must list explicit production origins (no '*')")
        if problems:
            raise RuntimeError(
                "Insecure production configuration:\n  - " + "\n  - ".join(problems)
            )
    return s


@lru_cache
def get_settings() -> Settings:
    return _validate(Settings())


settings = get_settings()
