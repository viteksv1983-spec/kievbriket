"""Tests for Order endpoints."""


def test_create_order(client, sample_product):
    """POST /orders/ creates order with correct total."""
    response = client.post("/orders/", json={
        "customer_name": "Тест Клієнт",
        "customer_phone": "+380991234567",
        "delivery_method": "pickup",
        "delivery_date": "2026-03-01",
        "items": [{"cake_id": sample_product.id, "quantity": 1, "weight": 1.0}]
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert data["customer_name"] == "Тест Клієнт"
    assert data["total_price"] > 0
    assert len(data["items"]) == 1


def test_create_quick_order(client, sample_product):
    """POST /orders/quick creates quick order."""
    response = client.post("/orders/quick", json={
        "customer_name": "Швидкий Клієнт",
        "customer_phone": "+380997654321",
        "cake_id": sample_product.id,
        "quantity": 2,
        "weight": 1.5,
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "pending"
    assert data["total_price"] > 0


def test_quick_order_not_found(client):
    """POST /orders/quick returns 404 for non-existent product."""
    response = client.post("/orders/quick", json={
        "customer_name": "Test",
        "customer_phone": "+380991111111",
        "cake_id": 9999,
        "quantity": 1,
    })
    assert response.status_code == 404


def test_order_with_flavor(client, sample_product):
    """POST /orders/ supports flavor selection."""
    response = client.post("/orders/", json={
        "customer_name": "Клієнт",
        "customer_phone": "+380990000000",
        "items": [{"cake_id": sample_product.id, "quantity": 1, "flavor": "Шоколадна", "weight": 1.0}]
    })
    assert response.status_code == 200
    assert response.json()["items"][0]["flavor"] == "Шоколадна"
