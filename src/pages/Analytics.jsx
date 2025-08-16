import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {analyticData} from '../services/apiServices'
// import { UserContext } from '../context/UserContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Analytics = () => {
  // const { user } = useContext(UserContext);
  const [salesData, setSalesData] = useState({
    weekly_sales: 0,
    monthly_sales: 0,
    yearly_sales: 0,
    monthly_sales_data: Array(12).fill(0),
  });

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const data = await analyticData();
        setSalesData(data);
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    };

    fetchSalesData();
  }, []);

  const chartData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Monthly Sales (₹)',
        data: salesData.monthly_sales_data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(75,192,192,1)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: 'Sales Trends (Monthly)',
        font: {
          size: 18
        },
        color: '#111'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `₹ ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `₹ ${value}`;
          }
        }
      },
      x: {
        ticks: {
          color: '#666',
          font: {
            size: 12
          }
        }
      }
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Weekly Sales</h3>
          <p className="text-2xl mt-2">₹ {salesData?.weekly_sales}</p>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Monthly Sales</h3>
          <p className="text-2xl mt-2">₹ {salesData?.monthly_sales}</p>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Yearly Sales</h3>
          <p className="text-2xl mt-2">₹ {salesData?.yearly_sales}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4">Sales Growth (This Year)</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Analytics;
