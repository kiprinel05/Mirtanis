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

    ADMIN_EMAIL: str = "admin@mirtanis.ro"
    ADMIN_PASSWORD: str = "ChangeMeNow!2026"

    CORS_ORIGINS: str = "http://localhost:4200"

    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_MB: int = 15

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
    def r2_enabled(self) -> bool:
        return bool(
            self.R2_ACCOUNT_ID
            and self.R2_ACCESS_KEY_ID
            and self.R2_SECRET_ACCESS_KEY
            and self.R2_BUCKET
            and self.R2_PUBLIC_BASE
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
