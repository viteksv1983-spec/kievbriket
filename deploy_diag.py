"""Deploy updated main.py (with /api/v1/diag endpoint) and fix passenger_wsgi.py."""
import ftplib
import io
import time

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)
ftp.encoding = "utf-8"
print("OK Connected")

# 1. Upload updated main.py
print("[1/3] Uploading backend/main.py with diagnostic endpoint...")
with open("backend/main.py", "rb") as f:
    ftp.storbinary("STOR /www/backend/main.py", f)
print("  OK")

# 2. Fix passenger_wsgi.py to point at backend.main (with os.execl)
print("[2/3] Fixing passenger_wsgi.py...")
WSGI = """import sys
import os

INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from backend.main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
ftp.storbinary("STOR /www/passenger_wsgi.py", io.BytesIO(WSGI.encode("utf-8")))
print("  OK")

# 3. Restart
print("[3/3] Restarting Passenger...")
ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(f"R:{time.time()}".encode()))
print("  OK")

ftp.quit()
print("Done! Wait 10s then GET https://kievdrova.com.ua/api/v1/diag")
