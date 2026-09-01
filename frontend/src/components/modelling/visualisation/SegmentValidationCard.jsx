// SegmentValidationCard.jsx - Scientific Segment Validation Interface

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

// SegmentValidationCard Component
const SegmentValidationCard = ({ 
  selectedChain,       // Currently selected protein chain identifier
  pdbData,            // Complete protein structure data with analysis
  modellingParams     // Current modelling parameters with segment information
}) => {
  
  // Component Display Validation
  if (!selectedChain || !pdbData.analysis?.residues?.[selectedChain]) {
    return null;
  }

  // Extract chain-specific residue information for validation
  const chainData = pdbData.analysis.residues[selectedChain];
  const segmentStart = parseInt(modellingParams.segment_start);
  const segmentEnd = parseInt(modellingParams.segment_end);

  // Segment Validation Assessment
  const getValidationAlert = () => {
    // Skip validation if segment parameters are incomplete
    if (!modellingParams.segment_start || !modellingParams.segment_end) {
      return null;
    }

    // Boundary Validation
    if (segmentStart < chainData.range?.[0] || segmentEnd > chainData.range?.[1]) {
      return (
        <div className="alert alert-warning alert-sm">
          Segment outside chain range
        </div>
      );
    }
    
    // Minimum Length Validation
    if (segmentEnd - segmentStart < 3) {
      return (
        <div className="alert alert-warning alert-sm">
          Segment too short (min 3 residues)
        </div>
      );
    }
    
    // Processing Complexity Warning
    if (segmentEnd - segmentStart > 20) {
      return (
        <div className="alert alert-info alert-sm">
          <FaInfoCircle className="me-1" />
          Large segment - may take longer to process
        </div>
      );
    }
    
    // Valid Configuration Confirmation
    return (
      <div className="alert alert-success alert-sm">
        Valid segment ({segmentEnd - segmentStart + 1} residues)
      </div>
    );
  };

  return (
    <div className="card mt-3">
      
      {/* Card Header with Chain Identification */}
      <div className="card-header">
        <h6>Chain {selectedChain} Information</h6>
      </div>
      
      {/* Chain Information and Validation Content */}
      <div className="card-body">
        
        {/* Chain Residue Range Information */}
        <p><strong>Residue Range:</strong> {chainData.range?.[0]} - {chainData.range?.[1]}</p>
        
        {/* Total Residue Count */}
        <p><strong>Total Residues:</strong> {chainData.count}</p>
        
        {/* Real-time Segment Validation Feedback */}
        {modellingParams.segment_start && modellingParams.segment_end && (
          <div className="mt-2">
            {getValidationAlert()}
          </div>
        )}
      </div>
    </div>
  );
};

export default SegmentValidationCard;