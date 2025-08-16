import React, { useState, useEffect } from 'react';

// Sample product data (you'd fetch this from an API in a real app)
const sampleProductData = {
  id: 1,
  name: 'Sample Product',
  description: 'A high-quality product for your needs.',
  price: 19.99,
  category: 'Electronics',
  imageUrl: 'https://via.placeholder.com/150', // Example image URL
};

const UpdateProduct = ({ productId }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Fetch product data if updating
  useEffect(() => {
    if (productId) {
      // Simulate fetching the product data (replace with API call in a real app)
      setProductData(sampleProductData);
    }
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate an API call to save the product data
    setTimeout(() => {
      setIsSaving(false);
      alert('Product updated successfully!');
      // Optionally redirect or reset the form after saving
    }, 1000);
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
          />
        </div>

        {/* Product Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            rows="4"
            required
          />
        </div>

        {/* Product Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="price">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={productData.price}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
            step="0.01"
          />
        </div>

        {/* Product Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="category">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={productData.category}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            required
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {/* Product Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="imageUrl">
            Product Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`mt-4 py-2 px-6 rounded-lg text-white ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSaving ? 'Saving...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
