import uuid
import logging
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import schemas
from .service import UserService
from backend.src.users.models import User
from backend.src.core import security
from backend.src.core.database import get_db
from backend.src.core.dependencies import get_current_user

logger = logging.getLogger("cakeshop.auth")

router = APIRouter(tags=["auth", "users"])


@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = UserService.get_user_by_email(db, email=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/auth/google")
async def google_auth(token: str, db: Session = Depends(get_db)):
    idinfo = security.verify_google_token(token)
    if not idinfo:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    email = idinfo['email']
    user = UserService.get_user_by_email(db, email=email)
    if not user:
        user_in = schemas.UserCreate(email=email, password=str(uuid.uuid4()))
        user = UserService.create_user(db, user_in)
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = UserService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return UserService.create_user(db=db, user=user)


@router.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/users/", response_model=list[schemas.User])
def get_all_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Only Super Admins can list all users")
    return UserService.get_all_users(db)

@router.post("/users/manager", response_model=schemas.User)
def create_manager(user: schemas.UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Only Super Admins can create new managers")
    db_user = UserService.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = UserService.create_user(db=db, user=user)
    # Automatically grant admin rights so they can use the panel
    new_user.is_admin = True
    db.commit()
    return new_user

@router.delete("/users/{user_id}")
def delete_user(user_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_superadmin:
        raise HTTPException(status_code=403, detail="Only Super Admins can delete users")
    if current_user.id == user_id:
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    
    success = UserService.delete_user(db, user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.put("/users/me/password", response_model=schemas.User)
def change_my_password(payload: schemas.UserPasswordUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_user = UserService.update_password(db, current_user.id, payload.new_password)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user
