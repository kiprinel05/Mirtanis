"""Server-side ZIP streaming for 'download all / download selected'.

We never load the full ZIP into memory — `zipstream-ng` yields chunks
as it pulls each R2 object, so we can stream gigabytes through FastAPI
without exhausting RAM.
"""

from __future__ import annotations

import logging
import re
from collections.abc import Iterator, Sequence

from zipstream import ZIP_DEFLATED, ZipStream

from app.core.config import get_settings
from app.core.r2 import get_r2
from app.db.models import EventImage

logger = logging.getLogger(__name__)

_FILENAME_SAFE = re.compile(r"[^A-Za-z0-9._-]+")


def _safe_filename(name: str) -> str:
    """Strip path separators / sketchy chars from output filenames."""
    cleaned = _FILENAME_SAFE.sub("_", name)
    return cleaned or "image"


def stream_event_zip(images: Sequence[EventImage]) -> Iterator[bytes]:
    """Yield ZIP chunks containing every image's original."""
    settings = get_settings()
    storage = get_r2()

    z = ZipStream(compress_type=ZIP_DEFLATED, sized=False)

    # Pre-load all entries; the iterable bodies are streamed lazily.
    used_names: dict[str, int] = {}
    for img in images:
        base = _safe_filename(img.filename)
        # de-dupe identical filenames
        count = used_names.get(base, 0)
        used_names[base] = count + 1
        out_name = base if count == 0 else f"{count}_{base}"

        z.add(
            data=_chunk_iter(storage, img.original_key, settings.zip_chunk_size),
            arcname=out_name,
        )

    yield from z


def _chunk_iter(storage, key: str, chunk_size: int) -> Iterator[bytes]:
    try:
        yield from storage.iter_chunks(key, chunk_size)
    except Exception:
        logger.exception("ZIP chunk read failed for %s — skipping object", key)
        return
