import urllib.request
import json
import time
import ftplib
import io

print('Reading local backend/main.py...')
with open('backend/main.py', 'r', encoding='utf-8') as f:
    content = f.read()

diag_code = """
@app.get("/api/v1/routes")
def _list_routes():
    routes = []
    for route in app.routes:
        if hasattr(route, "path"):
            routes.append({"path": route.path, "name": getattr(route, "name", "")})
    return routes
"""

if '/api/v1/routes' not in content:
    content = content.replace('def _diag_endpoint():', diag_code + '\n@app.get("/api/v1/diag")\ndef _diag_endpoint():')
    with open('backend/main.py', 'w', encoding='utf-8') as f:
        f.write(content)

print('Uploading main.py...')
ftp = ftplib.FTP('leadgin.ftp.tools')
ftp.login('leadgin_vitya', 'xQ3wxZtiD1jdL3mnB7be')
ftp.storbinary('STOR /www/backend/main.py', io.BytesIO(content.encode('utf-8')))

print('Uploading restart.txt...')
ftp.storbinary('STOR /www/tmp/restart.txt', io.BytesIO(str(time.time()).encode('utf-8')))

# Wait for HostUkraine to sometimes honor restart.txt
time.sleep(3)

print('Testing /api/v1/routes ...')
try:
    req = urllib.request.Request('https://kievdrova.com.ua/api/v1/routes', headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10)
    body = resp.read().decode('utf-8')
    try:
        data = json.loads(body)
        print('Total routes:', len(data))
        found = False
        for r in data:
            if '/products' in r['path']:
                print('Found:', r['path'])
                found = True
        if not found:
            print('NO PRODUCTS ROUTES FOUND!')
    except:
        print('Raw HTML returned. Length:', len(body))
        print(body[:200])
except urllib.error.HTTPError as e:
    print('HTTP ERROR:', e.code)
    try:
        print(e.read().decode('utf-8')[:200])
    except:
        pass
except Exception as e:
    print('Error requesting routes:', e)

ftp.quit()
