import sqlite3
import json
import os

db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sql_app.db')
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

variants = json.dumps([
    {"name": "Метровки", "price": 2000},
    {"name": "Фруктові мікси", "price": 2300}
], ensure_ascii=False)

cursor.execute("UPDATE cakes SET variants = ? WHERE name LIKE '%фруктові%'", (variants,))
cursor.execute("UPDATE cakes SET variants = ? WHERE name LIKE '%дубові%' OR name LIKE '%Дубов%'", (json.dumps([{"name": "Рубані дрова", "price": 2200}, {"name": "Пеньки", "price": 2000}], ensure_ascii=False),))

conn.commit()
print("Rows updated for fruit/oak:", cursor.rowcount)
conn.close()
