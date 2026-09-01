/* StatisticsCards.jsx - Dashboard Statistics Overview Component */

/* StatisticsCards Component */
const StatisticsCards = ({ statistics }) => {
  return (
    <div className="row g-3 mb-4">
      
      {/* Total Jobs Card */}
      <div className="col-md-3">
        <div className="card border-0 bg-primary text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="card-title mb-0">Total Jobs</h6>
                <h3 className="mb-0">{statistics.total_jobs || 0}</h3>
              </div>
              <div className="opacity-75">
                {/* Document/List Icon for Total Jobs */}
                <svg width="24" height="24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Completed Jobs Card */}
      <div className="col-md-3">
        <div className="card border-0 bg-success text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="card-title mb-0">Completed</h6>
                <h3 className="mb-0">{statistics.status_counts?.completed || 0}</h3>
              </div>
              <div className="opacity-75">
                {/* Checkmark Icon for Completed Jobs */}
                <svg width="24" height="24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* In Progress Jobs Card */}
      <div className="col-md-3">
        <div className="card border-0 bg-warning text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="card-title mb-0">In Progress</h6>
                <h3 className="mb-0">
                  {(statistics.status_counts?.queued || 0) + (statistics.status_counts?.running || 0)}
                </h3>
              </div>
              <div className="opacity-75">
                {/* Loading/Progress Icon for In Progress Jobs */}
                <svg width="24" height="24" fill="currentColor">
                  <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Rate Card */}
      <div className="col-md-3">
        <div className="card border-0 bg-info text-white">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <div className="flex-grow-1">
                <h6 className="card-title mb-0">Success Rate</h6>
                <h3 className="mb-0">{statistics.success_rate || 0}%</h3>
              </div>
              <div className="opacity-75">
                {/* Target/Accuracy Icon for Success Rate */}
                <svg width="24" height="24" fill="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StatisticsCards;