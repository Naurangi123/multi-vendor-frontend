import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/orders/${orderId}/`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
    })
    .then((response) => setOrder(response.data))
    .catch((error) => console.error(error));
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {order ? (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800">Order #{order.id}</h2>
          <div className="space-y-4 mt-4">
            <p className="text-gray-600">Status: {order.status}</p>
            <p className="text-gray-600">Total: ${order.total_price}</p>
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-800">Ordered Items</h3>
              <ul className="space-y-2">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.product_name}</span>
                    <span>${item.price}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
