"""
Test fixtures for Cake Shop API tests.
Uses separate test SQLite DB — never touches production data.
"""
import sys
import os
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.database import Base, get_db
from backend.main import app
from backend import models, auth


# --- Test database ---
TEST_DATABASE_URL = "sqlite:///./test_temp.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def setup_database():
    """Create fresh tables before each test, drop after."""
    from backend.routers.products import product_cache
    product_cache.invalidate()

    Base.metadata.create_all(bind=test_engine)
    yield
    Base.metadata.drop_all(bind=test_engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def db_session():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def sample_product(db_session):
    """Create a sample product in the test DB."""
    product = models.Product(
        name="Тест Торт",
        slug="test-tort",
        description="Тестовий торт",
        price=500.0,
        image_url="/static/test.webp",
        is_available=True,
        weight=1000,
        category="torty",
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)
    return product


@pytest.fixture
def admin_user(db_session):
    """Create an admin user and return (user, token)."""
    hashed = auth.get_password_hash("admin123")
    user = models.User(
        email="admin@test.com",
        hashed_password=hashed,
        is_active=True,
        is_admin=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    token = auth.create_access_token(data={"sub": user.email})
    return user, token
