import ftplib
import os

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)
with open("temp_prod_db.sqlite3", "rb") as dbf:
    ftp.storbinary("STOR /backend/sql_app.db", dbf)
ftp.quit()
print("DB Reverted on FTP!")
