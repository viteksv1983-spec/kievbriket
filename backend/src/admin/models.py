from sqlalchemy import Boolean, Column, Integer, String
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
