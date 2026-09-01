//StructureInfoCard.jsx - Protein Structure Information Display Component

import React from 'react';

// StructureInfoCard Component
const StructureInfoCard = ({ pdbData }) => {
  return (
    <div className="card">
      
      {/* Card Header with Information Category */}
      <div className="card-header">
        <h6>Structure Information</h6>
      </div>
      
      {/* Structured Information Table */}
      <div className="card-body">
        <table className="table table-sm">
          <tbody>
            
            {/* Structure Database Identification */}
            <tr>
              <td><strong>PDB Code:</strong></td>
              <td>{pdbData.pdb_code}</td>
            </tr>
            
            {/* Biological and Functional Context */}
            <tr>
              <td><strong>Title:</strong></td>
              <td>{pdbData.analysis?.title || 'N/A'}</td>
            </tr>
            
            {/* Experimental Method Information */}
            <tr>
              <td><strong>Method:</strong></td>
              <td>{pdbData.analysis?.method || 'N/A'}</td>
            </tr>
            
            {/* Structure Resolution with Scientific Units */}
            <tr>
              <td><strong>Resolution:</strong></td>
              <td>{pdbData.analysis?.resolution ? `${pdbData.analysis.resolution}Å` : 'N/A'}</td>
            </tr>
            
            {/* Protein Chain Composition */}
            <tr>
              <td><strong>Chains:</strong></td>
              <td>{(pdbData.analysis?.chains || []).join(', ')}</td>
            </tr>
            
            {/* Total Residue Count for Structural Context */}
            <tr>
              <td><strong>Total Residues:</strong></td>
              <td>{pdbData.analysis?.total_residues || 0}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StructureInfoCard;