import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCart();

      console.log("CART DATA:", data);

      setCart(data);

    } catch (err) {
      console.error("CART ERROR:", err);

      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(
      "access_token"
    );

    if (!token) {
      navigate("/login");
      return;
    }

    loadCart();
  }, [navigate]);

  const handleIncrease = async (item) => {
    try {
      await updateCartItem(
        item.id,
        item.quantity + 1
      );

      await loadCart();

    } catch (err) {
      setError(err.message);
    }
  };

  const handleDecrease = async (item) => {
    if (item.quantity <= 1) {
      return;
    }

    try {
      await updateCartItem(
        item.id,
        item.quantity - 1
      );

      await loadCart();

    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (itemId) => {
    try {
      await removeCartItem(itemId);

      await loadCart();

    } catch (err) {
      setError(err.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();

      await loadCart();

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading cart...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Cart Error</h2>

        <p style={{ color: "red" }}>
          {error}
        </p>

        <button onClick={loadCart}>
          Try Again
        </button>
      </div>
    );
  }

  if (!cart) {
    return (
      <div>
        <h2>Unable to load cart.</h2>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div>
        <h1>Your Cart</h1>

        <p>Your cart is empty.</p>

        <Link to="/products">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const cartTotal = cart.items.reduce(
    (total, item) => {
      return (
        total +
        Number(item.product.price) *
          item.quantity
      );
    },
    0
  );

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "30px",
      }}
    >
      <h1>Your Cart</h1>

      {cart.items.map((item) => {
        const subtotal =
          Number(item.product.price) *
          item.quantity;

        return (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "15px",
            }}
          >
            {item.product.image_url && (
              <img
                src={item.product.image_url}
                alt={item.product.name}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                }}
              />
            )}

            <h2>
              {item.product.name}
            </h2>

            <p>
              Price: ₹
              {Number(
                item.product.price
              ).toFixed(2)}
            </p>

            <div>
              <strong>
                Quantity:
              </strong>

              <button
                onClick={() =>
                  handleDecrease(item)
                }
                disabled={
                  item.quantity <= 1
                }
                style={{
                  marginLeft: "15px",
                }}
              >
                -
              </button>

              <span
                style={{
                  margin: "0 15px",
                }}
              >
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  handleIncrease(item)
                }
              >
                +
              </button>
            </div>

            <p>
              <strong>
                Subtotal:
              </strong>{" "}
              ₹{subtotal.toFixed(2)}
            </p>

            <button
              onClick={() =>
                handleRemove(item.id)
              }
            >
              Remove
            </button>
          </div>
        );
      })}

      <div
        style={{
          borderTop: "2px solid #333",
          paddingTop: "20px",
          marginTop: "20px",
        }}
      >
        <h2>
          Total: ₹{cartTotal.toFixed(2)}
        </h2>

        <button
          onClick={handleClearCart}
        >
          Clear Cart
        </button>

        <Link
          to="/products"
          style={{
            marginLeft: "20px",
          }}
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default Cart;
