"""Product routes (catalog, CRUD). Endpoints remain /cakes/ for frontend compat."""
import hashlib
import json
import logging
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response
from starlette.requests import Request
from sqlalchemy.orm import Session

from backend import crud, schemas
from backend.database import get_db
from backend.deps import get_current_user

logger = logging.getLogger("cakeshop.products")

router = APIRouter(tags=["products"])


# --- In-Memory Cache ---
class SimpleCache:
    def __init__(self, ttl_seconds: int = 300):
        self._store = {}
        self._ttl = ttl_seconds

    def get(self, key: str):
        entry = self._store.get(key)
        if entry and time.time() < entry["expires"]:
            return entry
        elif entry:
            del self._store[key]
        return None

    def set(self, key: str, data, etag: str):
        self._store[key] = {"data": data, "etag": etag, "expires": time.time() + self._ttl}

    def invalidate(self):
        self._store.clear()
        logger.info("Product cache invalidated")

product_cache = SimpleCache(ttl_seconds=300)


@router.post("/products/", response_model=schemas.Product)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    result = crud.create_product(db=db, product=product)
    product_cache.invalidate()
    return result


@router.get("/products/")
def read_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    request: Request = None,
):
    cache_key = f"products:{skip}:{limit}:{category}"
    cached = product_cache.get(cache_key)
    if cached:
        client_etag = request.headers.get("if-none-match") if request else None
        if client_etag and client_etag == cached["etag"]:
            return Response(status_code=304, headers={"ETag": cached["etag"]})
        return Response(content=cached["data"], media_type="application/json", headers={"ETag": cached["etag"], "X-Cache": "HIT"})

    products = crud.get_products(db, skip=skip, limit=limit, category=category)
    from fastapi.encoders import jsonable_encoder
    data = json.dumps(jsonable_encoder(products), ensure_ascii=False)
    etag = hashlib.md5(data.encode()).hexdigest()
    product_cache.set(cache_key, data, etag)
    return Response(content=data, media_type="application/json", headers={"ETag": etag, "X-Cache": "MISS"})


@router.get("/products/{identifier}", response_model=schemas.Product)
def read_product(identifier: str, category: Optional[str] = None, db: Session = Depends(get_db)):
    if identifier.isdigit():
        db_product = crud.get_product(db, product_id=int(identifier))
    else:
        db_product = crud.get_product_by_slug(db, slug=identifier)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if category and db_product.category != category:
        raise HTTPException(status_code=404, detail="Product not found in this category")
    return db_product


@router.patch("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_product = crud.update_product(db, product_id=product_id, product=product)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_cache.invalidate()
    return db_product
