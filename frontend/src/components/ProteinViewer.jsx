/* ProteinViewer.jsx - 3D Protein Visualisation Component */

import React, { useEffect, useRef, useState, useCallback } from 'react';

// Viewer component imports for modular interface 
import ViewerControls from './viewer/ViewerControls';
import ViewerErrorDisplay from './viewer/ViewerErrorDisplay';
import ViewerLegend from './viewer/ViewerLegend';
import ViewerLoadingOverlay from './viewer/ViewerLoadingOverlay';
import ViewerInfoOverlay from './viewer/ViewerInfoOverlay';
import ViewerNoDataDisplay from './viewer/ViewerNoDataDisplay';

// Utility imports for viewer functionality
import { apply3DMolStyle, applyNGLRepresentation } from './viewer/viewerStyleUtils';
import { useViewerDimensions, useViewerExpansion } from './viewer/useViewerDimensions';
import { initialiseViewer as initViewerUtil } from './viewer/viewerInitUtils';
import { 
  switchViewer as switchViewerUtil, 
  changeRepresentation as changeRepresentationUtil, 
  centerView as centerViewUtil, 
  resetViewer as resetViewerUtil 
} from './viewer/viewerControlUtils';

/* ProteinViewer Component */
const ProteinViewer = ({ 
  pdbContent, 
  pdbCode, 
  selectedChain = 'A', 
  segmentStart = null, 
  segmentEnd = null, 
  height = 400,
  showControls = true,
  isModelledStructure = false
}) => {
  // DOM Reference Management
  const viewerRef = useRef(null);                          // Main viewer container reference
  const stageRef = useRef(null);                           // 3D viewer stage reference
  
  // Viewer State Management
  const [isLoading, setIsLoading] = useState(true);        // Loading state for user feedback
  const [error, setError] = useState(null);               // Error state for problem handling
  const [viewerType, setViewerType] = useState('3dmol');  // Current viewer engine selection
  const [representation, setRepresentation] = useState('cartoon'); // Current display representation
  const [viewerReady, setViewerReady] = useState(false);   // Viewer initialisation status
  const [lastSuccessfulStyle, setLastSuccessfulStyle] = useState('cartoon'); // Fallback style tracking
  
  // Interface State Management
  const { isExpanded, toggleExpanded } = useViewerExpansion();
  const { currentHeight, setCurrentHeight, calculateViewerHeight } = useViewerDimensions(height, isExpanded);
  
  // Viewer Reset Management
  const [viewerKey, setViewerKey] = useState(0);           // Component key for complete reset

  /* Complete Viewer Cleanup */
  const cleanup = useCallback(() => {
    try {
      if (stageRef.current) {
        if (viewerType === 'ngl' && stageRef.current.dispose) {
          // NGL viewer cleanup with resource disposal
          stageRef.current.dispose();
        } else if (viewerType === '3dmol') {
          // 3DMol viewer cleanup with model and surface removal
          try {
            stageRef.current.removeAllModels();
            stageRef.current.removeAllSurfaces();
            stageRef.current.clear();
          } catch (cleanupError) {
            console.warn('3DMol cleanup warning:', cleanupError);
          }
        }
      }
      stageRef.current = null;
      setViewerReady(false);
    } catch (e) {
      console.warn('Cleanup error:', e);
    }
    
    // Clear DOM element completely for fresh initialisation
    if (viewerRef.current) {
      viewerRef.current.innerHTML = '';
    }
  }, [viewerType]);

  /* Viewer Height Update Effect */
  useEffect(() => {
    setCurrentHeight(calculateViewerHeight());
    
    // NGL viewer auto-centering with expansion state changes
    if (viewerReady && stageRef.current && viewerType === 'ngl') {
      setTimeout(() => {
        if (stageRef.current && stageRef.current.autoView) {
          // Force stage recognition of new container size
          stageRef.current.handleResize();
          stageRef.current.autoView(500); // Smooth animation timing
          
          // Backup attempt for reliability
          setTimeout(() => {
            if (stageRef.current && stageRef.current.autoView) {
              stageRef.current.handleResize();
              stageRef.current.autoView(250);
            }
          }, 100);
        }
      }, 250);
    }
  }, [isExpanded, calculateViewerHeight, viewerReady, viewerType, setCurrentHeight]);

  /* Expansion Toggle Handler */
  const handleToggleExpanded = useCallback(() => {
    toggleExpanded();
  }, [toggleExpanded]);

  /* 3DMol Style Application */
  const applyVisualisationStyle = useCallback((viewer, style) => {
    apply3DMolStyle(viewer, style, selectedChain, segmentStart, segmentEnd, isModelledStructure);
  }, [selectedChain, segmentStart, segmentEnd, isModelledStructure]);

  /* NGL Representation Application */
  const applyNGLRepresentationCallback = useCallback((structure, style) => {
    applyNGLRepresentation(structure, style, selectedChain, segmentStart, segmentEnd, isModelledStructure);
  }, [selectedChain, segmentStart, segmentEnd, isModelledStructure]);

  /* Representation Update Effect */
  useEffect(() => {
    if (viewerReady && stageRef.current) {
      updateVisualisation();
    }
  }, [representation, selectedChain, segmentStart, segmentEnd, viewerReady]);

  /* Visualisation Update Handler */
  const updateVisualisation = useCallback(() => {
    if (!stageRef.current || !viewerReady) return;

    try {
      if (viewerType === '3dmol') {
        applyVisualisationStyle(stageRef.current, representation);
      } else if (viewerType === 'ngl' && stageRef.current.structure) {
        applyNGLRepresentationCallback(stageRef.current.structure, representation);
        
        // Auto-center after representation change
        setTimeout(() => {
          if (stageRef.current) {
            stageRef.current.autoView();
          }
        }, 200);
      }
      setLastSuccessfulStyle(representation);
    } catch (err) {
      console.error('Error updating visualisation:', err);
      // Revert to last successful style
      if (representation !== lastSuccessfulStyle) {
        setRepresentation(lastSuccessfulStyle);
      }
    }
  }, [viewerType, representation, viewerReady, applyVisualisationStyle, applyNGLRepresentationCallback, lastSuccessfulStyle]);

  /* Viewer Initialisation */
  const initialiseViewer = useCallback(async () => {
    if (!pdbContent || !viewerRef.current) {
      setError('Missing PDB content or viewer container');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    setViewerReady(false);
    
    // Force cleanup before initialisation
    cleanup();
    
    // Ensure DOM is clean before initialisation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const viewer = await initViewerUtil(
        viewerType, 
        viewerRef, 
        pdbContent, 
        representation, 
        applyVisualisationStyle, 
        applyNGLRepresentationCallback
      );
      stageRef.current = viewer;
      setViewerReady(true);
      setLastSuccessfulStyle(representation);
    } catch (err) {
      console.error('Viewer initialisation error:', err);
      setError(`Failed to initialise ${viewerType.toUpperCase()} viewer: ${err.message}`);
      setViewerReady(false);
    } finally {
      setIsLoading(false);
    }
  }, [pdbContent, viewerType, cleanup, representation, applyVisualisationStyle, applyNGLRepresentationCallback]);

  /* Viewer Initialisation Effect */
  useEffect(() => {
    if (pdbContent && viewerRef.current) {
      initialiseViewer();
    }
    return cleanup;
  }, [pdbContent, viewerType, initialiseViewer, cleanup]);

  /* Viewer Control Functions */
  const switchViewer = useCallback((newViewerType) => {
    switchViewerUtil(
      newViewerType, 
      viewerType, 
      cleanup, 
      setIsLoading, 
      setViewerType, 
      setViewerKey, 
      setRepresentation,
      viewerRef
    );
  }, [viewerType, cleanup]);

  const changeRepresentation = useCallback((newRepr) => {
    changeRepresentationUtil(newRepr, representation, setRepresentation);
  }, [representation]);

  const centerView = useCallback(() => {
    centerViewUtil(stageRef, viewerReady, viewerType);
  }, [viewerReady, viewerType]);

  const resetViewer = useCallback(() => {
    resetViewerUtil(cleanup, setViewerKey, initialiseViewer);
  }, [cleanup, initialiseViewer]);

  // Error State Display
  if (error) {
    return (
      <ViewerErrorDisplay
        error={error}
        height={height}
        viewerType={viewerType}
        onResetViewer={resetViewer}
        onSwitchViewer={switchViewer}
      />
    );
  }

  // No Data State Display
  if (!pdbContent) {
    return <ViewerNoDataDisplay height={height} />;
  }

  return (
    <div className="protein-viewer-container" key={viewerKey}>
      
      {/* Viewer Controls Interface */}
      <ViewerControls
        viewerType={viewerType}
        representation={representation}
        isLoading={isLoading}
        viewerReady={viewerReady}
        selectedChain={selectedChain}
        segmentStart={segmentStart}
        segmentEnd={segmentEnd}
        isModelledStructure={isModelledStructure}
        isExpanded={isExpanded}
        onSwitchViewer={switchViewer}
        onChangeRepresentation={changeRepresentation}
        onCenterView={centerView}
        onResetViewer={resetViewer}
        onToggleExpanded={handleToggleExpanded}
        showControls={showControls}
      />
      
      {/* Main Viewer Container */}
      <div
        className="position-relative bg-white border"
        style={{ 
          height: `${currentHeight}px`, 
          width: '100%',
          transition: 'height 0.3s ease-in-out'
        }}
      >
        <ViewerLoadingOverlay isLoading={isLoading} viewerType={viewerType} />
        <div
          ref={viewerRef}
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: `${currentHeight}px`
          }}
        />
        
        {/* Information Overlay */}
        <ViewerInfoOverlay
          pdbCode={pdbCode}
          viewerReady={viewerReady}
          selectedChain={selectedChain}
          segmentStart={segmentStart}
          segmentEnd={segmentEnd}
          isModelledStructure={isModelledStructure}
          isExpanded={isExpanded}
        />
      </div>
      
      {/* Viewer Legend */}
      <ViewerLegend
        showControls={showControls}
        selectedChain={selectedChain}
        segmentStart={segmentStart}
        segmentEnd={segmentEnd}
        isModelledStructure={isModelledStructure}
        viewerType={viewerType}
        representation={representation}
        viewerReady={viewerReady}
        isExpanded={isExpanded}
      />
      
    </div>
  );
};

export default ProteinViewer;