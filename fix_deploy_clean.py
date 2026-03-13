"""
CLEAN FIX: Redeploy backend to HostUkraine with DB ownership fix.

Root cause of 500 error:
  The original sql_app.db was created by Passenger (owned by user 'leadgin').
  After restructure_backend_deploy.py moved /www/backend -> /www/backend_old,
  the DB was re-uploaded via FTP, changing ownership to 'leadgin_vitya'.
  CloudLinux CageFS prevents cross-user writes even with 666 perms.

Fix:
  1. Delete the FTP-owned sql_app.db
  2. Upload backend/ to /www/backend/ (skipping .db files)
  3. Write a proper passenger_wsgi.py WITHOUT os.execl()
  4. Restart Passenger -> app creates a new DB owned by the web process
  5. auto_seed populates it with products/categories
"""
import ftplib
import io
import os
import time

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

IGNORE_DIRS = {"__pycache__", "venv", "alembic", "node_modules", ".git", ".pytest_cache"}
IGNORE_EXTS = {".db", ".sqlite", ".sqlite3"}


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
            except:
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
            if f.endswith(".pyc"):
                continue
            local_file = os.path.join(root, f)
            remote_file = f"{remote_base}/{rel_path}/{f}" if rel_path else f"{remote_base}/{f}"
            print(f"  ^ {remote_file}")
            with open(local_file, "rb") as fh:
                ftp.storbinary(f"STOR {remote_file}", fh)


def run():
    print("=" * 60)
    print("  CLEAN FIX DEPLOY - Fix DB ownership + redeploy backend")
    print("=" * 60)

    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    print("OK Connected to FTP\n")

    # ── Step 1: Delete the FTP-owned sql_app.db ──────────────────
    print("[1/5] Deleting FTP-owned sql_app.db files...")
    for path in ["/www/backend/sql_app.db",
                 "/www/backend/sql_app_backup.db",
                 "/www/sql_app.db"]:
        try:
            ftp.delete(path)
            print(f"  Deleted {path}")
        except:
            print(f"  (not found: {path})")

    # ── Step 2: Upload backend/ to /www/backend/ ─────────────────
    print("\n[2/5] Uploading backend/ -> /www/backend/ (skipping .db files)...")
    upload_dir(ftp, "backend", "/www/backend")

    # ── Step 3: Proper passenger_wsgi.py (NO os.execl!) ──────────
    print("\n[3/5] Writing correct passenger_wsgi.py...")
    passenger_wsgi = """import sys
import os

# Add /www/ to path so 'backend' package is importable
sys.path.insert(0, os.path.dirname(__file__))

# Use the venv's packages
venv_site = '/home/leadgin/kievdrova.com.ua/www/venv/lib/python3.12/site-packages'
venv_site64 = '/home/leadgin/kievdrova.com.ua/www/venv/lib64/python3.12/site-packages'
if venv_site not in sys.path:
    sys.path.insert(0, venv_site)
if venv_site64 not in sys.path:
    sys.path.insert(0, venv_site64)

from backend.main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
    ftp.storbinary("STOR /www/passenger_wsgi.py",
                   io.BytesIO(passenger_wsgi.encode("utf-8")))
    print("  OK passenger_wsgi.py uploaded (no os.execl)")

    # ── Step 4: Clean up junk from previous deploys ──────────────
    print("\n[4/5] Cleanup: removing stale main.py.bak, fix_db.php...")
    for junk in ["/www/main.py.bak", "/www/fix_db.php"]:
        try:
            ftp.delete(junk)
            print(f"  Deleted {junk}")
        except:
            pass

    # ── Step 5: Restart Passenger ────────────────────────────────
    print("\n[5/5] Restarting Passenger...")
    try:
        ensure_remote_dir(ftp, "/www/tmp")
        ftp.storbinary("STOR /www/tmp/restart.txt",
                       io.BytesIO(f"Restart: {time.time()}".encode()))
        print("  OK Restart signaled")
    except Exception as e:
        print(f"  WARN Restart fail: {e}")

    ftp.quit()
    print("\n" + "=" * 60)
    print("  DONE! Passenger will recreate sql_app.db on first request.")
    print("  Wait ~10s, then test: https://kievdrova.com.ua")
    print("=" * 60)


if __name__ == "__main__":
    run()
