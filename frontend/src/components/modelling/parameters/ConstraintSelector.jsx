// ConstraintSelector.jsx - Backbone Angle Constraint Configuration Component
 

import { FaLock } from 'react-icons/fa';

// ConstraintSelector Component
const ConstraintSelector = ({
  title,                    // Display title for constraint section
  availableResidues,        // All residues in the segment: [290, 291, 292, ...]
  selectedConstraints,      // Currently constrained residues: [295, 296]
  targetedResidues,         // Residues that are targeted (should be disabled): [291, 292]
  onToggleConstraint,       // Function(residue) to call when user toggles a constraint
  constraintType            // "phi" or "psi" - used for styling differentiation
}) => {
  return (
    <div className="card">
      
      {/* Constraint Section Header */}
      <div className="card-header">
        <h6>{title}</h6>
      </div>
      
      {/* Constraint Selection Interface */}
      <div className="card-body">
        
        {/* Residue Selection Grid */}
        <div className="row g-2">
          {availableResidues.map(residue => {
            const isConstrained = selectedConstraints.includes(residue);
            const isTargeted = targetedResidues.includes(residue);
            
            /* Button Styling Logic */
            let buttonClass;
            if (isConstrained) {
              // Use different colours for phi vs psi constraints for visual distinction
              buttonClass = constraintType === 'phi' ? 'btn-warning' : 'btn-info';
            } else if (isTargeted) {
              buttonClass = 'btn-outline-secondary';
            } else {
              buttonClass = 'btn-outline-primary';
            }
            
            return (
              <div key={residue} className="col-auto">
                <button
                  type="button"
                  className={`btn btn-sm ${buttonClass}`}
                  onClick={() => !isTargeted && onToggleConstraint(residue)}
                  disabled={isTargeted}
                  title={
                    isTargeted 
                      ? `Cannot constrain - residue ${residue} is already targeted for ${constraintType}`
                      : isConstrained
                        ? `Click to remove ${constraintType} constraint on residue ${residue}`
                        : `Click to constrain ${constraintType} angle for residue ${residue}`
                  }
                >
                  {/* Visual Lock Icon for Constrained Residues */}
                  {isConstrained && <FaLock className="me-1" />}
                  {residue}
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Constraint Information */}
        <div className="mt-2">
          <small className="text-muted">
            Click residues to constrain their {constraintType} angles. 
            Constrained residues cannot also be targeted.
          </small>
        </div>
      </div>
    </div>
  );
};

export default ConstraintSelector;