/* validators.js - Form Validation Utilities*/

export function validatePassword(password, confirmPassword) {
  // Validate minimum password length for basic security
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  // Validate password confirmation matching
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  // Validation successful - return null to indicate no errors
  return null; 
}