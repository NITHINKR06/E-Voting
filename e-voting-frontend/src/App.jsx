// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OtpVerificationPage from './pages/OtpVerificationPage.jsx';
import VotingDashboard from './pages/VotingDashboard.jsx';
import ResultPage from './pages/ResultPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ElectionManagement from './pages/ElectionManagement.jsx';
import SecurityDashboard from './pages/SecurityDashboard.jsx';
import SuperAdminSetup from './pages/SuperAdminSetup.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import AdminSetupPage from './pages/AdminSetupPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SuperAdminSetup />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-setup" element={<AdminSetupPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><VotingDashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
        <Route path="/elections" element={<ProtectedRoute adminOnly><ElectionManagement /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute adminOnly><SecurityDashboard /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;