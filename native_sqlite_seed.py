"""
Deploy a one-off python script to search for the ACTUAL sql_app.db,
connect to it, empty the cakes table, insert the 22 products, and exit.
This guarantees we are writing to the right place.
"""
import ftplib
import io
import time
import ssl
import urllib.request

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

NATIVE_SEEDER = """
import os
import sqlite3
import uuid

# Find all sql_app.db files in the project
target_dbs = []
for root, dirs, files in os.walk('/home/leadgin/kievdrova.com.ua/www'):
    if 'sql_app.db' in files:
        target_dbs.append(os.path.join(root, 'sql_app.db'))

results = []

for db_path in target_dbs:
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if it has a 'cakes' table
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='cakes'")
        if not cursor.fetchone():
            conn.close()
            continue
            
        results.append(f"Found active DB at {db_path}")
        
        # Update category images
        cursor.execute("UPDATE category_metadata SET image_url = '/media/categories/firewood.webp' WHERE slug = 'drova'")
        cursor.execute("UPDATE category_metadata SET image_url = '/media/categories/briquettes.webp' WHERE slug = 'brikety'")
        cursor.execute("UPDATE category_metadata SET image_url = '/media/categories/coal.webp' WHERE slug = 'vugillya'")
        
        # Delete all existing products (cakes)
        cursor.execute("DELETE FROM cakes")
        
        # --- DROVA ---
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
        count = 0
        for p in drova:
            cursor.execute("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (?, ?, ?, ?, ?, 1, 0)", 
                          (str(uuid.uuid4()), p[0], p[1], p[2], 'drova'))
            count += 1
        results.append(f"Inserted {count} drova items")
        
        # --- BRIKETY ---
        brikety = [
            ("Брикети RUF", "ruf-brikety", 12000),
            ("Брикети Pini Kay", "pini-kay-brikety", 13000),
            ("Брикети Nestro", "nestro-brikety", 8500),
            ("Торфобрикети", "torfobriket", 9500),
            ("Углеродні брикети", "uglerodni-brikety", 14000),
            ("Пелети", "pelleti", 15500)
        ]
        count = 0
        for p in brikety:
            cursor.execute("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (?, ?, ?, ?, ?, 1, 0)", 
                          (str(uuid.uuid4()), p[0], p[1], p[2], 'brikety'))
            count += 1
        results.append(f"Inserted {count} brikety items")
        
        # --- VUGILLYA ---
        vugillya = [
            ("Вугілля ДГ", "vugillya-dg", 7000),
            ("Антрацит АМ 13-25", "antratsyt-am-13-25", 9500),
            ("Антрацит орех АО 25-50", "antratsyt-ao-25-50", 10000),
            ("Антрацит крупний орех АКО 25-100", "antratsyt-ako-25-100", 11000),
            ("Вугілля газове", "vugillya-gazove", 7500),
            ("Вугілля деревне", "vugillya-derevne", 6000)
        ]
        count = 0
        for p in vugillya:
            cursor.execute("INSERT INTO cakes (id, name, slug, price, category, is_available, stock_quantity) VALUES (?, ?, ?, ?, ?, 1, 0)", 
                          (str(uuid.uuid4()), p[0], p[1], p[2], 'vugillya'))
            count += 1
        results.append(f"Inserted {count} vugillya items")
        
        # Verify
        cursor.execute("SELECT category, COUNT(*) FROM cakes GROUP BY category")
        for row in cursor.fetchall():
            results.append(f"  Final count for {row[0]}: {row[1]}")
            
        conn.commit()
        conn.close()
    except Exception as e:
        results.append(f"Error on {db_path}: {e}")

print('\\n'.join(results))
"""

# Wrapper PHP to execute the python script
PHP_WRAPPER = b"""<?php
header('Content-Type: text/plain');
$output = shell_exec('/home/leadgin/kievdrova.com.ua/www/venv/bin/python /home/leadgin/kievdrova.com.ua/www/php/native_seed.py 2>&1');
echo $output;
?>"""

print("Uploading NATIVE Python seeder and PHP wrapper...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)
ftp.storbinary('STOR /www/php/native_seed.py', io.BytesIO(NATIVE_SEEDER.encode('utf-8')))
ftp.storbinary('STOR /www/php/run_native_seed.php', io.BytesIO(PHP_WRAPPER))

# Trigger Passenger Restart too
try: ftp.mkd('/www/tmp')
except: pass
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(b'restart'))
ftp.quit()

print("Executing Native Seeder...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(f"{SITE_URL}/php/run_native_seed.php", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    print("\n" + "="*40)
    print(resp.read().decode("utf-8"))
    print("="*40 + "\n")
except Exception as e:
    print(f"Error executing seeder: {e}")

print("Wait 10 seconds for Passenger...")
time.sleep(10)

print("Verifying live API...")
import json
ts = int(time.time())
for cat in ['drova', 'brikety', 'vugillya']:
    try:
        req = urllib.request.Request(f'{SITE_URL}/api/v1/products/?category={cat}&limit=5&_t={ts}', headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        print(f'  {cat}: {data.get("total")} products')
    except Exception as e:
        print(f'  {cat} Error: {e}')
