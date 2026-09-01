/* logApi.js - Activity Log API Service */

/* Fetch User Activity Logs */
export const fetchLogs = async (currentPage, navigate) => {
  try {
    console.log(`Fetching logs for page ${currentPage}`);
    
    // Construct API request with pagination parameters
    const response = await fetch(`http://localhost:8000/api/logs?page=${currentPage}`, {
      method: 'GET',
      credentials: 'include',  // Include session cookies for authentication
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`Response status: ${response.status}`);
    
    // Handle authentication expiration
    if (response.status === 401) {
      console.log('Unauthorised - redirecting to login');
      navigate('/login');
      return { success: false, redirect: true };
    }
    
    // Parse JSON response data
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log(`Successfully loaded ${data.logs?.length || 0} logs`);
      return {
        success: true,
        logs: data.logs || [],
        totalPages: data.pages || 1,
        debugInfo: data.debug_info
      };
    } else {
      console.log(`Error: ${data.error}`);
      return { success: false, error: data.error || 'Failed to fetch logs' };
    }
  } catch (err) {
    console.error('Network error:', err);
    return { success: false, error: 'Network error: Unable to fetch logs' };
  }
};

/* Delete User Activity Logs */
export const deleteLogs = async (daysToDelete) => {
  // User-friendly confirmation message based on deletion
  const confirmMessage = daysToDelete === 'all' 
    ? 'Are you sure you want to delete ALL login logs? This cannot be undone.'
    : `Are you sure you want to delete logs older than ${daysToDelete} days? This cannot be undone.`;
    
  // User confirmation required for privacy protection
  if (!confirm(confirmMessage)) {
    return { success: false, cancelled: true };
  }
  
  try {
    // Prepare deletion request with appropriate parameters
    const response = await fetch('http://localhost:8000/api/logs/delete', {
      method: 'DELETE',
      credentials: 'include',  // Include session cookies for authentication
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        days_old: daysToDelete === 'all' ? null : parseInt(daysToDelete)
      })
    });
    
    // Parse deletion response
    const data = await response.json();
    
    if (response.ok) {
      // Success feedback to user
      alert(data.message);
      return { success: true, message: data.message };
    } else {
      return { success: false, error: data.error || 'Failed to delete logs' };
    }
  } catch (err) {
    return { success: false, error: 'Network error: Unable to delete logs' };
  }
};