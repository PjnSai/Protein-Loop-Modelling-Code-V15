/* useParameterValidation.js - Parameter Validation Hook*/

import { useState, useCallback } from 'react';

/* useParameterValidation Hook */
export const useParameterValidation = () => {
  // Parameter Conflict State Management
  const [conflicts, setConflicts] = useState([]);

  /* Detect Parameter Conflicts */
  const detectConflicts = useCallback((params) => {
    const conflicts = [];
    
    // Extract target residue numbers for phi and psi angles
    const phiTargets = params.targetPhi.map(t => t.residue);
    const psiTargets = params.targetPsi.map(t => t.residue);
    
    // Check phi conflicts - same residue targeted AND constrained for phi
    const phiConflicts = phiTargets.filter(r => params.constrainedPhi.includes(r));
    if (phiConflicts.length > 0) {
      conflicts.push({
        type: 'phi',
        residues: phiConflicts,
        message: `Phi conflict: Residue(s) ${phiConflicts.join(', ')} are both targeted and constrained for phi angle`
      });
    }
    
    // Check psi conflicts - same residue targeted AND constrained for psi
    const psiConflicts = psiTargets.filter(r => params.constrainedPsi.includes(r));
    if (psiConflicts.length > 0) {
      conflicts.push({
        type: 'psi', 
        residues: psiConflicts,
        message: `Psi conflict: Residue(s) ${psiConflicts.join(', ')} are both targeted and constrained for psi angle`
      });
    }
    
    return conflicts;
  }, []);

  // Helper functions that work with the conflicts
  const hasConflicts = conflicts.length > 0;
  
  /* Conflict Message*/
  const getConflictMessage = () => {
    if (conflicts.length === 0) return null;
    return conflicts.map(conflict => conflict.message).join('. ');
  };

  return {
    conflicts,              // Array of current parameter conflicts
    setConflicts,           // Function to manually set conflict state
    detectConflicts,        // Function to analyse parameters for conflicts
    hasConflicts,           // Boolean indicator of conflict existence
    getConflictMessage      // Function to generate user-friendly conflict messages
  };
};

export default useParameterValidation;