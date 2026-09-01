// ActionButtons.jsx - Results Management Action Controls Component

import React from 'react';
import { FaDownload, FaCopy, FaUserPlus } from 'react-icons/fa';

// ActionButtons Component
const ActionButtons = ({ 
  modellingResults,    // Complete modelling results with metadata
  onDownloadDemo,      // Function for demo result download
  onDownloadAuth,      // Function for authenticated user download
  onReset,             // Function for complete workflow reset
  onGoToDashboard,     // Function for dashboard navigation
  onRegister,          // Function for user registration initiation
  copyJobId            // Function for job ID copy to clipboard
}) => {
  return (
    <div className="mt-4">
      
      {/* Demo Mode Action Controls */}
      {modellingResults.demo_mode && (
        <>
          {/* Demo Result Download with Temporary Access */}
          <button
            className="btn btn-success me-2"
            onClick={() => onDownloadDemo(modellingResults.job_id)}
          >
            <FaDownload className="me-2" />
            Download Demo Results
          </button>
          
          {/* User Registration Encouragement */}
          <button
            className="btn btn-primary me-2"
            onClick={onRegister}
          >
            <FaUserPlus className="me-2" />
            Register for Real Modelling
          </button>
        </>
      )}
      
      {/* Authenticated User Action Controls */}
      {!modellingResults.demo_mode && modellingResults.status === 'completed' && (
        <>
          {/* Permanent Result Download */}
          <button
            className="btn btn-success me-2"
            onClick={() => onDownloadAuth(modellingResults.job_id)}
          >
            <FaDownload className="me-2" />
            Download Results
          </button>
          
          {/* Dashboard Integration Navigation */}
          <button
            className="btn btn-primary me-2"
            onClick={onGoToDashboard}
          >
            View in Dashboard
          </button>
        </>
      )}
      
      {/* Common Workflow Management Actions */}
      <button
        className="btn btn-success me-2"
        onClick={onReset}
      >
        Start New Job
      </button>
      
      {/* Job Identification Management */}
      <button
        className="btn btn-outline-secondary"
        onClick={copyJobId}
      >
        <FaCopy className="me-2" />
        Copy Job ID
      </button>
    </div>
  );
};

export default ActionButtons;