import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://kievdrova.com.ua/api/v1/products/categories'
print(f'Fetching {url}')
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    print(f'HTTP {resp.status}')
    body = resp.read().decode('utf-8')
    try:
        data = json.loads(body)
        print(f'Items returned: {len(data)}')
        for cat in data:
            print(f" - {cat.get('name')} ({cat.get('slug')})")
    except:
        print('Raw response:', body[:200])
except urllib.error.HTTPError as e:
    print(f'HTTP Error {e.code}')
    try:
        print(e.read().decode('utf-8')[:200])
    except:
        pass
except Exception as e:
    print('Error:', e)
