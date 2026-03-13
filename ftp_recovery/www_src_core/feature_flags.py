"""
Feature Flags — simple, explicit toggle system.
Syncs with centralized config (Settings) on startup.
Can be toggled at runtime via admin API.

Usage in code:
    from backend.src.core.feature_flags import is_enabled
    if is_enabled("enable_cart"):
        # cart logic
"""
import logging
from backend.src.core.config import settings

logger = logging.getLogger("cakeshop.features")

# ─── Flag Definitions ───────────────────────────────────────
# Synced from Settings on startup. Can be toggled at runtime.
# Descriptions shown in admin UI.
FLAG_DESCRIPTIONS: dict[str, str] = {
    "enable_cart":                "Кошик покупок",
    "enable_orders":             "Система замовлень",
    "enable_quick_order":        "Швидке замовлення (1 клік)",
    "enable_filters":            "Фільтри товарів (ціна, вага)",
    "enable_discounts":          "Знижки та промокоди",
    "enable_payments":           "Онлайн-оплата (LiqPay/Mono)",
    "enable_delivery_novaposhta":"Доставка Нова Пошта",
    "enable_blog":               "Блог / Статті",
    "enable_reviews":            "Відгуки покупців",
    "enable_telegram":           "Telegram-повідомлення",
    "enable_google_oauth":       "Вхід через Google",
    "enable_seo_pages":          "SEO-сторінки (meta, schema)",
    "enable_image_upload":       "Завантаження зображень",
    "enable_auto_seed":          "Авто-сід БД при старті",
}

# Runtime flags — initialized from config
FLAGS: dict[str, bool] = {
    "enable_cart":                 settings.enable_cart,
    "enable_orders":              settings.enable_orders,
    "enable_quick_order":         settings.enable_quick_order,
    "enable_filters":             settings.enable_filters,
    "enable_discounts":           settings.enable_discounts,
    "enable_payments":            settings.enable_payments,
    "enable_delivery_novaposhta": settings.enable_delivery_novaposhta,
    "enable_blog":                settings.enable_blog,
    "enable_reviews":             settings.enable_reviews,
    "enable_telegram":            settings.enable_telegram,
    "enable_google_oauth":        settings.enable_google_oauth,
    "enable_seo_pages":           settings.enable_seo_pages,
    "enable_image_upload":        settings.enable_image_upload,
    "enable_auto_seed":           settings.enable_auto_seed,
}


def is_enabled(flag_name: str, default: bool = False) -> bool:
    """Check if a feature flag is enabled."""
    return FLAGS.get(flag_name, default)


def set_flag(flag_name: str, value: bool) -> None:
    """Set a feature flag at runtime."""
    if flag_name not in FLAG_DESCRIPTIONS:
        logger.warning("Unknown flag '%s'", flag_name)
        return
    FLAGS[flag_name] = value
    logger.info("Feature flag '%s' → %s", flag_name, value)


def get_all_flags() -> list[dict]:
    """Return all flags with name, value, and description — for admin UI."""
    return [
        {
            "name": name,
            "enabled": FLAGS.get(name, False),
            "description": FLAG_DESCRIPTIONS.get(name, ""),
        }
        for name in FLAG_DESCRIPTIONS
    ]
