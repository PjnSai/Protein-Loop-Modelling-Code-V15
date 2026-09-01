// StructureVisualisation.jsx - Protein Structure Analysis Interface

import { FaInfoCircle, FaExpandArrowsAlt } from 'react-icons/fa';
import ProteinViewer from '../ProteinViewer';
import FullscreenViewer from '../viewer/FullscreenViewer';
import useFullscreen from '../../hooks/useFullscreen';
import StructureInfoCard from './visualisation/StructureInfoCard';
import ChainSegmentControls from './visualisation/ChainSegmentControls';
import SegmentValidationCard from './visualisation/SegmentValidationCard';
import TestingHelperCard from './visualisation/TestingHelperCard';
import ActionButtons from './visualisation/ActionButtons';

// StructureVisualisation Component
const StructureVisualisation = ({
  pdbData,              // Complete protein structure data with analysis
  selectedChain,        // Currently selected protein chain identifier
  setSelectedChain,     // Function to update selected chain
  modellingParams,      // Current modelling parameters state
  setModellingParams,   // Function to update modelling parameters
  onContinue,           // Function to proceed to parameters configuration
  onReset,              // Function to reset entire workflow
  isLoading             // Loading state for user interface feedback
}) => {
  
  // Fullscreen Viewer State Management
  const { 
    isFullscreen,        // Boolean indicating fullscreen state
    fullscreenData,      // Data payload for fullscreen viewer
    openFullscreen,      // Function to activate fullscreen mode
    closeFullscreen      // Function to close fullscreen viewer
  } = useFullscreen();
  
  return (
    <div className="card">
      
      {/* Interface Header with Step Identification */}
      <div className="card-header">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Step 2: Structure Visualisation - {pdbData.pdb_code}</h5>
          
          {/* Fullscreen Expansion Control */}
          <button 
            className="btn btn-outline-primary"
            onClick={() => openFullscreen({
              title: `${pdbData.pdb_code} - Structure Analysis`,
              pdbContent: pdbData.pdb_content,
              pdbCode: pdbData.pdb_code,
              selectedChain: selectedChain,
              segmentStart: parseInt(modellingParams.segment_start),
              segmentEnd: parseInt(modellingParams.segment_end),
              isModelledStructure: false
            })}
            title="Expand to fullscreen for detailed structural analysis"
            disabled={isLoading}
          >
            <FaExpandArrowsAlt className="me-1" />
            Fullscreen
          </button>
        </div>
      </div>
      
      {/* Main Interface Content */}
      <div className="card-body">
        <div className="row">
          
          {/* Left Column: 3D Viewer and Controls */}
          <div className="col-md-8">
            
            {/* Interactive 3D Protein Viewer */}
            <ProteinViewer
              pdbContent={pdbData.pdb_content}
              pdbCode={pdbData.pdb_code}
              selectedChain={selectedChain}
              segmentStart={parseInt(modellingParams.segment_start)}
              segmentEnd={parseInt(modellingParams.segment_end)}
              height={400}
              isModelledStructure={false}
            />
            
            {/* Chain and Segment Selection Controls */}
            <ChainSegmentControls
              pdbData={pdbData}
              selectedChain={selectedChain}
              setSelectedChain={setSelectedChain}
              modellingParams={modellingParams}
              setModellingParams={setModellingParams}
            />
            
            {/* Testing Helper for Known Protein Structures */}
            <TestingHelperCard
              pdbData={pdbData}
              setSelectedChain={setSelectedChain}
              setModellingParams={setModellingParams}
            />

            {/* Workflow Navigation Action Buttons */}
            <ActionButtons
              onContinue={onContinue}
              onReset={onReset}
              isLoading={isLoading}
              selectedChain={selectedChain}
              modellingParams={modellingParams}
            />
            
          </div>
          
          {/* Right Column: Information and Validation */}
          <div className="col-md-4">
            
            {/* Protein Structure Information Display */}
            <StructureInfoCard pdbData={pdbData} />

            {/* Segment Selection Validation Feedback */}
            <SegmentValidationCard
              selectedChain={selectedChain}
              pdbData={pdbData}
              modellingParams={modellingParams}
            />
            
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
      
    </div>
  );
};

export default StructureVisualisation;