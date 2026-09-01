// FullscreenViewer.jsx - Fullscreen Protein Structure Viewer Component


import { useEffect } from 'react';
import { FaTimes, FaExpand } from 'react-icons/fa';
import ProteinViewer from '../ProteinViewer';

// FullscreenViewer Component
const FullscreenViewer = ({ 
  isOpen, 
  onClose, 
  title = "Protein Structure",
  pdbContent,
  pdbCode,
  selectedChain,
  segmentStart,
  segmentEnd,
  isModelledStructure = false
}) => {
  // Fullscreen Mode Management Effect

  useEffect(() => {
    // ESC Key Handler
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Configure fullscreen environment when viewer is open
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';     // Prevent background scroll
      document.body.style.position = 'fixed';     // Prevent mobile scroll issues
      document.body.style.width = '100%';         // Maintain proper width
    }
    
    // Cleanup function for proper resource management
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen, onClose]);

  // Early return when fullscreen is not active
  if (!isOpen) return null;

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-95" 
      style={{ zIndex: 9999 }}
      onClick={(e) => e.target === e.currentTarget && onClose()} // Click outside to close
    >
      <div className="position-relative w-100 h-100 d-flex flex-column">
        
        {/* Professional Header Bar */}
        <div className="bg-dark text-white p-3 d-flex justify-content-between align-items-center">
          <div>
            
            {/* Primary Title with Icon */}
            <h5 className="mb-0 text-white">
              <FaExpand className="me-2" />
              {title}
            </h5>
            
            {/* Contextual Information */}
            <small className="text-light opacity-75">
              {pdbCode}
              {selectedChain && ` • Chain ${selectedChain}`}
              {segmentStart && segmentEnd && ` • Segment ${segmentStart}-${segmentEnd}`}
              {isModelledStructure && ' • Modelled Structure'}
            </small>
            
          </div>
          
          {/* Close Button with Keyboard Hint */}
          <button 
            className="btn btn-outline-light"
            onClick={onClose}
            title="Close fullscreen (ESC)"
          >
            <FaTimes className="me-1" />
            Close
          </button>
        </div>
        
        {/* Protein Viewer */}
        <div className="flex-grow-1 p-2">
          <ProteinViewer
            pdbContent={pdbContent}
            pdbCode={pdbCode}
            selectedChain={selectedChain}
            segmentStart={segmentStart}
            segmentEnd={segmentEnd}
            height={window.innerHeight - 120}    // Full height minus header/footer
            showControls={true}
            isModelledStructure={isModelledStructure}
            isFullscreenMode={true}              // Enable fullscreen-specific features
          />
        </div>
        
        {/* User Guidance Footer */}
        <div className="bg-dark text-center py-2">
          <small className="text-light opacity-75">
            Press ESC or click outside to close • Use controls above to change viewer and styles
          </small>
        </div>
        
      </div>
    </div>
  );
};

export default FullscreenViewer;