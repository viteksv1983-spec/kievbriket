"""
Seed the category_metadata table with SEO text for the 3 categories:
- firewood (drova)
- briquettes (brikety)  
- coal (vugillya)

Run:  python seed_category_seo.py
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "sql_app.db")

# Map category slug -> seo_text HTML
CATEGORY_SEO_DATA = {
    "drova": {
        "seo_text": """
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:3rem">
  <div>
    <p>Купити дрова з доставкою по Києву та Київській області можна безпосередньо у постачальника. Компанія «КиївБрикет» пропонує колоті дрова різних порід дерева для ефективного опалення приватних будинків, котлів та камінів, а також <a href="/catalog/brikety">паливні брикети</a> та <a href="/catalog/vugillya">кам'яне вугілля</a>.</p>
    <p>Ми доставляємо дрова дуба, граба, сосни, берези та вільхи. Усі дрова мають низьку вологість та високу тепловіддачу. Працює швидка та зручна <a href="/dostavka">доставка по Києву</a> та області.</p>
  </div>
  <div>
    <h3>Популярні породи дров:</h3>
    <ul>
      <li>🔥 дубові дрова</li>
      <li>🔥 грабові дрова</li>
      <li>🔥 березові дрова</li>
      <li>🔥 соснові дрова</li>
      <li>🔥 вільхові дрова</li>
    </ul>
    <h4>Також дивіться:</h4>
    <p><a href="/catalog/brikety">Паливні брикети</a> · <a href="/catalog/vugillya">Кам'яне вугілля</a> · <a href="/dostavka">Доставка</a></p>
  </div>
</div>
""",
    },
    "brikety": {
        "seo_text": """
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:3rem">
  <div>
    <p>Паливні брикети — це сучасна та високоефективна альтернатива традиційним <a href="/catalog/drova">дровам</a>. Вони виготовляються шляхом пресування тирси, тріски та інших деревних відходів без додавання будь-якої хімії. Завдяки високому тиску при виробництві, брикети мають надзвичайно низьку вологість (до 8%) та величезну щільність, що робить їх безпечнішою та чистішою альтернативою, ніж <a href="/catalog/vugillya">кам'яне вугілля</a>.</p>
    <p>Це означає, що їх тепловіддача значно перевищує тепловіддачу навіть найсухіших дубових дров. Вони горять довго, стабільно і майже не залишають золи.</p>
  </div>
  <div>
    <p>Окрім чудових теплових характеристик, брикети надзвичайно зручні у зберіганні. Вони акуратно спаковані на піддонах або в упаковках по 10 кг, не засмічують приміщення корою чи пилом.</p>
    <p>Компанія «КиївБрикет» пропонує брикети найвищої якості стандартів RUF, Pini Kay та Nestro з доставкою по Києву та Київській області автотранспортом надійно та швидко.</p>
  </div>
</div>
""",
    },
    "vugillya": {
        "seo_text": """
<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));gap:3rem">
  <div>
    <p>Шукаєте надійне та економне джерело тепла? Пропонуємо <strong>купити вугілля київ</strong> за вигідними цінами. Наше вугілля має високу теплотворність, довго горить та залишає мінімум золи, що робить його ідеальним вибором як для побутових, так і для промислових потреб.</p>
    <p>Ми постачаємо гарантовано якісне <strong>кам'яне вугілля</strong>, яке проходить ретельний контроль вологості та зольності. Незалежно від того, чи потрібне вам паливо для невеликого домашнього котла, чи для великої котельні, ми запропонуємо найкращий з актуальних варіант.</p>
  </div>
  <div>
    <p>Особливим попитом користується <strong>антрацит</strong> — преміальне паливо, що забезпечує максимальну температуру та відсутність диму при горінні. Замовляючи у нас, ви гарантовано отримуєте чесну вагу з доставкою.</p>
    <p>Також у нашому асортименті доступні й інші види твердого палива. Ви завжди можете обрати класичні <a href="/catalog/drova">дрова</a> або спробувати зручні <a href="/catalog/brikety">паливні брикети</a>, які відмінно доповнюють або замінюють вугілля у деяких котлах.</p>
  </div>
</div>
""",
    },
}

# Also set seo_h1 for each category if not already set
CATEGORY_H1 = {
    "drova": "Купити дрова у Києві",
    "brikety": "Купити паливні брикети у Києві",
    "vugillya": "Купити кам'яне вугілля у Києві",
}

def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    for slug, data in CATEGORY_SEO_DATA.items():
        cursor.execute(
            """
            UPDATE category_metadata
            SET seo_text = ?,
                seo_h1 = COALESCE(seo_h1, ?)
            WHERE slug = ?
            """,
            (data["seo_text"].strip(), CATEGORY_H1.get(slug, ""), slug)
        )
        if cursor.rowcount > 0:
            print(f"[OK] Updated seo_text for category: {slug}")
        else:
            print(f"[WARN] No category_metadata row found for slug: {slug}")

    conn.commit()
    conn.close()
    print("\nDone! Category SEO text seeded successfully.")

if __name__ == "__main__":
    main()
