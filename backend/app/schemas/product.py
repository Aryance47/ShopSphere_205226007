from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int
    image_url: str | None = None
    category_id: int


class ProductResponse(ProductCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)
    