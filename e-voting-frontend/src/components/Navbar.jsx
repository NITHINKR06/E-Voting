// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, removeToken, isAdmin } from '../utils/auth';
import { useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    localStorage.removeItem('loginEmail');
    navigate('/');
    setMobileMenuOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-lg"
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 rounded-lg p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-800">E-Voting</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {!authenticated ? (
              <>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/admin-login">Admin Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/results">Results</NavLink>
                <NavLink to="/profile">Profile</NavLink>
                {isAdmin() && <NavLink to="/admin">Admin</NavLink>}
                <button
                  onClick={handleLogout}
                  className="bg-red-100 text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-200 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {!authenticated ? (
              <>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                <NavLink to="/register" onClick={() => setMobileMenuOpen(false)}>Register</NavLink>
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>Login</NavLink>
                <NavLink to="/admin-login" onClick={() => setMobileMenuOpen(false)}>Admin Login</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</NavLink>
                <NavLink to="/results" onClick={() => setMobileMenuOpen(false)}>Results</NavLink>
                <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</NavLink>
                {isAdmin() && <NavLink to="/admin" onClick={() => setMobileMenuOpen(false)}>Admin</NavLink>}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg font-semibold"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;