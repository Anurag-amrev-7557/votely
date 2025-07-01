const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  updateActivityStats,
  getActivityHistory,
  upload
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

module.exports = router; 