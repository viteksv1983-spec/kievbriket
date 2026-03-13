import urllib.request
import urllib.error
import time

print('Waiting 2s for HostUkraine to serve new HTML files...')
time.sleep(2)

print('Checking homepage for favicon links...')
try:
    req = urllib.request.Request('https://kievdrova.com.ua/?cachebust=' + str(time.time()), headers={'User-Agent': 'Mozilla/5.0'})
    resp = urllib.request.urlopen(req, timeout=10)
    html = resp.read().decode('utf-8')
    
    lines = html.split('\n')
    found_any = False
    for line in lines:
        if 'rel="icon"' in line or "rel='icon'" in line or 'favicon' in line.lower():
            print('Found link:', line.strip())
            found_any = True
            
            # Simple extraction for testing
            if 'href="' in line:
                href = line.split('href="')[1].split('"')[0]
                if href.startswith('/'):
                    url = 'https://kievdrova.com.ua' + href
                elif href.startswith('http'):
                    url = href
                else:
                    url = 'https://kievdrova.com.ua/' + href
                    
                try:
                    res = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}))
                    print(f' -> SUCCESS: {url} exists (HTTP {res.status})')
                    print(f' -> Content-Type: {res.headers.get("Content-Type")}')
                except urllib.error.HTTPError as e:
                    print(f' -> ERROR: {url} returned HTTP {e.code}')
                except Exception as e:
                    print(f' -> ERROR checking {url}: {e}')
                    
    if not found_any:
        print('No favicon link found in HTML head!')
                
except Exception as e:
    print('Failed to analyze homepage:', e)
