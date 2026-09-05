import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>ShopSphere</h2>

      <div>
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/products">Products</Link>
        {" | "}
        <Link to="/admin/products">Admin</Link>
      </div>
    </nav>
  );
}

export default Navbar;