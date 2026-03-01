"""
Delivery provider base interface.
Each provider (Nova Poshta, Uklon, own delivery) implements these methods.
"""
import logging
from typing import Optional

logger = logging.getLogger("cakeshop.delivery")


class DeliveryProvider:
    """Base class for delivery providers."""

    name: str = "base"

    def get_options(self, city: str = "Київ") -> list:
        """
        Return available delivery options (warehouses, tariffs).
        Returns: [{"id": "...", "name": "...", "address": "..."}]
        """
        raise NotImplementedError(f"{self.name}: get_options not implemented")

    def calculate_price(self, weight: float, city: str = "Київ") -> float:
        """Calculate delivery price based on weight and city."""
        raise NotImplementedError(f"{self.name}: calculate_price not implemented")

    def create_shipment(self, order_id: int, address: str) -> dict:
        """
        Create a shipment/tracking.
        Returns: {"tracking_number": "...", "status": "created"}
        """
        raise NotImplementedError(f"{self.name}: create_shipment not implemented")
