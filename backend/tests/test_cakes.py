"""Tests for Product (catalog) endpoints."""


def test_read_products_empty(client):
    """GET /cakes/ returns empty list when no products exist."""
    response = client.get("/products/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_read_products_with_data(client, sample_product):
    """GET /cakes/ returns list of products."""
    response = client.get("/products/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["name"] == "Тест Торт"


def test_read_product_by_slug(client, sample_product):
    """GET /cakes/{slug} returns specific product."""
    response = client.get(f"/products/{sample_product.slug}")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "test-tort"
    assert data["price"] == 500.0


def test_read_product_by_id(client, sample_product):
    """GET /cakes/{id} returns specific product by numeric ID."""
    response = client.get(f"/products/{sample_product.id}")
    assert response.status_code == 200
    assert response.json()["name"] == "Тест Торт"


def test_read_product_not_found(client):
    """GET /cakes/{slug} returns 404 for non-existent product."""
    response = client.get("/products/non-existent-product")
    assert response.status_code == 404


def test_create_product(client):
    """POST /cakes/ creates a new product."""
    response = client.post("/products/", json={
        "name": "Новий Торт",
        "price": 750.0,
        "description": "Дуже смачний",
        "slug": "novyj-tort",
        "category": "torty",
    })
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Новий Торт"
    assert data["price"] == 750.0


def test_read_products_by_category(client, sample_product):
    """GET /cakes/?category=torty filters correctly."""
    response = client.get("/products/?category=torty")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(p["category"] == "torty" for p in data)


def test_etag_caching(client, sample_product):
    """ETag caching returns 304 on second request."""
    r1 = client.get("/products/")
    assert r1.status_code == 200
    etag = r1.headers.get("etag")
    assert etag is not None

    r2 = client.get("/products/", headers={"If-None-Match": etag})
    assert r2.status_code == 304
