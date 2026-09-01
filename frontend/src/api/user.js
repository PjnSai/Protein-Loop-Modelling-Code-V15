// user.js - User Management API Module

import { userAPI, authAPI } from './apiClient';

/* User Profile Management Functions */

/* Retrieve Current User Profile Information */
export const getProfile = userAPI.getProfile;

/* Update User Profile Information */
export const updateProfile = userAPI.updateProfile;

/* User Activity Monitoring Functions */

/* Retrieve User Activity Logs with Pagination */
export const getLoginLog = userAPI.getUserLogs;

/* Security Operations */

/* Secure Password Change with Validation */
export const changePassword = authAPI.changePassword;