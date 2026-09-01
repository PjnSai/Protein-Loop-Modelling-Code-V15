/* ResultsSummaryCard.jsx - Modelling Results Summary Component */

import React from 'react';

/* ResultsSummaryCard Component */
const ResultsSummaryCard = ({ selectedJob }) => {
  
  /* Results Availability Check */
  if (!selectedJob.results) {
    return null;
  }

  return (
    <div className="card mt-3">
      
      {/* Card Header with Results Overview */}
      <div className="card-header">
        <h6 className="mb-0">Results Summary</h6>
      </div>
      
      {/* Card Body with Metrics Table */}
      <div className="card-body">
        <table className="table table-sm">
          <tbody>
            
            {/* Model Generated */}
            <tr>
              <td><strong>Models Generated:</strong></td>
              <td>{selectedJob.results.n_models}</td>
            </tr>
            
            {/* Final Distance: */}
            <tr>
              <td><strong>Final Distance:</strong></td>
              <td>{selectedJob.results.final_distance?.toFixed(4)}</td>
            </tr>
            
            {/* Iterations Used */}
            <tr>
              <td><strong>Iterations Used:</strong></td>
              <td>{selectedJob.results.n_iterations_used}</td>
            </tr>
            
            {/* Degrees of Freedom */}
            <tr>
              <td><strong>Degrees of Freedom:</strong></td>
              <td>{selectedJob.results.degrees_of_freedom}</td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsSummaryCard;