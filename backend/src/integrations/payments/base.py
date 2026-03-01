"""
Payment provider base interface.
Each provider (LiqPay, Mono, Stripe) implements these methods.
"""
import logging
from typing import Optional

logger = logging.getLogger("cakeshop.payments")


class PaymentProvider:
    """Base class for payment providers. Override in subclasses."""

    name: str = "base"

    def create_payment(self, order_id: int, amount: float, description: str) -> dict:
        """
        Create a payment and return redirect info.
        Returns: {"payment_url": "...", "payment_id": "..."}
        """
        raise NotImplementedError(f"{self.name}: create_payment not implemented")

    def handle_webhook(self, data: dict) -> dict:
        """
        Handle callback from payment provider.
        Returns: {"order_id": ..., "status": "success"|"failed", "payment_id": "..."}
        """
        raise NotImplementedError(f"{self.name}: handle_webhook not implemented")

    def check_status(self, payment_id: str) -> str:
        """Check payment status. Returns: 'pending', 'success', 'failed'."""
        raise NotImplementedError(f"{self.name}: check_status not implemented")
