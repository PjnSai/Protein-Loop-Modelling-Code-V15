// SuccessCallToAction.jsx - Authenticated User Success Component

import React from 'react';

//SuccessCallToAction Component
const SuccessCallToAction = () => {
  return (
    <div className="card mt-4 border-success">
      
      {/* Success Header */}
      <div className="card-header bg-success text-white">
        <h6 className="mb-0">Congratulations! Your Loop Modelling is Complete</h6>
      </div>
      
      {/* Success Content */}
      <div className="card-body">
        <p className="mb-3">
          Your protein loop has been successfully modelled using real MATLAB algorithms. 
          You can now:
        </p>
        
        {/* Capability Benefits Grid */}
        <div className="row">
          
          {/* Direct Result Actions */}
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>Download the modelled PDB structure</li>
              <li>Analyse the structural changes</li>
              <li>View detailed results in your dashboard</li>
            </ul>
          </div>
          
          {/* Research Applications */}
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>Compare original vs modelled structures</li>
              <li>Run additional modelling jobs</li>
              <li>Use for research and publication</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessCallToAction;