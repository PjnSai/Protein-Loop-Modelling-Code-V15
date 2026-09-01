// ViewerControls.jsx - Protein Viewer Control Interface Component
 

import { FaCrosshairs, FaRedo, FaExpand, FaCompress } from 'react-icons/fa';

// ViewerControls Component
const ViewerControls = ({
  // Viewer state
  viewerType,
  representation,
  isLoading,
  viewerReady,
  
  // Display info
  selectedChain,
  segmentStart,
  segmentEnd,
  isModelledStructure,
  
  // Viewer expansion state
  isExpanded,
  
  // Actions
  onSwitchViewer,
  onChangeRepresentation,
  onCenterView,
  onResetViewer,
  onToggleExpanded,
  
  // Control visibility
  showControls
}) => {
  // Early return when controls are hidden
  if (!showControls) {
    return null;
  }

  // Available representation styles for analysis
  const availableStyles = ['cartoon', 'line', 'stick', 'sphere'];

  return (
    <div className="card-header bg-light">
      <div className="row align-items-center">
        
        {/* Primary Control Section */}
        <div className="col-md-7">
          
          {/* Viewer Engine Selection */}
          <div className="btn-group btn-group-sm me-3" role="group">
            <button
              type="button"
              className={`btn ${viewerType === 'ngl' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onSwitchViewer('ngl')}
              disabled={isLoading}
              title="NGL Viewer - Advanced molecular graphics"
            >
              NGL
            </button>
            <button
              type="button"
              className={`btn ${viewerType === '3dmol' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => onSwitchViewer('3dmol')}
              disabled={isLoading}
              title="3DMol Viewer - Fast rendering"
            >
              3Dmol
            </button>
          </div>

          {/* Representation Style Selection */}
          <div className="btn-group btn-group-sm me-3" role="group">
            {availableStyles.map((style) => (
              <button
                key={style}
                type="button"
                className={`btn ${representation === style ? 'btn-secondary' : 'btn-outline-secondary'}`}
                onClick={() => onChangeRepresentation(style)}
                disabled={isLoading || !viewerReady}
                title={`Show ${style} representation`}
              >
                {style.charAt(0).toUpperCase() + style.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Control Section */}
        <div className="col-md-5 text-end">
          
          {/* Viewer Expansion Toggle */}
          <button
            className={`btn btn-sm me-2 ${isExpanded ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={onToggleExpanded}
            disabled={isLoading}
            title={isExpanded ? "Collapse to normal size" : "Expand for larger view"}
          >
            {isExpanded ? (
              <>
                <FaCompress className="me-1" />
                Collapse
              </>
            ) : (
              <>
                <FaExpand className="me-1" />
                Expand
              </>
            )}
          </button>

          {/* View Centering Control */}
          <button
            className="btn btn-outline-primary btn-sm me-2"
            onClick={onCenterView}
            disabled={isLoading || !viewerReady}
            title="Center View"
          >
            <FaCrosshairs className="me-1" />
            Center
          </button>
          
          {/* Viewer Reset Control */}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={onResetViewer}
            disabled={isLoading}
            title="Reset Viewer"
          >
            <FaRedo className="me-1" />
            Reset
          </button>
        </div>
      </div>
      
      {/* Status Information Display */}
      <div className="mt-2">
        <small className="text-muted">
          Status: 
          {isLoading && <span className="text-warning ms-1">Loading...</span>}
          {!isLoading && viewerReady && <span className="text-success ms-1">Ready</span>}
          {!isLoading && !viewerReady && <span className="text-danger ms-1">Error</span>}
          {viewerReady && (
            <span className="ms-2">
              {viewerType.toUpperCase()} • {representation}
              {selectedChain && ` • Chain ${selectedChain}`}
              {segmentStart && segmentEnd && ` • Segment ${segmentStart}-${segmentEnd}`}
              {isModelledStructure && ` • Modelled Structure`}
              {isExpanded && ` • Expanded View`}
            </span>
          )}
        </small>
      </div>
    </div>
  );
};

export default ViewerControls;