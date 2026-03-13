from sqlalchemy import Boolean, Column, Integer, String, Text
from backend.src.core.database import Base

class TelegramSettings(Base):
    __tablename__ = "telegram_settings"

    id = Column(Integer, primary_key=True, default=1)
    bot_token = Column(String, nullable=True)
    chat_id_1 = Column(String, nullable=True)
    label_1 = Column(String, nullable=True)
    is_active_1 = Column(Boolean, default=True)
    chat_id_2 = Column(String, nullable=True)
    label_2 = Column(String, nullable=True)
    is_active_2 = Column(Boolean, default=True)
    chat_id_3 = Column(String, nullable=True)
    label_3 = Column(String, nullable=True)
    is_active_3 = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)


class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, default=1)
    ga_tracking_id = Column(String, nullable=True)  # e.g. "G-XXXXXXXXXX" or full gtag script

    # Hero section settings
    hero_badges = Column(Text, nullable=True)       # JSON: [{"emoji":"🔥","text":"Сухе паливо"}, ...]
    hero_trust_text = Column(String, nullable=True)  # e.g. "4.9 · 320+ відгуків"
    hero_image_url = Column(String, nullable=True)   # e.g. "/media/uuid.webp" or "/images/hero-bg.webp"

    # Delivery settings
    delivery_transport = Column(Text, nullable=True) # JSON array of vehicle objects

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    city = Column(String, nullable=True)
    date = Column(String, nullable=True)
    stars = Column(Integer, default=5)
    text = Column(Text, nullable=False)
    youtube_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)


class FAQ(Base):
    __tablename__ = "faqs"

    id = Column(Integer, primary_key=True, index=True)
    page = Column(String, nullable=False, index=True, default='home')
    question = Column(String, nullable=False)
    answer = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)

