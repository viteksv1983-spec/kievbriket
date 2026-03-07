import os
import shutil
import subprocess

# Шляхи
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
BUILD_DIR = os.path.join(BASE_DIR, "deploy_build")

print("-> Починаємо підготовку проекту для розгортання на Хостинг Україна...")

# 1. Збірка React фронтенду (увага, потрібен npm в системі)
print("\n-> 1. Збираємо фронтенд...")
try:
    subprocess.run(["npm", "run", "build"], cwd=FRONTEND_DIR, shell=True, check=True)
    print("-> Фронтенд зібрано успішно.")
except subprocess.CalledProcessError:
    print("-> Помилка збірки фронтенду. Перевірте, чи встановлений Node.js і чи виконується `npm run build` успішно.")
    exit(1)

# 2. Створення тимчасової директорії для деплою
print("\n-> 2. Формуємо файли для деплою...")
if os.path.exists(BUILD_DIR):
    shutil.rmtree(BUILD_DIR)
os.makedirs(BUILD_DIR)

# Копіюємо бекенд в директорію для деплою
# Ігноруємо непотрібні файли: __pycache__, venv та старі налаштування
def ignore_patterns(dir, files):
    return [f for f in files if f in ['__pycache__', 'venv', '.env', '.pytest_cache', 'tests', 'alembic', 'scripts', '.git']]

shutil.copytree(BACKEND_DIR, BUILD_DIR, dirs_exist_ok=True, ignore=ignore_patterns)

# 3. Копіюємо фронтенд-білд в папку static бекенда
static_dir = os.path.join(BUILD_DIR, "static")
if os.path.exists(static_dir):
    shutil.rmtree(static_dir)

frontend_dist = os.path.join(FRONTEND_DIR, "dist")
if os.path.exists(frontend_dist):
    shutil.copytree(frontend_dist, static_dir)
    print("-> Статичні файли фронтенду скопійовані в /static.")
else:
    print("-> Папка `dist` не знайдена у фронтенді. Збірка не вдалася.")
    exit(1)

# 4. Створюємо passenger_wsgi.py для "Хостинг Україна"
print("\n-> 3. Налаштовуємо Passenger для Python...")
passenger_config = """import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from main import app as fastapi_app
from a2wsgi import ASGIMiddleware

application = ASGIMiddleware(fastapi_app)
"""
with open(os.path.join(BUILD_DIR, "passenger_wsgi.py"), "w", encoding="utf-8") as f:
    f.write(passenger_config)

# Додаємо a2wsgi в requirements.txt
req_path = os.path.join(BUILD_DIR, "requirements.txt")
with open(req_path, "a", encoding="utf-8") as f:
    f.write("\na2wsgi\n")
print("-> Файл `passenger_wsgi.py` та залежності створені.")

# 5. Створюємо .htaccess для вимкнення PHP і увімкнення Python
htaccess_content = """# Налаштування від хостингу для запуску Python замість PHP
PassengerEnabled on
PassengerAppType wsgi
PassengerStartupFile passenger_wsgi.py
"""
with open(os.path.join(BUILD_DIR, ".htaccess"), "w", encoding="utf-8") as f:
    f.write(htaccess_content)
print("-> Створено `.htaccess` для заміни PHP на Python.")

# 6. Архівування
print("\n-> 4. Архівуємо файли у `deploy.zip`...")
deploy_zip = os.path.join(BASE_DIR, "deploy") # shutil.make_archive додасть .zip
shutil.make_archive(deploy_zip, 'zip', BUILD_DIR)

# Прибираємо тимчасову папку
shutil.rmtree(BUILD_DIR)

print(f"\n-> Все готово! Ваш архів для деплою знаходиться тут: {deploy_zip}.zip")
print("Дотримуйтесь інструкції в артефакті `hosting_ukraine_deployment.md` для завантаження на сервер.")
