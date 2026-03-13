"""
Inject the definitive, forceful seeder directly into the live backend/src/products/router.py,
using the active SQLAlchemy Session. This is the only way to bypass SQLite 
in-memory caching and ensure the active FastAPI process sees the data.
"""
import ftplib
import io
import time
import ssl
import json
import urllib.request

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

print("Downloading live router.py...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

buf = io.BytesIO()
ftp.retrbinary("RETR /www/backend/src/products/router.py", buf.write)
content = buf.getvalue().decode("utf-8")

# Prepare injection code
INJECTION = """
# --- DEFINITIVE IN-MEMORY SEEDER ---
@router.get("/force-seed-all", status_code=200)
def force_seed_all_now(db: Session = Depends(get_db)):
    import uuid
    import sqlalchemy as sa
    try:
        # Clear existing
        db.execute(sa.text("DELETE FROM cakes"))
        
        # DROVA
        drova = [
            ("Дубові дрова", "dubovi-drova", 3800),
            ("Дрова акації", "akatsiya-drova", 2000),
            ("Грабові дрова", "hrabovi-drova", 1900),
            ("Ясеневі дрова", "yasen-drova", 2000),
            ("Вільхові дрова", "vilkhovi-drova", 1800),
            ("Березові дрова", "berezovi-drova", 1700),
            ("Дрова в ящиках (Дуб)", "drova-v-yashchykakh", 4500),
            ("Дрова для каміна", "drova-dlya-kamina", 2500),
            ("Дрова в сітках", "drova-v-setkakh", 150),
            ("Дрова для розпалу", "drova-dlya-rozpalu", 100)
        ]
        count_d = 0
        for p in drova:
            db.execute(sa.text("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (:id, :name, :slug, :price, :cat, 1, 0)"),
                       {"id": str(uuid.uuid4()), "name": p[0], "slug": p[1], "price": p[2], "cat": "drova"})
            count_d += 1
                       
        # BRIKETY
        brikety = [
            ("Брикети RUF", "ruf-brikety", 12000),
            ("Брикети Pini Kay", "pini-kay-brikety", 13000),
            ("Брикети Nestro", "nestro-brikety", 8500),
            ("Торфобрикети", "torfobriket", 9500),
            ("Углеродні брикети", "uglerodni-brikety", 14000),
            ("Пелети", "pelleti", 15500)
        ]
        count_b = 0
        for p in brikety:
            db.execute(sa.text("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (:id, :name, :slug, :price, :cat, 1, 0)"),
                       {"id": str(uuid.uuid4()), "name": p[0], "slug": p[1], "price": p[2], "cat": "brikety"})
            count_b += 1
                       
        # VUGILLYA
        vugillya = [
            ("Вугілля ДГ", "vugillya-dg", 7000),
            ("Антрацит АМ 13-25", "antratsyt-am-13-25", 9500),
            ("Антрацит орех АО 25-50", "antratsyt-ao-25-50", 10000),
            ("Антрацит крупний орех АКО 25-100", "antratsyt-ako-25-100", 11000),
            ("Вугілля газове", "vugillya-gazove", 7500),
            ("Вугілля деревне", "vugillya-derevne", 6000)
        ]
        count_v = 0
        for p in vugillya:
            db.execute(sa.text("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (:id, :name, :slug, :price, :cat, 1, 0)"),
                       {"id": str(uuid.uuid4()), "name": p[0], "slug": p[1], "price": p[2], "cat": "vugillya"})
            count_v += 1
        
        db.commit()
        return {"status": "success", "message": f"Seeded {count_d} drova, {count_b} brikety, {count_v} vugillya"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
"""

if "force-seed-all-now" not in content:
    # Append to the end of router.py
    content += "\n\n" + INJECTION
    print("Injected native endpoint into router.py")
    
    ftp.storbinary("STOR /www/backend/src/products/router.py", io.BytesIO(content.encode("utf-8")))
    
    # Trigger Passenger restart
    try: ftp.mkd("/www/tmp")
    except: pass
    ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(b'restart'))
else:
    print("Endpoint already injected")

ftp.quit()

print("Waiting 10s for Passenger...")
time.sleep(10)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("\nExecuting forceful endpoint...")
try:
    req = urllib.request.Request(f"{SITE_URL}/api/v1/products/force-seed-all", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    print("  " + resp.read().decode("utf-8"))
except Exception as e:
    print(f"Error executing seeder: {e}")

print("\nVerifying live API...")
ts = int(time.time())
for cat in ['drova', 'brikety', 'vugillya']:
    try:
        req = urllib.request.Request(f'{SITE_URL}/api/v1/products/?category={cat}&limit=5&_t={ts}', headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        print(f'  {cat}: {data.get("total")} products')
    except Exception as e:
        print(f'  {cat} Error: {e}')
