"""
KievBriket API — Main Application Entry Point.
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
logger = logging.getLogger("kievbriket.api")

from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import auto_seed
from backend.src.core.database import SessionLocal, engine, get_db, Base
from backend.src.users.models import User
from backend.src.products.models import Product, CategoryMetadata
from backend.src.orders.models import Order, OrderItem, OrderStatusHistory
from backend.src.pages.models import Page
from backend.src.admin.models import TelegramSettings

# Create tables
Base.metadata.create_all(bind=engine)

from backend.src.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="API для замовлення дров, брикетів та вугілля з доставкою по Київській області",
    version=settings.app_version,
)

# ─── Error Handlers ─────────────────────────────────────────
from backend.src.core.errors import setup_error_handlers
setup_error_handlers(app)


# ─── Middleware ──────────────────────────────────────────────

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import RedirectResponse

class TrailingSlashRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        path = request.url.path
        
        # API prefixes that should NEVER be redirected to avoid breaking frontend Axios calls
        api_prefixes = (
            "/api", "/admin", "/docs", "/openapi.json", 
            "/products", "/orders", "/users", "/token", "/pages"
        )
        
        if path != "/" and path.endswith("/") and not path.startswith(api_prefixes):
            url = request.url.replace(path=path.rstrip("/"))
            return RedirectResponse(url=url, status_code=301)
        return await call_next(request)


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
            response.headers["Cache-Control"] = f"public, max-age={settings.product_cache_ttl}"
            response.headers["Vary"] = "Accept-Encoding"
        elif path.startswith("/static/"):
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add basic security headers to every response."""
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

# Order matters: outermost middleware is added last
app.add_middleware(TrailingSlashRedirectMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CacheHeadersMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Trusted hosts (skip in dev when "*")
if settings.allowed_hosts != "*":
    allowed = [h.strip() for h in settings.allowed_hosts.split(",")]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed)

# CORS
cors_origins = [o.strip() for o in settings.cors_origins.split(",")] if settings.cors_origins != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Rate Limiting ──────────────────────────────────────────

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from backend.src.core.rate_limit import limiter, rate_limit_exceeded_handler

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


