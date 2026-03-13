import ftplib
import io
import time

print('Uploading wrapper main.py to /www/...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

wrapper_main = """import sys
import os

# Ensure the correct python interpreter from venv is used
INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Add current directory to path so 'backend' package is found
_app_dir = os.path.dirname(os.path.abspath(__file__))
if _app_dir not in sys.path:
    sys.path.insert(0, _app_dir)

# Import the actual FastAPI app from backend.main
from backend.main import app
"""

ftp.storbinary('STOR /www/main.py', io.BytesIO(wrapper_main.encode('utf-8')))
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment complete.')
ftp.quit()
