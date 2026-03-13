"""
Deploy to HostUkraine FTP — correct paths:
- Frontend assets → /www/assets/
- Backend Python → /www/src/
- Backend main.py → /www/main.py
- DB path is /www/sql_app.db (DO NOT OVERWRITE!)
"""
import ftplib
import os
import io
import time

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

IGNORE_DIRS = {"__pycache__", "venv", "alembic", "media", "logs", "node_modules"}
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
            except Exception:
                pass
    ftp.cwd("/")


def upload_dir(ftp, local_dir, remote_base):
    """Upload a local directory to remote FTP path."""
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
            print(f"  ^ {remote_file}")
            with open(local_file, "rb") as fh:
                ftp.storbinary(f"STOR {remote_file}", fh)


def clean_remote_dir(ftp, remote_dir):
    """Delete all files in a remote directory (not recursive)."""
    try:
        ftp.cwd(remote_dir)
        items = ftp.nlst()
        for item in items:
            if item in ('.', '..'):
                continue
            try:
                ftp.delete(f"{remote_dir}/{item}")
            except:
                pass
        ftp.cwd("/")
    except:
        pass


def run():
    print("=" * 50)
    print("  SENIOR DEPLOY TO HOSTUKRAINE (/www/ structure)")
    print("=" * 50)

    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    print("OK connected to FTP\n")

    # 1. Upload Frontend (directly to /www/)
    print("[1/4] Uploading Frontend (dist/ -> /www/)...")
    
    # Upload assets/
    if os.path.exists("frontend/dist/assets"):
        upload_dir(ftp, "frontend/dist/assets", "/www/assets")
    
    # Upload root static files (index.html, etc)
    root_files = ["index.html", "404.html", "vite.svg", "robots.txt", "sitemap.xml", "kievbriket.svg", "logo.png", "transparent-hero-cake.webp", "og-image.jpg"]
    for rf in root_files:
        path = f"frontend/dist/{rf}"
        if os.path.exists(path):
            with open(path, "rb") as f:
                ftp.storbinary(f"STOR /www/{rf}", f)
            print(f"  ^ /www/{rf}")

    # Upload SSG dirs
    ssg_dirs = ["catalog", "contacts", "dostavka", "kontakty", "pro-nas", "images"]
    for d in ssg_dirs:
        local_path = f"frontend/dist/{d}"
        if os.path.exists(local_path):
            upload_dir(ftp, local_path, f"/www/{d}")

    # 2. Upload Backend (entire folder to /www/backend/)
    print("\n[2/4] Uploading Backend (backend/ -> /www/backend/)...")
    upload_dir(ftp, "backend", "/www/backend")

    # 3. Upload Server Configs
    print("\n[3/4] Uploading Server Configs...")
    for cfg in ["passenger_wsgi.py", "tmp_htaccess.txt"]:
        target = "passenger_wsgi.py" if cfg == "passenger_wsgi.py" else ".htaccess"
        if os.path.exists(cfg):
            with open(cfg, "rb") as f:
                ftp.storbinary(f"STOR /www/{target}", f)
            print(f"  ^ /www/{target}")

    # 4. Restart Passenger
    print("\n[4/4] Restarting Passenger...")
    try:
        ensure_remote_dir(ftp, "/www/tmp")
        ftp.storbinary("STOR /www/tmp/restart.txt", io.BytesIO(f"Restart: {time.time()}".encode()))
        print("  OK Restart signaled")
    except Exception as e:
        print(f"  WARN Restart fail: {e}")

    ftp.quit()
    print("\n" + "=" * 50)
    print("  OK SENIOR DEPLOY COMPLETE!")
    print("  Wait 15s: https://kievdrova.com.ua")
    print("=" * 50)



if __name__ == "__main__":
    run()
