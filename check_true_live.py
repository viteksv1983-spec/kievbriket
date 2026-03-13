"""
Download the true live /www/db/sql_app.db and examine it.
"""
import ftplib
import sqlite3
import os

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
DB_REMOTE = "/www/db/sql_app.db"
LOCAL_DB = "true_live_db.db"

print("Downloading TRUE DB...")
if os.path.exists(LOCAL_DB):
    os.remove(LOCAL_DB)
    
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)
try:
    with open(LOCAL_DB, "wb") as f:
        ftp.retrbinary(f"RETR {DB_REMOTE}", f.write)
    print("Download successful.")
except Exception as e:
    print(f"Download failed: {e}")
finally:
    ftp.quit()

if os.path.exists(LOCAL_DB):
    print("\nChecking products in the cakes table...")
    conn = sqlite3.connect(LOCAL_DB)
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT category, COUNT(*) FROM cakes GROUP BY category")
        counts = cursor.fetchall()
        print(f"Product counts by category: {dict(counts)}")
        
        cursor.execute("SELECT category, name, slug FROM cakes ORDER BY category")
        products = cursor.fetchall()
        for p in products:
            print(f"  {p[0]}: {p[1]} ({p[2]})")
    except Exception as e:
        print(f"Error reading cakes: {e}")

    conn.close()
