import React, { useState } from "react";
import axios from "axios";

const ProductSearch = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8000/api/products/", {
        params: { query, category },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Search failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Search Products</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="furniture">Furniture</option>
          </select>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </form>
        <div className="mt-6 space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="text-lg font-medium text-gray-800">{product.name}</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
              <span className="text-gray-700 font-medium">${product.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
