from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional
from backend.src.products.schemas import Product

class OrderItemBase(BaseModel):
    cake_id: int
    quantity: int
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

class QuickOrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    cake_id: Optional[int] = None
    quantity: int = 1
    flavor: Optional[str] = None
    weight: Optional[float] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None

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
