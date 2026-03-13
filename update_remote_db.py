import ftplib
import sqlite3
import os
import urllib.request
import json
import time

print('Step 1: Downloading the database...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

try:
    with open('local_sql_app.db', 'wb') as f:
        ftp.retrbinary('RETR /www/backend/sql_app.db', f.write)
    print('SUCCESS: Downloaded sql_app.db to local_sql_app.db')
except Exception as e:
    print('Failed to download DB:', e)

print('\nStep 2: Updating the local database...')
try:
    conn = sqlite3.connect('local_sql_app.db')
    cursor = conn.cursor()
    
    # Use double quotes to avoid escaping the apostrophe in кам'яне
    categories = [
        ("drova", "Дрова", "Якісні колоті дрова твердих порід з доставкою по Києву та області.", "TreePine"),
        ("brikety", "Брикети", "Ефективні паливні брикети RUF, Pini Kay та Nestro для тривалого горіння.", "Box"),
        ("vugillya", "Вугілля", "Висококалорійне кам'яне вугілля в мішках для котлів та печей.", "Flame")
    ]
    
    # Check if table exists
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='category_metadata'")
    if not cursor.fetchone():
        print('Creating category_metadata table just in case...')
        cursor.execute('''
        CREATE TABLE category_metadata (
            slug VARCHAR NOT NULL, 
            name VARCHAR NOT NULL, 
            description VARCHAR, 
            icon VARCHAR, 
            PRIMARY KEY (slug)
        )''')
    else:
        # Check if icon column exists, add it if not
        cursor.execute("PRAGMA table_info(category_metadata)")
        columns = [row[1] for row in cursor.fetchall()]
        if 'icon' not in columns:
            print("Adding missing 'icon' column to category_metadata...")
            cursor.execute("ALTER TABLE category_metadata ADD COLUMN icon VARCHAR")

    
    for c in categories:
        cursor.execute('SELECT COUNT(*) FROM category_metadata WHERE slug = ?', (c[0],))
        if cursor.fetchone()[0] == 0:
            cursor.execute(
                '''INSERT INTO category_metadata 
                (slug, name, description, icon, is_available, is_indexable) 
                VALUES (?, ?, ?, ?, 1, 1)''', 
                c
            )
            print(f'Inserted category: {c[0]}')
        else:
            print(f'Category already exists: {c[0]}')
            
    conn.commit()
    conn.close()
    print('Local DB updated.')
except Exception as e:
    print('Error updating local DB:', e)

print('\nStep 3: Uploading the modified database back to HostUkraine...')
try:
    with open('local_sql_app.db', 'rb') as f:
        ftp.storbinary('STOR /www/backend/sql_app.db', f)
    print('SUCCESS: Uploaded modified sql_app.db back to /www/backend/')
except Exception as e:
    print('Failed to upload DB:', e)

ftp.quit()

print('\nWaiting for FTP file propagation...')
time.sleep(3)

print('\nStep 4: Testing API endpoint...')
try:
    req = urllib.request.Request('https://kievdrova.com.ua/api/v1/products/categories/list', headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10)
    print(f'Categories HTTP {resp.status}')
    body = resp.read().decode('utf-8')
    try:
        data = json.loads(body)
        print(f'Items returned: {len(data)}')
        for cat in data:
            print(f" - {cat.get('name')} ({cat.get('slug')})")
    except:
        print('Raw response:', body[:200])
except Exception as e:
    print('Error testing API:', e)
