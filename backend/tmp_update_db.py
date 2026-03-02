import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from src.core.database import SessionLocal
from src.products.models import Product

def update_products():
    db = SessionLocal()
    products = db.query(Product).all()
    for p in products:
        if 'Березові' in p.name:
            p.image_url = '/media/products/birch.webp'
        elif 'Ясенові' in p.name:
            p.image_url = '/media/products/ash.webp'
    db.commit()
    db.close()
    print("Database updated for birch and ash!")

if __name__ == "__main__":
    update_products()
