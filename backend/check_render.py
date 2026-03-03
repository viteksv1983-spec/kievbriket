import time
import urllib.request
import json

url = "https://kievbriket-api.onrender.com/api/migrate-slugs-live"

print("Polling Render for deployment...")
for i in range(30):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode('utf-8')
            data = json.loads(res_body)
            if data.get("status") == "success":
                print(f"\nSUCCESS! Render Database migrated: {data.get('migrated_categories')}")
                break
    except urllib.error.HTTPError as e:
        if e.code == 404:
            print(".", end="", flush=True)
        else:
            print(f"HTTP Error: {e.code}")
    except Exception as e:
        print(f"E", end="", flush=True)
    time.sleep(10)

print("\nFinished polling.")
