import ftplib
import io
import time
import os

print('Re-deploying backend to /www/ instead of /www/backend/')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

# 1. Clean up old /www/backend to prevent confusion
try:
    print('Renaming /www/backend to /www/backend_old')
    try:
        ftp.rename('/www/backend_old', '/www/backend_old2')
    except:
        pass
    ftp.rename('/www/backend', '/www/backend_old')
except Exception as e:
    print('Failed to rename backend:', e)

# 2. Upload main.py to /www/main.py
print('Uploading main.py directly to /www/main.py')
with open('backend/main.py', 'rb') as f:
    ftp.storbinary('STOR /www/main.py', f)

# 3. Upload entire src/ to /www/src/
print('Uploading src/ directory...')
def upload_dir_to_ftp(ftp, local_dir, remote_base):
    try:
        ftp.cwd(remote_base)
    except:
        parts = [p for p in remote_base.split('/') if p]
        curr = ''
        for p in parts:
            curr += '/' + p
            try:
                ftp.cwd(curr)
            except:
                ftp.mkd(curr)
    
    for root, dirs, files in os.walk(local_dir):
        if '__pycache__' in root:
            continue
            
        rel_path = os.path.relpath(root, local_dir).replace('\\\\', '/')
        if rel_path == '.':
            current_remote_dir = remote_base
        else:
            current_remote_dir = f'{remote_base}/{rel_path}'
            try:
                ftp.cwd(current_remote_dir)
            except:
                ftp.mkd(current_remote_dir)
                
        for file in files:
            if file.endswith('.pyc'):
                continue
            local_file = os.path.join(root, file)
            remote_file = f'{current_remote_dir}/{file}'
            with open(local_file, 'rb') as f_in:
                ftp.storbinary(f'STOR {remote_file}', f_in)
                
upload_dir_to_ftp(ftp, 'backend/src', '/www/src')
upload_dir_to_ftp(ftp, 'backend/scripts', '/www/scripts')

# 4. Upload .env if exists
try:
    with open('backend/.env', 'rb') as f:
        ftp.storbinary('STOR /www/.env', f)
        print('Uploaded .env')
except:
    pass

# 5. Fix passenger_wsgi.py to import straight from main
print('Writing passenger_wsgi.py to import main:app')
passenger_wsgi = """import sys
import os

INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

# IMPORTANT: We now import directly from main (which is in /www/main.py)
from main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(passenger_wsgi.encode('utf-8')))

# 6. Restart Signal
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment complete.')
ftp.quit()
