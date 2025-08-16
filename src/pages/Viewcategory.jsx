import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'
import { toast, ToastContainer } from 'react-toastify';
import logo from '../assets/react.svg'
import '../assets/CSS/Viewcategory.css'
import { MdKeyboardBackspace } from "react-icons/md";
import { UserContext } from '../context/UserContext';
import { ACCESS_TOKEN } from '../constants';
import { getCategories,getCurrentLocationDetails } from '../services/apiServices';
// const categories = [
//   { label: 'Select a category', value: '' },
//   { label: 'Electronics', value: 'electronics' },
//   { label: 'Books', value: 'books' },
//   { label: 'Grocery', value: 'grocery' },
//   { label: 'Fashion Clothes', value: 'fashion' },
// ];

const Viewcategory = () => {
  const { category } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([])
  const [location, setLocation] = useState([])
  // const [selectedProduct, setSelectedProduct] = useState(null);

  const { addToCart } = useCart();


  const handleAddToCart = async (product) => {
    const access = sessionStorage.getItem(ACCESS_TOKEN);
    const username = user?.username || 'Guest';

    if (!access) {
      toast.error('Please log in to add items to the cart.');
      return;
    }

    const productData = {
      product_id: product.id,
      username: username,
    };

    try {
      const response = await fetch('http://localhost:8005/api/carts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access}`,
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Item Add to Cart")
        addToCart(product);

        toast.success(data.message);

        console.log("cart data", data);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Something went wrong. Try again.');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data)
    } catch (error) {
      toast.error(error)
    }
  }

  const fetchLocation = async () => {
    try {
      const data = await getCurrentLocationDetails();
      setLocation(data)
    } catch (error) {
      toast.error(error)
    }
  }


  const fetchProducts = async (selectedCategory) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:8005/api/category/${selectedCategory}`);
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error('Error fetching category products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation()
    fetchCategories()
    if (category) {
      fetchProducts(category);
    }
  }, [category]);


  // useEffect(() => {
  //   getCurrentLocationDetails()
  //     .then(location => {
  //       console.log('Location:', location); 
  //     })
  //     .catch(error => {
  //       console.error('Location error:', error);
  //     });
  // }, []);

  console.log("location",location)
  console.log("location",location.city)




  // const handleSelectProduct = () => {
  //   setSelectedProduct(product);
  // };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    if (selected) {
      navigate(`/category/${selected}`);
    }
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6">
        <ToastContainer />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0 flex items-center gap-2">
            Products in:
            <span className="capitalize text-blue-600">{category || 'Select a category'}</span>
            <MdKeyboardBackspace
              onClick={() => navigate('/shop')}
              className="text-2xl cursor-pointer text-gray-500 hover:text-blue-600 transition"
            />
          </h2>
          <select
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={category || ''}
            onChange={handleCategoryChange}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.value}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-4">
            {loading ? (
              <p className="text-center text-gray-500">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-gray-500">No products found in this category.</p>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="cursor-pointer flex bg-white rounded border border-gray-200 hover:shadow-md transition duration-300"
                >
                  {/* Product Image */}
                  <img
                    src={
                      product.images?.length > 0
                        ? `http://localhost:8005${product.images[0].image}`
                        : `https://via.placeholder.com/200x200.png?text=No+Image`
                    }
                    alt={product.name}
                    className="w-80 object-contain p-4"
                    loading="lazy"
                  />

                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <h1 className="text-3xl text-gray-900 font-semibold mt-1 line-clamp-2">
                        {product.description}
                      </h1>
                      <h3 className="text-lg font-medium text-gray-950 hover:underline">
                        {product.name}
                      </h3>
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => {
                          const fullStars = Math.floor(product.rating);
                          const decimal = product.rating - fullStars;
                          let starType = 'empty';
                          if (i < fullStars) starType = 'full';
                          else if (i === fullStars && decimal >= 0.25 && decimal < 0.75) starType = 'half';

                          return (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${starType !== 'empty' ? 'text-yellow-500' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              {starType === 'half' ? (
                                <path d="M10 15l-5.878 3.09L5.804 12 1 7.91l6.09-.89L10 1l2.91 6.02L19 7.91 14.196 12l1.682 6.09zM10 13.75V3.6l-1.41 3.02-3.33.49 2.41 2.35-.57 3.31L10 13.75z" />
                              ) : (
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0L12.347 6.3l3.682.535c.969.141 1.356 1.33.654 2.013l-2.665 2.6.63 3.674c.165.96-.85 1.688-1.707 1.237L10 15.347l-3.29 1.73c-.857.451-1.872-.277-1.707-1.237l.63-3.674L2.97 8.848c-.703-.683-.315-1.872.654-2.013l3.682-.535L9.049 2.927z" />
                              )}
                            </svg>
                          );
                        })}
                        <span className="ml-2 text-gray-600 text-sm">({product.rating})</span>
                      </div>
                      <p
                        className={`text-sm font-medium mt-1 ${product.stock > 10
                          ? 'text-green-600'
                          : product.stock > 0
                            ? 'text-orange-500'
                            : 'text-red-600'
                          }`}
                      >
                        {product.stock > 10
                          ? 'In stock'
                          : product.stock > 0
                            ? `Only ${product.stock} left in stock`
                            : 'Out of stock'}
                      </p>
                      <p className="text-green-600 text-md font-medium mt-1">FREE Delivery</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Ships from <span className="font-medium">{location.city} - {location.country}</span>, Sold by{' '}
                        <span className="font-medium">{product.seller?.name}</span>
                      </p>
                      <div className="flex items-center mt-1 space-x-1">
                        <img src={logo} alt="Prime" className="h-4" />
                        <span className="text-sm text-blue-600 font-medium">Fatse</span>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-row items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">₹ {product.price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-sm font-medium text-black rounded"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Viewcategory;
