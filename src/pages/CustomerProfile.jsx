import { useState,useContext, useEffect } from "react";
import {getOrders,updateCustomerProfile} from "../services/apiServices";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import { UserContext } from "../context/UserContext";

export default function CustomerManage() {
  const navigate = useNavigate();
  const {user}  = useContext(UserContext); 
  const [customer, setCustomer] = useState(null); 
  const [orders, setOrders] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const token=sessionStorage.getItem(ACCESS_TOKEN)

  

  useEffect(() => {
    if (!token) {
      toast.warning("Please login to access your profile");
      navigate("/login");
    } else if (user) {
      const fetchInitialData = async () => {
        try {
          setCustomer(user);
          setFormData({
            username: user.username,
            email: user.email,
          });
  
          const fetchedOrders = await getOrders();
          setOrders(fetchedOrders);
        } catch (err) {
          console.error("Error initializing data:", err);
          toast.error("Failed to load data.");
        }
      };
  
      fetchInitialData();
    }
  }, [navigate, token, user]);

  if (!customer || !user) return null; // can be replaced with a loading spinner

  
  const handleProfileUpdate = async () => {
    try {
      const form = new FormData();
      form.append("username", formData.username);
      form.append("email", formData.email);
      if (avatarFile) {
        form.append("avatar", avatarFile);
      }

      const updated = await updateCustomerProfile(customer.id, form);

      setCustomer(updated);
      setAvatarFile(null);
      setShowProfileModal(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Profile update failed:", err);
      toast.error("Could not update profile.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }

    // Add password update API here
    toast.success("Password updated!");
    setNewPassword("");
  };

  if (!customer) return null; // or loader/spinner

  return (
    <div className="p-4 max-w-5xl mx-auto space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-32 h-32">
          <img
            src={`http://localhost:8005${customer.user_profile}`}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover border"
            onError={(e) => {
              e.target.onerror = null; // prevent infinite loop
              e.target.src = 'https://randomuser.me/api/portraits/med/men/26.jpg';
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="absolute bottom-0 right-0 w-8 h-8 opacity-0 cursor-pointer"
            onChange={handleAvatarChange}
            title="Change avatar"
          />
        </div>
        <div className="flex-1 space-y-2">
          <h2 className="text-xl font-semibold">{customer.username}</h2>
          <p className="text-gray-600">{customer.email}</p>
          <p className="text-gray-600"> Shipping Adress{customer.address}</p>
          <button
            onClick={() => setShowProfileModal(true)}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          >
            Update Profile
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Change Password</h3>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            placeholder="New password"
            className="border p-2 rounded flex-1"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordChange}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Update Password
          </button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">Order ID: ORD{order.id}</p>
                  <p className="text-sm text-gray-500">Status: {order.status}</p>
                </div>
                <p className="text-right font-semibold text-blue-600">
                  ₹
                  {order.items
                    .reduce((acc, item) => acc + item.total_price, 0)
                    .toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Update Profile</h2>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Username"
              className="border p-2 w-full rounded"
            />
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Email"
              className="border p-2 w-full rounded"
            />
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowProfileModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleProfileUpdate}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
