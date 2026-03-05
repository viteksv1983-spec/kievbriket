import sys
import os
import json

# Add project root to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.src.core.database import SessionLocal
from backend.src.products.models import Product

def update_briquettes_seo():
    db = SessionLocal()
    products = db.query(Product).filter(Product.category == 'brikety').all()
    
    seo_map = {
        'brykety-ruf-dub': {
            'meta_title': 'Купити брикети RUF дуб у Києві — доставка | КиївБрикет',
            'meta_description': 'Якісні паливні брикети RUF з дубової тирси. Висока тепловіддача та мінімум попелу. Доставка по Києву та області.',
            'h1_heading': 'Брикети RUF (дуб) — паливні брикети для котлів та печей'
        },
        'brykety-pini-kay': {
            'meta_title': 'Купити брикети Pini Kay у Києві — євродрова | КиївБрикет',
            'h1_heading': 'Брикети Pini Kay — євродрова з підвищеною тепловіддачею'
        },
        'brykety-nestro': {
            'meta_title': 'Купити брикети Nestro у Києві — циліндричні брикети | КиївБрикет',
        },
        'torfobrykety': {
            'meta_title': 'Купити торфобрикети у Києві — економне опалення | КиївБрикет',
        }
    }

    updated = 0
    for product in products:
        # Default auto-generation if not in map
        new_title = f"Купити {product.name.lower()} у Києві — доставка | КиївБрикет"
        new_desc = f"Замовляйте {product.name.lower()} з швидкою доставкою по Києву та області."
        new_h1 = product.name
        
        # Override with exact map if exists
        if product.slug in seo_map:
            data = seo_map[product.slug]
            new_title = data.get('meta_title', new_title)
            new_desc = data.get('meta_description', new_desc)
            new_h1 = data.get('h1_heading', new_h1)

        # Set DB fields explicitly
        product.meta_title = new_title
        product.meta_description = new_desc
        product.h1_heading = new_h1
        product.og_title = new_title
        product.og_description = new_desc
        
        updated += 1

    db.commit()
    print(f"✅ Successfully updated SEO data for {updated} briquette products in the database!")
    db.close()

if __name__ == "__main__":
    update_briquettes_seo()
