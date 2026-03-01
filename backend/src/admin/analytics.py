from sqlalchemy.orm import Session
from sqlalchemy import func, desc, case
from datetime import datetime, timedelta
from backend.src.orders.models import Order, OrderItem
from backend.src.products.models import Product
from backend.src.users.models import User

class AnalyticsService:
    @staticmethod
    def get_dashboard_stats(db: Session, days: int = 30):
        # Calculate the start date for filtering
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # 1. Overall Totals
        # We only count non-deleted orders
        orders_query = db.query(Order).filter(Order.is_deleted == False)
        
        total_orders = orders_query.count()
        total_revenue = orders_query.filter(Order.status.in_(["completed", "paid", "shipped"])).with_entities(func.sum(Order.total_price)).scalar() or 0.0
        total_users = db.query(User).count()
        
        # 2. Orders per day (last N days)
        # Using func.date(Order.created_at)
        orders_by_day_query = (
            db.query(
                func.date(Order.created_at).label("date"),
                func.count(Order.id).label("count"),
                func.sum(Order.total_price).label("revenue")
            )
            .filter(Order.is_deleted == False)
            .filter(Order.created_at >= start_date)
            .group_by(func.date(Order.created_at))
            .order_by(func.date(Order.created_at).asc())
            .all()
        )
        
        orders_by_day = [
            {"date": str(row.date), "count": row.count, "revenue": float(row.revenue or 0)} 
            for row in orders_by_day_query
        ]
        
        # 3. Popular Products (by quantity sold in non-deleted orders)
        popular_products_query = (
            db.query(
                Product.name,
                Product.id,
                func.sum(OrderItem.quantity).label("total_sold")
            )
            .join(OrderItem, Product.id == OrderItem.cake_id)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(Order.is_deleted == False)
            .group_by(Product.id)
            .order_by(desc("total_sold"))
            .limit(10)
            .all()
        )
        
        popular_products = [
            {"id": row.id, "name": row.name, "total_sold": row.total_sold}
            for row in popular_products_query
        ]
        
        return {
            "totals": {
                "orders": total_orders,
                "revenue": float(total_revenue),
                "users": total_users,
            },
            "orders_by_day": orders_by_day,
            "popular_products": popular_products
        }
