"""
Write a quick PHP script to query /www/backend/sql_app.db via PDO
since PHP executes freshly on each request and opens its own SQLite handle.
"""
import ftplib
import io
import urllib.request
import ssl

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

PHP_SCRIPT = b"""<?php
header('Content-Type: text/plain;charset=utf-8');

$dbFile = '/home/leadgin/kievdrova.com.ua/www/backend/sql_app.db';

if (!file_exists($dbFile)) {
    echo "DB does not exist at $dbFile\\n";
    exit;
}

try {
    $pdo = new PDO("sqlite:" . $dbFile);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->query("SELECT category, COUNT(*) as count FROM cakes GROUP BY category");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo "Table 'cakes' counts:\\n";
    foreach ($results as $row) {
        echo "  " . $row['category'] . ": " . $row['count'] . "\\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\\n";
}
?>"""

ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

try: ftp.mkd("/www/php")
except: pass

ftp.storbinary("STOR /www/php/check_db_direct.php", io.BytesIO(PHP_SCRIPT))
ftp.quit()

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    print("Executing PHP Query...")
    req = urllib.request.Request(f"{SITE_URL}/php/check_db_direct.php", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    print(resp.read().decode("utf-8"))
except Exception as e:
    print(f"Error executing PHP: {e}")
