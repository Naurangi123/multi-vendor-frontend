import React from "react";

const mockOrders = [
  {
    orderId: "ORD123456",
    date: "2025-06-08",
    customer: "John Doe",
    products: [
      { id: 1, name: "Wireless Mouse", quantity: 2, status: "Shipped" },
      { id: 2, name: "Mechanical Keyboard", quantity: 1, status: "Processing" },
    ],
  },
  {
    orderId: "ORD123457",
    date: "2025-06-07",
    customer: "Alice Smith",
    products: [
      { id: 3, name: "USB-C Charger", quantity: 1, status: "Delivered" },
      { id: 4, name: "Laptop Stand", quantity: 1, status: "Delivered" },
    ],
  },
  {
    orderId: "ORD123458",
    date: "2025-06-09",
    customer: "Bob Johnson",
    products: [
      { id: 5, name: "Gaming Headset", quantity: 1, status: "Cancelled" },
      { id: 6, name: "Webcam HD", quantity: 2, status: "Processing" },
    ],
  },
];

// Helper to get badge colors based on status
const statusColors = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function SellerOrderTracking() {
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-semibold mb-6">Seller Order Tracking</h1>
      {mockOrders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-200 rounded-md mb-6 p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="font-semibold text-lg">Order ID: {order.orderId}</h2>
              <p className="text-sm text-gray-600">Date: {order.date}</p>
              <p className="text-sm text-gray-600">Customer: {order.customer}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="py-2 px-3">Product</th>
                  <th className="py-2 px-3">Quantity</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100">
                    <td className="py-2 px-3">{product.name}</td>
                    <td className="py-2 px-3">{product.quantity}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[product.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
