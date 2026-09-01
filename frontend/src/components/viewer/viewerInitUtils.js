// viewerInitUtils.js - Protein Viewer Initialisation Utility Functions

// 3DMol Viewer Initialisation
export const initialise3DMol = (viewerRef, pdbContent, representation, applyStyleCallback) => {
  return new Promise((resolve, reject) => {
    const init3DMol = () => {
      if (window.$3Dmol) {
        try {
          // Ensure container is clean for fresh initialisation
          if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
          }
          
          // Viewer configuration for protein structures
          const config = { 
            backgroundColor: 'white',           // Clean background for scientific presentation
            antialias: true,                   // Smooth rendering for better quality
            preserveDrawingBuffer: false,      // Performance optimisation
            alpha: false                       // Opaque background for clarity
          };
          
          // Create 3DMol viewer instance
          const viewer = window.$3Dmol.createViewer(viewerRef.current, config);

          // Add protein model from PDB content
          viewer.addModel(pdbContent, 'pdb');
          
          // Apply initial visualisation style
          applyStyleCallback(viewer, representation);
          
          // Optimise view and render with callback
          viewer.zoomTo();
          viewer.render(() => {
            resolve(viewer);
          });
          
        } catch (err) {
          reject(err);
        }
      } else {
        // Retry if 3DMol library not loaded yet
        setTimeout(init3DMol, 100);
      }
    };
    
    init3DMol();
  });
};

// NGL Viewer Initialisation
export const initialiseNGL = (viewerRef, pdbContent, representation, applyRepresentationCallback) => {
  return new Promise((resolve, reject) => {
    const initNGL = () => {
      if (window.NGL) {
        try {
          // Ensure container is clean for fresh initialisation
          if (viewerRef.current) {
            viewerRef.current.innerHTML = '';
          }

          // NGL stage configuration
          const stage = new window.NGL.Stage(viewerRef.current, {
            backgroundColor: 'white',         //Background colour
            quality: 'medium',               // Balanced quality and performance
            sampleLevel: 1,                  // Anti-aliasing for smooth rendering
            workerDefault: true,             // Performance optimisation with workers
            impostor: true                   // Improved rendering quality
          });

          // Create blob for PDB content loading
          const blob = new Blob([pdbContent], { type: 'text/plain' });
          
          // Load protein structure from PDB content
          stage.loadFile(blob, { ext: 'pdb' }).then(structure => {
            // Store structure reference for subsequent style updates
            stage.structure = structure;
            
            // Apply initial representation style
            applyRepresentationCallback(structure, representation);
            
            // Auto-view with proper centering and timing
            setTimeout(() => {
              stage.autoView();
            }, 100);
            
            resolve(stage);
          }).catch(reject);

        } catch (err) {
          reject(err);
        }
      } else {
        // Retry if NGL library not loaded yet
        setTimeout(initNGL, 100);
      }
    };
    
    initNGL();
  });
};

// Unified Viewer Initialisation
export const initialiseViewer = async (viewerType, viewerRef, pdbContent, representation, applyVisualisationStyle, applyNGLRepresentation) => {
  // Validate required parameters
  if (!pdbContent || !viewerRef.current) {
    throw new Error('Missing PDB content or viewer container');
  }

  // Route to appropriate initialisation function
  if (viewerType === '3dmol') {
    return await initialise3DMol(viewerRef, pdbContent, representation, applyVisualisationStyle);
  } else if (viewerType === 'ngl') {
    return await initialiseNGL(viewerRef, pdbContent, representation, applyNGLRepresentation);
  } else {
    throw new Error(`Unknown viewer type: ${viewerType}`);
  }
};