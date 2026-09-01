/* HeroSection.jsx - Application Hero Banner Component*/

import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

/* HeroSection Component */
const HeroSection = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="bg-primary text-white text-center py-5 px-3 rounded shadow">
      <div className="container">
        
        {/* Application Title and Branding */}
        <h1 className="display-4 fw-bold mb-3">Protein Loop Modelling Server</h1>
        
        {/* Value Proposition and Capabilities Description */}
        <p className="lead mx-auto" style={{ maxWidth: '720px' }}>
          Advanced computational tools for protein structure prediction and loop modelling.
          Enter a PDB code, visualise structures in 3D, and generate optimised loop conformations using state-of-the-art algorithms.
        </p>
        
        {/* Authentication-Aware Navigation Buttons */}
        <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
          
          {/* Primary Call-to-Action: Continue Modelling */}
          <Link to="/modelling" className="btn btn-light btn-lg text-primary fw-semibold">
            Continue Modelling
          </Link>
          
          {/* Authenticated User Navigation: Dashboard Access */}
          {!isLoading && isAuthenticated && (
            <Link to="/dashboard" className="btn btn-outline-light btn-lg fw-semibold">
              View Dashboard
            </Link>
          )}
          
          {/* Guest User Navigation: Registration and Sign-In Options */}
          {!isLoading && !isAuthenticated && (
            <>
              <Link to="/register" className="btn btn-outline-light btn-lg fw-semibold">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg fw-semibold">
                Sign In
              </Link>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default HeroSection;