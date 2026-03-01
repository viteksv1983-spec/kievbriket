from sqlalchemy import Boolean, Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from backend.src.core.database import Base

# Only these route_paths are allowed for static pages
ALLOWED_ROUTES = {'/', '/delivery', '/contacts'}

class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    route_path = Column(String, unique=True, index=True)  # e.g., "/", "/delivery", "/contacts"
    name = Column(String)  # internal name, e.g., "Головна сторінка"
    
    # SEO Fields
    meta_title = Column(String, nullable=True)
    meta_description = Column(Text, nullable=True)
    meta_keywords = Column(String, nullable=True)
    h1_heading = Column(String, nullable=True)  # kept for backward compat
    canonical_url = Column(String, nullable=True)
    og_title = Column(String, nullable=True)
    og_description = Column(Text, nullable=True)
    og_image = Column(String, nullable=True)
    schema_json = Column(String, nullable=True)  # kept for backward compat
    
    # Extended SEO fields
    is_indexable = Column(Boolean, default=True, nullable=False)
    bottom_seo_text = Column(Text, nullable=True)
    schema_type = Column(String, nullable=True)  # localbusiness, article, etc.
    custom_schema = Column(Text, nullable=True)  # custom JSON-LD override
    
    content = Column(Text, nullable=True)  # Rich text or JSON content
    content_images = Column(String, nullable=True)  # JSON list of image URLs
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(DateTime(timezone=True), default=func.now(), onupdate=func.now())
