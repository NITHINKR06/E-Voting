// src/pages/OtpVerificationPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('loginEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email not found. Please login again.');
      navigate('/login');
      return;
    }
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('loginEmail');
      toast.success('OTP verified! Redirecting to dashboard...');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-block bg-indigo-100 rounded-full p-3 mb-4">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify OTP</h2>
          <p className="text-gray-600 mb-4">Check your email for the OTP</p>
          {email && <p className="text-sm text-blue-600 font-medium">{email}</p>}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter 6-Digit OTP</label>
            <input 
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              className="w-full p-4 text-center text-3xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            />
          </div>

          {timer > 0 ? (
            <div className="text-center text-gray-600">
              <p className="text-sm">OTP expires in: <span className="font-bold text-indigo-600">{formatTime(timer)}</span></p>
            </div>
          ) : (
            <div className="text-center text-red-600">
              <p className="text-sm">OTP expired. Please login again.</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || timer === 0 || otp.length !== 6}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Verify OTP'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => navigate('/login')}
            className="text-sm text-indigo-600 hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;