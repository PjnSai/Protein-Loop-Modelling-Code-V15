/* apiClient.js - Centralised API Client */

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ApiClient Class */
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /* Request Method */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: "include", // Include session cookies for authentication
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      return { ok: response.ok, data, status: response.status };
    } catch (error) {
      console.error("API Request failed:", error);
      return {
        ok: false,
        data: { error: "Network error. Please try again." },
        status: 0,
      };
    }
  }

  /* Authentication API Endpoints */
  async login(credentials) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  /* User Account Registration */
  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  /* OTP Verification for Two-Factor Authentication */
  async verifyOTP(email, otp) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });
  }

  /* OTP Code Resend */
  async resendOTP(email) {
    return this.request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  /* User Session Logout */
  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  /* Password Reset Request */
  async requestPasswordReset(email) {
    return this.request("/auth/request-reset", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }

  /* Password Reset Completion */
  async resetPassword(email, token, password) {
    return this.request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ email, token, password }),
    });
  }

  /* Authenticated Password Change */
  async changePassword(passwordData) {
    return this.request("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwordData),
    });
  }

  /* User Management API Endpoints */

  /* Get User Profile Information */
  async getProfile() {
    return this.request("/api/profile");
  }

  /* Update User Profile */
  async updateProfile(profileData) {
    return this.request("/api/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }
  /* Check whether the current session is logged in */
  async checkAuthStatus() {
    return this.request("/dashboard");
  }
}

// Create single instance for application-wide usage
const apiClient = new ApiClient();
export default apiClient;

/* Grouped exports used by api/auth.js and api/user.js */
/* Authentication API Module */
export const authAPI = {
  login: (data) => apiClient.login(data),
  register: (data) => apiClient.register(data),
  verifyOTP: (email, otp) => apiClient.verifyOTP(email, otp),
  resendOTP: (email) => apiClient.resendOTP(email),
  requestPasswordReset: (email) => apiClient.requestPasswordReset(email),
  resetPassword: (email, token, password) =>
    apiClient.resetPassword(email, token, password),
  changePassword: (data) => apiClient.changePassword(data),
};

/* User Management API Module */
export const userAPI = {
  getProfile: () => apiClient.getProfile(),
  updateProfile: (data) => apiClient.updateProfile(data),
};
