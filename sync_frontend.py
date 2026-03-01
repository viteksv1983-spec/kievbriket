import shutil
import os

source_dir = r"c:\Users\Виктор\Desktop\firewood_frontend\frontend\src"
target_dir = r"c:\Users\Виктор\Desktop\firewood_backend\frontend\src"

print(f"Copying from {source_dir} to {target_dir}")

# Ensure the target directory exists
os.makedirs(target_dir, exist_ok=True)

# Define directories to ignore (like node_modules, though src shouldn't have it)
def ignore_patterns(path, names):
    return [name for name in names if name in ['node_modules', '.git']]

# Use shutil.copytree to copy the contents, handling existing directories
for item in os.listdir(source_dir):
    s = os.path.join(source_dir, item)
    d = os.path.join(target_dir, item)
    if os.path.isdir(s):
        if os.path.exists(d):
            shutil.rmtree(d)
        shutil.copytree(s, d, ignore=shutil.ignore_patterns('node_modules', '.git'))
    else:
        shutil.copy2(s, d)

print("Copy completed successfully.")
