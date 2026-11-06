// FeaturesGrid.jsx - Application Features Showcase Component

import FeatureCard from "../ui/FeatureCard";
import { FaServer, FaCheckCircle, FaHistory } from "react-icons/fa";

/* Features Configuration */
const features = [
  {
    icon: <FaServer />,
    title: "Secure Local Deployment",
    description: "Run the system securely on your own machine or server.",
  },
  {
    icon: <FaTemperatureHigh />,
    title: "MATLAB Integration Ready",
    description: "Connects seamlessly to MATLAB for loop modelling routines.",
  },
  {
    icon: <FaHistory />,
    title: "Job History",
    description:
      "View, download and manage past modelling jobs from your dashboard.",
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
