import sys
import os
import json
from datetime import datetime

# Add project root to path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
project_root = os.path.dirname(backend_dir)
sys.path.insert(0, project_root)

from backend.src.core.database import SessionLocal, engine
from backend.src.products.models import CategoryMetadata
from backend.src.products.schemas import CategoryMetadataCreate
from backend.src.products.service import CategoryMetadataService

def seed_categories():
    db = SessionLocal()
    try:
        # 1. Clear existing categories (removes old cakes)
        db.query(CategoryMetadata).delete()
        db.commit()

        # 2. Add new firewood categories
        categories = [
            {
                "slug": "firewood",
                "name": "Дрова",
                "description": "Купити дрова колоті з доставкою",
                "seo_text": "<h2>Дрова колоті в Києві та області</h2><p>Ми пропонуємо якісні колоті дрова різних порід: дуб, граб, ясен, береза, сосна. Всі дрова проходять суворий контроль якості та зберігаються в сухих умовах.</p>"
            },
            {
                "slug": "briquettes",
                "name": "Паливні брикети",
                "description": "Екологічно чисті паливні брикети",
                "seo_text": "<h2>Паливні брикети високої якості</h2><p>Брикети - це сучасне, екологічне та ефективне тверде паливо. Вони мають високу тепловіддачу та залишають мінімум золи.</p>"
            },
            {
                "slug": "coal",
                "name": "Вугілля",
                "description": "Вугілля кам'яне та антрацит",
                "seo_text": "<h2>Вугілля для опалення</h2><p>Пропонуємо високоякісне вугілля для котлів та печей. Забезпечує тривале та стабільне горіння з високою тепловіддачею.</p>"
            }
        ]

        for cat_data in categories:
            cat = CategoryMetadata(
                slug=cat_data["slug"],
                name=cat_data["name"],
                description=cat_data["description"],
                seo_text=cat_data["seo_text"]
            )
            db.add(cat)
            
        db.commit()
        print("Successfully seeded 3 firewood categories.")
        
    except Exception as e:
        print(f"Error seeding categories: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()
