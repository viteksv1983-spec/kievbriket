import sqlite3
conn = sqlite3.connect('backend/sql_app.db')
c = conn.cursor()
c.execute("SELECT slug, category FROM cakes;")
print(c.fetchall())
conn.close()
