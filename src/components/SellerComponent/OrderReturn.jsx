// ReturnComponent.jsx
import React from 'react';

const returnData = {
  orderId: 'OD123456789',
  product: {
    name: 'boAt Rockerz 255 Bluetooth Headset',
    image: 'https://m.media-amazon.com/images/I/61E07fCBw+L._AC_SL1500_.jpg',
    price: '₹1,299',
  },
  status: 'Return Picked Up',
  returnDate: '2025-06-08',
};

const ReturnComponent = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow rounded-lg border border-gray-200">
      <div className="flex gap-4">
        <img src={returnData.product.image} alt={returnData.product.name} className="w-20 h-20 object-cover rounded" />
        <div>
          <h2 className="text-lg font-semibold">{returnData.product.name}</h2>
          <p className="text-sm text-gray-600">Order ID: {returnData.orderId}</p>
          <p className="text-sm font-medium text-green-600">{returnData.status}</p>
        </div>
      </div>
      <div className="mt-4 border-t pt-2 text-sm text-gray-700">
        <p>Returned on: <span className="font-semibold">{returnData.returnDate}</span></p>
        <p>Amount: <span className="font-semibold">{returnData.product.price}</span></p>
      </div>
    </div>
  );
};

export default ReturnComponent;
