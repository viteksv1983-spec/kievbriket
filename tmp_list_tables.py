import sqlite3
conn = sqlite3.connect('backend/db.sqlite3')
c = conn.cursor()
c.execute("SELECT name FROM sqlite_master WHERE type='table';")
print(c.fetchall())
conn.close()
