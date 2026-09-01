//SystemStatusBanners.jsx - System Status and User Mode Notification Component

import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaInfoCircle, FaCheck } from 'react-icons/fa';

// SystemStatusBanners Component
const SystemStatusBanners = ({ 
  isAuthenticated,     // User authentication status for mode determination
  systemStatus         // Current system availability and operational status
}) => {
  return (
    <>
      {/* MATLAB System Unavailability Alert */}
      {systemStatus && !systemStatus.system_ready && !systemStatus.demo_mode && (
        <div className="alert alert-warning" role="alert">
          <div className="d-flex align-items-center">
            
            {/* Warning Icon for Visual Error Identification */}
            <div className="me-3">
              <FaExclamationTriangle size={24} />
            </div>
            
            {/* Error Information and User Guidance */}
            <div className="flex-grow-1">
              <strong>MATLAB System Unavailable:</strong> {systemStatus.message}
              <div className="small mt-1">
                Loop modelling is temporarily unavailable. Please try again later.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demo Mode Information Banner */}
      {!isAuthenticated && (
        <div className="alert alert-info" role="alert">
          <div className="d-flex align-items-center">
            
            {/* Information Icon for Mode Identification */}
            <div className="me-3">
              <FaInfoCircle size={24} />
            </div>
            
            {/* Demo Mode Features and Registration Encouragement */}
            <div className="flex-grow-1">
              <strong>Demo Mode - Real MATLAB Processing</strong>
              <div className="mt-1">
                You're using real MATLAB-powered loop modelling in demo mode. Results expire after 24 hours. 
                <Link to="/register" className="alert-link ms-1">Register for free</Link> to save results permanently and access advanced features.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SystemStatusBanners;