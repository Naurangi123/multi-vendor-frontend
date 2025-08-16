import React, { useContext, useEffect, useState } from 'react';
import { MdDeleteOutline, MdKeyboardBackspace } from 'react-icons/md';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import { useRazorpay } from 'react-razorpay';
import ModalForm from './ModelForm';
import { toast, ToastContainer } from 'react-toastify';
import { fetchUserAddresses, deleteAddress, saveUserAddress, doPayment, verifyPayment } from '../services/apiServices'
import { UserContext } from '../context/UserContext';

const ProductCart = () => {
    const { user } = useContext(UserContext);
    const Token = sessionStorage.getItem(ACCESS_TOKEN);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addressLoading, setAddressLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        addres: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
    });
    const navigate = useNavigate();
    const { Razorpay } = useRazorpay();

    const getAddresses = async () => {
        try {
            const data = await fetchUserAddresses();
            setAddresses(data);
            if (data.length > 0) {
                setSelectedAddressId(data[0].id);
            } else {
                setShowAddressForm(true);
            }
        } catch (err) {
            console.error("Failed to load addresses:", err);
            setShowAddressForm(true);
        } finally {
            setAddressLoading(false);
        }
    };

    useEffect(() => {
        getAddresses();
    }, []);

    useEffect(() => {
        axios
            .get('http://localhost:8005/api/carts/', {
                headers: { Authorization: `Bearer ${Token}` },
            })
            .then((res) => {
                setCartItems(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to fetch cart:', err);
                setLoading(false);
            });
    }, [Token]);

    if (!user) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-xl font-semibold mb-4">Please log in to view your cart.</h2>
                <Link
                    to="/login"
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Go to Login
                </Link>
            </div>
        );
    }

    if (loading) return <p className="text-center mt-10">Loading your cart...</p>;

    const deleteCartItem = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8005/api/carts/${id}/`, {
                headers: { Authorization: `Bearer ${Token}` },
            });
            setCartItems((prev) => prev.filter((item) => item.id !== id));
            toast.success(response.data.message);
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error(error.response?.data?.message || 'Failed to delete item.');
        }
    };


    const handleDeleteAddress = async (id) => {
        try {
            await deleteAddress(id);
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            if (selectedAddressId === id) {
                setSelectedAddressId(null);
            }
            toast.success('Address deleted.');
        } catch (err) {
            toast.error('Failed to delete address.', err);
        }
    };





    const updateQuantity = async (id, change) => {
        const updatedItem = cartItems.find((item) => item.id === id);
        const newQuantity = Math.max(1, updatedItem.quantity + change);

        try {
            await axios.patch(
                `http://localhost:8005/api/carts/${id}/`,
                { quantity: newQuantity },
                { headers: { Authorization: `Bearer ${Token}` } }
            );
            setCartItems((prev) =>
                prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
            );
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    // const gst = subtotal * 0.18;
    // const totalWithGST = Math.round((subtotal + gst) * 100) / 100;
    // console.log(totalWithGST)

    // const handlePayment = async () => {
    //     const payload = {
    //         method: 'razorpay',
    //         amount: totalWithGST,
    //         order: cartItems.map((item) => ({
    //             product_id: item.product.id,
    //             quantity: item.quantity,
    //         })),
    //         shipping_address:selectedAddressId

    //     };

    //     console.log("payload", payload);

    //     try {
    //         const response = await doPayment(payload);
    //         const { amount, currency, razorpay_order_id, razorpay_key, order_id } = response.data;
    //         if (!razorpay_order_id) {
    //             console.error("Missing order_id or razorpay_order_id in response", response);
    //             toast.error("Error: Missing payment order information.");
    //             return;
    //         }
    //         const options = {
    //             key: razorpay_key || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_kGA4kMvV0tdaAY',
    //             amount: amount * 100,
    //             currency,
    //             order_id: razorpay_order_id,
    //             name: 'Your Company',
    //             description: `Order #${order_id}`,
    //             handler: async function (paymentResponse) {
    //                 toast.success('Payment Successful!');
    //                 try {
    //                     await verifyPayment({
    //                         razorpay_order_id: paymentResponse.razorpay_order_id,
    //                         razorpay_payment_id: paymentResponse.razorpay_payment_id,
    //                         razorpay_signature: paymentResponse.razorpay_signature,
    //                         order_id: order_id,
    //                     });
    //                     toast.success('Payment Verified!');
    //                     navigate('/thank-you');
    //                 } catch (err) {
    //                     console.error('Verification failed:', err);
    //                     toast.error('Payment verification failed');
    //                 }
    //             },
    //             prefill: {
    //                 name: user.username,
    //                 email: user.email,
    //                 contact: user.phone_number,
    //             },
    //             theme: {
    //                 color: '#F37254',
    //             },
    //         };

    //         const rzp = new Razorpay(options);
    //         rzp.open();
    //     } catch (err) {
    //         console.error('Payment initiation failed:', err.response?.data?.error);
    //         toast.error(err.response?.data?.error || "Payment initiation failed");
    //     }
    // };

    const handlePayment = async () => {
        const payload = {
            method: 'razorpay',
            amount: subtotal, // should match server's calculated subtotal
            order: cartItems.map((item) => ({
                product_id: item.product.id,
                quantity: item.quantity,
            })),
            shipping_address: selectedAddressId
        };

        try {
            const response = await doPayment(payload);
            const {
                amount,
                currency,
                razorpay_order_id,
                razorpay_key,
                order_id,
                payment_id
            } = response.data;

            if (!razorpay_order_id || !order_id) {
                toast.error("Missing payment order information.");
                return;
            }

            const options = {
                key: razorpay_key,
                amount: amount * 100,
                currency: currency,
                name: 'Your Store Name',
                description: `Order #${order_id}`,
                order_id: razorpay_order_id,
                handler: async function (paymentResponse) {
                    try {
                        await verifyPayment({
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                            order_id: order_id,
                            payment_id: payment_id
                        });
                        toast.success('Payment verified successfully!');
                        navigate('/thank-you');
                    } catch (err) {
                        console.error('Verification failed:', err);
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: user.username,
                    email: user.email,
                    contact: user.phone_number
                },
                theme: {
                    color: '#F37254'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error('Payment initiation failed:', err.response?.data?.error || err.message);
            toast.error(err.response?.data?.error || "Payment initiation failed");
        }
    };


    return (
        <>
            <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-2/3 bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Shopping Cart</h2>
                        <ToastContainer />
                        <span
                            onClick={() => navigate('/shop')}
                            className="flex items-center text-blue-600 cursor-pointer hover:underline"
                        >
                            <MdKeyboardBackspace className="mr-1" /> Back to Shop
                        </span>
                    </div>

                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item.id} className="border-b py-4 flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-1/4 md:items-center md:justify-center">
                                    {item.product.images?.[0] && (
                                        <img
                                            src={`http://localhost:8005${item.product.images[0].image}`}
                                            alt={item.product.name}
                                            loading='lazy'
                                            placeholder="blur"
                                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-full md:h-auto object-cover md:mx-auto rounded fill"
                                        />
                                    )}
                                </div>
                                <div className="w-full flex-1">
                                    <h3 className="text-lg font-semibold">{item.product.name}</h3>
                                    <p className="text-sm text-gray-600 md:truncate sm:text-sm truncate">{item.product.description}</p>
                                    <p className="text-green-500 mt-1">In Stock</p>
                                    <div className="mt-1 flex items-center gap-2">
                                        <span className="text-black font-semibold">₹{item.product.price}</span>
                                        <span className="line-through text-gray-400 text-sm">
                                            ₹{Math.round(item.product.price * 1.3)}
                                        </span>
                                        <span className="bg-yellow-400 text-white text-xs px-2 py-0.5 rounded">30% off</span>
                                    </div>

                                    <div className="mt-2 flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                                        >
                                            -
                                        </button>
                                        <span className="text-lg">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => deleteCartItem(item.id)}
                                            className="ml-4 text-red-600 hover:text-red-700"
                                        >
                                            <MdDeleteOutline size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full md:w-1/5 flex items-end justify-end">
                                    <h4 className="text-right font-medium">
                                        ₹{item.quantity * item.product.price}
                                    </h4>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-6 space-y-4">
                    <p className="text-sm text-green-600">
                        Your order is eligible for <strong>FREE Delivery</strong>. Choose it at checkout.
                    </p>
                    <p className="text-lg font-semibold">
                        Subtotal ({cartItems.length} items): ₹{subtotal}
                    </p>
                    <div className="mb-6">
                        <h3 className="font-bold mb-2">Shipping Address</h3>
                        {addressLoading ? (
                            <p>Loading addresses...</p>
                        ) : addresses.length > 0 ? (
                            <div className="space-y-3">
                                {addresses.map((addr) => (
                                    <div key={addr.id} className="flex items-start justify-between border p-3 rounded text-sm mb-2">
                                        <label
                                            className={`flex-1 cursor-pointer ${selectedAddressId === addr.id
                                                ? "border-indigo-500 bg-indigo-50"
                                                : "border-gray-300"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="address"
                                                value={addr.id}
                                                checked={selectedAddressId === addr.id}
                                                onChange={() => setSelectedAddressId(addr.id)}
                                                className="mr-2"
                                            />
                                            <span className="font-semibold">{addr.address}</span> — {addr.city}, {addr.country}, {addr.zip_code}
                                        </label>

                                        {/* Delete button outside label */}
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-red-500 text-xs ml-3 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                                <button
                                    className="text-blue-600 hover:underline text-sm"
                                    onClick={() => setShowAddressForm(true)}
                                >
                                    + Add New Address
                                </button>
                            </div>
                        ) : (
                            showAddressForm && <p>No address found. Please add one.</p>
                        )}

                        {showAddressForm && (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const saved = await saveUserAddress(newAddress);
                                        setAddresses((prev) => [...prev, saved]);
                                        setSelectedAddressId(saved.id);
                                        setShowAddressForm(false);
                                        toast.success("Address added!");
                                        setNewAddress({ address: '', city: '', state: '', zip_code: '', country: '' });
                                    } catch {
                                        toast.error("Error saving address.");
                                    }
                                }}
                                className="space-y-2 mt-4"
                            >
                                {['address', 'city', 'state', 'zip_code', 'country'].map((field) => (
                                    <input
                                        key={field}
                                        type="text"
                                        placeholder={field[0].toUpperCase() + field.slice(1)}
                                        value={newAddress[field]}
                                        onChange={(e) =>
                                            setNewAddress({ ...newAddress, [field]: e.target.value })
                                        }
                                        className="w-full border p-2 rounded text-sm"
                                        required
                                    />
                                ))}
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                                >
                                    Save Address
                                </button>
                            </form>
                        )}
                    </div>

                    <button
                        onClick={handlePayment}
                        className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg"
                    >
                        Proceed to Buy
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductCart;
