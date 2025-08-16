import React, { useState } from "react";

const initialOrders = [
  {
    orderId: "ORD123456",
    date: "2025-06-08",
    customer: "John Doe",
    products: [
      {
        id: 1,
        name: "Wireless Mouse",
        quantity: 2,
        status: "Processing",
        lastUpdated: "2025-06-08 10:15",
      },
      {
        id: 2,
        name: "Mechanical Keyboard",
        quantity: 1,
        status: "Processing",
        lastUpdated: "2025-06-08 10:15",
      },
    ],
  },
  {
    orderId: "ORD123457",
    date: "2025-06-07",
    customer: "Alice Smith",
    products: [
      {
        id: 3,
        name: "USB-C Charger",
        quantity: 1,
        status: "Delivered",
        lastUpdated: "2025-06-09 12:00",
      },
      {
        id: 4,
        name: "Laptop Stand",
        quantity: 1,
        status: "Delivered",
        lastUpdated: "2025-06-09 12:00",
      },
    ],
  },
];

const statusOptions = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusColors = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);

  const handleStatusChange = (orderId, productId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.orderId !== orderId) return order;

        const updatedProducts = order.products.map((product) => {
          if (product.id !== productId) return product;

          // If product is already delivered or cancelled, no change allowed
          if (product.status === "Delivered" || product.status === "Cancelled") {
            return product;
          }

          // Only allow cancelling if not delivered yet
          if (newStatus === "Cancelled" && product.status === "Delivered") {
            return product;
          }

          return {
            ...product,
            status: newStatus,
            lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
          };
        });

        return { ...order, products: updatedProducts };
      })
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-8">Order Management</h1>

      {orders.map((order) => (
        <div
          key={order.orderId}
          className="border border-gray-300 rounded-md mb-8 p-5"
        >
          <header className="flex justify-between items-center mb-5">
            <div>
              <h2 className="font-semibold text-xl">Order: {order.orderId}</h2>
              <p className="text-gray-600 text-sm">
                Date: {order.date} | Customer: {order.customer}
              </p>
            </div>
          </header>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-gray-400">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {order.products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.quantity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          statusColors[product.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{product.lastUpdated}</td>
                    <td className="py-3 px-4 space-x-3">
                      {/* Status dropdown */}
                      {(product.status !== "Delivered" && product.status !== "Cancelled") && (
                        <select
                          value={product.status}
                          onChange={(e) =>
                            handleStatusChange(order.orderId, product.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {statusOptions
                            .filter((status) =>
                              status !== "Cancelled" || product.status !== "Delivered"
                            )
                            .map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                        </select>
                      )}

                      {/* Cancel button if not delivered or cancelled */}
                      {product.status !== "Delivered" && product.status !== "Cancelled" && (
                        <button
                          onClick={() =>
                            handleStatusChange(order.orderId, product.id, "Cancelled")
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition"
                          title="Cancel this product"
                        >
                          Cancel
                        </button>
                      )}
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
