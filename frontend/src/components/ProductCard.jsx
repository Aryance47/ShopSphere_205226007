import { Link } from "react-router-dom";
import { addToCart } from "../services/api";

function ProductCard({ product }) {

  const handleAddToCart = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      alert("Please login to add products to cart.");
      return;
    }

    try {
      await addToCart(product.id, 1);
      alert("Product added to cart!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <img
        src={product.image_url}
        alt={product.name}
        width="200"
      />

      <h3>{product.name}</h3>

      <p>{product.description}</p>

      <p>₹{product.price}</p>

      <p>Stock: {product.stock}</p>

      <Link to={`/products/${product.id}`}>
        View Product
      </Link>

      <br />

      <button onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;
