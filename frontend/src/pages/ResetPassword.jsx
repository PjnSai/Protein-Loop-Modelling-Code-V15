/* ResetPassword.jsx - Password Reset Completion Page */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
// Form component for password reset completion
import ResetPasswordForm from '../components/forms/ResetPasswordForm';

// Authentication API integration
import { resetPassword } from '../api/auth';

// Validation utilities for password security
import { validatePassword } from '../utils/validators';

/* ResetPassword Component */
const ResetPassword = () => {
  // URL Parameter Management
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Form State Management
  const [formData, setFormData] = useState({ 
    password: '', 
    confirmPassword: '' 
  });
  
  // UI State Management
  const [isLoading, setIsLoading] = useState(false);     // Loading state for reset
  const [error, setError] = useState(null);             // Error display management
  const [success, setSuccess] = useState(false);        // Success state management

  // Extract token and email from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  /* Effect Hook - Token Validation */
  useEffect(() => {
    if (!token || !email) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token, email]);

  /* Handle Form Input Changes */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear any existing errors on user input
    if (error) setError(null);
  };

  /* Handle Password Reset Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    // Client-side password validation
    const error = validatePassword(password, confirmPassword);
    if (error) {
      setError(error);
      return;
    }

    setIsLoading(true);
    
    try {
      const { ok, data } = await resetPassword(email, token, password);
      
      if (ok) {
        // Successful password reset - show confirmation and redirect
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Password reset failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success State - Password Reset Completion Confirmation
  if (success) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow">
              <div className="card-body text-center p-5">
                
                {/* Success Icon */}
                <div className="text-success mb-3">
                  <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
                  </svg>
                </div>
                
                <h5 className="text-success">Password Reset Successful!</h5>
                <p className="text-muted">
                  Your password has been updated. Redirecting to login page...
                </p>
                
                {/* Loading Indicator for Redirection */}
                <div className="spinner-border spinner-border-sm text-primary mt-3"></div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid Token State - Error Display with Recovery Pathway
  if (!token || !email) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card border-0 shadow">
              <div className="card-body text-center p-5">
                
                {/* Error Icon */}
                <div className="text-danger mb-3">
                  <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                  </svg>
                </div>
                
                <h5 className="text-danger">Invalid Reset Link</h5>
                <p className="text-muted">
                  This password reset link is invalid or has expired.
                </p>
                
                {/* Recovery Pathway */}
                <div className="mt-4">
                  <Link to="/request-reset" className="btn btn-primary">
                    Request New Reset Link
                  </Link>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Password Reset Interface
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              
              {/* Reset Password Page Header */}
              <div className="text-center mb-4">
                
                {/* Security Icon */}
                <div className="text-primary mb-3">
                  <svg width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zM3 6v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zM5 8a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0V8zm4 0a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0V8z"/>
                  </svg>
                </div>
                
                <h3 className="fw-bold text-primary">Set New Password</h3>
                <p className="text-muted">Enter your new password below</p>
              </div>

              {/* Password Reset Form */}
              <ResetPasswordForm
                formData={formData}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />

              {/* Navigation Back to Login */}
              <div className="text-center mt-4">
                <Link to="/login" className="text-muted text-decoration-none">
                  ← Back to Login
                </Link>
              </div>

              {/* Password Requirements and Security Guidance */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>Password Requirements:</strong>
                  <ul className="mb-0 mt-1">
                    <li>At least 8 characters long</li>
                    <li>Should not be found in known data breaches</li>
                    <li>Use a mix of letters, numbers, and symbols</li>
                  </ul>
                </small>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;