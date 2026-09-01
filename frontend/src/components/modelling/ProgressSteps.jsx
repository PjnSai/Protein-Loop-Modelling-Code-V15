// ProgressSteps.jsx - Workflow Progress Indicator Component

// ProgressSteps Component
const ProgressSteps = ({ currentStep, totalSteps = 4 }) => {
  
  // Workflow Step Labels
  const steps = [
    '1. PDB Input',
    '2. Structure View', 
    '3. Parameters',
    '4. Results'
  ];

  return (
    <div className="mb-4">
      <div className="row">
        <div className="col">
          
          {/* Bootstrap Progress Bar Component */}
          <div className="progress" style={{ height: '10px' }}>
            <div 
              className="progress-bar" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          
          {/* Step Labels with Dynamic Highlighting */}
          <div className="d-flex justify-content-between mt-2">
            {steps.map((stepLabel, index) => (
              <small 
                key={index}
                className={currentStep >= (index + 1) ? 'text-primary fw-bold' : 'text-muted'}
              >
                {stepLabel}
              </small>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;