from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from backend.src.products.schemas import Product
import re
from pydantic import BaseModel, field_validator

class OrderItemBase(BaseModel):
    cake_id: int
    quantity: float
    flavor: Optional[str] = None
    weight: Optional[float] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    cake: Optional[Product] = None  # Response still includes product data via "cake" key

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_price: float = 0
    status: str = "pending"
    created_at: Optional[datetime] = None

class OrderCreate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None
    items: List[OrderItemCreate]

    @field_validator('customer_phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            # Matches +380XXXXXXXXX where operator code is valid
            if not re.match(r'^\+380(39|50|63|66|67|68|73|89|91|92|93|94|95|96|97|98|99)\d{7}$', v):
                raise ValueError('Invalid phone number format. Must start with +380 followed by a valid operator code and 7 digits.')
        return v

class QuickOrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    cake_id: Optional[int] = None
    quantity: float = 1.0
    flavor: Optional[str] = None
    weight: Optional[float] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None
    total_price: Optional[float] = None

    @field_validator('customer_phone')
    @classmethod
    def validate_phone(cls, v: str) -> str:
        # Matches +380XXXXXXXXX where operator code is valid
        if not re.match(r'^\+380(39|50|63|66|67|68|73|89|91|92|93|94|95|96|97|98|99)\d{7}$', v):
            raise ValueError('Invalid phone number format. Must start with +380 followed by a valid operator code and 7 digits.')
        return v

class Order(OrderBase):
    id: int
    user_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
