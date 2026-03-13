from sqlalchemy.orm import Session
from . import models, schemas

class AdminService:
    @staticmethod
    def get_telegram_settings(db: Session):
        settings = db.query(models.TelegramSettings).first()
        if not settings:
            settings = models.TelegramSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update_telegram_settings(db: Session, update_data: schemas.TelegramSettingsUpdate):
        settings = AdminService.get_telegram_settings(db)
        
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(settings, key, value)
            
        db.commit()
        db.refresh(settings)
        return settings

    @staticmethod
    def get_site_settings(db: Session):
        settings = db.query(models.SiteSettings).first()
        if not settings:
            settings = models.SiteSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update_site_settings(db: Session, update_data: schemas.SiteSettingsUpdate):
        settings = AdminService.get_site_settings(db)
        update_dict = update_data.dict(exclude_unset=True)
        for key, value in update_dict.items():
            setattr(settings, key, value)
        db.commit()
        db.refresh(settings)
        return settings
