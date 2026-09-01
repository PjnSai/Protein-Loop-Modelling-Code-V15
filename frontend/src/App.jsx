/* App.jsx - Main Application Component */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Core Application Components
import Navigation from './components/Navigation'; 
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components - Authentication Flow
import Register from './pages/Register';
import Login from './pages/Login';
import OTPVerify from './pages/OTPVerify';
import RequestReset from './pages/RequestReset';
import ResetPassword from './pages/ResetPassword';

// Page Components - Application Features
import LoginLog from './pages/LoginLog';
import HomePage from './pages/HomePage';
import DashBoard from './pages/DashBoard';
import ProfilePage from './pages/ProfilePage';
import LoopModellingInterface from './pages/LoopModellingInterface';

// Icon Components for Footer Feature Display
import { FaLock, FaDna, FaChartBar } from 'react-icons/fa';

export default function App() {
  return (
    <Router>
      {/* Application Shell - Flexible layout container */}
      <div className="d-flex flex-column min-vh-100 bg-light">

        {/* Navigation Bar - Persistent across all routes */}
        <Navigation />
        
        {/* Main Content Area - Dynamic content based on current route */}
        <div className="flex-grow-1">
          <Routes>
            
            {/* Public Routes - Accessible without authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/otp" element={<OTPVerify />} />
            <Route path="/request-reset" element={<RequestReset />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Semi-Protected Route - Modelling Interface - Accessible to both authenticated and demo users.*/}
            <Route path="/modelling" element={
              <ErrorBoundary>
                <LoopModellingInterface />
              </ErrorBoundary>
            } />
            
            {/* Protected Routes - Authentication Required - These routes require valid user session and redirect to login if unauthorised.*/}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <DashBoard />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            
            <Route path="/logs" element={
              <ProtectedRoute>
                <LoginLog />
              </ProtectedRoute>
            } />
            
          </Routes>
        </div>
        
        {/* Application Footer */}
        <footer className="bg-dark text-light py-4 mt-5">
          <div className="container-fluid px-3">
            <div className="row">
              
              {/* Application Description and Branding */}
              <div className="col-md-8">
                <h6>Protein Loop Modelling Server</h6>
                <p className="mb-0 small text-muted">
                  A secure web-based platform for protein loop modelling using advanced computational algorithms.
                  Developed for academic research purposes.
                </p>
              </div>
              
              {/* Feature Highlights with Visual Icons */}
              <div className="col-md-4 text-md-end">
                <div className="small text-muted">
                  
                  {/* Security Feature Highlight */}
                  <div className="d-flex align-items-center justify-content-md-end mb-1">
                    <FaLock className="me-2 text-info" />
                    <span>Secure Local Deployment</span>
                  </div>
                  
                  {/* MATLAB Integration Feature */}
                  <div className="d-flex align-items-center justify-content-md-end mb-1">
                    <FaDna className="me-2 text-success" />
                    <span>MATLAB Integration Ready</span>
                  </div>
                  
                  {/* Monitoring Feature */}
                  <div className="d-flex align-items-center justify-content-md-end">
                    <FaChartBar className="me-2 text-primary" />
                    <span>Real-time Job Monitoring</span>
                  </div>
                  
                </div>
              </div>
            </div>
            
            {/* Footer Separator */}
            <hr className="my-3" />
            
            {/* Copyright and Technology Information */}
            <div className="row align-items-center">
              <div className="col-md-6">
                <small className="text-muted">
                  © 2024 Protein Loop Modelling Server - Academic Use
                </small>
              </div>
              <div className="col-md-6 text-md-end">
                <small className="text-muted">
                  Built with React, Flask, and MATLAB
                </small>
              </div>
            </div>
            
          </div>
        </footer>
        
      </div>
    </Router>
  );
}