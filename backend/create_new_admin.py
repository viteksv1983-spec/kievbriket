import sys
import os
import argparse

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.src.users import schemas
from backend.src.users.service import UserService
from backend.src.core.database import SessionLocal
import backend.src.orders.models
import backend.src.products.models

def create_admin(email, password):
    db = SessionLocal()
    try:
        # Check if user already exists
        user = UserService.get_user_by_email(db, email=email)
        if not user:
            user_in = schemas.UserCreate(email=email, password=password)
            db_user = UserService.create_user(db, user_in)
            db_user.is_admin = True
            db.commit()
            print(f"✅ Успіх! Створено нового адміністратора з логіном: {email}")
        else:
            if not user.is_admin:
                user.is_admin = True
                db.commit()
                print(f"✅ Користувач {email} вже існував, але тепер отримав права адміністратора.")
            else:
                print(f"⚠️ Користувач {email} вже існує і вже є адміністратором.")
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Створення нового адміністратора для сайту КиївБрикет")
    parser.add_argument("email", type=str, help="Логін (або email) нового адміністратора")
    parser.add_argument("password", type=str, help="Пароль для нового адміністратора")
    
    args = parser.parse_args()
    create_admin(args.email, args.password)
