from sqlalchemy import Boolean, Column, Float, Integer, String, Text, DateTime, CheckConstraint, JSON
from sqlalchemy.sql import func
from backend.src.core.database import Base

import json
from sqlalchemy.types import TypeDecorator, VARCHAR

class JSONEncodedList(TypeDecorator):
    """Safely parse stringified JSON lists from DB"""
    impl = VARCHAR

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return []
        return value

class Product(Base):
    __tablename__ = "cakes"  # Keep DB table name unchanged!
    __table_args__ = (
        CheckConstraint('price >= 0', name='ck_product_price_positive'),
        CheckConstraint('stock_quantity >= 0', name='ck_product_stock_positive'),
    )

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    short_description = Column(String, nullable=True)
    price = Column(Float)
    image_url = Column(String)
    image_url_2 = Column(String, nullable=True)
    image_url_3 = Column(String, nullable=True)
    image_alt = Column(String, nullable=True)
    is_available = Column(Boolean, default=True, index=True)
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
    weight = Column(Float, nullable=True)  # Вага в грамах
    ingredients = Column(String, nullable=True)  # Склад
    shelf_life = Column(String, nullable=True)  # Термін придатності
    category = Column(String, nullable=True, index=True)  # Категорія
    stock_quantity = Column(Integer, default=0)  # 0 = unlimited/made-to-order
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)
    variants = Column(JSON, nullable=True)  # List of dicts: [{"name": "Chopped", "price": 2000}]
    specifications_json = Column(JSONEncodedList, nullable=True)
    faqs_json = Column(JSONEncodedList, nullable=True)
    delivery_info_json = Column(JSONEncodedList, nullable=True)
    order_steps_json = Column(JSONEncodedList, nullable=True)

    # SEO Fields
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    h1_heading = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
    og_title = Column(String, nullable=True)
    og_description = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    schema_json = Column(String, nullable=True)

class CategoryMetadata(Base):
    __tablename__ = "category_metadata"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String, nullable=False, default="Unnamed Category")
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)
    seo_text = Column(String, nullable=True)
    is_available = Column(Boolean, default=True, nullable=False)
    label_text = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())

    # Advanced SEO fields
    meta_title = Column(String(255), nullable=True)
    meta_description = Column(Text, nullable=True)
    seo_h1 = Column(String(255), nullable=True)
    og_title = Column(String(255), nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String, nullable=True)
    is_indexable = Column(Boolean, default=True, nullable=False)
    canonical_url = Column(String, nullable=True)
