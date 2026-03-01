from typing import Optional
from sqlalchemy.orm import Session
from . import models, schemas
from backend.src.core.pagination import paginate, PaginationParams
class ProductService:
    @staticmethod
    def get_product(db: Session, product_id: int):
        return db.query(models.Product).filter(models.Product.id == product_id).first()

    @staticmethod
    def get_product_by_slug(db: Session, slug: str):
        return db.query(models.Product).filter(models.Product.slug == slug).first()

    @staticmethod
    def get_products(db: Session, pagination: PaginationParams, category: Optional[str] = None):
        query = db.query(models.Product).filter(models.Product.is_deleted == False)
        if category:
            query = query.filter(models.Product.category == category)
        return paginate(query, pagination)

    @staticmethod
    def filter_products(
        db: Session,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        min_weight: Optional[float] = None,
        max_weight: Optional[float] = None,
        available_only: bool = False,
        search: Optional[str] = None,
        pagination: PaginationParams = None,
    ):
        """Filter products — explicit query building, no magic."""
        query = db.query(models.Product).filter(models.Product.is_deleted == False)

        if category:
            query = query.filter(models.Product.category == category)
        if min_price is not None:
            query = query.filter(models.Product.price >= min_price)
        if max_price is not None:
            query = query.filter(models.Product.price <= max_price)
        if min_weight is not None:
            query = query.filter(models.Product.weight >= min_weight)
        if max_weight is not None:
            query = query.filter(models.Product.weight <= max_weight)
        if available_only:
            query = query.filter(models.Product.is_available == True)
        if search:
            term = f"%{search}%"
            query = query.filter(
                models.Product.name.ilike(term) |
                models.Product.description.ilike(term)
            )

        # Sort
        if sort == "cheap":
            query = query.order_by(models.Product.price.asc())
        elif sort == "expensive":
            query = query.order_by(models.Product.price.desc())
        elif sort == "new":
            query = query.order_by(models.Product.id.desc())
        else:  # popular = default
            query = query.order_by(models.Product.id.asc())

        return query.offset(skip).limit(limit).all()

    @staticmethod
    def get_filter_options(db: Session, category: Optional[str] = None):
        """Return available filter ranges for a category (or all)."""
        from sqlalchemy import func
        query = db.query(
            func.min(models.Product.price),
            func.max(models.Product.price),
            func.min(models.Product.weight),
            func.max(models.Product.weight),
            func.count(models.Product.id),
        )
        if category:
            query = query.filter(models.Product.category == category)
        row = query.first()
        return {
            "price_min": row[0] or 0,
            "price_max": row[1] or 0,
            "weight_min": row[2] or 0,
            "weight_max": row[3] or 0,
            "total": row[4] or 0,
        }

    @staticmethod
    def create_product(db: Session, product: schemas.ProductCreate):
        from backend.src.core.slugify import generate_slug, ensure_unique_slug
        db_product = models.Product(**product.dict())
        # Auto-generate slug if not provided
        if not db_product.slug and db_product.name:
            slug = generate_slug(db_product.name)
            db_product.slug = ensure_unique_slug(db, models.Product, slug)
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def update_product(db: Session, product_id: int, product: schemas.ProductUpdate):
        from backend.src.core.slugify import generate_slug, ensure_unique_slug
        db_product = ProductService.get_product(db, product_id)
        if not db_product:
            return None
        
        product_data = product.dict(exclude_unset=True)
        
        # ВАЖЛИВО: Ми більше НЕ оновлюємо slug автоматично при зміні назви товару, 
        # щоб не зламати проіндексовані SEO-сторінки гіперпосиланнями (запит від власника).
        
        for key, value in product_data.items():
            setattr(db_product, key, value)
        
        db.add(db_product)
        db.commit()
        db.refresh(db_product)
        return db_product

    @staticmethod
    def delete_product(db: Session, product_id: int):
        db_product = ProductService.get_product(db, product_id)
        if db_product:
            db_product.is_deleted = True
            db.commit()
            return True
        return False

class CategoryMetadataService:
    @staticmethod
    def get_category_metadata(db: Session, slug: str):
        return db.query(models.CategoryMetadata).filter(models.CategoryMetadata.slug == slug).first()

    @staticmethod
    def get_all_category_metadata(db: Session):
        return db.query(models.CategoryMetadata).all()

    @staticmethod
    def create_category_metadata(db: Session, metadata: schemas.CategoryMetadataCreate):
        from backend.src.core.slugify import generate_slug, ensure_unique_slug
        data = metadata.dict()
        # Auto-generate slug from name if not provided
        if not data.get("slug") and data.get("name"):
            slug = generate_slug(data["name"])
            data["slug"] = ensure_unique_slug(db, models.CategoryMetadata, slug)
        db_metadata = models.CategoryMetadata(**data)
        db.add(db_metadata)
        db.commit()
        db.refresh(db_metadata)
        return db_metadata

    @staticmethod
    def update_category_metadata(db: Session, slug: str, metadata: schemas.CategoryMetadataUpdate):
        from backend.src.core.slugify import generate_slug, ensure_unique_slug
        db_metadata = CategoryMetadataService.get_category_metadata(db, slug)
        if not db_metadata:
            # Auto-create if not exists
            create_data = metadata.dict(exclude_unset=True)
            if "name" not in create_data:
                create_data["name"] = slug
            new_slug = generate_slug(create_data["name"])
            create_data["slug"] = ensure_unique_slug(db, models.CategoryMetadata, new_slug)
            db_metadata = models.CategoryMetadata(**create_data)
            db.add(db_metadata)
        else:
            metadata_data = metadata.dict(exclude_unset=True)
            # If slug is manually changed, validate uniqueness
            if "slug" in metadata_data and metadata_data["slug"] != db_metadata.slug:
                metadata_data["slug"] = ensure_unique_slug(
                    db, models.CategoryMetadata, metadata_data["slug"], exclude_id=db_metadata.id
                )
            for key, value in metadata_data.items():
                setattr(db_metadata, key, value)
        
        db.commit()
        db.refresh(db_metadata)
        return db_metadata

    @staticmethod
    def delete_category_metadata(db: Session, slug: str):
        db_metadata = CategoryMetadataService.get_category_metadata(db, slug)
        if db_metadata:
            db.delete(db_metadata)
            db.commit()
            return True
        return False

