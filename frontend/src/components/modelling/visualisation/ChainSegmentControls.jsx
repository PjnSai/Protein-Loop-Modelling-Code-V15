// ChainSegmentControls.jsx - Protein Chain and Segment Selection Interface


import React from 'react';

// ChainSegmentControls Component
const ChainSegmentControls = ({ 
  pdbData,             // Complete protein structure data with chain analysis
  selectedChain,       // Currently selected protein chain identifier
  setSelectedChain,    // Function to update selected chain state
  modellingParams,     // Current modelling parameters with segment information
  setModellingParams   // Function to update modelling parameter state
}) => {
  return (
    <div className="row mt-3">
      
      {/* Protein Chain Selection Control */}
      <div className="col-md-4">
        <label className="form-label">Chain</label>
        <select
          className="form-select"
          value={selectedChain}
          onChange={(e) => setSelectedChain(e.target.value)}
        >
          {/* Chain Options with Residue Count Information */}
          {(pdbData.analysis?.chains || []).map(chain => (
            <option key={chain} value={chain}>
              Chain {chain} ({pdbData.analysis?.residues?.[chain]?.count || 0} residues)
            </option>
          ))}
        </select>
      </div>
      
      {/* Loop Segment Start Position Control */}
      <div className="col-md-4">
        <label className="form-label">Segment Start</label>
        <input
          type="number"
          className="form-control"
          value={modellingParams.segment_start}
          onChange={(e) => setModellingParams(prev => ({
            ...prev,
            segment_start: e.target.value
          }))}
          min={selectedChain && pdbData.analysis?.residues?.[selectedChain]?.range?.[0]}
          max={selectedChain && pdbData.analysis?.residues?.[selectedChain]?.range?.[1]}
          placeholder="Start residue"
        />
      </div>
      
      {/* Loop Segment End Position Control */}
      <div className="col-md-4">
        <label className="form-label">Segment End</label>
        <input
          type="number"
          className="form-control"
          value={modellingParams.segment_end}
          onChange={(e) => setModellingParams(prev => ({
            ...prev,
            segment_end: e.target.value
          }))}
          min={selectedChain && pdbData.analysis?.residues?.[selectedChain]?.range?.[0]}
          max={selectedChain && pdbData.analysis?.residues?.[selectedChain]?.range?.[1]}
          placeholder="End residue"
        />
      </div>
    </div>
  );
};

export default ChainSegmentControls;