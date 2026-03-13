import ftplib
import io
import time

print('Creating a mini_main.py that kills its own process...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

kill_script = """from fastapi import FastAPI
import os, signal, sys

app = FastAPI()

@app.get('/kill')
def kill_me():
    pid = os.getpid()
    os.kill(pid, signal.SIGKILL)
    return {'status': 'killed'}
    
@app.get('/')
def home():
    return {'status': 'alive', 'pid': os.getpid()}
"""

ftp.storbinary('STOR /www/main.py', io.BytesIO(kill_script.encode('utf-8')))

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

print('Deployment complete.')
ftp.quit()
