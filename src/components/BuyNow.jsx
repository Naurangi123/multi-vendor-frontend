/* eslint-disable no-undef */
import React, { useState } from 'react';
import axios from 'axios';
import { useRazorpayScript } from './useRazorpayScript'; // from above hook

const BuyNow = ({ productId }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const razorpayScriptLoaded = useRazorpayScript();

  const handleBuyNow = async () => {
    if (!razorpayScriptLoaded) {
      alert("Razorpay SDK not loaded");
      return;
    }

    try {
      setLoading(true);
      // 1. Call BuyNow API to create cart item & Razorpay order
      const buyNowRes = await axios.post('/api/buy-now/', { product_id: productId, quantity });

      const { razorpay_order } = buyNowRes.data;

      // 2. Open Razorpay checkout
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // Your Razorpay key from env
        amount: razorpay_order.amount,
        currency: razorpay_order.currency,
        order_id: razorpay_order.id,
        name: "Your Store",
        description: "Buy Now Payment",
        handler: async function (response) {
          // 3. Verify payment at backend
          try {
            await axios.post('/api/verify-payment/', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            alert("Payment successful!");
            // Redirect to order confirmation or anywhere
          } catch (error) {
            alert("Payment verification failed.",error);
          }
        },
        prefill: {
          name: "", // fill from user info
          email: ""
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      setLoading(false);

    } catch (error) {
      setLoading(false);
      alert(error.response?.data?.error || "Buy Now failed.");
    }
  };

  return (
    <div>
      <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <button disabled={loading} onClick={handleBuyNow}>
        {loading ? "Processing..." : "Buy Now"}
      </button>
    </div>
  );
};

export default BuyNow;
