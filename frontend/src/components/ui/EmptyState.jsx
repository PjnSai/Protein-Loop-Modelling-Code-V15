/* EmptyState.jsx - No Data Display Component */

import { FaInbox } from 'react-icons/fa';

/* EmptyState Component */
const EmptyState = ({ 
  icon = <FaInbox size={64} className="text-muted" />, 
  title = 'No Data', 
  description = 'Nothing to show here yet.',
  action = null,
  className = ''
}) => {
  return (
    <div className={`text-center py-5 ${className}`}>
      
      {/* Icon Display Section */}
      <div className="mb-4">
        {icon}
      </div>
      
      {/* Title and Description */}
      <h5 className="text-muted">{title}</h5>
      <p className="text-muted mb-4">{description}</p>
      
      {/* Optional Call-to-Action Element */}
      {action && action}
      
    </div>
  );
};

export default EmptyState;