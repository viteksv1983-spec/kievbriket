from sqlalchemy.orm import Session
from . import models, schemas

class PageService:
    @staticmethod
    def get_page(db: Session, page_id: int):
        return db.query(models.Page).filter(models.Page.id == page_id).first()

    @staticmethod
    def get_page_by_route(db: Session, route_path: str):
        return db.query(models.Page).filter(models.Page.route_path == route_path).first()

    @staticmethod
    def get_pages(db: Session, skip: int = 0, limit: int = 100):
        return db.query(models.Page).offset(skip).limit(limit).all()

    @staticmethod
    def create_page(db: Session, page: schemas.PageCreate):
        db_page = models.Page(**page.dict())
        db.add(db_page)
        db.commit()
        db.refresh(db_page)
        return db_page

    @staticmethod
    def update_page(db: Session, page_id: int, page: schemas.PageUpdate):
        db_page = PageService.get_page(db, page_id)
        if not db_page:
            return None
        
        page_data = page.dict(exclude_unset=True)
        for key, value in page_data.items():
            setattr(db_page, key, value)

        db.add(db_page)
        db.commit()
        db.refresh(db_page)
        return db_page
