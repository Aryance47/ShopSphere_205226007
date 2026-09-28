const API_URL = "http://127.0.0.1:8000";


export async function getProducts(search = "", categoryId = "") {

  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  if (categoryId) {
    params.append("category_id", categoryId);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}/api/products/?${queryString}`
    : `${API_URL}/api/products/`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}


export async function getProduct(id) {

  const response = await fetch(
    `${API_URL}/api/products/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  return response.json();
}


export async function getCategories() {

  const response = await fetch(
    `${API_URL}/api/categories/`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}


export async function createCategory(category) {
  const response = await fetch(`${API_URL}/api/categories/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create category");
  }

  return response.json();
}


export async function createProduct(product) {
  const response = await fetch(`${API_URL}/api/products/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create product");
  }

  return response.json();
}


export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete product");
  }

  return response.json();
}


export async function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const response = await fetch(
    `${API_URL}/api/users/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }

  localStorage.setItem(
    "access_token",
    data.access_token
  );

  return data;
}


export async function registerUser(user) {
  const response = await fetch(
    `${API_URL}/api/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Registration failed"
    );
  }

  return data;
}


export function logoutUser() {
  localStorage.removeItem("access_token");
}


export function getAccessToken() {
  return localStorage.getItem("access_token");
}


export async function getCart() {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/cart/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to fetch cart"
    );
  }

  return data;
}


export async function addToCart(productId, quantity = 1) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/cart/items`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        product_id: productId,
        quantity: quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to add product to cart"
    );
  }

  return data;
}


export async function updateCartItem(
  itemId,
  quantity
) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/cart/items/${itemId}`,
    {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        quantity: quantity,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to update cart item"
    );
  }

  return data;
}


export async function removeCartItem(itemId) {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/cart/items/${itemId}`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to remove cart item"
    );
  }

  return data;
}


export async function clearCart() {
  const token = getAccessToken();

  const response = await fetch(
    `${API_URL}/api/cart/`,
    {
      method: "DELETE",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.detail || "Failed to clear cart"
    );
  }

  return data;
}
