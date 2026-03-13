"""Surgical cleanup of HostUkraine FTP to prepare for clean Senior Deployment."""
import ftplib

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

def delete_recursive(ftp, path):
    """Recursively delete a directory and its contents."""
    try:
        ftp.cwd(path)
        for item in ftp.nlst():
            if item in ('.', '..'): continue
            try:
                ftp.delete(item)
            except ftplib.error_perm:
                delete_recursive(ftp, item)
        ftp.cwd('..')
        ftp.rmd(path)
    except Exception as e:
        print(f"Error deleting {path}: {e}")

def run_cleanup():
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    
    # 1. Cleanup ROOT (/) - remove duplicates of app files
    print("Cleaning root (/)...")
    root_files_to_del = [
        "main.py", "auto_seed.py", "seed.py", "requirements.txt", 
        "alembic.ini", ".htaccess", "passenger_wsgi.py", "trigger_seed.py",
        "poll_seed.py", "check_api.py", "check_render.py", "check_ssg.py"
    ]
    for f in root_files_to_del:
        try:
            ftp.delete(f"/{f}")
            print(f"  Deleted root /{f}")
        except: pass
    
    # Root directories to delete
    for d in ["src", "static", "tmp", "backend"]: # backend might be an old folder too
        delete_recursive(ftp, f"/{d}")
        print(f"  Deleted root directory /{d}")

    # 2. Cleanup /www/ - prepare for fresh upload
    print("\nCleaning /www/...")
    www_files_to_del = [
        "main.py", "passenger_wsgi.py", "index.html", "404.html", 
        "robots.txt", "sitemap.xml", "vite.svg", ".htaccess"
    ]
    for f in www_files_to_del:
        try:
            ftp.delete(f"/www/{f}")
            print(f"  Deleted /www/{f}")
        except: pass
    
    # www directories to delete (EXCLUDE: venv, media, but include src, static, assets)
    for d in ["src", "static", "assets", "catalog", "contacts", "dostavka", "kontakty", "pro-nas", "images"]:
        delete_recursive(ftp, f"/www/{d}")
        print(f"  Deleted /www directory /{d}")

    ftp.quit()
    print("\nCleanup complete!")

if __name__ == "__main__":
    run_cleanup()
