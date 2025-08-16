import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ACCESS_TOKEN } from '../constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SellerAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get('http://localhost:8005/api/seller/sales-analytics/', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem(ACCESS_TOKEN)}`,
          },
        });
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading analytics...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Net Income (₹)',
        data: analytics.monthly_sales_data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Seller Monthly Net Income',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `₹${value}`,
        },
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto p-6 font-sans text-gray-800">
      <h1 className="text-3xl font-bold mb-10 text-center">Seller Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-12">
        {/* Weekly Card */}
        <div className="flex-1 bg-blue-50 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Weekly Summary</h3>
          <p className="text-lg"><strong>Net Income:</strong> ₹{analytics.weekly_net_income}</p>
          <p className="text-lg"><strong>GST to Admin:</strong> ₹{analytics.weekly_gst_to_admin}</p>
        </div>

        {/* Monthly Card */}
        <div className="flex-1 bg-green-50 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Monthly Summary</h3>
          <p className="text-lg"><strong>Net Income:</strong> ₹{analytics.monthly_net_income}</p>
          <p className="text-lg"><strong>GST to Admin:</strong> ₹{analytics.monthly_gst_to_admin}</p>
        </div>

        {/* Yearly Card */}
        <div className="flex-1 bg-yellow-50 rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Yearly Summary</h3>
          <p className="text-lg"><strong>Net Income:</strong> ₹{analytics.yearly_net_income}</p>
          <p className="text-lg"><strong>GST to Admin:</strong> ₹{analytics.yearly_gst_to_admin}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Monthly Income (Net)</h2>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SellerAnalytics;
