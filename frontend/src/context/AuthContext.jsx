/* AuthContext.jsx - Authentication State Management */

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/apiClient';

/* Authentication Context */
export const AuthContext = createContext();

/* AuthProvider Component */
export const AuthProvider = ({ children }) => {
  // Authentication State Management
  const [user, setUser] = useState(null);                    // Current user information
  const [isLoading, setIsLoading] = useState(true);         // Loading state for auth operations
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication status

  /* Fetch User Authentication Status  */
  const fetchUser = async () => {
    setIsLoading(true);
    try {
      // Check authentication status using centralised API client
      const { ok, data } = await apiClient.checkAuthStatus();
      
      if (ok) {
        // User is authenticated - update context state
        setUser(data);
        setIsAuthenticated(true);
        console.log('User authenticated:', data.email);
      } else {
        // User is not authenticated - clear context state
        setUser(null);
        setIsAuthenticated(false);
        console.log('User not authenticated');
      }
    } catch (error) {
      // Error during authentication check - assume not authenticated
      console.error('Auth check error:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  /* Secure User Session Logout */
  const logout = async () => {
    try {
      // apiClient instead of direct fetch
      const { ok } = await apiClient.logout();
      
      if (ok) {
        // Successful logout - clear authentication state
        setUser(null);
        setIsAuthenticated(false);
        console.log('Logged out successfully');
        return { success: true };
      } else {
        console.error('Logout failed');
        return { success: false, error: 'Logout failed' };
      }
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  /* Initial Authentication Check */
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,                          // Current user information object
    isAuthenticated,               // Boolean authentication status
    isLoading,                     // Loading state for UI feedback
    refreshUser: fetchUser,        // Function to refresh authentication status
    logout,                        // Function to securely logout user
    
    /* Helper Method - Set Authenticated User */
    setAuthenticatedUser: (userData) => {
      setUser(userData);
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};