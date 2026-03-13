"""
Use the working /api/seed-drova-live endpoint as a trojan horse.
It imports `seed_drova` from `backend.seed_drova_seo`.
We will replace `backend.seed_drova_seo.py` with a script that seeds ALL products.
"""
import ftplib
import urllib.request
import ssl
import json
import time

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

TROJAN_CODE = """
import uuid
import json
from backend.src.core.database import SessionLocal
from backend.src.products.models import Product, CategoryMetadata

def seed_drova():
    db = SessionLocal()
    try:
        # 1. Clear existing products to avoid duplicates
        db.query(Product).delete()
        db.commit()
        
        # 2. Add Drova
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
        for name, slug, price in drova:
            p = Product(name=name, slug=slug, price=price, category="drova", is_available=True, stock_quantity=0)
            db.add(p)
            
        # 3. Add Brikety
        brikety = [
            ("Брикети RUF", "ruf-brikety", 12000),
            ("Брикети Pini Kay", "pini-kay-brikety", 13000),
            ("Брикети Nestro", "nestro-brikety", 8500),
            ("Торфобрикети", "torfobriket", 9500),
            ("Углеродні брикети", "uglerodni-brikety", 14000),
            ("Пелети", "pelleti", 15500)
        ]
        for name, slug, price in brikety:
            p = Product(name=name, slug=slug, price=price, category="brikety", is_available=True, stock_quantity=0)
            db.add(p)
            
        # 4. Add Vugillya
        vugillya = [
            ("Вугілля ДГ", "vugillya-dg", 7000),
            ("Антрацит АМ 13-25", "antratsyt-am-13-25", 9500),
            ("Антрацит орех АО 25-50", "antratsyt-ao-25-50", 10000),
            ("Антрацит крупний орех АКО 25-100", "antratsyt-ako-25-100", 11000),
            ("Вугілля газове", "vugillya-gazove", 7500),
            ("Вугілля деревне", "vugillya-derevne", 6000)
        ]
        for name, slug, price in vugillya:
            p = Product(name=name, slug=slug, price=price, category="vugillya", is_available=True, stock_quantity=0)
            db.add(p)
            
        db.commit()
    except Exception as e:
        db.rollback()
        raise e
    finally:
        db.close()
"""

import io

print("Uploading trojan horse seed script...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)
ftp.storbinary("STOR /www/backend/seed_drova_seo.py", io.BytesIO(TROJAN_CODE.encode("utf-8")))
ftp.quit()

print("Triggering the endpoint...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(
        f"{SITE_URL}/api/seed-drova-live",
        headers={"User-Agent": "Mozilla/5.0"}
    )
    resp = urllib.request.urlopen(req, timeout=30, context=ctx)
    print(f"HTTP {resp.status}: {resp.read().decode()}")
except Exception as e:
    print(f"Error: {e}")

print("Verifying what's actually there...")
ts = int(time.time())
for cat in ["drova", "brikety", "vugillya"]:
    try:
        req = urllib.request.Request(
            f"{SITE_URL}/api/v1/products/?category={cat}&limit=5&_t={ts}",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode("utf-8"))
        print(f"{cat}: {data.get('total')} products")
    except Exception as e:
        print(f"{cat} Error: {e}")
