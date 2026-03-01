# Cake Shop Store (Интернет магазин торты)

A web application for a cake shop inspired by the Vatsak brand.

## Features
- Product catalog with categories (Cakes, Cookies, Sweets)
- Detailed product pages with specifications
- Shopping cart
- Order placement (Backend integration)
- Admin capabilities for image uploads

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, SQLite (for testing)

## How to Run

### Backend
1. Go to `backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `.\venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload`

### Frontend
1. Go to `frontend/`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## Deployment to Render

This project is ready for deployment on [Render](https://render.com/).

1. Create a Render account.
2. Click "New" -> "Blueprint".
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and set up both the backend and frontend.

## Deployment to GitHub manually (if needed)
...

## Automated Backups (SQLite)

This project includes a Python script (`scripts/backup_db.py`) to automatically backup the SQLite database with 14-day rotation.

**To set up via cron (Linux/macOS):**
```bash
# Edit cron jobs
crontab -e

# Add this line to run backup every day at 3:00 AM
0 3 * * * /path/to/cakeshop/venv/bin/python /path/to/cakeshop/scripts/backup_db.py >> /var/log/cakeshop_backup.log 2>&1
```

**To set up via Task Scheduler (Windows):**
1. Open Task Scheduler -> Create Basic Task
2. Set trigger to "Daily"
3. Set action to "Start a program"
4. Program/script: `path\to\venv\Scripts\python.exe`
5. Add arguments: `path\to\cakeshop\scripts\backup_db.py`
