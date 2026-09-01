// ViewerInfoOverlay.jsx - Protein Viewer Information Overlay Component

const ViewerInfoOverlay = ({ 
  pdbCode, 
  viewerReady, 
  selectedChain, 
  segmentStart, 
  segmentEnd, 
  isModelledStructure, 
  isExpanded 
}) => {
  // Only display when viewer is ready and PDB code is available
  if (!pdbCode || !viewerReady) return null;
  
  return (
    <div className="position-absolute top-0 start-0 m-2 bg-dark bg-opacity-75 text-white px-2 py-1 rounded small">
      {pdbCode}
      {selectedChain && ` • Chain ${selectedChain}`}
      {segmentStart && segmentEnd && ` • Segment ${segmentStart}-${segmentEnd}`}
      {isModelledStructure && ' • Modelled'}
      {isExpanded && ' • Expanded View'}
    </div>
  );
};

export default ViewerInfoOverlay;