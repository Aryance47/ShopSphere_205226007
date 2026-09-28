from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User
from app.models.cart import Cart
from app.models.cart_item import CartItem
from app.models.product import Product
from app.models.order import Order
from app.models.order_item import OrderItem

from app.schemas.order import CheckoutRequest


router = APIRouter(
    prefix="/api/orders",
    tags=["Orders"]
)


@router.post("/checkout")
def checkout(
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart = (
        db.query(Cart)
        .filter(Cart.user_id == current_user.id)
        .first()
    )

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart not found"
        )

    cart_items = (
        db.query(CartItem)
        .filter(CartItem.cart_id == cart.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total_amount = 0

    order_items_data = []

    for cart_item in cart_items:

        product = (
            db.query(Product)
            .filter(
                Product.id == cart_item.product_id
            )
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=(
                    f"Product {cart_item.product_id} "
                    "not found"
                )
            )

        if cart_item.quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Insufficient stock for "
                    f"{product.name}"
                )
            )

        price = product.price

        subtotal = price * cart_item.quantity

        total_amount += subtotal

        order_items_data.append({
            "product": product,
            "quantity": cart_item.quantity,
            "price": price,
            "subtotal": subtotal
        })

    order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="pending",
        shipping_address=checkout_data.shipping_address
    )

    db.add(order)
    db.flush()

    for item_data in order_items_data:

        product = item_data["product"]

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item_data["quantity"],
            price=item_data["price"],
            subtotal=item_data["subtotal"]
        )

        db.add(order_item)

        product.stock -= item_data["quantity"]

    db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).delete()

    db.commit()

    db.refresh(order)

    return {
        "message": "Order created successfully",
        "order_id": order.id,
        "total_amount": float(order.total_amount),
        "status": order.status
    }
    
    
@router.get("/")
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = (
        db.query(Order)
        .filter(
            Order.user_id == current_user.id
        )
        .order_by(Order.created_at.desc())
        .all()
    )

    return orders


@router.get("/{order_id}")
def get_my_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.user_id == current_user.id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order
