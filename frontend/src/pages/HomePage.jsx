/* HomePage.jsx - Application Landing Page */

import { FaRocket, FaPlay, FaUserPlus } from 'react-icons/fa';

// Reusable component imports for modular page
import HeroSection from '../components/widgets/HeroSection';
import FeaturesGrid from '../components/widgets/FeaturesGrid';
import DashboardLinks from '../components/widgets/DashboardLinks';

// Authentication hook for user status checking
import useAuth from '../hooks/useAuth';

/* HomePage Component */
const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="container mt-5">
      
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="mt-5">
        <h3 className="fw-bold text-center mb-1">Powerful Features</h3>
        <p className="text-muted text-center mb-4">
          Everything you need for protein loop modelling and analysis
        </p>
        <FeaturesGrid />
      </section>

      {/* Authenticated User Section - Dashboard Navigation */}
      {!isLoading && isAuthenticated && (
        <section className="mt-5">
          <h3 className="fw-bold text-center mb-1">Your Account Dashboard</h3>
          <p className="text-muted text-center mb-4">
            Quick access to your modelling activities
          </p>
          <DashboardLinks />
        </section>
      )}

      {/* Unauthenticated User Section - Registration and Demo Options */}
      {!isLoading && !isAuthenticated && (
        <section className="mt-5">
          <div className="card border-primary">
            
            {/* Call-to-Action Header */}
            <div className="card-header bg-primary text-white text-center">
              <h4 className="mb-0">
                <FaRocket className="me-2" />
                Get Started with Loop Modelling
              </h4>
            </div>
            
            {/* Options Presentation */}
            <div className="card-body text-center">
              <p className="mb-4">
                Ready to start protein loop modelling? You have two options:
              </p>
              
              <div className="row">
                
                {/* Demo Mode Option */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-info">
                    <div className="card-body">
                      <h5 className="card-title text-info">
                        <FaPlay className="me-2" />
                        Try Demo Mode
                      </h5>
                      <p className="card-text">
                        Test the system with real MATLAB processing. Results expire after 24 hours.
                      </p>
                      <a href="/modelling" className="btn btn-info">
                        Start Demo
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Account Creation Option */}
                <div className="col-md-6 mb-3">
                  <div className="card h-100 border-success">
                    <div className="card-body">
                      <h5 className="card-title text-success">
                        <FaUserPlus className="me-2" />
                        Create Account
                      </h5>
                      <p className="card-text">
                        Register for free to save results permanently and access advanced features.
                      </p>
                      <a href="/register" className="btn btn-success">
                        Register Free
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Existing User Navigation */}
              <div className="mt-3">
                <small className="text-muted">
                  Already have an account? <a href="/login" className="text-primary">Sign in here</a>
                </small>
              </div>
              
            </div>
          </div>
        </section>
      )}
      
    </div>
  );
};

export default HomePage;