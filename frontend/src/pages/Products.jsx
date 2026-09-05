import { useEffect, useState } from "react";

import ProductGrid from "../components/ProductGrid";
import {
  getProducts,
  getCategories
} from "../services/api";


function Products() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Load categories
  useEffect(() => {

    async function loadCategories() {

      try {

        const data = await getCategories();

        setCategories(data);

      } catch (err) {

        setError(err.message);

      }

    }

    loadCategories();

  }, []);


  // Load products
  useEffect(() => {

    async function loadProducts() {

      try {

        setLoading(true);

        const data = await getProducts(
          search,
          categoryId
        );

        setProducts(data);

      } catch (err) {

        setError(err.message);

      } finally {

        setLoading(false);

      }

    }

    loadProducts();

  }, [search, categoryId]);


  return (
    <div>

      <h1>Products</h1>


      {/* SEARCH */}
      <div>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

      </div>


      {/* CATEGORY FILTER */}
      <div>

        <select
          value={categoryId}
          onChange={(e) =>
            setCategoryId(e.target.value)
          }
        >

          <option value="">
            All Categories
          </option>

          {categories.map((category) => (

            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>

          ))}

        </select>

      </div>


      {/* RESULTS */}

      {loading && (
        <p>Loading products...</p>
      )}


      {error && (
        <p>Error: {error}</p>
      )}


      {!loading && !error && (
        <>
          <p>
            {products.length} product(s) found
          </p>

          <ProductGrid
            products={products}
          />
        </>
      )}

    </div>
  );
}


export default Products;
