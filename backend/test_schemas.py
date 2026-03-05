import sys
sys.path.append("c:\\Users\\Виктор\\Desktop\\firewood_backend\\backend")
from src.products.schemas import Product
import json

data = {
    "id": 1,
    "slug": "test",
    "name": "test",
    "category": "brikety",
    "price": 100,
    "specifications_json": '[{"label": "Test", "value": "123"}]',
    "faqs_json": '[{"q": "How?", "a": "Like this."}]'
}

try:
    p = Product(**data)
    print("SUCCESS!")
    print(p.specifications_json)
    print(type(p.specifications_json))
except Exception as e:
    print("FAILED")
    print(e)
