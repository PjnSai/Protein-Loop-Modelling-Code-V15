/* SystemStatusCard.jsx - MATLAB System Status Display Component */

/* SystemStatusCard Component */
const SystemStatusCard = ({ statistics }) => {
  
  /* Status Data Validation */
  if (statistics.matlab_available === undefined) {
    return null;
  }

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center">
          
          {/* Visual Status Indicator with Colour Coding */}
          <div className="me-3">
            <div 
              className={`rounded-circle d-flex align-items-center justify-content-center ${
                statistics.matlab_available ? 'bg-success' : 'bg-warning'
              }`} 
              style={{ width: '40px', height: '40px' }}
            >
              <svg width="20" height="20" fill="white">
                {statistics.matlab_available ? (
                  
                  /* Success Icon - MATLAB Available */
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                ) : (
                  
                  /* Warning Icon - MATLAB Unavailable */
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                )}
              </svg>
            </div>
          </div>
          
          {/* Status Information and User Messaging */}
          <div className="flex-grow-1">
            <h6 className="mb-0">MATLAB System Status</h6>
            <p className="mb-0 text-muted">
              {statistics.matlab_available 
                ? 'MATLAB computational engine is available and ready for protein loop modelling'
                : 'MATLAB system temporarily unavailable - submitted jobs will be queued until service restoration'
              }
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SystemStatusCard;