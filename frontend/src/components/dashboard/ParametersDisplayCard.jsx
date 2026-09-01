// ParametersDisplayCard.jsx - Modelling Parameters Display Component

import React from 'react';

/* ParametersDisplayCard Component */
const ParametersDisplayCard = ({ selectedJob }) => {
  return (
    <div className="card">
      
      {/* Card Header with Parameter Overview */}
      <div className="card-header">
        <h6 className="mb-0">Modelling Parameters</h6>
      </div>
      
      {/* Card Body with Structured Parameter Display */}
      <div className="card-body">
        
        {/* Basic Computational Parameters */}
        <div className="row">
          <div className="col-sm-6">
            <strong>Iterations:</strong> {selectedJob.parameters.n_iterations}
          </div>
          <div className="col-sm-6">
            <strong>Segment:</strong> {selectedJob.segment_start}-{selectedJob.segment_end}
          </div>
        </div>
        
        {/* Target Phi Angle Parameters */}
        <div className="mt-2">
          <strong>Target Phi:</strong> 
          {selectedJob.parameters?.target_phi?.length > 0 ? 
            selectedJob.parameters.target_phi.map((t, i) => 
              <span key={i} className="badge bg-info me-1 ms-1">
                {t.residue}: {t.angle}°
              </span>
            ) : <span className="text-muted ms-1">None</span>
          }
        </div>
        
        {/* Target Psi Angle Parameters */}
        <div className="mt-2">
          <strong>Target Psi:</strong>
          {selectedJob.parameters?.target_psi?.length > 0 ? 
            selectedJob.parameters.target_psi.map((t, i) => 
              <span key={i} className="badge bg-info me-1 ms-1">
                {t.residue}: {t.angle}°
              </span>
            ) : <span className="text-muted ms-1">None</span>
          }
        </div>
        
        {/* Constrained Phi Residue Parameters */}
        <div className="mt-2">
          <strong>Constrained Phi:</strong>
          {selectedJob.parameters?.constrained_phi?.length > 0 ? 
            selectedJob.parameters.constrained_phi.map((r, i) => 
              <span key={i} className="badge bg-warning me-1 ms-1">
                {r}
              </span>
            ) : <span className="text-muted ms-1">None</span>
          }
        </div>
        
        {/* Constrained Psi Residue Parameters */}
        <div className="mt-2">
          <strong>Constrained Psi:</strong>
          {selectedJob.parameters?.constrained_psi?.length > 0 ? 
            selectedJob.parameters.constrained_psi.map((r, i) => 
              <span key={i} className="badge bg-warning me-1 ms-1">
                {r}
              </span>
            ) : <span className="text-muted ms-1">None</span>
          }
        </div>
        
      </div>
    </div>
  );
};

export default ParametersDisplayCard;