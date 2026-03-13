"""Upload seed_all.php to HostUkraine and execute it."""
import ftplib
import urllib.request
import ssl
import json

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

print("[1/3] Uploading seed_all.php...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

with open("seed_all.php", "rb") as f:
    ftp.storbinary("STOR /www/seed_all.php", f)
print("  Uploaded!")   
ftp.quit()

print("[2/3] Executing seed_all.php...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(
        f"{SITE_URL}/seed_all.php",
        headers={"User-Agent": "Mozilla/5.0"}
    )
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    body = resp.read().decode("utf-8")
    print(f"  HTTP {resp.status}")
    
    # Try to parse as JSON
    try:
        data = json.loads(body)
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        # Might be raw PHP source
        if "<?php" in body:
            print("  WARNING: PHP source returned (not executed)")
            print("  First 200 chars:", body[:200])
        else:
            print("  Raw response:", body[:500])
except urllib.error.HTTPError as e:
    print(f"  HTTP Error {e.code}")
    try:
        print(f"  Body: {e.read().decode()[:300]}")
    except:
        pass
except Exception as e:
    print(f"  Error: {e}")

print("\n[3/3] Verifying via API...")
import time
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
