"""
Audit FTP server to understand what version is currently deployed.
Download key files for inspection.
"""
import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

DOWNLOAD_DIR = "ftp_audit"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# Files to download for inspection
FILES_TO_CHECK = [
    "/backend/main.py",
    "/backend/sql_app.db",
    "/backend/src/core/database.py",
    "/static/index.html",
    "/static/assets/",  # just list this dir
]

def list_dir_recursive(ftp, path, depth=0, max_depth=2):
    """List directory contents recursively"""
    if depth > max_depth:
        return
    try:
        items = ftp.nlst(path)
        for item in items:
            if item in ('.', '..'):
                continue
            full = item if item.startswith('/') else f"{path}/{item}"
            print(f"{'  ' * depth}{full}")
            try:
                # Try to cd into it (it's a directory)
                ftp.cwd(full)
                ftp.cwd("/")
                list_dir_recursive(ftp, full, depth + 1, max_depth)
            except:
                pass  # it's a file
    except Exception as e:
        print(f"{'  ' * depth}Error listing {path}: {e}")


def download_file(ftp, remote_path, local_path):
    """Download a file from FTP"""
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        with open(local_path, "wb") as f:
            ftp.retrbinary(f"RETR {remote_path}", f.write)
        print(f"  Downloaded: {remote_path} -> {local_path}")
    except Exception as e:
        print(f"  Error downloading {remote_path}: {e}")


def run():
    print("Connecting to FTP...")
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    print("Connected!\n")

    # 1. List top-level structure
    print("=== TOP-LEVEL STRUCTURE ===")
    list_dir_recursive(ftp, "/", depth=0, max_depth=1)

    # 2. List /backend structure
    print("\n=== /backend STRUCTURE ===")
    list_dir_recursive(ftp, "/backend", depth=0, max_depth=1)

    # 3. List /backend/src/core
    print("\n=== /backend/src/core ===")
    list_dir_recursive(ftp, "/backend/src/core", depth=0, max_depth=0)

    # 4. List /static/assets (frontend JS/CSS)
    print("\n=== /static/assets ===")
    list_dir_recursive(ftp, "/static/assets", depth=0, max_depth=0)

    # 5. Download key backend files
    print("\n=== DOWNLOADING KEY FILES ===")
    download_file(ftp, "/backend/main.py", f"{DOWNLOAD_DIR}/main.py")
    download_file(ftp, "/backend/sql_app.db", f"{DOWNLOAD_DIR}/sql_app.db")
    download_file(ftp, "/backend/src/core/database.py", f"{DOWNLOAD_DIR}/database.py")
    
    # Download settings files if they exist
    for f in ["settings_models.py", "settings_router.py", "settings_schemas.py"]:
        download_file(ftp, f"/backend/src/core/{f}", f"{DOWNLOAD_DIR}/{f}")

    # Download index.html
    download_file(ftp, "/static/index.html", f"{DOWNLOAD_DIR}/index.html")

    # 6. Check if there is a /www directory
    print("\n=== /www structure (if exists) ===")
    try:
        list_dir_recursive(ftp, "/www", depth=0, max_depth=1)
    except:
        print("  /www does not exist")

    ftp.quit()
    print("\nDone!")


if __name__ == "__main__":
    run()
