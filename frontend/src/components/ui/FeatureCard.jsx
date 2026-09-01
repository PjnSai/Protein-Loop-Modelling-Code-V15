/* FeatureCard.jsx - Application Feature Showcase Component */

/* FeatureCard Component */
const FeatureCard = ({ icon, title, description }) => (
  <div className="col-md-4 mb-4">
    <div className="card border-0 shadow-sm h-100 text-center">
      <div className="card-body">
        
        {/* Feature Icon Display */}
        <div className="fs-2 mb-3 text-primary">{icon}</div>
        
        {/* Feature Title */}
        <h5 className="card-title">{title}</h5>
        
        {/* Feature Description */}
        <p className="card-text text-muted">{description}</p>
        
      </div>
    </div>
  </div>
);

export default FeatureCard;