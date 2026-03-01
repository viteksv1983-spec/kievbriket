import sqlite3
conn = sqlite3.connect("sql_app.db")
cursor = conn.cursor()
cursor.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='category_metadata';")
print(cursor.fetchone()[0])

cursor.execute("UPDATE alembic_version SET version_num = '869e47cb71c3'")
conn.commit()
conn.close()
print("Updated alembic version")
