import os
import re

FRONTEND_SRC = r"c:\Users\Виктор\Desktop\firewood_backend\frontend\src"

REPLACEMENTS = [
    # Paths
    (r"/catalog/firewood", r"/catalog/drova"),
    (r"/catalog/briquettes", r"/catalog/brikety"),
    (r"/catalog/coal", r"/catalog/vugillya"),
    
    # Exact string literals (single quotes)
    (r"'firewood'", r"'drova'"),
    (r"'briquettes'", r"'brikety'"),
    (r"'coal'", r"'vugillya'"),
    
    # Exact string literals (double quotes)
    (r'"firewood"', r'"drova"'),
    (r'"briquettes"', r'"brikety"'),
    (r'"coal"', r'"vugillya"'),
    
    # Template literals (very rare but possible `firewood`)
    (r'`firewood`', r'`drova`'),
    (r'`briquettes`', r'`brikety`'),
    (r'`coal`', r'`vugillya`'),
]

# Exceptions where we might NOT want to replace:
# If 'firewood' is part of a CSS class name, it won't be matched by exact quotes above.
# What about 'firewood' in object keys? e.g. firewood: { ... }
# Let's replace object keys as well
REPLACEMENTS += [
    (r"firewood:", r"drova:"),
    (r"briquettes:", r"brikety:"),
    (r"coal:", r"vugillya:"),
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old_p, new_p in REPLACEMENTS:
        new_content = re.sub(old_p, new_p, new_content)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

def main():
    for root, dirs, files in os.walk(FRONTEND_SRC):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                process_file(os.path.join(root, file))
                
if __name__ == '__main__':
    main()
