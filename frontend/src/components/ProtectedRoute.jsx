/* ProtectedRoute.jsx - Route Protection Component */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { LoadingSpinner } from './ui';

/* ProtectedRoute Component */
const ProtectedRoute = ({ 
  children, 
  redirectTo = '/login',
  showLoadingSpinner = true,
  requiredPermission = null 
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();

  /* Loading State Display */
  if (isLoading) {
    return showLoadingSpinner ? (
      <LoadingSpinner 
        text="Checking authentication..." 
        fullPage 
      />
    ) : null;
  }

  /* Authentication Redirection */
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  /* Permission Validation */
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          <h5>Access Denied</h5>
          <p>You don't have permission to access this page.</p>
          <a href="/dashboard" className="btn btn-primary">
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  /* Protected Content Rendering */
  return children;
};

/* Higher-Order Component for Route Protection */
export const withProtectedRoute = (Component, options = {}) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

export default ProtectedRoute;