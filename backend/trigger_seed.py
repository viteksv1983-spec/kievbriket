import urllib.request
import time
import json
print("Waiting 30 seconds for Render to deploy...")
time.sleep(30)
url = "https://kievbriket-api.onrender.com/api/seed-briquettes-live"
try:
    response = urllib.request.urlopen(url)
    data = json.loads(response.read().decode('utf-8'))
    print(data)
except Exception as e:
    print(f"Error: {e}")
