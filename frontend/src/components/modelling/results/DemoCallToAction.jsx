// DemoCallToAction.jsx - Demo User Engagement Component

import React from 'react';

// DemoCallToAction Component
const DemoCallToAction = ({ onRegister, onLogin }) => {
  return (
    <div className="card mt-4 border-primary">
      
      {/* Engagement Header */}
      <div className="card-header bg-primary text-white">
        <h6 className="mb-0">Ready for Real Loop Modelling?</h6>
      </div>
      
      {/* Value Proposition Content */}
      <div className="card-body">
        <p className="mb-3">
          This demo showed you what our protein loop modelling can do. 
          Register now to access:
        </p>
        
        {/* Feature Benefits Grid */}
        <div className="row">
          
          {/* Technical Capabilities Column */}
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>Real MATLAB-powered calculations</li>
              <li>Publication-quality results</li>
              <li>Advanced parameter control</li>
            </ul>
          </div>
          
          {/* Workflow Benefits Column */}
          <div className="col-md-6">
            <ul className="list-unstyled">
              <li>Job history and management</li>
              <li>Batch processing capabilities</li>
              <li>Scientific support</li>
            </ul>
          </div>
        </div>
        
        {/* Call-to-Action Buttons */}
        <div className="text-center">
          <button
            className="btn btn-primary btn-lg me-2"
            onClick={onRegister}
          >
            Create Free Account
          </button>
          <button
            className="btn btn-outline-primary btn-lg"
            onClick={onLogin}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoCallToAction;