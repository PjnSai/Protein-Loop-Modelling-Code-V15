/* useApiCall.js - API Request Management Hook */

import { useState, useCallback } from 'react';

/* useApiCall Hook */
export const useApiCall = () => {
  // API Response State Management
  const [data, setData] = useState(null);           // Response data from successful requests
  const [loading, setLoading] = useState(false);   // Loading state for user feedback
  const [error, setError] = useState(null);        // Error state for user display

  /* Execute API Request */
  const execute = useCallback(async (apiFunction, ...args) => {
    setLoading(true);
    setError(null);

    try {
      const { ok, data: responseData } = await apiFunction(...args);
      
      if (ok) {
        // Successful API request - update data state
        setData(responseData);
        return { success: true, data: responseData };
      } else {
        // API request failed - handle error response
        const errorMsg = responseData?.error || 'Request failed';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      // Network or system error - provide user-friendly message
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      // Always clear loading state regardless of outcome
      setLoading(false);
    }
  }, []);

  /* Reset Hook State */
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,       // Current API response data
    loading,    // Loading state for UI feedback
    error,      // Error message for user display
    execute,    // Function to execute API requests
    reset       // Function to reset all state
  };
};

export default useApiCall;