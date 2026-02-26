"""Admin routes (pages, categories, telegram, upload, SEO, seed)."""
import uuid
import shutil
import logging
from typing import List, Optional
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.database import get_db
from backend.deps import get_current_user

logger = logging.getLogger("cakeshop.admin")

router = APIRouter(tags=["admin"])

MEDIA_DIR = Path(__file__).parent.parent / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)


# --- Pages ---

@router.get("/admin/pages", response_model=List[schemas.Page])
def read_pages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.get_pages(db, skip=skip, limit=limit)

@router.post("/admin/pages", response_model=schemas.Page)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.create_page(db=db, page=page)

@router.patch("/admin/pages/{page_id}", response_model=schemas.Page)
def update_page(page_id: int, page: schemas.PageUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_page = crud.update_page(db, page_id=page_id, page=page)
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page


# --- Category Metadata ---

@router.get("/admin/categories/metadata", response_model=List[schemas.CategoryMetadata])
def read_all_category_metadata(db: Session = Depends(get_db)):
    return crud.get_all_category_metadata(db)

@router.get("/admin/categories/metadata/{slug}", response_model=Optional[schemas.CategoryMetadata])
def read_category_metadata(slug: str, db: Session = Depends(get_db)):
    return crud.get_category_metadata(db, slug=slug)

@router.patch("/admin/categories/metadata/{slug}", response_model=schemas.CategoryMetadata)
def update_category_metadata(slug: str, metadata: schemas.CategoryMetadataUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return crud.update_category_metadata(db, slug=slug, metadata=metadata)


# --- SEO ---

@router.get("/api/seo/{route_path:path}")
def get_seo(route_path: str, db: Session = Depends(get_db)):
    if not route_path.startswith("/"):
        route_path = "/" + route_path
    page = crud.get_page_by_route(db, route_path)
    if not page:
        return {}
    return page


# --- Telegram ---

@router.get("/admin/telegram", response_model=schemas.TelegramSettings)
def get_telegram_settings_endpoint(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from backend.routers._telegram import get_telegram_settings
    return get_telegram_settings(db)

@router.put("/admin/telegram", response_model=schemas.TelegramSettings)
def update_telegram_settings_endpoint(settings_update: schemas.TelegramSettingsUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from backend.routers._telegram import get_telegram_settings
    settings = get_telegram_settings(db)
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings

@router.post("/admin/telegram/test")
def test_telegram(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    from backend.routers._telegram import send_telegram_notification
    send_telegram_notification("✅ Тестове повідомлення від Antreme!", db)
    return {"message": "Test notification sent"}


# --- Upload ---

@router.post("/admin/upload")
def upload_image(file: UploadFile = File(...), current_user=Depends(get_current_user)):
    file_extension = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = MEDIA_DIR / file_name
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"image_url": f"/media/{file_name}"}


# --- Seed ---

@router.post("/seed_db")
def seed_database():
    from backend import seed
    try:
        seed.seed_data()
        return {"message": "Database seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
