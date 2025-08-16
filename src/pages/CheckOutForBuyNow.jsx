/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { useRazorpayScript } from './useRazorpayScript';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [buyNowItems, setBuyNowItems] = useState([]);
  const [loading, setLoading] = useState(false);
  // const razorpayScriptLoaded = useRazorpayScript();

  useEffect(() => {
    axios.get('/api/carts/').then(res => {
      setCartItems(res.data.cart_items);
      setBuyNowItems(res.data.buy_now_items);
    });
  }, []);

  const handleCheckout = async () => {
    if (!razorpayScriptLoaded) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      setLoading(true);

      // 1. Create Order from backend
      const orderRes = await axios.post('/api/create-order/');

      const { razorpay_order, order } = orderRes.data;

      // 2. Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY,
        amount: razorpay_order.amount,
        currency: razorpay_order.currency,
        order_id: razorpay_order.id,
        name: "Your Store",
        description: "Order Payment",
        handler: async function (response) {
          try {
            await axios.post('/api/verify-payment/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment successful!");
            // Redirect or clear cart
          } catch {
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.error || "Checkout failed.");
    }
  };

  return (
    <div>
      <h2>Cart Items</h2>
      <ul>
        {cartItems.map(i => (
          <li key={i.product_id}>{i.name} x {i.quantity} - ₹{i.price}</li>
        ))}
      </ul>

      <h2>Buy Now Items</h2>
      <ul>
        {buyNowItems.map(i => (
          <li key={i.product_id}>{i.name} x {i.quantity} - ₹{i.price}</li>
        ))}
      </ul>

      <button disabled={loading || (cartItems.length + buyNowItems.length === 0)} onClick={handleCheckout}>
        {loading ? "Processing..." : "Checkout"}
      </button>
    </div>
  );
};

export default Checkout;
