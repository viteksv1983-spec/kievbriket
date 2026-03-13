"""
Event System — simple pub/sub inside the monolith.
No Kafka, no RabbitMQ, no complex event buses.
Just a dictionary mapping event names → list of handler functions.

Usage:
    from backend.src.core.events import emit, on

    # Register a handler
    @on("order_created")
    def notify_telegram(data):
        send_telegram_notification(data["message"], data["db"])

    # Emit an event
    emit("order_created", {"message": msg, "db": db})
"""
import asyncio
import logging
from typing import Callable

logger = logging.getLogger("cakeshop.events")

# ─── Event Registry ─────────────────────────────────────────
# event_name -> [handler1, handler2, ...]
_listeners: dict[str, list[Callable]] = {}


def on(event_name: str):
    """Decorator to register a handler for an event."""
    def decorator(func: Callable):
        if event_name not in _listeners:
            _listeners[event_name] = []
        _listeners[event_name].append(func)
        logger.debug("Registered handler '%s' for event '%s'", func.__name__, event_name)
        return func
    return decorator


def subscribe(event_name: str, handler: Callable):
    """Programmatically subscribe a handler to an event (non-decorator style)."""
    if event_name not in _listeners:
        _listeners[event_name] = []
    _listeners[event_name].append(handler)


def emit(event_name: str, data: dict = None):
    """
    Emit an event synchronously. All handlers are called in order.
    If a handler fails, it logs the error and continues to the next.
    """
    handlers = _listeners.get(event_name, [])
    if not handlers:
        logger.debug("No handlers for event '%s'", event_name)
        return

    logger.info("Emitting event '%s' → %d handler(s)", event_name, len(handlers))
    for handler in handlers:
        try:
            handler(data or {})
        except Exception as e:
            logger.error("Handler '%s' failed for event '%s': %s", handler.__name__, event_name, e)


async def emit_async(event_name: str, data: dict = None):
    """
    Emit an event via asyncio.create_task() — fire-and-forget.
    Handlers run in the background without blocking the response.
    """
    handlers = _listeners.get(event_name, [])
    if not handlers:
        return

    logger.info("Emitting async event '%s' → %d handler(s)", event_name, len(handlers))
    for handler in handlers:
        try:
            if asyncio.iscoroutinefunction(handler):
                asyncio.create_task(handler(data or {}))
            else:
                # Run sync handlers in default executor
                loop = asyncio.get_event_loop()
                loop.run_in_executor(None, handler, data or {})
        except Exception as e:
            logger.error("Async handler '%s' failed for event '%s': %s", handler.__name__, event_name, e)


def get_registered_events() -> dict[str, list[str]]:
    """Return a summary of all registered events and their handler names."""
    return {
        event: [h.__name__ for h in handlers]
        for event, handlers in _listeners.items()
    }
