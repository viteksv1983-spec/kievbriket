import sqlite3
import json

conn = sqlite3.connect('backend/sql_app.db')
c = conn.cursor()

data = {
    'name': 'Вугільні брикети',
    'short_description': 'Замовити вугільні брикети у Києві. Найвищий рівень тепловіддачі, ультрадовге горіння. Ідеально для твердопаливних котлів та печей. Доставка.',
    'description': '''<p><strong>Вугільні брикети (углеродні брикети)</strong> — це сучасне, високоефективне паливо, створене завдяки пресуванню дрібної фракції якісного вугілля. Цей формат ідеально підходить для тих, хто хоче отримати максимальну температуру та найбільшу тривалість горіння. На відміну від звичайного рядового вугілля, брикети мають однакову форму та щільність, завдяки чому горять рівномірно та не прокидаються крізь колосники.</p>

<p>Їхня тепловіддача значно перевищує показники звичайних деревних брикетів або <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">дров</a></strong>. Завантаживши котел ввечері вугільними брикетами, ви гарантовано матимете стабільне тепло до самого ранку. Вони утворюють мінімальну кількість диму, що робить їх використання дуже екологічним і зручним у домашніх умовах, не забруднюючи димоходи так швидко, як звичайне <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">вугілля</a></strong> нижчих марок.</p>

<p>Вугільні брикети запаковані у мішки, тому їх легко зберігати й переносити без пилу та бруду навколо котла. Спробуйте цей інноваційний продукт і переконайтесь у його перевагах! Якщо вас цікавлять класичні деревні аналоги, завжди можна обрати <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші брикети</a></strong> в нашому каталозі.</p>''',
    'specifications_json': json.dumps([
        {"label": "Тип палива", "value": "Вугільні брикети"},
        {"label": "Склад", "value": "Пресований вугільний пил (антрацит/кам'яне)"},
        {"label": "Форма брикету", "value": "Стандартні пресовані подушечки"},
        {"label": "Вологість", "value": "До 5-7%"},
        {"label": "Теплотворність", "value": "6000-6500 ккал/кг"},
        {"label": "Фасування", "value": "Мішки по 25-50 кг"},
        {"label": "Зольність", "value": "8-12%"},
        {"label": "Сфера використання", "value": "Твердопаливні котли, побутові печі"},
        {"label": "Доставка", "value": "Київ та Київська область"}
    ], ensure_ascii=False),
    'faqs_json': json.dumps([
        {"q": "Чим вугільні брикети кращі за звичайне вугілля?", "a": "Брикети не мають фракції 'пилу', вони не прокидаються в зольник, горять рівномірніше і довше. До того ж, упаковка в мішки робить вашу котельню значно чистішою."},
        {"q": "Чи можна палити ними у звичайній сільській печі?", "a": "Так, вони чудово підходять для класичних груб, забезпечуючи дуже довге тління та стабільну температуру в будинку навіть у найсильніші морози."},
        {"q": "Чи багато залишку (шлаку) від вугільних брикетів?", "a": "Сучасні вугільні брикети мають контрольовану зольність (близько 10%). Шлаку від них значно менше порівняно з рядовим вугіллям невідомого походження."},
        {"q": "Як швидко виставляється доставка?", "a": "Ми доставляємо замовлення по Києву та області зазвичай наступного дня або навіть у день замовлення власним автопарком."}
    ], ensure_ascii=False),
    'meta_title': 'Купити вугільні брикети у Києві — довготривале горіння | КиївБрикет',
    'meta_description': 'Якісні вугільні (углеродні) брикети. Найвища тепловіддача, зручне фасування, відсутність пилу. Замовляйте з швидкою доставкою по Києву.',
    'image_alt': 'вугільні брикети углеродний брикет купити київ',
    'schema_json': json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Product",
                "name": "Вугільні брикети",
                "description": "Замовити вугільні брикети у Києві. Найвищий рівень тепловіддачі, ультрадовге горіння.",
                "sku": "brykety-ruf-premium",
                "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
            }
        ]
    }, ensure_ascii=False)
}

try:
    c.execute("""
        UPDATE products 
        SET name = ?, short_description = ?, description = ?, 
            specifications_json = ?, faqs_json = ?, meta_title = ?, 
            meta_description = ?, image_alt = ?, schema_json = ?
        WHERE slug = 'brykety-ruf-premium'
    """, (
        data['name'], data['short_description'], data['description'],
        data['specifications_json'], data['faqs_json'], data['meta_title'],
        data['meta_description'], data['image_alt'], data['schema_json']
    ))
    print(f"Updated slug 'brykety-ruf-premium' in 'products': {c.rowcount} rows affected.")
except Exception as e:
    print("Table products not found or err:", e)

try:
    c.execute("""
        UPDATE cakes 
        SET name = ?, short_description = ?, description = ?, 
            specifications_json = ?, faqs_json = ?, meta_title = ?, 
            meta_description = ?, image_alt = ?, schema_json = ?
        WHERE slug = 'brykety-ruf-premium'
    """, (
        data['name'], data['short_description'], data['description'],
        data['specifications_json'], data['faqs_json'], data['meta_title'],
        data['meta_description'], data['image_alt'], data['schema_json']
    ))
    print(f"Updated slug 'brykety-ruf-premium' in 'cakes': {c.rowcount} rows affected.")
except Exception as e:
    print("Table cakes not found or err:", e)

conn.commit()
conn.close()
