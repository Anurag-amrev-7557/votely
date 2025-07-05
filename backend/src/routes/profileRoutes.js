const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth/auth');
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

// Enhanced: Input validation and sanitization
const { body, validationResult } = require('express-validator');

// Centralized error handler for validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// All routes require authentication
router.use(protect);

// Enhanced: Get user profile
router.get('/', getProfile);

// Enhanced: Update profile information with validation
router.put(
  '/',
  [
    body('name').optional().isString().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('bio').optional().isString().trim().isLength({ max: 300 }).withMessage('Bio must be at most 300 characters'),
    // Add more validations as needed
  ],
  handleValidationErrors,
  updateProfile
);

// Enhanced: Upload profile photo (file type/size validation can be handled in controller or middleware)
router.post('/photo', upload.single('profilePhoto'), uploadProfilePhoto);

// Enhanced: Delete profile photo
router.delete('/photo', deleteProfilePhoto);

// Enhanced: Update activity stats (could add validation if needed)
router.post('/activity-stats', updateActivityStats);

// Enhanced: Get activity history (optionally support pagination/filtering)
router.get('/activity', getActivityHistory);

// Enhanced: Delete user account (with password confirmation validation)
router.delete(
  '/delete-account',
  [
    body('password').isString().notEmpty().withMessage('Password is required to delete account')
  ],
  handleValidationErrors,
  deleteAccount
);

// Enhanced: Export user data (optionally support format selection)
router.get('/export-data', exportUserData);

// Enhanced: Set user active status (admin only, with validation)
router.post(
  '/set-active-status',
  admin,
  [
    body('userId').isString().notEmpty().withMessage('User ID is required'),
    body('isActive').isBoolean().withMessage('isActive must be a boolean')
  ],
  handleValidationErrors,
  setUserActiveStatus
);

// Enhanced: Favorites routes with validation
router.get('/favorites', getFavorites);
router.post(
  '/favorites/add',
  [
    body('pollId').isString().notEmpty().withMessage('Poll ID is required')
  ],
  handleValidationErrors,
  addFavorite
);
router.post(
  '/favorites/remove',
  [
    body('pollId').isString().notEmpty().withMessage('Poll ID is required')
  ],
  handleValidationErrors,
  removeFavorite
);

// Enhanced: 2FA routes with validation
router.get('/twofactor', getTwoFactorStatus);
router.post(
  '/twofactor',
  [
    body('enabled').isBoolean().withMessage('enabled must be a boolean'),
    body('method').optional().isIn(['app', 'sms', 'email']).withMessage('Invalid 2FA method')
  ],
  handleValidationErrors,
  setTwoFactorStatus
);

// Enhanced: Change password with strong validation
router.post(
  '/change-password',
  [
    body('currentPassword').isString().notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isString()
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('New password must contain an uppercase letter')
      .matches(/[a-z]/).withMessage('New password must contain a lowercase letter')
      .matches(/[0-9]/).withMessage('New password must contain a number')
      .matches(/[^A-Za-z0-9]/).withMessage('New password must contain a special character')
  ],
  handleValidationErrors,
  changePassword
);

module.exports = router;