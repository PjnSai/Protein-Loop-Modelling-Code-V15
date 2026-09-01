// SegmentInfoCard.jsx - Protein Segment Information Display Component

import React from 'react';

// SegmentInfoCard Component
const SegmentInfoCard = ({ preparation }) => {
  return (
    <div className="card">
      
      {/* Information Card Header */}
      <div className="card-header">
        <h6>Segment Information</h6>
      </div>
      
      {/* Structured Information Table */}
      <div className="card-body">
        <table className="table table-sm">
          <tbody>
            
            {/* Protein Structure Identification */}
            <tr>
              <td><strong>PDB Code:</strong></td>
              <td>{preparation.pdb_code}</td>
            </tr>
            
            {/* Protein Chain Specification */}
            <tr>
              <td><strong>Chain:</strong></td>
              <td>{preparation.chain}</td>
            </tr>
            
            {/* Loop Segment Boundary Definition */}
            <tr>
              <td><strong>Segment:</strong></td>
              <td>{preparation.segment_start} - {preparation.segment_end}</td>
            </tr>
            
            {/* Segment Length for Computational Context */}
            <tr>
              <td><strong>Length:</strong></td>
              <td>{preparation.segment_length} residues</td>
            </tr>
            
            {/* Computational Complexity Metric */}
            <tr>
              <td><strong>Est. DOF:</strong></td>
              <td>{preparation.degrees_of_freedom}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SegmentInfoCard;