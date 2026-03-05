import sqlite3
import pprint

def check_db():
    conn = sqlite3.connect('backend/db.sqlite3')
    c = conn.cursor()
    c.execute("PRAGMA table_info(catalog_product)")
    columns = c.fetchall()
    print("Columns in catalog_product:")
    for col in columns:
        print(col[1])
        
    print("\nCurrent Briquette slugs:")
    c.execute("SELECT slug FROM catalog_product WHERE category_id = (SELECT id FROM catalog_category WHERE slug = 'brikety')")
    rows = c.fetchall()
    for row in rows:
        print(row[0])
    conn.close()

if __name__ == "__main__":
    check_db()
