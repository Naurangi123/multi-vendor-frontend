 import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ACCESS_TOKEN } from '../../constants';

const ForgotPassword = () => {
  
 const access  = sessionStorage.getItem(ACCESS_TOKEN)
 console.log("token",access);

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const sentOtp = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8005/auth/forgot-password/', { email },
         
      );
      console.log(response);
      if (response.status) {
        toast.success('OTP sent to your email');
        setStep(2);
      } else {
        toast.error('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.',error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8005/auth/verify-otp/',  {email,otp}
         

      
        
        );
        console.log(response)
      if (response.status) {
        toast.success('OTP verified successfully!');
        setStep(3);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.',error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8005/auth/reset-password/', { email, new_password:newPassword },
         
      );
      if (response.status) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.',error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Forgot Password?</h2>
        <form className="space-y-4">
          {step === 1 && (
            <>
              <div className="flex items-center">
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={sentOtp}
                  className="ml-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Send OTP
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Verify OTP
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <input
                id='new_password'
                type="password"
                name='new_password'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={handleResetPassword}
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Reset Password
              </button>
            </>
          )}

          <p className="text-sm text-center text-gray-600">
            Remember your password?{' '}
            <a
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
