// FeaturesGrid.jsx - Application Features Showcase Component

import FeatureCard from '../ui/FeatureCard';
import { FaServer, FaCheckCircle, FaTemperatureHigh } from 'react-icons/fa';

/* Features Configuration */
const features = [
  {
    icon: <FaServer />,
    title: 'Secure Local Deployment',
    description: 'Run the system securely on your own machine or server.',
  },
  {
    icon: <FaTemperatureHigh />,
    title: 'MATLAB Integration Ready',
    description: 'Connects seamlessly to MATLAB for loop modelling routines.',
  },
  {
    icon: <FaCheckCircle />,
    title: 'Real-time Job Monitoring',
    description: 'Track modelling progress with automatic refresh and feedback.',
  },
];

/* FeaturesGrid Component */
const FeaturesGrid = () => (
  <div className="row mt-4">
    {features.map((feature, index) => (
      <FeatureCard
        key={index}
        icon={feature.icon}
        title={feature.title}
        description={feature.description}
      />
    ))}
  </div>
);

export default FeaturesGrid;