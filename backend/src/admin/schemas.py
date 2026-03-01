from pydantic import BaseModel
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
