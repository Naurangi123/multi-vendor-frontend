/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import CarouselShop from '../pages/CarouselShop';
import logo from '../assets/react.svg'
import { getCategories, getProducts, addToCart, filterProducts } from '../services/apiServices';

export default function Shop() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        query: '',
        category: '',
        sort_by: '',
        min_price: '',
        max_price: '',
        min_stock: '',
        max_stock: '',
        status: '',
    });

    const [categories, setCategories] = useState([]);
    const [filterproducts, setFilterProducts] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const productsPerPage = 8;
    const currentPage = parseInt(searchParams.get('page')) || 1;

    // Helper: check if any filter is active
    const isFilterActive = () => {
        return (
            filters.query ||
            filters.category ||
            filters.sort_by ||
            filters.min_price ||
            filters.max_price ||
            filters.min_stock ||
            filters.max_stock ||
            filters.status
        );
    };

    const updateFilters = (newValues) => {
        const updated = { ...filters, ...newValues };
        setFilters(updated);

        const params = new URLSearchParams();
        Object.entries(updated).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else if (value !== '') {
                params.set(key, value);
            }
        });
        params.set('page', currentPage);
        navigate(`?${params.toString()}`);
    };

    const fetchProducts = useCallback(async () => {
        if (!isFilterActive()) {
            // No filters applied, no need to fetch filtered products
            setFilterProducts([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach(v => params.append(key, v));
                } else if (value !== '') {
                    params.set(key, value);
                }
            });
            const data = await filterProducts(params);
            setFilterProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.log("Error", error);
        }
    };

    // const fetchBrands = async () => {
    //     try {
    //         const data = await getBrands();
    //         setBrands(data);
    //     } catch (error) {
    //         console.error("Error fetching brands", error);
    //     }
    // };

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    };

    // On mount, fetch categories, brands and products
    useEffect(() => {
        fetchCategories();
        fetchProductList();
    }, []);

    // When filters change, fetch filtered products (or clear if no filter)
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [filters, fetchProducts]);

    // Initialize filters from URL params on mount
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const newFilters = {
            query: params.get('query') || '',
            category: params.get('category') || '',
            brand: params.getAll('brand') || [],
            sort_by: params.get('sort_by') || '',
            min_price: params.get('min_price') || '',
            max_price: params.get('max_price') || '',
            min_stock: params.get('min_stock') || '',
            max_stock: params.get('max_stock') || '',
            status: params.get('status') || '',
        };
        setFilters(newFilters);
    }, []);

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;

    // Decide which product list to paginate: filtered or all
    const productListToShow = isFilterActive() ? filterproducts : products;

    const currentProducts = productListToShow.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(productListToShow.length / productsPerPage);

    const changePage = (page) => {
        if (page < 1 || page > totalPages) return;
        const params = new URLSearchParams(window.location.search);
        params.set('page', page);
        navigate(`?${params.toString()}`);
    };

    const handleCart = async (product) => {
        try {
            const data = { product_id: product.id, quantity: 1 };
            await addToCart(data);
            toast.success(`Added "${product.name}" to cart`);
            setTimeout(() => {
                navigate('/productCart');
            }, 2000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(error.response?.data?.detail || "Something went wrong");
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        }
    };

    const productDetail = (product) => {
        navigate(`/product/${product.id}`);
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row p-4 bg-gray-100">
            <ToastContainer />
            <aside className="w-full mt-20 md:w-1/4 bg-white rounded-lg shadow-md p-4 mb-4 md:mb-0 md:mr-4 md:fixed md:h-full md:overflow-y-auto md:top-0 md:left-0">
                <h2 className="text-xl font-semibold mb-4">Filters</h2>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.query}
                    onChange={(e) => updateFilters({ query: e.target.value })}
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                />
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Sort by</label>
                    <select
                        value={filters.sort_by}
                        onChange={(e) => updateFilters({ sort_by: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">Select</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="highest_price">Highest Price</option>
                        <option value="lowest_price">Lowest Price</option>
                    </select>
                </div>

                {/* Category */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        value={filters.category}
                        onChange={(e) => updateFilters({ category: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Price Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.min_price}
                            onChange={(e) => updateFilters({ min_price: e.target.value })}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.max_price}
                            onChange={(e) => updateFilters({ max_price: e.target.value })}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                {/* Stock Range */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Stock Range</label>
                    <div className="flex space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.min_stock}
                            onChange={(e) => updateFilters({ min_stock: e.target.value })}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.max_stock}
                            onChange={(e) => updateFilters({ max_stock: e.target.value })}
                            className="w-1/2 p-2 border border-gray-300 rounded"
                        />
                    </div>
                </div>

                {/* Status */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => updateFilters({ status: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="">All</option>
                        <option value="in_stock">In Stock</option>
                        <option value="out_of_stock">Out of Stock</option>
                    </select>
                </div>
            </aside>
            <main className="w-full md:w-3/4 md:ml-[25%] md:overflow-y-auto">
                <div className="mb-4">
                    <CarouselShop />
                </div>

                <h2 className="text-2xl font-semibold mb-6">Products</h2>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        <div className="space-y-6">
                            {currentProducts?.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => productDetail(product)}
                                    className="relative flex flex-col sm:flex-row bg-white border-b border-gray-500 rounded-sm transition-all cursor-pointer p-4"
                                >
                                    <button
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                                        </svg>
                                    </button>
                                    <div className="w-80 flex-shrink-0 mb-4 sm:mb-0">
                                        <img
                                            src={`http://localhost:8005${product.images[0]?.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-contain rounded"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="sm:ml-6 flex flex-col justify-between flex-grow">
                                        <div>
                                            <h1 className="text-gray-900 text-3xl from-neutral-900 font-bold mt-1">{product.description}</h1>
                                            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{product.name}</h2>

                                            <div className="flex items-center mt-1 space-x-1">
                                                <img src={logo} alt="Prime" className="h-4" />
                                                <span className="text-sm text-blue-600 font-medium">Fatse</span>
                                            </div>
                                            <div className="text-yellow-500 text-md mt-1">★★★★☆ {product.rating}</div>
                                            <p className="text-xl font-bold text-blue-600 mt-2">₹{product.price}</p>
                                            <p className="text-green-600 text-md font-medium mt-1">FREE Delivery</p>
                                            <p
                                                className={`text-sm font-medium mt-1 ${product.stock > 10
                                                    ? 'text-green-600'
                                                    : product.stock > 0
                                                        ? 'text-orange-500'
                                                        : 'text-red-600'
                                                    }`}
                                            >
                                                {product.stock > 10
                                                    ? 'In stock'
                                                    : product.stock > 0
                                                        ? `Only ${product.stock} left in stock`
                                                        : 'Out of stock'}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Ships from <span className="font-medium">{product.ships_from}</span>, Sold by{' '}
                                                <span className="font-medium">{product.seller?.name}</span>
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCart(product);
                                            }}
                                            className={`mt-4 sm:mt-0 sm:self-start w-full sm:w-40 py-2 text-sm font-semibold text-white rounded transition ${product.stock > 0 ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                            disabled={product.stock <= 0}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center flex-wrap gap-2">
                            <button
                                onClick={() => changePage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => changePage(i + 1)}
                                    className={`px-4 py-2 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => changePage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
