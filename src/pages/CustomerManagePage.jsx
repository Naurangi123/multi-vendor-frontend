import { useState, useEffect, useMemo } from "react";

// Simulated API call stub
async function getCustomers() {
  return [
    {
      id: 1,
      username: "john_doe",
      email: "john@example.com",
      role: "customer",
      orders: [
        { id: 101, total: 250.0, status: "delivered", date: "2025-05-01" },
        { id: 102, total: 75.5, status: "pending", date: "2025-05-10" },
      ],
      active: true,
    },
    {
      id: 2,
      username: "jane_smith",
      email: "jane@example.com",
      role: "customer",
      orders: [
        { id: 103, total: 120, status: "shipped", date: "2025-04-20" },
      ],
      active: false,
    },
    // ...more customers
  ];
}

// Helper for CSV export
function exportToCSV(customers) {
  const headers = ["ID", "Username", "Email", "Role", "Orders Count", "Active"];
  const rows = customers.map((c) => [
    c.id,
    c.username,
    c.email,
    c.role,
    c.orders.length,
    c.active ? "Yes" : "No",
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "customers.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("username");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activeMap, setActiveMap] = useState({}); // track active/disabled per customer locally

  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      // Initialize activeMap
      const map = {};
      data.forEach((c) => (map[c.id] = c.active));
      setActiveMap(map);
    });
  }, []);

  // Filter by search term
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  // Sort filtered customers
  const sortedCustomers = useMemo(() => {
    return filteredCustomers.sort((a, b) => {
      let valA, valB;
      if (sortBy === "username") {
        valA = a.username.toLowerCase();
        valB = b.username.toLowerCase();
      } else if (sortBy === "orders") {
        valA = a.orders.length;
        valB = b.orders.length;
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortBy, sortOrder]);

  // Pagination slice
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedCustomers.slice(start, start + pageSize);
  }, [sortedCustomers, page, pageSize]);

  // Number of pages
  const totalPages = Math.ceil(sortedCustomers.length / pageSize);

  function toggleActive(id) {
    setActiveMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  function changeSort(field) {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Customers</h2>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded w-full sm:w-64"
          />
          <button
            onClick={() => exportToCSV(sortedCustomers)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                  onClick={() => changeSort("username")}
                >
                  Username
                  {sortBy === "username" && (
                    <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                  onClick={() => changeSort("orders")}
                >
                  Orders
                  {sortBy === "orders" && (
                    <span>{sortOrder === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Active
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => (
                  <tr key={cust.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{cust.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cust.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{cust.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{cust.orders.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <input
                        type="checkbox"
                        checked={activeMap[cust.id]}
                        onChange={() => toggleActive(cust.id)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(cust)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-3 py-1 rounded border ${
              page === 1 ? "cursor-not-allowed text-gray-400" : "hover:bg-gray-200"
            }`}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border ${
              page === totalPages
                ? "cursor-not-allowed text-gray-400"
                : "hover:bg-gray-200"
            }`}
          >
            Next
          </button>
        </div>

        {/* Customer Detail Modal */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-lg font-bold"
                aria-label="Close"
              >
                ×
              </button>
              <h3 className="text-xl font-semibold mb-4">{selectedCustomer.username}'s Orders</h3>
              {selectedCustomer.orders.length > 0 ? (
                <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
                  {selectedCustomer.orders.map((order) => (
                    <li key={order.id} className="py-2 flex justify-between">
                      <span>Order #{order.id} - {order.status}</span>
                      <span>₹{order.total.toFixed(2)}</span>
                      <span className="text-gray-500">{order.date}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No orders found for this customer.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
