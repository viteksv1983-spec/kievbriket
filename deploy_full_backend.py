"""
Full backend deploy to HostUkraine.
Structure on server:
  /www/
    main.py              (not used directly, kept for reference)
    passenger_wsgi.py    (entry point)
    .htaccess
    backend/             (package dir so 'from backend.src...' works)
      __init__.py
      main.py
      auto_seed.py
      logging_config.py
      src/...
      scripts/...
    src/                 (also here for 'from src...' imports if any)
    index.html, assets/, etc.  (frontend)
"""
import ftplib
import io
import time
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

IGNORE_DIRS = {"__pycache__", "venv", "alembic", "node_modules", ".git", ".pytest_cache", "tests"}
IGNORE_EXTS = {".pyc"}

def ensure_remote_dir(ftp, remote_dir):
    parts = [p for p in remote_dir.split("/") if p]
    current = ""
    for p in parts:
        current += "/" + p
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
            except Exception:
                pass
    ftp.cwd("/")

def upload_dir(ftp, local_dir, remote_base):
    ensure_remote_dir(ftp, remote_base)
    for root, dirs, files in os.walk(local_dir):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        rel_path = os.path.relpath(root, local_dir).replace("\\", "/")
        if rel_path == ".":
            rel_path = ""

        if rel_path:
            ensure_remote_dir(ftp, f"{remote_base}/{rel_path}")

        for f in files:
            if any(f.endswith(ext) for ext in IGNORE_EXTS):
                continue
            local_file = os.path.join(root, f)
            remote_file = f"{remote_base}/{rel_path}/{f}" if rel_path else f"{remote_base}/{f}"
            print(f"  -> {remote_file}")
            with open(local_file, "rb") as fh:
                ftp.storbinary(f"STOR {remote_file}", fh)


def run():
    print("=" * 60)
    print("  FULL BACKEND DEPLOY TO HOSTUKRAINE")
    print("  Structure: /www/backend/ as a Python package")
    print("=" * 60)

    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    print("[OK] Connected to FTP\n")

    # 1. Upload entire backend/ directory as /www/backend/
    print("[1/5] Uploading backend/ -> /www/backend/...")
    upload_dir(ftp, "backend", "/www/backend")

    # Make sure __init__.py exists in backend/
    try:
        ftp.size("/www/backend/__init__.py")
        print("  __init__.py already exists")
    except:
        ftp.storbinary("STOR /www/backend/__init__.py", io.BytesIO(b""))
        print("  Created /www/backend/__init__.py")

    # 2. Upload logging_config.py to /www/backend/ if not already there
    logging_config = os.path.join("backend", "logging_config.py")
    if os.path.exists(logging_config):
        print("\n[2/5] Uploading logging_config.py...")
        with open(logging_config, "rb") as fh:
            ftp.storbinary("STOR /www/backend/logging_config.py", fh)

    # 3. Upload auto_seed.py to /www/backend/
    auto_seed = os.path.join("backend", "auto_seed.py")
    if os.path.exists(auto_seed):
        print("\n[3/5] Uploading auto_seed.py...")
        with open(auto_seed, "rb") as fh:
            ftp.storbinary("STOR /www/backend/auto_seed.py", fh)

    # 4. Create passenger_wsgi.py
    print("\n[4/5] Writing passenger_wsgi.py...")
    passenger_wsgi = """import sys
import os

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
    ftp.storbinary("STOR /www/passenger_wsgi.py", io.BytesIO(passenger_wsgi.encode("utf-8")))

    # 5. Write .htaccess
    print("\n[5/5] Writing .htaccess...")
    htaccess = """PassengerEnabled on
PassengerAppType wsgi
PassengerStartupFile passenger_wsgi.py

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]
"""
    ftp.storbinary("STOR /www/.htaccess", io.BytesIO(htaccess.encode("utf-8")))

    # Signal restart
    ensure_remote_dir(ftp, "/www/tmp")
    ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(f"Restart: {time.time()}".encode()))
    print("\n  [OK] Restart signaled")

    ftp.quit()
    print("\n" + "=" * 60)
    print("  [OK] FULL DEPLOY COMPLETE!")
    print("  Wait 15s: https://kievdrova.com.ua")
    print("=" * 60)


if __name__ == "__main__":
    run()
