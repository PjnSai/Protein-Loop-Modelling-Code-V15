/* Navigation.jsx - Main Application Navigation Component */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaDna, FaHome, FaFlask, FaChartBar, FaList, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';

/* Navigation Component */
const Navigation = () => {
  const { isAuthenticated, user, logout, isLoading: authLoading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  /* Logout Handler with Error Management */
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();
      if (result.success) {
        navigate('/');
      } else {
        console.error('Logout failed:', result.error);
        // Could show error here in future
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Loading State Display During Authentication Check
  if (authLoading) {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container-fluid px-3">
          <Link to="/" className="navbar-brand fw-bold">
            <FaDna className="me-2" />
            Loop Modeller
          </Link>
          <div className="text-white">
            <small>Checking authentication...</small>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container-fluid px-3">
        
        {/* Application Branding */}
        <Link to="/" className="navbar-brand fw-bold">
          <FaDna className="me-2" />
          Loop Modeller
        </Link>
        
        {/* Mobile Menu Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation Menu Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          
          {/* Primary Navigation Links */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <FaHome className="me-1" />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/modelling" className="nav-link">
                <FaFlask className="me-1" />
                Loop Modelling
              </Link>
            </li>
            
            {/* Authenticated User Navigation Links */}
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className="nav-link">
                    <FaChartBar className="me-1" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/logs" className="nav-link">
                    <FaList className="me-1" />
                    Activity
                  </Link>
                </li>
              </>
            )}
          </ul>
          
          {/* User Account Section */}
          <ul className="navbar-nav">
            {isAuthenticated ? (
              // Authenticated User Dropdown Menu
              <li className="nav-item dropdown">
                <a 
                  className="nav-link dropdown-toggle" 
                  href="#" 
                  role="button" 
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUser className="me-1" />
                  {user?.email || 'User'}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <FaCog className="me-2" />
                      Profile Settings
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item" 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      <FaSignOutAlt className="me-2" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              // Guest User Authentication Links
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    <FaSignOutAlt className="me-1" />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/register" className="nav-link">
                    <FaUser className="me-1" />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
          
        </div>
      </div>
    </nav>
  );
};

export default Navigation;