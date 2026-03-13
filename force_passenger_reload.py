import ftplib
import io
import time

print('Touching main.py and passenger_wsgi.py to force Passenger reaload...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

# Touch passenger_wsgi.py (Host Ukraine Passenger restarts if this file changes modification time)
passenger_wsgi = """import sys
import os

INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from main import app as fastapi_app
from a2wsgi import ASGIMiddleware
application = ASGIMiddleware(fastapi_app)
"""
ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(passenger_wsgi.encode('utf-8')))

# Important: ensure there is no old __pycache__ holding us back
try:
    ftp.cwd('/www/__pycache__')
    for file in ftp.nlst():
        if file not in ['.', '..']:
            ftp.delete(file)
    ftp.cwd('/')
except:
    pass

ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment complete.')
ftp.quit()
