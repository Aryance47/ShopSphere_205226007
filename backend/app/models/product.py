from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey
from app.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image_url = Column(String(500), nullable=True)

    category_id = Column(
        Integer,
        ForeignKey("categories.id"),
        nullable=False
    )
    