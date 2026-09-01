// PDBInputForm.jsx - Protein Database Input Interface Component


import PDBSearchPanel from './input/PDBSearchPanel';
import QuickStartExamples from './input/QuickStartExamples';
import PDBCodeInput from './input/PDBCodeInput';

// PDBInputForm 
const PDBInputForm = ({
  // PDB Code Management
  pdbCode,                    // Current PDB code string value
  setPdbCode,                // Function to update PDB code state
  
  // Structure Retrieval Control
  isLoading,                 // Loading state for structure fetch operations
  onFetchStructure,          // Function to initiate structure retrieval
  
  // Search Interface Management
  showSearch,                // Boolean flag for search panel visibility
  onToggleSearch,            // Function to toggle search interface display
  
  // Search Query Management
  searchQuery,               // Current search query string
  setSearchQuery,            // Function to update search query state
  
  // Search Results Management
  searchResults,             // Array of search results from database
  onSearchPDB,               // Function to execute database search
  onSelectFromSearch,        // Function to handle search result selection
  
  // Parameter State Management
  setModellingParams         // Function to update modelling parameters
}) => {
  return (
    <div className="card">
      
      {/* Interface Header with Step Indication */}
      <div className="card-header">
        <h5>Step 1: Enter PDB Code</h5>
      </div>
      
      {/* Interface Body with Input Components */}
      <div className="card-body">
        
        {/* Primary PDB Code Input Field */}
        <PDBCodeInput
          pdbCode={pdbCode}
          setPdbCode={setPdbCode}
          isLoading={isLoading}
          onFetchStructure={onFetchStructure}
          onToggleSearch={onToggleSearch}
        />
        
        {/* Quick Start Examples for Common Proteins */}
        <QuickStartExamples
          setPdbCode={setPdbCode}
          setModellingParams={setModellingParams}
        />

        {/* Alternative Protein Search Interface */}
        <PDBSearchPanel
          showSearch={showSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchResults={searchResults}
          onSearchPDB={onSearchPDB}
          onSelectFromSearch={onSelectFromSearch}
          isLoading={isLoading}
        />
        
      </div>
    </div>
  );
};

export default PDBInputForm;