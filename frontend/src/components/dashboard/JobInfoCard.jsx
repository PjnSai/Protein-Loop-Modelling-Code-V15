// JobInfoCard.jsx - Job Information Display Card Component

import React from 'react';
import { StatusBadge } from '../ui';

// JobInfoCard Component
 
const JobInfoCard = ({ 
  selectedJob, 
  formatDate, 
  onDownloadResults 
}) => {
  return (
    <div className="card">
      
      {/* Card Header with Title */}
      <div className="card-header">
        <h6 className="mb-0">Job Information</h6>
      </div>
      
      {/* Card Body with Structured Data Table */}
      <div className="card-body">
        <table className="table table-sm">
          <tbody>
            
            {/* Job Unique Identifier */}
            <tr>
              <td><strong>Job ID:</strong></td>
              <td><small>{selectedJob.job_id}</small></td>
            </tr>
            
            {/* Job Status with Badge */}
            <tr>
              <td><strong>Status:</strong></td>
              <td>
                <StatusBadge status={selectedJob.status} />
              </td>
            </tr>
            
            {/* Job Creation Timestamp */}
            <tr>
              <td><strong>Created:</strong></td>
              <td><small>{formatDate(selectedJob.created_at)}</small></td>
            </tr>
            
            {/* Job Completion Timestamp (Conditional) */}
            {selectedJob.completed_at && (
              <tr>
                <td><strong>Completed:</strong></td>
                <td><small>{formatDate(selectedJob.completed_at)}</small></td>
              </tr>
            )}
            
            {/* Processing Performance Metrics (Conditional) */}
            {selectedJob.processing_time && (
              <tr>
                <td><strong>Processing Time:</strong></td>
                <td>{selectedJob.processing_time.toFixed(2)}s</td>
              </tr>
            )}
            
            {/* Error Message Display (Conditional) */}
            {selectedJob.error_message && (
              <tr>
                <td><strong>Error:</strong></td>
                <td><small className="text-danger">{selectedJob.error_message}</small></td>
              </tr>
            )}
            
          </tbody>
        </table>
        
        {/* Download Results Button (Conditional) */}
        {selectedJob.has_results && (
          <div className="d-grid">
            <button 
              className="btn btn-success"
              onClick={() => onDownloadResults(selectedJob.job_id)}
              title="Download modelling results as PDB file"
            >
              Download Results
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default JobInfoCard;