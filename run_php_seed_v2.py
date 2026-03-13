"""
Upload seed_all.php into a /php/ subdirectory with its own .htaccess 
that disables Passenger, allowing Apache to execute PHP normally.
"""
import ftplib
import io
import urllib.request
import ssl
import json
import time

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

print("[1/3] Uploading files...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

# Create /www/php/ directory
try:
    ftp.mkd("/www/php")
except:
    pass

# Upload .htaccess that disables Passenger for this dir
htaccess = b"""PassengerEnabled off
AddHandler application/x-httpd-php .php
"""
ftp.storbinary("STOR /www/php/.htaccess", io.BytesIO(htaccess))
print("  .htaccess uploaded to /www/php/")

# Upload the PHP seed script
with open("seed_all.php", "rb") as f:
    ftp.storbinary("STOR /www/php/seed_all.php", f)
print("  seed_all.php uploaded to /www/php/")

ftp.quit()

print("[2/3] Executing PHP seed script...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(
        f"{SITE_URL}/php/seed_all.php",
        headers={"User-Agent": "Mozilla/5.0"}
    )
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    body = resp.read().decode("utf-8")
    print(f"  HTTP {resp.status}")
    
    try:
        data = json.loads(body)
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        if "<?php" in body:
            print("  WARNING: Still returning raw PHP source!")
        else:
            print("  Response:", body[:500])
except urllib.error.HTTPError as e:
    print(f"  HTTP Error {e.code}")
    try:
        err_body = e.read().decode()[:300]
        print(f"  Body: {err_body}")
    except:
        pass
except Exception as e:
    print(f"  Error: {e}")

print("\n[3/3] Verifying via API...")
time.sleep(2)

for cat_slug in ["drova", "brikety", "vugillya"]:
    try:
        req = urllib.request.Request(
            f"{SITE_URL}/api/v1/products/?category={cat_slug}&limit=20",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode("utf-8"))
        items = data.get("items", [])
        print(f"  {cat_slug}: {len(items)} products")
    except Exception as e:
        print(f"  {cat_slug}: Error: {e}")

try:
    req = urllib.request.Request(f"{SITE_URL}/api/v1/products/categories", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    cats = json.loads(resp.read().decode("utf-8"))
    print("\n  Categories:")
    for c in cats:
        print(f"    {c['slug']}: image={c.get('image_url')}")
except Exception as e:
    print(f"  Categories error: {e}")

print("\nDone!")
