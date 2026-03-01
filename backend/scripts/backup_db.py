import os
import shutil
import glob
from datetime import datetime
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DB_PATH = BASE_DIR / "backend" / "cakeshop.db"
BACKUP_DIR = BASE_DIR / "backend" / "backups"
MAX_BACKUPS = 14  # Keep last 14 backups (e.g., 2 weeks if daily)

def create_backup():
    """Create a new SQLite backup."""
    if not DB_PATH.exists():
        print(f"Database not found at {DB_PATH}. Exiting.")
        return None

    # Ensure backup directory exists
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)

    # Generate timestamped backup name
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = BACKUP_DIR / f"cakeshop_backup_{timestamp}.db"

    try:
        shutil.copy2(DB_PATH, backup_file)
        print(f"Successfully created backup: {backup_file}")
        
        # Rotate old backups
        rotate_backups()
        
        return backup_file
    except Exception as e:
        print(f"Failed to create backup: {e}")
        return None

def rotate_backups():
    """Delete backups older than MAX_BACKUPS."""
    backups = glob.glob(str(BACKUP_DIR / "cakeshop_backup_*.db"))
    # Sort by modification time (oldest first)
    backups.sort(key=os.path.getmtime)

    if len(backups) > MAX_BACKUPS:
        old_backups = backups[:-MAX_BACKUPS]
        for old_backup in old_backups:
            try:
                os.remove(old_backup)
                print(f"Deleted old backup: {old_backup}")
            except Exception as e:
                print(f"Failed to delete old backup {old_backup}: {e}")

if __name__ == "__main__":
    create_backup()
