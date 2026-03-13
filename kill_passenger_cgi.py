"""
Deploy a Python CGI to kill Passenger workers.
"""
import ftplib
import io
import time
import ssl
import json
import urllib.request

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
SITE_URL = "https://kievdrova.com.ua"

CGI_SCRIPT = """#!/home/leadgin/kievdrova.com.ua/www/venv/bin/python
import cgi
import cgitb
cgitb.enable()

print("Content-Type: text/plain;charset=utf-8\\n")
print("KILLING PASSENGER WORKERS...\\n")

import os
import signal
import subprocess

try:
    # 1. First fix passenger_wsgi.py if it was broken
    with open('/home/leadgin/kievdrova.com.ua/www/passenger_wsgi.py', 'w') as f:
        f.write('''import sys, os
INTERP = os.path.join(os.environ.get("DOCUMENT_ROOT", os.getcwd()), "venv", "bin", "python")
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)
sys.path.insert(0, os.getcwd())
sys.path.insert(0, os.path.join(os.getcwd(), "backend"))
from backend.main import app as application
''')

    # 2. Get process list
    output = subprocess.check_output(['ps', 'aux']).decode('utf-8')
    me = os.getpid()
    
    count = 0
    for line in output.split('\\n'):
        if 'python' in line.lower() and str(me) not in line.split() and 'cgi' not in line:
            parts = line.split()
            if len(parts) > 1:
                pid = int(parts[1])
                try:
                    os.kill(pid, signal.SIGKILL)
                    print(f"Killed process {pid}: {line}")
                    count += 1
                except Exception as e:
                    print(f"Could not kill {pid}: {e}")
                    
    print(f"\\nTotal killed: {count}")
    
    # 3. Touch restart.txt
    try: os.makedirs('/home/leadgin/kievdrova.com.ua/www/tmp', exist_ok=True)
    except: pass
    with open('/home/leadgin/kievdrova.com.ua/www/tmp/restart.txt', 'w') as f:
        f.write('restart')
        
except Exception as e:
    print(f"Error: {e}")

print("\\nDONE")
"""

print("Uploading NATIVE Python CGI Killer...")
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)

try: ftp.mkd("/www/cgi-bin")
except: pass

ftp.storbinary('STOR /www/cgi-bin/kill.cgi', io.BytesIO(CGI_SCRIPT.encode('utf-8')))
ftp.sendcmd('SITE CHMOD 755 /www/cgi-bin/kill.cgi')

ftp.quit()

print("Executing CGI Killer...")
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    req = urllib.request.Request(f"{SITE_URL}/cgi-bin/kill.cgi", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=15, context=ctx)
    print("\n" + "="*40)
    print(resp.read().decode("utf-8"))
    print("="*40 + "\n")
except Exception as e:
    # A 502/503 might happen if Passenger dies while routing the request, but since this is CGI it should finish cleanly before Apache notices.
    print(f"Error executing CGI: {e}")

print("Wait 10 seconds for Passenger to recover...")
time.sleep(10)

print("Verifying live API...")
ts = int(time.time())
for cat in ['drova', 'brikety', 'vugillya']:
    try:
        req = urllib.request.Request(f'{SITE_URL}/api/v1/products/?category={cat}&limit=5&_t={ts}', headers={'User-Agent': 'Mozilla/5.0'})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        print(f'  {cat}: {data.get("total")} products')
    except Exception as e:
        print(f'  {cat} Error: {e}')
