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