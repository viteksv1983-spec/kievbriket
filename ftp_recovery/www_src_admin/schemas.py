from pydantic import BaseModel, Field
from typing import Optional

class TelegramSettingsUpdate(BaseModel):
    bot_token: Optional[str] = None
    chat_id_1: Optional[str] = None
    label_1: Optional[str] = None
    is_active_1: Optional[bool] = None
    chat_id_2: Optional[str] = None
    label_2: Optional[str] = None
    is_active_2: Optional[bool] = None
    chat_id_3: Optional[str] = None
    label_3: Optional[str] = None
    is_active_3: Optional[bool] = None
    is_active: Optional[bool] = None

class TelegramSettings(BaseModel):
    id: int = 1
    bot_token: Optional[str] = None
    chat_id_1: Optional[str] = None
    label_1: Optional[str] = None
    is_active_1: bool = True
    chat_id_2: Optional[str] = None
    label_2: Optional[str] = None
    is_active_2: bool = True
    chat_id_3: Optional[str] = None
    label_3: Optional[str] = None
    is_active_3: bool = True
    is_active: bool = True

    class Config:
        from_attributes = True


class SiteSettingsUpdate(BaseModel):
    ga_tracking_id: Optional[str] = None
    hero_badges: Optional[str] = None       # JSON string: [{"emoji":"🔥","text":"..."}, ...]
    hero_trust_text: Optional[str] = None   # e.g. "4.9 · 320+ відгуків"
    hero_image_url: Optional[str] = None    # e.g. "/media/uuid.webp"
    delivery_transport: Optional[str] = None # JSON string: [{"type":"ГАЗель", "vol":"...", ...}]

class SiteSettings(BaseModel):
    id: int = 1
    ga_tracking_id: Optional[str] = None
    hero_badges: Optional[str] = None
    hero_trust_text: Optional[str] = None
    hero_image_url: Optional[str] = None
    delivery_transport: Optional[str] = None

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    name: str
    city: Optional[str] = None
    date: Optional[str] = None
    stars: int = 5
    text: str
    youtube_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

class ReviewUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    date: Optional[str] = None
    stars: Optional[int] = None
    text: Optional[str] = None
    youtube_url: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class ReviewResponse(BaseModel):
    id: int
    name: str
    city: Optional[str] = None
    date: Optional[str] = None
    stars: int
    text: str
    youtube_url: Optional[str] = None
    is_active: bool
    sort_order: int

    class Config:
        from_attributes = True


class FAQCreate(BaseModel):
    page: str = Field(default="home", description="Сторінка, на якій відображається FAQ")
    question: str = Field(..., description="Питання")
    answer: str = Field(..., description="Відповідь")
    is_active: Optional[bool] = Field(default=True)
    sort_order: Optional[int] = Field(default=0)


class FAQUpdate(BaseModel):
    page: Optional[str] = Field(None)
    question: Optional[str] = Field(None)
    answer: Optional[str] = Field(None)
    is_active: Optional[bool] = Field(None)
    sort_order: Optional[int] = Field(None)


class FAQResponse(BaseModel):
    id: int
    page: str
    question: str
    answer: str
    is_active: bool
    sort_order: int

    class Config:
        from_attributes = True

