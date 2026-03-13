"""
KievBriket API — Main Application Entry Point.
Business logic lives in routers/, auth deps in deps.py.
"""
import sys
import os
import time
import logging

# Fix definitions for deployment: Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Initialize logging
from backend.logging_config import setup_logging
setup_logging()
logger = logging.getLogger("kievbriket.api")

from fastapi import FastAPI, Depends
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend import auto_seed
from backend.src.core.database import SessionLocal, engine, get_db, Base
from backend.src.users.models import User
from backend.src.products.models import Product, CategoryMetadata
from backend.src.orders.models import Order, OrderItem, OrderStatusHistory
from backend.src.pages.models import Page
from backend.src.admin.models import TelegramSettings

# Create tables
Base.metadata.create_all(bind=engine)

from backend.src.core.config import settings

app = FastAPI(
    title=settings.app_name,
    description="API для замовлення дров, брикетів та вугілля з доставкою по Київській області",
    version=settings.app_version,
)

# ─── Error Handlers ─────────────────────────────────────────
from backend.src.core.errors import setup_error_handlers
setup_error_handlers(app)


# ─── Middleware ──────────────────────────────────────────────

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import RedirectResponse

class TrailingSlashRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        path = request.url.path
        
        # API prefixes that should NEVER be redirected to avoid breaking frontend Axios calls
        api_prefixes = (
            "/api", "/admin", "/docs", "/openapi.json", 
            "/products", "/orders", "/users", "/token", "/pages"
        )
        
        if path != "/" and path.endswith("/") and not path.startswith(api_prefixes):
            url = request.url.replace(path=path.rstrip("/"))
            return RedirectResponse(url=url, status_code=301)
        return await call_next(request)


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration_ms = round((time.time() - start_time) * 1000)
        logger.info("%s %s %s %dms", request.method, request.url.path, response.status_code, duration_ms)
        return response

class CacheHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.startswith("/products") and request.method == "GET":
            response.headers["Cache-Control"] = f"public, max-age={settings.product_cache_ttl}"
            response.headers["Vary"] = "Accept-Encoding"
        elif path.startswith("/static/"):
            response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add basic security headers to every response."""
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response

# Order matters: outermost middleware is added last
app.add_middleware(TrailingSlashRedirectMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(CacheHeadersMiddleware)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Trusted hosts (skip in dev when "*")
if settings.allowed_hosts != "*":
    allowed = [h.strip() for h in settings.allowed_hosts.split(",")]
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed)

# CORS
cors_origins = [o.strip() for o in settings.cors_origins.split(",")] if settings.cors_origins != "*" else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Rate Limiting ──────────────────────────────────────────

from slowapi.middleware import SlowAPIMiddleware
from slowapi.errors import RateLimitExceeded
from backend.src.core.rate_limit import limiter, rate_limit_exceeded_handler

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)


# ─── MIGRATION SCRIPT (TEMPORARY) ─────────────────────────────────

@app.get("/api/seed-all-live")
def seed_all_live(db: Session = Depends(get_db)):
    """One-click endpoint to seed Reviews, FAQs, and Delivery Transport on production.
    Open in browser: https://kievdrova.com.ua/api/seed-all-live
    """
    import json
    import sqlalchemy as sa
    from backend.src.admin.models import Review, FAQ, SiteSettings

    results = {}

    # 1. Ensure delivery_transport column + seed
    try:
        try:
            r = db.execute(sa.text("PRAGMA table_info(site_settings)"))
            existing_cols = {row[1] for row in r.fetchall()}
        except Exception:
            existing_cols = set()
        if "delivery_transport" not in existing_cols:
            try:
                db.execute(sa.text("ALTER TABLE site_settings ADD COLUMN delivery_transport TEXT"))
                db.commit()
            except Exception:
                pass
        settings = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
        if settings:
            if not settings.delivery_transport:
                settings.delivery_transport = json.dumps([
                    {"type": "ГАЗель (бус)", "vol": "4-5 складометрів", "price": "1 500 грн", "desc": "Швидка доставка невеликих замовлень", "category": "standard", "image": "/images/delivery/gazel-dostavka-driv-kyiv.webp"},
                    {"type": "ЗІЛ самоскид", "vol": "4 складометри", "price": "3 000 грн", "desc": "Оптимально для приватних будинків", "category": "standard", "image": "/images/delivery/zil-dostavka-driv-kyiv.webp"},
                    {"type": "КАМАЗ самоскид", "vol": "8 складометрів", "price": "4 000 грн", "desc": "Великі обсяги палива", "category": "standard", "image": "/images/delivery/kamaz-dostavka-driv-kyiv.webp"},
                    {"type": "Кран-маніпулятор", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження у складних умовах", "category": "special", "image": "/images/delivery/manipulator-dostavka-kyiv.webp"},
                    {"type": "Гідроборт / рокла", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження палет", "category": "special", "image": "/images/delivery/gidrobort-rokla-dostavka-kyiv.webp"},
                    {"type": "Фура", "vol": "22-24 складометри", "price": "за домовленістю", "desc": "Поставка напряму з лісгоспу", "category": "table_only", "image": ""}
                ], ensure_ascii=False)
                db.commit()
                results["delivery_transport"] = "seeded"
            else:
                results["delivery_transport"] = "already exists"
        else:
            results["delivery_transport"] = "no settings row"
    except Exception as e:
        results["delivery_transport"] = f"error: {str(e)}"

    # 2. Seed Reviews
    try:
        rc = db.query(Review).count()
        if rc == 0:
            revs = [
                Review(name="Олександр", city="Київ", date="2024-11-15", stars=5, text="Замовляв дубові дрова. Привезли швидко, обсяг чесний. Дрова сухі, горять відмінно. Рекомендую!", is_active=True, sort_order=1),
                Review(name="Олена", city="Бровари", date="2024-12-02", stars=5, text="Дуже задоволена обслуговуванням. Водій допоміг розвантажити, все акуратно. Брикети РУФ якісні.", is_active=True, sort_order=2),
                Review(name="Іван", city="Ірпінь", date="2025-01-20", stars=4, text="Купував пелети для котла. Зольність низька, тепловіддача хороша. Буду замовляти ще.", is_active=True, sort_order=3),
                Review(name="Марина", city="Вишневе", date="2025-02-10", stars=5, text="Брикети Pini Kay — просто вогонь! Горять довго, жар рівномірний. Замовляю вже другий раз.", is_active=True, sort_order=4),
                Review(name="Сергій", city="Буча", date="2025-02-28", stars=5, text="Замовляли КАМАЗ дров на зиму. Привезли точно в обіцяний час. Якість дерева відмінна, все сухе.", is_active=True, sort_order=5),
            ]
            db.add_all(revs)
            db.commit()
            results["reviews"] = f"seeded {len(revs)}"
        else:
            results["reviews"] = f"already has {rc}"
    except Exception as e:
        results["reviews"] = f"error: {str(e)}"

    # 3. Seed FAQs
    try:
        fc = db.query(FAQ).count()
        if fc == 0:
            faqs = [
                FAQ(page="home", question="Чи працюєте ви на вихідних?", answer="Так, ми працюємо без вихідних, щоб забезпечити вас паливом у зручний для вас час.", is_active=True, sort_order=1),
                FAQ(page="home", question="Як швидко ви доставляєте?", answer="Доставка зазвичай здійснюється в день замовлення або на наступний день.", is_active=True, sort_order=2),
                FAQ(page="home", question="Чи є мінімальне замовлення?", answer="Мінімальне замовлення дров — від 2 складометрів, брикетів та пелет — від 1 тонни. Можливий самовивіз будь-якої кількості.", is_active=True, sort_order=3),
                FAQ(page="home", question="Як оплатити замовлення?", answer="Оплата здійснюється після отримання та перевірки товару готівкою або на картку.", is_active=True, sort_order=4),
                FAQ(page="delivery", question="Які авто використовуються для доставки?", answer="Ми використовуємо ГАЗелі, ЗІЛи, КАМАЗи та маніпулятори в залежності від обсягу замовлення та умов розвантаження.", is_active=True, sort_order=1),
                FAQ(page="delivery", question="Чи можна замовити доставку з маніпулятором?", answer="Так, ми маємо власні маніпулятори для розвантаження палет з брикетами або мішків з вугіллям у складних умовах.", is_active=True, sort_order=2),
            ]
            db.add_all(faqs)
            db.commit()
            results["faqs"] = f"seeded {len(faqs)}"
        else:
            results["faqs"] = f"already has {fc}"
    except Exception as e:
        results["faqs"] = f"error: {str(e)}"

    return {"status": "success", "results": results}

@app.get("/api/migrate-slugs-live")
def migrate_slugs_live(db: Session = Depends(get_db)):
    """Temporary endpoint to migrate English category slugs to Ukrainian locally or on Render."""
    try:
        slug_map = {
            "firewood": "drova",
            "briquettes": "brikety",
            "coal": "vugillya"
        }
        
        migrated_cats = []
        for old_slug, new_slug in slug_map.items():
            # Update CategoryMetadata
            cat = db.query(CategoryMetadata).filter(CategoryMetadata.slug == old_slug).first()
            if cat:
                cat.slug = new_slug
                migrated_cats.append(new_slug)
            
            # Update Products
            products = db.query(Product).filter(Product.category == old_slug).all()
            for p in products:
                p.category = new_slug
                
        db.commit()
        return {"status": "success", "migrated_categories": migrated_cats, "message": "Slugs migrated to Ukrainian"}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.get("/api/seed-drova-live")
def seed_drova_live():
    """Temporary endpoint to seed drova products on Render."""
    try:
        from backend.seed_drova_seo import seed_drova
        seed_drova()
        return {"status": "success", "message": "10 drova products seeded on production"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/seed-briquettes-live")
def seed_briquettes_live(db: Session = Depends(get_db)):
    """Temporary endpoint to populate Briquettes with unique texts and JSONs on Render."""
    import json
    try:
        products_data = {
            'brykety-ruf-dub': {
                'name': 'Брикети RUF (Дуб) — паливні брикети для котлів та печей',
                'short_description': 'Купити дубові брикети RUF для опалення. Висока тепловіддача, мінімум попелу. Доставка по Києву та Київській області в день замовлення.',
                'description': '''<p><strong>Паливні брикети RUF з дубової тирси</strong> — це сучасне, екологічно чисте та високоефективне тверде паливо, яке ідеально підходить для обігріву приватних будинків, дач та комерційних приміщень. Вони виготовляються з чистої деревини твердих порід (переважно дуба) без додавання будь-яких хімічних домішок чи клею. Формування відбувається під високим тиском, що забезпечує їхню надзвичайну щільність.</p>

<p>Головною перевагою брикетів RUF є їхня висока тепловіддача, яка значно перевищує показники звичайних дров. Завдяки низькій вологості (менше 8-10%), вони розгораються швидко, горять рівномірним полум'ям і залишають мінімальну кількість золи. Це не лише економить ваш час на чищення котла чи печі, але й подовжує термін служби опалювального обладнання.</p>

<p>Брикети RUF універсальні — вони чудово підходять для твердопаливних котлів, класичних печей, камінів та булер'янів. Компактна прямокутна форма дозволяє зручно складати їх у підсобному приміщенні, економлячи місце в порівнянні зі звичайними <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">колотими дровами</a></strong>. Потрібно більше жару? Спробуйте також наше якісне <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">кам'яне вугілля</a></strong> або перегляньте <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші паливні брикети</a></strong> у нашому асортименті.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Паливні брикети"},
                    {"label": "Порода деревини", "value": "Дуб (тверді породи)"},
                    {"label": "Форма брикету", "value": "Прямокутні (стільнички)"},
                    {"label": "Вологість", "value": "До 8-10%"},
                    {"label": "Теплотворність", "value": "4500-4800 ккал/кг"},
                    {"label": "Фасування", "value": "Упаковки по 10 кг (на піддонах 1 т)"},
                    {"label": "Зольність", "value": "До 1%"},
                    {"label": "Сфера використання", "value": "Котли, печі, каміни"},
                    {"label": "Доставка", "value": "По Києву та області"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "Для чого найкраще підходять брикети RUF дуб?", "a": "Ці брикети є універсальними і відмінно підходять для твердопаливних котлів тривалого горіння, звичайних печей, а також відкритих і закритих камінів."},
                    {"q": "Скільки часу горять брикети RUF з дубової тирси?", "a": "В середньому одна закладка таких брикетів горить від 2 до 4 годин активним полум'ям, після чого продовжує тліти та віддавати жар ще протягом кількох годин."},
                    {"q": "Чи можна використовувати їх для камінів?", "a": "Так, вони ідеальні для камінів. Вони не 'стріляють' іскрами, не виділяють багато диму та згоряють майже повністю, залишаючи чисте скло топки."},
                    {"q": "Як замовити доставку по Києву?", "a": "Ви можете обрати потрібну кількість на цій сторінці й натиснути 'Замовити', або зателефонувати нам. Ми здійснюємо швидку доставку власним автопарком."}
                ], ensure_ascii=False),
                'meta_title': 'Купити брикети RUF (дуб) у Києві — доставка | КиївДрова',
                'meta_description': 'Якісні паливні брикети RUF з дубової тирси. Висока тепловіддача, мінімум попелу. Замовляйте дубові брикети з доставкою по Києву та області просто зараз!',
                'image_alt': 'паливні брикети ruf дуб купити київ',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Брикети RUF (Дуб) — паливні брикети",
                            "description": "Якісні паливні брикети RUF з дубової тирси. Висока тепловіддача, мінімум попелу. Доставка по Києву та області.",
                            "sku": "brykety-ruf-dub",
                            "offers": {
                                "@type": "Offer",
                                "priceCurrency": "UAH",
                                "availability": "https://schema.org/InStock"
                            }
                        }
                    ]
                }, ensure_ascii=False)
            },
            'brykety-pini-kay': {
                'name': 'Брикети Pini Kay — євродрова з підвищеною тепловіддачею',
                'short_description': 'Купити паливні брикети Pini Kay у Києві. Восьмигранна форма з отвором для кращої тяги. Максимальний жар для котлів та камінів. Швидка доставка.',
                'description': '''<p><strong>Паливні брикети Pini Kay</strong> (Піні Кей) — це преміальне тверде паливо, відоме також як «євродрова». Їхня характерна особливість — восьмигранна форма із наскрізним радіальним отвором всередині. Цей отвір створює додаткову тягу повітря всередині самого брикету, що дозволяє йому горіти рівно і дуже яскраво навіть у печах та котлах із низькою тягою.</p>

<p>Процес виробництва Pini Kay передбачає не лише високий тиск, але й термічну обробку (випалювання) поверхні. Завдяки цьому вони набувають темного кольору зовні, стають надзвичайно щільними і стійкими до вологи. Тепловіддача цих брикетів просто вражає — вона перевершує звичайні <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">колоті дрова</a></strong> на 30-40%. Вони швидко піднімають температуру в системі та підтримують її тривалий час.</p>

<p>Брикети Піні Кей ідеально підходять для камінів, грилів, мангалів та різноманітних твердопаливних систем. Після згоряння вони не розпадаються на дрібний попіл, а зберігають свою форму у вигляді тліючого вугілля, нагадуючи класичне <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">кам'яне вугілля</a></strong>. Зверніть увагу також на <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші брикети</a></strong> з нашого каталогу для порівняння характеристик.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Євродрова"},
                    {"label": "Порода деревини", "value": "Тверді породи (дуб, граб)"},
                    {"label": "Форма брикету", "value": "Восьмигранні з отвором"},
                    {"label": "Вологість", "value": "До 5-7%"},
                    {"label": "Теплотворність", "value": "4800-5000 ккал/кг"},
                    {"label": "Фасування", "value": "Пакування по 10 кг (термоплівка)"},
                    {"label": "Зольність", "value": "Близько 0.8%"},
                    {"label": "Сфера використання", "value": "Каміни, котли, мангали"},
                    {"label": "Доставка", "value": "Автомобілями по Київській області"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "В чому перевага брикетів Піні Кей перед звичайними дровами?", "a": "Pini Kay мають набагато вищу щільність і майже нульову вологість. Вони горять на 1.5-2 години довше за звичайні дрова, майже не димлять і віддають більше тепла завдяки унікальній формі."},
                    {"q": "Навіщо отвір всередині брикету Pini Kay?", "a": "Отвір діє як додатковий димохід. Він покращує циркуляцію повітря, що забезпечує стабільне і яскраве горіння навіть в умовах недостатньої тяги в котлі."},
                    {"q": "Як правильно зберігати євродрова Піні Кей?", "a": "Завдяки термічній обробці (обпалюванню) зовні, вони є досить стійкими до атмосферної вологи. Однак найкраще їх зберігати у сухому, провітрюваному приміщенні під навісом."},
                    {"q": "Скільки займає доставка цих брикетів?", "a": "Зазвичай ми доставляємо брикети в день замовлення або на наступний день по Києву та області. Наші машини обладнані маніпуляторами для легкого розвантаження."}
                ], ensure_ascii=False),
                'meta_title': 'Купити брикети Pini Kay у Києві — євродрова Піні Кей | КиївДрова',
                'meta_description': 'Купити паливні брикети Pini Kay (Піні Кей) для камінів та котлів. Восьмигранні євродрова з отвором. Доставка брикетів по Києву та області за вигідною ціною.',
                'image_alt': 'паливні брикети піні кей pini kay купити київ',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Брикети Pini Kay",
                            "description": "Паливні брикети Pini Kay у Києві. Восьмигранна форма з отвором для кращої тяги. Доставка.",
                            "sku": "brykety-pini-kay",
                            "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
                        }
                    ]
                }, ensure_ascii=False)
            },
            'brykety-nestro-sosna': {
                'name': 'Брикети Nestro (Сосна) — циліндричні паливні брикети',
                'short_description': 'Замовити циліндричні паливні брикети Nestro у Києві. Чудовий вибір для котлів тривалого горіння. Вигідна ціна, чесна вага, доставка.',
                'description': '''<p><strong>Паливні брикети Nestro</strong> (Нестро) — це класичне біопаливо у формі правильних циліндрів без внутрішніх отворів, спресоване з чистої деревної тирси. Виробництво відбувається на спеціальних ударно-механічних пресах, завдяки чому досягається висока цілісність та міцність брикетів. В їхньому складі немає жодних хімічних зв'язуючих речовин — міцність забезпечується природним лігніном, який виділяється з деревини під дією температури.</p>

<p>Головна особливість брикетів Нестро — їхнє спокійне, тривале і стабільне горіння. Вони ідеальні для котлів тривалого горіння або твердопаливних систем великої потужності, де важливо підтримувати однакову температуру тривалий час. Ці циліндри залишають мінімальну кількість золи і суттєво заощаджують простір при складуванні на противагу традиційним <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">колотим дровами</a></strong>.</p>

<p>Хоча за інтенсивністю жару вони можуть трохи поступатись <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">вугіллю</a></strong>, проте Nestro є одним з найекологічніших і найчистіших видів палива на ринку. Якщо ви маєте об'ємний котел або промислову піч, циліндричні Нестро стануть вашим надійним джерелом тепла. Шукаєте інші формати? Перегляньте <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші брикети</a></strong> в нашому інтернет-магазині.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Брикети механічного пресування"},
                    {"label": "Порода деревини", "value": "Суміш сосни та твердих порід"},
                    {"label": "Форма брикету", "value": "Циліндричні (суцільні, без отвору)"},
                    {"label": "Вологість", "value": "До 9%"},
                    {"label": "Теплотворність", "value": "4400-4700 ккал/кг"},
                    {"label": "Фасування", "value": "Мішки або біг-беги"},
                    {"label": "Зольність", "value": "До 1.2%"},
                    {"label": "Сфера використання", "value": "Котли тривалого горіння, промислові печі"},
                    {"label": "Доставка", "value": "Київ, Ірпінь, Бровари, Бориспіль та область"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "Для яких котлів купують брикети Nestro?", "a": "Завдяки циліндричній формі та великій міцності, вони ідеально підходять для великих твердопаливних котлів, класичних і піролізних котлів тривалого горіння."},
                    {"q": "Чи залишають брикети Nestro багато попелу?", "a": "Ні, зольність цих брикетів становить близько 1%, що дозволяє значно рідше чистити котел у порівнянні з використанням звичайних дров або торфу."},
                    {"q": "Як швидко згоряє брикет Nestro?", "a": "Залежно від налаштувань тяги в котлі, вони здатні горіти до 3-5 годин, забезпечуючи рівномірне і стабільне виділення тепла без різких перепадів температур."},
                    {"q": "Чи можна замовити тестову партію брикетів?", "a": "Так, ви можете замовити кілька паковань для тесту. Ми доставимо їх, і ви зможете переконатись у високій якості нашого палива."}
                ], ensure_ascii=False),
                'meta_title': 'Брикети Nestro купити в Києві — циліндричні брикети | КиївДрова',
                'meta_description': 'Якісні циліндричні паливні брикети Nestro з тирси. Відмінна тепловіддача, підходять для котлів тривалого горіння. Доставка маніпулятором по Києву!',
                'image_alt': 'циліндричні брикети нестро nestro купити київ',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Брикети Nestro",
                            "description": "Циліндричні паливні брикети Nestro у Києві. Чудовий вибір для котлів тривалого горіння. Доставка.",
                            "sku": "brykety-nestro-sosna",
                            "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
                        }
                    ]
                }, ensure_ascii=False)
            },
            'brykety-ruf-premium': {
                'name': 'Вугільні брикети — максимальна тепловіддача',
                'short_description': 'Замовити вугільні брикети у Києві. Найвищий рівень тепловіддачі, ультрадовге горіння. Ідеально для твердопаливних котлів та печей. Доставка.',
                'description': '''<p><strong>Вугільні брикети (углеродні брикети)</strong> — це сучасне, високоефективне паливо, створене завдяки пресуванню дрібної фракції якісного вугілля. Цей формат ідеально підходить для тих, хто хоче отримати максимальну температуру та найбільшу тривалість горіння. На відміну від звичайного рядового вугілля, брикети мають однакову форму та щільність, завдяки чому горять рівномірно та не прокидаються крізь колосники.</p>

<p>Їхня тепловіддача значно перевищує показники звичайних деревних брикетів або <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">дров</a></strong>. Завантаживши котел ввечері вугільними брикетами, ви гарантовано матимете стабільне тепло до самого ранку. Вони утворюють мінімальну кількість диму, що робить їх використання дуже екологічним і зручним у домашніх умовах, не забруднюючи димоходи так швидко, як звичайне <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">вугілля</a></strong> нижчих марок.</p>

<p>Вугільні брикети запаковані у мішки, тому їх легко зберігати й переносити без пилу та бруду навколо котла. Спробуйте цей інноваційний продукт і переконайтесь у його перевагах! Якщо вас цікавлять класичні деревні аналоги, завжди можна обрати <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші брикети</a></strong> в нашому каталозі.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Вугільні брикети"},
                    {"label": "Склад", "value": "Пресований вугільний пил (антрацит/кам'яне)"},
                    {"label": "Форма брикету", "value": "Стандартні пресовані подушечки"},
                    {"label": "Вологість", "value": "До 5-7%"},
                    {"label": "Теплотворність", "value": "6000-6500 ккал/кг"},
                    {"label": "Фасування", "value": "Мішки по 25-50 кг"},
                    {"label": "Зольність", "value": "8-12%"},
                    {"label": "Сфера використання", "value": "Твердопаливні котли, побутові печі"},
                    {"label": "Доставка", "value": "Київ та Київська область"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "Чим вугільні брикети кращі за звичайне вугілля?", "a": "Брикети не мають фракції 'пилу', вони не прокидаються в зольник, горять рівномірніше і довше. До того ж, упаковка в мішки робить вашу котельню значно чистішою."},
                    {"q": "Чи можна палити ними у звичайній сільській печі?", "a": "Так, вони чудово підходять для класичних груб, забезпечуючи дуже довге тління та стабільну температуру в будинку навіть у найсильніші морози."},
                    {"q": "Чи багато залишку (шлаку) від вугільних брикетів?", "a": "Сучасні вугільні брикети мають контрольовану зольність (близько 10%). Шлаку від них значно менше порівняно з рядовим вугіллям невідомого походження."},
                    {"q": "Як швидко виставляється доставка?", "a": "Ми доставляємо замовлення по Києву та області зазвичай наступного дня або навіть у день замовлення власним автопарком."}
                ], ensure_ascii=False),
                'meta_title': 'Купити вугільні брикети у Києві — довготривале горіння | КиївДрова',
                'meta_description': 'Якісні вугільні (углеродні) брикети. Найвища тепловіддача, зручне фасування, відсутність пилу. Замовляйте з швидкою доставкою по Києву.',
                'image_alt': 'вугільні брикети углеродний брикет купити київ',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Вугільні брикети",
                            "description": "Замовити вугільні брикети у Києві. Найвищий рівень тепловіддачі, ультрадовге горіння.",
                            "sku": "brykety-ruf-premium",
                            "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
                        }
                    ]
                }, ensure_ascii=False)
            },
            'torfobrykety': {
                'name': 'Торфобрикети — вигідне і тривале тепло для будинку',
                'short_description': 'Купити пресовані торфобрикети фабричного виробництва. Час тління до 8-10 годин. Дешеве та ефективне паливо для котлів і печей. Доставка Київ та область.',
                'description': '''<p><strong>Торфобрикети</strong> — це популярна і економічна альтернатива дровам і вугіллю. Вони виготовляються шляхом висушування та потужного пресування фрезерного торфу на промислових заводах. Головна причина, чому тисячі українців обирають саме торф'яні брикети для зимового періоду — їхня неймовірна здатність до тривалого горіння та тління. Жоден інший вид недеревного палива не здатен так довго підтримувати температуру.</p>

<p>Після завантаження в котел, торфобрикет може рівномірно віддавати тепло протягом 8-10 годин. Це означає, що заклавши топку ввечері, ви прокинетеся у теплому будинку вранці. Вони чудово працюють у комбінації із <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">дровами</a></strong> (дрова використовують для швидкого розпалу, а торф — для підтримання жару). Це більш доступна і передбачувана альтернатива <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">вугіллю</a></strong>, особливо для тих, хто цінує економію без втрати температурного комфорту.</p>

<p>Торфобрикети пакуються в зручні біг-беги або мішки, не кришаться під час розвантаження і готові до використання одразу після доставки. Якщо ви шукаєте інший формат опалення, радимо оглянути <strong><a href="/catalog/brikety" style="color:#F97316;text-decoration:none;">інші брикети з деревини</a></strong> в нашому асортименті.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Брикети з торфу"},
                    {"label": "Походження", "value": "Екологічно чистий фрезерний торф"},
                    {"label": "Форма брикету", "value": "Пресовані прямокутники"},
                    {"label": "Вологість", "value": "Близько 15-18%"},
                    {"label": "Теплотворність", "value": "3900-4100 ккал/кг"},
                    {"label": "Фасування", "value": "Біг-беги або поліпропіленові мішки"},
                    {"label": "Зольність", "value": "Близько 15-20%"},
                    {"label": "Сфера використання", "value": "Побутові котли, цегляні печі (груби)"},
                    {"label": "Доставка", "value": "Регіони Києва та передмістя (маніпулятор)"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "Для яких печей найбільше підходять торфобрикети?", "a": "Торф'яні брикети найкраще підходять для класичних сільських печей (груб), а також для твердопаливних котлів без автоматики, де важливе довготривале тління."},
                    {"q": "Чи багато попелу залишається після торфобрикетів?", "a": "Так, зольність торфу вища, ніж у деревини і становить близько 15-20%. Цей попіл є чудовим природним добривом для городу і саду."},
                    {"q": "Чи мають торфобрикети специфічний запах?", "a": "Під час горіння торф може мати легкий, характерний запах палаючої землі або диму. У закритих котлах із нормальною тягою він абсолютно не відчувається в приміщенні."},
                    {"q": "Чим вигідніше палити: дровами чи торфом?", "a": "Торфобрикети горять у 2-3 рази довше за дрова завдяки режиму тління. Це забезпечує величезну зручність вночі, тому багато клієнтів купують обидва типи палива разом."}
                ], ensure_ascii=False),
                'meta_title': 'Купити торфобрикети в Києві — вигідна ціна за тонну | КиївДрова',
                'meta_description': 'Якісні торфобрикети для печей та твердопаливних котлів. Понад 8 годин горіння! Замовляйте доставку торфобрикетів по Києву та області за кращою ціною.',
                'image_alt': 'торфобрикети купити київ торф брикети',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Торфобрикети",
                            "description": "Купити пресовані торфобрикети фабричного виробництва. Час тління до 8-10 годин. Доставка Київ та область.",
                            "sku": "torfobrykety",
                            "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
                        }
                    ]
                }, ensure_ascii=False)
            },
            'brykety-pini-kay-xl': {
                'name': 'Брикети Pini Kay XL — подовжені євродрова високої міцності',
                'short_description': 'Купити паливні брикети Pini Kay XL. Збільшений розмір для ще довшого горіння. Максимальна тепловіддача та мінімум попелу. Швидка доставка!',
                'description': '''<p><strong>Паливні брикети Pini Kay XL</strong> — це підсилена версія класичних євродров. Вони мають ту ж восьмигранну форму з центральним отвором для кращої тяги, але вирізняються збільшеною довжиною та ще вищою щільністю пресування. Це робить їх ідеальним вибором для великих топок, камінів та промислових твердопаливних установок.</p>

<p>Перевагою версії XL є значно довший час горіння та тління. Один збільшений брикет здатен підтримувати стабільну температуру в системі на 20-30% довше за стандартний. При цьому тепловіддача залишається стабільно високою, перевершуючи якісні <strong><a href="/catalog/drova" style="color:#F97316;text-decoration:none;">дрова</a></strong>. Зольність Pini Kay XL мінімальна, тому доглядати за котлом простіше, ніж навіть при використанні преміального <strong><a href="/catalog/vugillya" style="color:#F97316;text-decoration:none;">вугілля</a></strong>.</p>

<p>Наші брикети Pini Kay XL надійно фасуються і чудово переносять транспортування та зберігання завдяки обпаленій зовнішній поверхні. Якщо вам потрібні стандартні розміри, ви можете звернути увагу на <strong><a href="/catalog/brikety/brykety-pini-kay" style="color:#F97316;text-decoration:none;">звичайні брикети Pini Kay</a></strong> у нашому каталозі.</p>''',
                'specifications_json': json.dumps([
                    {"label": "Тип палива", "value": "Євродрова (збільшені)"},
                    {"label": "Порода деревини", "value": "Тверді породи (дуб, граб)"},
                    {"label": "Форма брикету", "value": "Восьмигранні з отвором XL"},
                    {"label": "Вологість", "value": "До 5%"},
                    {"label": "Теплотворність", "value": "Близько 5000 ккал/кг"},
                    {"label": "Фасування", "value": "Термоплівка по 10 кг"},
                    {"label": "Зольність", "value": "До 0.8%"},
                    {"label": "Сфера використання", "value": "Котли, каміни великого розміру"},
                    {"label": "Доставка", "value": "Київська область, доставка з розвантаженням"}
                ], ensure_ascii=False),
                'faqs_json': json.dumps([
                    {"q": "Для яких котлів підходять Pini Kay XL?", "a": "Ці брикети ідеально підходять для великих твердопаливних котлів, класичних печей та великих закритих камінів, де потрібне довготривале горіння."},
                    {"q": "Яка різниця між звичайними Pini Kay і версією XL?", "a": "Версія XL довша та масивніша, що дозволяє закладати їх рідше і отримувати більш тривалий період стабільного обігріву на одній закладці."},
                    {"q": "Чи зручно їх розпалювати?", "a": "Так, завдяки внутрішньому отвору тяга відмінна. Але оскільки вони щільні і великі, для розпалу краще використовувати кілька дрібних трісочок."},
                    {"q": "Як швидко виставляється доставка?", "a": "Ми доставляємо брикети максимально швидко — зазвичай у день замовлення або наступного дня, машинами з міцними маніпуляторами."}
                ], ensure_ascii=False),
                'meta_title': 'Брикети Pini Kay XL купити в Києві — збільшені євродрова | КиївДрова',
                'meta_description': 'Якісні збільшені паливні брикети Pini Kay XL для котлів і камінів. Тривале горіння, висока калорійність. Доставка паливних брикетів по Києву.',
                'image_alt': 'паливні брикети pini kay xl піні кей великі купити київ',
                'schema_json': json.dumps({
                    "@context": "https://schema.org",
                    "@graph": [
                        {
                            "@type": "Product",
                            "name": "Брикети Pini Kay XL",
                            "description": "Якісні збільшені паливні брикети Pini Kay XL для котлів і камінів. Тривале горіння, висока калорійність.",
                            "sku": "brykety-pini-kay-xl",
                            "offers": { "@type": "Offer", "priceCurrency": "UAH", "availability": "https://schema.org/InStock" }
                        }
                    ]
                }, ensure_ascii=False)
            }
        }
        
        updated = []
        for slug, data in products_data.items():
            product = db.query(Product).filter(Product.slug == slug).first()
            if product:
                product.name = data['name']
                product.short_description = data['short_description']
                product.description = data['description']
                product.specifications_json = data['specifications_json']
                product.faqs_json = data['faqs_json']
                product.meta_title = data['meta_title']
                product.meta_description = data['meta_description']
                product.schema_json = data['schema_json']
                product.image_alt = data['image_alt']
                updated.append(slug)
        db.commit()
        return {"status": "success", "message": f"Updated {len(updated)} briquettes", "slugs": updated}
    except Exception as e:
        db.rollback()
        return {"status": "error", "message": str(e)}

@app.get("/api/upgrade-db")
def upgrade_db_schema(db: Session = Depends(get_db)):
    """Temporary endpoint to add new SEO/Spec columns to the production DB."""
    import sqlalchemy as sa
    try:
        engine = db.get_bind()
        cols = [
            "short_description TEXT",
            "image_alt TEXT",
            "specifications_json TEXT",
            "faqs_json TEXT"
        ]
        added = []
        for col_def in cols:
            col_name = col_def.split()[0]
            try:
                # Use a separate connection with autocommit for each column
                with engine.connect().execution_options(isolation_level="AUTOCOMMIT") as conn:
                    conn.execute(sa.text(f"ALTER TABLE cakes ADD COLUMN {col_def}"))
                added.append(col_name)
            except sa.exc.OperationalError as e:
                logger.warning(f"Failed to add {col_name}: {e}")
            except sa.exc.ProgrammingError as e:
                logger.warning(f"Failed to add {col_name}: {e}")
                
        return {"status": "success", "message": "DB schema upgrade attempted", "added_columns": added}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ─── Static Files ───────────────────────────────────────────
import mimetypes
mimetypes.add_type("image/webp", ".webp")

STATIC_DIR = Path(__file__).parent / "static"
MEDIA_DIR = Path(__file__).parent / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

class CachedStaticFiles(StaticFiles):
    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "public, max-age=31536000, immutable"
        return response

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/media", CachedStaticFiles(directory=str(MEDIA_DIR)), name="media")
app.mount("/assets", CachedStaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")

# Add direct mounts for proxy pass-through from Host Ukraine
app.mount("/api/v1/static", StaticFiles(directory=str(STATIC_DIR)), name="api_v1_static")
app.mount("/api/v1/media", CachedStaticFiles(directory=str(MEDIA_DIR)), name="api_v1_media")

# ─── Media Mirror for Shared Hosting ─────────────────────────
# Apache serves /media/ from /www/media/, but uploads go to /backend/media/.
# This middleware copies new files after each upload so they're immediately accessible.
import shutil as _shutil

_WWW_MEDIA = Path(__file__).parent.parent / "www" / "media"
if _WWW_MEDIA.is_dir():
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.requests import Request as StarletteRequest

    class MediaMirrorMiddleware(BaseHTTPMiddleware):
        async def dispatch(self, request: StarletteRequest, call_next):
            response = await call_next(request)
            # After successful upload, sync any new files
            if request.url.path.endswith("/admin/upload") and request.method == "POST" and response.status_code == 200:
                try:
                    for f in MEDIA_DIR.iterdir():
                        dst = _WWW_MEDIA / f.name
                        if f.is_file() and not dst.exists():
                            _shutil.copy2(str(f), str(dst))
                except Exception:
                    pass
            return response

    app.add_middleware(MediaMirrorMiddleware)
    logger.info("MediaMirrorMiddleware enabled: syncing /backend/media -> /www/media")


# ─── Include Routers ────────────────────────────────────────

from fastapi import APIRouter
from backend.src.products.router import router as products_router
from backend.src.orders.router import router as orders_router
from backend.src.users.router import router as users_router
from backend.src.admin.router import router as admin_router

# API v1 — versioned prefix for all API routes
api_v1 = APIRouter(prefix="/api/v1")
api_v1.include_router(products_router)
api_v1.include_router(orders_router)
api_v1.include_router(users_router)
api_v1.include_router(admin_router)
app.include_router(api_v1)

# Backward compatibility — keep old routes working (no prefix)
app.include_router(products_router)
app.include_router(orders_router)
app.include_router(users_router)
app.include_router(admin_router)


# ─── Public Pages Endpoints ─────────────────────────────────

from fastapi import Query as QueryParam
from backend.src.pages.service import PageService
from backend.src.pages import schemas as page_schemas

CORE_ROUTES = {'/', '/delivery', '/contacts'}

pages_public_router = APIRouter(tags=["pages"])

@pages_public_router.get("/pages/by-route")
def get_page_by_route(route: str = QueryParam(...), db: Session = Depends(get_db)):
    """Public endpoint: fetch a page's content and SEO by its route_path."""
    page = PageService.get_page_by_route(db, route)
    if not page:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Page not found")
    return page

