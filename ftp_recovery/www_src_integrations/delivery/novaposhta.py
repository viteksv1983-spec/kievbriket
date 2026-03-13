"""
Nova Poshta delivery provider stub.
To activate: set ENABLE_DELIVERY_NOVAPOSHTA=true, NOVAPOSHTA_API_KEY in .env
"""
import logging
from .base import DeliveryProvider

logger = logging.getLogger("cakeshop.delivery.novaposhta")


class NovaPoshtaProvider(DeliveryProvider):
    name = "novaposhta"

    def __init__(self, api_key: str = ""):
        self.api_key = api_key
        self.base_url = "https://api.novaposhta.ua/v2.0/json/"

    def get_options(self, city: str = "Київ") -> list:
        """
        TODO: Implement when API key is available.
        
        Example:
            import requests
            response = requests.post(self.base_url, json={
                "apiKey": self.api_key,
                "modelName": "Address",
                "calledMethod": "getWarehouses",
                "methodProperties": {"CityName": city, "Limit": 50}
            })
            return response.json()["data"]
        """
        logger.warning("Nova Poshta: get_options called but not configured")
        return []

    def calculate_price(self, weight: float, city: str = "Київ") -> float:
        logger.warning("Nova Poshta: calculate_price called but not configured")
        return 0.0

    def create_shipment(self, order_id: int, address: str) -> dict:
        logger.warning("Nova Poshta: create_shipment called but not configured")
        return {"tracking_number": None, "status": "not_configured"}
