import sqlite3

def run_migration():
    conn = sqlite3.connect('backend/sql_app.db')
    c = conn.cursor()
    try:
        c.execute('ALTER TABLE users ADD COLUMN is_superadmin BOOLEAN DEFAULT 0')
        print("Successfully added is_superadmin column.")
    except Exception as e:
        print("Column might already exist or err:", e)
        
    try:
        c.execute("UPDATE users SET is_superadmin=1 WHERE email='admin'")
        conn.commit()
        print(f"Updated user 'admin' to superadmin. {c.rowcount} rows affected.")
    except Exception as e:
        print("Error updating admin:", e)
    
    conn.close()

if __name__ == "__main__":
    run_migration()
