import urllib.request
import ssl
import json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Check the diag endpoint for more info
print("=== DIAG ENDPOINT ===")
try:
    req = urllib.request.Request("https://kievdrova.com.ua/api/v1/diag", headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    data = json.loads(resp.read().decode("utf-8"))
    print(json.dumps(data, indent=2))
except Exception as e:
    print(f"Error: {e}")

# Check if any existing seed endpoints work
print("\n=== TRYING KNOWN SEED ENDPOINTS ===")
seed_urls = [
    "/api/seed-drova-live",
    "/api/seed-briquettes-live",
    "/api/seed-all-live",
    "/api/v1/seed-brikety-live",
    "/api/v1/seed-vugillya-live",
]

for url in seed_urls:
    full_url = f"https://kievdrova.com.ua{url}"
    try:
        req = urllib.request.Request(full_url, headers={"User-Agent": "Mozilla/5.0"})
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        body = resp.read().decode("utf-8")
        print(f"  {url} -> HTTP {resp.status}: {body[:200]}")
    except urllib.error.HTTPError as e:
        print(f"  {url} -> HTTP {e.code}")
    except Exception as e:
        print(f"  {url} -> Error: {e}")

# Check total products
print("\n=== PRODUCT COUNTS ===")
for cat in ["drova", "brikety", "vugillya"]:
    try:
        req = urllib.request.Request(
            f"https://kievdrova.com.ua/api/v1/products/?category={cat}&limit=1",
            headers={"User-Agent": "Mozilla/5.0"},
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode("utf-8"))
        print(f"  {cat}: {data.get('total', 0)} products")
    except Exception as e:
        print(f"  {cat}: Error: {e}")
