import ftplib
import io
import time
import urllib.request

wsgi_content = """import sys
import os
import sqlite3
import uuid
import datetime

def log(msg):
    try:
        with open('/home/leadgin/kievdrova.com.ua/www/wsgi_seed.log', 'a', encoding='utf-8') as f:
            f.write(f"[{datetime.datetime.now()}] {msg}\\n")
    except:
        pass

try:
    log("starting wsgi seeder")
    db_path = '/home/leadgin/kievdrova.com.ua/www/backend/src/core/sql_app.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # categories
    images = [
        ('/media/categories/firewood.webp', 'drova'),
        ('/media/categories/briquettes.webp', 'brikety'),
        ('/media/categories/coal.webp', 'vugillya')
    ]
    for url, slug in images:
        cursor.execute("UPDATE category_metadata SET image_url = ? WHERE slug = ?", (url, slug))
        
    briquettes = [
        ("Брикети RUF (Дуб)", "briketi-ruf-dub", 8500, "/media/products/ruf.webp", "Брикети RUF з дубової тирси, 1 тонна.", "brikety", "Дубова тирса", "Необмежений"),
        ("Брикети Pini Kay", "briketi-pini-kay", 9000, "/media/products/pinikay.webp", "Брикети Pini Kay з отвором, 1 тонна.", "brikety", "Тирса твердих порід", "Необмежений"),
        ("Брикети Nestro (сосна)", "briketi-nestro-sosna", 7800, "/media/products/ruf.webp", "Циліндричні брикети Nestro з соснової тирси, 1 тонна.", "brikety", "Хвойна тирса", "Необмежений"),
        ("Брикети RUF Преміум", "briketi-ruf-premium", 9500, "/media/products/ruf.webp", "Брикети RUF з тирси твердих порід, висока щільність, 1 тонна.", "brikety", "Тирса дуб/граб", "Необмежений"),
        ("Торфобрикети", "torfobriketi", 6500, "/media/products/pinikay.webp", "Торф'яні брикети — бюджетний варіант для котлів, 1 тонна.", "brikety", "Торф", "Необмежений"),
        ("Брикети Pini Kay XL", "briketi-pini-kay-xl", 9800, "/media/products/pinikay.webp", "Великі брикети Pini Kay для котлів тривалого горіння, 1 тонна.", "brikety", "Тирса твердих порід", "Необмежений"),
        ("Вугілля Антрацит (Горіх)", "vugillya-antratsit-gorih", 12000, "/media/products/coal_ao.webp", "Вугілля АО (Антрацит Горіх) у мішках, 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Вугілля Антрацит (Насіння)", "vugillya-antratsit-nasinnya", 11500, "/media/products/coal_as.webp", "Вугілля АС (Антрацит Семєчко), 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Вугілля Газове (ДПК)", "vugillya-gazove-dpk", 9500, "/media/products/coal_as.webp", "Газове вугілля марки ДПК для промислових котлів, 1 тонна.", "vugillya", "Газове вугілля", "Необмежений"),
        ("Вугілля Антрацит (Куб АКО)", "vugillya-antratsit-kub-ako", 12500, "/media/products/coal_ao.webp", "Великий кубиковий антрацит АКО для великих котлів, 1 тонна.", "vugillya", "Антрацит", "Необмежений"),
        ("Кокс металургійний", "koks-metalurgiyniy", 18000, "/media/products/coal_ao.webp", "Металургійний кокс для промислового опалення та ковальства, 1 тонна.", "vugillya", "Кокс", "Необмежений"),
        ("Вугілля Газове (ДО)", "vugillya-gazove-do", 9200, "/media/products/coal_as.webp", "Газове вугілля ДО (горіх), оптимальне для котлів АУСВ, 1 тонна.", "vugillya", "Газове вугілля", "Необмежений")
    ]
    
    for p in briquettes:
        cursor.execute("SELECT COUNT(*) FROM products WHERE slug = ?", (p[1],))
        if cursor.fetchone()[0] == 0:
            pid = str(uuid.uuid4())
            cursor.execute('''
            INSERT INTO products (id, name, slug, price, image_url, description, category, ingredients, shelf_life, is_available, is_visible)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
            ''', (pid,) + p)
            log(f"Inserted {p[1]}")
            
    conn.commit()
    conn.close()
    log("finished wsgi seeder")
except Exception as e:
    log(f"Error: {e}")

try:
    from backend.main import app as application
except Exception as e:
    log(f"Import error: {e}")
"""

print('Uploading passenger_wsgi.py to HostUkraine...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(wsgi_content.encode('utf-8')))

try:
    ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(b'restart flag'))
except:
    pass

ftp.quit()

print('Wait for restart...')
time.sleep(3)
try:
    urllib.request.urlopen("https://kievdrova.com.ua/kill_passenger.php", timeout=5)
except:
    pass

time.sleep(4)
print('Done. The site should now seed products on its next request load (or this initial one if kill PHP succeeded).')
