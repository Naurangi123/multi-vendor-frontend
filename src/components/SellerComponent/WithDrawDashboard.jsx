import React, { useState } from "react";
import { HiDownload } from "react-icons/hi";
import { FaArrowCircleDown } from "react-icons/fa";

const mockTransactions = [
  { date: "2025-06-01", desc: "Product Sale", type: "credit", amount: 1200 },
  { date: "2025-06-03", desc: "Commission Fee", type: "debit", amount: 120 },
  { date: "2025-06-05", desc: "Withdrawal", type: "debit", amount: 800 },
];

const upcomingPayouts = [
  { date: "2025-06-15", amount: 2500 },
  { date: "2025-06-30", amount: 3000 },
];

const WalletDashboard = () => {
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleWithdraw = () => {
    if (!withdrawAmount) return alert("Enter amount");
    alert(`Withdrawal request submitted for ₹${withdrawAmount}`);
    setWithdrawAmount("");
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Wallet & Payouts</h2>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Wallet Balance</p>
          <h4 className="text-2xl font-bold text-green-600">₹ 5,800</h4>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <h4 className="text-2xl font-bold">₹ 72,400</h4>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-500">Commission Deducted</p>
          <h4 className="text-2xl font-bold text-red-500">₹ 7,240</h4>
        </div>
      </div>

      {/* Withdraw Request */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-lg shadow">
        <input
          type="number"
          placeholder="Enter amount to withdraw"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleWithdraw}
          className="w-full md:w-auto bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Request Withdrawal
        </button>
      </div>

      {/* Upcoming Payouts */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Upcoming Payouts</h3>
        <ul className="space-y-2">
          {upcomingPayouts.map((item, index) => (
            <li key={index} className="flex justify-between border-b pb-2">
              <span className="text-gray-600">{item.date}</span>
              <span className="font-semibold text-green-600">₹ {item.amount}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Transaction History */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-t text-left">
            <thead>
              <tr className="border-b text-gray-500">
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((tx, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{tx.date}</td>
                  <td className="py-2 px-3">{tx.desc}</td>
                  <td className="py-2 px-3 capitalize">{tx.type}</td>
                  <td
                    className={`py-2 px-3 ${
                      tx.type === "debit" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₹ {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Reports */}
      <div className="flex flex-wrap gap-3 mt-4">
        <button className="flex items-center border px-4 py-2 rounded-md hover:bg-gray-100 transition">
          <HiDownload className="w-5 h-5 mr-2" />
          Download Tax Report
        </button>
        <button className="flex items-center border px-4 py-2 rounded-md hover:bg-gray-100 transition">
          <FaArrowCircleDown className="w-5 h-5 mr-2" />
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default WalletDashboard;
