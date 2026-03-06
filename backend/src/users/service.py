from sqlalchemy.orm import Session
from . import models, schemas
from backend.src.core import security

class UserService:
    @staticmethod
    def get_user(db: Session, user_id: int):
        return db.query(models.User).filter(models.User.id == user_id).first()

    @staticmethod
    def get_user_by_email(db: Session, email: str):
        return db.query(models.User).filter(models.User.email == email).first()

    @staticmethod
    def create_user(db: Session, user: schemas.UserCreate):
        hashed_password = security.get_password_hash(user.password)
        db_user = models.User(email=user.email, hashed_password=hashed_password)
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_all_users(db: Session):
        return db.query(models.User).all()

    @staticmethod
    def delete_user(db: Session, user_id: int):
        user = UserService.get_user(db, user_id)
        if user:
            db.delete(user)
            db.commit()
            return True
        return False

    @staticmethod
    def update_password(db: Session, user_id: int, new_password: str):
        user = UserService.get_user(db, user_id)
        if user:
            user.hashed_password = security.get_password_hash(new_password)
            db.commit()
            db.refresh(user)
            return user
        return None
