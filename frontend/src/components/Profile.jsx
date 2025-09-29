import React, { useContext, useState, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { token, userData, updateUserProfile } = useContext(ShopContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    profilePhoto: null,
    bio: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Initialize form with user data
  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        password: '',
        newPassword: '',
        confirmPassword: '',
        profilePhoto: null,
        bio: userData.bio || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live-validate password fields
    if (name === 'newPassword' || name === 'confirmPassword') {
      const newPassword = name === 'newPassword' ? value : formData.newPassword;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      if (newPassword && newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
      } else if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("New passwords don't match");
      } else {
        setPasswordError('');
      }
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, profilePhoto: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Final validation
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setPasswordError('Password must be at least 6 characters');
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setPasswordError("New passwords don't match");
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await updateUserProfile(formData);
      setEditMode(false);
      // clear sensitive fields
      setFormData(prev => ({ ...prev, password: '', newPassword: '', confirmPassword: '' }));
      setPasswordError('');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-fade-in">
          <div className="mb-6">
            <img src={assets.profile_icon} alt="Profile" className="w-28 h-28 mx-auto transform hover:scale-105 transition-transform duration-300" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Please Log In</h2>
          <p className="text-gray-600 mb-6">Sign in to access your personalized profile and settings</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg w-full flex items-center justify-center gap-2"
          >
            <span>🔐</span> Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-gray-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl animate-slide-up">
          {/* Profile Header */}
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-500"></div>
            <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
              <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-xl group">
                {formData.profilePhoto ? (
                  <img
                    src={URL.createObjectURL(formData.profilePhoto)}
                    alt="Profile"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                ) : userData?.profilePhoto ? (
                  <img
                    src={userData.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center">
                    <span className="text-5xl font-bold text-indigo-600">
                      {userData?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                {editMode && (
                  <label className="absolute bottom-2 right-2 bg-indigo-600 p-2 rounded-full shadow-md cursor-pointer hover:bg-indigo-700 transition-all duration-200 group-hover:opacity-100 opacity-0">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <img src={assets.edit_icon} alt="Edit" className="w-5 h-5" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-24 pb-10 px-6 sm:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold text-gray-900">
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-transparent text-center border-b-2 border-indigo-500 focus:outline-none focus:border-indigo-700 max-w-xs mx-auto text-3xl font-bold"
                    placeholder="Your Name"
                  />
                ) : (
                  userData?.name || 'User'
                )}
              </h1>
              <p className="text-indigo-600 mt-2 text-sm font-medium">{userData?.email}</p>
            </div>

            <div className="flex justify-end mb-8">
              {editMode ? (
                <div className="space-x-4">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || Boolean(passwordError)}
                    className={`px-6 py-2 ${isSubmitting || passwordError ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <span>💾</span> Save Changes
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2"
                >
                  <img src={assets.edit_icon} alt="Edit" className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-100 p-3 rounded-lg">
                        {userData?.email || 'Not provided'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 bg-gray-100 p-3 rounded-lg">
                        {userData?.phone || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Address
                </h2>
                {editMode ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                    placeholder="Enter your address"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 bg-gray-100 p-3 rounded-lg">
                    {userData?.address || 'No address provided'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-indigo-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  About Me
                </h2>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="mt-1 text-gray-900 bg-gray-100 p-3 rounded-lg">
                    {userData?.bio || 'No bio yet. Tell us about yourself!'}
                  </p>
                )}
              </div>

              {/* Password Change (only in edit mode) */}
              {editMode && (
                <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-indigo-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-200 rounded-lg p-3 bg-gray-50 text-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 hover:bg-white"
                      />
                        {passwordError && (
                          <p className="text-sm text-red-600 mt-2">{passwordError}</p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;