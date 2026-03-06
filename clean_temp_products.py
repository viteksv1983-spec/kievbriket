import json

file_path = 'temp_products.json'
to_remove = ['Дрова в ящиках', 'Дрова для каміна', 'Дрова в сітках', 'Дрова для розпалу']

try:
    with open(file_path, 'rb') as f:
        raw = f.read()

    # Try utf-16 with BOM if it starts with FF FE or FE FF
    if raw.startswith(b'\xff\xfe') or raw.startswith(b'\xfe\xff'):
        decoded = raw.decode('utf-16')
    elif raw.startswith(b'\xef\xbb\xbf'):
        decoded = raw.decode('utf-8-sig')
    else:
        decoded = raw.decode('utf-8')
        
    data = json.loads(decoded)
    products = data.get('data', [])
    original_count = len(products)
    
    filtered_products = [item for item in products if item.get('name') not in to_remove]
    
    data['data'] = filtered_products
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
        
    print(f"Original: {original_count}, Final: {len(filtered_products)}")
except Exception as e:
    print(f"Error processing file: {e}")
