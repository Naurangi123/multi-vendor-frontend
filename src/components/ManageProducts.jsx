import React, { useState, useEffect } from 'react';
import { getProductBySeller } from '../services/apiServices';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { CiEdit } from "react-icons/ci";
import { IoTrashOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const ITEMS_PER_PAGE = 7;

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const handleModalOpen = (product, type) => {
    setSelectedProduct(product);
    setModalType(type);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
    setModalType(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductBySeller();
        const productsArray = Array.isArray(data) ? data : data.products || data.results || [];
        const productsWithImages = productsArray.map(product => ({
          ...product,
          primaryImage: product.images?.[0]?.image ?? null,
        }));
        setProducts(productsWithImages);
      } catch (error) {
        toast.error(error.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update product');
      const updatedProduct = await response.json();

      setProducts(prev => prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
      toast.success('Product updated successfully');
      handleModalClose();
    } catch (error) {
      toast.error('Failed to update product',error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/${selectedProduct.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      toast.success('Product deleted');
      handleModalClose();
    } catch (error) {
      toast.error('Delete failed',error);
    }
  };

  useEffect(() => {
    if (selectedProduct && modalType === 'edit') {
      setEditForm({
        name: selectedProduct.name || '',
        price: selectedProduct.price || '',
      });
    }
  }, [selectedProduct, modalType]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const changePage = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="p-2 max-w-7xl mx-auto">
      <ToastContainer />
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
      </div>
      <input
        type="text"
        placeholder="Search products..."
        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <div className="text-center text-gray-600">Loading products...</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white text-sm">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map(product => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={`http://localhost:8005${product.primaryImage}`}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">₹{product.price}</td>
                    <td className="p-3">{product.stock}</td>
                    <td className="p-3">{product.category?.name || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => handleModalOpen(product, 'view')} className="text-blue-600 hover:text-blue-800"><FaEye /></button>
                      <button onClick={() => handleModalOpen(product, 'edit')} className="text-yellow-600 hover:text-yellow-800"><CiEdit /></button>
                      <button onClick={() => handleModalOpen(product, 'delete')} className="text-red-600 hover:text-red-800"><IoTrashOutline /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && (
              <div className="p-4 text-center text-gray-500">No products found.</div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center space-x-2">
              <button onClick={() => changePage(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === 1}>Prev</button>
              {[...Array(totalPages).keys()].map(n => (
                <button
                  key={n}
                  onClick={() => changePage(n + 1)}
                  className={`px-3 py-1 border rounded ${currentPage === n + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                >
                  {n + 1}
                </button>
              ))}
              <button onClick={() => changePage(currentPage + 1)} className="px-3 py-1 border rounded disabled:opacity-50" disabled={currentPage === totalPages}>Next</button>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedProduct && (
        <Modal onClose={handleModalClose}>
          <h2 className="text-xl font-bold mb-4">Product Details</h2>
          <p><strong>Name:</strong> {selectedProduct.name}</p>
          <img
            src={`http://localhost:8005${selectedProduct.primaryImage}`}
            alt={selectedProduct.name}
            className="w-20 h-20 object-cover rounded"
          />
          <p><strong>Category:</strong> {selectedProduct.category?.name}</p>
          <p><strong>Status:</strong> {selectedProduct.status ? 'Active' : 'Inactive'}</p>
          <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
          <p><strong>Created:</strong> {moment(selectedProduct.created_at).format('LLL')}</p>
        </Modal>
      )}

      {/* Edit Modal */}
      {modalType === 'edit' && selectedProduct && (
        <Modal onClose={handleModalClose}>
          <h2 className="text-xl font-bold mb-4">Edit Product</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-3">
              <label className="block mb-1 text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                value={editForm.price}
                onChange={handleInputChange}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Modal */}
      {modalType === 'delete' && selectedProduct && (
        <Modal onClose={handleModalClose}>
          <h2 className="text-xl font-bold text-red-600 mb-4">Confirm Delete</h2>
          <p>Are you sure you want to delete <strong>{selectedProduct.name}</strong>?</p>
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">Delete</button>
            <button onClick={handleModalClose} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-md shadow-lg p-6 w-100 relative">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">&times;</button>
      {children}
    </div>
  </div>
);

export default ManageProductsPage;
