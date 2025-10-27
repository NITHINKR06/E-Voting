// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isAuthenticated()) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin()) {
    toast.error('Admin access required');
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

export default ProtectedRoute;