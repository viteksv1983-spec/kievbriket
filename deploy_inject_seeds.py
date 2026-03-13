"""
Injects seed endpoints for brikety + vugillya + category images
directly into the LIVE main.py on HostUkraine, then triggers them.
"""
import ftplib
import io
import time
import urllib.request
import ssl
import json

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

# Code to append to main.py
INJECT_CODE = '''

# ─── INJECTED: Brikety + Vugillya + Category Image Seeder ───
@app.get("/api/v1/seed-brikety-now")
def seed_brikety_now(db: Session = Depends(get_db)):
    """Seed 6 brikety products with full SEO data."""
    try:
        from backend.seed_brikety_seo import PRODUCTS as BRIKETY_PRODUCTS
        from backend.seed_brikety_seo import make_seo_title, make_seo_desc, make_h1, make_canonical, make_schema, make_variants
        from backend.src.products.models import Product
        import json as _json
        
        # Delete existing brikety
        deleted = db.query(Product).filter(Product.category == "brikety").delete()
        db.commit()
        
        count = 0
        for p in BRIKETY_PRODUCTS:
            seo_title = make_seo_title(p["name"])
            seo_desc = make_seo_desc(p["name"])
            product = Product(
                name=p["name"],
                slug=p["slug"],
                price=p["price"],
                image_url=p["image"],
                description=p["desc"],
                is_available=True,
                weight=1.0,
                ingredients=p.get("ingredients", "Деревна тирса"),
                shelf_life=p.get("shelf_life", "Необмежений"),
                category="brikety",
                stock_quantity=0,
                variants=make_variants(p["price"]),
                meta_title=seo_title,
                meta_description=seo_desc,
                meta_keywords="брикети київ, купити брикети, паливні брикети доставка",
                h1_heading=make_h1(p["name"]),
                canonical_url=make_canonical(p["slug"]),
                og_title=seo_title,
                og_description=seo_desc,
                og_image=p["image"],
                schema_json=make_schema(p, seo_desc),
            )
            db.add(product)
            count += 1
        db.commit()
        return {"status": "success", "message": f"Seeded {count} brikety products", "deleted": deleted}
    except Exception as e:
        db.rollback()
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}


@app.get("/api/v1/seed-vugillya-now")
def seed_vugillya_now(db: Session = Depends(get_db)):
    """Seed 6 vugillya products with full SEO data."""
    try:
        from backend.seed_vugillya_seo import PRODUCTS as VUGILLYA_PRODUCTS
        from backend.seed_vugillya_seo import make_seo_title, make_seo_desc, make_h1, make_canonical, make_schema, make_variants
        from backend.src.products.models import Product
        
        # Delete existing vugillya
        deleted = db.query(Product).filter(Product.category == "vugillya").delete()
        db.commit()
        
        count = 0
        for p in VUGILLYA_PRODUCTS:
            seo_title = make_seo_title(p["name"])
            seo_desc = make_seo_desc(p["name"])
            product = Product(
                name=p["name"],
                slug=p["slug"],
                price=p["price"],
                image_url=p["image"],
                description=p["desc"],
                is_available=True,
                weight=1.0,
                ingredients=p.get("ingredients"),
                shelf_life=p.get("shelf_life"),
                category="vugillya",
                stock_quantity=0,
                variants=make_variants(p["price"]),
                faqs_json=[{"q": q, "a": a} for q, a in p["faq"]],
                meta_title=seo_title,
                meta_description=seo_desc,
                meta_keywords="вугілля київ, антрацит київ, камяне вугілля доставка",
                h1_heading=make_h1(p["name"]),
                canonical_url=make_canonical(p["slug"]),
                og_title=seo_title,
                og_description=seo_desc,
                og_image=p["image"],
                schema_json=make_schema(p, seo_desc),
            )
            db.add(product)
            count += 1
        db.commit()
        return {"status": "success", "message": f"Seeded {count} vugillya products", "deleted": deleted}
    except Exception as e:
        db.rollback()
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}


@app.get("/api/v1/fix-category-images")
def fix_category_images(db: Session = Depends(get_db)):
    """Update category images."""
    try:
        from backend.src.products.models import CategoryMetadata
        results = {}
        for slug, img in [("drova", "/media/categories/firewood.webp"),
                           ("brikety", "/media/categories/briquettes.webp"),
                           ("vugillya", "/media/categories/coal.webp")]:
            cat = db.query(CategoryMetadata).filter(CategoryMetadata.slug == slug).first()
            if cat:
                cat.image_url = img
                results[slug] = f"image set to {img}"
            else:
                results[slug] = "category not found!"
        db.commit()
        return {"status": "success", "results": results}
    except Exception as e:
        db.rollback()
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}
'''


