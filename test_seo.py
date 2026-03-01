import requests

r = requests.get('http://localhost:8000/robots.txt')
print('ROBOTS:', r.status_code)
print(r.text)
print()

r2 = requests.get('http://localhost:8000/sitemap.xml')
print('SITEMAP:', r2.status_code, len(r2.text), 'bytes')
url_count = r2.text.count('<url>')
print(f'{url_count} URLs in sitemap')
# Print first 5 lines and last 3
lines = r2.text.split('\n')
for line in lines[:6]:
    print(line)
print('...')
for line in lines[-4:]:
    print(line)
