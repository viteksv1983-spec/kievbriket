"""Upload a script to restart via touching passenger_wsgi.py AND clearing connection."""
import ftplib
import urllib.request
import ssl
import json
import time
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SITE = "https://kievdrova.com.ua"
FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"

print("Uploading DB refresh trigger...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

# This forces passenger to restart the app
ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(b"restart"))

# Upload a Python script that we can call directly to verify
verify_script = b"""import sqlite3
import json

try:
    conn = sqlite3.connect('backend/sql_app.db')
    cursor = conn.cursor()
    cursor.execute("SELECT category, COUNT(*) FROM cakes GROUP BY category")
    counts = dict(cursor.fetchall())
    print("Content-Type: application/json\\n")
    print(json.dumps(counts))
except Exception as e:
    print("Content-Type: text/plain\\n")
    print(str(e))
"""
ftp.storbinary("STOR /www/php/check_db.py", io.BytesIO(verify_script))
ftp.quit()

print("Triggering kill_passenger...")
try:
    urllib.request.urlopen(f"{SITE}/kill_passenger.php", timeout=5, context=ctx)
except:
    pass

print("Waiting 10s for restart...")
time.sleep(10)

print("Checking API again...")
for cat in ['drova', 'brikety', 'vugillya']:
    try:
        ts = int(time.time())
        req = urllib.request.Request(
            f"{SITE}/api/v1/products/?category={cat}&limit=5&_t={ts}",
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        items = data.get('items', [])
        print(f"API request for {cat}: returned {len(items)} items")
    except Exception as e:
        print(f"Error {cat}: {e}")
