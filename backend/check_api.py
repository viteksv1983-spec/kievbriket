import requests, json

r = requests.get("https://kievbriket-api.onrender.com/products/?category=vugillya&limit=1", timeout=15)
data = r.json()
items = data.get("items", [])
if items:
    p = items[0]
    print("name:", p.get("name"))
    desc = p.get("description", "")
    print(f"description length: {len(desc)}")
    print(f"description preview: {desc[:300]}")
    print(f"has faqs_json: {p.get('faqs_json') is not None}")
    fj = p.get("faqs_json")
    if fj:
        print(f"faqs_json type: {type(fj).__name__}, len: {len(fj) if isinstance(fj, (list,str)) else 'N/A'}")
        print(f"faqs_json preview: {str(fj)[:200]}")
    print(f"has variants: {p.get('variants') is not None}")
    v = p.get("variants")
    if v:
        print(f"variants: {v}")
    print(f"meta_title: {p.get('meta_title', 'NONE')}")
    print(f"schema_json present: {bool(p.get('schema_json'))}")
