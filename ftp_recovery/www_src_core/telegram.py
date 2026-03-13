import logging
import requests
from sqlalchemy.orm import Session

from backend.src.admin.models import TelegramSettings
from backend.src.core.database import get_db

logger = logging.getLogger("cakeshop.telegram")


def get_telegram_settings(db: Session):
    settings = db.query(TelegramSettings).filter(TelegramSettings.id == 1).first()
    if not settings:
        settings = TelegramSettings(
            id=1,
            bot_token="8339223589:AAFAdjKe9VTuWwye3HNJsQW_IIwDSxmrnMo",
            chat_id_1="428760780",
            label_1="Viktor",
            is_active=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings


def send_telegram_notification(message: str, db: Session = None):
    try:
        if db is None:
            db_gen = get_db()
            db = next(db_gen)
            close_after = True
        else:
            close_after = False

        settings = get_telegram_settings(db)
        if not settings.is_active or not settings.bot_token:
            return

        url = f"https://api.telegram.org/bot{settings.bot_token}/sendMessage"
        chat_ids = []
        if settings.chat_id_1 and settings.is_active_1:
            chat_ids.append(settings.chat_id_1)
        if settings.chat_id_2 and settings.is_active_2:
            chat_ids.append(settings.chat_id_2)
        if settings.chat_id_3 and settings.is_active_3:
            chat_ids.append(settings.chat_id_3)

        for chat_id in chat_ids:
            data = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}
            requests.post(url, json=data, timeout=5)

        if close_after:
            db.close()
    except Exception as e:
        logger.error("Failed to send Telegram notification: %s", e)
