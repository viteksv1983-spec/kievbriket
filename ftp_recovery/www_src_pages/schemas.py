from pydantic import BaseModel
from typing import Optional

class PageBase(BaseModel):
    route_path: str
    name: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None
    content: Optional[str] = None
    content_images: Optional[str] = None
    # Extended SEO
    is_indexable: bool = True
    bottom_seo_text: Optional[str] = None
    schema_type: Optional[str] = None
    custom_schema: Optional[str] = None

class PageCreate(PageBase):
    pass

class PageUpdate(BaseModel):
    # route_path is intentionally NOT here — slug is not editable after creation
    name: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None
    content: Optional[str] = None
    content_images: Optional[str] = None
    # Extended SEO
    is_indexable: Optional[bool] = None
    bottom_seo_text: Optional[str] = None
    schema_type: Optional[str] = None
    custom_schema: Optional[str] = None

class Page(PageBase):
    id: int

    class Config:
        from_attributes = True
