"""
Deploy script: uploads seed scripts + triggers them via passenger_wsgi.py startup.
This ensures brikety + vugillya products AND category images are seeded on HostUkraine.
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

# passenger_wsgi.py that runs seeding on startup, then hands off to FastAPI
PASSENGER_WSGI = r'''
import sys, os

# Ensure correct venv Python
INTERP = os.path.join(os.getcwd(), "venv", "bin", "python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.getcwd())

# ─── ONE-TIME SEEDING ON STARTUP ───
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("startup_seed")

try:
    from backend.src.core.database import SessionLocal, engine, Base
    from backend.src.products.models import Product, CategoryMetadata
    
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # 1. Update category images
    for slug, img in [("drova", "/media/categories/firewood.webp"),
                       ("brikety", "/media/categories/briquettes.webp"),
                       ("vugillya", "/media/categories/coal.webp")]:
        cat = db.query(CategoryMetadata).filter(CategoryMetadata.slug == slug).first()
        if cat:
            cat.image_url = img
            logger.info(f"Updated image for {slug}")
    db.commit()
    
    # 2. Seed brikety if missing
    brikety_count = db.query(Product).filter(Product.category == "brikety").count()
    if brikety_count == 0:
        logger.info("Seeding brikety products...")
        try:
            from backend.seed_brikety_seo import seed_brikety
            seed_brikety()
            logger.info("Brikety seeded OK!")
        except Exception as e:
            logger.error(f"Brikety seed error: {e}")
    else:
        logger.info(f"Brikety already have {brikety_count} products, skipping.")
    
    # 3. Seed vugillya if missing
    vugillya_count = db.query(Product).filter(Product.category == "vugillya").count()
    if vugillya_count == 0:
        logger.info("Seeding vugillya products...")
        try:
            from backend.seed_vugillya_seo import seed_vugillya
            seed_vugillya()
            logger.info("Vugillya seeded OK!")
        except Exception as e:
            logger.error(f"Vugillya seed error: {e}")
    else:
        logger.info(f"Vugillya already have {vugillya_count} products, skipping.")
    
    db.close()
    logger.info("Startup seeding complete!")
except Exception as e:
    logger.error(f"Startup seed failed: {e}")

# ─── NORMAL APP STARTUP ───
from backend.main import app as application
'''


def upload_file(ftp, local_path, remote_path):
    """Upload a local file to the FTP server."""
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)
    print(f"  Uploaded: {local_path} -> {remote_path}")


def main():
    print("=" * 60)
    print("DEPLOYING SEED SCRIPTS TO HOSTUKRAINE")
    print("=" * 60)

    # Connect to FTP
    print("\n[1/4] Connecting to FTP...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    print("  Connected!")

    # Upload seed scripts
    print("\n[2/4] Uploading seed scripts...")
    upload_file(ftp, "backend/seed_brikety_seo.py", "/www/backend/seed_brikety_seo.py")
    upload_file(ftp, "backend/seed_vugillya_seo.py", "/www/backend/seed_vugillya_seo.py")
    upload_file(ftp, "backend/seed_drova_seo.py", "/www/backend/seed_drova_seo.py")

    # Upload modified passenger_wsgi.py with seed logic
    print("\n[3/4] Uploading passenger_wsgi.py with startup seeding...")
    ftp.storbinary("STOR /www/passenger_wsgi.py", io.BytesIO(PASSENGER_WSGI.encode("utf-8")))
    print("  passenger_wsgi.py uploaded!")

    # Create restart trigger
    try:
        ftp.mkd("/www/tmp")
    except:
        pass
    ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(b"restart"))
    print("  Restart trigger created!")

    ftp.quit()
    print("  FTP connection closed.")

    # Kill old Passenger workers
    print("\n[4/4] Triggering Passenger restart...")
    try:
        urllib.request.urlopen(f"{SITE_URL}/kill_passenger.php", timeout=5)
        print("  kill_passenger.php executed.")
    except:
        print("  kill_passenger.php - no response (expected)")

    # Wait for Passenger to restart and execute the seed
    print("\nWaiting 8 seconds for Passenger to restart and run seeding...")
    time.sleep(8)

    # Warm up the app (first request triggers passenger_wsgi.py)
    print("\nWarming up the application (this triggers seeding)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    try:
        req = urllib.request.Request(f"{SITE_URL}/api/v1/products/?limit=1", headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=30, context=ctx)
        print(f"  Warmup response: HTTP {resp.status}")
    except Exception as e:
        print(f"  Warmup error: {e}")

    time.sleep(3)

    # Verify results
    print("\n" + "=" * 60)
    print("VERIFICATION")
    print("=" * 60)

    # Check categories
    print("\nCategories:")
    try:
        req = urllib.request.Request(f"{SITE_URL}/api/v1/products/categories", headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        cats = json.loads(resp.read().decode("utf-8"))
        for c in cats:
            img = c.get("image_url", "NONE")
            print(f"  {c['slug']}: {c['name']} | image: {img}")
    except Exception as e:
        print(f"  Error: {e}")

    # Check products per category
    for cat_slug in ["drova", "brikety", "vugillya"]:
        print(f"\nProducts in '{cat_slug}':")
        try:
            req = urllib.request.Request(
                f"{SITE_URL}/api/v1/products/?category={cat_slug}&limit=20",
                headers={"User-Agent": "Mozilla/5.0"},
            )
            resp = urllib.request.urlopen(req, timeout=10, context=ctx)
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            print(f"  Total: {len(items)}")
            for p in items[:3]:
                print(f"    - {p['name']} ({p['slug']})")
            if len(items) > 3:
                print(f"    ... and {len(items) - 3} more")
        except Exception as e:
            print(f"  Error: {e}")

    print("\n" + "=" * 60)
    print("DEPLOYMENT COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
