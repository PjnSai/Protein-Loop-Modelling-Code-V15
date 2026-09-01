/* modellingApi.js - Protein Loop Modelling API Service */
export const fetchPDBStructure = async (pdbCode, isAuthenticated) => {
  // Validate PDB code format before API request
  if (!pdbCode || pdbCode.length !== 4) {
    return { success: false, error: 'Please enter a valid 4-character PDB code' };
  }

  try {
    // Select appropriate endpoint based on authentication status
    const endpoint = isAuthenticated 
      ? `http://localhost:8000/api/pdb/fetch/${pdbCode.toUpperCase()}`
      : `http://localhost:8000/api/demo/pdb/fetch/${pdbCode.toUpperCase()}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: isAuthenticated ? 'include' : undefined
    });
    
    const data = await response.json();
    
    if (data.success) {
      // Process structural analysis and select default chain
      const chains = data.analysis?.chains || [];
      const selectedChain = chains.length > 0 ? chains[0] : 'A';
      
      return { 
        success: true, 
        data: data,
        selectedChain: selectedChain
      };
    } else {
      return { success: false, error: data.error || 'Failed to fetch PDB structure' };
    }
  } catch (err) {
    console.error('PDB fetch error:', err);
    return { success: false, error: 'Unable to fetch PDB structure. Please check your internet connection.' };
  }
};

/* Search PDB Database */
export const searchPDB = async (searchQuery) => {
  if (!searchQuery.trim()) {
    return { success: false, error: 'Search query is empty' };
  }
  
  try {
    const response = await fetch(`http://localhost:8000/api/demo/pdb/search?q=${encodeURIComponent(searchQuery)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    
    if (data.success) {
      const results = data.results || [];
      
      if (results.length === 0) {
        return { 
          success: false, 
          error: 'No proteins found. Try: "alcohol dehydrogenase", "lysozyme", "ubiquitin", or PDB codes like "1ADG", "1UBQ"' 
        };
      }
      
      return { success: true, results: results };
    } else {
      return { success: false, error: data.error || 'Search failed. Try entering a PDB code directly.' };
    }
  } catch (err) {
    console.error('Search error:', err);
    return { success: false, error: 'Search service temporarily unavailable. Try PDB codes: 1ADG, 1UBQ, 2LYZ, 1CRN' };
  }
};

/* Prepare Modelling Parameters */
export const prepareModelling = async (pdbData, pdbCode, selectedChain, modellingParams) => {
  if (!selectedChain || !modellingParams.segment_start || !modellingParams.segment_end) {
    return { success: false, error: 'Please select chain and segment range' };
  }

  try {
    const response = await fetch('http://localhost:8000/api/demo/modelling/prepare', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        pdb_code: pdbData?.pdb_code || pdbCode,
        chain: selectedChain,
        segment_start: parseInt(modellingParams.segment_start),
        segment_end: parseInt(modellingParams.segment_end)
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { 
        success: true, 
        preparation: data.preparation,
        suggestedIterations: data.preparation?.suggested_parameters?.n_iterations || 10000
      };
    } else {
      return { success: false, error: data.error || 'Failed to prepare modelling' };
    }
  } catch (err) {
    console.error('Preparation error:', err);
    return { success: false, error: 'Network error during preparation' };
  }
};

/* Submit Protein Loop Modelling Job */
export const submitModelling = async (backendParams, modellingParams, pdbData, pdbCode, selectedChain, isAuthenticated) => {
  try {
    let parsedTargetPhi, parsedTargetPsi, parsedConstrainedPhi, parsedConstrainedPsi;
    
    if (backendParams) {
      // Authenticated route: use validated backend parameters
      parsedTargetPhi = backendParams.target_phi || [];
      parsedTargetPsi = backendParams.target_psi || [];
      parsedConstrainedPhi = backendParams.constrained_phi || [];
      parsedConstrainedPsi = backendParams.constrained_psi || [];
    } else {
      // Demo route: use interface state parameters
      parsedTargetPhi = modellingParams.target_phi || [];
      parsedTargetPsi = modellingParams.target_psi || [];
      parsedConstrainedPhi = modellingParams.constrained_phi || [];
      parsedConstrainedPsi = modellingParams.constrained_psi || [];
    }
    
    // Ensure required data presence for submission
    const currentPdbCode = pdbData?.pdb_code || pdbCode;
    const currentChain = selectedChain || 'A';
    
    if (!currentPdbCode) {
      return { success: false, error: 'PDB code is missing. Please go back and fetch a structure first.' };
    }
    
    // Prepare standardised request body for MATLAB processing
    const requestBody = {
      pdb_code: currentPdbCode,
      chain: currentChain,
      segment_start: parseInt(modellingParams.segment_start),
      segment_end: parseInt(modellingParams.segment_end),
      n_iterations: parseInt(modellingParams.n_iterations),
      target_phi: parsedTargetPhi,
      target_psi: parsedTargetPsi,
      constrained_phi: parsedConstrainedPhi,
      constrained_psi: parsedConstrainedPsi
    };
    
    if (isAuthenticated) {
      // Authenticated user pathway - permanent result storage
      const response = await fetch('http://localhost:8000/api/modelling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return {
          success: true,
          results: {
            success: true,
            job_id: data.job_id,
            status: 'completed',  
            message: data.message || 'Loop modelling completed successfully!',
            results: data.results,
            modelled_structure: data.modelled_structure, 
            processing_time: data.processing_time,
            parameters: requestBody,
            pdb_code: currentPdbCode,
            demo_mode: false
          }
        };
      } else {
        return { success: true, results: data };
      }
    } else {
      // Demo user pathway - temporary result storage
      const response = await fetch('http://localhost:8000/api/demo/modelling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (data.success) {
        return { success: true, results: data };
      } else {
        return { success: false, error: data.error || 'Modelling failed' };
      }
    }
  } catch (err) {
    console.error('Modelling submission error:', err);
    return { success: false, error: 'Network error during modelling submission' };
  }
};

/* Download Demo Results */
export const downloadDemoResults = async (jobId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/demo/job/${jobId}/download`);
    
    if (response.ok) {
      // Create and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `demo_protein_model_${jobId}.pdb`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup download resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || 'Download failed' };
    }
  } catch (err) {
    console.error('Download error:', err);
    return { success: false, error: 'Download temporarily unavailable' };
  }
};

/* Download Authenticated User Results */
export const downloadAuthResults = async (jobId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/modelling/job/${jobId}/download`, {
      credentials: 'include'
    });
    
    if (response.ok) {
      // Create and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `modelling_results_${jobId}.pdb`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup download resources
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.error || 'Download failed' };
    }
  } catch (err) {
    console.error('Download error:', err);
    return { success: false, error: 'Download temporarily unavailable' };
  }
};