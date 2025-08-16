import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/apiServices';

const ProductModal = ({ isOpen, onClose, onSubmit}) => {
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: true,
    image: '',
  });

  const [catItems, setCatItems] = useState([])

  const fetchCategory = async () => {
    try {
      const data = await getCategories();
      setCatItems(data);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    fetchCategory()
  },[])

  console.log("categories",catItems)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.price || !form.stock) {
      alert('Please fill all required fields.');
      return;
    }
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Add Product</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="">Select a Category</option>
            {catItems.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
