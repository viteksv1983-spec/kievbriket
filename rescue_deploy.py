import os
import ftplib
import subprocess
import io

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"
TARGET_DIR = "" # root

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

def run():
    print("Building frontend...")
    subprocess.run(["npm", "run", "build"], cwd="frontend", shell=True, check=True)
    
    # Also need to make sure build_for_hosting style copying is done so we have a deploy bundle
    # Wait, instead of building everything manually, we can just upload `/frontend/dist` to `/www/`
    # and `/backend` to `/backend/` (ignoring venv, db, cache)
    
    print("Connecting to FTP...")
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    
    print("Uploading frontend (dist) -> /www/ ...")
    for root, dirs, files in os.walk("frontend/dist"):
        rel_path = os.path.relpath(root, "frontend/dist")
        if rel_path == ".": rel_path = ""
        rel_path = rel_path.replace("\\", "/")
        
        if rel_path:
            ensure_remote_dir(ftp, f"/www/{rel_path}")
            
        for file in files:
            local_file = os.path.join(root, file)
            remote_file = f"/www/{rel_path}/{file}" if rel_path else f"/www/{file}"
            print("  Up:", remote_file)
            with open(local_file, "rb") as f:
                ftp.storbinary(f"STOR {remote_file}", f)
                
    print("Uploading frontend (dist-server) -> /backend/dist-server ...")
    for root, dirs, files in os.walk("frontend/dist-server"):
        rel_path = os.path.relpath(root, "frontend/dist-server")
        if rel_path == ".": rel_path = ""
        rel_path = rel_path.replace("\\", "/")
        
        if rel_path:
            ensure_remote_dir(ftp, f"/backend/dist-server/{rel_path}")
            
        for file in files:
            local_file = os.path.join(root, file)
            remote_file = f"/backend/dist-server/{rel_path}/{file}" if rel_path else f"/backend/dist-server/{file}"
            print("  Up:", remote_file)
            with open(local_file, "rb") as f:
                ftp.storbinary(f"STOR {remote_file}", f)
                
    print("Uploading backend files -> /backend/src ...")
    for root, dirs, files in os.walk("backend/src"):
        dirs[:] = [d for d in dirs if d not in ["__pycache__", "alembic"]]
        rel_path = os.path.relpath(root, "backend/src")
        if rel_path == ".": rel_path = ""
        rel_path = rel_path.replace("\\", "/")
        
        if rel_path:
            ensure_remote_dir(ftp, f"/backend/src/{rel_path}")
            
        for file in files:
            if file.endswith(".py"):
                local_file = os.path.join(root, file)
                remote_file = f"/backend/src/{rel_path}/{file}" if rel_path else f"/backend/src/{file}"
                print("  Up:", remote_file)
                with open(local_file, "rb") as f:
                    ftp.storbinary(f"STOR {remote_file}", f)
                    
    # main.py
    with open("backend/main.py", "rb") as f:
        ftp.storbinary("STOR /backend/main.py", f)

    # restart passenger
    try:
        ensure_remote_dir(ftp, "/tmp")
        ftp.storbinary("STOR /tmp/restart.txt", io.BytesIO(b"restart"))
    except: pass
    
    ftp.quit()
    print("Done!")

if __name__ == "__main__":
    run()
