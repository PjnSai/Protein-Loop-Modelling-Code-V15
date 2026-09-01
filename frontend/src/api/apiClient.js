/* apiClient.js - Centralised API Client */

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/* ApiClient Class */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /* Request Method */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include',  // Include session cookies for authentication
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return { ok: response.ok, data, status: response.status };
    } catch (error) {
      console.error('API Request failed:', error);
      return { 
        ok: false, 
        data: { error: 'Network error. Please try again.' },
        status: 0 
      };
    }
  }

  /* Authentication API Endpoints */
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  /* User Account Registration */
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  /* OTP Verification for Two-Factor Authentication */
  async verifyOTP(email, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  /* OTP Code Resend */
  async resendOTP(email) {
    return this.request('/auth/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /* User Session Logout */
  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  /* Password Reset Request */
  async requestPasswordReset(email) {
    return this.request('/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  /* Password Reset Completion */
  async resetPassword(email, token, password) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  }

  /* Authenticated Password Change */
  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  /* User Management API Endpoints */

  /* Get User Profile Information */
  async getProfile() {
    return this.request('/api/profile');
  }

  /* Update User Profile */
  async updateProfile(profileData) {
    return this.request('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  /* Get User Activity Logs */
  async getUserLogs(page = 1) {
    return this.request(`/api/logs?page=${page}`);
  }

  /* Dashboard API Endpoints */

  /* Check Authentication Status */
  async checkAuthStatus() {
    return this.request('/dashboard');
  }

  /* Get Dashboard Jobs */
  async getDashboardJobs(page = 1) {
    return this.request(`/api/dashboard/jobs?page=${page}`);
  }

  /* Get Dashboard Statistics */
  async getDashboardStats() {
    return this.request('/api/dashboard/statistics');
  }

  /* Get Job Details */
  async getJobDetails(jobId) {
    return this.request(`/api/dashboard/job/${jobId}`);
  }

  /* Protein Loop Modelling API Endpoints */
  async fetchPDBStructure(pdbCode) {
    return this.request(`/api/pdb/fetch/${pdbCode}`);
  }

  /* Search PDB Database */
  async searchPDB(query) {
    return this.request(`/api/demo/pdb/search?q=${encodeURIComponent(query)}`);
  }

  /* Fetch PDB Structure (Demo Mode) */
  async fetchDemoPDB(pdbCode) {
    return this.request(`/api/demo/pdb/fetch/${pdbCode}`);
  }

  /* Prepare Modelling Parameters */
  async prepareModelling(data) {
    return this.request('/api/demo/modelling/prepare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /* Submit Modelling Job */
  async submitModelling(data, isDemo = false) {
    const endpoint = isDemo ? '/api/demo/modelling/submit' : '/api/modelling/submit';
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /* Get Job Status */
  async getJobStatus(jobId) {
    return this.request(`/api/modelling/job/${jobId}/status`);
  }

  /* Get Job with Results */
  async getJobWithResults(jobId) {
    return this.request(`/api/modelling/job/${jobId}/details`);
  }

  /* Download Job Results */
  async downloadJobResults(jobId, isDemo = false) {
    const endpoint = isDemo ? 
      `/api/demo/job/${jobId}/download` : 
      `/api/modelling/job/${jobId}/download`;
    
    const url = `${this.baseURL}${endpoint}`;
    return fetch(url, { credentials: 'include' });
  }

  /* Cancel Running Job */
  async cancelJob(jobId) {
    return this.request(`/api/modelling/job/${jobId}/cancel`, {
      method: 'DELETE',
    });
  }

  /* Get Modelling System Status */
  async getModellingSystemStatus() {
    return this.request('/api/modelling/status');
  }

  /* Get System Health */
  async getSystemHealth() {
    return this.request('/api/health');
  }
}

// Create single instance for application-wide usage
const apiClient = new ApiClient();
export default apiClient;

/* Modular API Exports for Backward Compatibility */

/* Authentication API Module */
export const authAPI = {
  login: (data) => apiClient.login(data),
  register: (data) => apiClient.register(data),
  verifyOTP: (email, otp) => apiClient.verifyOTP(email, otp),
  resendOTP: (email) => apiClient.resendOTP(email),
  logout: () => apiClient.logout(),
  requestPasswordReset: (email) => apiClient.requestPasswordReset(email),
  resetPassword: (email, token, password) => apiClient.resetPassword(email, token, password),
  changePassword: (data) => apiClient.changePassword(data),
};

/* User Management API Module */
export const userAPI = {
  getProfile: () => apiClient.getProfile(),
  updateProfile: (data) => apiClient.updateProfile(data),
  getUserLogs: (page) => apiClient.getUserLogs(page),
};

/* Modelling API Module */
export const modellingAPI = {
  fetchPDBStructure: (pdbCode) => apiClient.fetchPDBStructure(pdbCode),
  searchPDB: (query) => apiClient.searchPDB(query),
  fetchDemoPDB: (pdbCode) => apiClient.fetchDemoPDB(pdbCode),
  prepareModelling: (data) => apiClient.prepareModelling(data),
  submitModelling: (data, isDemo) => apiClient.submitModelling(data, isDemo),
  getJobStatus: (jobId) => apiClient.getJobStatus(jobId),
  getJobWithResults: (jobId) => apiClient.getJobWithResults(jobId),
  downloadJobResults: (jobId, isDemo) => apiClient.downloadJobResults(jobId, isDemo),
  cancelJob: (jobId) => apiClient.cancelJob(jobId),
  getSystemStatus: () => apiClient.getModellingSystemStatus(),
};

/* Dashboard API Module */
export const dashboardAPI = {
  checkAuthStatus: () => apiClient.checkAuthStatus(),
  getJobs: (page) => apiClient.getDashboardJobs(page),
  getStats: () => apiClient.getDashboardStats(),
  getJobDetails: (jobId) => apiClient.getJobDetails(jobId),
};