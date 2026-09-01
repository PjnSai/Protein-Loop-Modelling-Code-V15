// QuickStartExamples.jsx - Rapid Testing Configuration Component
 
import React from 'react';

// QuickStartExamples Component
const QuickStartExamples = ({ 
  setPdbCode,          // Function to update PDB code state
  setModellingParams   // Function to update modelling parameter state
}) => {
  
  // 1ADG Automated Configuration Handler
  const handleADGClick = () => {
    setPdbCode('1ADG');
    
    // Automated parameter configuration with validated values
    setModellingParams(prev => ({
      ...prev,
      segment_start: '290',  // Loop region start position
      segment_end: '301'     // Loop region end position
    }));
  };

  return (
    <div className="mt-3 p-3 border rounded bg-light">
      
      {/* Quick Start Interface Header */}
      <h6>Quick Start Examples - Tested Working Parameters</h6>
      
      {/* Examples Selection Section */}
      <div className="row">
        <div className="col-md-12">
          
          {/* Section Label for Testing Examples */}
          <strong>Best Testing Examples:</strong>
          
          {/* Protein Structure Selection Buttons */}
          <div className="mt-2">
            
            {/* Recommended Primary Option with Automated Configuration */}
            <button
              className="btn btn-sm btn-success me-2 mb-2"
              onClick={handleADGClick}
              title="1ADG Chain A, Segment 290-301 (Alcohol Dehydrogenase flexible loop)"
            >
              1ADG (Recommended)
            </button>
            
            {/* Alternative Protein Structure Options */}
            <button
              className="btn btn-sm btn-outline-primary me-2 mb-2"
              onClick={() => setPdbCode('1UBQ')}
            >
              1UBQ
            </button>
            <button
              className="btn btn-sm btn-outline-primary me-2 mb-2"
              onClick={() => setPdbCode('2LYZ')}
            >
              2LYZ
            </button>
            <button
              className="btn btn-sm btn-outline-primary me-2 mb-2"
              onClick={() => setPdbCode('1CRN')}
            >
              1CRN
            </button>
          </div>
          
          {/* Scientific Context and Rationale */}
          <small className="text-muted">
            1ADG Chain A segment 290-301 represents a flexible loop region suitable for modelling
          </small>
        </div>
      </div>
    </div>
  );
};

export default QuickStartExamples;