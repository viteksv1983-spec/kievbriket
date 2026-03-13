"""
Trigger Passenger restart via FTP by touching restart files.
"""
import ftplib
import urllib.request
import ssl
import json
import time
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SITE = 'https://kievdrova.com.ua'
FTP_HOST = 'leadgin.ftp.tools'
FTP_USER = 'leadgin_vitya'
FTP_PASS = 'xQ3wxZtiD1jdL3mnB7be'

print('Touching restart triggers via FTP...')
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

try:
    ftp.mkd('/www/tmp')
except:
    pass

ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(b'restart'))

# Also forcibly delete WAL and SHM files just in case they are pinning old data
try:
    ftp.delete('/www/backend/sql_app.db-wal')
    print("Deleted WAL file across FTP.")
except:
    pass
try:
    ftp.delete('/www/backend/sql_app.db-shm')
    print("Deleted SHM file across FTP.")
except:
    pass

ftp.quit()

print('Wait 10 seconds for Passenger...')
time.sleep(10)

print('Verifying live API...')
ts = int(time.time())
for cat in ['drova', 'brikety', 'vugillya']:
    try:
        req = urllib.request.Request(f'{SITE}/api/v1/products/?category={cat}&limit=5&_t={ts}', headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        print(f'  {cat}: {data.get("total")} products')
    except Exception as e:
        print(f'  {cat} Error: {e}')
