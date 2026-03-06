import sys, os, json
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend.src.core.database import SessionLocal
from backend.src.products.models import Product

def migrate_drova_variants():
    db = SessionLocal()
    
    drova_products = db.query(Product).filter(Product.category == "drova").all()
    print(f"Found {len(drova_products)} drova products to update.")
    
    for p in drova_products:
        base_price = p.price
        
        # If it's Oak (Dub), update the base price to 3800 as requested
        if p.slug == "dubovi-drova":
            p.price = 3800
            base_price = 3800
        
        new_variants = [
            {"name": "Колоті", "price": base_price},
            {"name": "Ящик 2 складометри", "price": base_price * 2}
        ]
        
        p.variants = new_variants
        print(f"Updated variants for {p.name} ({p.slug}) to new format. Base price: {base_price}")
        
    db.commit()
    db.close()
    print("Migration complete!")

if __name__ == "__main__":
    migrate_drova_variants()
