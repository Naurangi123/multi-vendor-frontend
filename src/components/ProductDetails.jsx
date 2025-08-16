import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GiReceiveMoney } from "react-icons/gi";
import { CiDeliveryTruck } from "react-icons/ci";
import { GiReturnArrow } from "react-icons/gi";
import { MdKeyboardBackspace } from "react-icons/md";
import { getProductDetail, addToCart, getRelatedProducts } from '../services/apiServices';
import { toast } from 'react-toastify';
import {useCart} from '../context/CartContext'
import { ACCESS_TOKEN } from '../constants';


const ProductDetail = () => {

  const { addItem } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetail = async (id) => {
      try {
        const data = await getProductDetail(id);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    if (id) fetchProductDetail(id);
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async (id) => {
      try {
        const related = await getRelatedProducts(id);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching related products:", error);
      }
    };
    if (id) fetchRelatedProducts(id);
  }, [id]);

  const handleCart = async () => {
    try {
      const product_id = product.id;
      const data = { product_id, quantity: 1 };

       if(!ACCESS_TOKEN){
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(data);
        localStorage.setItem("cart", JSON.stringify(cart));
      toast.success(`Added "${product.name}" to cart`);
      return;

       }
      await addToCart(data);
      addItem(product);

      toast.success(`${product.name} add to cart`)
      setTimeout(() => {
        navigate('/productCart')
      }, 1500)
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // const handlePayment = () => {
  //   navigate('/payment');
  // };

  if (!product) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="pr-3 pl-3 grid grid-cols-[3fr_2fr] lg:grid-cols-[4fr_1fr] gap-2">
        <div className="flex flex-row justify-between shadow-lg gap-2 w-full">
          <div>
            <img
              src={
                product?.images[0]?.image
                  ? `http://localhost:8005${product.images[0].image}`
                  : 'https://randomuser.me/api/portraits/med/men/26.jpg' // fallback image path
              }
              alt={product.name}
              className="h-96 object-cover"
              onError={(e) => {
                e.target.onerror = null; // prevent infinite loop
                e.target.src = 'https://randomuser.me/api/portraits/med/men/26.jpg';
              }}
            />

          </div>

          <div className="pl-4">
            <p className="text-3xl font-bold text-black mt-2">{product.description}</p>
            <h2 className="text-3xl mt-3 font-semibold">{product.name}</h2>
            <p className="text-xl font-bold text-red-900 mt-4">
              <span className="font-bold text-green-600">-30%</span> ₹{product.price}
            </p>
            <p className="text-sm text-red-500 line-through">
              M.R.P ₹{Math.round(product.price * 1.3)}
            </p>
            <p className="mt-2">
              Stock:{" "}
              {product.stock > 0 ? (
                "In Stock"
              ) : (
                <span className="font-bold text-green-600">Out of Stock</span>
              )}
            </p>
            <p className="text-gray-600 mt-2">Category: {product.category.name}</p>

            <div className="flex mt-3 space-x-4 text-gray-700">
              <div className="items-center space-x-1">
                <GiReceiveMoney className="text-2xl text-green-600" />
                <p className="text-sm font-medium">Cash on Delivery</p>
              </div>
              <div className="items-center space-x-1">
                <CiDeliveryTruck className="text-2xl text-blue-600" />
                <p className="text-sm font-medium">Free Delivery</p>
              </div>
              <div className="items-center space-x-1">
                <GiReturnArrow className="text-2xl text-red-600" />
                <p className="text-sm font-medium">Return</p>
              </div>
            </div>
            <p>Color:</p>
          </div>
        </div>

        <div className="shadow-lg w-full h-auto">
          <input
            type="text"
            placeholder="Delivery Address"
            className="w-full p-2 border rounded"
          />
          <div className="gap-4 mt-4">
            <button
              onClick={() => handleCart(product.id)}
              className="w-full mb-2 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Add to Cart
            </button>
            <button className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300">
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {/* Related Products */}
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4">Related Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {relatedProducts.map((rp) => (
            <div key={rp.id} className="bg-white rounded-lg shadow-md p-4 text-center">
              <img
                src={`http://localhost:8005${rp.images.image}`}
                alt={rp.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h4 className="text-lg font-semibold">{rp.name}</h4>
              <p className="text-green-600 font-medium">₹{rp.price}</p>
              <button
                onClick={() => navigate(`/product/${rp.id}`)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
