from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import Category, Product
from app.routers import categories, products
from app.models.user import User


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="ShopSphere API",
    description="Backend API for ShopSphere e-commerce application",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(categories.router)
app.include_router(products.router)


@app.get("/")
def root():
    return {
        "message": "Welcome to ShopSphere API"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy"
    }