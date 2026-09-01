// AngleTargetSection.jsx - Scientific Angle Target Configuration Component

import { FaPlus, FaTimes } from 'react-icons/fa';

// AngleTargetSection Component
const AngleTargetSection = ({ 
  angleType,           // Angle type ('phi' or 'psi') for configuration context
  targets,             // Array of current target specifications
  availableResidues,   // Array of available residue numbers
  usedResidues,        // Array of residue numbers already assigned
  onAdd,               // Function to add new target specification
  onRemove,            // Function to remove existing target
  onUpdate             // Function to update target values
}) => {
  
  // Angle Value Validation Function
  const validateAngle = (value) => {
    // Allow empty string and minus sign for user typing experience
    if (value === '' || value === '-') {
      return value;
    }
    
    const numValue = parseFloat(value);
    
    // If it's not a valid number, return 0
    if (isNaN(numValue)) {
      return 0;
    }
    
    // Scientific angle range (-180 to 180 degrees)
    if (numValue < -180) {
      return -180;
    }
    if (numValue > 180) {
      return 180;
    }
    
    return numValue;
  };

  /* Angle Input Change Handler */
  const handleAngleChange = (index, value) => {
    const validatedValue = validateAngle(value);
    onUpdate(index, 'angle', validatedValue);
  };

  /* Available Residue Calculation */
  const availableForSelection = availableResidues.filter(residue => 
    !usedResidues.includes(residue)
  );

  return (
    <div className="card mb-3">
      
      {/* Section Header with Angle Type Identification */}
      <div className="card-header">
        <h6>Target {angleType.charAt(0).toUpperCase() + angleType.slice(1)} Angles</h6>
      </div>
      
      {/* Target Configuration Content */}
      <div className="card-body">
        
        {/* Individual Target Specification Rows */}
        {targets.map((target, index) => (
          <div key={index} className="row mb-2 align-items-center">
            
            {/* Residue Selection Dropdown */}
            <div className="col-md-4">
              <select
                className="form-select form-select-sm"
                value={target.residue}
                onChange={(e) => onUpdate(index, 'residue', parseInt(e.target.value))}
              >
                {/* Always include the current residue as an option */}
                <option value={target.residue}>{target.residue}</option>
                
                {/* Include other available residues that aren't already used */}
                {availableResidues
                  .filter(r => !usedResidues.includes(r) || r === target.residue)
                  .map(residue => (
                    <option key={residue} value={residue}>{residue}</option>
                  ))}
              </select>
            </div>
            
            {/* Angle Value Input with Scientific Validation */}
            <div className="col-md-4">
              <input
                type="number"
                className="form-control form-control-sm"
                value={target.angle}
                onChange={(e) => handleAngleChange(index, e.target.value)}
                onBlur={(e) => {
                  // On blur, ensure we have a valid number (no empty strings)
                  const value = e.target.value;
                  if (value === '' || value === '-') {
                    onUpdate(index, 'angle', 0);
                  }
                }}
                min="-180"
                max="180"
                step="1"
                placeholder="Angle (degrees)"
                title="Enter angle between -180 and 180 degrees"
              />
            </div>
            
            {/* Target Removal Control */}
            <div className="col-md-4">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm"
                onClick={() => onRemove(index)}
                title={`Remove ${angleType} target for residue ${target.residue}`}
              >
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
        
        {/* Add New Target Control */}
        <button
          type="button"
          className="btn btn-outline-primary btn-sm"
          onClick={onAdd}
          disabled={availableForSelection.length === 0}
          title={
            availableForSelection.length === 0 
              ? `All residues are already used for ${angleType} targets or constraints`
              : `Add new ${angleType} target`
          }
        >
          <FaPlus className="me-1" />
          Add {angleType.charAt(0).toUpperCase() + angleType.slice(1)} Target
        </button>
        
        {/* Availability Feedback Message */}
        {availableForSelection.length === 0 && targets.length > 0 && (
          <small className="text-muted mt-2 d-block">
            All available residues are being used.
          </small>
        )}
      </div>
    </div>
  );
};

export default AngleTargetSection;