import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from backend.src.core.database import SessionLocal, engine, Base
from backend.src.pages.models import Page

def seed_pages():
    db = SessionLocal()
    
    pages_to_seed = [
        {"route_path": "/", "name": "Головна сторінка"},
        {"route_path": "/delivery", "name": "Доставка та Оплата"},
        {"route_path": "/contacts", "name": "Контакти"}
    ]

    for p in pages_to_seed:
        existing = db.query(Page).filter(Page.route_path == p["route_path"]).first()
        if not existing:
            new_page = Page(
                route_path=p["route_path"],
                name=p["name"],
                meta_title="",
                meta_description="",
                h1_heading="",
                content="",
                bottom_seo_text=""
            )
            db.add(new_page)
            print(f"Created page: {p['route_path']}")
        else:
            print(f"Page already exists: {p['route_path']}")

    db.commit()
    db.close()
    print("Database seeded with default pages.")

if __name__ == "__main__":
    seed_pages()
