import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { getCategories, getProducts, updateProducts } from '../services/apiServices';
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import moment from 'moment';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const [productList, setProductList] = useState([]);
  const [productCategory, setProductCategory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view' | 'edit' | 'delete'

  const handleModalOpen = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setProductCategory(data);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProductList(data);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const [, setProductData] = useState({
    totalProducts: 0,
    activeCategories: 0,
    stockAvailabilityRate: 0,
    returnRate: 12,
  });

  const [animatedValues, setAnimatedValues] = useState({
    totalProducts: 0,
    activeCategories: 0,
    stockAvailabilityRate: 0,
    returnRate: 0,
  });

  const animateValue = (key, target, duration = 1000) => {
    let start = 0;
    if (target === 0) {
      setAnimatedValues(prev => ({ ...prev, [key]: 0 }));
      return;
    }

    const stepTime = Math.max(Math.floor(duration / target), 20);

    const interval = setInterval(() => {
      start += 1;
      setAnimatedValues(prev => ({ ...prev, [key]: start }));
      if (start >= target) clearInterval(interval);
    }, stepTime);
  };

  useEffect(() => {
    const calculateProductData = () => {
      const totalProducts = productList.length;

      const categorySet = new Set(productList.map(p => p.category?.id || null));
      const activeCategories = categorySet.size;

      const inStockCount = productList.filter(p => p.stock > 0).length;
      const stockAvailabilityRate = totalProducts > 0
        ? Math.round((inStockCount / totalProducts) * 100)
        : 0;

      const calculated = {
        totalProducts,
        activeCategories,
        stockAvailabilityRate,
        returnRate: 12, // static mock
      };

      setProductData(calculated);

      Object.entries(calculated).forEach(([key, value]) => {
        animateValue(key, value);
      });
    };

    calculateProductData();
  }, [productList]);

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  //update product

  const [editForm, setEditForm] = useState({
    name: '',
    price: '',
    status:false,
  });

  useEffect(() => {
    if (selectedProduct && modalType === 'edit') {
      setEditForm({
        id: selectedProduct.id,
        name: selectedProduct.name || '',
        price: selectedProduct.price || '',
        status: selectedProduct.status || '', 
      });
    }
  }, [selectedProduct, modalType]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await updateProducts(editForm.id, editForm); // ✅ correct usage
      console.log('Product updated:', data);
      handleModalClose();
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error);
    }
  };
  


  return (
    <div className="flex space-x-6 p-6">
      <div className="flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-orange-500 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold">Total Products</h3>
            <p className="text-3xl font-bold">{animatedValues.totalProducts}</p>
          </div>
          <div className="bg-green-500 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold truncate">Active Categories</h3>
            <p className="text-3xl font-bold">{animatedValues.activeCategories}</p>
          </div>
          <div className="bg-gray-500 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold truncate">Stock Availability Rate</h3>
            <p className="text-3xl font-bold">{animatedValues.stockAvailabilityRate}%</p>
          </div>
          <div className="bg-blue-950 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-semibold">Return Rate</h3>
            <p className="text-3xl font-bold">{animatedValues.returnRate}%</p>
          </div>
        </div>
        <ToastContainer />
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded-md mb-4 w-full"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-md mb-4 w-full"
          >
            <option value="All">All Categories</option>
            {productCategory.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mt-6 overflow-auto">
          <h3 className="text-xl font-semibold mb-4">Products Overview</h3>
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Add Date</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="p-2 border truncate">{product.name}</td>
                  <td className="p-2 border">{product.category?.name || 'N/A'}</td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-white ${product.status === true ? 'bg-green-500' : 'bg-red-500'
                        }`}
                    >
                      {product.status === true ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2 border">{product.price}</td>
                  <td className="p-2 border truncate">{moment(product.created_at).fromNow()}</td>
                  <td className="p-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleModalOpen(product, 'view')}
                        className="bg-blue-500 text-white px-2 py-1 rounded-md"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleModalOpen(product, 'edit')}
                        className="bg-yellow-500 text-white px-2 py-1 rounded-md"
                      >
                        <CiEdit />
                      </button>
                      <button
                        onClick={() => handleModalOpen(product, 'delete')}
                        className="bg-red-500 text-white px-2 py-1 rounded-md"
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {selectedProduct && modalType === 'view' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-xl font-bold mb-4">Product Details</h2>
                <p><strong>Name:</strong> {selectedProduct.name}</p>
                <p><strong>Category:</strong> {selectedProduct.category?.name || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedProduct.status ? 'Active' : 'Inactive'}</p>
                <p><strong>Price:</strong> ${selectedProduct.price}</p>
                <p><strong>Created:</strong> {moment(selectedProduct.created_at).format('LLL')}</p>
                <div className="text-right mt-4">
                  <button onClick={handleModalClose} className="px-4 py-2 bg-gray-500 text-white rounded-md">Close</button>
                </div>
              </div>
            </div>
          )}

          {selectedProduct && modalType === 'edit' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                <form onSubmit={handleEditSubmit}>
                  <label className="block mb-2">
                    <span className="text-gray-700">Name</span>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="border w-full mb-2 p-2"
                      required
                    />
                  </label>

                  <label className="block mb-2">
                    <span className="text-gray-700">Price</span>
                    <input
                      type="number"
                      name="price"
                      value={editForm.price}
                      onChange={handleInputChange}
                      className="border w-full mb-2 p-2"
                      required
                    />
                  </label>

                  <label className="block mb-2">
                    <span className="text-gray-700">Status</span>
                    <input
                      type="checkbox"
                      name="status"
                      value={editForm.status}
                      onChange={handleInputChange}
                      className="border w-full mb-2 p-2"
                      required
                    />
                  </label>

                  <div className="flex justify-end space-x-2 mt-4">
                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">Save</button>
                    <button onClick={handleModalClose} type="button" className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {selectedProduct && modalType === 'delete' && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md w-96">
                <h2 className="text-xl font-bold mb-4 text-red-600">Confirm Delete</h2>
                <p>Are you sure you want to delete <strong>{selectedProduct.name}</strong>?</p>
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={() => {
                      // Your delete logic here
                      handleModalClose();
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </button>
                  <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
