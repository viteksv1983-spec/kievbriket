import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'backend', 'sql_app.db')

def seed():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Clear old categories
    cursor.execute("DELETE FROM category_metadata")

    # Insert 3 new categories
    categories = [
        ('firewood', 'Дрова', 'Найкращі дрова для опалення.', '<p>SEO текст для дров.</p>', '/media/categories/firewood.jpg'),
        ('briquettes', 'Паливні брикети', 'Ефективні паливні брикети.', '<p>SEO текст для брикетів.</p>', '/media/categories/briquettes.jpg'),
        ('coal', 'Вугілля', 'Якісне вугілля.', '<p>SEO текст для вугілля.</p>', '/media/categories/coal.jpg'),
    ]

    cursor.executemany(
        "INSERT INTO category_metadata (slug, name, description, seo_text, image_url) VALUES (?, ?, ?, ?, ?)",
        categories
    )

    conn.commit()
    conn.close()
    print("Database seeded with exactly 3 base categories.")

if __name__ == "__main__":
    seed()
