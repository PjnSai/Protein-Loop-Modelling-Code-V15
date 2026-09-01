// TestingInstructions.jsx - Comprehensive User Testing Guidance Component


// TestingInstructions Component
const TestingInstructions = ({ isAuthenticated }) => {
  return (
    <div className="card mt-4">
      
      {/* Instruction Header with Professional Styling */}
      <div className="card-header bg-info text-white">
        <h6 className="mb-0">Testing Instructions</h6>
      </div>
      
      {/* Main Instruction Content with Two-Column Layout */}
      <div className="card-body">
        <div className="row">
          
          {/* Left Column: Quick Test Instructions */}
          <div className="col-md-6">
            
            {/* Recommended Quick Test Pathway */}
            <h6>Quick Test (Recommended)</h6>
            <ol className="small">
              
              {/* Step 1: Protein Selection */}
              <li><strong>"1ADG (Recommended)"</strong> button above</li>
              
              {/* Step 2: Structure Retrieval */}
              <li><strong>"Fetch Structure"</strong></li>
              
              {/* Step 3: Chain and Segment Configuration */}
              <li><strong>"Use Chain A, Segment 290-301"</strong></li>
              
              {/* Step 4: Parameter Configuration */}
              <li><strong>"Continue to Parameters"</strong></li>
              
              {/* Step 5: Processing Mode Selection */}
              <li>Set parameters:
                <ul>
                  
                  {/* Demo Mode Processing */}
                  <li><strong>Demo:</strong> <strong>"Run Demo Simulation"</strong> - Real MATLAB processing, results in memory only</li>
                  
                  {/* Authenticated Mode Processing */}
                  <li><strong>Authenticated:</strong> <strong>"Start Loop Modelling"</strong> - Real MATLAB processing, results saved permanently</li>
                </ul>
              </li>
              
              {/* Step 6: Results Analysis */}
              <li>View results with structure comparison and download PDB file</li>
            </ol>
          </div>
          
          {/* Right Column: Manual Testing Instructions */}
          <div className="col-md-6">
            
            {/* Advanced Manual Testing Pathway */}
            <h6>Manual Testing</h6>
            <ol className="small">
              
              {/* Step 1: Custom Protein Selection */}
              <li>Enter any 4-character PDB code (e.g., <code>1UBQ</code>, <code>2LYZ</code>)</li>
              
              {/* Step 2: Chain Selection */}
              <li>Select any available chain</li>
              
              {/* Step 3: Segment Range Configuration */}
              <li>Choose a segment range (10-20 residues recommended)</li>
              
              {/* Step 4: Iteration Count Configuration */}
              <li>Set iterations: <code>5000</code> or less for testing</li>
              
              {/* Step 5: Parameter Configuration */}
              <li>Add at least one target angle</li>
              
              {/* Step 6: Job Submission */}
              <li>Submit</li>
            </ol>
            
            {/* Processing Mode Information Display */}
            <div className="mt-3">
              <strong>Processing Mode:</strong>
              <div className={`badge ${isAuthenticated ? 'bg-success' : 'bg-info'}`}>
                {isAuthenticated 
                  ? 'Authenticated - Results Saved to Database' 
                  : 'Demo Mode - Real MATLAB, Temporary Results'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingInstructions;