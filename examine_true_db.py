import sqlite3
import os

db_path = 'true_live_db.db'
if not os.path.exists(db_path):
    print("File not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [t[0] for t in cursor.fetchall()]

print("Tables in /www/db/sql_app.db:")
for table in tables:
    print(f" - {table}")

if 'products' in tables:
    cursor.execute("SELECT category, count(*) FROM products GROUP BY category")
    print("\nProducts by category:")
    for row in cursor.fetchall():
        print(f"   {row[0]}: {row[1]}")

if 'cakes' in tables:
    cursor.execute("SELECT category, count(*) FROM cakes GROUP BY category")
    print("\ntable 'cakes' has data:")
    for row in cursor.fetchall():
        print(f"   {row[0]}: {row[1]}")

conn.close()
