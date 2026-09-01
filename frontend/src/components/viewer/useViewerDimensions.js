// useViewerDimensions.js - Protein Viewer Dimension Management Hooks

import { useState, useEffect, useCallback } from 'react';

// useViewerDimensions Hook
export const useViewerDimensions = (height, isExpanded) => {

  // Dynamic Height Calculation
  const calculateViewerHeight = useCallback(() => {
    const screenHeight = window.innerHeight;
    
    if (isExpanded) {
      // Expanded height: 60% of screen height, minimum 600px, maximum 800px
      return Math.min(800, Math.max(600, screenHeight * 0.6));
    } else {
      // Normal height: 30% of screen height, minimum 350px, use prop height as default
      return Math.max(350, Math.min(height, screenHeight * 0.3));
    }
  }, [isExpanded, height]);

  // Current height state with intelligent initial calculation
  const [currentHeight, setCurrentHeight] = useState(() => calculateViewerHeight());

  // Window Resize Handler Effect
  useEffect(() => {
    const handleResize = () => {
      setCurrentHeight(calculateViewerHeight());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateViewerHeight]);

  return {
    currentHeight,           // Current calculated height for viewer
    setCurrentHeight,        // Manual height override function
    calculateViewerHeight    // Height calculation function for external use
  };
};

// useViewerExpansion Hook
export const useViewerExpansion = () => {
  // Expansion state tracking
  const [isExpanded, setIsExpanded] = useState(false);

  // Expansion Toggle Handler
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  return {
    isExpanded,      // Current expansion state boolean
    toggleExpanded   // Function to toggle expansion state
  };
};