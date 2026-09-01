/* logUtils.jsx - Activity Log Utility Functions */
import { FaKey, FaEdit, FaRedo, FaCheck, FaChartBar, FaDna, FaTimes, FaClipboard, FaLock } from 'react-icons/fa';

/* Get Status Badge Styling*/
export const getStatusBadge = (status) => {
  const statusStyles = {
    'success': 'bg-success',        // Green: Successful operations
    'failed': 'bg-danger',          // Red: Failed operations or errors
    'locked': 'bg-warning',         // Yellow: Account locked or security warnings
    'sent': 'bg-info',              // Blue: Information events (emails sent)
    'otp-sent': 'bg-info',          // Blue: OTP delivery confirmation
    'otp-verify': 'bg-success'      // Green: Successful OTP verification
  };
  return `badge ${statusStyles[status] || 'bg-secondary'}`;
};

/* Get Action Icon Component */
export const getActionIcon = (action) => {
  const icons = {
    'login': <FaKey className="text-primary" />,              // Login authentication
    'register': <FaEdit className="text-success" />,          // Account registration
    'reset-request': <FaRedo className="text-warning" />,     // Password reset request
    'reset-complete': <FaCheck className="text-success" />,   // Password reset completion
    'pdb-fetch': <FaChartBar className="text-info" />,        // Protein database access
    'modelling-submit': <FaDna className="text-primary" />,   // Modelling job submission
    'modelling-error': <FaTimes className="text-danger" />,   // Modelling failures
    'otp-verify': <FaLock className="text-success" />,        // OTP verification
    'logout': <FaTimes className="text-muted" />              // Logout events
  };
  return icons[action] || <FaClipboard className="text-muted" />;
};

/* Format Timestamp for Display */
export const formatDate = (timestamp) => {
  try {
    // Handle numeric Unix timestamps (seconds since epoch)
    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toLocaleString();
    } 
    // Handle other timestamp formats (Date objects, ISO strings)
    else {
      return new Date(timestamp).toLocaleString();
    }
  } catch (e) {
    // Graceful error handling for malformed timestamps
    return 'Invalid date';
  }
};