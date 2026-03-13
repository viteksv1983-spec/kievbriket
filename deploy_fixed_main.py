import ftplib
import io
import time

print('Uploading fixed wrapper main.py without os.execl() to /www/...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

wrapper_main = """import sys
import os

# Add current directory to path so 'backend' package is found
_app_dir = os.path.dirname(os.path.abspath(__file__))
if _app_dir not in sys.path:
    sys.path.insert(0, _app_dir)

# Ensure the venv site-packages is in the path since we can't os.execl() the ASGI worker
venv_path = "/home/leadgin/kievdrova.com.ua/www/venv/lib/python3.12/site-packages"
venv_path64 = "/home/leadgin/kievdrova.com.ua/www/venv/lib64/python3.12/site-packages"
if venv_path not in sys.path:
    sys.path.insert(1, venv_path)
if venv_path64 not in sys.path:
    sys.path.insert(1, venv_path64)

# Import the actual FastAPI app from backend.main
try:
    from backend.main import app
except Exception as e:
    import traceback
    with open(os.path.join(_app_dir, "import_crash.txt"), "w") as f:
        f.write(traceback.format_exc())
    # Return a dummy ASGI app to report the error visually
    async def app(scope, receive, send):
        assert scope['type'] == 'http'
        await send({
            'type': 'http.response.start',
            'status': 500,
            'headers': [(b'content-type', b'text/plain; charset=utf-8')]
        })
        await send({
            'type': 'http.response.body',
            'body': ("KievDrova Import Error:\\n\\n" + traceback.format_exc()).encode('utf-8')
        })
"""

ftp.storbinary('STOR /www/main.py', io.BytesIO(wrapper_main.encode('utf-8')))
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Deployment complete.')
ftp.quit()
