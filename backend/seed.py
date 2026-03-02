import sys
import os

# Add project root to sys.path to resolve 'backend' package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend.src.core.database import SessionLocal, engine, Base
from backend.src.core.slugify import generate_slug

from backend.src.users.models import User
from backend.src.users.schemas import UserCreate
from backend.src.users.service import UserService
from backend.src.products.models import Product, CategoryMetadata
from backend.src.products.schemas import ProductCreate
from backend.src.products.service import ProductService
from backend.src.orders.models import Order, OrderItem
import random

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Clear existing data to ensure fresh seed
    print("Clearing existing data...")
    try:
        db.query(OrderItem).delete()
        db.query(Order).delete()
        db.query(Product).delete()
        db.query(CategoryMetadata).delete()
        db.commit()
        print("Existing data cleared.")
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
        return

    # Create default admin if not exists
    print("Checking for admin user...")
    if not UserService.get_user_by_email(db, "admin"):
        print("Creating default admin user...")
        admin_user = UserCreate(
            email="admin",
            password="admin"
        )
        UserService.create_user(db, admin_user)
        print("Default admin created: admin/admin")

    categories = {
        "firewood": {
            "name": "Дрова",
            "description": "Колоті дрова різних порід для опалення та каміна.",
            "image": "/media/categories/firewood.webp",
            "seo_text": "<p>Купити дрова з доставкою по Києву та області. Широкий вибір порід дерева: дуб, граб, сосна. Чесний об'єм та швидка доставка.</p>",
            "products": [
                {"name": "Дубові дрова (колоті)", "price": 2200, "weight": 1.0, "desc": "Тверда порода, ідеально для котлів і камінів.", "image": "/media/products/oak.webp", "ingredients": "Дуб", "shelf_life": "Сухі"},
                {"name": "Грабові дрова (колоті)", "price": 1900, "weight": 1.0, "desc": "Найбільша тепловіддача, довго горять.", "image": "/media/products/hornbeam.webp", "ingredients": "Граб", "shelf_life": "Сухі"},
                {"name": "Соснові дрова (колоті)", "price": 1200, "weight": 1.0, "desc": "Легко розпалюються, дають гарний жар.", "image": "/media/products/pine.webp", "ingredients": "Сосна", "shelf_life": "Сухі"},
                {"name": "Вільхові дрова (колоті)", "price": 1500, "weight": 1.0, "desc": "Ідеальні для бані та каміна, не димлять.", "image": "/media/products/alder.webp", "ingredients": "Вільха", "shelf_life": "Сухі"},
                {"name": "Березові дрова (колоті)", "price": 1400, "weight": 1.0, "desc": "Популярна порода, рівне горіння та приємний аромат.", "image": "/media/products/birch.webp", "ingredients": "Береза", "shelf_life": "Сухі"},
                {"name": "Ясенові дрова (колоті)", "price": 2400, "weight": 1.0, "desc": "Преміум порода, максимальна тепловіддача серед листяних.", "image": "/media/products/ash.webp", "ingredients": "Ясен", "shelf_life": "Сухі"},
            ]
        },
        "briquettes": {
            "name": "Паливні брикети",
            "description": "Екологічні паливні брикети типу RUF, Nestro, Pini Kay.",
            "image": "/media/categories/briquettes.webp",
            "seo_text": "<p>Якісні паливні брикети для твердопаливних котлів. Висока тепловіддача та мінімум попелу.</p>",
            "products": [
                {"name": "Брикети RUF (Дуб)", "price": 8500, "weight": 1000.0, "desc": "Брикети RUF з дубової тирси, 1 тонна.", "image": "/media/products/ruf.webp", "ingredients": "Дубова тирса", "shelf_life": "Необмежений"},
                {"name": "Брикети Pini Kay", "price": 9000, "weight": 1000.0, "desc": "Брикети Pini Kay з отвором, 1 тонна.", "image": "/media/products/pinikay.webp", "ingredients": "Тирса твердих порід", "shelf_life": "Необмежений"},
                {"name": "Брикети Nestro (сосна)", "price": 7800, "weight": 1000.0, "desc": "Циліндричні брикети Nestro з соснової тирси, 1 тонна.", "image": "/media/products/ruf.webp", "ingredients": "Хвойна тирса", "shelf_life": "Необмежений"},
                {"name": "Брикети RUF Преміум", "price": 9500, "weight": 1000.0, "desc": "Брикети RUF з тирси твердих порід, висока щільність, 1 тонна.", "image": "/media/products/ruf.webp", "ingredients": "Тирса дуб/граб", "shelf_life": "Необмежений"},
                {"name": "Торфобрикети", "price": 6500, "weight": 1000.0, "desc": "Торф'яні брикети — бюджетний варіант для котлів, 1 тонна.", "image": "/media/products/pinikay.webp", "ingredients": "Торф", "shelf_life": "Необмежений"},
                {"name": "Брикети Pini Kay XL", "price": 9800, "weight": 1000.0, "desc": "Великі брикети Pini Kay для котлів тривалого горіння, 1 тонна.", "image": "/media/products/pinikay.webp", "ingredients": "Тирса твердих порід", "shelf_life": "Необмежений"},
            ]
        },
        "coal": {
            "name": "Вугілля",
            "description": "Кам'яне вугілля антрацит та газове.",
            "image": "/media/categories/coal.webp",
            "seo_text": "<p>Купити вугілля з доставкою. Антрацит відмінної якості для тривалого горіння.</p>",
            "products": [
                {"name": "Вугілля Антрацит (Горіх)", "price": 12000, "weight": 1000.0, "desc": "Вугілля АО (Антрацит Горіх) у мішках, 1 тонна.", "image": "/media/products/coal_ao.webp", "ingredients": "Антрацит", "shelf_life": "Необмежений"},
                {"name": "Вугілля Антрацит (Насіння)", "price": 11500, "weight": 1000.0, "desc": "Вугілля АС (Антрацит Семєчко), 1 тонна.", "image": "/media/products/coal_as.webp", "ingredients": "Антрацит", "shelf_life": "Необмежений"},
                {"name": "Вугілля Газове (ДПК)", "price": 9500, "weight": 1000.0, "desc": "Газове вугілля марки ДПК для промислових котлів, 1 тонна.", "image": "/media/products/coal_as.webp", "ingredients": "Газове вугілля", "shelf_life": "Необмежений"},
                {"name": "Вугілля Антрацит (Куб АКО)", "price": 12500, "weight": 1000.0, "desc": "Великий кубиковий антрацит АКО для великих котлів, 1 тонна.", "image": "/media/products/coal_ao.webp", "ingredients": "Антрацит", "shelf_life": "Необмежений"},
                {"name": "Кокс металургійний", "price": 18000, "weight": 1000.0, "desc": "Металургійний кокс для промислового опалення та ковальства, 1 тонна.", "image": "/media/products/coal_ao.webp", "ingredients": "Кокс", "shelf_life": "Необмежений"},
                {"name": "Вугілля Газове (ДО)", "price": 9200, "weight": 1000.0, "desc": "Газове вугілля ДО (горіх), оптимальне для котлів АУСВ, 1 тонна.", "image": "/media/products/coal_as.webp", "ingredients": "Газове вугілля", "shelf_life": "Необмежений"},
            ]
        }
    }

    # Seed metadata
    print("Seeding category metadata...")
    for slug, details in categories.items():
        meta = CategoryMetadata(
            slug=slug, 
            name=details["name"], 
            description=details["description"], 
            image_url=details["image"],
            seo_text=details["seo_text"]
        )
        db.add(meta)
    db.commit()

    # Seed products
    print("Seeding products...")
    for slug, details in categories.items():
        for prod_data in details["products"]:
            product_slug = generate_slug(prod_data["name"])
            product = ProductCreate(
                name=prod_data["name"],
                description=prod_data["desc"],
                price=prod_data["price"],
                image_url=prod_data["image"],
                is_available=True,
                slug=product_slug,
                weight=prod_data["weight"],
                ingredients=prod_data["ingredients"],
                shelf_life=prod_data["shelf_life"],
                category=slug
            )
            ProductService.create_product(db=db, product=product)

    print(f"Database seeded successfully with Firewood data!")
    db.close()

if __name__ == "__main__":
    seed_data()

