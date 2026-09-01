/* useFullscreen.js - Fullscreen State Management Hook */

import { useState, useCallback } from 'react';

/* useFullscreen Hook */
export const useFullscreen = () => {
  // Fullscreen State Management
  const [isFullscreen, setIsFullscreen] = useState(false);      // Fullscreen display state
  const [fullscreenData, setFullscreenData] = useState(null);  // Data for fullscreen content

  /* Open Fullscreen with Data */
  const openFullscreen = useCallback((data) => {
    setFullscreenData(data);
    setIsFullscreen(true);
  }, []);

  /* Close Fullscreen and Clear Data */
  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setFullscreenData(null);
  }, []);

  /* Toggle Fullscreen State */
  const toggleFullscreen = useCallback((data) => {
    if (isFullscreen) {
      closeFullscreen();
    } else {
      openFullscreen(data);
    }
  }, [isFullscreen, openFullscreen, closeFullscreen]);

  return {
    isFullscreen,        // Current fullscreen state (boolean)
    fullscreenData,      // Current fullscreen data payload
    openFullscreen,      // Function to open fullscreen with data
    closeFullscreen,     // Function to close fullscreen and clear data
    toggleFullscreen     // Function to toggle fullscreen state
  };
};

export default useFullscreen;