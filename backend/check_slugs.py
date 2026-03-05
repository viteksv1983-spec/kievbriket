import urllib.request
import json
req = urllib.request.urlopen("https://kievbriket-api.onrender.com/products/?limit=100")
data = json.loads(req.read().decode())
items = data if isinstance(data, list) else data.get("items", [])
brikety = [p for p in items if p.get("category") in ["brikety", "briquettes"]]
for b in brikety:
    print(f"Slug: {b['slug']} - Has Desc: {bool(b.get('short_description'))}")
