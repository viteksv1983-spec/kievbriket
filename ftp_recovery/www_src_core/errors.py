"""
Central error handler — unified error structure for all API responses.
Catches unhandled exceptions and returns consistent JSON format.
"""
import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("cakeshop.errors")


def setup_error_handlers(app: FastAPI):
    """Register all error handlers on the app. Call once in main.py."""

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        """Handle known HTTP errors (404, 403, 401, etc.)."""
        logger.warning(
            "HTTP %d: %s — %s %s",
            exc.status_code, exc.detail, request.method, request.url.path
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": True,
                "status": exc.status_code,
                "message": exc.detail or "Error",
                "path": request.url.path,
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        """Handle Pydantic validation errors (422)."""
        errors = []
        for err in exc.errors():
            field = ".".join(str(loc) for loc in err.get("loc", []))
            errors.append({"field": field, "message": err.get("msg", "")})

        logger.warning("Validation error on %s %s: %s", request.method, request.url.path, errors)

        return JSONResponse(
            status_code=422,
            content={
                "error": True,
                "status": 422,
                "message": "Validation error",
                "details": errors,
                "path": request.url.path,
            },
        )

    @app.exception_handler(Exception)
    async def unhandled_exception_handler(request: Request, exc: Exception):
        """Catch-all for unhandled exceptions (500)."""
        logger.error(
            "Unhandled exception on %s %s: %s\n%s",
            request.method, request.url.path, str(exc), traceback.format_exc()
        )
        return JSONResponse(
            status_code=500,
            content={
                "error": True,
                "status": 500,
                "message": "Internal server error",
                "traceback": traceback.format_exc(),
                "path": request.url.path,
            },
        )
