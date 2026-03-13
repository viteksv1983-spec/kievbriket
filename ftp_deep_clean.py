import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

def clean_dir(ftp, target_dir, skip_list):
    print(f"--- CLEANING {target_dir} ---")
    try:
        items = ftp.nlst(target_dir)
    except:
        return

    for item in items:
        basename = os.path.basename(item)
        if basename in skip_list or basename in ['.', '..']:
            print(f"  [SKIP] {item}")
            continue
            
        try:
            ftp.delete(item)
            print(f"  [DEL ] File: {item}")
        except:
            try:
                # Recursive delete for dirs
                def del_recursive(path):
                    try:
                        files = ftp.nlst(path)
                        for f in files:
                            b = os.path.basename(f)
                            if b in ['.', '..']: continue
                            try: ftp.delete(f)
                            except: del_recursive(f)
                        ftp.rmd(path)
                    except:
                        pass
                
                del_recursive(item)
                print(f"  [DEL ] Dir:  {item}")
            except Exception as e:
                print(f"  [FAIL] {item}: {e}")

def run_deep_clean():
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    
    # 1. Clean Root (extreme care)
    clean_dir(ftp, "/", ['www', 'venv', '.ftpquota', 'etc', 'logs', 'mail', 'tmp', 'deploy.zip', 'sql_app.db'])
    
    # 2. Clean /www/
    clean_dir(ftp, "/www", ['venv', 'media', 'sql_app.db', '.htaccess', 'cgi-bin'])
    
    ftp.quit()
    print("\nDeep clean complete!")

if __name__ == "__main__":
    run_deep_clean()
