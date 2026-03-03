import os
import zipfile
from pathlib import Path

# Directories and files to include
ROOT_DIR = Path("c:/Users/Виктор/Desktop/firewood_backend")
BACKEND_DIR = ROOT_DIR / "backend"

ZIP_FILENAME = ROOT_DIR / "deploy_cloud_run.zip"

def create_zip():
    print(f"Creating zip file: {ZIP_FILENAME} ...")
    
    with zipfile.ZipFile(ZIP_FILENAME, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Include Dockerfile
        dockerfile_path = BACKEND_DIR / "Dockerfile"
        if dockerfile_path.exists():
            zipf.write(dockerfile_path, "Dockerfile")
            print("Added Dockerfile")
        else:
            print("Warning: Dockerfile not found in backend/!")
            
        # Walk and add backend/ directory
        for root, dirs, files in os.walk(BACKEND_DIR):
            # Exclude virtual environments and unneeded folders
            if 'venv' in dirs: dirs.remove('venv')
            if '__pycache__' in dirs: dirs.remove('__pycache__')
            if '.pytest_cache' in dirs: dirs.remove('.pytest_cache')
            if 'logs' in dirs: dirs.remove('logs')
            
            for file in files:
                if file.endswith('.pyc') or file == '.env':
                    continue
                    
                file_path = Path(root) / file
                # The Dockerfile copies backend/ -> /app/backend/
                # So the zip should contain a backend/ directory
                arcname = file_path.relative_to(ROOT_DIR)
                zipf.write(file_path, arcname)
                
    print(f"✅ Created deployment archive: {ZIP_FILENAME}")
    print(f"Size: {os.path.getsize(ZIP_FILENAME) / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    create_zip()
