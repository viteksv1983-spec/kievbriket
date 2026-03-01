from typing import Optional
from sqlalchemy.orm import Session
from . import models, schemas
from backend.src.core.pagination import paginate, PaginationParams
from backend.src.products.service import ProductService
from backend.src.products.models import Product
from datetime import datetime
import logging

logger = logging.getLogger("cakeshop.orders")


# ─── Status Machine ────────────────────────────────────────
# Allowed transitions: {from_status: [to_statuses]}
# Explicit, no state machine library needed.

ALLOWED_TRANSITIONS = {
    "new":       ["confirmed", "cancelled"],
    "confirmed": ["paid", "cancelled"],
    "paid":      ["shipped", "cancelled"],
    "shipped":   ["completed"],
    "completed": [],        # terminal
    "cancelled": [],        # terminal
    # Legacy support
    "pending":   ["confirmed", "paid", "shipped", "completed", "cancelled", "new"],
}


def can_transition(current: str, target: str) -> bool:
    """Check if status transition is allowed."""
    allowed = ALLOWED_TRANSITIONS.get(current, [])
    return target in allowed


class OrderService:
    @staticmethod
    def create_order(db: Session, order: schemas.OrderCreate, user_id: Optional[int] = None):
        total_price = 0.0
        db_items = []
        
        for item in order.items:
            product = ProductService.get_product(db, item.cake_id)
            if not product:
                continue 
            
            # --- Stock Check ---
            if product.stock_quantity > 0 and product.stock_quantity < item.quantity:
                logger.warning("Insufficient stock for product %d: have %d, need %d",
                               item.cake_id, product.stock_quantity, item.quantity)
                continue
                
            # Calculate price based on weight
            base_weight_kg = product.weight if product.weight is not None else 1
            if base_weight_kg > 10:
                base_weight_kg = base_weight_kg / 1000
                
            price_per_kg = product.price / base_weight_kg
            item_weight = item.weight if item.weight is not None else base_weight_kg
            item_price = round(price_per_kg * item_weight)
            
            total_price += item_price * item.quantity
            db_items.append(models.OrderItem(cake_id=item.cake_id, quantity=item.quantity, flavor=item.flavor, weight=item.weight))

        db_order = models.Order(
            user_id=user_id, 
            customer_name=order.customer_name,
            customer_phone=order.customer_phone,
            delivery_method=order.delivery_method,
            delivery_date=order.delivery_date,
            total_price=total_price, 
            status="new", 
            created_at=datetime.utcnow()
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)
        
        # Associate items + decrement stock
        for i, db_item in enumerate(db_items):
            db_item.order_id = db_order.id
            db.add(db_item)
            
            # --- Stock Decrement ---
            product = db.query(Product).filter(Product.id == db_item.cake_id).first()
            if product and product.stock_quantity > 0:
                product.stock_quantity = max(0, product.stock_quantity - db_item.quantity)
                logger.info("Stock decremented: product %d → %d remaining", product.id, product.stock_quantity)
        
        # Initial status history entry
        history = models.OrderStatusHistory(
            order_id=db_order.id,
            old_status=None,
            new_status="new",
            comment="Замовлення створено",
            changed_at=datetime.utcnow()
        )
        db.add(history)
        
        db.commit()
        db.refresh(db_order)
        return db_order

    @staticmethod
    def get_orders(db: Session, pagination: PaginationParams, status: Optional[str] = None):
        from sqlalchemy.orm import joinedload
        query = db.query(models.Order).filter(
            models.Order.is_deleted == False
        ).options(joinedload(models.Order.items).joinedload(models.OrderItem.product))
        
        if status:
            query = query.filter(models.Order.status == status)
            
        if not pagination.sort:
            query = query.order_by(models.Order.id.desc())
        return paginate(query, pagination)

    @staticmethod
    def update_order_status(db: Session, order_id: int, new_status: str, comment: str = None):
        """Update order status with transition validation and history tracking."""
        db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
        if not db_order:
            return None
        
        old_status = db_order.status
        
        # Validate transition
        if not can_transition(old_status, new_status):
            logger.warning("Invalid status transition: %s → %s for order %d", old_status, new_status, order_id)
            return None
        
        # Update status
        db_order.status = new_status
        
        # Record history
        history = models.OrderStatusHistory(
            order_id=order_id,
            old_status=old_status,
            new_status=new_status,
            comment=comment
        )
        db.add(history)
        
        # If cancelled — restore stock
        if new_status == "cancelled":
            for item in db_order.items:
                product = db.query(Product).filter(Product.id == item.cake_id).first()
                if product and product.stock_quantity >= 0:
                    product.stock_quantity += item.quantity
                    logger.info("Stock restored: product %d → %d", product.id, product.stock_quantity)
        
        db.commit()
        db.refresh(db_order)
        return db_order

    @staticmethod
    def get_order_history(db: Session, order_id: int):
        """Get status change history for an order."""
        return db.query(models.OrderStatusHistory).filter(
            models.OrderStatusHistory.order_id == order_id
        ).order_by(models.OrderStatusHistory.changed_at.asc()).all()

    @staticmethod
    def create_quick_order(db: Session, order: schemas.QuickOrderCreate):
        # If a product is specified — look it up and calculate price
        product = None
        total_price = 0.0

        if order.cake_id is not None:
            product = ProductService.get_product(db, order.cake_id)
            if not product:
                return None

            # Stock check
            if product.stock_quantity > 0 and product.stock_quantity < order.quantity:
                logger.warning("Insufficient stock for quick order: product %d", order.cake_id)
                return None

            base_weight_kg = product.weight if product.weight is not None else 1
            if base_weight_kg > 10:
                base_weight_kg = base_weight_kg / 1000

            price_per_kg = product.price / base_weight_kg
            item_weight = order.weight if order.weight is not None else base_weight_kg
            item_price = round(price_per_kg * item_weight)
            total_price = item_price * order.quantity

        db_order = models.Order(
            customer_name=order.customer_name,
            customer_phone=order.customer_phone,
            delivery_method=order.delivery_method,
            delivery_date=order.delivery_date,
            total_price=total_price,
            status="new",
            created_at=datetime.utcnow()
        )
        db.add(db_order)
        db.commit()
        db.refresh(db_order)

        # Only create an order item if a real product was linked
        if product is not None:
            db_item = models.OrderItem(
                order_id=db_order.id,
                cake_id=order.cake_id,
                quantity=order.quantity,
                flavor=order.flavor,
                weight=order.weight
            )
            db.add(db_item)

            # Stock decrement
            if product.stock_quantity > 0:
                product.stock_quantity = max(0, product.stock_quantity - order.quantity)

        # Initial history
        history = models.OrderStatusHistory(
            order_id=db_order.id,
            old_status=None,
            new_status="new",
            comment="Швидке замовлення",
            changed_at=datetime.utcnow()
        )
        db.add(history)

        db.commit()
        db.refresh(db_order)

        return db_order
