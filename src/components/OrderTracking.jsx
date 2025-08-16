import { useState, useEffect } from "react";
import { getOrders } from "../services/apiServices";

function calculateTotalAmount(items) {
    return items.reduce((sum, item) => sum + item.total_price, 0).toFixed(2);
}

export default function OrderTracking() {
    const [expandedOrderIds, setExpandedOrderIds] = useState(() => {
        const stored = localStorage.getItem("expandedOrders");
        return stored ? JSON.parse(stored) : [];
    });

    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        localStorage.setItem("expandedOrders", JSON.stringify(expandedOrderIds));
    }, [expandedOrderIds]);

    const fetchOrders = async () => {
        try {
            const data = await getOrders();
            setOrdersData(data);
        } catch (error) {
            console.error(error);
        }
    };

    const toggleExpand = (orderId) => {
        setExpandedOrderIds((prev) =>
            prev.includes(orderId)
                ? prev.filter((id) => id !== orderId)
                : [...prev, orderId]
        );
    };

    const orders = ordersData.map((order) => {
        const shipping = order.shipping_address;
        return {
            rawId: order.id,
            id: `ORD${order.id}`,
            status: order.status?.charAt(0).toUpperCase() + order.status?.slice(1),
            expectedDelivery: new Date(
                new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
            )
                .toISOString()
                .slice(0, 10),
            lastUpdate: order.created_at?.slice(0, 10),
            items: order.items.map(
                (item) => `${item.product.name} (x${item.quantity})`
            ),
            shippingAddress: shipping
                ? `${shipping.address}, ${shipping.city}, ${shipping.state}, ${shipping.zip_code}, ${shipping.country}`
                : "Shipping address not available",
            totalAmount: `₹${calculateTotalAmount(order.items)}`,
        };
    });

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Your Orders
                </h1>

                <div className="grid gap-4">
                    {orders.map((order) => {
                        const isExpanded = expandedOrderIds.includes(order.rawId);
                        return (
                            <div
                                key={order.rawId}
                                onClick={() => toggleExpand(order.rawId)}
                                className={`bg-white shadow cursor-pointer rounded-lg border transition-all duration-300 ${
                                    isExpanded ? "border-blue-400" : "border-gray-200"
                                }`}
                            >
                                <div className="p-4 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-700">
                                            Order ID: {order.id}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Status:{" "}
                                            <span className="font-medium">
                                                {order.status}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Expected Delivery: {order.expectedDelivery}
                                        </p>
                                    </div>
                                    <div className="text-blue-600 text-sm font-medium">
                                        {isExpanded ? "▲ Hide" : "▼ View Details"}
                                    </div>
                                </div>
                                <div
                                    className={`transition-all duration-300 overflow-hidden ${
                                        isExpanded ? "max-h-[500px] p-4 pt-0" : "max-h-0"
                                    }`}
                                >
                                    <div className="text-sm text-gray-700 border-t pt-4">
                                        <p>
                                            <strong>Last Updated:</strong>{" "}
                                            {order.lastUpdate}
                                        </p>
                                        <p>
                                            <strong>Total Amount:</strong>{" "}
                                            {order.totalAmount} with GST
                                        </p>
                                        <p>
                                            <strong>Shipping Address:</strong>{" "}
                                            {order.shippingAddress}
                                        </p>
                                        <p className="mt-2 font-semibold">Items:</p>
                                        <ul className="list-disc list-inside">
                                            {order.items.map((item, index) => (
                                                <li key={index}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
