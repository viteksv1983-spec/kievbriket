"""
Download ALL backend source files and the main.py from /www/ on FTP
to understand what version is currently running on the live server.
"""
import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

DOWNLOAD_DIR = "ftp_recovery"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)


def download_file(ftp, remote_path, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        with open(local_path, "wb") as f:
            ftp.retrbinary(f"RETR {remote_path}", f.write)
        return True
    except Exception as e:
        print(f"  Skip {remote_path}: {e}")
        return False


def download_dir(ftp, remote_dir, local_dir):
    """Recursively download a directory"""
    os.makedirs(local_dir, exist_ok=True)
    try:
        items = ftp.nlst(remote_dir)
    except:
        return
    
    for item in items:
        if item in ('.', '..'):
            continue
        basename = item.split('/')[-1]
        if basename in ('.', '..', '__pycache__', 'venv', 'alembic'):
            continue
        
        remote_path = item if item.startswith('/') else f"{remote_dir}/{item}"
        local_path = os.path.join(local_dir, basename)
        
        # Try to list it as a directory
        try:
            ftp.cwd(remote_path)
            ftp.cwd("/")
            # It's a directory - recurse
            download_dir(ftp, remote_path, local_path)
        except:
            # It's a file - download
            download_file(ftp, remote_path, local_path)


def run():
    print("Connecting to FTP...")
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"

    # Download main.py from /www/
    print("Downloading /www/main.py...")
    download_file(ftp, "/www/main.py", f"{DOWNLOAD_DIR}/www_main.py")
    
    # Download passenger_wsgi.py
    print("Downloading /www/passenger_wsgi.py...")
    download_file(ftp, "/www/passenger_wsgi.py", f"{DOWNLOAD_DIR}/www_passenger_wsgi.py")

    # Download /www/src/core/ 
    print("Downloading /www/src/core/...")
    download_dir(ftp, "/www/src/core", f"{DOWNLOAD_DIR}/www_src_core")

    # Download /www/src/admin/
    print("Downloading /www/src/admin/...")
    download_dir(ftp, "/www/src/admin", f"{DOWNLOAD_DIR}/www_src_admin")

    # Download /www/src/orders/
    print("Downloading /www/src/orders/...")
    download_dir(ftp, "/www/src/orders", f"{DOWNLOAD_DIR}/www_src_orders")

    # Download /www/src/products/
    print("Downloading /www/src/products/...")
    download_dir(ftp, "/www/src/products", f"{DOWNLOAD_DIR}/www_src_products")

    # Download /www/src/pages/
    print("Downloading /www/src/pages/...")
    download_dir(ftp, "/www/src/pages", f"{DOWNLOAD_DIR}/www_src_pages")

    # Download /www/src/users/
    print("Downloading /www/src/users/...")
    download_dir(ftp, "/www/src/users", f"{DOWNLOAD_DIR}/www_src_users")
    
    # Download /www/src/integrations/
    print("Downloading /www/src/integrations/...")
    download_dir(ftp, "/www/src/integrations", f"{DOWNLOAD_DIR}/www_src_integrations")

    # Download the DB
    print("Downloading /www/sql_app.db (production DB)...")
    download_file(ftp, "/www/sql_app.db", f"{DOWNLOAD_DIR}/www_sql_app.db")

    # Download /backend/main.py for comparison
    print("Downloading /backend/main.py...")
    download_file(ftp, "/backend/main.py", f"{DOWNLOAD_DIR}/backend_main.py")
    
    # Download /backend/src/core/ 
    print("Downloading /backend/src/core/...")
    download_dir(ftp, "/backend/src/core", f"{DOWNLOAD_DIR}/backend_src_core")

    # Download /backend/sql_app.db
    print("Downloading /backend/sql_app.db...")
    download_file(ftp, "/backend/sql_app.db", f"{DOWNLOAD_DIR}/backend_sql_app.db")

    # Download /www/assets/ (frontend JS/CSS that the site actually serves)
    print("Downloading /www/assets/ (the live frontend)...")
    download_dir(ftp, "/www/assets", f"{DOWNLOAD_DIR}/www_assets")
    
    # Download /static/assets/ (secondary frontend location)
    print("Downloading /static/assets/ ...")
    download_dir(ftp, "/static/assets", f"{DOWNLOAD_DIR}/static_assets")

    # Download static index.html
    print("Downloading /static/index.html...")
    download_file(ftp, "/static/index.html", f"{DOWNLOAD_DIR}/static_index.html")
    
    # Download www index.html
    print("Downloading /www/index.html...")
    download_file(ftp, "/www/index.html", f"{DOWNLOAD_DIR}/www_index.html")

    ftp.quit()
    print("\nAll files downloaded to ftp_recovery/")


if __name__ == "__main__":
    run()
