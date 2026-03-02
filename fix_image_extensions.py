import sqlite3

DB_PATH = 'backend/sql_app.db'

def fix_image_extensions():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    
    # Check what images look like right now
    cur.execute('SELECT id, image_url FROM cakes WHERE image_url LIKE "%.jpg"')
    rows = cur.fetchall()
    print(f"Products with .jpg: {len(rows)}")
    
    # Update products
    cur.execute('''
        UPDATE cakes 
        SET image_url = REPLACE(image_url, '.jpg', '.webp') 
        WHERE image_url LIKE '%.jpg'
    ''')
    print(f"Updated product image URLs (cakes table). Rows affected: {cur.rowcount}")

    # Check categories
    cur.execute('SELECT id, image_url FROM category_metadata WHERE image_url LIKE "%.jpg" OR image_url LIKE "%.png"')
    cat_rows = cur.fetchall()
    print(f"Categories with .jpg/.png: {len(cat_rows)}")
    
    # Update categories (though we just seeded some, checking just in case)
    cur.execute('''
        UPDATE category_metadata 
        SET image_url = REPLACE(image_url, '.jpg', '.webp') 
        WHERE image_url LIKE '%.jpg'
    ''')
    print(f"Updated category image URLs. Rows affected: {cur.rowcount}")

    conn.commit()
    conn.close()

if __name__ == "__main__":
    fix_image_extensions()
