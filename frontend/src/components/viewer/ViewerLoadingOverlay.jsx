// ViewerLoadingOverlay.jsx - Protein Viewer Loading Overlay Component

import React from 'react';

const ViewerLoadingOverlay = ({ isLoading, viewerType }) => {
  if (!isLoading) return null;
  
  return (
    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-90" style={{ zIndex: 10 }}>
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mb-0">Initialising {viewerType.toUpperCase()} viewer...</p>
      </div>
    </div>
  );
};


export default ViewerLoadingOverlay;