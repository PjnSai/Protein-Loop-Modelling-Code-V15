/* OTPVerify.jsx - Two-Factor Authentication Verification Page */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShieldAlt } from 'react-icons/fa';

// Form component for OTP input and validation
import OTPForm from '../components/forms/OTPForm';

// Authentication API integration
import { verifyOTP, resendOTP } from '../api/auth';

// Authentication context for state management
import useAuth from '../hooks/useAuth';

/* OTPVerify Component */
const OTPVerify = () => {
  // OTP Input State
  const [otp, setOtp] = useState('');                     // Current OTP input value
  
  // UI State Management
  const [isLoading, setIsLoading] = useState(false);     // Loading state for requests
  const [error, setError] = useState(null);             // Error display management
  const [timeLeft, setTimeLeft] = useState(300);        // OTP expiration countdown (5 minutes)
  
  // Navigation and Route Management
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;                   // User email from login flow
  const returnTo = location.state?.returnTo || '/dashboard'; // Return destination preservation
  
  // Authentication Context Integration
  const { refreshUser } = useAuth();

  // Security Configuration Constants
  const OTP_EXPIRY = 300;      // OTP validity period in seconds (5 minutes)
  const RESEND_DELAY = 60;     // Minimum delay between resend requests (1 minute)

  /* Effect Hook - OTP Expiration Management */
  useEffect(() => {
    // Validate email presence from login flow
    if (!email) {
      navigate('/login');
      return;
    }

    // Setup expiration countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError('OTP has expired. Please login again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Cleanup timer on component unmount
    return () => clearInterval(timer);
  }, [email, navigate]);

  /* Handle OTP Input Changes */
  const handleChange = (e) => {
    // Extract numeric characters only and limit to 6 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    
    // Clear any existing errors on user input
    if (error) setError(null);
  };

  /* Handle OTP Verification Submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate complete OTP entry
    if (otp.length !== 6) return setError('Please enter the complete 6-digit OTP');

    setIsLoading(true);
    setError(null);

    try {
      const { ok, data } = await verifyOTP(email, otp);
      
      if (ok) {
        // Refresh authentication context after successful verification
        await refreshUser();
        
        // Small delay to ensure context update, then redirect to intended destination
        setTimeout(() => {
          navigate(returnTo, { replace: true });
        }, 100);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Handle OTP Resend Request */
  const handleResend = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { ok, data } = await resendOTP(email);
      
      if (ok) {
        setTimeLeft(300); // Reset expiration timer
        alert('New OTP sent to your email');
      } else {
        setError(data.error || 'Failed to resend OTP');
      }
    } catch {
      setError('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent rendering if email is missing
  if (!email) return null;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              
              {/* Verification Page Header */}
              <div className="text-center mb-4">
                
                {/* Security Icon */}
                <div className="text-primary mb-3">
                  <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zM3 6v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1zM5 8a1 1 0 0 1 2 0v2a1 1 0 1 1-2 0V8zm4 0a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0V8z" />
                  </svg>
                </div>
                
                <h3 className="fw-bold text-primary">Verify Your Identity</h3>
                <p className="text-muted">
                  We've sent a 6-digit code to<br />
                  <strong>{email}</strong>
                </p>
                
                {/* Return Destination Indicator */}
                {returnTo !== '/dashboard' && (
                  <small className="text-info">
                    You'll be redirected to {returnTo} after verification
                  </small>
                )}
              </div>

              {/* OTP Input Form */}
              <OTPForm
                otp={otp}
                onChange={handleChange}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                timeLeft={timeLeft}
                error={error}
              />

              {/* OTP Resend Section */}
              <div className="text-center mt-4">
                <p className="text-muted mb-2">Didn't receive the code?</p>
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleResend}
                  disabled={isLoading || timeLeft > (OTP_EXPIRY - RESEND_DELAY)}
                >
                  {timeLeft > (OTP_EXPIRY - RESEND_DELAY)
                    ? `Resend in ${Math.floor((timeLeft - (OTP_EXPIRY - RESEND_DELAY)) / 60)}:${((timeLeft - (OTP_EXPIRY - RESEND_DELAY)) % 60).toString().padStart(2, '0')}`
                    : 'Resend Code'}
                </button>
              </div>

              {/* Navigation Back to Login */}
              <div className="text-center mt-4">
                <Link to="/login" className="text-muted text-decoration-none">
                  ← Back to Login
                </Link>
              </div>

              {/* Security Information */}
              <div className="mt-4 p-3 bg-light rounded">
                <small className="text-muted">
                  <strong><FaShieldAlt className="me-1" /> Security Tips:</strong>
                  <ul className="mb-0 mt-1">
                    <li>Never share your OTP with anyone</li>
                    <li>The code is valid for 5 minutes only</li>
                    <li>Check your spam folder if you don't see the email</li>
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

export default OTPVerify;