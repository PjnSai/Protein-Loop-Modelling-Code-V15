// RequestResetForm.jsx - Password Reset Request Form Component

import React from 'react';
import InputField from '../ui/InputField';

// RequestResetForm Component

const RequestResetForm = ({ email, onChange, onSubmit, isLoading, error }) => (
  <form onSubmit={onSubmit} role="form">
    
    {/* Email Address Input for Reset Request */}
    <InputField
      label="Email Address"
      name="email"
      type="email"
      value={email}
      onChange={onChange}
      disabled={isLoading}
      placeholder="Enter your registered email"
    />

    {/* Error Message Display */}
    {error && (
      <div className="alert alert-danger alert-dismissible" role="alert">
        <strong>Error:</strong> {error}
      </div>
    )}

    {/* Reset Request Submit Button */}
    <div className="d-grid">
      <button
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Sending...
          </>
        ) : (
          'Request Reset Link'
        )}
      </button>
    </div>
    
  </form>
);

export default RequestResetForm;