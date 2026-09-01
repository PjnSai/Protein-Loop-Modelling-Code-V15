/* OTPForm.jsx - Two-Factor Authentication Form Component */

import React from 'react';

/* OTPForm Component */
export default function OTPForm({ otp, onChange, onSubmit, isLoading, timeLeft, error }) {
  
  /* Time Formatting Utility */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={onSubmit}>
      
      {/* OTP Code Input Section */}
      <div className="mb-4">
        <label htmlFor="otp" className="form-label text-center d-block">
          Enter 6-Digit Code
        </label>
        <input
          type="text"
          className="form-control form-control-lg text-center"
          id="otp"
          value={otp}
          onChange={onChange}
          placeholder="000000"
          maxLength="6"
          style={{
            fontSize: '1.5rem',
            letterSpacing: '0.5rem',
            fontFamily: 'monospace',
          }}
          disabled={isLoading || timeLeft === 0}
          autoComplete="one-time-code"
        />
        
        {/* Expiration Timer Display */}
        <div className="form-text text-center">
          {timeLeft > 0 ? (
            <>Code expires in: <strong>{formatTime(timeLeft)}</strong></>
          ) : (
            <span className="text-danger">Code has expired</span>
          )}
        </div>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Verification Submit Button */}
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading || otp.length !== 6 || timeLeft === 0}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Verifying...
            </>
          ) : (
            'Verify & Sign In'
          )}
        </button>
      </div>
      
    </form>
  );
}