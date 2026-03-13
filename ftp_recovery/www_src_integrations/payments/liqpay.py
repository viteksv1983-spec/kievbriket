"""
LiqPay payment provider stub.
To activate: set ENABLE_PAYMENTS=true, LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY in .env
"""
import logging
from .base import PaymentProvider

logger = logging.getLogger("cakeshop.payments.liqpay")


class LiqPayProvider(PaymentProvider):
    name = "liqpay"

    def __init__(self, public_key: str = "", private_key: str = ""):
        self.public_key = public_key
        self.private_key = private_key

    def create_payment(self, order_id: int, amount: float, description: str) -> dict:
        """
        TODO: Implement when LiqPay credentials are available.
        Uses liqpay3 library: pip install liqpay3
        
        Example:
            from liqpay3 import LiqPay
            liqpay = LiqPay(self.public_key, self.private_key)
            params = {
                'action': 'pay',
                'amount': amount,
                'currency': 'UAH',
                'description': description,
                'order_id': str(order_id),
                'version': '3',
                'result_url': f'{domain}/order-success',
                'server_url': f'{domain}/api/v1/payments/webhook/liqpay',
            }
            html = liqpay.cnb_form(params)
        """
        logger.warning("LiqPay: create_payment called but not configured")
        return {
            "payment_url": None,
            "payment_id": None,
            "error": "LiqPay not configured. Set LIQPAY_PUBLIC_KEY and LIQPAY_PRIVATE_KEY in .env",
        }

    def handle_webhook(self, data: dict) -> dict:
        logger.warning("LiqPay: webhook received but not configured")
        return {"order_id": None, "status": "failed", "payment_id": None}

    def check_status(self, payment_id: str) -> str:
        return "pending"