@pages_public_router.get("/pages/custom")
def list_custom_pages(db: Session = Depends(get_db)):
    """Public endpoint: list all custom (non-core) pages for navigation/sitemap."""
    all_pages = PageService.get_pages(db)
    return [
        {"route_path": p.route_path, "name": p.name, "meta_title": p.meta_title}
        for p in all_pages
        if p.route_path not in CORE_ROUTES
    ]

app.include_router(pages_public_router)


# ─── SEO Endpoints ──────────────────────────────────────────

from fastapi.responses import Response
from backend.src.core.seo import SitemapService

@app.get("/sitemap.xml", include_in_schema=False)
def sitemap(db: Session = Depends(get_db)):
    xml = SitemapService.generate(db)
    return Response(content=xml, media_type="application/xml")

@app.get("/robots.txt", include_in_schema=False)
def robots():
    return Response(content=SitemapService.robots_txt(), media_type="text/plain")

# ─── Startup ────────────────────────────────────────────────

def _migrate_site_settings(db):
    """Auto-migrate: add missing columns to site_settings and seed reviews/faqs if empty."""
    import sqlalchemy as sa
    import json
    from backend.src.admin.models import Review, FAQ, SiteSettings

    engine_ref = db.get_bind()

    # 1. Ensure delivery_transport column exists in site_settings
    try:
        result = db.execute(sa.text("PRAGMA table_info(site_settings)"))
        existing = {row[1] for row in result.fetchall()}
    except Exception:
        existing = set()

    if "delivery_transport" not in existing:
        try:
            db.execute(sa.text("ALTER TABLE site_settings ADD COLUMN delivery_transport TEXT"))
            db.commit()
            logger.info("Added column 'delivery_transport' to site_settings")
        except Exception as e:
            logger.warning("Could not add column 'delivery_transport': %s", e)

    # 2. Populate delivery_transport default if empty
    try:
        settings = db.query(SiteSettings).filter(SiteSettings.id == 1).first()
        if settings and not settings.delivery_transport:
            settings.delivery_transport = json.dumps([
                {"type": "ГАЗель (бус)", "vol": "4–5 складометрів", "price": "1 500 грн", "desc": "Швидка доставка невеликих замовлень", "category": "standard", "image": "/images/delivery/gazel-dostavka-driv-kyiv.webp"},
                {"type": "ЗІЛ самоскид", "vol": "4 складометри", "price": "3 000 грн", "desc": "Оптимально для приватних будинків", "category": "standard", "image": "/images/delivery/zil-dostavka-driv-kyiv.webp"},
                {"type": "КАМАЗ самоскид", "vol": "8 складометрів", "price": "4 000 грн", "desc": "Великі обсяги палива", "category": "standard", "image": "/images/delivery/kamaz-dostavka-driv-kyiv.webp"},
                {"type": "Кран-маніпулятор", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження у складних умовах", "category": "special", "image": "/images/delivery/manipulator-dostavka-kyiv.webp"},
                {"type": "Гідроборт / рокла", "vol": "Складні умови", "price": "від 4 500 грн", "desc": "Для розвантаження палет", "category": "special", "image": "/images/delivery/gidrobort-rokla-dostavka-kyiv.webp"},
                {"type": "Фура", "vol": "22–24 складометри", "price": "за домовленістю", "desc": "Поставка напряму з лісгоспу", "category": "table_only", "image": ""}
            ], ensure_ascii=False)
            db.commit()
            logger.info("Auto-populated delivery_transport defaults in site_settings")
    except Exception as e:
        logger.warning("Could not populate delivery_transport: %s", e)

    # 3. Seed Reviews table if empty
    try:
        review_count = db.query(Review).count()
        if review_count == 0:
            default_reviews = [
                Review(name="Олександр", city="Київ", date="2024-11-15", stars=5,
                       text="Замовляв дубові дрова. Привезли швидко, обсяг чесний. Дрова сухі, горять відмінно. Рекомендую!",
                       is_active=True, sort_order=1),
                Review(name="Олена", city="Бровари", date="2024-12-02", stars=5,
                       text="Дуже задоволена обслуговуванням. Водій допоміг розвантажити, все акуратно. Брикети РУФ якісні.",
                       is_active=True, sort_order=2),
                Review(name="Іван", city="Ірпінь", date="2025-01-20", stars=4,
                       text="Купував пелети для котла. Зольність низька, тепловіддача хороша. Буду замовляти ще.",
                       is_active=True, sort_order=3),
                Review(name="Марина", city="Вишневе", date="2025-02-10", stars=5,
                       text="Брикети Pini Kay — просто вогонь! Горять довго, жар рівномірний. Замовляю вже другий раз.",
                       is_active=True, sort_order=4),
                Review(name="Сергій", city="Буча", date="2025-02-28", stars=5,
                       text="Замовляли КАМАЗ дров на зиму. Привезли точно в обіцяний час. Якість дерева відмінна, все сухе.",
                       is_active=True, sort_order=5),
            ]
            db.add_all(default_reviews)
            db.commit()
            logger.info("Seeded %d default reviews", len(default_reviews))
    except Exception as e:
        logger.warning("Could not seed reviews: %s", e)

    # 4. Seed FAQs table if empty
    try:
        faq_count = db.query(FAQ).count()
        if faq_count == 0:
            default_faqs = [
                FAQ(page="home", question="Чи працюєте ви на вихідних?",
                    answer="Так, ми працюємо без вихідних, щоб забезпечити вас паливом у зручний для вас час.",
                    is_active=True, sort_order=1),
                FAQ(page="home", question="Як швидко ви доставляєте?",
                    answer="Доставка зазвичай здійснюється в день замовлення або на наступний день.",
                    is_active=True, sort_order=2),
                FAQ(page="home", question="Чи є мінімальне замовлення?",
                    answer="Мінімальне замовлення дров — від 2 складометрів, брикетів та пелет — від 1 тонни. Можливий самовивіз будь-якої кількості.",
                    is_active=True, sort_order=3),
                FAQ(page="home", question="Як оплатити замовлення?",
                    answer="Оплата здійснюється після отримання та перевірки товару готівкою або на картку.",
                    is_active=True, sort_order=4),
                FAQ(page="delivery", question="Які авто використовуються для доставки?",
                    answer="Ми використовуємо ГАЗелі, ЗІЛи, КАМАЗи та маніпулятори в залежності від обсягу замовлення та умов розвантаження.",
                    is_active=True, sort_order=1),
                FAQ(page="delivery", question="Чи можна замовити доставку з маніпулятором?",
                    answer="Так, ми маємо власні маніпулятори для розвантаження палет з брикетами або мішків з вугіллям у складних умовах.",
                    is_active=True, sort_order=2),
            ]
            db.add_all(default_faqs)
            db.commit()
            logger.info("Seeded %d default FAQs", len(default_faqs))
    except Exception as e:
        logger.warning("Could not seed FAQs: %s", e)


@app.on_event("startup")
async def startup_event():
    logger.info("Application startup — seeding database if empty")
    db = SessionLocal()
    try:
        auto_seed.check_and_seed_data(db)
        logger.info("Database seed check complete")
        _migrate_site_settings(db)
        logger.info("Site settings migration complete")
    except Exception as e:
        logger.error("Failed during startup: %s", e)
    finally:
        db.close()


# ─── Root / Health ───────────────────────────────────────────



@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/health-check")
async def detailed_health_check(db: Session = Depends(get_db)):
    product_count = db.query(Product).count()
    pages_count = db.query(Page).count()
    return {
        "status": "online",
        "database": "connected",
        "products_count": product_count,
        "pages_count": pages_count,
    }

# ─── SPA Route ──────────────────────────────────────────────

from fastapi.responses import FileResponse, RedirectResponse
import os
from backend.src.products.service import CategoryMetadataService, ProductService
from backend.src.pages.service import PageService
@app.get("/api/debug-db-path")
def debug_db_path():
    """Returns the absolute path of the current database file."""
    from backend.src.core.database import SQLALCHEMY_DATABASE_URL
    import os
    
    path = SQLALCHEMY_DATABASE_URL.replace("sqlite:///", "")
    exists = os.path.exists(path)
    
    # Try finding any db file if the configured one doesn't exist
    found_dbs = []
    if not exists:
        try:
            for root, dirs, files in os.walk(os.path.dirname(os.path.dirname(__file__))):
                for f in files:
                    if f.endswith('.db') or f.endswith('.sqlite'):
                        found_dbs.append(os.path.join(root, f))
        except Exception:
            pass
            
    return {
        "configured_url": SQLALCHEMY_DATABASE_URL,
        "resolved_path": path,
        "exists": exists,
        "cwd": os.getcwd(),
        "file_dir": os.path.dirname(__file__),
        "found_dbs": found_dbs
    }

@app.get("/api/debug-routes")
def debug_routes():
    """Returns all registered paths."""
    routes = []
    for r in app.routes:
        if hasattr(r, 'path'):
            routes.append(r.path)
    return {"routes": routes}

@app.api_route("/{path_name:path}", methods=["GET"])
async def catch_all(path_name: str, db: Session = Depends(get_db)):
    """
    Catch-all route to serve the React SPA `index.html`.
    Any path that doesn't match an API route or static file 
    will return the React app, allowing React Router to handle it.
    IMPORTANT: Returns proper 404 status code for unknown routes to satisfy SEO requirements.
    """
    path = "/" + path_name.strip("/")

    # Never intercept API routes — let FastAPI routers handle them
    if path.startswith("/api/"):
        from fastapi.responses import JSONResponse
        return JSONResponse({"detail": "Not Found"}, status_code=404)

    index_file = os.path.join(STATIC_DIR, "index.html")
    if not os.path.isfile(index_file):
        return {"message": "KievBriket API (React frontend not built)"}
    
    
    # Securely check if the requested path corresponds to an existing static file (e.g. /images/... or /favicon.svg)
    safe_path = os.path.normpath(path_name.strip("/"))
    if not safe_path.startswith(".."):
        file_path = os.path.join(STATIC_DIR, safe_path)
        if os.path.isfile(file_path):
            # Known static assets from Vite public folder
            import mimetypes
            content_type, _ = mimetypes.guess_type(file_path)
            # Apply long-lived caching to images/assets
            headers = {}
            if safe_path.startswith("images/") or safe_path.startswith("assets/"):
                headers["Cache-Control"] = "public, max-age=31536000, immutable"
            return FileResponse(file_path, media_type=content_type, headers=headers)

    if path == "/":
        return FileResponse(index_file)

    # Known React exact routes
    valid_exact = {"/", "/delivery", "/contacts", "/dostavka", "/kontakty", "/pro-nas", "/login", "/register", "/cart"}
    if path in valid_exact:
        return FileResponse(index_file)

    # Admin routes
    if path.startswith("/admin"):
        return FileResponse(index_file)

    # Legacy 301 Redirects
    LEGACY_SLUGS = {"firewood": "drova", "briquettes": "brikety", "coal": "vugillya"}
    if path.startswith("/catalog/"):
        parts = path.replace("/catalog/", "", 1).strip("/").split("/")
        if parts[0] in LEGACY_SLUGS:
            new_cat = LEGACY_SLUGS[parts[0]]
            if len(parts) == 1:
                return RedirectResponse(url=f"/catalog/{new_cat}", status_code=301)
            else:
                return RedirectResponse(url=f"/catalog/{new_cat}/{parts[1]}", status_code=301)

    # Dynamic Routes Validation
    if path.startswith("/page/"):
        page = PageService.get_page_by_route(db, path)
        if page:
            return FileResponse(index_file)

    elif path.startswith("/catalog/"):
        parts = path.replace("/catalog/", "", 1).strip("/").split("/")
        if len(parts) == 1:
            if CategoryMetadataService.get_category_metadata(db, parts[0]):
                return FileResponse(index_file)
        elif len(parts) == 2:
            if ProductService.get_product_by_slug(db, parts[1]):
                return FileResponse(index_file)

    # If no valid match, return index.html but with a 404 status code for SEO
    return FileResponse(index_file, status_code=404)


@app.get("/api/fix-db-json")
def fix_db_json(db: Session = Depends(get_db)):
    """One-time route to fix all stringified JSON stored in PostgreSQL."""
    import json
    
    products = db.query(Product).all()
    fixed_count = 0
    
    for product in products:
        changed = False
        
        # Check specifications_json
        if isinstance(product.specifications_json, str):
            try:
                product.specifications_json = json.loads(product.specifications_json)
                changed = True
            except json.JSONDecodeError:
                pass
                
        # Check faqs_json
        if isinstance(product.faqs_json, str):
            try:
                product.faqs_json = json.loads(product.faqs_json)
                changed = True
            except json.JSONDecodeError:
                pass
                
        if changed:
            db.add(product)
            fixed_count += 1
            
    if fixed_count > 0:
        db.commit()
        
    return {"message": "Database JSON arrays fixed.", "products_fixed": fixed_count}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
