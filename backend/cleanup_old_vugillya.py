import requests

API = "https://kievbriket-api.onrender.com"

# 1. Login
resp = requests.post(f"{API}/token", data={"username": "admin", "password": "admin"}, timeout=15)
if resp.status_code != 200:
    print(f"Login failed: {resp.status_code} {resp.text[:200]}")
    exit(1)
token = resp.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}
print("Logged in OK")

# 2. Old slugs to delete
old_slugs = {
    "vuhillya-antratsyt-horikh", "vuhillya-antratsyt-nasinnya", "vuhillya-hazove-dpk",
    "vuhillya-antratsyt-kub-ako", "koks-metalurhiynyy", "vuhillya-hazove-do",
    "test-coal-temp-delete-me"
}

# 3. Get all vugillya products
resp = requests.get(f"{API}/products/?category=vugillya&limit=50", timeout=15)
products = resp.json().get("items", [])
print(f"Found {len(products)} vugillya products total")

# 4. Delete old ones
for p in products:
    if p["slug"] in old_slugs:
        pid = p["id"]
        r = requests.delete(f"{API}/products/{pid}", headers=headers, timeout=15)
        status = "OK" if r.status_code == 200 else f"FAIL({r.status_code})"
        print(f"  Delete {p['slug']} (id={pid}): {status}")

# 5. Also delete test product (might be in different category)
try:
    resp2 = requests.get(f"{API}/products/test-coal-temp-delete-me", timeout=15)
    if resp2.status_code == 200:
        tid = resp2.json().get("id")
        r = requests.delete(f"{API}/products/{tid}", headers=headers, timeout=15)
        print(f"  Delete test-coal-temp-delete-me (id={tid}): OK")
except:
    pass

# 6. Verify
resp = requests.get(f"{API}/products/?category=vugillya&limit=50", timeout=15)
remaining = resp.json().get("items", [])
print(f"\nRemaining vugillya products: {len(remaining)}")
for p in remaining:
    print(f"  - {p['name']} (slug={p['slug']}, id={p['id']})")
