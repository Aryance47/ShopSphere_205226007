import { Link } from "react-router-dom";

function ProductCard({ product }) {
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
    </div>
  );
}

export default ProductCard;