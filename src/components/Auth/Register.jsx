import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import { Signup } from '../../services/apiServices';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'customer',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.username) newErrors.username = 'Username is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email format.';
    if (!formData.password) newErrors.password = 'Password is required.';
    if (formData.password !== formData.confirm_password)
      newErrors.confirm_password = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await Signup(formData);
        if (res?.access && res?.refresh) {
          sessionStorage.setItem(ACCESS_TOKEN, res.access);
          sessionStorage.setItem(REFRESH_TOKEN, res.refresh);
          toast.success(res.response);
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          navigate('/login');
        }
      } catch (err) {
        if (err.response?.data?.username) {
          toast.error(`Username "${formData.username}" is already taken.`);
        } else if (err.response?.data?.email) {
          toast.error(`Email "${formData.email}" is already registered.`);
        } else {
          toast.error(err.message || 'Something went wrong!');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            >
              <option value="customer">Customer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
            {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
            {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border rounded"
              required
            />
            {errors.confirm_password && (
              <span className="text-red-500 text-xs">{errors.confirm_password}</span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Login
            </a>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
