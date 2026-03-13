from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import logging

from backend.src.core.config import settings

logger = logging.getLogger("cakeshop.database")

# Use config for DB URL; fallback to absolute path for SQLite
SQLALCHEMY_DATABASE_URL = settings.database_url
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# For relative SQLite paths, resolve to absolute (point to backend/ root)
if "sqlite:///" in SQLALCHEMY_DATABASE_URL and not os.path.isabs(SQLALCHEMY_DATABASE_URL.replace("sqlite:///", "")):
    # BASE_DIR is backend/src/core, so we go up 3 levels to backend/
    CORE_DIR = os.path.dirname(os.path.abspath(__file__))
    BACKEND_DIR = os.path.dirname(os.path.dirname(CORE_DIR))
    db_file = os.path.join(BACKEND_DIR, "sql_app.db")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{db_file}"

logger.debug("Using DB URL: %s", SQLALCHEMY_DATABASE_URL)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in SQLALCHEMY_DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
