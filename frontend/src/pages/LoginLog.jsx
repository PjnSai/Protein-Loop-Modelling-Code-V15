/* LoginLog.jsx - User Activity Monitoring Dashboard */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSync } from 'react-icons/fa';

// API service for log management operations
import * as logApi from '../services/logApi';

// Component imports for modular interface construction
import LogsTableSection from '../components/logs/LogsTableSection';
import SecurityInfoSection from '../components/logs/SecurityInfoSection';
import LogsHeader from '../components/logs/LogsHeader';

/* LoginLog Component*/
const LoginLog = () => {

  // Log Data Management
  const [logs, setLogs] = useState([]);                    // User activity log entries
  const [currentPage, setCurrentPage] = useState(1);      // Current pagination page
  const [totalPages, setTotalPages] = useState(1);        // Total pages for navigation
  const [debugInfo, setDebugInfo] = useState(null);       // Debug information for development
  
  // UI State Management
  const [isLoading, setIsLoading] = useState(true);       // Loading state for data fetching
  const [error, setError] = useState(null);               // Error state for user feedback
  
  // Log Management Controls
  const [daysToDelete, setDaysToDelete] = useState('all'); // Deletion preference
  const [isDeleting, setIsDeleting] = useState(false);    // Deletion operation state
  
  // Navigation for authentication redirection
  const navigate = useNavigate();

  /* Effect Hook - Log Data Loading */
  useEffect(() => {
    fetchLogs();
  }, [currentPage]); // Fetch again when pagination changes

  /* Fetch Activity Logs from API */
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await logApi.fetchLogs(currentPage, navigate);
      
      // Handle authentication redirection
      if (result.redirect) {
        return;
      }
      
      if (result.success) {
        setLogs(result.logs);
        setTotalPages(result.totalPages);
        setDebugInfo(result.debugInfo);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Fetch logs error:', err);
      setError('Network error: Unable to fetch logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading spinner during initial data fetch
  if (isLoading && logs.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  /* Delete User Activity Logs */
  const deleteLogs = async () => {
    setIsDeleting(true);
    
    try {
      const result = await logApi.deleteLogs(daysToDelete);
      
      // Handle user cancellation
      if (result.cancelled) {
        return;
      }
      
      if (result.success) {
        fetchLogs(); // Refresh logs after successful deletion
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Delete logs error:', err);
      setError('Network error: Unable to delete logs');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mt-4">
      
      {/* Page Header with Controls */}
      <LogsHeader
        debugInfo={debugInfo}
        isLoading={isLoading}
        daysToDelete={daysToDelete}
        setDaysToDelete={setDaysToDelete}
        isDeleting={isDeleting}
        onRefresh={fetchLogs}
        onDeleteLogs={deleteLogs}
      />
      
      {/* Error Alert Display */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          <strong>Error:</strong> {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {/* Development Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <div className="alert alert-info">
          <small>
            <strong>Debug:</strong> Logs count: {logs.length}, 
            Current page: {currentPage}, 
            Total pages: {totalPages},
            Loading: {isLoading.toString()},
            Error: {error || 'none'}
          </small>
        </div>
      )}
      
      {/* Activity Logs Table Section */}
      <LogsTableSection
        logs={logs}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onRefresh={fetchLogs}
      />
      
      {/* Security Information Section */}
      <SecurityInfoSection />
      
    </div>
  );
};

export default LoginLog;