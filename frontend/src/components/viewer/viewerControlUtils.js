// viewerControlUtils.js - Protein Viewer Control Utility Functions
 
// Switch Viewer Engine with Complete Reset
export const switchViewer = (
  newViewerType, 
  currentViewerType, 
  cleanup, 
  setIsLoading, 
  setViewerType, 
  setViewerKey, 
  setRepresentation,
  viewerRef
) => {
  // Prevent unnecessary switching operations
  if (newViewerType === currentViewerType) return;
  
  // Begin viewer switching process
  setIsLoading(true);
  cleanup();
  
  // Force component re-render with new viewer type
  setViewerType(newViewerType);
  setViewerKey(prev => prev + 1);
  
  // Reset representation to cartoon when switching viewers
  setRepresentation('cartoon');
  
  // Small delay to ensure DOM is completely reset
  setTimeout(() => {
    if (viewerRef.current) {
      viewerRef.current.innerHTML = '';
    }
  }, 50);
};

// Change Representation Style
export const changeRepresentation = (newRepr, currentRepresentation, setRepresentation) => {
  // Prevent unnecessary representation updates
  if (newRepr === currentRepresentation) return;
  setRepresentation(newRepr);
};

// Center Viewer Display
export const centerView = (stageRef, viewerReady, viewerType) => {
  // Validate viewer availability before operation
  if (!stageRef.current || !viewerReady) return;

  try {
    if (viewerType === 'ngl') {
      // NGL viewer centering with animation
      stageRef.current.autoView(100); // 1 second animation timing
      
      // Force rendering refresh if needed
      setTimeout(() => {
        if (stageRef.current && stageRef.current.viewer) {
          stageRef.current.viewer.requestRender();
        }
      }, 100);
    } else {
      // 3DMol viewer centering
      stageRef.current.zoomTo();
      stageRef.current.render();
    }
  } catch (err) {
    console.error('Error centering view:', err);
  }
};

// Reset Viewer Completely
export const resetViewer = (cleanup, setViewerKey, initialiseViewer) => {
  // Perform complete cleanup
  cleanup();
  
  // Force component reset with new key
  setViewerKey(prev => prev + 1);
  
  // Delayed re-initialisation to ensure clean state
  setTimeout(() => {
    initialiseViewer();
  }, 100);
};