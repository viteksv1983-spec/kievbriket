import urllib.request
import urllib.error

print('Checking homepage for favicon links...')
try:
    req = urllib.request.Request('https://kievdrova.com.ua/', headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10)
    html = resp.read().decode('utf-8')
    
    # Simple string search instead of bs4 to avoid dependency issues online
    lines = html.split('\n')
    for line in lines:
        if 'rel="icon"' in line or "rel='icon'" in line or 'favicon' in line.lower():
            print('Found link:', line.strip())
            
except Exception as e:
    print('Failed to analyze homepage:', e)

# Also check default /favicon.ico
print('\nChecking default /favicon.ico...')
try:
    res = urllib.request.urlopen(urllib.request.Request('https://kievdrova.com.ua/favicon.ico', headers={'User-Agent': 'Mozilla/5.0'}))
    print(f' -> SUCCESS: https://kievdrova.com.ua/favicon.ico exists (HTTP {res.status})')
except urllib.error.HTTPError as e:
    print(f' -> ERROR: https://kievdrova.com.ua/favicon.ico returned HTTP {e.code}')
except Exception as e:
    print(f' -> ERROR checking default favicon: {e}')
    
# Check what Vite built
print('\nChecking Vite output /kievdrova.svg...')
try:
    res = urllib.request.urlopen(urllib.request.Request('https://kievdrova.com.ua/kievdrova.svg', headers={'User-Agent': 'Mozilla/5.0'}))
    print(f' -> SUCCESS: https://kievdrova.com.ua/kievdrova.svg exists (HTTP {res.status})')
except urllib.error.HTTPError as e:
    print(f' -> ERROR: https://kievdrova.com.ua/kievdrova.svg returned HTTP {e.code}')
except Exception as e:
    print(f' -> ERROR checking kievdrova.svg favicon: {e}')
