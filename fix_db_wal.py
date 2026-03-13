"""
Download the SQLite DB + WAL + SHM files from HostUkraine,
checkpoint WAL, insert missing products & fix category images,
then upload back.
"""
import ftplib
import sqlite3
import os
import uuid
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
LOCAL_WAL = "local_prod.db-wal"
LOCAL_SHM = "local_prod.db-shm"

def download_file(ftp, remote, local):
    try:
        with open(local, "wb") as f:
            ftp.retrbinary(f"RETR {remote}", f.write)
        size = os.path.getsize(local)
        print(f"  Downloaded {remote} -> {local} ({size} bytes)")
        return True
    except Exception as e:
        print(f"  Failed {remote}: {e}")
        return False

def upload_file(ftp, local, remote):
    try:
        with open(local, "rb") as f:
            ftp.storbinary(f"STOR {remote}", f)
        size = os.path.getsize(local)
        print(f"  Uploaded {local} -> {remote} ({size} bytes)")
        return True
    except Exception as e:
        print(f"  Failed {local}: {e}")
        return False

def main():
    print("=" * 60)
    print("STEP 1: Download DB + WAL + SHM files")
    print("=" * 60)
    
    # Clean up old local files
    for f in [LOCAL_DB, LOCAL_WAL, LOCAL_SHM]:
        if os.path.exists(f):
            os.remove(f)
    
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    
    download_file(ftp, DB_REMOTE, LOCAL_DB)
    download_file(ftp, DB_REMOTE + "-wal", LOCAL_WAL)
    download_file(ftp, DB_REMOTE + "-shm", LOCAL_SHM)
    
    ftp.quit()
    
    print(f"\n  Local DB size: {os.path.getsize(LOCAL_DB)} bytes")
    if os.path.exists(LOCAL_WAL):
        print(f"  Local WAL size: {os.path.getsize(LOCAL_WAL)} bytes")
    if os.path.exists(LOCAL_SHM):
        print(f"  Local SHM size: {os.path.getsize(LOCAL_SHM)} bytes")
    
    print("\n" + "=" * 60)
    print("STEP 2: Checkpoint WAL and inspect tables")
    print("=" * 60)
    
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()
    
    # Checkpoint WAL to merge all data
    try:
        cursor.execute("PRAGMA wal_checkpoint(TRUNCATE);")
        print("  WAL checkpoint: OK")
    except:
        print("  WAL checkpoint: skipped (not in WAL mode)")
    
    # List tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = [r[0] for r in cursor.fetchall()]
    print(f"  Tables: {tables}")
    
    # Check product counts
    if "products" in tables:
        cursor.execute("SELECT category, COUNT(*) FROM products GROUP BY category")
        counts = cursor.fetchall()
        print(f"  Product counts: {dict(counts)}")
    else:
        print("  WARNING: No 'products' table found!")
    
    # Check categories
    if "category_metadata" in tables:
        cursor.execute("SELECT slug, name, image_url FROM category_metadata")
        cats = cursor.fetchall()
        for c in cats:
            print(f"  Category: {c[0]} | {c[1]} | image={c[2]}")
    
    print("\n" + "=" * 60)
    print("STEP 3: Fix category images")
    print("=" * 60)
    
    if "category_metadata" in tables:
        images = [
            ("/media/categories/firewood.webp", "drova"),
            ("/media/categories/briquettes.webp", "brikety"),
            ("/media/categories/coal.webp", "vugillya"),
        ]
        for img, slug in images:
            cursor.execute("UPDATE category_metadata SET image_url = ? WHERE slug = ?", (img, slug))
            print(f"  Updated {slug} image -> {img} (rows: {cursor.rowcount})")
        conn.commit()
    
    print("\n" + "=" * 60)
    print("STEP 4: Seed brikety products")
    print("=" * 60)
    
    if "products" in tables:
        cursor.execute("SELECT COUNT(*) FROM products WHERE category = 'brikety'")
        brikety_count = cursor.fetchone()[0]
        
        if brikety_count == 0:
            brikety_products = [
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
            
            for p in brikety_products:
                pid = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO products (id, name, slug, price, image_url, description, 
                                          category, ingredients, shelf_life, is_available, weight, stock_quantity)
                    VALUES (?, ?, ?, ?, ?, ?, 'brikety', ?, ?, 1, 1.0, 0)
                """, (pid, p[0], p[1], p[2], p[3], p[4], p[5], p[6]))
                print(f"  Inserted brikety: {p[0]}")
            conn.commit()
        else:
            print(f"  Brikety already has {brikety_count} products, skipping.")
    
    print("\n" + "=" * 60)
    print("STEP 5: Seed vugillya products")
    print("=" * 60)
    
    if "products" in tables:
        cursor.execute("SELECT COUNT(*) FROM products WHERE category = 'vugillya'")
        vugillya_count = cursor.fetchone()[0]
        
        if vugillya_count == 0:
            vugillya_products = [
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
            
            for p in vugillya_products:
                pid = str(uuid.uuid4())
                cursor.execute("""
                    INSERT INTO products (id, name, slug, price, image_url, description,
                                          category, ingredients, shelf_life, is_available, weight, stock_quantity)
                    VALUES (?, ?, ?, ?, ?, ?, 'vugillya', ?, ?, 1, 1.0, 0)
                """, (pid, p[0], p[1], p[2], p[3], p[4], p[5], p[6]))
                print(f"  Inserted vugillya: {p[0]}")
            conn.commit()
        else:
            print(f"  Vugillya already has {vugillya_count} products, skipping.")
    
    # Switch to DELETE journal mode before upload (avoid WAL issues on server)
    cursor.execute("PRAGMA journal_mode=DELETE;")
    print("\n  Switched to DELETE journal mode for upload safety.")
    
    conn.close()
    
    final_size = os.path.getsize(LOCAL_DB)
    print(f"\n  Final local DB size: {final_size} bytes")
    
    print("\n" + "=" * 60)
    print("STEP 6: Upload modified DB back to server")
    print("=" * 60)
    
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    
    upload_file(ftp, LOCAL_DB, DB_REMOTE)
    
    # Delete WAL and SHM on server to force clean start
    for suffix in ["-wal", "-shm"]:
        try:
            ftp.delete(DB_REMOTE + suffix)
            print(f"  Deleted remote {DB_REMOTE}{suffix}")
        except:
            print(f"  No remote {DB_REMOTE}{suffix} to delete")
    
    ftp.quit()
    
    print("\n" + "=" * 60)
    print("STEP 7: Verify via API (may need cache to expire)")
    print("=" * 60)
    
    time.sleep(3)
    
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    
    for cat_slug in ["drova", "brikety", "vugillya"]:
        try:
            ts = int(time.time())
            req = urllib.request.Request(
                f"{SITE_URL}/api/v1/products/?category={cat_slug}&limit=20&_t={ts}",
                headers={"User-Agent": "Mozilla/5.0"},
            )
            resp = urllib.request.urlopen(req, timeout=10, context=ctx)
            data = json.loads(resp.read().decode("utf-8"))
            items = data.get("items", [])
            print(f"  {cat_slug}: {len(items)} products")
            for p in items[:2]:
                print(f"    - {p.get('name')}")
        except Exception as e:
            print(f"  {cat_slug}: Error: {e}")
    
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
    
    print("\n" + "=" * 60)
    print("ALL DONE!")
    print("=" * 60)


if __name__ == "__main__":
    main()
