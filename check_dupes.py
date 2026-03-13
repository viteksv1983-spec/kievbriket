"""Download DB and check products"""
import ftplib
import sqlite3
import os

FTP_HOST = "leadgin.ftp.tools"
FTP_USER = "leadgin_vitya"
FTP_PASS = "xQ3wxZtiD1jdL3mnB7be"
DB_REMOTE = "/www/backend/sql_app.db"
LOCAL_DB = "check_dupes.db"

print("Downloading DB...")
if os.path.exists(LOCAL_DB):
    os.remove(LOCAL_DB)
    
ftp = ftplib.FTP(FTP_HOST)
ftp.login(FTP_USER, FTP_PASS)
with open(LOCAL_DB, "wb") as f:
    ftp.retrbinary(f"RETR {DB_REMOTE}", f.write)
ftp.quit()

print("Checking products...")
conn = sqlite3.connect(LOCAL_DB)
cursor = conn.cursor()

# Check CAKES table where products are stored
try:
    cursor.execute("SELECT category, name, slug FROM cakes ORDER BY category")
    products = cursor.fetchall()
    print(f"Total products: {len(products)}")
    for p in products:
        print(f"  {p[0]}: {p[1]} ({p[2]})")
except Exception as e:
    print(f"Error reading cakes: {e}")

conn.close()
