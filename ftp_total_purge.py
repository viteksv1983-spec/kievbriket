import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

def run_total_purge():
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    
    print("--- ROOT PURGE ---")
    files = ftp.nlst("/")
    for f in files:
        basename = os.path.basename(f)
        if basename in ['.', '..', 'www', 'venv', '.ftpquota', 'etc', 'logs', 'mail', 'tmp']:
            print(f"  [SKIP] {f}")
            continue
            
        try:
            ftp.delete(f)
            print(f"  [DEL ] File: {f}")
        except:
            try:
                # Try recursive delete if it's a dir
                def del_dir(path):
                    ftp.cwd(path)
                    for item in ftp.nlst():
                        try: ftp.delete(item)
                        except: del_dir(item)
                    ftp.cwd("..")
                    ftp.rmd(path)
                
                del_dir(f)
                print(f"  [DEL ] Dir:  {f}")
            except Exception as e:
                print(f"  [FAIL] {f}: {e}")

    ftp.quit()
    print("\nPurge complete!")

if __name__ == "__main__":
    run_total_purge()
