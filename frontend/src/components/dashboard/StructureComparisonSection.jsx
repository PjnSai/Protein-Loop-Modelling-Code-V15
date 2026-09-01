/* StructureComparisonSection.jsx - Protein Structure Comparison Component */

import React from 'react';
import { FaExpandArrowsAlt } from 'react-icons/fa';
import ProteinViewer from '../ProteinViewer';

/* StructureComparisonSection Component */
const StructureComparisonSection = ({ 
  selectedJob, 
  openFullscreen 
}) => {
  
  /* Structure Data Validation */
  if (!selectedJob.original_structure) {
    return null;
  }

  return (
    <div className="mb-4">
      
      {/* Comparison Section Header */}
      <h6>Structure Comparison: Original vs Modelled</h6>
      
      {/* Two-Column Structure Comparison Layout */}
      <div className="row">
        
        {/* Original Structure Visualisation Panel */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="card">
            
            {/* Original Structure Header with Controls */}
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <small><strong>Original Structure</strong></small>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => openFullscreen({
                    title: `${selectedJob.pdb_code} - Original Structure`,
                    pdbContent: selectedJob.original_structure,
                    pdbCode: selectedJob.pdb_code,
                    selectedChain: selectedJob.chain,
                    segmentStart: selectedJob.segment_start,
                    segmentEnd: selectedJob.segment_end,
                    isModelledStructure: false
                  })}
                  title="Expand to fullscreen for detailed structural analysis"
                >
                  <FaExpandArrowsAlt />
                </button>
              </div>
            </div>
            
            {/* Original Structure 3D Viewer */}
            <div className="card-body p-2">
              <ProteinViewer
                pdbContent={selectedJob.original_structure}
                pdbCode={selectedJob.pdb_code}
                selectedChain={selectedJob.chain}
                segmentStart={selectedJob.segment_start}
                segmentEnd={selectedJob.segment_end}
                height={500}
                showControls={true}
                isModelledStructure={false}
              />
            </div>
          </div>
        </div>
        
        {/* Modelled Structure Visualisation Panel */}
        <div className="col-lg-6 col-md-12 mb-3">
          <div className="card">
            
            {/* Modelled Structure Header with Controls */}
            <div className="card-header bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <small><strong>Modelled Structure</strong></small>
                {selectedJob.has_modelled_structure && selectedJob.modelled_structure && (
                  <button 
                    className="btn btn-outline-light btn-sm"
                    onClick={() => openFullscreen({
                      title: `${selectedJob.pdb_code} - Modelled Structure`,
                      pdbContent: selectedJob.modelled_structure,
                      pdbCode: `${selectedJob.pdb_code}_MOD`,
                      selectedChain: selectedJob.chain,
                      segmentStart: selectedJob.segment_start,
                      segmentEnd: selectedJob.segment_end,
                      isModelledStructure: true
                    })}
                    title="Expand to fullscreen for detailed structural analysis"
                  >
                    <FaExpandArrowsAlt />
                  </button>
                )}
              </div>
            </div>
            
            {/* Modelled Structure 3D Viewer with Conditional Content */}
            <div className="card-body p-2">
              {selectedJob.has_modelled_structure && selectedJob.modelled_structure ? (
                
                /* Successful Modelling - Display 3D Structure */
                <ProteinViewer
                  pdbContent={selectedJob.modelled_structure}
                  pdbCode={`${selectedJob.pdb_code}_MOD`}
                  selectedChain={selectedJob.chain}
                  segmentStart={selectedJob.segment_start}
                  segmentEnd={selectedJob.segment_end}
                  height={500}
                  showControls={true}
                  isModelledStructure={true}
                />
              ) : (
                
                /* Missing or Unavailable Modelled Structure */
                <div className="d-flex align-items-center justify-content-center" style={{height: '500px'}}>
                  <div className="text-center">
                    {selectedJob.status === 'completed' ? (
                      
                      /* Completed Job but Structure Unavailable */
                      <div>
                        <div className="mb-3">
                          <svg width="48" height="48" fill="currentColor" className="text-warning">
                            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                          </svg>
                        </div>
                        <h6>Modelled Structure Unavailable</h6>
                        <p className="small text-muted">Result file not found or unreadable</p>
                      </div>
                    ) : (
                      
                      /* Job Still in Progress */
                      <div>
                        <div className="mb-3">
                          <div className="spinner-border text-primary"></div>
                        </div>
                        <h6>Job {selectedJob.status}</h6>
                        <p className="small text-muted">Modelling in progress...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Comparison Legend and Visual Guide */}
      <div className="mt-3 text-center">
        <small className="text-muted">
          <span className="badge bg-primary me-2">Original</span>
          <span className="badge bg-warning me-2">
            Target Segment ({selectedJob.segment_start}-{selectedJob.segment_end})
          </span>
          {selectedJob.has_modelled_structure && (
            <span className="badge bg-danger">Modelled Segment</span>
          )}
          <span className="badge bg-info ms-2">
            <FaExpandArrowsAlt className="me-1" />
            Click fullscreen icons for detailed analysis
          </span>
        </small>
      </div>
      
    </div>
  );
};

export default StructureComparisonSection;