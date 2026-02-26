"""
Logging configuration with timed rotation.
- app.log: all INFO+ messages (requests, business logic)
- error.log: only WARNING+ messages (errors, problems)
- Rotation: daily, keep 30 days max, old logs auto-deleted
"""
import logging
import os
from logging.handlers import TimedRotatingFileHandler

# Create logs directory
LOGS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(LOGS_DIR, exist_ok=True)

# Log format: timestamp, level, logger name, message
LOG_FORMAT = "%(asctime)s %(levelname)-8s [%(name)s] %(message)s"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def setup_logging():
    """Initialize application logging with rotating file handlers."""
    root_logger = logging.getLogger("cakeshop")
    root_logger.setLevel(logging.DEBUG)

    # Prevent duplicate handlers on reload
    if root_logger.handlers:
        return root_logger

    formatter = logging.Formatter(LOG_FORMAT, datefmt=DATE_FORMAT)

    # --- App log (INFO+): all normal activity ---
    app_handler = TimedRotatingFileHandler(
        filename=os.path.join(LOGS_DIR, "app.log"),
        when="midnight",      # Rotate at midnight
        interval=1,           # Every 1 day
        backupCount=30,       # Keep 30 days, older auto-deleted
        encoding="utf-8",
    )
    app_handler.setLevel(logging.INFO)
    app_handler.setFormatter(formatter)
    app_handler.suffix = "%Y-%m-%d"  # Rotated file suffix: app.log.2026-02-26

    # --- Error log (WARNING+): only problems ---
    error_handler = TimedRotatingFileHandler(
        filename=os.path.join(LOGS_DIR, "error.log"),
        when="midnight",
        interval=1,
        backupCount=30,
        encoding="utf-8",
    )
    error_handler.setLevel(logging.WARNING)
    error_handler.setFormatter(formatter)
    error_handler.suffix = "%Y-%m-%d"

    # --- Console output (for development) ---
    console_handler = logging.StreamHandler()
    console_handler.setLevel(logging.INFO)
    console_handler.setFormatter(formatter)

    root_logger.addHandler(app_handler)
    root_logger.addHandler(error_handler)
    root_logger.addHandler(console_handler)

    root_logger.info("Logging initialized — logs dir: %s", LOGS_DIR)
    return root_logger
