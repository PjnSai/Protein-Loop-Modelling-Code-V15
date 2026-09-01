/* RegisterForm.jsx - User Registration Form Component */

import React, { useState } from 'react';
import InputField from '../ui/InputField';

/* RegisterForm Component */
export default function RegisterForm({ onSubmit, isLoading, error }) {
  // Registration Form State Management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  /* Input Change Handler */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Form Submission Handler */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {/* Email Address Input */}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter your email"
      />
      
      {/* Password Input */}
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Create a strong password"
      />
      
      {/* Password Requirements Guidance */}
      <div className="form-text mb-2">
        Password must be at least 8 characters and should not be found in data breaches.
      </div>
      
      {/* Password Confirmation Input */}
      <InputField
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Confirm your password"
      />

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Registration Submit Button */}
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </div>
      
    </form>
  );
}