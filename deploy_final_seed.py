import ftplib
import io
import urllib.request
import time

seed_endpoint = '''
import uuid
from sqlalchemy import text
@app.get("/api/v1/seed-final-live")
def seed_final_live(db: Session = Depends(get_db)):
    try:
        # Update category images
        images = [
            ('/media/categories/firewood.webp', 'drova'),
            ('/media/categories/briquettes.webp', 'brikety'),
            ('/media/categories/coal.webp', 'vugillya')
        ]
        for url, slug in images:
            db.execute(text("UPDATE category_metadata SET image_url = :url WHERE slug = :slug"), {"url": url, "slug": slug})
        
        # Insert Briquettes
        briquettes = [
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
        
        inserted = 0
        for p in briquettes:
            # check if exists
            exists = db.execute(text("SELECT COUNT(*) FROM products WHERE slug = :slug"), {"slug": p[1]}).scalar()
            if exists == 0:
                pid = str(uuid.uuid4())
                db.execute(text("""
                INSERT INTO products (id, name, slug, price, image_url, description, category, ingredients, shelf_life, is_available)
                VALUES (:id, :name, :slug, :price, :image_url, :desc, :cat, :ing, :shelf, 1)
                """), {"id": pid, "name": p[0], "slug": p[1], "price": p[2], "image_url": p[3], "desc": p[4], "cat": p[5], "ing": p[6], "shelf": p[7]})
                inserted += 1
                
        db.commit()
        return {"status": "success", "message": f"Images updated, Categories verified, {inserted} products inserted"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}
'''

def main():
    print("Reading local main.py...")
    with open("backend/main.py", "r", encoding="utf-8") as f:
        content = f.read()
    
    # insert after the last route logic but before the end
    output = content + "\n" + seed_endpoint
    
    print("Uploading patched main.py...")
    ftp = ftplib.FTP('leadgin.ftp.tools')
    ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
    
    ftp.storbinary('STOR /www/backend/main.py', io.BytesIO(output.encode('utf-8')))
    
    # Touch passenger to restart
    with open('passenger_wsgi.py', 'rb') as f:
        ftp.storbinary('STOR /www/passenger_wsgi.py', f)
        
    print("Passenger trigger uploaded.")
    ftp.quit()
    
    print("Killing existing Passenger workers...")
    try:
        urllib.request.urlopen("https://kievdrova.com.ua/kill_passenger.php", timeout=5)
    except:
        pass
    
    time.sleep(3)
    
    print("Triggering the seeding endpoint...")
    req = urllib.request.Request("https://kievdrova.com.ua/api/v1/seed-final-live", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10)
    print("Response:")
    print(resp.read().decode('utf-8'))

if __name__ == "__main__":
    main()
