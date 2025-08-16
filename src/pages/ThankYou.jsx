import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

const ThankYou = ({ orderNumber, customerName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Thank You, {customerName || 'Customer'}!</h2>
        <p className="text-gray-600 mb-6">Your payment was successful.</p>

        <div className="bg-gray-100 rounded-md p-4 mb-6 text-left">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="font-medium text-gray-800">{orderNumber || '1234567890'}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/order-track"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            View Order
          </a>
          <a
            href="/shop"
            className="inline-block w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-md hover:bg-gray-200 transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
