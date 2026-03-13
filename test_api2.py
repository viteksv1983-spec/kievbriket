import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://kievdrova.com.ua/api/v1/products/?limit=99'
print(f'Fetching {url}')
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    body = resp.read().decode('utf-8')
    data = json.loads(body)
    print(f"Products dict keys: {data.keys()}")
    items = data.get('items', [])
    print(f"Total products returned: {len(items)}")
    for p in items[:5]:
        print(f" - {p.get('name')} (category: {p.get('category')}, is_available: {p.get('is_available')})")
except Exception as e:
    print('Error:', e)
