/* DashBoard.jsx - Job Management Dashboard */

import React, { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';

// UI Components
import { LoadingSpinner, ErrorAlert } from '../components/ui';

// Dashboard-specific components for modular interface
import StatisticsCards from '../components/dashboard/StatisticsCards';
import SystemStatusCard from '../components/dashboard/SystemStatusCard';
import JobsTable from '../components/dashboard/JobsTable';
import JobDetailsModal from '../components/dashboard/JobDetailsModal';

/* Dashboard Component */
const DashBoard = () => {
  
  // Job Management State
  const [jobs, setJobs] = useState([]);                    // Paginated job listings
  const [selectedJob, setSelectedJob] = useState(null);    // Job selected for detailed view
  const [currentPage, setCurrentPage] = useState(1);      // Current pagination page
  const [totalPages, setTotalPages] = useState(1);        // Total pages for pagination controls

  // UI State Management
  const [isLoading, setIsLoading] = useState(true);       // Loading state for data fetching
  const [error, setError] = useState(null);               // Error state for user feedback
  const [showJobModal, setShowJobModal] = useState(false); // Modal visibility control

  // Dashboard Analytics
  const [statistics, setStatistics] = useState({});       // User statistics and system metrics

  /* Effect Hook - Data Loading */
  useEffect(() => {
    fetchJobs();      // Load job listings for current page
    fetchStatistics(); // Load user activity statistics
  }, [currentPage]);   // Re-run when pagination changes

  /* Fetch Jobs from API */
  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/api/dashboard/jobs?page=${currentPage}`, {
        credentials: 'include' // Include session cookies for authentication
      });
      
      // Handle authentication expiration
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      
      if (response.ok) {
        setJobs(data.jobs);
        setTotalPages(data.pages);
      } else {
        setError(data.error || 'Failed to fetch jobs');
      }
    } catch (err) {
      setError('Network error: Unable to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  };

  /* Fetch User Statistics */
  const fetchStatistics = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/statistics', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setStatistics(data);
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      // Statistics failure is not critical - dashboard will remain functional
    }
  };

  /* Fetch Detailed Job Information */
  const fetchJobDetails = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/dashboard/job/${jobId}`, {
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSelectedJob(data);
        setShowJobModal(true);
      } else {
        setError(data.error || 'Failed to fetch job details');
      }
    } catch (err) {
      setError('Network error: Unable to fetch job details');
    }
  };

  /* Download Job Results */
  const downloadResults = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/modelling/job/${jobId}/download`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        // Create and trigger download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `modelling_results_${jobId}.pdb`;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup download resources
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to download results');
      }
    } catch (err) {
      setError('Network error: Unable to download results');
    }
  };

  /* Cancel Running Job */
  const cancelJob = async (jobId) => {
    if (!confirm('Are you sure you want to cancel this job?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/modelling/job/${jobId}/cancel`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchJobs(); // Refresh the jobs list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to cancel job');
      }
    } catch (err) {
      setError('Network error: Unable to cancel job');
    }
  };

  /* Delete Completed Job */
  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to permanently delete this job? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/modelling/job/${jobId}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchJobs(); // Refresh the jobs list
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete job');
      }
    } catch (err) {
      setError('Network error: Unable to delete job');
    }
  };

  /* Date Formatting Utility */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Show loading spinner during initial data fetch
  if (isLoading && jobs.length === 0) {
    return (
      <div className="container mt-4">
        <LoadingSpinner text="Loading activity jobs..." fullPage />
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 mt-4">
      
      {/* Dashboard Header with Navigation */}
      <div className="row align-items-center mb-4">
        <div className="col">
          <h2 className="fw-bold">Your Modelling Dashboard</h2>
          <p className="text-muted">View and manage your protein loop modelling jobs</p>
        </div>
        <div className="col-auto">
          <a href="/modelling" className="btn btn-primary">
            <FaPlus className="me-2" />
            New Modelling Job
          </a>
        </div>
      </div>

      {/* Error Alert Display */}
      <ErrorAlert 
        error={error}
        onDismiss={() => setError(null)}
        onRetry={fetchJobs}
      />

      {/* User Statistics Summary Cards */}
      <StatisticsCards statistics={statistics} />

      {/* System Status Information Card */}
      <SystemStatusCard statistics={statistics} />

      {/* Jobs Management Table */}
      <JobsTable 
        jobs={jobs}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onViewDetails={fetchJobDetails}
        onDownloadResults={downloadResults}
        onCancelJob={cancelJob}
        onDeleteJob={deleteJob}
        formatDate={formatDate}
      />

      {/* Job Details Modal for Detailed Information Display */}
      <JobDetailsModal 
        selectedJob={selectedJob}
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onDownloadResults={downloadResults}
        formatDate={formatDate}
      />
  
    </div>
  );
};

export default DashBoard;