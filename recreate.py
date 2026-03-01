from backend.src.core.database import SessionLocal, engine, Base
from backend.src.users.models import User
from backend.src.products.models import Product, CategoryMetadata
from backend.src.orders.models import Order, OrderItem, OrderStatusHistory
from backend.src.pages.models import Page
from backend.src.admin.models import TelegramSettings

print("Dropping order tables...")
OrderStatusHistory.__table__.drop(engine, checkfirst=True)
OrderItem.__table__.drop(engine, checkfirst=True)
Order.__table__.drop(engine, checkfirst=True)

print("Recreating order tables...")
Base.metadata.create_all(bind=engine)
print("Done!")
