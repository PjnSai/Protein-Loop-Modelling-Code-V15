// ResetPasswordForm.jsx - Password Reset Completion Form Component

import React from 'react';
import InputField from '../ui/InputField';

/* ResetPasswordForm Component */
export default function ResetPasswordForm({ formData, onChange, onSubmit, isLoading, error }) {
  return (
    <form onSubmit={onSubmit}>
      
      {/* New Password Input */}
      <InputField
        label="New Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={onChange}
        disabled={isLoading}
        placeholder="Enter new password"
      />
      
      {/* Password Security Requirements */}
      <div className="form-text mb-3">
        Password must be at least 8 characters and should not be found in data breaches.
      </div>

      {/* Password Confirmation Input */}
      <InputField
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={onChange}
        disabled={isLoading}
        placeholder="Confirm new password"
      />

      {/* Error Message Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Password Update Submit Button */}
      <div className="d-grid mt-4">
        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Updating Password...
            </>
          ) : (
            'Update Password'
          )}
        </button>
      </div>
      
    </form>
  );
}