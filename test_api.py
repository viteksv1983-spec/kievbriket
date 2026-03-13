import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://kievdrova.com.ua/api/v1/products/'
print(f'Fetching {url}')
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    print(f'HTTP {resp.status}')
    body = resp.read().decode('utf-8')
    try:
        data = json.loads(body)
        print(f'Type: {type(data)}')
        if isinstance(data, dict) and 'items' in data:
            print(f'Items returned: {len(data["items"])}')
            for p in data['items'][:3]:
                print(f" - {p.get('name')} (cat: {p.get('category')}, avail: {p.get('is_available')})")
        else:
            print(f"Raw data items: {len(data)}")
            for p in data[:3]:
                 print(f" - {p.get('name')} (cat: {p.get('category')}, avail: {p.get('is_available')})")
    except Exception as parse_e:
        print('Parse Error:', parse_e)
        print('Raw response:', body[:200])
except Exception as e:
    print('Error:', e)

url2 = 'https://kievdrova.com.ua/api/v1/products/categories'
print(f'\nFetching {url2}')
try:
    req = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    body = resp.read().decode('utf-8')
    data = json.loads(body)
    for c in data:
        print(f"Cat {c.get('slug')}: image_url={c.get('image_url')}")
except Exception as e:
    print('Error:', e)