def main():
    print("=" * 60)
    print("DEPLOYING SEED ENDPOINTS")
    print("=" * 60)

    # 1. Connect to FTP
    print("\n[1/5] Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    
    # 2. Download current live main.py
    print("[2/5] Downloading current live main.py...")
    buf = io.BytesIO()
    ftp.retrbinary("RETR /www/backend/main.py", buf.write)
    live_main = buf.getvalue().decode("utf-8")
    print(f"  Downloaded ({len(live_main)} bytes)")
    
    # Check if endpoints already exist
    if "seed-brikety-now" in live_main:
        print("  Endpoints already injected! Skipping injection.")
        patched = live_main
    else:
        print("  Injecting seed endpoints...")
        patched = live_main + INJECT_CODE
    
    # 3. Upload patched main.py
    print("[3/5] Uploading patched main.py...")
    ftp.storbinary("STOR /www/backend/main.py", io.BytesIO(patched.encode("utf-8")))
    print("  Done!")
    
    # Also restore a simple passenger_wsgi.py (no startup seeding, just the app)
    simple_wsgi = '''import sys, os
INTERP = os.path.join(os.getcwd(), "venv", "bin", "python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)
sys.path.insert(0, os.getcwd())
from backend.main import app as application
'''
    ftp.storbinary("STOR /www/passenger_wsgi.py", io.BytesIO(simple_wsgi.encode("utf-8")))
    print("  Restored simple passenger_wsgi.py")
    
    # Create restart trigger
    try:
        ftp.mkd("/www/tmp")
    except:
        pass
    ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(b"restart"))
    
    ftp.quit()
    
    # 4. Restart Passenger
    print("[4/5] Restarting Passenger...")
    try:
        urllib.request.urlopen(f"{SITE_URL}/kill_passenger.php", timeout=5)
    except:
        pass
    
    print("  Waiting 10s for restart...")
    time.sleep(10)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    # 5. Trigger seed endpoints
    print("[5/5] Triggering seed endpoints...")
    
    endpoints = [
        "/api/v1/fix-category-images",
        "/api/v1/seed-brikety-now",
        "/api/v1/seed-vugillya-now",
    ]
    
    for ep in endpoints:
        url = f"{SITE_URL}{ep}"
        print(f"\n  Calling {ep}...")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            resp = urllib.request.urlopen(req, timeout=30, context=ctx)
            body = resp.read().decode("utf-8")
            data = json.loads(body)
            print(f"  -> {json.dumps(data, indent=2, ensure_ascii=False)}")
        except urllib.error.HTTPError as e:
            print(f"  -> HTTP {e.code}")
            try:
                print(f"     {e.read().decode()[:300]}")
            except:
                pass
        except Exception as e:
            print(f"  -> Error: {e}")
    
    # Final verification
    print("\n" + "=" * 60)
    print("FINAL VERIFICATION")
    print("=" * 60)
    
    time.sleep(2)
    
    for cat_slug in ["drova", "brikety", "vugillya"]:
        try:
            req = urllib.request.Request(
                f"{SITE_URL}/api/v1/products/?category={cat_slug}&limit=20",
                headers={"User-Agent": "Mozilla/5.0"},
            )
            resp = urllib.request.urlopen(req, timeout=10, context=ctx)
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            print(f"\n  {cat_slug}: {len(items)} products")
            for p in items[:2]:
                print(f"    - {p.get('name')}")
        except Exception as e:
            print(f"  {cat_slug}: Error: {e}")
    
    print("\n  Categories:")
    try:
        req = urllib.request.Request(f"{SITE_URL}/api/v1/products/categories", headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        cats = json.loads(resp.read().decode("utf-8"))
        for c in cats:
            print(f"    {c['slug']}: image={c.get('image_url')}")
    except Exception as e:
        print(f"    Error: {e}")
    
    print("\n" + "=" * 60)
    print("DONE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
