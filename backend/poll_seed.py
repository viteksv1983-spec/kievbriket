import urllib.request
import time
import json

url = "https://kievbriket-api.onrender.com/api/seed-briquettes-live"

print("Waiting for Render to deploy the new code (expecting 6 items updated)...")
for _ in range(15):
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode('utf-8'))
        print(data)
        if len(data.get('slugs', [])) == 6:
            print("Successfully updated 6 items!")
            break
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(20)
