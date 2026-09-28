from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    shipping_address: str