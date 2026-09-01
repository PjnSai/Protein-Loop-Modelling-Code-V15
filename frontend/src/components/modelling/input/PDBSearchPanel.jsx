// PDBSearchPanel.jsx - Protein Database Search Interface Component

import React from 'react';
import { FaSpinner } from 'react-icons/fa';

// PDBSearchPanel Component
const PDBSearchPanel = ({
  showSearch,         // Boolean for search panel visibility
  searchQuery,        // Current search query string
  setSearchQuery,     // Function to update search query state
  searchResults,      // Array of search results with metadata
  onSearchPDB,        // Function to execute database search
  onSelectFromSearch, // Function to handle result selection
  isLoading          // Loading state for search operations
}) => {
  
  // Conditional Display Logic
  if (!showSearch) {
    return null;
  }

  // Enter Key Search Handler
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      const trimmedQuery = searchQuery.trim();
      if (trimmedQuery.length === 4 && /^[A-Za-z0-9]{4}$/.test(trimmedQuery)) {
        onSearchPDB();
      }
    }
  };

  // Search Button Click Handler
  const handleSearchClick = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery.length === 4 && /^[A-Za-z0-9]{4}$/.test(trimmedQuery)) {
      onSearchPDB();
    }
  };

  return (
    <div className="mt-3 p-3 border rounded bg-light">
      
      {/* Search Interface Header */}
      <h6>Search PDB Database</h6>
      
      {/* Search Input Group with Validation */}
      <div className="input-group mb-3">
        
        {/* Search Query Input Field */}
        <input
          type="text"
          className="form-control text-uppercase"
          placeholder="Enter 4-character PDB code (e.g., 1ADG, 1UBQ, 2LYZ)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
          maxLength={4}
          pattern="[A-Za-z0-9]{4}"
          onKeyPress={handleKeyPress}
        />
        
        {/* Search Execution Button with Loading State */}
        <button
          className="btn btn-outline-primary"
          onClick={handleSearchClick}
          disabled={isLoading || searchQuery.length !== 4}
        >
          {isLoading ? (
            <FaSpinner className="fa-spin" />
          ) : (
            'Search'
          )}
        </button>
      </div>
      
      {/* Search Guidance Information */}
      <small className="text-muted">
        Search for protein structures using 4-character PDB codes only
      </small>

      {/* Search Results Display Section */}
      {searchResults.length > 0 && (
        <div className="mt-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          
          {/* Results Header */}
          <h6 className="mb-2">Search Results:</h6>
          
          {/* Individual Result Cards */}
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="border-bottom py-2 cursor-pointer hover-bg-light"
              style={{ cursor: 'pointer' }}
              onClick={() => onSelectFromSearch(result)}
            >
              
              {/* Result Header with PDB Code and Resolution */}
              <div className="d-flex justify-content-between">
                <strong className="text-primary">{result.pdb_code}</strong>
                <small className="text-muted">
                  {result.resolution && `${result.resolution}Å`}
                </small>
              </div>
              
              {/* Protein Structure Title */}
              <div className="text-truncate">
                {result.title || 'No title available'}
              </div>
              
              {/* Scientific Display */}
              <small className="text-muted">
                {result.method || 'Unknown method'}
                {result.chains && ` • Chains: ${Array.isArray(result.chains) ? result.chains.join(', ') : result.chains}`}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PDBSearchPanel;