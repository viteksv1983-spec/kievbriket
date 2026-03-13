"""
Centralized configuration — single source of truth for all settings.
Uses pydantic-settings for type-safe, validated configuration from .env.
"""
import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """All app settings in one place. Loaded from .env or environment variables."""

    # --- App ---
    app_name: str = "KievBriket API"
    app_version: str = "0.3.0"
    debug: bool = False

    # --- Database ---
    database_url: str = Field(
        default="sqlite:///backend/src/core/sql_app.db",
        description="SQLAlchemy connection string"
    )

    # --- Security ---
    secret_key: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # --- Google OAuth ---
    google_client_id: str = ""

    # --- CORS ---
    cors_origins: str = "*"  # Comma-separated list or "*"

    # --- Telegram ---
    telegram_bot_token: str = ""
    telegram_default_chat_id: str = ""

    # --- Rate Limiting ---
    rate_limit_default: str = "60/minute"
    rate_limit_login: str = "5/minute"
    rate_limit_orders: str = "10/minute"

    # --- Cache ---
    product_cache_ttl: int = 300  # seconds

    # ─── Engine Modules (toggle via .env) ────────────────────
    enable_cart: bool = True
    enable_orders: bool = True
    enable_quick_order: bool = True
    enable_filters: bool = True
    enable_discounts: bool = False
    enable_payments: bool = False
    enable_delivery_novaposhta: bool = False
    enable_blog: bool = False
    enable_reviews: bool = False
    enable_telegram: bool = True
    enable_google_oauth: bool = True
    enable_seo_pages: bool = True
    enable_image_upload: bool = True
    enable_auto_seed: bool = True

    # --- Server ---
    host: str = "0.0.0.0"
    port: int = 8000

    # --- Trusted Hosts ---
    allowed_hosts: str = "*"  # Comma-separated

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
        "extra": "ignore",
    }


# Instantiate once — import `settings` everywhere
settings = Settings()
