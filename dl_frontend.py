"""Download frontend source files from /www/ for comparison"""
import ftplib, os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

DOWNLOAD_DIR = "ftp_recovery/www_frontend"
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

def download_file(ftp, remote_path, local_path):
    os.makedirs(os.path.dirname(local_path), exist_ok=True)
    try:
        with open(local_path, "wb") as f:
            ftp.retrbinary(f"RETR {remote_path}", f.write)
        print(f"OK: {remote_path}")
    except Exception as e:
        print(f"Skip: {remote_path} ({e})")

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)

# Download the OLDER working frontend CSS from /static/ (the version from safe_deploy.py)
download_file(ftp, "/static/index.html", f"{DOWNLOAD_DIR}/static_index.html")

# Try to find the CSS file hash from the /static/ index.html
ftp.quit()
print("Done")
