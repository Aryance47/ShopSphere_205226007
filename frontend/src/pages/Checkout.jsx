import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkout } from "../services/api";

function Checkout() {
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async (event) => {
    event.preventDefault();

    setError("");

    if (!shippingAddress.trim()) {
      setError("Shipping address is required.");
      return;
    }

    try {
      setLoading(true);

      const data = await checkout(
        shippingAddress
      );

      navigate(
        `/orders/${data.order_id}`
      );

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleCheckout}>
        <label>
          Shipping Address
        </label>

        <br />

        <textarea
          value={shippingAddress}
          onChange={(event) =>
            setShippingAddress(
              event.target.value
            )
          }
          rows="5"
          cols="50"
          placeholder="Enter your shipping address"
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : "Place Order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;
