import ftplib
import io
import time

print('Cleaning up old /www/main.py and forcing Passenger restart...')

ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.encoding = 'utf-8'

# 1. Delete the old /www/main.py (mini_main leftover)
try:
    ftp.delete('/www/main.py')
    print('Deleted /www/main.py')
except Exception as e:
    print('Could not delete /www/main.py:', e)

# 2. Delete all old pycache
for pycache_dir in ['/www/__pycache__', '/www/backend/__pycache__']:
    try:
        ftp.cwd(pycache_dir)
        for file in ftp.nlst():
            if file not in ['.', '..']:
                try:
                    ftp.delete(f'{pycache_dir}/{file}')
                except:
                    pass
        ftp.cwd('/')
        ftp.rmd(pycache_dir)
        print(f'Cleaned {pycache_dir}')
    except:
        pass

# 3. Remove old backend_old directories
for old_dir in ['/www/backend_old', '/www/backend_old2']:
    try:
        ftp.cwd(old_dir)
        print(f'Note: {old_dir} still exists (will not recurse-delete)')
        ftp.cwd('/')
    except:
        pass

# 4. Rewrite passenger_wsgi.py with a new timestamp to force reload
passenger_wsgi = """import sys
import os

# Deploy timestamp: """ + str(time.time()) + """

INTERP = "/home/leadgin/kievdrova.com.ua/www/venv/bin/python3.12"
if sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

# Add /www/ to path so 'from backend.src...' resolves
_app_dir = os.path.dirname(os.path.abspath(__file__))
if _app_dir not in sys.path:
    sys.path.insert(0, _app_dir)

# Write startup marker for debugging
try:
    with open(os.path.join(_app_dir, "startup.txt"), "w") as _f:
        import time as _time
        _f.write("Started: " + str(_time.time()) + "\\n")
        _f.write("Python: " + sys.executable + "\\n")
        _f.write("Version: " + sys.version + "\\n")
        _f.write("CWD: " + os.getcwd() + "\\n")
        _f.write("AppDir: " + _app_dir + "\\n")
        _f.write("sys.path: " + str(sys.path) + "\\n")
except:
    pass

_error_message = None
try:
    from backend.main import app as fastapi_app
    from a2wsgi import ASGIMiddleware
    application = ASGIMiddleware(fastapi_app)
except Exception as _e:
    import traceback
    _error_message = traceback.format_exc()
    try:
        with open(os.path.join(_app_dir, "crash.txt"), "w") as _f:
            _f.write(_error_message)
    except:
        pass

    def application(environ, start_response):
        status = '500 Internal Server Error'
        output = ("KievDrova Import Error:\\n\\n" + _error_message).encode('utf-8')
        start_response(status, [
            ('Content-Type', 'text/plain; charset=utf-8'),
            ('Content-Length', str(len(output)))
        ])
        return [output]
"""
ftp.storbinary('STOR /www/passenger_wsgi.py', io.BytesIO(passenger_wsgi.encode('utf-8')))

# 5. Touch restart
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(f'Restart: {time.time()}'.encode('utf-8')))

print('Done! Passenger should restart with backend.main import now.')
ftp.quit()
