import os
import shutil
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
BUILD_DIR = os.path.join(BASE_DIR, "kievdrova_deploy")

base_host_dir = "/home/leadgin/kievdrova.com.ua/www"
print(f"-> Розпочинаємо пакування проекту для {base_host_dir}")

# 1. Збірка React фронтенду
print("\n-> 1. Збираємо фронтенд...")
try:
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, shell=True, check=True)
    print("-> Фронтенд зібрано успішно.")
except subprocess.CalledProcessError:
    print("-> Помилка збірки фронтенду. Переконайтесь, що npm працює.")
    exit(1)

# 2. Створення директорії для деплою
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
os.makedirs(BUILD_DIR)

# 3. Копіюємо фронтенд у корінь
frontend_dist = os.path.join(FRONTEND_DIR, "dist")
if not os.path.exists(frontend_dist):
    print("-> Папка `dist` не знайдена у фронтенді. Збірка не вдалася.")
    exit(1)

for item in os.listdir(frontend_dist):
    s = os.path.join(frontend_dist, item)
    d = os.path.join(BUILD_DIR, item)
    if os.path.isdir(s):
        shutil.copytree(s, d)
    else:
        shutil.copy2(s, d)
print("-> Фронтенд скопійовано.")

# 4. Копіюємо бекенд 
def ignore_patterns(dir, files):
    return [f for f in files if f in ['__pycache__', 'venv', '.env', '.pytest_cache', 'tests', 'alembic', '.git']]

shutil.copytree(BACKEND_DIR, os.path.join(BUILD_DIR, "backend"), ignore=ignore_patterns)
print("-> Бекенд скопійовано.")

# 5. Створюємо passenger_wsgi.py
passenger_config = f"""import sys
import os

# Шлях до віртуального середовища на HostUkraine
INTERP = "{base_host_dir}/venv/bin/python3.12"
if os.path.exists(INTERP) and sys.executable != INTERP:
    os.execl(INTERP, INTERP, *sys.argv)

sys.path.insert(0, os.path.dirname(__file__))

from backend.main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
with open(os.path.join(BUILD_DIR, "passenger_wsgi.py"), "w", encoding="utf-8") as f:
    f.write(passenger_config)

# 6. Створюємо .htaccess
htaccess_content = """# Налаштування від хостингу для запуску Python замість PHP
PassengerEnabled on
PassengerAppType wsgi
PassengerStartupFile passenger_wsgi.py

RewriteEngine On

# Ensure Passenger DOES NOT intercept requests for existing physical files 
# (This allows Apache/Nginx to serve index.html, assets, and images directly)
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^ - [L]
"""
with open(os.path.join(BUILD_DIR, ".htaccess"), "w", encoding="utf-8") as f:
    f.write(htaccess_content)

# 7. Requirements.txt -- додаємо a2wsgi
req_in = os.path.join(BACKEND_DIR, "requirements.txt")
req_out = os.path.join(BUILD_DIR, "requirements.txt")
if os.path.exists(req_in):
    shutil.copy2(req_in, req_out)
    with open(req_out, "a", encoding="utf-8") as f:
        f.write("\na2wsgi\n")

# 8. Архівування
print("\n-> Архівуємо файли у `kievdrova_deploy.zip`...")
deploy_zip = os.path.join(BASE_DIR, "kievdrova_deploy")
shutil.make_archive(deploy_zip, 'zip', BUILD_DIR)

shutil.rmtree(BUILD_DIR)

print(f"\\n-> Все готово! Ваш архів: {deploy_zip}.zip")
