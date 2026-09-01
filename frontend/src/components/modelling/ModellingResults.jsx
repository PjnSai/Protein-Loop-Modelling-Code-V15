// ModellingResults.jsx - Protein Loop Modelling Results Interface
 

import { FaPlay } from 'react-icons/fa';
import FullscreenViewer from '../viewer/FullscreenViewer';
import useFullscreen from '../../hooks/useFullscreen';
import JobInfoTable from './results/JobInfoTable';
import ParametersUsedTable from './results/ParametersUsedTable';
import ResultsSummaryTables from './results/ResultsSummaryTables';
import StructureComparison from './results/StructureComparison';
import ActionButtons from './results/ActionButtons';
import DemoCallToAction from './results/DemoCallToAction';
import SuccessCallToAction from './results/SuccessCallToAction';

// ModellingResults Component
const ModellingResults = ({
  modellingResults,     // Complete MATLAB computational results
  pdbData,              // Original protein structure data
  selectedChain,        // Selected protein chain identifier
  modellingParams,      // Complete modelling parameter configuration
  onDownloadDemo,       // Demo result download callback
  onDownloadAuth,       // Authenticated download callback
  onReset,              // Complete workflow reset callback
  onGoToDashboard,      // Dashboard navigation callback
  onRegister,           // User registration callback
  onLogin,              // User login callback
  onBack                // Return to parameters callback
}) => {

  // Fullscreen Viewer State Management
  const { 
    isFullscreen,        // Boolean flag indicating fullscreen state
    fullscreenData,      // Data payload for fullscreen viewer
    openFullscreen,      // Function to activate fullscreen mode
    closeFullscreen      // Function to close fullscreen viewer
  } = useFullscreen();

  // Job ID Copy Utility Function
  const copyJobId = () => {
    navigator.clipboard.writeText(modellingResults.job_id);
    alert('Job ID copied to clipboard!');
  };

  // Results Availability Check
  if (!modellingResults) {
    return null;
  }

  return (
    <div className="card">
      
      {/* Results Header with Step Identification */}
      <div className="card-header">
        <h5>Step 4: Modelling Results</h5>
      </div>
      
      {/* Results Content with Success/Failure State Handling */}
      <div className="card-body">
        {modellingResults.success ? (
          
          /* Successful Modelling Results Display */
          <div>
            
            {/* Job Information and Parameter Summary */}
            <div className="row">
              <JobInfoTable modellingResults={modellingResults} />
              <ParametersUsedTable modellingResults={modellingResults} />
            </div>

            {/* MATLAB Computational Results Display */}
            {modellingResults.results && (
              <div className="card mt-3">
                <div className="card-header">
                  <h6>
                    <FaPlay className="me-2" />
                    Loop Modelling Results
                    {modellingResults.demo_mode && <span className="badge bg-info ms-2">Demo</span>}
                  </h6>
                </div>
                <div className="card-body">
                  
                  {/* Scientific Results Summary */}
                  <ResultsSummaryTables modellingResults={modellingResults} />

                  {/* Structure Comparison Visualisation */}
                  <StructureComparison
                    modellingResults={modellingResults}
                    pdbData={pdbData}
                    selectedChain={selectedChain}
                    modellingParams={modellingParams}
                    openFullscreen={openFullscreen}
                  />
                  
                </div>
              </div>
            )}
            
            {/* Results Management Action Buttons */}
            <ActionButtons
              modellingResults={modellingResults}
              onDownloadDemo={onDownloadDemo}
              onDownloadAuth={onDownloadAuth}
              onReset={onReset}
              onGoToDashboard={onGoToDashboard}
              onRegister={onRegister}
              copyJobId={copyJobId}
            />
            
            {/* Demo Mode User Engagement Call-to-Action */}
            {modellingResults.demo_mode && (
              <DemoCallToAction 
                onRegister={onRegister}
                onLogin={onLogin}
              />
            )}
            
            {/* Authenticated User Success Messaging */}
            {!modellingResults.demo_mode && modellingResults.status === 'completed' && (
              <SuccessCallToAction />
            )}
            
          </div>
        ) : (
          
          /* Failed Modelling Results with Error Analysis */
          <div>
            
            {/* Error Information Display */}
            <div className="alert alert-danger">
              <strong>Modelling Job Failed</strong>
              <p className="mb-0 mt-2">{modellingResults.error}</p>
              {modellingResults.details && (
                <p className="mb-0"><small>{modellingResults.details}</small></p>
              )}
            </div>
            
            {/* Error Recovery Navigation Options */}
            <button
              className="btn btn-outline-primary me-2"
              onClick={onBack}
            >
              Back to Parameters
            </button>
            <button
              className="btn btn-secondary"
              onClick={onReset}
            >
              Start Over
            </button>
            
          </div>
        )}
      </div>
      
      {/* Integrated Fullscreen Viewer for Detailed Structure Analysis */}
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
      
    </div>
  );
};

export default ModellingResults;