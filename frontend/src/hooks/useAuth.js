/* useAuth.js - Authentication Management Hook */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../api/apiClient';

/* useAuth Hook */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // Validate context availability and provide clear error messaging
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Extract authentication state and functions from context
  const { user, isAuthenticated, isLoading, refreshUser, logout, setAuthenticatedUser } = context;

  /* Login Function with Context Integration */
  const login = async (credentials) => {
    try {
      const { ok, data } = await apiClient.login(credentials);
      if (ok) {
        // Don't set authenticated state yet - wait for OTP verification
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /* OTP Verification with Authentication Context Update */
  const verifyOTP = async (email, otp) => {
    try {
      const { ok, data } = await apiClient.verifyOTP(email, otp);
      if (ok) {
        // Update auth context with user data
        setAuthenticatedUser(data.user);
        // Also refresh to get complete user data
        await refreshUser();
        return { success: true, data };
      } else {
        return { success: false, error: data.error || 'Invalid OTP' };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  /* Logout with Navigation Handling */
  const logoutUser = async () => {
    try {
      const result = await logout();
      if (result.success) {
        // Clear any additional local state if needed
        // The context already handles user/auth state clearing
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /* Authentication Status Check */
  const checkAuthStatus = async () => {
    try {
      await refreshUser();
      return { success: true, isAuthenticated };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /* Permission Check Helper */
  const hasPermission = (permission) => {
    // For now, just check if authenticated
    // Later can add role-based permissions
    return isAuthenticated;
  };

  return {
    // Authentication State
    user,                    // Current user information object
    isAuthenticated,         // Boolean authentication status
    isLoading,              // Loading state during auth operations
    
    // Authentication Actions
    login,                  // Login function with credential validation
    verifyOTP,              // OTP verification with context updates
    logout: logoutUser,     // Logout function with cleanup
    refreshUser,            // Refresh user data from backend
    checkAuthStatus,        // Verify current authentication status
    
    // Helper Functions
    hasPermission,          // Permission checking for access control
    
    // User Information Helpers
    userEmail: user?.email, // Quick access to user email
    userId: user?.id,       // Quick access to user ID
    isGuest: !isAuthenticated // Quick guest status check
  };
};

export default useAuth;