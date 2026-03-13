import ftplib
import io
import time
import os

print('Uploading mini_main.py')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

with open('mini_main.py', 'rb') as f:
    ftp.storbinary('STOR /www/main.py', f)

# Make sure passenger points to it correctly
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
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment of mini_main complete.')
ftp.quit()
