import sys
import os

# Add backend directory to module search path so backend.* imports work
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from backend.src.core.database import SessionLocal
from backend.src.products.models import Product

to_remove = ["Дрова в ящиках", "Дрова для каміна", "Дрова в сітках", "Дрова для розпалу"]

db = SessionLocal()
try:
    print(f"Connected to DB.")
    products = db.query(Product).all()
    print(f"Total products in DB: {len(products)}")
    
    deleted = 0
    for p in products:
        if p.name in to_remove:
            print(f"Deleting {p.name} (ID: {p.id})")
            db.delete(p)
            deleted += 1
            
    if deleted > 0:
        db.commit()
        print(f"Successfully deleted {deleted} products.")
    else:
        print("No matching products found to delete.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
