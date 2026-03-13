import urllib.request
import ssl
import json
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

SITE = 'https://kievdrova.com.ua'
ts = int(time.time())

print('Testing without unique timestamp...')
req = urllib.request.Request(f'{SITE}/api/v1/products/?category=brikety&limit=5', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    print("Headers:")
    print(resp.headers)
    data = json.loads(resp.read().decode('utf-8'))
    print(f"Items returned: {len(data.get('items', []))}")
except Exception as e:
    print(e)
    
print('\nTesting WITH unique timestamp...')
req = urllib.request.Request(f'{SITE}/api/v1/products/?category=brikety&limit=5&_nocache={ts}', headers={'User-Agent': 'Mozilla/5.0'})
try:
    resp = urllib.request.urlopen(req, timeout=10, context=ctx)
    print("Headers:")
    print(resp.headers)
    data = json.loads(resp.read().decode('utf-8'))
    print(f"Items returned: {len(data.get('items', []))}")
except Exception as e:
    print(e)
