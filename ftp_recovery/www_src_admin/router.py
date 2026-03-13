import uuid
import shutil
import logging
from typing import List, Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from backend.src.pages.service import PageService
from backend.src.pages import schemas as page_schemas
from backend.src.products.service import CategoryMetadataService
from backend.src.products import schemas as category_schemas
from .service import AdminService
from . import schemas as admin_schemas
from backend.src.core.database import get_db
from backend.src.core.dependencies import get_current_user
from backend.src.core.telegram import send_telegram_notification, get_telegram_settings

logger = logging.getLogger("cakeshop.admin")

router = APIRouter(tags=["admin"])

MEDIA_DIR = Path(__file__).parent.parent.parent / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

# --- Pages ---

@router.get("/admin/pages", response_model=List[page_schemas.Page])
def read_pages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return PageService.get_pages(db, skip=skip, limit=limit)

@router.post("/admin/pages", response_model=page_schemas.Page)
def create_page(page: page_schemas.PageCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return PageService.create_page(db=db, page=page)

@router.patch("/admin/pages/{page_id}", response_model=page_schemas.Page)
def update_page(page_id: int, page: page_schemas.PageUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_page = PageService.update_page(db, page_id=page_id, page=page)
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

@router.delete("/admin/pages/{page_id}")
def delete_page(page_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from backend.src.pages.models import Page
    CORE_ROUTES = {'/', '/delivery', '/contacts'}
    db_page = db.query(Page).filter(Page.id == page_id).first()
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    if db_page.route_path in CORE_ROUTES:
        raise HTTPException(status_code=400, detail="Cannot delete core pages")
    db.delete(db_page)
    db.commit()
    return {"detail": "Page deleted"}

# --- Category Metadata ---

@router.get("/admin/categories/metadata", response_model=List[category_schemas.CategoryMetadata])
def read_all_category_metadata(db: Session = Depends(get_db)):
    return CategoryMetadataService.get_all_category_metadata(db)

@router.get("/admin/categories/metadata/{slug}", response_model=Optional[category_schemas.CategoryMetadata])
def read_category_metadata(slug: str, db: Session = Depends(get_db)):
    return CategoryMetadataService.get_category_metadata(db, slug=slug)

@router.post("/admin/categories/metadata", response_model=category_schemas.CategoryMetadata)
def create_category_metadata(metadata: category_schemas.CategoryMetadataCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return CategoryMetadataService.create_category_metadata(db=db, metadata=metadata)

@router.patch("/admin/categories/metadata/{slug}", response_model=category_schemas.CategoryMetadata)
def update_category_metadata(slug: str, metadata: category_schemas.CategoryMetadataUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return CategoryMetadataService.update_category_metadata(db, slug=slug, metadata=metadata)

@router.delete("/admin/categories/metadata/{slug}")
def delete_category_metadata(slug: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    deleted = CategoryMetadataService.delete_category_metadata(db, slug=slug)
    if not deleted:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"detail": "Category deleted"}

# --- SEO ---

@router.get("/api/seo/{route_path:path}")
def get_seo(route_path: str, db: Session = Depends(get_db)):
    if not route_path.startswith("/"):
        route_path = "/" + route_path
    page = PageService.get_page_by_route(db, route_path)
    if not page:
        return {}
    return page

# --- Telegram ---

@router.get("/admin/telegram", response_model=admin_schemas.TelegramSettings)
def get_telegram_settings_endpoint(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return get_telegram_settings(db)

@router.put("/admin/telegram", response_model=admin_schemas.TelegramSettings)
def update_telegram_settings_endpoint(settings_update: admin_schemas.TelegramSettingsUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AdminService.update_telegram_settings(db, update_data=settings_update)

@router.post("/admin/telegram/test")
def test_telegram(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    send_telegram_notification("✅ Тестове повідомлення від Antreme!", db)
    return {"message": "Test notification sent"}

# --- Site Settings (Google Analytics etc.) ---

@router.get("/admin/site-settings", response_model=admin_schemas.SiteSettings)
def get_site_settings(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AdminService.get_site_settings(db)

@router.put("/admin/site-settings", response_model=admin_schemas.SiteSettings)
def update_site_settings(settings_update: admin_schemas.SiteSettingsUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return AdminService.update_site_settings(db, update_data=settings_update)

# Public endpoint — no auth, only returns GA tracking ID
@router.get("/api/site-settings/ga")
def get_ga_tracking_id(db: Session = Depends(get_db)):
    settings = AdminService.get_site_settings(db)
    return {"ga_tracking_id": settings.ga_tracking_id}

# Public endpoint — no auth, returns hero section settings for homepage
@router.get("/api/site-settings/hero")
def get_hero_settings(db: Session = Depends(get_db)):
    settings = AdminService.get_site_settings(db)
    import json
    badges = None
    if settings.hero_badges:
        try:
            badges = json.loads(settings.hero_badges)
        except (json.JSONDecodeError, TypeError):
            badges = None
    return {
        "hero_badges": badges,
        "hero_trust_text": settings.hero_trust_text,
        "hero_image_url": settings.hero_image_url,
    }

# Public endpoint — no auth, returns delivery transport settings
@router.get("/api/site-settings/delivery")
def get_delivery_transport_settings(db: Session = Depends(get_db)):
    settings = AdminService.get_site_settings(db)
    import json
    transport = None
    if settings.delivery_transport:
        try:
            transport = json.loads(settings.delivery_transport)
        except (json.JSONDecodeError, TypeError):
            transport = None
    
    # Return default hardcoded list if none exists yet
    if not transport:
        transport = [
            { "type": "ГАЗель (бус)", "vol": "4–5 складометрів", "price": "1 500 грн", "desc": "Швидка доставка невеликих замовлень", "category": "standard", "image": "/images/delivery/gazel-dostavka-driv-kyiv.webp" },
            { "type": "ЗІЛ самоскид", "vol": "4 складометри", "price": "3 000 грн", "desc": "Оптимально для приватних будинків", "category": "standard", "image": "/images/delivery/zil-dostavka-driv-kyiv.webp" },
            { "type": "КАМАЗ самоскид", "vol": "8 складометрів", "price": "4 000 грн", "desc": "Великі обсяги палива", "category": "standard", "image": "/images/delivery/kamaz-dostavka-driv-kyiv.webp" },
            { "type": "Кран-маніпулятор", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження у складних умовах", "category": "special", "image": "/images/delivery/manipulator-dostavka-kyiv.webp" },
            { "type": "Гідроборт / рокла", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження палет", "category": "special", "image": "/images/delivery/gidrobort-rokla-dostavka-kyiv.webp" },
            { "type": "Фура", "vol": "22–24 складометри", "price": "за домовленістю", "desc": "Поставка напряму з лісгоспу", "category": "table_only", "image": "" },
        ]

    return {"delivery_transport": transport}

# --- Upload ---

from backend.src.core.images import ImageProcessor

@router.post("/admin/upload")
async def upload_image(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    try:
        file_bytes = await file.read()
        base_uuid = str(uuid.uuid4())
        
        # 1. Process Main Image
        processed_bytes, _ = ImageProcessor.process_image(file_bytes, file.filename)
        main_name = f"{base_uuid}.webp"
        main_path = MEDIA_DIR / main_name
        with main_path.open("wb") as buffer:
            buffer.write(processed_bytes)
            
        # 2. Process Thumbnail
        thumb_bytes, _ = ImageProcessor.create_thumbnail(file_bytes, file.filename)
        thumb_name = f"{base_uuid}_thumb.webp"
        thumb_path = MEDIA_DIR / thumb_name
        with thumb_path.open("wb") as buffer:
            buffer.write(thumb_bytes)
            
        return {
            "image_url": f"/media/{main_name}",
            "thumbnail_url": f"/media/{thumb_name}"
        }
    except Exception as e:
        logger.error(f"Image processing error: {e}")
        raise HTTPException(status_code=400, detail="Invalid image file or processing failed")

# --- Feature Flags ---

from backend.src.core.feature_flags import get_all_flags, set_flag

@router.get("/admin/feature-flags")
def read_feature_flags(current_user=Depends(get_current_user)):
    """Get all feature flags with descriptions."""
    return get_all_flags()

@router.put("/admin/feature-flags")
def update_feature_flags(
    updates: dict,
    current_user=Depends(get_current_user)
):
    """Update feature flags. Body: {"enable_cart": true, "enable_blog": false}"""
    for flag_name, value in updates.items():
        if not isinstance(value, bool):
            raise HTTPException(status_code=400, detail=f"Flag '{flag_name}' must be boolean")
        set_flag(flag_name, value)
    return get_all_flags()

# --- Dashboard Stats ---

from backend.src.admin.analytics import AnalyticsService

@router.get("/admin/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Dashboard stats: counts, revenue, orders by day, popular products."""
    return AnalyticsService.get_dashboard_stats(db, days=30)

# --- Seed ---

@router.post("/seed_db")
def seed_database():
    from backend import seed
    try:
        seed.seed_data()
        return {"message": "Database seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- Backups ---
from backend.scripts.backup_db import create_backup, BACKUP_DIR
import os
from fastapi.responses import FileResponse

@router.post("/admin/backup")
def create_database_backup(current_user=Depends(get_current_user)):
    """Trigger a manual database backup."""
    backup_file = create_backup()
    if backup_file:
        return {"message": "Backup created successfully", "filename": backup_file.name}
    raise HTTPException(status_code=500, detail="Failed to create backup")

@router.get("/admin/backup/download/{filename}")
def download_database_backup(filename: str, current_user=Depends(get_current_user)):
    """Download a specific backup file."""
    file_path = BACKUP_DIR / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=404, detail="Backup file not found")
    return FileResponse(path=file_path, filename=filename, media_type="application/x-sqlite3")


# --- Bulk Actions ---

from pydantic import BaseModel as PydanticBaseModel
from typing import List as TypingList

class BulkActionRequest(PydanticBaseModel):
    action: str  # "publish", "unpublish", "delete", "change_status"
    ids: TypingList[int]
    target_status: str = None  # for change_status

@router.post("/admin/bulk/products")
def bulk_products_action(
    body: BulkActionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Bulk product actions: publish, unpublish, delete (soft)."""
    products = db.query(Product).filter(Product.id.in_(body.ids)).all()
    count = 0
    for p in products:
        if body.action == "publish":
            p.is_available = True
            count += 1
        elif body.action == "unpublish":
            p.is_available = False
            count += 1
        elif body.action == "delete":
            p.is_deleted = True
            p.deleted_at = datetime.utcnow()
            count += 1
    db.commit()
    return {"action": body.action, "affected": count}

@router.post("/admin/bulk/orders")
def bulk_orders_action(
    body: BulkActionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """Bulk order actions: change_status, delete (soft)."""
    from backend.src.orders.service import OrderService
    orders = db.query(Order).filter(Order.id.in_(body.ids)).all()
    count = 0
    for o in orders:
        if body.action == "delete":
            o.is_deleted = True
            o.deleted_at = datetime.utcnow()
            count += 1
        elif body.action == "change_status" and body.target_status:
            result = OrderService.update_order_status(db, o.id, body.target_status)
            if result:
                count += 1
    db.commit()
    return {"action": body.action, "affected": count}


# --- CSV Export ---

import csv
import io
from starlette.responses import StreamingResponse

@router.get("/admin/export/products")
def export_products_csv(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Export all products as CSV."""
    products = db.query(Product).filter(Product.is_deleted == False).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Slug", "Name", "Category", "Price", "Weight", "Stock", "Available"])
    for p in products:
        writer.writerow([p.id, p.slug, p.name, p.category, p.price, p.weight, p.stock_quantity, p.is_available])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=products.csv"}
    )

@router.get("/admin/export/orders")
def export_orders_csv(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Export all orders as CSV."""
    orders = db.query(Order).filter(Order.is_deleted == False).order_by(Order.id.desc()).all()
    
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Customer", "Phone", "Status", "Total", "Delivery", "Date", "Created"])
    for o in orders:
        writer.writerow([o.id, o.customer_name, o.customer_phone, o.status, o.total_price, o.delivery_method, o.delivery_date, o.created_at])
    
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=orders.csv"}
    )


# --- CSV Import ---

@router.post("/admin/import/products")
def import_products_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Import products from CSV. Creates new or updates existing (matched by slug).
    Expected columns: Name, Category, Price, Weight, Stock, Available
    Optional: Slug, Description, Ingredients, ShelfLife
    """
    from backend.src.core.slugify import generate_slug, ensure_unique_slug

    content = file.file.read().decode("utf-8-sig")  # BOM-safe
    reader = csv.DictReader(io.StringIO(content))

    created = 0
    updated = 0
    skipped = 0
    errors = []

    for row_num, row in enumerate(reader, start=2):
        try:
            name = (row.get("Name") or row.get("name") or "").strip()
            if not name:
                skipped += 1
                continue

            price = float(row.get("Price") or row.get("price") or 0)
            category = (row.get("Category") or row.get("category") or "").strip() or None
            weight = float(row.get("Weight") or row.get("weight") or 0) or None
            stock = int(row.get("Stock") or row.get("stock") or 0)
            available_raw = (row.get("Available") or row.get("available") or "True").strip()
            available = available_raw.lower() in ("true", "1", "yes", "so")
            slug = (row.get("Slug") or row.get("slug") or "").strip()
            description = (row.get("Description") or row.get("description") or "").strip() or None
            ingredients = (row.get("Ingredients") or row.get("ingredients") or "").strip() or None
            shelf_life = (row.get("ShelfLife") or row.get("shelf_life") or "").strip() or None
            image_url = (row.get("ImageUrl") or row.get("image_url") or "").strip() or None

            # Try find existing by slug
            existing = None
            if slug:
                existing = db.query(Product).filter(Product.slug == slug).first()

            if existing:
                # Update existing
                existing.name = name
                existing.price = price
                existing.category = category
                existing.weight = weight
                existing.stock_quantity = stock
                existing.is_available = available
                if description:
                    existing.description = description
                if ingredients:
                    existing.ingredients = ingredients
                if shelf_life:
                    existing.shelf_life = shelf_life
                if image_url:
                    existing.image_url = image_url
                
                # Auto-generate image_alt if missing
                if not existing.image_alt and existing.name:
                    existing.image_alt = existing.name
                    
                updated += 1
            else:
                # Create new
                if not slug:
                    slug = generate_slug(name)
                    slug = ensure_unique_slug(db, Product, slug)

                new_product = Product(
                    name=name,
                    slug=slug,
                    price=price,
                    category=category,
                    weight=weight,
                    stock_quantity=stock,
                    is_available=available,
                    description=description,
                    ingredients=ingredients,
                    shelf_life=shelf_life,
                    image_url=image_url,
                    image_alt=name,
                )
                db.add(new_product)
                created += 1

        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
            skipped += 1


    db.commit()
    return {
        "created": created,
        "updated": updated,
        "skipped": skipped,
        "errors": errors[:10],  # max 10 errors in response
    }


# --- Reviews ---
from backend.src.admin import models as admin_models
from backend.src.admin import schemas as admin_schemas

@router.get("/api/reviews", response_model=TypingList[admin_schemas.ReviewResponse])
def get_public_reviews(db: Session = Depends(get_db)):
    """Public endpoint to get active reviews sorted by sort_order."""
    reviews = db.query(admin_models.Review).filter(admin_models.Review.is_active == True).order_by(admin_models.Review.sort_order.asc(), admin_models.Review.id.desc()).all()
    return reviews

@router.get("/admin/reviews", response_model=TypingList[admin_schemas.ReviewResponse])
def get_admin_reviews(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Admin endpoint to get all reviews."""
    reviews = db.query(admin_models.Review).order_by(admin_models.Review.sort_order.asc(), admin_models.Review.id.desc()).all()
    return reviews

@router.post("/admin/reviews", response_model=admin_schemas.ReviewResponse)
def create_review(
    review: admin_schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_review = admin_models.Review(**review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@router.patch("/admin/reviews/{review_id}", response_model=admin_schemas.ReviewResponse)
def update_review(
    review_id: int,
    review_update: admin_schemas.ReviewUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_review = db.query(admin_models.Review).filter(admin_models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    update_data = review_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_review, key, value)
        
    db.commit()
    db.refresh(db_review)
    return db_review

@router.delete("/admin/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_review = db.query(admin_models.Review).filter(admin_models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    db.delete(db_review)
    db.commit()
    return {"detail": "Review deleted"}


# --- FAQs ---

@router.get("/api/faqs", response_model=TypingList[admin_schemas.FAQResponse])
def get_public_faqs(page: Optional[str] = None, db: Session = Depends(get_db)):
    """Public endpoint to get active FAQs. Optionally filter by page."""
    query = db.query(admin_models.FAQ).filter(admin_models.FAQ.is_active == True)
    if page:
        query = query.filter(admin_models.FAQ.page == page)
    # Order by page then sort_order
    faqs = query.order_by(admin_models.FAQ.page.asc(), admin_models.FAQ.sort_order.asc(), admin_models.FAQ.id.desc()).all()
    return faqs

@router.get("/admin/faqs", response_model=TypingList[admin_schemas.FAQResponse])
def get_admin_faqs(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    """Admin endpoint to get all FAQs."""
    faqs = db.query(admin_models.FAQ).order_by(admin_models.FAQ.page.asc(), admin_models.FAQ.sort_order.asc(), admin_models.FAQ.id.desc()).all()
    return faqs

@router.post("/admin/faqs", response_model=admin_schemas.FAQResponse)
def create_faq(
    faq: admin_schemas.FAQCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_faq = admin_models.FAQ(**faq.dict())
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq

@router.patch("/admin/faqs/{faq_id}", response_model=admin_schemas.FAQResponse)
def update_faq(
    faq_id: int,
    faq_update: admin_schemas.FAQUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    db_faq = db.query(admin_models.FAQ).filter(admin_models.FAQ.id == faq_id).first()
    if not db_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    update_data = faq_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_faq, key, value)
        
    db.commit()
    db.refresh(db_faq)
    return db_faq

@router.delete("/admin/faqs/{faq_id}")
def delete_faq(faq_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_faq = db.query(admin_models.FAQ).filter(admin_models.FAQ.id == faq_id).first()
    if not db_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    
    db.delete(db_faq)
    db.commit()
    return {"detail": "FAQ deleted"}
