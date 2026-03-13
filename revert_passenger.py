import ftplib
import io
import time

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

print('Reverting to classic Passenger setup')

# 1. Revert .htaccess (remove PassengerPython)
htaccess = """PassengerEnabled on
PassengerAppType wsgi
PassengerStartupFile passenger_wsgi.py

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]
"""
ftp.storbinary('STOR /www/.htaccess', io.BytesIO(htaccess.encode('utf-8')))

# 2. Classic passenger_wsgi.py that forces the venv python
passenger = """import sys
import os

INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"

# Ensure we're running in the venv
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from backend.main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(passenger.encode('utf-8')))

# Restart
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Uploaded classic setup and restarted passenger.')
ftp.quit()
