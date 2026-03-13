import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

def run():
    print("Connecting to FTP...")
    ftp = ftplib.FTP(HOST)
    ftp.login(USER, PASSWORD)
    ftp.encoding = "utf-8"
    
    print("Listing root directory...")
    files = ftp.nlst()
    
    # temp_prod_db.sqlite3 was saved in the previous deploy run locally, let's check what's on FTP
    print("Checking if we have a backup on server...")
    try:
        if "sql_app.db.bak" in files:
            print("Found sql_app.db.bak! Reverting...")
            ftp.rename("sql_app.db.bak", "/backend/sql_app.db")
        else:
            print("No backup found on FTP rooted dir. Let's see inside /backend/")
            b_files = ftp.nlst("/backend")
            for f in b_files:
                if ".bak" in f or "backup" in f or "temp" in f:
                    print(f"Found something: {f}")
    except Exception as e:
        print(e)
        
    ftp.quit()

if __name__ == "__main__":
    run()
