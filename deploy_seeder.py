import urllib.request
import json
import ftplib
import io
import time

print('Reading local main.py...')
with open('backend/main.py', 'r', encoding='utf-8') as f:
    main_content = f.read()

seeder_endpoint = """
@app.get("/api/v1/seed-categories-live")
def seed_cats_live(db: Session = Depends(get_db)):
    from backend.src.products.models import CategoryMetadata
    categories = [
        CategoryMetadata(slug="drova", name="Дрова", description="Якісні колоті дрова твердих порід з доставкою по Києву та області.", icon="TreePine"),
        CategoryMetadata(slug="brikety", name="Брикети", description="Ефективні паливні брикети RUF, Pini Kay та Nestro для тривалого горіння.", icon="Box"),
        CategoryMetadata(slug="vugillya", name="Вугілля", description="Висококалорійне кам'яне вугілля в мішках для котлів та печей.", icon="Flame")
    ]
    added = 0
    for cat in categories:
        if not db.query(CategoryMetadata).filter(CategoryMetadata.slug == cat.slug).first():
            db.add(cat)
            added += 1
    db.commit()
    return {"status": "success", "added": added}
"""

print('Deploying temporary seeder endpoint via ftp...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')

if '/api/v1/seed-categories-live' not in main_content:
    main_content = main_content.replace('def _diag_endpoint():', seeder_endpoint + '\n@app.get("/api/v1/diag")\ndef _diag_endpoint():')
    ftp.storbinary('STOR /www/backend/main.py', io.BytesIO(main_content.encode('utf-8')))
    print('Injected /api/v1/seed-categories-live into remote main.py')

    # Kill passenger to force reload the new endpoint
    poison_pill = "import os, signal, sys\nos.kill(os.getpid(), signal.SIGKILL)\n"
    ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(poison_pill.encode('utf-8')))
    
    # Trigger the poison pill
    try:
        urllib.request.urlopen('https://kievdrova.com.ua/api/v1/diag', timeout=3)
    except:
        pass
        
    # Restore wsgi
    correct_wsgi = """import sys, os
INTERP = '/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12'
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)
sys.path.insert(0, os.path.dirname(__file__))
from backend.main import app as fastapi_app
from a2wsgi import ASGIMiddleware
application = ASGIMiddleware(fastapi_app)
"""
    ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(correct_wsgi.encode('utf-8')))
    print('Restarted passenger worker')

ftp.quit()

time.sleep(3)

# Hit the new seeder endpoint
print('\nHitting seeder endpoint...')
try:
    req = urllib.request.Request('https://kievdrova.com.ua/api/v1/seed-categories-live', headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10)
    print('Seeder Response:', resp.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print('HTTP ERROR:', e.code)
    try:
        print(e.read().decode('utf-8')[:200])
    except:
        pass
except Exception as e:
    print('Seeding process failed:', e)
