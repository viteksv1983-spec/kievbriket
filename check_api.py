import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SITE = 'https://kievdrova.com.ua'
ts = int(time.time())

for cat in ['drova', 'brikety', 'vugillya']:
    try:
        req = urllib.request.Request(
            f'{SITE}/api/v1/products/?category={cat}&limit=5&_t={ts}',
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        resp = urllib.request.urlopen(req, timeout=10, context=ctx)
        data = json.loads(resp.read().decode('utf-8'))
        items = data.get('items', [])
        print(f'\nAPI request for {cat}: returned {len(items)} items')
        for p in items[:5]:
            print(f"  - {p.get('name')} (category: {p.get('category')})")
    except Exception as e:
        print(f'{cat}: Error: {e}')
