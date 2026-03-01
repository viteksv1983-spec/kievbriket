"""
Migration script: fix existing CategoryMetadata records.
- Set proper Ukrainian names for categories that have "Unnamed Category"
- Ensure all categories have valid slugs
- Safe: only updates, never deletes.
"""
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.src.core.database import SessionLocal
from backend.src.products.models import CategoryMetadata
from backend.src.core.slugify import generate_slug, ensure_unique_slug

# Known slug → proper Ukrainian name mapping
SLUG_TO_NAME = {
    "firewood": "Дрова",
    "briquettes": "Паливні брикети",
    "coal": "Вугілля",
}


def migrate():
    db = SessionLocal()
    try:
        categories = db.query(CategoryMetadata).all()
        updated = 0

        for cat in categories:
            changed = False

            # Fix missing or default names
            if not cat.name or cat.name == "Unnamed Category":
                if cat.slug in SLUG_TO_NAME:
                    cat.name = SLUG_TO_NAME[cat.slug]
                    changed = True
                    print(f"  [NAME] {cat.slug} → '{cat.name}'")

            # Fix missing slugs (generate from name)
            if not cat.slug and cat.name:
                new_slug = generate_slug(cat.name)
                cat.slug = ensure_unique_slug(db, CategoryMetadata, new_slug, exclude_id=cat.id)
                changed = True
                print(f"  [SLUG] '{cat.name}' → {cat.slug}")

            if changed:
                updated += 1

        if updated > 0:
            db.commit()
            print(f"\n[OK] Updated {updated} categories.")
        else:
            print("[OK] All categories already have correct names and slugs. Nothing to do.")

        # Print summary
        print("\nCurrent categories:")
        for cat in db.query(CategoryMetadata).all():
            print(f"  id={cat.id}  slug='{cat.slug}'  name='{cat.name}'")

    finally:
        db.close()


if __name__ == "__main__":
    migrate()
