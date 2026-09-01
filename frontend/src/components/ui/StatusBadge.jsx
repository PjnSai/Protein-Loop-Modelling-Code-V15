/**
 * StatusBadge.jsx - Status Indicator Badge Component
 * 
 
 */

import { FaClock, FaSpinner, FaCheck, FaTimes, FaExclamationTriangle, FaInfo, FaCircle } from 'react-icons/fa';

/* StatusBadge Component */
const StatusBadge = ({ status, variant = null }) => {
  // Status Configuration with Icons and Colour Variants
  const statusConfig = {
    'running': { 
      variant: 'primary', 
      icon: <FaSpinner className="fa-spin" />      // Animated spinner for active processes
    },
    'completed': { 
      variant: 'success', 
      icon: <FaCheck />                            // Checkmark for successful completion
    },
    'failed': { 
      variant: 'danger', 
      icon: <FaTimes />                            // X icon for failure states
    },
    'demo': { 
      variant: 'info', 
      icon: <FaInfo />                             // Info icon for demo mode
    },
  };

  // Get configuration or fallback to default styling
  const config = statusConfig[status] || { 
    variant: 'secondary', 
    icon: <FaCircle />                             // Generic circle for unknown states
  };
  
  // Use provided variant override or configured variant
  const badgeVariant = variant || config.variant;

  return (
    <span className={`badge bg-${badgeVariant}`}>
      
      {/* Status Icon with Spacing */}
      <span className="me-1">{config.icon}</span>
      
      {/* Capitalised Status Text */}
      {status.charAt(0).toUpperCase() + status.slice(1)}
      
    </span>
  );
};

export default StatusBadge;