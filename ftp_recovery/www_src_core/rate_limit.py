"""
Rate Limiter — protects critical endpoints from abuse.
Uses slowapi (based on limits library) with in-memory storage.

Integration in main.py is done via `app.state.limiter` and error handler.
Individual routes use `@limiter.limit("5/minute")` decorator.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from fastapi import Request
from fastapi.responses import JSONResponse

from backend.src.core.config import settings


# Create limiter instance — uses in-memory storage (no Redis needed)
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.rate_limit_default],
)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    """Custom handler for 429 Too Many Requests."""
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limit_exceeded",
            "detail": f"Too many requests. Limit: {exc.detail}",
        },
    )
