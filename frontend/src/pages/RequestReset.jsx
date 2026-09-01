/* RequestReset.jsx - Password Reset Request Page */

import { useState } from 'react';
import { Link } from 'react-router-dom';

// Authentication API integration
import { requestPasswordReset } from '../api/auth';

// Form component for password reset request
import RequestResetForm from '../components/forms/RequestResetForm';

/* RequestReset Component */
const RequestReset = () => {
  // Form State Management
  const [email, setEmail] = useState('');               // Email input for reset request
  
  // UI State Management
  const [isLoading, setIsLoading] = useState(false);   // Loading state for requests
  const [error, setError] = useState(null);            // Error display management
  const [success, setSuccess] = useState(false);       // Success state management

  /* Handle Email Input Changes */
  const handleChange = (e) => {
    setEmail(e.target.value);
    
    // Clear any existing errors on user input
    if (error) setError(null);
  };

  /* Handle Password Reset Request Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { ok, data } = await requestPasswordReset(email);
      
      if (ok) {
        // Success state - generic message for security
        setSuccess(true);
      } else {
        setError(data?.error || 'Could not send reset email.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success State - Reset Email Confirmation
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
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                  </svg>
                </div>
                
                <h5 className="text-success">Email Sent</h5>
                <p className="text-muted">Check your inbox for the reset link.</p>
                
                {/* Navigation Back to Login */}
                <Link to="/login" className="btn btn-outline-primary mt-3">
                  Back to Login
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Password Reset Request Interface
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              
              {/* Request Reset Page Header */}
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">Forgot Password?</h3>
                <p className="text-muted">Enter your email to receive a reset link</p>
              </div>

              {/* Password Reset Request Form */}
              <RequestResetForm
                email={email}
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

              {/* Process Information and Security Guidance */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  We'll send a secure link to your email to reset your password. 
                  It will expire in 10 minutes.
                </small>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestReset;