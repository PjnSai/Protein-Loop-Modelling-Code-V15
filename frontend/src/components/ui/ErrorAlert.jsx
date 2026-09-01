/* ErrorAlert.jsx - Comprehensive Error Display Component */

/* ErrorAlert Component */
const ErrorAlert = ({ 
  error, 
  onRetry = null, 
  onDismiss = null,
  variant = 'danger',
  showDetails = false 
}) => {
  // Early return for no error state
  if (!error) return null;

  // Extract user-friendly error message from various input types
  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

  return (
    <div className={`alert alert-${variant} ${onDismiss ? 'alert-dismissible' : ''}`} role="alert">
      <div className="d-flex align-items-start">
        
        {/* Error Icon Display */}
        <div className="me-3">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
        </div>
        
        {/* Error Content Section */}
        <div className="flex-grow-1">
          <strong>Error:</strong> {errorMessage}
          
          {/* Technical Details Section for Development */}
          {showDetails && error.stack && (
            <details className="mt-2">
              <summary className="text-muted small">Show technical details</summary>
              <pre className="small text-muted mt-1">{error.stack}</pre>
            </details>
          )}
          
          {/* Retry Action Button */}
          {onRetry && (
            <div className="mt-2">
              <button className="btn btn-outline-primary btn-sm" onClick={onRetry}>
                Try Again
              </button>
            </div>
          )}
        </div>
        
        {/* Dismissal Button */}
        {onDismiss && (
          <button 
            type="button" 
            className="btn-close" 
            onClick={onDismiss}
            aria-label="Close"
          ></button>
        )}
        
      </div>
    </div>
  );
};

export default ErrorAlert;