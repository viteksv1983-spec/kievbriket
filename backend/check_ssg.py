import requests

r = requests.get("https://kievbriket.vercel.app/catalog/vugillya/vugillya-dg", timeout=15)
html = r.text

markers = [
    "Вугілля ДГ",
    "Переваги вугілля ДГ",
    "Характеристики вугілля ДГ",
    "Доставка вугілля ДГ",
    "Що таке вугілля ДГ",
    "Для яких котлів",
    "product-seo-description",
    "Товар не знайдено",
    "doступне паливо для побутового опалення",
    "Теплотворність",
    "5000",
    "faqs_json",
]

for m in markers:
    found = m in html
    status = "OK" if found else "NO"
    print(f"  {status} | {m}")

print(f"\nHTML length: {len(html)}")

# Check for description section specifically
import re
desc_match = re.search(r'product-seo-description', html)
if desc_match:
    start = max(0, desc_match.start() - 100)
    end = min(len(html), desc_match.end() + 500)
    print(f"\nDescription context:\n{html[start:end]}")
else:
    # Look for the description card
    desc_match2 = re.search(r'Про це вугілля', html)
    if desc_match2:
        start = max(0, desc_match2.start() - 100)
        end = min(len(html), desc_match2.end() + 500)
        print(f"\nDescription card context:\n{html[start:end]}")
    else:
        print("\nNo description section found!")
