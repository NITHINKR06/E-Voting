// Test component to verify admin protection
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getToken, isAdmin } from '../utils/auth';

const AdminTest = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const adminStatus = isAdmin();
    
    console.log('Token exists:', !!token);
    console.log('Is admin:', adminStatus);
    
    if (!token) {
      toast.error('No authentication token found');
      navigate('/login');
      return;
    }
    
    if (!adminStatus) {
      toast.error('User is not an admin');
      navigate('/dashboard');
      return;
    }
    
    toast.success('Admin access verified!');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Test</h1>
        <p className="text-gray-600">This page tests admin authentication</p>
        <div className="mt-4 space-y-2">
          <p>Token: {getToken() ? '✅ Present' : '❌ Missing'}</p>
          <p>Admin: {isAdmin() ? '✅ Yes' : '❌ No'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;
