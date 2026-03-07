import requests
import json

resp = requests.get('https://kievbriket-api.onrender.com/products/?limit=100')
items = resp.json().get('items', [])

for p in items:
    if 'акац' in p.get('name', '').lower():
        print(json.dumps({
            'name': p['name'],
            'price': p['price'],
            'variants': p.get('variants', [])
        }, ensure_ascii=False, indent=2))
