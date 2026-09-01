// ActionButtons.jsx - Workflow Navigation Control Component


//ActionButtons Component
const ActionButtons = ({ 
  onContinue,          // Function to proceed to parameter configuration step
  onReset,             // Function to reset complete workflow state
  isLoading,           // Loading state indicator for operation feedback
  selectedChain,       // Currently selected protein chain identifier
  modellingParams      // Current modelling parameters with segment boundaries
}) => {
  
  // Button State Validation
  const isDisabled = isLoading || 
                    !selectedChain || 
                    !modellingParams.segment_start || 
                    !modellingParams.segment_end;

  return (
    <div className="mt-3">
      
      {/* Primary Action Button - Continue to Parameters */}
      <button
        className="btn btn-primary me-2"
        onClick={onContinue}
        disabled={isDisabled}
      >
        {isLoading ? 'Preparing...' : 'Continue to Parameters'}
      </button>
      
      {/* Secondary Action Button - Workflow Reset */}
      <button
        className="btn btn-outline-secondary"
        onClick={onReset}
      >
        Start Over
      </button>
    </div>
  );
};

export default ActionButtons;