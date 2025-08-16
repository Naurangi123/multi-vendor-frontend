import React, { useState, useEffect, useContext, Suspense } from 'react';
import 'chart.js/auto';
import { getProduct, getSellerOrders, getVendors } from '../services/apiServices';
import { ToastContainer, toast } from 'react-toastify';
import { FcManager } from 'react-icons/fc';
import { CiEdit } from 'react-icons/ci';
import { UserContext } from '../context/UserContext';
import Multifrom from '../Elements/Multifrom';

 

const VendorProfile = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const date = new Date();
  const [vendors, setVendor] = useState([]);
  
  const formattedDate = date.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProduct();
        console.log('Fetched product data:', data);

        const productsArray = Array.isArray(data) ? data : data.products || data.results || [];

        const productsWithImages = productsArray.map(product => ({
          ...product,
          primaryImage: product.images?.[0]?.image ?? null,
        }));

        setProducts(productsWithImages);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error(error.message || 'Failed to fetch products');
      }
    };

    const fetchOrders = async () => {
      try {
        const data = await getSellerOrders();
        setOrders(data);
      } catch (error) {
        toast.error(`Failed to fetch orders: ${error.message || error}`);
      }
    };

    const fetchVendorData = async () => {
      try {
        const data = await getVendors();
        setVendor(data.vendor);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      }
    };

    fetchProducts();
    fetchOrders();
    fetchVendorData();
  }, []);

   

  return (

    <>
    <div className="space-y-12 bg-gray-100 text-gray-800">
      <ToastContainer />

      {/* Profile and Orders Side-by-Side */}
      <div className="flex flex-col lg:flex-row gap-6 p-4">

        {/* Vendor Profile Card */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
  <div className="flex items-center space-x-4">
    <FcManager className="w-24 h-24 text-indigo-600" />
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">{vendors?.user?.username}</h1>
      <p className="text-sm text-gray-500">Email: {vendors?.user?.email}</p>
      <p className="text-sm text-gray-500">Phone: {vendors?.phone_no}</p>
      <p className="text-sm text-gray-500">Add: {vendors?.address}</p>
      
    </div>
  </div> <p className="text-sm text-gray-500">{formattedDate}</p>

  <div className="mt-4">
    <h2 className="text-lg font-medium text-gray-700">Store: {vendors?.business_name}</h2>
  </div>

  <button
    className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    onClick={() => setIsVisible(!isVisible)}
  >
    {isVisible ? 'Hide Profile' : 'Complete Profile'}
  </button>
</section>

        {/* Orders Card */}
        <section className="flex-1 bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-bold mb-4">Orders</h2>
          {orders.length > 0 ? (
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {orders.map((order) => {
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
                    <h3 className="text-xl font-semibold mb-2 truncate">{order.product_name}</h3>
                    <ul className="text-gray-700 space-y-1">
                      <li>
                        <strong>Total Quantity Sold:</strong> {order.total_quantity_sold}
                      </li>
                      <li>
                        <strong>Total Revenue:</strong> {order.total_revenue}
                      </li>
                      <li>
                        <strong>Total Orders:</strong>{order.total_orders}
                      </li>
                    </ul>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600">No Orders Available</p>
          )}
        </section>
      </div>

     

      {/* Product List */}
      {user?.role === 'vendor' && (
        <section className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Product List</h2>
          <button className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
            Add Product
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition duration-300"
              >
                {prod.primaryImage && (
                  <img
                    src={`http://localhost:8005${prod.primaryImage}`}
                    alt="Product"
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <ul className="text-sm space-y-1">
                  <li><strong>ID:</strong> {prod.id}</li>
                  <li><strong>Name:</strong> {prod.name}</li>
                  <li><strong>Stock:</strong> {prod.stock}</li>
                  <li><strong>Price:</strong> ₹{prod.price}</li>
                </ul>
                <div className="mt-3 space-x-2">
                  <button className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm">
                    Edit
                  </button>
                  <button className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
        {isVisible && (
    <div className="mt-4">
       <Multifrom/>
    </div>
  )}
 
    </div>
    </>

  );
};

export default VendorProfile;

