import sys
sys.path.append("c:\\Users\\Виктор\\Desktop\\firewood_backend\\backend")
from src.products.schemas import Product
import json

class MockDBProduct:
    def __init__(self):
        self.id = 1
        self.slug = "test"
        self.name = "test"
        self.category = "brikety"
        self.price = 100
        self.specifications_json = '[{"label": "Test", "value": "123"}]'
        self.faqs_json = '[{"q": "How?", "a": "Like this."}]'
        
        # Missing required fields
        self.unit = "т"
        self.is_active = True
        self.in_stock = True
        self.stock_quantity = 0

db_prod = MockDBProduct()

try:
    p = Product.model_validate(db_prod)
    print("SUCCESS!")
    print(repr(p.specifications_json))
    print(type(p.specifications_json))
except Exception as e:
    print("FAILED")
    print(e)
