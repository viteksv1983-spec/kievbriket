"""
Cake Shop API — Main Application Entry Point.
Business logic lives in routers/, auth deps in deps.py.
"""
import sys
import os
import time
import logging

# Fix definitions for deployment: Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize logging
from backend.logging_config import setup_logging
setup_logging()
logger = logging.getLogger("cakeshop.api")

from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import models, auto_seed
from backend.database import SessionLocal, engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cake Shop API", description="API for checking and ordering cakes", version="0.2.0")


# ─── Middleware ──────────────────────────────────────────────

from starlette.middleware.base import BaseHTTPMiddleware

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000)
        logger.info("%s %s %s %dms", request.method, request.url.path, response.status_code, duration_ms)
        return response

class CacheHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.startswith("/products") and request.method == "GET":
            response.headers["Cache-Control"] = "public, max-age=300"
            response.headers["Vary"] = "Accept-Encoding"
        elif path.startswith("/static/"):
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(CacheHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Static Files ───────────────────────────────────────────

STATIC_DIR = Path(__file__).parent / "static"
MEDIA_DIR = Path(__file__).parent / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

class CachedStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/media", CachedStaticFiles(directory=str(MEDIA_DIR)), name="media")


# ─── Include Routers ────────────────────────────────────────

from backend.routers import products, orders, auth as auth_router, admin

app.include_router(products.router)
app.include_router(orders.router)
app.include_router(auth_router.router)
app.include_router(admin.router)


# ─── Startup ────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    logger.info("Application startup — seeding database if empty")
    db = SessionLocal()
    try:
        auto_seed.check_and_seed_data(db)
        logger.info("Database seed check complete")
    except Exception as e:
        logger.error("Failed to seed database: %s", e)
    finally:
        db.close()


# ─── Root / Health ───────────────────────────────────────────

@app.get("/")
def read_root():
    return {"message": "Welcome to Cake Shop API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/health-check")
async def detailed_health_check(db: Session = Depends(get_db)):
    product_count = db.query(models.Product).count()
    pages_count = db.query(models.Page).count()
    return {
        "status": "online",
        "database": "connected",
        "products_count": product_count,
        "pages_count": pages_count,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