# ─── MIGRATION SCRIPT (TEMPORARY) ─────────────────────────────────
@app.get("/api/migrate-slugs-live")
def migrate_slugs_live(db: Session = Depends(get_db)):
    """Temporary endpoint to migrate English category slugs to Ukrainian locally or on Render."""
    try:
        slug_map = {
            "firewood": "drova",
            "briquettes": "brikety",
            "coal": "vugillya"
        }
        
        migrated_cats = []
        for old_slug, new_slug in slug_map.items():
            # Update CategoryMetadata
            cat = db.query(CategoryMetadata).filter(CategoryMetadata.slug == old_slug).first()
            if cat:
                cat.slug = new_slug
                migrated_cats.append(new_slug)
            
            # Update Products
            products = db.query(Product).filter(Product.category == old_slug).all()
            for p in products:
                p.category = new_slug
                
        db.commit()
        return {"status": "success", "migrated_categories": migrated_cats, "message": "Slugs migrated to Ukrainian"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.get("/api/seed-drova-live")
def seed_drova_live():
    """Temporary endpoint to seed drova products on Render."""
    try:
        from backend.seed_drova_seo import seed_drova
        seed_drova()
        return {"status": "success", "message": "10 drova products seeded on production"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/seed-briquettes-live")
def seed_briquettes_live(db: Session = Depends(get_db)):
    """Temporary endpoint to populate Briquettes with unique texts and JSONs on Render."""
    try:
        import sys, os
        # Add root to python path to import the sibling script
        root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        sys.path.insert(0, root_dir)
        import populate_briquettes
        
        updated = []
        for slug, data in populate_briquettes.products_data.items():
            product = db.query(Product).filter(Product.slug == slug).first()
            if product:
                product.name = data['name']
                product.short_description = data['short_description']
                product.description = data['description']
                product.specifications_json = data['specifications_json']
                product.faqs_json = data['faqs_json']
                product.meta_title = data['meta_title']
                product.meta_description = data['meta_description']
                product.schema_json = data['schema_json']
                product.image_alt = data['image_alt']
                updated.append(slug)
        db.commit()
        return {"status": "success", "message": f"Updated {len(updated)} briquettes", "slugs": updated}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.get("/api/upgrade-db")
def upgrade_db_schema(db: Session = Depends(get_db)):
    """Temporary endpoint to add new SEO/Spec columns to the production DB."""
    import sqlalchemy as sa
    try:
        engine = db.get_bind()
        cols = [
            "short_description TEXT",
            "image_alt TEXT",
            "specifications_json TEXT",
            "faqs_json TEXT"
        ]
        added = []
        for col_def in cols:
            col_name = col_def.split()[0]
            try:
                # Use a separate connection with autocommit for each column
                with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                    conn.execute(sa.text(f"ALTER TABLE cakes ADD COLUMN {col_def}"))
                added.append(col_name)
            except sa.exc.OperationalError as e:
                logger.warning(f"Failed to add {col_name}: {e}")
            except sa.exc.ProgrammingError as e:
                logger.warning(f"Failed to add {col_name}: {e}")
                
        return {"status": "success", "message": "DB schema upgrade attempted", "added_columns": added}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─── Static Files ───────────────────────────────────────────
import mimetypes
mimetypes.add_type("image/webp", ".webp")

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

from fastapi import APIRouter
from backend.src.products.router import router as products_router
from backend.src.orders.router import router as orders_router
from backend.src.users.router import router as users_router
from backend.src.admin.router import router as admin_router

# API v1 — versioned prefix for all API routes
api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(products_router)
api_v1.include_router(orders_router)
api_v1.include_router(users_router)
api_v1.include_router(admin_router)
app.include_router(api_v1)

# Backward compatibility — keep old routes working (no prefix)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(users_router)
app.include_router(admin_router)


# ─── Public Pages Endpoints ─────────────────────────────────

from fastapi import Query as QueryParam
from backend.src.pages.service import PageService
from backend.src.pages import schemas as page_schemas

CORE_ROUTES = {'/', '/delivery', '/contacts'}

pages_public_router = APIRouter(tags=["pages"])

@pages_public_router.get("/pages/by-route")
def get_page_by_route(route: str = QueryParam(...), db: Session = Depends(get_db)):
    """Public endpoint: fetch a page's content and SEO by its route_path."""
    page = PageService.get_page_by_route(db, route)
    if not page:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@pages_public_router.get("/pages/custom")
def list_custom_pages(db: Session = Depends(get_db)):
    """Public endpoint: list all custom (non-core) pages for navigation/sitemap."""
    all_pages = PageService.get_pages(db)
    return [
        {"route_path": p.route_path, "name": p.name, "meta_title": p.meta_title}
        for p in all_pages
        if p.route_path not in CORE_ROUTES
    ]

app.include_router(pages_public_router)


# ─── SEO Endpoints ──────────────────────────────────────────

from fastapi.responses import Response
from backend.src.core.seo import SitemapService

@app.get("/sitemap.xml", include_in_schema=False)
def sitemap(db: Session = Depends(get_db)):
    xml = SitemapService.generate(db)
    return Response(content=xml, media_type="application/xml")

@app.get("/robots.txt", include_in_schema=False)
def robots():
    return Response(content=SitemapService.robots_txt(), media_type="text/plain")

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
    return {"message": "KievBriket API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/health-check")
async def detailed_health_check(db: Session = Depends(get_db)):
    product_count = db.query(Product).count()
    pages_count = db.query(Page).count()
    return {
        "status": "online",
        "database": "connected",
        "products_count": product_count,
        "pages_count": pages_count,
    }

# ─── SPA Route ──────────────────────────────────────────────

from fastapi.responses import FileResponse, RedirectResponse
import os
from backend.src.products.service import CategoryMetadataService, ProductService
from backend.src.pages.service import PageService

@app.api_route("/{path_name:path}", methods=["GET"])
async def catch_all(path_name: str, db: Session = Depends(get_db)):
    """
    Catch-all route to serve the React SPA `index.html`.
    Any path that doesn't match an API route or static file 
    will return the React app, allowing React Router to handle it.
    IMPORTANT: Returns proper 404 status code for unknown routes to satisfy SEO requirements.
    """
    index_file = os.path.join(STATIC_DIR, "index.html")
    if not os.path.isfile(index_file):
        return {"message": "KievBriket API (React frontend not built)"}
        
    path = "/" + path_name.strip("/")
    if path == "/":
        return FileResponse(index_file)

    # Known React exact routes
    valid_exact = {"/", "/delivery", "/contacts", "/dostavka", "/kontakty", "/pro-nas", "/login", "/register", "/cart"}
    if path in valid_exact:
        return FileResponse(index_file)

    # Admin routes
    if path.startswith("/admin"):
        return FileResponse(index_file)

    # Legacy 301 Redirects
    LEGACY_SLUGS = {"firewood": "drova", "briquettes": "brikety", "coal": "vugillya"}
    if path.startswith("/catalog/"):
        parts = path.replace("/catalog/", "", 1).strip("/").split("/")
        if parts[0] in LEGACY_SLUGS:
            new_cat = LEGACY_SLUGS[parts[0]]
            if len(parts) == 1:
                return RedirectResponse(url=f"/catalog/{new_cat}", status_code=301)
            else:
                return RedirectResponse(url=f"/catalog/{new_cat}/{parts[1]}", status_code=301)

    # Dynamic Routes Validation
    if path.startswith("/page/"):
        page = PageService.get_page_by_route(db, path)
        if page:
            return FileResponse(index_file)

    elif path.startswith("/catalog/"):
        parts = path.replace("/catalog/", "", 1).strip("/").split("/")
        if len(parts) == 1:
            if CategoryMetadataService.get_category_metadata(db, parts[0]):
                return FileResponse(index_file)
        elif len(parts) == 2:
            if ProductService.get_product_by_slug(db, parts[1]):
                return FileResponse(index_file)

    # If no valid match, return index.html but with a 404 status code for SEO
    return FileResponse(index_file, status_code=404)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
