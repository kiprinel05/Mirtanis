"""Cloudflare R2 gallery source (S3-compatible listing).

Lists image objects in the configured R2 bucket and maps them to the same
shape the frontend already consumes (GalleryImageOut-like dicts).
"""
from __future__ import annotations

import logging
from functools import lru_cache
from typing import List

from app.config import settings

logger = logging.getLogger("mirtanis")

_IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif")


@lru_cache
def _client():
    import boto3
    from botocore.config import Config

    endpoint = f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=settings.R2_ACCESS_KEY_ID,
        aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
        region_name="auto",
        config=Config(signature_version="s3v4"),
    )


def _public_url(key: str) -> str:
    base = settings.R2_PUBLIC_BASE.rstrip("/")
    return f"{base}/{key}"


def list_gallery() -> List[dict]:
    """Return all gallery images from R2, newest first. Empty list on error."""
    try:
        client = _client()
        paginator = client.get_paginator("list_objects_v2")
        kwargs = {"Bucket": settings.R2_BUCKET}
        if settings.R2_PREFIX:
            kwargs["Prefix"] = settings.R2_PREFIX

        items: List[dict] = []
        idx = 0
        for page in paginator.paginate(**kwargs):
            for obj in page.get("Contents", []):
                key = obj["Key"]
                if key.endswith("/"):
                    continue
                if not key.lower().endswith(_IMAGE_EXT):
                    continue
                idx += 1
                items.append(
                    {
                        "id": idx,
                        "title": None,
                        "url": _public_url(key),
                        "thumbnail_url": _public_url(key),
                        "sort_order": 0,
                        "is_published": True,
                        "created_at": obj.get("LastModified"),
                        "_sort_key": obj.get("LastModified"),
                    }
                )

        # newest first
        items.sort(key=lambda i: (i["_sort_key"] is not None, i["_sort_key"]), reverse=True)
        for i in items:
            i.pop("_sort_key", None)

        return items
    except Exception as e:  # pragma: no cover - network/credentials issues
        logger.error("R2 gallery listing failed: %s", e)
        return []
