"""
FINAL FIX: Insert brikety + vugillya products into the CAKES table
(not 'products' — the ORM maps Product to 'cakes' table!)
"""
import ftplib
import sqlite3
import os
import json
import urllib.request
import ssl
import time

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
DB_REMOTE = "/www/backend/sql_app.db"
SITE_URL = "https://kievdrova.com.ua"
LOCAL_DB = "local_prod.db"

def main():
    # Clean up
    if os.path.exists(LOCAL_DB):
        os.remove(LOCAL_DB)
    for ext in ["-wal", "-shm"]:
        if os.path.exists(LOCAL_DB + ext):
            os.remove(LOCAL_DB + ext)
    
    # Step 1: Download
    print("STEP 1: Downloading DB...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    with open(LOCAL_DB, "wb") as f:
        ftp.retrbinary(f"RETR {DB_REMOTE}", f.write)
    ftp.quit()
    print(f"  Downloaded: {os.path.getsize(LOCAL_DB)} bytes")
    
    # Step 2: Open and inspect
    print("\nSTEP 2: Inspecting DB...")
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()
    
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cursor.fetchall()]
    print(f"  Tables: {tables}")
    
    # The Product model uses __tablename__ = "cakes"!
    cursor.execute("SELECT category, COUNT(*) FROM cakes GROUP BY category")
    counts = dict(cursor.fetchall())
    print(f"  Product counts by category: {counts}")
    
    # Step 3: Fix category images (already done but let's make sure)
    print("\nSTEP 3: Fixing category images...")
    for slug, img in [("drova", "/media/categories/firewood.webp"),
                       ("brikety", "/media/categories/briquettes.webp"),
                       ("vugillya", "/media/categories/coal.webp")]:
        cursor.execute("UPDATE category_metadata SET image_url = ? WHERE slug = ?", (img, slug))
        print(f"  {slug}: {cursor.rowcount} row(s) updated")
    conn.commit()
    
    # Step 4: Seed brikety into CAKES table
    print("\nSTEP 4: Seeding brikety products into 'cakes' table...")
    brikety_count = counts.get("brikety", 0)
    if brikety_count == 0:
        brikety = [
            ("Брикети RUF", "ruf-brikety", 12000, "/media/products/ruf.webp",
             "Брикети RUF — ефективне паливо з пресованої тирси. Теплотворність 4800-5200 ккал/кг.",
             "Деревна тирса", "До 10%"),
            ("Брикети Pini Kay", "pini-kay-brikety", 13000, "/media/products/pinikay.webp",
             "Брикети Pini Kay — преміум восьмигранні брикети з центральним каналом.",
             "Тирса твердих порід", "До 8%"),
            ("Брикети Nestro", "nestro-brikety", 8500, "/media/products/ruf.webp",
             "Брикети Nestro — циліндричні брикети без хімічних добавок.",
             "Деревна тирса", "До 12%"),
            ("Торфобрикети", "torfobriket", 9500, "/media/products/coal_ao.webp",
             "Торфобрикети — доступне паливо з тривалим горінням.",
             "Пресований торф", "До 15%"),
            ("Углеродні брикети", "uglerodni-brikety", 14000, "/media/products/coal_as.webp",
             "Углеродні брикети — максимальна теплотворність 7000-7500 ккал/кг.",
             "Деревне вугілля пресоване", "До 5%"),
            ("Пелети", "pelleti", 15500, "/media/products/pinikay.webp",
             "Пелети — паливо для автоматизованих котельних систем.",
             "Деревна тирса", "До 8%"),
        ]
        for p in brikety:
            cursor.execute("""
                INSERT INTO cakes (name, slug, price, image_url, description,
                                   category, ingredients, shelf_life, is_available, weight, stock_quantity)
                VALUES (?, ?, ?, ?, ?, 'brikety', ?, ?, 1, 1.0, 0)
            """, p)
            print(f"  + {p[0]}")
        conn.commit()
        print(f"  Inserted {len(brikety)} brikety products!")
    else:
        print(f"  Already has {brikety_count} brikety products, skipping.")
    
    # Step 5: Seed vugillya into CAKES table
    print("\nSTEP 5: Seeding vugillya products into 'cakes' table...")
    vugillya_count = counts.get("vugillya", 0)
    if vugillya_count == 0:
        vugillya = [
            ("Вугілля ДГ", "vugillya-dg", 7000, "/media/products/coal_ao.webp",
             "Вугілля ДГ (довгополуменеве газове) — доступне паливо для побутового опалення.",
             "Кам'яне вугілля марки ДГ", "Без обмежень"),
            ("Антрацит АМ 13-25", "antratsyt-am-13-25", 9500, "/media/products/coal_as.webp",
             "Антрацит АМ — преміум вугілля для автоматичних котлів.",
             "Антрацит фракція 13-25 мм", "Без обмежень"),
            ("Антрацит орех АО 25-50", "antratsyt-ao-25-50", 10000, "/media/products/coal_ao.webp",
             "Антрацит АО — універсальне вугілля для побутових котлів.",
             "Антрацит фракція 25-50 мм", "Без обмежень"),
            ("Антрацит крупний орех АКО 25-100", "antratsyt-ako-25-100", 11000, "/media/products/coal_as.webp",
             "Антрацит АКО — для потужних котлів з тривалим горінням.",
             "Антрацит фракція 25-100 мм", "Без обмежень"),
            ("Вугілля газове", "vugillya-gazove", 7500, "/media/products/coal_ao.webp",
             "Газове вугілля — надійне паливо з легким розпалом.",
             "Кам'яне вугілля газових марок", "Без обмежень"),
            ("Вугілля деревне", "vugillya-derevne", 6000, "/media/products/coal_as.webp",
             "Деревне вугілля — натуральне паливо для мангалів та печей.",
             "Деревне вугілля з твердих порід", "Без обмежень"),
        ]
        for p in vugillya:
            cursor.execute("""
                INSERT INTO cakes (name, slug, price, image_url, description,
                                   category, ingredients, shelf_life, is_available, weight, stock_quantity)
                VALUES (?, ?, ?, ?, ?, 'vugillya', ?, ?, 1, 1.0, 0)
            """, p)
            print(f"  + {p[0]}")
        conn.commit()
        print(f"  Inserted {len(vugillya)} vugillya products!")
    else:
        print(f"  Already has {vugillya_count} vugillya products, skipping.")
    
    # Final local check
    print("\nLocal DB final state:")
    cursor.execute("SELECT category, COUNT(*) FROM cakes GROUP BY category")
    for row in cursor.fetchall():
        print(f"  {row[0]}: {row[1]} products")
    
    cursor.execute("SELECT slug, image_url FROM category_metadata")
    for row in cursor.fetchall():
        print(f"  Category {row[0]}: image={row[1]}")
    
    # Switch journal mode
    cursor.execute("PRAGMA journal_mode=DELETE;")
    conn.close()
    
    # Step 6: Upload
    print(f"\nSTEP 6: Uploading modified DB ({os.path.getsize(LOCAL_DB)} bytes)...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    with open(LOCAL_DB, "rb") as f:
        ftp.storbinary(f"STOR {DB_REMOTE}", f)
    ftp.quit()
    print("  Uploaded!")
    
    # Step 7: Verify via API
    print("\nSTEP 7: Verifying via API (note: Passenger may cache old data for up to 5 min)...")
    time.sleep(3)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    for cat in ["drova", "brikety", "vugillya"]:
        try:
            ts = int(time.time())
            req = urllib.request.Request(
                f"{SITE_URL}/api/v1/products/?category={cat}&limit=20&_t={ts}",
                headers={"User-Agent": "Mozilla/5.0"},
            )
            resp = urllib.request.urlopen(req, timeout=10, context=ctx)
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            print(f"  {cat}: {len(items)} products")
            for p in items[:3]:
                print(f"    - {p.get('name')} (slug={p.get('slug')})")
        except Exception as e:
            print(f"  {cat}: Error: {e}")
    
    print("\n  Categories:")
    try:
        ts = int(time.time())
        req = urllib.request.Request(
            f"{SITE_URL}/api/v1/products/categories?_t={ts}",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        cats = json.loads(resp.read().decode("utf-8"))
        for c in cats:
            print(f"    {c['slug']}: image={c.get('image_url')}")
    except Exception as e:
        print(f"    Error: {e}")
    
    print("\nALL DONE!")


if __name__ == "__main__":
    main()
