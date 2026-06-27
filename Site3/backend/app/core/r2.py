"""Cloudflare R2 client wrapper.

R2 is S3-compatible, so we use boto3 with custom endpoint and the
`auto` region. The wrapper exposes the few operations the gallery
system needs:

* upload an object stream
* delete an object
* generate a presigned GET URL (for previews + downloads)
* iterate objects under a prefix (for bulk ops)
* fetch an object stream (for server-side ZIP generation)
"""

from __future__ import annotations

import io
import logging
from contextlib import contextmanager
from typing import BinaryIO, Iterable, Iterator

import boto3
from botocore.client import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.core.config import get_settings

logger = logging.getLogger(__name__)


class R2Storage:
    """Thin S3 wrapper specialised for Cloudflare R2."""

    def __init__(self) -> None:
        self._settings = get_settings()
        self._client = None  # lazily created — keeps unit tests cheap

    # ---------------------------------------------------------- internals --
    @property
    def client(self):
        if self._client is None:
            endpoint = self._settings.derived_r2_endpoint
            if not endpoint:
                raise RuntimeError(
                    "Cloudflare R2 is not configured. Set R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + "
                    "R2_SECRET_ACCESS_KEY in your .env."
                )
            self._client = boto3.client(
                "s3",
                endpoint_url=endpoint,
                aws_access_key_id=self._settings.r2_access_key_id,
                aws_secret_access_key=self._settings.r2_secret_access_key,
                region_name="auto",
                config=Config(
                    signature_version="s3v4",
                    retries={"max_attempts": 3, "mode": "standard"},
                ),
            )
        return self._client

    @property
    def bucket(self) -> str:
        return self._settings.r2_bucket

    # ---------------------------------------------------------- operations --
    def upload_fileobj(
        self,
        fileobj: BinaryIO,
        key: str,
        content_type: str | None = None,
    ) -> None:
        """Stream an object up to R2 under the given key."""
        extra: dict = {}
        if content_type:
            extra["ContentType"] = content_type
        try:
            self.client.upload_fileobj(
                Fileobj=fileobj,
                Bucket=self.bucket,
                Key=key,
                ExtraArgs=extra or None,
            )
        except (BotoCoreError, ClientError) as exc:
            logger.exception("R2 upload failed for %s", key)
            raise RuntimeError(f"R2 upload failed: {exc}") from exc

    def upload_bytes(
        self,
        data: bytes,
        key: str,
        content_type: str | None = None,
    ) -> None:
        self.upload_fileobj(io.BytesIO(data), key, content_type)

    def delete_object(self, key: str) -> None:
        try:
            self.client.delete_object(Bucket=self.bucket, Key=key)
        except (BotoCoreError, ClientError) as exc:
            logger.warning("R2 delete failed for %s: %s", key, exc)

    def delete_prefix(self, prefix: str) -> None:
        """Recursively delete everything under a prefix (event teardown)."""
        paginator = self.client.get_paginator("list_objects_v2")
        for page in paginator.paginate(Bucket=self.bucket, Prefix=prefix):
            contents = page.get("Contents") or []
            if not contents:
                continue
            objects = [{"Key": item["Key"]} for item in contents]
            try:
                self.client.delete_objects(
                    Bucket=self.bucket,
                    Delete={"Objects": objects, "Quiet": True},
                )
            except (BotoCoreError, ClientError) as exc:
                logger.warning("R2 bulk delete failed under %s: %s", prefix, exc)

    def presigned_get(
        self,
        key: str,
        expires_in: int,
        download_filename: str | None = None,
    ) -> str:
        """Return a temporary signed GET URL.

        If `download_filename` is set, the response is forced to
        Content-Disposition: attachment so browsers trigger a save.
        """
        params: dict = {"Bucket": self.bucket, "Key": key}
        if download_filename:
            safe = download_filename.replace('"', "")
            params["ResponseContentDisposition"] = (
                f'attachment; filename="{safe}"'
            )
        try:
            return self.client.generate_presigned_url(
                "get_object",
                Params=params,
                ExpiresIn=expires_in,
            )
        except (BotoCoreError, ClientError) as exc:
            logger.exception("Presign failed for %s", key)
            raise RuntimeError(f"R2 presign failed: {exc}") from exc

    @contextmanager
    def stream(self, key: str) -> Iterator[BinaryIO]:
        """Stream an object body for server-side processing (ZIP)."""
        try:
            obj = self.client.get_object(Bucket=self.bucket, Key=key)
        except (BotoCoreError, ClientError) as exc:
            logger.exception("R2 fetch failed for %s", key)
            raise RuntimeError(f"R2 fetch failed: {exc}") from exc
        body = obj["Body"]
        try:
            yield body
        finally:
            body.close()

    def iter_chunks(self, key: str, chunk_size: int) -> Iterable[bytes]:
        with self.stream(key) as body:
            while True:
                chunk = body.read(chunk_size)
                if not chunk:
                    break
                yield chunk


_storage: R2Storage | None = None


def get_r2() -> R2Storage:
    """Return a process-wide R2 client singleton."""
    global _storage
    if _storage is None:
        _storage = R2Storage()
    return _storage
