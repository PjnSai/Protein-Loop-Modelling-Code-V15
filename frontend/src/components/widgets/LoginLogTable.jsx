/* LoginLogTable.jsx - Activity Log Display Component */

/* LoginLogTable Component */
const LoginLogTable = ({ logs }) => {
  
  // Empty State Handling
  if (!logs || logs.length === 0) {
    return <p className="text-muted text-center">No login activity found.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        
        {/* Table Header with Clear Column Identification */}
        <thead>
          <tr>
            <th scope="col">Timestamp</th>
            <th scope="col">IP Address</th>
            <th scope="col">Device</th>
          </tr>
        </thead>
        
        {/* Table Body with Activity Log Data */}
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              
              {/* Formatted Timestamp Display */}
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              
              {/* IP Address with Fallback for Missing Data */}
              <td>{log.ip || 'Unknown'}</td>
              
              {/* Device Information with Fallback */}
              <td>{log.device || 'Unrecognised'}</td>
              
            </tr>
          ))}
        </tbody>
        
      </table>
    </div>
  );
};

export default LoginLogTable;