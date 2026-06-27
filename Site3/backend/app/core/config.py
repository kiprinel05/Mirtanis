"""Centralised configuration loaded from environment variables.

Uses pydantic-settings so values are validated at startup, and a `.env`
file is loaded automatically in development.
"""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime settings for the Foto Bugeac gallery API."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ---- App ----
    app_name: str = "Foto Bugeac Gallery API"
    environment: str = "development"
    debug: bool = True
    api_prefix: str = "/api/v1"

    # ---- CORS ----
    # Comma-separated list of allowed origins, e.g. "http://localhost:4200,https://fotobugeac.ro"
    cors_origins: str = "http://localhost:4200"

    # ---- Database ----
    database_url: str = "sqlite:///./foto_bugeac.db"

    # ---- Security ----
    secret_key: str = Field(
        default="change-me-in-production-please-this-is-a-dev-only-default",
        min_length=16,
    )
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 12  # 12h photographer session

    # Bootstrap a default admin on first run. Set these in .env in prod.
    bootstrap_admin_email: str | None = None
    bootstrap_admin_password: str | None = None

    # ---- Cloudflare R2 ----
    r2_account_id: str | None = None
    r2_access_key_id: str | None = None
    r2_secret_access_key: str | None = None
    r2_bucket: str = "foto-bugeac"
    r2_public_base_url: str | None = None  # optional: custom domain in front of R2
    r2_endpoint_url: str | None = None  # auto-derived from account_id if absent

    # ---- Signed URL defaults ----
    preview_url_ttl_seconds: int = 60 * 60  # 1h browsing
    download_url_ttl_seconds: int = 60 * 15  # 15min click-to-download
    zip_chunk_size: int = 1024 * 64

    # ---- Upload limits ----
    max_upload_size_mb: int = 50

    # ---- SMTP / booking emails ----
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_use_tls: bool = True
    smtp_user: str | None = None
    smtp_pass: str | None = None
    smtp_from: str | None = None
    booking_recipient: str = "ciprian.dumitrasc@gmail.com"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def derived_r2_endpoint(self) -> str | None:
        if self.r2_endpoint_url:
            return self.r2_endpoint_url
        if self.r2_account_id:
            return f"https://{self.r2_account_id}.r2.cloudflarestorage.com"
        return None


@lru_cache
def get_settings() -> Settings:
    return Settings()
