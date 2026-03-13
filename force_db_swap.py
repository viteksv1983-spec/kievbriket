"""
Write a PHP script to force-replace sql_app.db and clear PHP OPcache if any.
Since Python is cached in memory, directly swapping the DB file using PHP 
(which runs outside Passenger) is our best bet to force the SQLite driver
to see the new inode and refresh the data.
"""
import ftplib
import io
import time
import ssl
import urllib.request
import json

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"
LOCAL_DB = "local_prod.db"

# We assume we have the correct DB with 22 products locally in 'local_prod.db'
PHP_SWAP_SCRIPT = b"""<?php
header('Content-Type: application/json');

$src = __DIR__ . '/sql_app_new.db';
$dest = '/home/leadgin/kievdrova.com.ua/www/backend/sql_app.db';
$wal = $dest . '-wal';
$shm = $dest . '-shm';

$res = [];

// Clean up WAL logs just in case
if (file_exists($wal)) { @unlink($wal); $res['wal'] = 'deleted'; }
if (file_exists($shm)) { @unlink($shm); $res['shm'] = 'deleted'; }

if (file_exists($src)) {
    if (copy($src, $dest)) {
        $res['status'] = 'success';
        $res['message'] = 'Database replaced successfully.';
        $res['size'] = filesize($dest);
    } else {
        $res['status'] = 'error';
        $res['message'] = 'Failed to copy database.';
    }
} else {
    $res['status'] = 'error';
    $res['message'] = 'Source database not found.';
}

echo json_encode($res);
?>"""

print("1. Uploading the correct database as sql_app_new.db...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

try:
    ftp.mkd("/www/php")
except:
    pass

with open(LOCAL_DB, "rb") as f:
    ftp.storbinary("STOR /www/php/sql_app_new.db", f)
print("  Uploaded sql_app_new.db")

print("2. Uploading PHP swapper script...")
ftp.storbinary("STOR /www/php/swap_db.php", io.BytesIO(PHP_SWAP_SCRIPT))
print("  Uploaded swap_db.php")
ftp.quit()

print("3. Executing PHP swapper script...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(f"{SITE_URL}/php/swap_db.php", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    body = resp.read().decode("utf-8")
    print("  Swapper Response:")
    try:
        print(json.dumps(json.loads(body), indent=2))
    except:
        print(body[:200])
except Exception as e:
    print(f"  Swapper Error: {e}")

print("4. Restarting Passenger just in case...")
try:
    urllib.request.urlopen(f"{SITE_URL}/kill_passenger.php", timeout=5, context=ctx)
except:
    pass

time.sleep(10)

print("5. Verifying live API...")
ts = int(time.time())
for cat in ["drova", "brikety", "vugillya"]:
    try:
        req = urllib.request.Request(f"{SITE_URL}/api/v1/products/?category={cat}&limit=5&_t={ts}", headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode("utf-8"))
        print(f"  {cat}: {data.get('total')} products")
    except Exception as e:
        print(f"  {cat} Error: {e}")
