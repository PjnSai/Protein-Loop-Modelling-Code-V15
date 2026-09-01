// ResultsSummaryTables.jsx - MATLAB Computational Results Component
 

import React from 'react';

// ResultsSummaryTables Component
const ResultsSummaryTables = ({ modellingResults }) => {
  return (
    <div className="row">
      
      {/* Primary Computational Metrics */}
      <div className="col-md-6">
        <table className="table table-sm">
          <tbody>
            
            {/* Model Generation Statistics */}
            <tr>
              <td><strong>Models Generated:</strong></td>
              <td>{modellingResults.results.n_models}</td>
            </tr>
            
            {/* Structural Quality Metric */}
            <tr>
              <td><strong>Final Distance:</strong></td>
              <td>{modellingResults.results.final_distance}</td>
            </tr>
            
            {/* Computational Iteration Count */}
            <tr>
              <td><strong>Iterations Used:</strong></td>
              <td>{modellingResults.results.n_iterations_used}</td>
            </tr>
            
            {/* Processing Performance Metric */}
            <tr>
              <td><strong>Processing Time:</strong></td>
              <td>{modellingResults.processing_time || modellingResults.results.optimization_time}s</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Structural Analysis Metrics */}
      <div className="col-md-6">
        <table className="table table-sm">
          <tbody>
            
            {/* Parameter Space Characterisation */}
            <tr>
              <td><strong>Degrees of Freedom:</strong></td>
              <td>{modellingResults.results.degrees_of_freedom}</td>
            </tr>
            
            {/* Baseline Structural Deviation */}
            <tr>
              <td><strong>RMSD Initial:</strong></td>
              <td>{modellingResults.results.rmsd_initial}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultsSummaryTables;