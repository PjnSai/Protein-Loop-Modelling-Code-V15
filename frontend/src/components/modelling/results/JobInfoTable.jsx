// JobInfoTable.jsx - Job Metadata Display Component

import React from 'react';

// JobInfoTable Component

const JobInfoTable = ({ modellingResults }) => {
  return (
    <div className="col-md-6">
      
      {/* Table Header */}
      <h6>Job Information</h6>
      
      {/* Job Metadata Table */}
      <table className="table table-sm">
        <tbody>
          
          {/* Unique Job Identifier */}
          <tr>
            <td><strong>Job ID:</strong></td>
            <td><code>{modellingResults.job_id}</code></td>
          </tr>
          
          {/* Job Status with Colour Coding */}
          <tr>
            <td><strong>Status:</strong></td>
            <td>
              <span className={`badge ${modellingResults.status === 'completed' ? 'bg-success' : 'bg-info'}`}>
                {modellingResults.status}
              </span>
            </td>
          </tr>
          
          {/* Original Protein Structure Reference */}
          <tr>
            <td><strong>PDB Code:</strong></td>
            <td>{modellingResults.pdb_code}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default JobInfoTable;