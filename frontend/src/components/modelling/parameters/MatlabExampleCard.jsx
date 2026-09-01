// MatlabExampleCard.jsx - MATLAB Parameter Example Display Component


import React from 'react';

// MatlabExampleCard Component
const MatlabExampleCard = ({ preparation }) => {
  
  // Conditional Display Logic
  if (preparation.pdb_code?.toLowerCase() !== '1adg' || 
      preparation.segment_start !== 290 || 
      preparation.segment_end !== 301) {
    return null;
  }

  return (
    <div className="alert alert-info mt-3">
      
      {/* Educational Header with Scientific Context */}
      <h6>MATLAB Parameters (1ADG Segment 290-301):</h6>
      
      {/* Parameter Examples in Two-Column Layout */}
      <div className="row">
        
        {/* Left Column: Phi Angle Parameters */}
        <div className="col-md-6">
          
          {/* Target Phi Angles with Scientific Specifications */}
          <p className="mb-1"><strong>Target Phi Angles:</strong></p>
          <ul className="small mb-2">
            <li>Residue 291: -90°</li>
            <li>Residue 292: -110°</li>
            <li>Residue 293: -64°</li>
            <li>Residue 294: -90°</li>
          </ul>
          
          {/* Phi Constraint Example */}
          <p className="mb-1"><strong>Constrained Phi:</strong> 295, 296</p>
        </div>
        
        {/* Right Column: Psi Angle Parameters */}
        <div className="col-md-6">
          
          {/* Target Psi Angles with Scientific Specifications */}
          <p className="mb-1"><strong>Target Psi Angles:</strong></p>
          <ul className="small mb-2">
            <li>Residue 291: 122°</li>
            <li>Residue 292: -35°</li>
            <li>Residue 293: 147°</li>
          </ul>
          
          {/* Psi Constraint Example */}
          <p className="mb-1"><strong>Constrained Psi:</strong> 294, 295</p>
        </div>
      </div>
      
      {/* Educational Context and Scientific Explanation */}
      <small className="text-muted">
        Same residue can have both phi and psi targets - these are independent backbone angles.
      </small>
    </div>
  );
};

export default MatlabExampleCard;