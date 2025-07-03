const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  updateActivityStats,
  getActivityHistory,
  upload,
  deleteAccount,
  exportUserData,
  setUserActiveStatus,
  getFavorites,
  addFavorite,
  removeFavorite,
  getTwoFactorStatus,
  setTwoFactorStatus,
  changePassword
} = require('../controllers/profileController');

// All routes require authentication
router.use(protect);

// Get user profile
router.get('/', getProfile);

// Update profile information
router.put('/', updateProfile);

// Upload profile photo
router.post('/photo', upload.single('profilePhoto'), uploadProfilePhoto);

// Delete profile photo
router.delete('/photo', deleteProfilePhoto);

// Update activity stats
router.post('/activity-stats', updateActivityStats);

// Get activity history
router.get('/activity', getActivityHistory);

// Delete user account
router.delete('/delete-account', deleteAccount);

// Export user data
router.get('/export-data', exportUserData);

// Set user active status (admin only)
router.post('/set-active-status', protect, admin, setUserActiveStatus);

// Favorites routes
router.get('/favorites', getFavorites);
router.post('/favorites/add', addFavorite);
router.post('/favorites/remove', removeFavorite);

// 2FA routes
router.get('/twofactor', getTwoFactorStatus);
router.post('/twofactor', setTwoFactorStatus);

// Change password
router.post('/change-password', changePassword);

module.exports = router; 