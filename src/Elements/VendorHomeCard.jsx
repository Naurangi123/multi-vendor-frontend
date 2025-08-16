import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, BarElement, LinearScale, PointElement } from "chart.js";
import { getVendors, searchProduct, getProductBySeller, getSalesData } from "../services/apiServices";
import { FcBusinessman } from "react-icons/fc";
import { ToastContainer, toast } from "react-toastify";

ChartJS.register(LineElement, CategoryScale, BarElement, LinearScale, PointElement);

export default function VendorHomeCard() {
    const [totalProduct, setTotalProduct] = useState([]);
    const [vendors, setVendor] = useState([]);
    const [order, setOrder] = useState(0);
    const [earning, setEarning] = useState(0);
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [searchdata, setSearchdata] = useState([]);
    const [summary, setSummary] = useState(null);


    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-IN", {
        weekday: "short", year: "numeric", month: "short", day: "numeric"
    });

    useEffect(() => {
        const fetchVendorData = async () => {
            try {
                const data = await getVendors();
                setTotalProduct(data.products || []);
                setVendor(data.vendor || {});
                setOrder(data.order_count || 0);
                setEarning(data.total_earnings || 0);
            } catch (error) {
                console.error("Error fetching vendor data:", error);
            }
        };
        fetchVendorData();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getProductBySeller();
                const productsArray = Array.isArray(data) ? data : data.products || data.results || [];
                const productsWithImages = productsArray.map(product => ({
                    ...product,
                    primaryImage: product.images?.[0]?.image ?? null,
                }));
                setProducts(productsWithImages);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error(error.message || 'Failed to fetch products');
            }
        };
        fetchProducts();
    }, []);

    const fetchSearchProduct = async (query) => {
        try {
            const data = await searchProduct(query);
            setSearchdata(data);
        } catch (error) {
            console.error("Error fetching search data:", error);
        }
    };

    const fetchSalesSummary = async () => {
        try {
            const data = await getSalesData();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching sales summary:", error);
        }
    };

    useEffect(() => {
        fetchSalesSummary();
    }, []);

    useEffect(() => {
        if (search.trim()) {
            fetchSearchProduct(search);
        } else {
            setSearchdata([]);
        }
    }, [search]);

    const categoryData = Array.isArray(totalProduct)
        ? totalProduct.reduce((acc, product) => {
            const categoryName = product.category?.name;
            if (categoryName) {
                acc[categoryName] = (acc[categoryName] || 0) + 1;
            }
            return acc;
        }, {})
        : {};

    const pieData = Object.entries(categoryData).map(
        ([category, count], index) => ({
            id: index,
            label: category,
            value: count,
        })
    );

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const lowStockProducts = products.filter(product => product.stock < 10);

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(prev => prev.filter(product => product.id !== id));
            // toast.success(`${product.name}`)
        }

    };

    const handleEditProduct = (id) => {
        if (window.confirm('Are you sure you want to edit this product?')) {
            setProducts(prev => prev.filter(product => product.id !== id));
            // toast.success(`${product.name}`)
        }

    };

    const getGreeting = () => {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const istOffset = 5.5 * 60 * 60000;
        const istTime = new Date(utc + istOffset);
        const hour = istTime.getHours();

        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    };

    // const chartData = {
    //     labels: ["Weekly", "Monthly", "Yearly"],
    //     datasets: [
    //         {
    //             label: "Sales (₹)",
    //             data: [
    //                 summary?.weekly_sales||0,
    //                 summary?.monthly_sales||0,
    //                 summary?.yearly_sales||0,
    //             ],
    //             fill: false,
    //             borderColor: "#2D9753",
    //             backgroundColor: "#2F9953",
    //             tension: 0.4,
    //         },
    //     ],
    // };

    // const chartOptions = {
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: "top",
    //         },
    //     },
    //     scales: {
    //         y: {
    //             beginAtZero: true,
    //             ticks: {
    //                 callback: function (value) {
    //                     return `₹${value}`;
    //                 },
    //             },
    //         },
    //     },
    // };

    const chartData = {
        labels: ["Weekly", "Monthly", "Yearly"],
        datasets: [
            {
                label: "Sales (₹)",
                data: [
                    summary?.weekly_sales || 0,
                    summary?.monthly_sales || 0,
                    summary?.yearly_sales || 0,
                ],
                backgroundColor: "#2A9753",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
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
        <div className="p-2 scroll-auto overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-600 text-white rounded shadow-lg p-6">
                    <h2 className="text-xl font-bold text-center">Total Products</h2>
                    <p className="text-3xl text-center">{totalProduct.length}</p>
                </div>
                <div className="bg-green-600 text-white rounded shadow-lg p-6">
                    <h2 className="text-xl font-bold text-center">Total Orders</h2>
                    <p className="text-3xl text-center">{order}</p>
                </div>
                <div className="bg-green-600 text-white rounded shadow-lg p-6">
                    <h2 className="text-xl font-bold text-center">Total Earnings</h2>
                    <p className="text-3xl text-center">₹ {earning}</p>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/2 bg-white p-6 border rounded">
                    <FcBusinessman size="100px" />
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                    <h1 className="text-xl font-semibold">{getGreeting()}, {vendors?.user?.username}</h1>
                    <p>Store: {vendors?.business_name}</p>
                    <p>Email: {vendors?.user?.email}</p>
                    <p>Phone: {vendors?.phone_no}</p>
                    <p>Address: {vendors?.address}</p>
                </div>
                <div className="w-full lg:w-1/2 bg-white p-6 border rounded">
                    <h2 className="text-lg font-bold mb-4">Product Categories</h2>
                    {pieData.length > 0 ? (
                        <PieChart
                            series={[{ data: pieData }]}
                            height={300}
                            slotProps={{
                                legend: {
                                    direction: "column",
                                    position: { vertical: "middle", horizontal: "right" },
                                },
                            }}
                        />
                    ) : (
                        <p>No category data available.</p>
                    )}
                </div>
            </div>

            <div className="bg-white mt-6 p-6 border rounded">
                <h2 className="text-xl font-semibold mb-4">Weekly Sales Overview</h2>
                <Bar data={chartData} options={chartOptions} />
            </div>

            <div className="bg-white mt-6 p-6 border rounded">
                <h2 className="text-xl font-semibold mb-4">Low Stock Products</h2>
                {lowStockProducts.length > 0 ? (
                    <ul>
                        {lowStockProducts.map(product => (
                            <li key={product.id} className="text-red-600">{product.name} (Stock: {product.stock})</li>
                        ))}
                    </ul>
                ) : (
                    <p>No low stock alerts.</p>
                )}
            </div>

            <div className="bg-white mt-6 p-6 border rounded">
                <h2 className="text-xl font-semibold mb-4">Product Inventory</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full p-2 border rounded mb-4"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded shadow-md">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">Image</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Price</th>
                                <th className="p-2 border">Stock</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchdata && filteredProducts.length > 0 ? filteredProducts.map((product) => (
                                <tr key={product.id} className="text-center">
                                    <td className="p-2 border">
                                        <img src={`http://localhost:8005${product.primaryImage}`} alt={product.name} className="w-12 h-12 mx-auto" />
                                    </td>
                                    <td className="p-2 border">{product.name}</td>
                                    <td className="p-2 border">₹{product.price}</td>
                                    <td className="p-2 border">{product.stock}</td>
                                    <td className="p-2 border">{product.category?.name}</td>
                                    <td className="p-2 border">
                                        <span className={`px-3 py-1 rounded-full text-sm ${product.status ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    <td className="p-1 border">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleEditProduct(product.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-gray-500 p-4">No products found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
