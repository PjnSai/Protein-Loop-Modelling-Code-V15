/* ErrorBoundary.jsx - Application Error Handling System */
import React from 'react';
import { FaHome, FaRedo, FaSync } from 'react-icons/fa';

// ErrorBoundary Class Component 
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false,      // Error state tracking
      error: null,          // Error object details
      errorInfo: null       // React error information and stack trace
    };
  }

  // Static Error State Derivation 
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  // Component Error Capture 
  componentDidCatch(error, errorInfo) {
    // Log the error details for monitoring and debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  // Error State Reset Handler 
  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    // Error State - Display Error Recovery Interface
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card border-danger">
                
                {/* Error Header */}
                <div className="card-header bg-danger text-white">
                  <h5 className="mb-0">
                    <svg width="20" height="20" fill="currentColor" className="me-2" viewBox="0 0 16 16">
                      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    Something went wrong
                  </h5>
                </div>
                
                {/* Error Information and Recovery Guidance */}
                <div className="card-body">
                  <p className="card-text">
                    An unexpected error occurred in the application. This could be due to:
                  </p>
                  <ul className="mb-3">
                    <li>Network connectivity issues</li>
                    <li>Browser compatibility problems</li>
                    <li>Temporary server issues</li>
                    <li>Invalid data processing</li>
                  </ul>
                  
                  {/* Recovery Action Buttons */}
                  <div className="d-flex gap-2 mb-3">
                    <button 
                      className="btn btn-primary"
                      onClick={this.handleRetry}
                    >
                      <FaRedo className="me-1" /> Try Again
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.href = '/'}
                    >
                      <FaHome className="me-1" /> Go Home
                    </button>
                    <button 
                      className="btn btn-outline-secondary"
                      onClick={() => window.location.reload()}
                    >
                      <FaSync className="me-1" /> Reload Page
                    </button>
                  </div>

                  {/* Development Error Details */}
                  {process.env.NODE_ENV === 'development' && this.state.error && (
                    <div className="mt-3">
                      <h6>Development Error Details:</h6>
                      <div className="bg-light p-3 rounded">
                        <small>
                          <strong>Error:</strong> {this.state.error.toString()}
                          <br />
                          <strong>Component Stack:</strong>
                          <pre className="mt-1 small text-muted">
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </small>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* User Guidance Footer */}
                <div className="card-footer text-muted">
                  <small>
                    If this problem persists, try refreshing the page or clearing your browser cache.
                  </small>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Normal State - Render Children Components
    return this.props.children;
  }
}

export default ErrorBoundary;

/* Higher-Order Component for Error Boundary Wrapping */
export const withErrorBoundary = (Component, fallbackProps = {}) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary {...fallbackProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

/* Error Handler Hook for Functional Components */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);
  
  const handleError = React.useCallback((error) => {
    console.error('Handled error:', error);
    setError(error);
  }, []);

  // Throw error to trigger error boundary
  if (error) {
    throw error;
  }

  return { handleError, resetError };
};