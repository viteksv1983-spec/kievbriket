"""Quick verification of live API after cache expiry."""
import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SITE = "https://kievdrova.com.ua"
ts = int(time.time())

print("=== PRODUCT COUNTS ===")
for cat in ["drova", "brikety", "vugillya"]:
    try:
        req = urllib.request.Request(
            f"{SITE}/api/v1/products/?category={cat}&limit=20&_t={ts}",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode("utf-8"))
        items = data.get("items", [])
        print(f"\n  {cat}: {data.get('total', len(items))} products")
        for p in items[:3]:
            print(f"    - {p.get('name')} | price={p.get('price')} | slug={p.get('slug')}")
        if len(items) > 3:
            print(f"    ... +{len(items)-3} more")
    except Exception as e:
        print(f"  {cat}: Error: {e}")

print("\n=== CATEGORIES ===")
try:
    req = urllib.request.Request(
        f"{SITE}/api/v1/products/categories?_t={ts}",
        headers={"User-Agent": "Mozilla/5.0"}
    )
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    cats = json.loads(resp.read().decode("utf-8"))
    for c in cats:
        print(f"  {c['slug']}: name={c.get('name')} | image={c.get('image_url')}")
except Exception as e:
    print(f"  Error: {e}")
