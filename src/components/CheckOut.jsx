import React, { useState, useContext, useEffect } from 'react';
import { FaTrashAlt, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import { fetchUserAddresses } from '../services/apiServices'


const Checkout = () => {

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addressLoading, setAddressLoading] = useState(true);
  
  const [newAddressDataFrom, setNewAddressDataFrom] = useState(false);



  const { user } = useContext(UserContext);

  console.log("user Details", user)

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      name: 'Smartwatch Series X',
      price: 249,
      quantity: 1,
      image: 'https://via.placeholder.com/80',
    },
  ]);
  
  const [coupon, setCoupon] = useState('');
  const [shipping, setShipping] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');



  const [newAddressData, setNewAddressData] = useState({
    address: '',
    city: '',
    state: '',
    zip_code: '',
    phone_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

  };

  
  
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingFee = shipping === 'express' ? 25 : 10;
  const discount = coupon === 'SAVE10' ? 10 : 0;
  const grandTotal = totalAmount + shippingFee - discount;

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

    console.log('newAddressDataFrom:', newAddressDataFrom);
console.log('newAddressData:', newAddressData);
  const handleCheckout = async () => {
    if (paymentMethod !== 'razorpay') {
      alert('Currently only Razorpay payment is integrated.');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet connection.');
      return;
    }

    const options = {
      key: 'YOUR_RAZORPAY_KEY_ID', // <-- Replace with your Razorpay Key
      amount: grandTotal * 100, // amount in paise
      currency: 'INR',
      name: 'My E-commerce Store',
      description: 'Order Payment',
      image: 'https://via.placeholder.com/50',
      handler: function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        console.log(response);
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Shipping address here',
      },
      theme: {
        color: '#4F46E5', // Indigo-600
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };


  const getAddresses = async () => {
    try {
      const data = await fetchUserAddresses();
      setAddresses(data);
      if (data.length > 0) {
        setSelectedAddressId(data[0].id);
      } else {
        setShowAddressForm(true);
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
      setShowAddressForm(true);
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
  }, []);

  const handleAddressChange = (address) => {
    setAddressData((prevData) => ({
      ...prevData,
      address: address.route,
      city: address.locality,
      state: address.administrative_area_level_1,
      country: address.country,
      zipCode: address.postal_code,
    }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <div className="text-sm text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </div>
                </div>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <input
              type="text"
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded-md mb-2"
            />
            {coupon && (
              <div className={`text-sm ${coupon === 'SAVE10' ? 'text-green-600' : 'text-red-500'}`}>
                {coupon === 'SAVE10' ? 'Coupon applied!' : 'Invalid coupon'}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shippingFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg mt-2 border-t pt-2">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Shipping & Payment</h2>
          <form className="space-y-6 m-1" onSubmit={(e) => e.preventDefault()}>
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivering to</label>
              <input
                type="text"
                placeholder="123 Main St, City, Country"
                className="w-full mt-1 px-4 py-2 border rounded-md"
                required
              />
            </div>

            {/* Address Autocomplete */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <GoogleAutoComplete
                apiKey="YOUR_GOOGLE_API_KEY"
                onPlaceSelect={handleAddressChange}
                required
              />
            </div> */}

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                placeholder="Phone Number"
                 
                className="w-full mt-1 px-4 py-2 border rounded-md"
                required
              />
            </div>
            {/* Pay Button */}
            <button
              type="button"
              onClick={() => setNewAddressDataFrom(!newAddressDataFrom)}
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700"
            >  {newAddressDataFrom ? ' Add Address' : 'Add Address'}
              
            </button>
          </form>
          {/* Don't touch it */}
          <form className="space-y-6 mt-2" onSubmit={(e) => e.preventDefault()}>
            {/* Shipping Options */}
            <hr  className='border border-bg-500'/>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="standard"
                    checked={shipping === 'standard'}
                    onChange={() => setShipping('standard')}
                  />
                  <span>Standard (3-5 days) - ₹10</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="express"
                    checked={shipping === 'express'}
                    onChange={() => setShipping('express')}
                  />
                  <span>Express (1-2 days) - ₹25</span>
                </label>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <div className="flex gap-4 text-3xl">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('visa')}
                  className={paymentMethod === 'visa' ? 'text-blue-600' : 'text-gray-400'}
                  aria-label="Visa"
                >
                  <FaCcVisa />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mastercard')}
                  className={paymentMethod === 'mastercard' ? 'text-red-600' : 'text-gray-400'}
                  aria-label="Mastercard"
                >
                  <FaCcMastercard />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={paymentMethod === 'paypal' ? 'text-yellow-600' : 'text-gray-400'}
                  aria-label="Paypal"
                >
                  <FaCcPaypal />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={paymentMethod === 'razorpay' ? 'text-green-600 font-bold' : 'text-gray-400'}
                  aria-label="Razorpay"
                >
                  R
                </button>
              </div>
              {paymentMethod !== 'razorpay' && (
                <input
                  type="text"
                  placeholder="Card Number"
                  className="mt-3 w-full px-4 py-2 border rounded-md"
                />
              )}
            </div>

            {/* Order Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Notes</label>
              <textarea
                rows="3"
                placeholder="Any additional information for delivery?"
                className="w-full mt-1 px-4 py-2 border rounded-md"
              />
            </div>

            {/* Pay Button */}
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-bold hover:bg-indigo-700"
            >
              {paymentMethod === 'razorpay' ? `Pay with Razorpay ₹${grandTotal}` : `Pay ₹${grandTotal}`}
            </button>
          </form>
        </div>
      </div>

      {newAddressDataFrom && (
        <form className="space-y-4 mt-4"  >
          <div>
            <label>Flat, House no., Village, Building, Company, Apartment</label>
            <input
              type="text"
              name="address"
              value={newAddressData.address}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Flat, House no., Building, Company, Apartment"
              required
            />
          </div>
          <div>
            <label>Area, Street, Sector, Village, City</label>
            <input
              type="text"
              name="city"
              value={newAddressData.city}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Enter City"
              required
            />
          </div>
          <div>
            <label>State</label>
            <input
              type="text"
              name="state"
              value={newAddressData.state}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Enter State"
              required
            />
          </div>
          <div>
            <label>Pin code</label>
            <input
              type="text"
              name="zip_code"
              value={newAddressData.zip_code}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Enter the pin code"
              required
            />
          </div>
          <div>
            <label>Contact No</label>
            <input
              type="text"
              name="phone_number"
              value={newAddressData.phone_number}
              onChange={handleChange}
              className="w-full mt-2 p-2 border border-gray-300 rounded"
              placeholder="Contact Number"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Address
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
