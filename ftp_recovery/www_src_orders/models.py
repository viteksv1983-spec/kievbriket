from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, DateTime, CheckConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.src.core.database import Base

class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        CheckConstraint('total_price >= 0', name='ck_order_price_positive'),
    )

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    total_price = Column(Float)
    status = Column(String, default="pending", index=True)
    created_at = Column(DateTime(timezone=True), default=func.now, index=True)
    delivery_method = Column(String, nullable=True)  # "pickup" or "uklon"
    delivery_date = Column(String, nullable=True)    # e.g., "2026-02-18"
    is_deleted = Column(Boolean, default=False)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    owner = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    status_history = relationship("OrderStatusHistory", back_populates="order", order_by="OrderStatusHistory.changed_at")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), index=True)
    cake_id = Column(Integer, ForeignKey("cakes.id", ondelete="SET NULL"), nullable=True, index=True)  # FK references table name
    scale = Column(String, nullable=True)
    quantity = Column(Float)
    flavor = Column(String, nullable=True)
    weight = Column(Float, nullable=True)  # Selected weight in kg

    order = relationship("Order", back_populates="items")
    product = relationship("Product")  # From backend.src.products.models.Product


class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), index=True)
    old_status = Column(String, nullable=True)
    new_status = Column(String)
    changed_at = Column(DateTime(timezone=True), default=func.now)
    comment = Column(String, nullable=True)

    order = relationship("Order", back_populates="status_history")

