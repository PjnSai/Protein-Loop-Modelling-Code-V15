/* LoginForm.jsx - User Authentication Form Component */

import React, { useState } from 'react';
import InputField from '../ui/InputField';

/* LoginForm Component */
const LoginForm = ({ onSubmit, isLoading, error }) => {
  // Form State Management
  const [formData, setFormData] = useState({ email: '', password: '' });

  /* Input Change Handler */
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* Form Submission Handler */
  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      
      {/* Email Address Input Field */}
      <InputField
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter your email"
      />
      
      {/* Password Input Field */}
      <InputField
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Enter your password"
      />
      
      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Submit Button with Loading State */}
      <div className="d-grid">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </div>
      
    </form>
  );
};

export default LoginForm;