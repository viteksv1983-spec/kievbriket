import requests

# Login
r = requests.post('http://localhost:8000/token', data={'username':'admin','password':'admin'})
print(f"Login: {r.status_code} {r.text[:200]}")
if r.status_code != 200:
    print("Trying health-check without auth...")
    h2 = requests.get('http://localhost:8000/health-check')
    print(f"Health: {h2.status_code} {h2.text[:200]}")
    # Try flags without auth
    f = requests.get('http://localhost:8000/admin/feature-flags')
    print(f"Flags (no auth): {f.status_code} {f.text[:200]}")
else:
    token = r.json()['access_token']
    h = {'Authorization': f'Bearer {token}'}

    # Stats
    print('=== STATS ===')
    s = requests.get('http://localhost:8000/admin/stats', headers=h)
    print(f"Status: {s.status_code}")
    print(s.json())

    # Flags
    print()
    print('=== FLAGS ===')
    f = requests.get('http://localhost:8000/admin/feature-flags', headers=h)
    flags = f.json()
    print(f"Status: {f.status_code}, {len(flags)} flags")
    for fl in flags:
        print(f"  {fl['name']}: {fl['enabled']} -- {fl['description']}")
