import random
import logging
import os
from sqlalchemy.orm import Session

from backend.src.pages.models import Page
from backend.src.pages.schemas import PageCreate
from backend.src.pages.service import PageService
from backend.src.products.models import Product, CategoryMetadata
from backend.src.products.schemas import ProductCreate
from backend.src.products.service import ProductService, CategoryMetadataService
from backend.src.users.models import User
from backend.src.users.schemas import UserCreate
from backend.src.users.service import UserService

logger = logging.getLogger("cakeshop.seed")


def _seed_pages(db: Session):
    """Seed default SEO pages if they don't exist yet."""
    default_pages = [
        {"route_path": "/", "name": "Головна сторінка"},
        {"route_path": "/delivery", "name": "Доставка та оплата"},
        {"route_path": "/contacts", "name": "Контакти"},
    ]
    created = 0
    for p in default_pages:
        if not PageService.get_page_by_route(db, p["route_path"]):
            PageService.create_page(db, PageCreate(**p))
            created += 1
    if created > 0:
        db.commit()
        logger.info("Seeded %d SEO pages.", created)


def check_and_seed_data(db: Session):
    """
    Checks if the database is empty and seeds it if necessary.
    This is intended to run on backend startup in production.
    """
    # 1. Always ensure SEO Pages exist (even if products already loaded)
    _seed_pages(db)

    # 2. Check if we have any products
    product_count = db.query(Product).count()
    if product_count > 0:
        logger.info("Database already has %d products. Skipping auto-seeding.", product_count)
        return

    logger.info("Database is empty. Starting auto-seeding process...")

    # 3. Seed Default Admin User if no users exist
    user_count = db.query(User).count()
    if user_count == 0:
        logger.info("No users found. Creating default admin...")
        admin_user = UserCreate(
            email="admin",
            password="admin"
        )
        UserService.create_user(db, admin_user)
        logger.info("Default admin created (admin/admin)")

    # 4. Seed Category Metadata
    initial_categories = {
        "firewood": {"name": "Дрова", "image_url": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800"},
        "briquettes": {"name": "Паливні брикети", "image_url": "https://images.unsplash.com/photo-1616422312211-5f212267f53a?auto=format&fit=crop&q=80&w=800"},
        "coal": {"name": "Вугілля", "image_url": "https://images.unsplash.com/photo-1587304859876-0a25695662bb?auto=format&fit=crop&q=80&w=800"},
    }
    for slug, data in initial_categories.items():
        if not CategoryMetadataService.get_category_metadata(db, slug):
            db.add(CategoryMetadata(slug=slug, name=data["name"], image_url=data["image_url"]))

    # 5. Seed Essential Products (Minimal set for instant WOW)
    categories_data = {
        "firewood": [
            ("Дрова дубові колоті", 1000.0, 1800.0, ""),
            ("Дрова соснові", 1000.0, 1400.0, ""),
            ("Дрова грабові", 1000.0, 1900.0, "")
        ],
        "briquettes": [
            ("Брикети RUF (Дуб)", 1000.0, 11000.0, ""),
            ("Брикети Піні-Кей", 1000.0, 12500.0, ""),
            ("Брикети Нестро", 1000.0, 10500.0, "")
        ],
        "coal": [
            ("Вугілля Антрацит (Горіх)", 1000.0, 14500.0, ""),
            ("Вугілля Газове (ГЖ)", 1000.0, 11000.0, ""),
            ("Вугілля ДГ", 1000.0, 9500.0, "")
        ]
    }

    for cat_slug, products in categories_data.items():
        for i, (name, weight, price, img) in enumerate(products, start=1):
            product = ProductCreate(
                name=name,
                description=f"Найкраще тверде паливо для вашого котла або печі. Висока тепловіддача та мінімальна вологість.",
                price=price + random.randint(-50, 50),
                image_url=img,
                is_available=True,
                weight=weight,
                ingredients="Тверде паливо",
                shelf_life="Необмежений",
                category=cat_slug
            )
            ProductService.create_product(db, product)

    db.commit()
    logger.info("Auto-seeding completed successfully!")
