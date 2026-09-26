import { Link, useNavigate } from "react-router-dom";

import {
  getAccessToken,
  logoutUser,
} from "../services/api";

function Navbar() {
  const navigate = useNavigate();

  const token = getAccessToken();

  const handleLogout = () => {
    logoutUser();

    navigate("/login");
  };

  return (
    <nav>
      <Link to="/">ShopSphere</Link>

      {" | "}

      <Link to="/products">
        Products
      </Link>

      {" | "}

      {token ? (
        <>
          <button onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            Login
          </Link>

          {" | "}

          <Link to="/register">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;
