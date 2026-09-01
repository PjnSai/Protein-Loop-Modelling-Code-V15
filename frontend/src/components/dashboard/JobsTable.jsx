// JobsTable.jsx - Modelling Jobs Display Table Component

import { FaDna } from 'react-icons/fa';
import { EmptyState, StatusBadge } from '../ui';
import PaginationControls from './PaginationControls';

// JobsTable Component
const JobsTable = ({ 
  jobs, 
  currentPage, 
  totalPages, 
  onPageChange,
  onViewDetails, 
  onDownloadResults, 
  onCancelJob,
  onDeleteJob,
  formatDate 
}) => {
  
  //Empty State Display
  if (jobs.length === 0) {
    return (
      <EmptyState
        icon={<FaDna size={64} className="text-muted" />}
        title="No modelling jobs yet"
        description="Start your first protein loop modelling job to see results here"
        action={
          <a href="/modelling" className="btn btn-primary">
            Create Your First Job
          </a>
        }
        className="card"
      />
    );
  }

  return (
    <div className="card">
      
      {/* Table Header with Job Overview */}
      <div className="card-header">
        <h5 className="card-title mb-0">Recent Jobs</h5>
      </div>
      
      {/* Table Body with Job Listings */}
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            
            {/* Table Column Headers */}
            <thead className="table-light">
              <tr>
                <th>PDB Code</th>
                <th>Chain</th>
                <th>Segment</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            
            {/* Table Data Rows */}
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  
                  {/* PDB Code Display with Scientific Emphasis */}
                  <td>
                    <span className="fw-bold text-primary">{job.pdb_code}</span>
                  </td>
                  
                  {/* Protein Chain Identifier */}
                  <td>{job.chain}</td>
                  
                  {/* Loop Segment Range for Context */}
                  <td>{job.segment_start}-{job.segment_end}</td>
                  
                  {/* Job Status with Visual Indication */}
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  
                  {/* Creation Timestamp and Performance Metrics */}
                  <td>
                    <small className="text-muted">{formatDate(job.created_at)}</small>
                    {job.processing_time && (
                      <div className="small text-success">
                        Processed in {job.processing_time.toFixed(1)}s
                      </div>
                    )}
                  </td>
                  
                  {/* Job Management Action Controls */}
                  <td>
                    <div className="btn-group btn-group-sm">
                      
                      {/* View Details Action - Available for All Jobs */}
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => onViewDetails(job.job_id)}
                        title="View comprehensive job details and analysis"
                      >
                        <svg width="16" height="16" fill="currentColor">
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                        </svg>
                      </button>
                      
                      {/* Download Results Action - Available for Completed Jobs */}
                      {job.has_results && (
                        <button
                          className="btn btn-outline-success"
                          onClick={() => onDownloadResults(job.job_id)}
                          title="Download modelling results as PDB file"
                        >
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                          </svg>
                        </button>
                      )}
                      
                      {/* Cancel Job Action - Available for Running Jobs */}
                      {job.status === 'running' && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onCancelJob(job.job_id)}
                          title="Cancel currently running modelling job"
                        >
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                          </svg>
                        </button>
                      )}
                      
                      {/* Delete Job Action - Available for Jobs */}
                      {(job.status === 'completed' || job.status === 'failed' || job.status === 'cancelled') && (
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => onDeleteJob(job.job_id)}
                          title="Permanently delete job and associated data"
                        >
                          <svg width="16" height="16" fill="currentColor">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                          </svg>
                        </button>
                      )}
                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination Controls for Navigation */}
      <PaginationControls 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      
    </div>
  );
};

export default JobsTable;