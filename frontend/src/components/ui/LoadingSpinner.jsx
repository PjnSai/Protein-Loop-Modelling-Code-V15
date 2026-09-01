/* LoadingSpinner.jsx - Loading State Indicator Component */

/*LoadingSpinner Component */
const LoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullPage = false,
  className = ''
}) => {
  // Size Configuration Mapping
  const sizeClasses = {
    sm: 'spinner-border-sm',     // Small spinner for buttons and inline use
    md: '',                      // Standard medium spinner (default)
    lg: 'spinner-grow'           // Large growing spinner for prominence
  };

  // Core Spinner Element
  const spinner = (
    <div className={`text-center ${className}`}>
      
      {/* Bootstrap Spinner with Size Variant */}
      <div className={`spinner-border text-primary ${sizeClasses[size]}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      
      {/* Optional Loading Text */}
      {text && <p className="mt-3 text-muted">{text}</p>}
      
    </div>
  );

  // Full-Page Display Mode
  if (fullPage) {
    return (
      <div className="d-flex align-items-center justify-content-center" 
           style={{ minHeight: '50vh' }}>
        {spinner}
      </div>
    );
  }

  // Standard Inline Display Mode
  return spinner;
};

export default LoadingSpinner;