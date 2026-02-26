import random
import logging
import os
from sqlalchemy.orm import Session
from backend import models, schemas, crud

logger = logging.getLogger("cakeshop.seed")


def _seed_pages(db: Session):
    """Seed default SEO pages if they don't exist yet."""
    default_pages = [
        {"route_path": "/", "name": "Головна сторінка"},
        {"route_path": "/cakes", "name": "Каталог (Всі торти)"},
        {"route_path": "/cakes?category=bento", "name": "Категорія: Бенто тортики"},
        {"route_path": "/cakes?category=biscuit", "name": "Категорія: Бісквітні торти"},
        {"route_path": "/cakes?category=wedding", "name": "Категорія: Весільні торти"},
        {"route_path": "/cakes?category=mousse", "name": "Категорія: Мусові торти"},
        {"route_path": "/cakes?category=cupcakes", "name": "Категорія: Капкейки"},
        {"route_path": "/cakes?category=gingerbread", "name": "Категорія: Імбирні пряники"},
        {"route_path": "/fillings", "name": "Начинки"},
        {"route_path": "/delivery", "name": "Доставка та оплата"},
        {"route_path": "/about", "name": "Про нас"},
        {"route_path": "/gallery/photo", "name": "Фотогалерея"},
        {"route_path": "/gallery/video", "name": "Відеогалерея"},
        {"route_path": "/cart", "name": "Кошик"},
    ]
    created = 0
    for p in default_pages:
        if not crud.get_page_by_route(db, p["route_path"]):
            crud.create_page(db, schemas.PageCreate(**p))
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
    product_count = db.query(models.Product).count()
    if product_count > 0:
        logger.info("Database already has %d products. Skipping auto-seeding.", product_count)
        return

    logger.info("Database is empty. Starting auto-seeding process...")

    # 3. Seed Default Admin User if no users exist
    user_count = db.query(models.User).count()
    if user_count == 0:
        logger.info("No users found. Creating default admin...")
        admin_user = schemas.UserCreate(
            email="admin",
            password="admin"
        )
        crud.create_user(db, admin_user)
        logger.info("Default admin created (admin/admin)")

    # 4. Seed Category Metadata
    initial_images = {
        "birthday": "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800",
        "anniversary": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
        "kids": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
        "wedding": "",
        "bento": "",
        "biscuit": "",
        "mousse": "",
        "cupcakes": "",
        "gingerbread": ""
    }
    for slug, img_url in initial_images.items():
        if not crud.get_category_metadata(db, slug):
            db.add(models.CategoryMetadata(slug=slug, image_url=img_url))

    # 5. Seed Essential Products (Minimal set for instant WOW)
    categories_data = {
        "bento": ("Бенто", 450.0, 500.0, ""),
        "biscuit": ("Бісквітний", 1500.0, 1000.0, ""),
        "mousse": ("Мусовий", 1100.0, 1200.0, ""),
        "wedding": ("Весільний", 4000.0, 3500.0, ""),
        "cupcakes": ("Капкейки", 350.0, 600.0, ""),
        "gingerbread": ("Пряник", 200.0, 300.0, "")
    }

    for cat_slug, (pref, weight, price, img) in categories_data.items():
        for i in range(1, 7):  # Seed 6 products per category
            product = schemas.ProductCreate(
                name=f"{pref} '{cat_slug.capitalize()} #{i}'",
                description=f"Найкращий {pref.lower()} для вашого свята. Тільки натуральні інгредієнти.",
                price=price + random.randint(-50, 50),
                image_url=img,
                is_available=True,
                weight=weight,
                ingredients="Преміум інгредієнти, свіжі ягоди, бельгійський шоколад",
                shelf_life="72 години",
                category=cat_slug
            )
            crud.create_product(db, product)

    db.commit()
    logger.info("Auto-seeding completed successfully!")
