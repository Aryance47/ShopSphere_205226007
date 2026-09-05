import { useEffect, useState } from "react";
import {
  getProducts,
  getCategories,
  createProduct,
  createCategory,
  deleteProduct,
} from "../services/api";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: "",
    category_id: "",
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const productsData = await getProducts();
      const categoriesData = await getCategories();

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleProductChange(e) {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  }

  function handleCategoryChange(e) {
    setCategoryForm({
      ...categoryForm,
      [e.target.name]: e.target.value,
    });
  }

  async function handleAddProduct(e) {
  e.preventDefault();

  try {
    setError("");
    setMessage("");

    const newProduct = {
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock),
      category_id: Number(productForm.category_id),
    };

    console.log("Product form:", productForm);
    console.log("Data being sent:", newProduct);

    await createProduct(newProduct);

    setMessage("Product added successfully!");

    setProductForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      image_url: "",
      category_id: "",
    });

    loadData();
  } catch (err) {
    setError(err.message);
  }
}

  async function handleAddCategory(e) {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      await createCategory(categoryForm);

      setMessage("Category added successfully!");

      setCategoryForm({
        name: "",
        description: "",
      });

      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteProduct(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteProduct(id);

      setMessage("Product deleted successfully!");

      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>ShopSphere Admin Panel</h1>

      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}

      <hr />

      {/* Add Category */}

      <h2>Add Category</h2>

      <form onSubmit={handleAddCategory}>
        <div>
          <label>Category Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={categoryForm.name}
            onChange={handleCategoryChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <input
            type="text"
            name="description"
            value={categoryForm.description}
            onChange={handleCategoryChange}
          />
        </div>

        <br />

        <button type="submit">Add Category</button>
      </form>

      <hr />

      {/* Add Product */}

      <h2>Add Product</h2>

      <form onSubmit={handleAddProduct}>
        <div>
          <label>Product Name</label>
          <br />
          <input
            type="text"
            name="name"
            value={productForm.name}
            onChange={handleProductChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={productForm.description}
            onChange={handleProductChange}
          />
        </div>

        <br />

        <div>
          <label>Price</label>
          <br />
          <input
            type="number"
            name="price"
            value={productForm.price}
            onChange={handleProductChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Stock</label>
          <br />
          <input
            type="number"
            name="stock"
            value={productForm.stock}
            onChange={handleProductChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Image URL</label>
          <br />
          <input
            type="text"
            name="image_url"
            value={productForm.image_url}
            onChange={handleProductChange}
          />
        </div>

        <br />

        <div>
          <label>Category</label>
          <br />

          <select
            name="category_id"
            value={productForm.category_id}
            onChange={handleProductChange}
            required
          >
            <option value="">Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <button type="submit">Add Product</button>
      </form>

      <hr />

      {/* Products */}

      <h2>Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const category = categories.find(
                (category) => category.id === product.category_id
              );

              return (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>{category ? category.name : "Unknown"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;
