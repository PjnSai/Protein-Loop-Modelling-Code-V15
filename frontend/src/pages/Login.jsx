/* Login.jsx - User Authentication Page */
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

// Form component for modular and reusable authentication interface
import LoginForm from '../components/forms/LoginForm';

// Authentication API integration
import { login } from '../api/auth';

/* Login Page Component */
const Login = () => {

  // UI State Management
  const [isLoading, setIsLoading] = useState(false);     // Loading state for authentication
  const [error, setError] = useState(null);          // Error display management

  // Navigation Management
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  /* Handle Login Form Submission */
  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      const { ok, data } = await login(formData);
      
      if (ok) {
        // Successful credential validation - proceed to OTP verification
        // Pass the return destination to OTP page for final redirect
        navigate('/otp', { 
          state: { 
            email: formData.email,
            returnTo: from // Preserve intended destination
          } 
        });
      } else {
        // Authentication failed - display error
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      // Network or system error handling
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              
              {/* Login Page Header */}
              <div className="text-center mb-4">
                <h3 className="fw-bold text-primary">Welcome Back</h3>
                <p className="text-muted">Sign in to your account</p>
                
                {/* Return Destination Indicator */}
                {from !== '/dashboard' && (
                  <small className="text-info">
                    You'll be redirected to {from} after signing in
                  </small>
                )}
              </div>

              {/* Login Form Component */}
              <LoginForm onSubmit={handleSubmit} isLoading={isLoading} error={error} />

              {/* Alternative Authentication Options */}
              <div className="text-center mt-4">
                <Link to="/request-reset" className="text-primary text-decoration-none">
                  Forgot your password?
                </Link>
              </div>
              
              <div className="text-center mt-3">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-primary text-decoration-none">
                    Create one here
                  </Link>
                </p>
              </div>
              
              {/* Navigation Back to Homepage */}
              <div className="text-center mt-3">
                <Link to="/" className="text-muted text-decoration-none">
                  ← Back to Home
                </Link>
              </div>
              
              {/* Security Information and User Guidance */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong>
                    <FaLock className="me-1" />
                    Security Notice:
                  </strong> After entering your credentials,
                  you'll receive a one-time password (OTP) via email for additional security.
                </small>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;