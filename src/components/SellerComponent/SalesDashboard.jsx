import React, { useState } from 'react';
import {
  MdToday,
  MdDateRange,
  MdCalendarMonth,
  MdAttachMoney,
  MdShoppingCart,
  MdShowChart,
  MdTrendingUp,
  MdBarChart,
  MdSell
} from 'react-icons/md';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const salesData = {
  daily: { totalSales: 1500, orders: 22 },
  weekly: { totalSales: 9500, orders: 130 },
  monthly: { totalSales: 40500, orders: 570 },
};

const revenueTrend = [
  { date: 'Mon', revenue: 2000 },
  { date: 'Tue', revenue: 3000 },
  { date: 'Wed', revenue: 2200 },
  { date: 'Thu', revenue: 3500 },
  { date: 'Fri', revenue: 4000 },
  { date: 'Sat', revenue: 5000 },
  { date: 'Sun', revenue: 4500 },
];

const orderTrend = [
  { week: 'Week 1', orders: 120 },
  { week: 'Week 2', orders: 150 },
  { week: 'Week 3', orders: 110 },
  { week: 'Week 4', orders: 180 },
];

const topProducts = [
  { name: 'Product A', sold: 300, views: 1200, conversion: 25 },
  { name: 'Product B', sold: 250, views: 900, conversion: 28 },
  { name: 'Product C', sold: 180, views: 1300, conversion: 14 },
];

const SalesDashboard = () => {
  const [period, setPeriod] = useState('daily');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MdTrendingUp className="text-blue-600" />
        Sales Analytics Dashboard
      </h2>

      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setPeriod('daily')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${period === 'daily' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700'}`}
        >
          <MdToday /> Daily
        </button>
        <button
          onClick={() => setPeriod('weekly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${period === 'weekly' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700'}`}
        >
          <MdDateRange /> Weekly
        </button>
        <button
          onClick={() => setPeriod('monthly')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md border ${period === 'monthly' ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-700'}`}
        >
          <MdCalendarMonth /> Monthly
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MdAttachMoney /> Total Sales
          </p>
          <h4 className="text-2xl font-bold">₹ {salesData[period].totalSales}</h4>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MdShoppingCart /> Orders
          </p>
          <h4 className="text-2xl font-bold">{salesData[period].orders}</h4>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <MdShowChart /> Avg Order Value
          </p>
          <h4 className="text-2xl font-bold">
            ₹ {Math.floor(salesData[period].totalSales / salesData[period].orders)}
          </h4>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MdTrendingUp /> Revenue Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Order Trends */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MdBarChart /> Order Trends
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderTrend}>
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="orders" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <MdSell /> Top Selling Products
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-t">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2 px-3">Product</th>
                <th className="py-2 px-3">Sold</th>
                <th className="py-2 px-3">Views</th>
                <th className="py-2 px-3">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-3">{p.name}</td>
                  <td className="py-2 px-3">{p.sold}</td>
                  <td className="py-2 px-3">{p.views}</td>
                  <td className="py-2 px-3">{p.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
