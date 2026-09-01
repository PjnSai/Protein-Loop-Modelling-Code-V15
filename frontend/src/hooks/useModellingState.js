/* useModellingState.js - Protein Modelling Workflow State Management Hook */

import { useState } from 'react';

/* useModellingState Hook */
export const useModellingState = () => {
  // Workflow Progression State
  const [step, setStep] = useState(1);                        // Current step (1-4)
  
  // PDB Structure Management State
  const [pdbCode, setPdbCode] = useState('');                // 4-character PDB id
  const [pdbData, setPdbData] = useState(null);              // Complete PDB structure data 
  const [selectedChain, setSelectedChain] = useState('');    // Selected protein chain for modelling
  
  // Modelling Process State
  const [preparation, setPreparation] = useState(null);      // Modelling preparation data and analysis
  const [modellingResults, setModellingResults] = useState(null); // MATLAB computation results
  
  // Scientific Parameters State
  const [modellingParams, setModellingParams] = useState({
    segment_start: '',      // Starting residue number for loop modelling
    segment_end: '',        // Ending residue number for loop modelling
    n_iterations: 10000,    // Number of MATLAB optimisation iterations
    target_phi: [],         // Target phi angles for specific residues
    target_psi: [],         // Target psi angles for specific residues
    constrained_phi: [],    // Residues with constrained phi angles
    constrained_psi: []     // Residues with constrained psi angles
  });
  
  // Database Search State Management
  const [searchResults, setSearchResults] = useState([]);    // PDB database search results
  const [showSearch, setShowSearch] = useState(false);       // Search interface visibility state
  const [searchQuery, setSearchQuery] = useState('');        // Current search query string
  
  /* Reset Complete Workflow State */
  const resetInterface = () => {
    // Reset workflow progression
    setStep(1);
    
    // Clear PDB structure data
    setPdbCode('');
    setPdbData(null);
    setSelectedChain('');
    
    // Clear modelling process data
    setPreparation(null);
    setModellingResults(null);
    
    // Reset scientific parameters to defaults
    setModellingParams({
      segment_start: '',
      segment_end: '',
      n_iterations: 10000,
      target_phi: [],
      target_psi: [],
      constrained_phi: [],
      constrained_psi: []
    });
    
    // Clear search interface state
    setSearchResults([]);
    setShowSearch(false);
    setSearchQuery('');
  };

  return {
    // Workflow Progression State
    step, setStep,
    
    // PDB Structure Management
    pdbCode, setPdbCode,
    pdbData, setPdbData,
    selectedChain, setSelectedChain,
    
    // Modelling Process State
    preparation, setPreparation,
    modellingParams, setModellingParams,
    modellingResults, setModellingResults,
    
    // Database Search State
    searchResults, setSearchResults,
    showSearch, setShowSearch,
    searchQuery, setSearchQuery,
    
    // State Management Functions
    resetInterface  // Complete workflow state reset function
  };
};