/* ProfilePage.jsx - User Profile Management Interface */

import { useEffect, useState } from 'react';

// API services for user profile management
import { getProfile, updateProfile, changePassword } from '../api/user';

// Validation utilities for form input checking
import { validatePassword } from '../utils/validators';

// Component imports for modular interface 
import UserInfoCard from '../components/widgets/UserInfoCard';
import ProfileInfoForm from '../components/forms/ProfileInfoForm';
import ChangePasswordForm from '../components/forms/ChangePasswordForm';

/* ProfilePage Component */
const ProfilePage = () => {
  // Profile Information State
  const [profile, setProfile] = useState({
    first_name: '',      // User's first name
    last_name: '',       // User's last name
    institution: '',     // Academic or research institution
    bio: '',             // Professional biography or research interests
    email: '',           // Account email address (read-only)
  });

  // Password Management State
  const [passwordData, setPasswordData] = useState({
    current_password: '',    // Current password for verification
    new_password: '',        // New password for update
    confirm_password: '',    // Password confirmation for validation
  });

  // UI State Management
  const [showPasswordChange, setShowPasswordChange] = useState(false); // Password form visibility
  const [isSaving, setIsSaving] = useState(false);                     // Save operation feedback
  const [error, setError] = useState(null);                           // Error display management

  /* Effect Hook - Profile Data Loading */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { ok, data } = await getProfile();
        if (ok) {
          setProfile(data);
        } else {
          setError(data?.error || 'Failed to load profile.');
        }
      } catch {
        setError('Network error. Please try again.');
      }
    };
    fetchProfile();
  }, []);

  /* Update Profile Information Handler */
  const updateProfileHandler = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const { ok, data } = await updateProfile(profile);
      if (!ok) {
        setError(data?.error || 'Failed to update profile.');
      } else {
        // Clear error on successful update
        setError(null);
      }
    } catch {
      setError('Error updating profile.');
    } finally {
      setIsSaving(false);
    }
  };

  /* Change Password Handler */
  const changePasswordHandler = async (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_password } = passwordData;

    // Client-side password validation
    const validationError = validatePassword(new_password, confirm_password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    
    try {
      const { ok, data } = await changePassword({ 
        current_password, 
        new_password, 
        confirm_password 
      });
      
      if (ok) {
        // Successful password change - reset form and hide interface
        setShowPasswordChange(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
        setError(null);
      } else {
        setError(data?.error || 'Password change failed.');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Profile Settings</h2>

      {/* Error Alert Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* User Information Display Card */}
      <UserInfoCard email={profile.email} />

      {/* Profile Information Form */}
      <ProfileInfoForm
        profileData={profile}
        onChange={(e) => setProfile({ ...profile, [e.target.name]: e.target.value })}
        onSubmit={updateProfileHandler}
        isSaving={isSaving}
      />

      {/* Password Management Section */}
      <h4 className="mt-4">Change Password</h4>
      
      {showPasswordChange ? (
        // Password Change Form - Visible when activated
        <ChangePasswordForm
          passwordData={passwordData}
          onChange={(e) => setPasswordData({ ...passwordData, [e.target.name]: e.target.value })}
          onSubmit={changePasswordHandler}
          isSaving={isSaving}
          onCancel={() => {
            setShowPasswordChange(false);
            setPasswordData({ 
              current_password: '', 
              new_password: '', 
              confirm_password: '' 
            });
          }}
        />
      ) : (
        // Password Change Activation Button
        <button 
          className="btn btn-outline-primary" 
          onClick={() => setShowPasswordChange(true)}
        >
          Change Password
        </button>
      )}
      
    </div>
  );
};

export default ProfilePage;