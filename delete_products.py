import requests

url = "https://kievbriket-api.onrender.com"

products_to_delete = [
    "Дрова в ящиках",
    "Дрова для каміна",
    "Дрова в сітках",
    "Дрова для розпалу"
]

res = requests.get(f"{url}/products/?limit=100")
if res.status_code == 200:
    data = res.json()
    products = data.get("data", [])
    
    deleted_count = 0
    for product in products:
        if product['name'] in products_to_delete:
            print(f"Deleting {product['name']} (ID: {product['id']})")
            del_res = requests.delete(f"{url}/products/{product['id']}")
            print(f"Status: {del_res.status_code}")
            deleted_count += 1
            
    if deleted_count == 0:
        print("No products matching those names were found in production DB.")
else:
    print(f"Failed to fetch products: {res.status_code}")
