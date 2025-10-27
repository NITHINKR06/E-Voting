// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import { setToken } from '../utils/auth';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false); // For loading animation
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading animation
    try {
      const res = await api.post('/auth/login', form);
      // Store email in localStorage for OTP verification
      localStorage.setItem('loginEmail', form.email);
      toast.success('OTP sent to your email! Please check and verify.');
      navigate('/otp-verification');
    } catch (error) {
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        toast.error('Too many login attempts. Please wait 15 minutes before trying again.');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Animated Container */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6 animate-slide-up">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input with Slide Animation */}
          <div className="animate-slide-in-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">College Email</label>
            <input
              name="email"
              type="email"
              placeholder="youremail@nmamit.in"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
            />
          </div>
          {/* Password Input with Slide Animation */}
          <div className="animate-slide-in-right">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
            />
          </div>
          {/* Submit Button with Hover Animation */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 animate-fade-in-delay">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline transition-colors duration-300">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;