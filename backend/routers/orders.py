"""Order routes."""
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.database import get_db
from backend.deps import get_current_user, get_optional_current_user

logger = logging.getLogger("cakeshop.orders")

router = APIRouter(tags=["orders"])


@router.post("/orders/", response_model=schemas.Order)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_optional_current_user),
):
    user_id = current_user.id if current_user else None
    db_order = crud.create_order(db=db, order=order, user_id=user_id)
    
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
        product = crud.get_product(db, item.cake_id)
        product_name = product.name if product else f"ID {item.cake_id}"
        msg += f"- {product_name} ({item.quantity} шт)\n"
        if item.weight:
            msg += f"  Вага: {item.weight} кг\n"
        if item.flavor:
            msg += f"  Начинка: {item.flavor}\n"
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
    
    try:
        from backend.routers._telegram import send_telegram_notification
        send_telegram_notification(msg, db)
    except Exception as e:
        logger.error("Telegram notification error: %s", e)
    
    return db_order


@router.post("/orders/quick", response_model=schemas.Order)
def create_quick_order(order: schemas.QuickOrderCreate, db: Session = Depends(get_db)):
    db_order = crud.create_quick_order(db=db, order=order)
    if not db_order:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product = crud.get_product(db, order.cake_id)
    product_name = product.name if product else "Unknown"
    
    msg = f"<b>Нове замовлення! (В 1 клік)</b>\n"
    msg += f"🆔 Номер замовлення: №{db_order.id}\n\n"
    msg += f"👤 <b>Клієнт:</b>\n"
    msg += f"Ім'я: {order.customer_name}\n"
    msg += f"Телефон: {order.customer_phone}\n\n"
    msg += f"🚚 <b>Доставка:</b>\n"
    msg += f"Спосіб: {order.delivery_method or 'Не вказано'}\n"
    msg += f"Дата (на коли): {order.delivery_date or 'Не вказано'}\n\n"
    msg += f"📦 <b>Товари:</b>\n"
    msg += f"- {product_name} ({order.quantity} шт)\n"
    if order.weight:
        msg += f"  Вага: {order.weight} кг\n"
    if order.flavor:
        msg += f"  Начинка: {order.flavor}\n"
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
        
    try:
        from backend.routers._telegram import send_telegram_notification
        send_telegram_notification(msg, db)
    except Exception as e:
        logger.error("Telegram notification error: %s", e)
    
    return db_order


@router.patch("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_update: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    status = status_update.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    db_order = crud.update_order_status(db, order_id=order_id, status=status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order


@router.get("/orders/", response_model=List[schemas.Order])
def read_orders(status: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_orders(db, skip=skip, limit=limit, status=status)
