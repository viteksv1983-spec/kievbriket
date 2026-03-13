import os
import sys
from pathlib import Path

def diag():
    print("--- SENIOR DIAGNOSTICS ---")
    print(f"File: {__file__}")
    print(f"CWD: {os.getcwd()}")
    
    app_dir = Path(__file__).parent
    print(f"APP_DIR: {app_dir}")
    print(f"APP_DIR.parent: {app_dir.parent}")
    
    print("\n--- sys.path ---")
    for p in sys.path:
        print(f"  {p}")
        
    print("\n--- checking index.html ---")
    possible = [
        app_dir.parent / "frontend" / "dist" / "index.html",
        app_dir.parent / "index.html",
        app_dir / "index.html"
    ]
    for p in possible:
        st = "FOUND" if p.exists() else "MISSING"
        print(f"{st}: {p}")
        
    print("\n--- checking submodules ---")
    try:
        import src
        print("SUCCESS: import src")
    except Exception as e:
        print(f"FAIL: import src -> {e}")
        
    try:
        from backend import src as bsrc
        print("SUCCESS: import backend.src")
    except Exception as e:
        print(f"FAIL: import backend.src -> {e}")

if __name__ == "__main__":
    diag()
