// ViewerNoDataDisplay.jsx - Protein Viewer No Data Display Component

const ViewerNoDataDisplay = ({ height }) => {
  return (
    <div className="alert alert-info" style={{ height: `${height}px` }}>
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <h6>No Structure Data</h6>
          <p className="mb-0">PDB content not available for visualisation</p>
        </div>
      </div>
    </div>
  );
};

export default ViewerNoDataDisplay;