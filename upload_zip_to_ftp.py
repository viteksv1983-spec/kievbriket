import ftplib
import zipfile
import io
import os
import time

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"
ZIP_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kievdrova_deploy.zip")
TARGET_DIR = "/www"

print(f"Connecting to FTP: {HOST} as {USER}...")

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)
ftp.encoding = "utf-8"
print("Connected!\n")

def ensure_remote_dir(ftp, remote_dir):
    parts = [p for p in remote_dir.split('/') if p]
    current = ""
    for p in parts:
        current += "/" + p
        try:
            ftp.cwd(current)
        except ftplib.error_perm:
            try:
                ftp.mkd(current)
            except Exception as e:
                print(f"Failed to create dir {current}: {e}")
    ftp.cwd("/")

print(f"Reading {ZIP_PATH}...")
with zipfile.ZipFile(ZIP_PATH, 'r') as zf:
    file_list = zf.namelist()
    
    # Pre-create all directories
    print("Creating directories...")
    directories = sorted(list(set(
        "/" + "/".join(f.split("/")[:-1]) 
        for f in file_list if "/" in f and not f.endswith("/")
    )))
    
    for d in directories:
        if d != "/":
            ensure_remote_dir(ftp, TARGET_DIR + d)
            
    ensure_remote_dir(ftp, TARGET_DIR)
            
    # Upload files
    print("\nUploading files...")
    for idx, finfo in enumerate(zf.filelist, 1):
        if finfo.is_dir():
            continue
            
        # Ignore pycache inside the zip just in case
        if "__pycache__" in finfo.filename:
            continue
            
        file_path = f"{TARGET_DIR}/{finfo.filename}"
        print(f"[{idx}/{len(file_list)}] Uploading: {file_path}")
        
        try:
            with zf.open(finfo) as pf:
                ftp.storbinary(f"STOR {file_path}", pf)
        except Exception as e:
             print(f"Failed to upload {file_path}: {e}")

# Restart Passenger
print("\nRestarting Passenger (Python backend)...")
try:
    ensure_remote_dir(ftp, f"{TARGET_DIR}/tmp")
    ftp.storbinary(f"STOR {TARGET_DIR}/tmp/restart.txt", io.BytesIO(f"Restart: {time.time()}".encode()))
    print("Restart signaled successfully.")
except Exception as e:
    print(f"Warning: Could not signal restart: {e}")

ftp.quit()
print("\nFTP Deployment completed successfully!")
