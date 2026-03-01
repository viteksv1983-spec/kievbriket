from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List, Dict

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    slug: Optional[str] = None
    updated_at: Optional[datetime] = None
    weight: Optional[float] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None
    category: Optional[str] = None
    stock_quantity: int = 0  # 0 = unlimited/made-to-order
    variants: Optional[List[dict]] = None
    
    class Config:
        from_attributes = True
        orm_mode = True

    # SEO Fields
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    slug: str

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    weight: Optional[float] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None
    category: Optional[str] = None
    stock_quantity: Optional[int] = None
    variants: Optional[List[dict]] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None

class CategoryMetadataBase(BaseModel):
    slug: Optional[str] = None
    name: str
    image_url: Optional[str] = None
    description: Optional[str] = None
    seo_text: Optional[str] = None

    # Advanced SEO fields
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    seo_h1: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    is_indexable: bool = True
    canonical_url: Optional[str] = None

class CategoryMetadataCreate(CategoryMetadataBase):
    pass

class CategoryMetadataUpdate(BaseModel):
    name: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    seo_text: Optional[str] = None

    # Advanced SEO fields
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    seo_h1: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    is_indexable: Optional[bool] = None
    canonical_url: Optional[str] = None

class CategoryMetadata(CategoryMetadataBase):
    id: int

    class Config:
        from_attributes = True
