import React, { useState } from 'react';

const PaymentPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'card',
    shippingMethod: 'standard',
  });

  const [cart] = useState([
    { id: 1, name: 'Wireless Headphones', price: 129.99, quantity: 1 },
    { id: 2, name: 'Bluetooth Speaker', price: 49.99, quantity: 2 },
  ]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const placeOrder = () => {
    if (!form.name || !form.email || !form.address || !form.phone) {
      alert('Please fill all billing details.');
      return;
    }

    // In real use case, send order details to backend here
    alert('Order placed successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center">Checkout</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Billing Details */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Billing Information</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border p-2 rounded-md"
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border p-2 rounded-md"
            />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full border p-2 rounded-md"
            />
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Shipping Address"
              className="w-full border p-2 rounded-md"
              rows="3"
            />

            {/* Shipping Method */}
            <div>
              <label className="font-semibold block mb-1">Shipping Method</label>
              <select
                name="shippingMethod"
                value={form.shippingMethod}
                onChange={handleChange}
                className="w-full border p-2 rounded-md"
              >
                <option value="standard">Standard - Free</option>
                <option value="express">Express - ₹10</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label className="font-semibold block mb-1">Payment Method</label>
              <div className="flex flex-col gap-2">
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={form.paymentMethod === 'card'}
                    onChange={handleChange}
                  />{' '}
                  Credit/Debit Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={form.paymentMethod === 'upi'}
                    onChange={handleChange}
                  />{' '}
                  UPI
                </label>
                <label>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={form.paymentMethod === 'cod'}
                    onChange={handleChange}
                  />{' '}
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <ul className="divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="mt-6 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
