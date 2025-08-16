import React, { useState } from "react";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "../../constants";
import { Login as loginUser } from "../../services/apiServices";
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username:"",
    password:""
  });
  const [loading,setLoading]=useState(false)
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      if (res?.access && res?.refresh) {
        sessionStorage.setItem(ACCESS_TOKEN, res.access);
        sessionStorage.setItem(REFRESH_TOKEN, res.refresh);
         
        toast.success('Login successful!');
        setTimeout(()=>{
          navigate('/');
        },200)
      }
    } catch (error) {
      toast.error(error?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            id="username"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
          
          <p className="text-sm text-center text-gray-600">
                Don't have an account?{' '}
                <a
                  onClick={() => navigate('/register')}
                  className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  Register 
                </a> 
                <a onClick = {() => navigate('/ForgotPassword')} className="ml-3 text-blue-800 hover:text-red-800 cursor-pointer">{' '} Forgot password?</a>
              </p>
        </form>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Login;
