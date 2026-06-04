"""Shared rate limiter (slowapi) used across the public-facing endpoints.

Keyed by client IP. Tune the per-route limits with the decorators in the
routers (e.g. @limiter.limit("5/minute")).
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

# Sensible default cap for any route that opts in.
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])
