// PDBCodeInput.jsx - PDB Code Entry Interface Component

import React from 'react';
import { FaSpinner, FaSearch } from 'react-icons/fa';

// PDBCodeInput Component
const PDBCodeInput = ({
  pdbCode,            // Current PDB code input value
  setPdbCode,         // Function to update PDB code state
  isLoading,          // Loading state for structure retrieval
  onFetchStructure,   // Function to initiate structure retrieval
  onToggleSearch      // Function to toggle search interface
}) => {
  return (
    <div className="row">
      
      {/* Primary PDB Code Input Column */}
      <div className="col-md-8">
        <div className="mb-3">
          
          {/* Input Field Label with Scientific Context */}
          <label className="form-label">PDB Code (4 characters)</label>
          
          {/* Input Group with Code Entry and Retrieval Button */}
          <div className="input-group">
            
            {/* PDB Code Input Field with Validation */}
            <input
              type="text"
              className="form-control text-uppercase"
              placeholder="e.g., 1ADG"
              value={pdbCode}
              onChange={(e) => setPdbCode(e.target.value.toUpperCase())}
              maxLength={4}
              disabled={isLoading}
            />
            
            {/* Structure Retrieval Button with Loading State */}
            <button
              className="btn btn-primary"
              onClick={onFetchStructure}
              disabled={isLoading || pdbCode.length !== 4}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="fa-spin me-2" />
                  Loading...
                </>
              ) : (
                'Fetch Structure'
              )}
            </button>
          </div>
          
          {/* Scientific Guidance and Example Information */}
          <div className="form-text">
            Enter a 4-character PDB code (e.g., 1ADG for Alcohol Dehydrogenase)
          </div>
        </div>
      </div>
      
      {/* Alternative Search Access Column */}
      <div className="col-md-4">
        <div className="mb-3">
          
          {/* Alignment Spacer for Visual Balance */}
          <label className="form-label">&nbsp;</label>
          
          {/* Database Search Alternative Button */}
          <button
            className="btn btn-outline-secondary w-100"
            onClick={onToggleSearch}
          >
            <FaSearch className="me-2" />
            Search PDB Database
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDBCodeInput;