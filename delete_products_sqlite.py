import sqlite3
import glob

to_remove = ["Дрова в ящиках", "Дрова для каміна", "Дрова в сітках", "Дрова для розпалу"]

dbs = glob.glob('**/*.db', recursive=True)

for db_path in dbs:
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='products'")
        if cursor.fetchone():
            cursor.execute("SELECT id, name FROM products")
            products = cursor.fetchall()
            
            deleted = 0
            for p_id, p_name in products:
                if p_name in to_remove:
                    print(f"[{db_path}] Deleting {p_name} (ID: {p_id})")
                    cursor.execute("DELETE FROM products WHERE id = ?", (p_id,))
                    deleted += 1
            
            if deleted > 0:
                conn.commit()
                print(f"[{db_path}] Deleted {deleted} products.")
            else:
                print(f"[{db_path}] Has products table, but 0 target products found.")
        conn.close()
    except Exception as e:
        print(f"[{db_path}] Error: {e}")
