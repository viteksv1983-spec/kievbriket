import ftplib
import io
import time

print('Uploading diagnostic wrapper main.py to /www/...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

wrapper_main = """import sys
import os
import traceback

# Ensure the correct python interpreter from venv is used
INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

_app_dir = os.path.dirname(os.path.abspath(__file__))
if _app_dir not in sys.path:
    sys.path.insert(0, _app_dir)

try:
    from backend.main import app
    # Write success marker
    with open(os.path.join(_app_dir, "import_success.txt"), "w") as f:
        f.write("Imported app successfully!")
except Exception as e:
    err = traceback.format_exc()
    with open(os.path.join(_app_dir, "import_crash.txt"), "w") as f:
        f.write("Crash trace:\\n" + err)
        
    # Return a dummy WSGI app so Passenger doesn't 502, but rather shows the error!
    def application(environ, start_response):
        status = '200 OK'
        output = ("KievDrova Import Error:\\n\\n" + err).encode('utf-8')
        start_response(status, [
            ('Content-Type', 'text/plain; charset=utf-8'),
            ('Content-Length', str(len(output)))
        ])
        return [output]
        
    app = application
"""

ftp.storbinary('STOR /www/main.py', io.BytesIO(wrapper_main.encode('utf-8')))
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment complete.')
ftp.quit()
