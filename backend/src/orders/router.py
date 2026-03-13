import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import schemas
from .service import OrderService
from backend.src.products.service import ProductService
from backend.src.users.models import User
from backend.src.core.database import get_db
from backend.src.core.dependencies import get_current_user, get_optional_current_user
from backend.src.core.pagination import PaginationParams

logger = logging.getLogger("cakeshop.orders")

router = APIRouter(tags=["orders"])

@router.post("/orders/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    user_id = current_user.id if current_user else None
    db_order = OrderService.create_order(db=db, order=order, user_id=user_id)
    
    # Telegram notification
    msg = f"<b>Нове замовлення! (Кошик)</b>\n"
    msg += f"🆔 Номер замовлення: №{db_order.id}\n\n"
    msg += f"👤 <b>Клієнт:</b>\n"
    msg += f"Ім'я: {order.customer_name}\n"
    msg += f"Телефон: {order.customer_phone}\n"
    msg += f"Тип обліковки: {'Зареєстрований' if current_user else 'Гість'}\n\n"
    msg += f"🚚 <b>Доставка:</b>\n"
    msg += f"Спосіб: {order.delivery_method or 'Не вказано'}\n"
    msg += f"Дата (на коли): {order.delivery_date or 'Не вказано'}\n\n"
    msg += f"📦 <b>Товари:</b>\n"
    for item in order.items:
        product = ProductService.get_product(db, item.cake_id)
        product_name = product.name if product else f"ID {item.cake_id}"
        msg += f"- {product_name} ({item.quantity} шт)\n"

        if item.flavor:
            if item.flavor.startswith("Коментар:"):
                msg += f"  {item.flavor}\n"
            elif "Коментар:" in item.flavor:
                parts = item.flavor.split("Коментар:", 1)
                msg += f"  Варіант: {parts[0].strip()}\n"
                msg += f"  Коментар: {parts[1].strip()}\n"
            else:
                msg += f"  Варіант: {item.flavor}\n"
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
    
    try:
        from backend.src.core.telegram import send_telegram_notification
        send_telegram_notification(msg, db)
    except Exception as e:
        logger.error("Telegram notification error: %s", e)
    
    return db_order


@router.post("/orders/quick", response_model=schemas.Order)
def create_quick_order(order: schemas.QuickOrderCreate, db: Session = Depends(get_db)):
    db_order = OrderService.create_quick_order(db=db, order=order)
    if not db_order:
        raise HTTPException(status_code=404, detail="Product not found")

    product_name = "Консультація"
    if order.cake_id is not None:
        product = ProductService.get_product(db, order.cake_id)
        product_name = product.name if product else f"Товар #{order.cake_id}"
    else:
        if order.flavor:
            if not order.flavor.startswith("Коментар:"):
                if "Коментар:" in order.flavor:
                    parts = order.flavor.split("Коментар:", 1)
                    product_name = parts[0].strip()
                else:
                    product_name = order.flavor.strip()
        if product_name == "Консультація":
            product_name = "Швидке замовлення без товару"

    msg = f"<b>Нове замовлення!</b>\n"
    msg += f"🆔 Номер замовлення: №{db_order.id}\n\n"
    msg += f"👤 <b>Клієнт:</b>\n"
    msg += f"Ім'я: {order.customer_name}\n"
    msg += f"Телефон: {order.customer_phone}\n\n"
    msg += f"📦 <b>Товар:</b> {product_name}\n"
    if order.quantity and order.quantity > 1:
        msg += f"  Кількість: {order.quantity}\n"

    if order.flavor:
        if order.flavor.startswith("Коментар:"):
            msg += f"  {order.flavor}\n"
        elif "Коментар:" in order.flavor:
            parts = order.flavor.split("Коментар:", 1)
            if order.cake_id is not None:
                msg += f"  Варіант: {parts[0].strip()}\n"
            msg += f"  Коментар: {parts[1].strip()}\n"
        else:
            if order.cake_id is not None:
                msg += f"  Варіант: {order.flavor}\n"
    if order.delivery_method:
        msg += f"🔥 <b>Тип палива:</b> {order.delivery_method}\n"
    if order.delivery_date:
        msg += f"💬 <b>Коментар:</b> {order.delivery_date}\n"
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
        
    try:
        from backend.src.core.telegram import send_telegram_notification
        send_telegram_notification(msg, db)
    except Exception as e:
        logger.error("Telegram notification error: %s", e)
    
    return db_order


@router.patch("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_update: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    status = status_update.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    db_order = OrderService.update_order_status(db, order_id=order_id, new_status=status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.get("/orders/")
def read_orders(status: Optional[str] = None, params: PaginationParams = Depends(), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return OrderService.get_orders(db, pagination=params, status=status)
