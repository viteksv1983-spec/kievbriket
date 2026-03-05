import urllib.request
import json
req = urllib.request.urlopen("https://kievbriket-api.onrender.com/products/?limit=100")
data = json.loads(req.read().decode())
items = data if isinstance(data, list) else data.get("items", [])
for p in items:
    if p.get('category') == 'brikety':
        print(f"Slug: {p['slug']} | Name: {p['name']}")
