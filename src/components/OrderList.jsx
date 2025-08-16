import React, { useEffect, useState } from "react";
import axios from "axios";
import { ACCESS_TOKEN } from "../constants";

const getStatusStyles = (status) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "returned":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8005/api/sellers-orders/", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`,
        },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusClasses = getStatusStyles(order.status);
            return (
              <div
                key={order.id}
                className={`flex justify-between items-center p-4 rounded-lg shadow-sm ${statusClasses}`}
              >
                <div>
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <p className="capitalize">Status: {order.status}</p>
                </div>
                <span className="font-medium">{order.total_price}</span>
              </div>
            );
          })}
        </div>
        
      </div>
    </div>
  );
};

export default OrderList;
