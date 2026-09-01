// ConfirmDialog.jsx - Modal Confirmation Dialog Component

// ConfirmDialog Component
const ConfirmDialog = ({ 
  isOpen, 
  title = 'Confirm Action', 
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'primary'
}) => {
  
  // Conditional Rendering: Only render when dialog is open
  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          
          {/* Modal Header with Title */}
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
          </div>
          
          {/* Modal Body with Confirmation Message */}
          <div className="modal-body">
            <p>{message}</p>
          </div>
          
          {/* Modal Footer with Action Buttons */}
          <div className="modal-footer">
            
            {/* Cancellation Button */}
            <button 
              type="button" 
              className="btn btn-outline-secondary"
              onClick={onCancel}
            >
              {cancelText}
            </button>
            
            {/* Confirmation Button */}
            <button 
              type="button" 
              className={`btn btn-${variant}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;