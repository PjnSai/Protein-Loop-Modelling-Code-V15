// IterationsControl.jsx - MATLAB Iteration Count Configuration Component

import React from 'react';

// IterationsControl Component

const IterationsControl = ({ 
  value,              // Current iteration count value
  onChange,           // Function to update iteration count with validation
  isAuthenticated,    // User authentication status for limit determination
  suggestedValue      // Intelligent suggested iteration count
}) => {
  return (
    <div className="mb-3">
      
      {/* Control Label with Scientific Context */}
      <label className="form-label">Number of Iterations</label>
      
      {/* Iteration Count Input with Validation */}
      <input
        type="number"
        className="form-control"
        value={value}
        onChange={(e) => {
          // Real-time Validation with Bound Enforcement
          const newValue = Math.max(
            1000,  // Minimum iterations for meaningful optimisation
            Math.min(
              isAuthenticated ? 50000 : 5000,  // Authentication-aware maximum
              parseInt(e.target.value) || 10000  // Default fallback value
            )
          );
          onChange(newValue);
        }}
        min="1000"
        max={isAuthenticated ? "50000" : "5000"}
        step="1000"
      />
      
      {/* Scientific Guidance and Limitation Information */}
      <div className="form-text">
        Suggested: {suggestedValue || 10000}
        {!isAuthenticated && <span className="text-warning"> (Demo: max 5000)</span>}
      </div>
    </div>
  );
};

export default IterationsControl;