import ftplib
import sqlite3
import os
import urllib.request
import json
import time
import uuid

print('Step 1: Downloading the database...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

try:
    with open('local_sql_app.db', 'wb') as f:
        ftp.retrbinary('RETR /www/backend/src/core/sql_app.db', f.write)
    print('SUCCESS: Downloaded sql_app.db to local_sql_app.db')
except Exception as e:
    print('Failed to download DB:', e)

print('\nStep 2: Updating the local database...')
try:
    conn = sqlite3.connect('local_sql_app.db')
    cursor = conn.cursor()
    
    # Update category images
    images = [
        ('/media/categories/firewood.webp', 'drova'),
        ('/media/categories/briquettes.webp', 'brikety'),
        ('/media/categories/coal.webp', 'vugillya')
    ]
    for url, slug in images:
        cursor.execute("UPDATE category_metadata SET image_url = ? WHERE slug = ?", (url, slug))
    print('Updated category images.')
    
    # Seed briquettes and coal products
    new_products = [
        # Briquettes
        ("Брикети RUF (Дуб)", "briketi-ruf-dub", 8500, "/media/products/ruf.webp", "Брикети RUF з дубової тирси, 1 тонна.", "brikety", "Дубова тирса", "Необмежений"),
        ("Брикети Pini Kay", "briketi-pini-kay", 9000, "/media/products/pinikay.webp", "Брикети Pini Kay з отвором, 1 тонна.", "brikety", "Тирса твердих порід", "Необмежений"),
        ("Брикети Nestro (сосна)", "briketi-nestro-sosna", 7800, "/media/products/ruf.webp", "Циліндричні брикети Nestro з соснової тирси, 1 тонна.", "brikety", "Хвойна тирса", "Необмежений"),
        ("Брикети RUF Преміум", "briketi-ruf-premium", 9500, "/media/products/ruf.webp", "Брикети RUF з тирси твердих порід, висока щільність, 1 тонна.", "brikety", "Тирса дуб/граб", "Необмежений"),
        ("Торфобрикети", "torfobriketi", 6500, "/media/products/pinikay.webp", "Торф'яні брикети — бюджетний варіант для котлів, 1 тонна.", "brikety", "Торф", "Необмежений"),
        ("Брикети Pini Kay XL", "briketi-pini-kay-xl", 9800, "/media/products/pinikay.webp", "Великі брикети Pini Kay для котлів тривалого горіння, 1 тонна.", "brikety", "Тирса твердих порід", "Необмежений"),
        # Coal
        ("Вугілля Антрацит (Горіх)", "vugillya-antratsit-gorih", 12000, "/media/products/coal_ao.webp", "Вугілля АО (Антрацит Горіх) у мішках, 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Вугілля Антрацит (Насіння)", "vugillya-antratsit-nasinnya", 11500, "/media/products/coal_as.webp", "Вугілля АС (Антрацит Семєчко), 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Вугілля Газове (ДПК)", "vugillya-gazove-dpk", 9500, "/media/products/coal_as.webp", "Газове вугілля марки ДПК для промислових котлів, 1 тонна.", "vugillya", "Газове вугілля", "Необмежений"),
        ("Вугілля Антрацит (Куб АКО)", "vugillya-antratsit-kub-ako", 12500, "/media/products/coal_ao.webp", "Великий кубиковий антрацит АКО для великих котлів, 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Кокс металургійний", "koks-metalurgiyniy", 18000, "/media/products/coal_ao.webp", "Металургійний кокс для промислового опалення та ковальства, 1 тонна.", "vugillya", "Кокс", "Необмежений"),
        ("Вугілля Газове (ДО)", "vugillya-gazove-do", 9200, "/media/products/coal_as.webp", "Газове вугілля ДО (горіх), оптимальне для котлів АУСВ, 1 тонна.", "vugillya", "Газове вугілля", "Необмежений")
    ]
    
    for p in new_products:
        # Avoid duplicates
        cursor.execute("SELECT COUNT(*) FROM products WHERE slug = ?", (p[1],))
        if cursor.fetchone()[0] == 0:
            # Need a random uuid for ID? No, id is integer primary key autoincrement in models.py mostly. Wait! If products is GUID... 
            # In backend/src/products/models.py `id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))`
            pid = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO products (id, name, slug, price, image_url, description, category, ingredients, shelf_life, is_available)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            ''', (pid,) + p)
            print(f"Inserted: {p[0]}")
            
    conn.commit()
    conn.close()
    print('Local DB updated.')
except Exception as e:
    print('Error updating local DB:', e)

print('\nStep 3: Uploading the modified database back to HostUkraine...')
try:
    with open('local_sql_app.db', 'rb') as f:
        ftp.storbinary('STOR /www/backend/src/core/sql_app.db', f)
    print('SUCCESS: Uploaded modified sql_app.db back to /www/backend/src/core/')
except Exception as e:
    print('Failed to upload DB:', e)

ftp.quit()

print('\nStep 4: Triggering server restart payload to flush memory cache...')
try:
    urllib.request.urlopen("https://kievdrova.com.ua/kill_passenger.php", timeout=5)
    print("Passenger workers killed successfully.")
except Exception as e:
    print("Kill request error (expected if it drops conn):", e)

time.sleep(3)
