"""
Standard pagination utility.
Usage:
    from backend.src.core.pagination import paginate, PaginationParams
    
    @router.get("/items")
    def list_items(params: PaginationParams = Depends(), db = Depends(get_db)):
        return paginate(db.query(Item), params)
"""
from typing import Optional
from fastapi import Query
from sqlalchemy.orm import Query as SAQuery


class PaginationParams:
    """Standard pagination + sorting params for all list endpoints."""

    def __init__(
        self,
        page: int = Query(1, ge=1, description="Page number (1-indexed)"),
        limit: int = Query(20, ge=1, le=100, description="Items per page"),
        sort: Optional[str] = Query(None, description="Sort field, e.g. 'price:asc' or 'created_at:desc'"),
    ):
        self.page = page
        self.limit = limit
        self.offset = (page - 1) * limit
        self.sort = sort

    @property
    def sort_field(self) -> Optional[str]:
        if not self.sort:
            return None
        return self.sort.split(":")[0]

    @property
    def sort_order(self) -> str:
        if not self.sort or ":" not in self.sort:
            return "asc"
        return self.sort.split(":")[1].lower()


def paginate(query: SAQuery, params: PaginationParams) -> dict:
    """
    Apply pagination to a SQLAlchemy query and return standardized response.
    Returns: {"items": [...], "total": N, "page": N, "limit": N, "pages": N}
    """
    total = query.count()

    # Apply sort if specified
    if params.sort_field:
        model = query.column_descriptions[0]["entity"]
        column = getattr(model, params.sort_field, None)
        if column is not None:
            if params.sort_order == "desc":
                query = query.order_by(column.desc())
            else:
                query = query.order_by(column.asc())

    items = query.offset(params.offset).limit(params.limit).all()
    pages = (total + params.limit - 1) // params.limit  # ceil division

    return {
        "items": items,
        "total": total,
        "page": params.page,
        "limit": params.limit,
        "pages": pages,
    }
