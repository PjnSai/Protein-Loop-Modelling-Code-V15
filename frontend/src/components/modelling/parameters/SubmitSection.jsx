// SubmitSection.jsx - Parameter Submission and Navigation Component

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

// SubmitSection Component
const SubmitSection = ({
  onSubmit,           // Function to submit parameters for MATLAB processing
  onBack,             // Function to navigate back to structure visualisation
  isLoading,          // Loading state for MATLAB job processing
  hasConflicts,       // Conflict detection state for parameter validation
  isAuthenticated,    // User authentication status for mode determination
  systemStatus        // Current system status for processing guidance
}) => {
  return (
    <>
      {/* Parameter Submission Controls */}
      <div className="mt-4">
        
        {/* Primary Submission Button with Authentication-Aware Labelling */}
        <button
          className="btn btn-success btn-lg me-2"
          onClick={onSubmit}
          disabled={isLoading || hasConflicts}
        >
          {isLoading ? (
            <>
              <FaSpinner className="fa-spin me-2" />
              Submitting Job...
            </>
          ) : (
            <>
              {isAuthenticated ? 'Start Loop Modelling' : 'Run Demo Simulation'}
            </>
          )}
        </button>
        
        {/* Secondary Navigation Button */}
        <button
          className="btn btn-outline-secondary"
          onClick={onBack}
        >
          Back to Structure
        </button>
      </div>

      {/* Processing Status and User Guidance */}
      {isLoading && (
        <div className="alert alert-info mt-3">
          <strong>Processing...</strong> 
          {isAuthenticated 
            ? (systemStatus?.immediate_processing 
                ? 'Your modelling job is being processed immediately with MATLAB. This may take a few seconds or several minutes.'
                : 'Your modelling job is being submitted. This may take a few seconds or several minutes depending on the complexity and number of iterations.')
            : 'Running demo - this will complete in a few seconds or several minutes to show you what real results look like.'
          }
        </div>
      )}
    </>
  );
};

export default SubmitSection;