import ftplib
import uuid

HOST = "leadgin.ftp.tools"
USER = "leadgin_vitya"
PASSWORD = "xQ3wxZtiD1jdL3mnB7be"

tmp_file = f"temp_check_{uuid.uuid4().hex}.sqlite3"

ftp = ftplib.FTP(HOST)
ftp.login(USER, PASSWORD)
with open(tmp_file, "wb") as f:
    ftp.retrbinary("RETR /backend/sql_app.db", f.write)
ftp.quit()

import sqlite3
import os

try:
    conn = sqlite3.connect(tmp_file)
    cur = conn.cursor()
    cur.execute("PRAGMA table_info(site_settings)")
    cols = [r[1] for r in cur.fetchall()]
    print("Columns in site_settings:", cols)
    conn.close()
except:
    pass

try:
    os.remove(tmp_file)
except:
    pass
