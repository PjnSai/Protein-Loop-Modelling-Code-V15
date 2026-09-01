/* UserInfoCard.jsx - User Account  Information Display Component */

/* UserInfoCard Component */
const UserInfoCard = ({ email }) => (
  <div className="card mb-4">
    <div className="card-body text-center">
      
      {/* User Avatar Section */}
      <div className="mb-3">
        <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center" 
             style={{ width: '80px', height: '80px' }}>
          
          {/* Professional User Icon SVG */}
          <svg width="32" height="32" fill="white" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 6v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1z" />
          </svg>
          
        </div>
      </div>
      
      {/* User Email Display */}
      <h4>{email}</h4>
      
      {/* Membership Information */}
      <p className="text-muted">Member since {new Date().toLocaleDateString()}</p>
      
    </div>
  </div>
);

export default UserInfoCard;