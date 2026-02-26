"""Tests for Auth endpoints."""


def test_register_user(client):
    """POST /users/ creates new user."""
    response = client.post("/users/", json={
        "email": "newuser@test.com",
        "password": "securepassword123",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "newuser@test.com"
    assert data["is_active"] is True
    assert "hashed_password" not in data  # Should not expose password


def test_register_duplicate_email(client):
    """POST /users/ rejects duplicate email."""
    payload = {"email": "dup@test.com", "password": "pass123"}
    client.post("/users/", json=payload)
    response = client.post("/users/", json=payload)
    assert response.status_code == 400


def test_login_success(client):
    """POST /token returns JWT for valid credentials."""
    # Register
    client.post("/users/", json={"email": "login@test.com", "password": "mypass"})

    # Login
    response = client.post("/token", data={
        "username": "login@test.com",
        "password": "mypass",
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    """POST /token rejects wrong password."""
    client.post("/users/", json={"email": "wrong@test.com", "password": "correct"})
    response = client.post("/token", data={
        "username": "wrong@test.com",
        "password": "incorrect",
    })
    assert response.status_code == 401


def test_protected_endpoint_no_token(client):
    """GET /users/me/ returns 401 without token."""
    response = client.get("/users/me/")
    assert response.status_code == 401


def test_protected_endpoint_with_token(client, admin_user):
    """GET /users/me/ returns user data with valid token."""
    user, token = admin_user
    response = client.get("/users/me/", headers={
        "Authorization": f"Bearer {token}"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "admin@test.com"


def test_health_check(client):
    """GET /health returns ok."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
