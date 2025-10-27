// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LandingPage from './pages/LandingPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import OtpVerificationPage from './pages/OtpVerificationPage.jsx';
import VotingDashboard from './pages/VotingDashboard.jsx';
import ResultPage from './pages/ResultPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp-verification" element={<OtpVerificationPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><VotingDashboard /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><ResultPage /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

export default App;