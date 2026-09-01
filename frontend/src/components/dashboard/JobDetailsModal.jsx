// JobDetailsModal.jsx - Job Details Modal Component
import React from 'react';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import ProteinViewer from '../ProteinViewer';
import FullscreenViewer from '../viewer/FullscreenViewer';
import useFullscreen from '../../hooks/useFullscreen';
import { StatusBadge } from '../ui';
import StructureComparisonSection from './StructureComparisonSection';
import JobInfoCard from './JobInfoCard';
import ParametersDisplayCard from './ParametersDisplayCard';
import ResultsSummaryCard from './ResultsSummaryCard';

//JobDetailsModal Component
const JobDetailsModal = ({ 
  selectedJob, 
  isOpen, 
  onClose, 
  onDownloadResults,
  formatDate 
}) => {
  
  // Fullscreen viewer state management for detailed structure analysis
  const { 
    isFullscreen, 
    fullscreenData, 
    openFullscreen, 
    closeFullscreen 
  } = useFullscreen();

  // Early return when modal is not active or job data unavailable
  if (!isOpen || !selectedJob) {
    return null;
  }

  return (
    <>
      {/* Main Job Details Modal */}
      <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-fullscreen">
          <div className="modal-content">
            
            {/* Modal Header with Job Identification */}
            <div className="modal-header">
              <h5 className="modal-title">
                Job Details - {selectedJob.pdb_code} Chain {selectedJob.chain}
              </h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={onClose}
                aria-label="Close job details modal"
              ></button>
            </div>
            
            {/* Modal Body with Two-Column Layout */}
            <div className="modal-body">
              <div className="row">
                
                {/* Left Column: Structure Analysis and Parameters */}
                <div className="col-lg-8 col-md-12">
                  
                  {/* Structure Comparison Visualisation */}
                  <StructureComparisonSection
                    selectedJob={selectedJob}
                    openFullscreen={openFullscreen}
                  />
                  
                  {/* Modelling Parameters Display */}
                  <ParametersDisplayCard selectedJob={selectedJob} />
                  
                </div>
                
                {/* Right Column: Job Information and Results */}
                <div className="col-lg-4 col-md-12">
                  
                  {/* Job Information Card with Status and Metadata */}
                  <JobInfoCard
                    selectedJob={selectedJob}
                    formatDate={formatDate}
                    onDownloadResults={onDownloadResults}
                  />
                  
                  {/* Results Summary with Scientific Metrics */}
                  <ResultsSummaryCard selectedJob={selectedJob} />
                  
                </div>
              </div>
            </div>
            
            {/* Modal Footer with Action Controls */}
            <div className="modal-footer">
              
              {/* Modal Close Button */}
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              
              {/* Results Download Button (Conditional) */}
              {selectedJob.has_results && (
                <button 
                  className="btn btn-success"
                  onClick={() => onDownloadResults(selectedJob.job_id)}
                  title="Download modelling results as PDB file"
                >
                  Download Results
                </button>
              )}
              
            </div>
          </div>
        </div>
      </div>

      {/* Integrated Fullscreen Viewer for Detailed Analysis */}
      <FullscreenViewer
        isOpen={isFullscreen}
        onClose={closeFullscreen}
        title={fullscreenData?.title}
        pdbContent={fullscreenData?.pdbContent}
        pdbCode={fullscreenData?.pdbCode}
        selectedChain={fullscreenData?.selectedChain}
        segmentStart={fullscreenData?.segmentStart}
        segmentEnd={fullscreenData?.segmentEnd}
        isModelledStructure={fullscreenData?.isModelledStructure}
      />
    </>
  );
};

export default JobDetailsModal;