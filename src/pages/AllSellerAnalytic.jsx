import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ACCESS_TOKEN } from '../constants';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AllSellersAnalytics = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('monthly'); // 'weekly' | 'monthly' | 'yearly'

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:8005/api/admin/all-sellers-analytics/', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`
          }
        });
        setSellers(response.data);
      } catch (err) {
        console.error('Error fetching sellers analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  const viewLabel = {
    weekly: 'Weekly Net Income',
    monthly: 'Monthly Net Income',
    yearly: 'Yearly Net Income',
  };

  // Pie Chart Data
  const pieData = {
    labels: sellers.map(s => s.seller_name),
    datasets: [
      {
        label: viewLabel[view],
        data: sellers.map(s => s[`${view}_net_income`]),
        backgroundColor: [
          '#60a5fa', '#f472b6', '#34d399', '#facc15', '#a78bfa', '#f87171',
          '#4ade80', '#fb7185', '#fcd34d', '#6ee7b7', '#a5b4fc', '#fdba74'
        ],
        borderWidth: 1,
      }
    ]
  };

  // Bar Chart Data
  const barData = {
    labels: sellers.map(s => s.seller_name),
    datasets: [
      {
        label: viewLabel[view],
        data: sellers.map(s => s[`${view}_net_income`]),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Stacked Bar Chart: Net + GST
  const stackedBarData = {
    labels: sellers.map(s => s.seller_name),
    datasets: [
      {
        label: 'Net Income (₹)',
        data: sellers.map(s => s[`${view}_net_income`]),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: 'GST to Admin (₹)',
        data: sellers.map(s => s[`${view}_gst_to_admin`]),
        backgroundColor: 'rgba(234, 88, 12, 0.7)',
      }
    ]
  };

  const stackedBarOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: `Net Income + GST Breakdown (${viewLabel[view]})`,
      }
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">All Sellers Earnings</h2>

      {/* Toggle View */}
      <div className="mb-6 flex gap-4">
        {['weekly', 'monthly', 'yearly'].map(option => (
          <button
            key={option}
            onClick={() => setView(option)}
            className={`px-4 py-2 rounded font-medium border ${
              view === option ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
            }`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>

      {/* Seller Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {sellers.map((seller) => (
          <div
            key={seller.seller_id}
            className="bg-white border rounded-lg shadow-md p-5 hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{seller.seller_name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Weekly Net:</strong> ₹{seller.weekly_net_income}</p>
              <p><strong>Weekly GST:</strong> ₹{seller.weekly_gst_to_admin}</p>
              <p><strong>Monthly Net:</strong> ₹{seller.monthly_net_income}</p>
              <p><strong>Monthly GST:</strong> ₹{seller.monthly_gst_to_admin}</p>
              <p><strong>Yearly Net:</strong> ₹{seller.yearly_net_income}</p>
              <p><strong>Yearly GST:</strong> ₹{seller.yearly_gst_to_admin}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pie + Bar Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center mb-4">Pie Chart – {viewLabel[view]}</h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-center mb-4">Bar Chart – {viewLabel[view]}</h3>
          <Bar data={barData} />
        </div>
      </div>

      {/* Stacked Net + GST Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-10">
        <h3 className="text-lg font-semibold text-center mb-4">
          Stacked Bar – Net Income + GST
        </h3>
        <Bar data={stackedBarData} options={stackedBarOptions} />
      </div>
    </div>
  );
};

export default AllSellersAnalytics;
