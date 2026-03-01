import hashlib
import json
import logging
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Response
from starlette.requests import Request
from sqlalchemy.orm import Session

from . import schemas
from .service import ProductService
from backend.src.core.database import get_db
from backend.src.core.dependencies import get_current_user
from backend.src.core.pagination import PaginationParams

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
    result = ProductService.create_product(db=db, product=product)
    product_cache.invalidate()
    return result


@router.get("/products/categories", response_model=list[schemas.CategoryMetadata])
def read_public_categories(db: Session = Depends(get_db)):
    from backend.src.products.service import CategoryMetadataService
    return CategoryMetadataService.get_all_category_metadata(db)


@router.get("/products/")
def read_products(
    category: Optional[str] = None,
    params: PaginationParams = Depends(),
    db: Session = Depends(get_db),
    request: Request = None,
):
    cache_key = f"products:{params.page}:{params.limit}:{params.sort}:{category}"
    cached = product_cache.get(cache_key)
    if cached:
        client_etag = request.headers.get("if-none-match") if request else None
        if client_etag and client_etag == cached["etag"]:
            return Response(status_code=304, headers={"ETag": cached["etag"]})
        return Response(content=cached["data"], media_type="application/json", headers={"ETag": cached["etag"], "X-Cache": "HIT"})

    products_data = ProductService.get_products(db, pagination=params, category=category)
    from fastapi.encoders import jsonable_encoder
    data = json.dumps(jsonable_encoder(products_data), ensure_ascii=False)
    etag = hashlib.md5(data.encode()).hexdigest()
    product_cache.set(cache_key, data, etag)
    return Response(content=data, media_type="application/json", headers={"ETag": etag, "X-Cache": "MISS"})


@router.get("/products/filter")
def filter_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_weight: Optional[float] = None,
    max_weight: Optional[float] = None,
    available_only: bool = False,
    search: Optional[str] = None,
    params: PaginationParams = Depends(),
    db: Session = Depends(get_db),
):
    """Filter products with price, weight, sort, search, availability."""
    return ProductService.filter_products(
        db, category=category, min_price=min_price, max_price=max_price,
        min_weight=min_weight, max_weight=max_weight,
        available_only=available_only, search=search, pagination=params
    )


@router.get("/products/filter-options")
def get_filter_options(
    category: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get available filter ranges (price min/max, weight min/max)."""
    return ProductService.get_filter_options(db, category=category)


@router.get("/products/{identifier}", response_model=schemas.Product)
def read_product(identifier: str, category: Optional[str] = None, db: Session = Depends(get_db)):
    if identifier.isdigit():
        db_product = ProductService.get_product(db, product_id=int(identifier))
    else:
        db_product = ProductService.get_product_by_slug(db, slug=identifier)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    if category and db_product.category != category:
        raise HTTPException(status_code=404, detail="Product not found in this category")
    return db_product


@router.patch("/products/{product_id}", response_model=schemas.Product)
def update_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    db_product = ProductService.update_product(db, product_id=product_id, product=product)
    if not db_product:
        raise HTTPException(status_code=404, detail="Product not found")
    product_cache.invalidate()
    return db_product


@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    success = ProductService.delete_product(db, product_id=product_id)
    if not success:
        raise HTTPException(status_code=404, detail="Product not found")
    product_cache.invalidate()
    return {"message": "Product deleted successfully"}
