// ParameterForm.jsx - Scientific Parameter Configuration Interface

import { useState, useEffect } from 'react';
import { FaSpinner, FaPlus, FaTimes, FaLock, FaExclamationTriangle, FaCheck } from 'react-icons/fa';
import { useParameterValidation } from '../../hooks';
import AngleTargetSection from './parameters/AngleTargetSection';
import ConstraintSelector from './parameters/ConstraintSelector';
import SegmentInfoCard from './parameters/SegmentInfoCard';
import MatlabExampleCard from './parameters/MatlabExampleCard';
import IterationsControl from './parameters/IterationsControl';
import SubmitSection from './parameters/SubmitSection';

// ParameterForm Component
const ParameterForm = ({
  preparation,          // Structural analysis data with segment information
  modellingParams,      // Current modelling parameters from parent state
  isLoading,           // Loading state during parameter processing
  onSubmit,            // Function to submit parameters for MATLAB processing
  onBack,              // Function to return to structure visualisation step
  isAuthenticated,     // User authentication status for feature availability
  systemStatus,        // MATLAB system status and availability information
}) => {
  
  // Internal Parameter State Management
  const [parameters, setParameters] = useState({
    targetPhi: [],          // Array of target phi angles with residue/angle pairs
    targetPsi: [],          // Array of target psi angles with residue/angle pairs
    constrainedPhi: [],     // Array of residue numbers with constrained phi angles
    constrainedPsi: [],     // Array of residue numbers with constrained psi angles
    n_iterations: 10000     // MATLAB optimisation iteration count
  });

  // Available residue range computed from segment boundaries
  const [availableResidues, setAvailableResidues] = useState([]);
  
  // Real-time parameter conflict detection and validation
  const { conflicts, setConflicts, detectConflicts, hasConflicts, getConflictMessage } = useParameterValidation();

  // Effect Hook - Available Residues Generation
  useEffect(() => {
    if (preparation) {
      // Generate sequential residue numbers within segment boundaries
      const residues = [];
      for (let i = preparation.segment_start; i <= preparation.segment_end; i++) {
        residues.push(i);
      }
      setAvailableResidues(residues);
      
      // Set intelligent iteration count from preparation or existing parameters
      setParameters(prev => ({
        ...prev,
        n_iterations: parseInt(modellingParams.n_iterations) || 
                     preparation.suggested_parameters?.n_iterations || 
                     10000
      }));
    }
  }, [preparation, modellingParams.n_iterations]);

  // Effect Hook - Real-time Conflict Detection
  useEffect(() => {
    const newConflicts = detectConflicts(parameters);
    setConflicts(newConflicts);
  }, [parameters, detectConflicts, setConflicts]);

  // Phi Angle Usage Tracking
  const getPhiUsedResidues = () => {
    return [
      ...parameters.targetPhi.map(t => t.residue),
      ...parameters.constrainedPhi
    ];
  };

  // Psi Angle Usage Tracking
  const getPsiUsedResidues = () => {
    return [
      ...parameters.targetPsi.map(t => t.residue),
      ...parameters.constrainedPsi
    ];
  };

  // Parameter Submission Handler
  const handleSubmit = () => {
    // Prevent submission if parameter conflicts exist
    if (hasConflicts) {
      return;
    }

    // Convert internal UI state to backend MATLAB-compatible format
    const backendParams = {
      ...modellingParams,
      target_phi: parameters.targetPhi,           // Target phi angles for specific residues
      target_psi: parameters.targetPsi,           // Target psi angles for specific residues
      constrained_phi: parameters.constrainedPhi, // Residues with constrained phi angles
      constrained_psi: parameters.constrainedPsi, // Residues with constrained psi angles
      n_iterations: parameters.n_iterations       // MATLAB optimisation iteration count
    };

    // Submit converted parameters to parent component for MATLAB processing
    onSubmit(backendParams);
  };

  // Target Angle Addition Handler
  const addTarget = (angleType) => {
    // Determine currently used residues for this angle type
    let usedResidues;
    if (angleType === 'phi') {
      usedResidues = getPhiUsedResidues();
    } else {
      usedResidues = getPsiUsedResidues();
    }
    
    // Find available residues not currently assigned for this angle type
    const availableForNew = availableResidues.filter(r => !usedResidues.includes(r));
    if (availableForNew.length === 0) return; // No available residues remaining

    // Create new target angle object with default values
    const newTarget = {
      residue: availableForNew[0],  // First available residue
      angle: angleType === 'phi' ? 0 : 0  // Default angle value (0 degrees)
    };

    // Add new target to appropriate angle type array
    if (angleType === 'phi') {
      setParameters(prev => ({...prev, targetPhi: [...prev.targetPhi, newTarget]}));
    } else {
      setParameters(prev => ({...prev, targetPsi: [...prev.targetPsi, newTarget]}));
    }
  };

  // Target Angle Removal Handler
  const removeTarget = (angleType, index) => {
    if (angleType === 'phi') {
      setParameters(prev => ({
        ...prev, 
        targetPhi: prev.targetPhi.filter((_, i) => i !== index)
      }));
    } else {
      setParameters(prev => ({
        ...prev, 
        targetPsi: prev.targetPsi.filter((_, i) => i !== index)
      }));
    }
  };

  // Target Angle Update Handler
  const updateTarget = (angleType, index, field, value) => {
    if (angleType === 'phi') {
      setParameters(prev => ({
        ...prev,
        targetPhi: prev.targetPhi.map((target, i) => 
          i === index ? {
            ...target, 
            [field]: field === 'residue' 
              ? parseInt(value) || 0  // Convert residue to integer
              : (value === '' || value === '-') ? value : parseFloat(value) || 0  // Handle angle input
          } : target
        )
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        targetPsi: prev.targetPsi.map((target, i) => 
          i === index ? {
            ...target, 
            [field]: field === 'residue' 
              ? parseInt(value) || 0  // Convert residue to integer
              : (value === '' || value === '-') ? value : parseFloat(value) || 0  // Handle angle input
          } : target
        )
      }));
    }
  };

  // Constraint Toggle Handler
  const toggleConstraint = (angleType, residue) => {
    if (angleType === 'phi') {
      setParameters(prev => ({
        ...prev,
        constrainedPhi: prev.constrainedPhi.includes(residue)
          ? prev.constrainedPhi.filter(r => r !== residue)  // Remove if present
          : [...prev.constrainedPhi, residue]              // Add if not present
      }));
    } else {
      setParameters(prev => ({
        ...prev,
        constrainedPsi: prev.constrainedPsi.includes(residue)
          ? prev.constrainedPsi.filter(r => r !== residue)  // Remove if present
          : [...prev.constrainedPsi, residue]              // Add if not present
      }));
    }
  };

  // Parameter Activity Check
  const hasTargetsOrConstraints = 
    parameters.targetPhi.length > 0 || 
    parameters.targetPsi.length > 0 || 
    parameters.constrainedPhi.length > 0 || 
    parameters.constrainedPsi.length > 0;

  return (
    <div className="card">
      
      {/* Interface Header with Step Identification */}
      <div className="card-header">
        <h5>Step 3: Modelling Parameters</h5>
      </div>
      
      {/* Main Parameter Configuration Interface */}
      <div className="card-body">
        
        {/* Segment Information and Iteration Control Row */}
        <div className="row">
          
          {/* Segment Information Display */}
          <div className="col-md-6">
            <SegmentInfoCard preparation={preparation} />
          </div>
          
          {/* MATLAB Iteration Count Control */}
          <div className="col-md-6">
            <IterationsControl
              value={parameters.n_iterations}
              onChange={(newValue) => setParameters(prev => ({ ...prev, n_iterations: newValue }))}
              isAuthenticated={isAuthenticated}
              suggestedValue={preparation.suggested_parameters?.n_iterations}
            />
          </div>
        </div>
        
        {/* Parameter Configuration and Conflict Detection Section */}
        <div className="mt-4">
          
          {/* Real-time Conflict Detection Display */}
          {hasConflicts ? (
            <div className="alert alert-danger mb-3">
              <FaExclamationTriangle className="me-2" />
              <strong>Parameter Conflicts Detected:</strong>
              <p className="mb-0 mt-2">
                {getConflictMessage()}
              </p>
            </div>
          ) : hasTargetsOrConstraints && (
            <div className="alert alert-success py-2 mb-3">
              <FaCheck className="me-2" />
              <strong>No conflicts detected.</strong> All parameters are valid.
            </div>
          )}

          {/* Target Phi Angles Configuration Section */}
          <AngleTargetSection
            angleType="phi"
            targets={parameters.targetPhi}
            availableResidues={availableResidues}
            usedResidues={getPhiUsedResidues()}
            onAdd={() => addTarget('phi')}
            onRemove={(index) => removeTarget('phi', index)}
            onUpdate={(index, field, value) => updateTarget('phi', index, field, value)}
          />

          {/* Target Psi Angles Configuration Section */}
          <AngleTargetSection
            angleType="psi"
            targets={parameters.targetPsi}
            availableResidues={availableResidues}
            usedResidues={getPsiUsedResidues()}
            onAdd={() => addTarget('psi')}
            onRemove={(index) => removeTarget('psi', index)}
            onUpdate={(index, field, value) => updateTarget('psi', index, field, value)}
          />
          
          {/* Constraint Configuration Section */}
          <div className="row">
            
            {/* Phi Angle Constraints */}
            <div className="col-md-6">
              <ConstraintSelector
                title="Constrained Phi Residues"
                availableResidues={availableResidues}
                selectedConstraints={parameters.constrainedPhi}
                targetedResidues={parameters.targetPhi.map(t => t.residue)}
                onToggleConstraint={(residue) => toggleConstraint('phi', residue)}
                constraintType="phi"
              />
            </div>
            
            {/* Psi Angle Constraints */}
            <div className="col-md-6">
              <ConstraintSelector
                title="Constrained Psi Residues"
                availableResidues={availableResidues}
                selectedConstraints={parameters.constrainedPsi}
                targetedResidues={parameters.targetPsi.map(t => t.residue)}
                onToggleConstraint={(residue) => toggleConstraint('psi', residue)}
                constraintType="psi"
              />
            </div>
          </div>
          
          {/* MATLAB Integration Example for Demonstration */}
          <MatlabExampleCard preparation={preparation} />
        </div>

        {/* Submission and Navigation Controls */}
        <SubmitSection
          onSubmit={handleSubmit}
          onBack={onBack}
          isLoading={isLoading}
          hasConflicts={hasConflicts}
          isAuthenticated={isAuthenticated}
          systemStatus={systemStatus}
        />
      </div>
    </div>
  );
};

export default ParameterForm;