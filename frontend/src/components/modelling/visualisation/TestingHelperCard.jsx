// TestingHelperCard.jsx - Automated Testing Configuration Component

import React from 'react';

// TestingHelperCard Component

const TestingHelperCard = ({ 
  pdbData,             // Complete protein structure data with identification
  setSelectedChain,    // Function to update selected chain state
  setModellingParams   // Function to update modelling parameter state
}) => {
  
  // Component Display Condition
  if (pdbData.pdb_code !== '1ADG') {
    return null;
  }

  // Automated Parameter Configuration Handler
  const handleAutoFill = () => {
    // Set validated chain selection
    setSelectedChain('A');
    
    // Configure validated segment boundaries
    setModellingParams(prev => ({
      ...prev,
      segment_start: '290',  // Loop start position
      segment_end: '301'     // Loop end position
    }));
  };

  return (
    <div className="mt-3 p-3 border rounded bg-success bg-opacity-10">
      
      {/* Testing Helper Header */}
      <h6 className="text-success">Testing Helper for 1ADG</h6>
      
      {/* Scientific Context and Guidance */}
      <p className="mb-2">This protein has known working parameters. Click to auto-fill:</p>
      
      {/* Automated Configuration Button */}
      <button
        className="btn btn-sm btn-success me-2"
        onClick={handleAutoFill}
      >
        Use Chain A, Segment 290-301 
      </button>
      
      {/* Scientific Rationale Information */}
      <small className="text-muted d-block mt-1">
        This is a flexible loop region suitable for testing
      </small>
    </div>
  );
};

export default TestingHelperCard;