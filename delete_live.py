import requests

# We know the live URL works based on frontend
api_url = "https://kievbriket-api.onrender.com/products"

to_remove = ["Дрова в ящиках", "Дрова для каміна", "Дрова в сітках", "Дрова для розпалу"]

try:
    # 1. Fetch all products
    resp = requests.get(f"{api_url}?limit=100")
    if resp.status_code == 200:
        products = resp.json()
        if "data" in products:
            products = products["data"]
            
        print(f"Total products fetched: {len(products)}")
        deleted = 0
        
        # 2. Match names & Delete
        for p in products:
            if p.get("name") in to_remove:
                pid = p.get("id")
                print(f"Deleting {p.get('name')} (ID: {pid})")
                del_resp = requests.delete(f"{api_url}/{pid}")
                print(f"Delete status: {del_resp.status_code}")
                if del_resp.status_code == 200:
                    deleted += 1
                else:
                    print(del_resp.text)
                    
        print(f"Successfully deleted {deleted} products.")
    else:
        print(f"Failed to fetch products. Status: {resp.status_code}")
except Exception as e:
    print(f"Error: {e}")
