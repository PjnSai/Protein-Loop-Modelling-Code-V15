// StructureComparison.jsx - Protein Structure Comparison Interface


import React from 'react';
import { FaExpandArrowsAlt, FaCheck } from 'react-icons/fa';
import ProteinViewer from '../../ProteinViewer';

// StructureComparison Component
const StructureComparison = ({ 
  modellingResults,    // Complete modelling results with structure data
  pdbData,             // Original protein structure for comparison
  selectedChain,       // Selected protein chain identifier
  modellingParams,     // Modelling parameters including segment boundaries
  openFullscreen       // Fullscreen viewer activation callback
}) => {
  return (
    <div className="mt-3">
      
      {/* Comparison Section Header */}
      <h6>Structure Comparison: Original vs Modelled</h6>
      
      {/* Side-by-Side Structure Comparison */}
      <div className="row">
        
        {/* Original Structure Viewer Panel */}
        <div className="col-md-6">
          <div className="card">
            
            {/* Original Structure Header with Fullscreen Control */}
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <small><strong>Original Structure</strong></small>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => openFullscreen({
                    title: `${modellingResults.pdb_code} - Original Structure`,
                    pdbContent: pdbData?.pdb_content,
                    pdbCode: pdbData?.pdb_code || modellingResults.pdb_code,
                    selectedChain: selectedChain,
                    segmentStart: parseInt(modellingParams.segment_start),
                    segmentEnd: parseInt(modellingParams.segment_end),
                    isModelledStructure: false
                  })}
                  title="View in fullscreen"
                >
                  <FaExpandArrowsAlt />
                </button>
              </div>
            </div>
            
            {/* Original Structure 3D Viewer */}
            <div className="card-body p-2">
              <ProteinViewer
                pdbContent={pdbData?.pdb_content}
                pdbCode={pdbData?.pdb_code || modellingResults.pdb_code}
                selectedChain={selectedChain}
                segmentStart={parseInt(modellingParams.segment_start)}
                segmentEnd={parseInt(modellingParams.segment_end)}
                height={300}
                showControls={true}
                isModelledStructure={false}
              />
            </div>
          </div>
        </div>
        
        {/* Modelled Structure Viewer Panel */}
        <div className="col-md-6">
          <div className="card">
            
            {/* Modelled Structure Header with Processing Mode Indicator */}
            <div className="card-header bg-success text-white">
              <div className="d-flex justify-content-between align-items-center">
                <small><strong>Modelled Structure {modellingResults.demo_mode ? '(Demo)' : '(Real MATLAB)'}</strong></small>
                <button 
                  className="btn btn-outline-light btn-sm"
                  onClick={() => openFullscreen({
                    title: `${modellingResults.pdb_code} - Modelled Structure`,
                    pdbContent: modellingResults.modelled_structure || modellingResults.results?.modelled_pdb_content,
                    pdbCode: `${modellingResults.pdb_code}_MOD`,
                    selectedChain: selectedChain,
                    segmentStart: parseInt(modellingParams.segment_start),
                    segmentEnd: parseInt(modellingParams.segment_end),
                    isModelledStructure: true
                  })}
                  title="View in fullscreen"
                >
                  <FaExpandArrowsAlt />
                </button>
              </div>
            </div>
            
            {/* Modelled Structure Content */}
            <div className="card-body p-2">
              {(modellingResults.modelled_structure || modellingResults.results?.modelled_pdb_content) ? (
                
                /* 3D Viewer for Modelled Structure */
                <ProteinViewer
                  pdbContent={modellingResults.modelled_structure || modellingResults.results.modelled_pdb_content}
                  pdbCode={`${modellingResults.pdb_code}_MOD`}
                  selectedChain={selectedChain}
                  segmentStart={parseInt(modellingParams.segment_start)}
                  segmentEnd={parseInt(modellingParams.segment_end)}
                  height={300}
                  showControls={true}
                  isModelledStructure={true}
                />
              ) : (
                
                /* Fallback Display for Completion Status */
                <div className="d-flex align-items-center justify-content-center" style={{height: '300px'}}>
                  <div className="text-center">
                    
                    {/* Success Icon */}
                    <div className="mb-3">
                      <FaCheck size={64} className="text-success" />
                    </div>
                    
                    {/* Completion Information */}
                    <h6>Modelling Complete</h6>
                    <p className="small text-muted">
                      {modellingResults.results.n_models} models generated<br/>
                      Final distance: {modellingResults.results.final_distance}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StructureComparison;