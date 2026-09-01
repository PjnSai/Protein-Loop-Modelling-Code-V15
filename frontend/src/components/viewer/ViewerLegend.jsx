// ViewerLegend.jsx - Protein Viewer Legend and Status Component

import { FaRuler } from 'react-icons/fa';

const ViewerLegend = ({
  showControls,
  selectedChain,
  segmentStart,
  segmentEnd,
  isModelledStructure,
  viewerType,
  representation,
  viewerReady,
  isExpanded 
}) => {
  if (!showControls) {
    return null;
  }

  return (
    <div className="card-footer bg-light">
      <div className="row">
        <div className="col-md-8">
          <small className="text-muted">
            <strong>Legend:</strong>
            <span className="ms-2">
              {selectedChain && (
                <span className="badge bg-primary me-2">
                  Selected Chain ({selectedChain})
                </span>
              )}
              {segmentStart && segmentEnd && (
                <span className={`badge ${isModelledStructure ? 'bg-danger' : 'bg-warning'} me-2`}>
                  {isModelledStructure ? 'Modelled ' : 'Target '}Segment ({segmentStart}-{segmentEnd})
                </span>
              )}
              {isModelledStructure && (
                <span className="badge bg-success me-2">Modelled Structure</span>
              )}
              {isExpanded && (
                <span className="badge bg-info">Expanded View</span>
              )}
            </span>
          </small>
        </div>
        <div className="col-md-4 text-end">
          <small className="text-muted">
            Viewer: {viewerType.toUpperCase()} • Style: {representation}
            {viewerReady && <span className="text-success ms-1">●</span>}
            {isExpanded && <FaRuler className="text-warning ms-1" />}
          </small>
        </div>
      </div>
    </div>
  );
};

export default ViewerLegend;