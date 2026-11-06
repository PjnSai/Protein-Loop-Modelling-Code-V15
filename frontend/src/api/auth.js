/* auth.js - Authentication API Module */

import { authAPI } from "./apiClient";

/* Authentication Function Exports */

/* User Login with Credential Validation */
export const login = authAPI.login;

// OTP Verification for Two-Factor Authentication
export const verifyOTP = authAPI.verifyOTP;

// OTP Code Resend Functionality
export const resendOTP = authAPI.resendOTP;

// Password Management Function Exports

// Password Reset Request Initiation
export const requestPasswordReset = authAPI.requestPasswordReset;

// Password Reset Completion
export const resetPassword = authAPI.resetPassword;

// User Registration Function with Parameter Adaptation
export const register = (email, password) =>
  authAPI.register({ email, password });
