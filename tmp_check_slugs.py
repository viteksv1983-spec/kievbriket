import sqlite3

def check_db():
    conn = sqlite3.connect('backend/sql_app.db')
    c = conn.cursor()
    c.execute("SELECT id, name, slug FROM cakes WHERE category = 'brikety'")
    rows = c.fetchall()
    for row in rows:
        print(row)
    conn.close()

if __name__ == "__main__":
    check_db()
