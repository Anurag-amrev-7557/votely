const User = require('../models/User');
const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Vote = require('../models/Vote');
const Poll = require('../models/Poll');
const sendEmail = require('../utils/sendEmail');

// Enhanced multer configuration for profile photo uploads

// Allowed image mime types and extensions
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml', 'image/heic', 'image/heif'
];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.heic', '.heif'];

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join('uploads', 'profile-photos', req.user.id ? String(req.user.id) : 'unknown');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    // Sanitize original name and ensure extension is valid
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 32);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${baseName}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only allowed image types and extensions
  const ext = path.extname(file.originalname).toLowerCase();
  if (
    ALLOWED_IMAGE_TYPES.includes(file.mimetype) &&
    ALLOWED_EXTENSIONS.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpg, png, gif, webp, bmp, svg, heic) are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per upload
  },
  fileFilter: fileFilter
});

// Helper middleware for single profile photo upload with error handling
exports.uploadProfilePhoto = (req, res, next) => {
  upload.single('profilePhoto')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    } else if (err) {
      // Other errors
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    // File uploaded successfully
    next();
  });
};

// Enhanced Get user profile with computed fields, avatar, and activity summary
exports.getProfile = async (req, res) => {
  try {
    // Populate additional fields if needed (e.g., roles, profile, etc.)
    // Also populate Google auth info if present
    const user = await User.findById(req.user.id)
      .select('-password -__v -resetPasswordToken -resetPasswordExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate profile completion (if method exists on model)
    let profileCompletion = 0;
    if (typeof User.prototype.getProfileCompletion === 'function') {
      // If using instance method, need to hydrate user
      const hydratedUser = await User.hydrate(user);
      profileCompletion = hydratedUser.getProfileCompletion();
    } else if (typeof user.getProfileCompletion === 'function') {
      profileCompletion = user.getProfileCompletion();
    }

    // Compute additional fields
    const enhancedUser = {
      ...user,
      isVerified: !!user.isVerified,
      roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['user'],
      hasGoogleAuth: !!user.googleId,
      displayName: user.name || user.email,
      registeredAt: user.createdAt,
      lastLogin: user.lastLogin || null,
      // Add more computed fields as needed
    };

    // Optionally, include info about OAuth providers
    enhancedUser.providers = [];
    if (user.googleId) enhancedUser.providers.push('google');
    // Add other providers here if needed

    // Optionally, include a gravatar or avatar URL
    if (user.email) {
      const crypto = require('crypto');
      const hash = crypto.createHash('md5').update(user.email.trim().toLowerCase()).digest('hex');
      enhancedUser.avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    }

    // Optionally, include recent activity summary
    let recentActivity = [];
    try {
      recentActivity = await Activity.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('type details createdAt')
        .lean();
    } catch (activityErr) {
      // Ignore activity errors, don't block profile
      recentActivity = [];
    }

    // Optionally, include poll/vote stats
    let pollStats = {};
    try {
      const pollsCreated = await Poll.countDocuments({ creator: req.user.id });
      const votesCast = await Vote.countDocuments({ user: req.user.id });
      pollStats = { pollsCreated, votesCast };
    } catch (statsErr) {
      pollStats = {};
    }

    res.status(200).json({
      success: true,
      user: enhancedUser,
      profileCompletion,
      recentActivity,
      pollStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// Update profile information
exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, socialLinks, preferences } = req.body;
    
    const updateData = {};
    
    // Update basic info
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    
    // Update social links
    if (socialLinks) {
      updateData.socialLinks = {
        twitter: socialLinks.twitter || '',
        linkedin: socialLinks.linkedin || '',
        github: socialLinks.github || '',
        website: socialLinks.website || ''
      };
    }
    
    // Update preferences
    if (preferences) {
      updateData.preferences = {
        theme: preferences.theme || 'system',
        emailNotifications: preferences.emailNotifications !== undefined ? preferences.emailNotifications : true,
        pushNotifications: preferences.pushNotifications !== undefined ? preferences.pushNotifications : false,
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC'
      };
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create activity record
    await Activity.createActivity(
      req.user.id,
      'Profile_Update',
      'Updated profile information',
      { category: 'Profile' }
    );

    const profileCompletion = user.getProfileCompletion();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
      profileCompletion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Upload profile photo
exports.uploadProfilePhoto = async (req, res) => {
  try {
    console.log('Upload profile photo called');
    console.log('Request user:', req.user);
    console.log('Request file:', req.file);
    console.log('Request body:', req.body);
    
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('Found user:', user.name);

    // Delete old profile photo if exists
    if (user.profilePhoto) {
      try {
        await fs.unlink(user.profilePhoto.replace('/uploads', 'uploads'));
        console.log('Deleted old profile photo');
      } catch (error) {
        console.log('Old profile photo not found or already deleted');
      }
    }

    // Update user with new photo URL
    const photoUrl = `/uploads/profile-photos/${req.file.filename}`;
    user.profilePhoto = photoUrl;
    await user.save();
    
    console.log('Updated user profile photo:', photoUrl);

    // Create activity record
    await Activity.createActivity(
      req.user.id,
      'Profile_Update',
      'Updated profile photo',
      { category: 'Profile' }
    );

    const profileCompletion = user.getProfileCompletion();
    console.log('Profile completion:', profileCompletion);

    const response = {
      success: true,
      message: 'Profile photo uploaded successfully',
      profilePhoto: photoUrl,
      profileCompletion
    };
    
    console.log('Sending response:', response);
    res.status(200).json(response);
  } catch (error) {
    console.error('Error in uploadProfilePhoto:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading profile photo',
      error: error.message
    });
  }
};

// Delete profile photo
exports.deleteProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.profilePhoto) {
      try {
        await fs.unlink(user.profilePhoto.replace('/uploads', 'uploads'));
      } catch (error) {
        console.log('Profile photo not found or already deleted');
      }
    }

    user.profilePhoto = null;
    await user.save();

    // Create activity record
    await Activity.createActivity(
      req.user.id,
      'Profile_Update',
      'Removed profile photo',
      { category: 'Profile' }
    );

    const profileCompletion = user.getProfileCompletion();

    res.status(200).json({
      success: true,
      message: 'Profile photo deleted successfully',
      profileCompletion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting profile photo',
      error: error.message
    });
  }
};

// Enhanced: Update activity stats with validation, logging, and activity record
exports.updateActivityStats = async (req, res) => {
  try {
    const { type, increment = 1 } = req.body;

    // Validate input
    if (!type || typeof type !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Activity type is required and must be a string'
      });
    }
    if (typeof increment !== 'number' || !Number.isFinite(increment)) {
      return res.status(400).json({
        success: false,
        message: 'Increment must be a valid number'
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Optionally: Validate allowed activity types
    const allowedTypes = ['pollsCreated', 'votesCast', 'commentsPosted', 'logins', 'profileUpdates'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: `Invalid activity type. Allowed types: ${allowedTypes.join(', ')}`
      });
    }

    // Update activity stats
    await user.updateActivityStats(type, increment);

    // Optionally: Log the update as an activity
    if (typeof Activity !== 'undefined' && Activity.createActivity) {
      await Activity.createActivity(
        req.user.id,
        'Activity_Stats_Update',
        `Updated activity stat: ${type} by ${increment}`,
        { category: 'Activity', type, increment }
      );
    }

    // Optionally: Return updated stats from DB for accuracy
    const updatedUser = await User.findById(req.user.id).select('activityStats').lean();

    res.status(200).json({
      success: true,
      message: 'Activity stats updated successfully',
      activityStats: updatedUser ? updatedUser.activityStats : user.activityStats
    });
  } catch (error) {
    // Optionally: Log error for debugging
    console.error('Error updating activity stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating activity stats',
      error: error.message
    });
  }
};

// Get activity history
exports.getActivityHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, type, dateRange } = req.query;
    
    const result = await Activity.getUserActivity(req.user.id, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
      dateRange
    });

    // Transform activities to match frontend format
    const activities = result.activities.map(activity => ({
      id: activity._id,
      type: activity.type,
      desc: activity.description,
      date: activity.timestamp.toISOString().split('T')[0],
      time: activity.timestamp.toTimeString().split(' ')[0].substring(0, 5),
      category: activity.category,
      impact: activity.impact,
      pollId: activity.metadata.pollId || null
    }));

    res.status(200).json({
      success: true,
      activities,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity history',
      error: error.message
    });
  }
};

// Delete user account and all associated data
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/User');
    const Vote = require('../models/Vote');
    const Activity = require('../models/Activity');
    const Poll = require('../models/Poll');
    const fs = require('fs').promises;
    const sendEmail = require('../utils/sendEmail');

    // Get user before deletion for email
    const user = await User.findById(userId);
    const userEmail = user?.email;
    const userName = user?.name;

    // Delete user's votes
    await Vote.deleteMany({ user: userId });
    // Delete user's activities
    await Activity.deleteMany({ user: userId });
    // Delete user's polls
    await Poll.deleteMany({ createdBy: userId });
    // Delete profile photo from disk if exists
    if (user && user.profilePhoto) {
      try {
        await fs.unlink(user.profilePhoto.replace('/uploads', 'uploads'));
      } catch (err) {
        // File may not exist, ignore
      }
    }
    // Delete user
    await User.findByIdAndDelete(userId);

    // Log deletion in Activity for admin audit
    await Activity.create({
      user: userId,
      type: 'Account_Deleted',
      description: 'User account deleted',
      category: 'Account',
      impact: 'high',
      metadata: { userEmail, userName }
    });

    // Send confirmation email
    if (userEmail) {
      await sendEmail({
        to: userEmail,
        subject: 'Your Votely Account Has Been Deleted',
        text: `Hello${userName ? ' ' + userName : ''},\n\nYour Votely account has been permanently deleted. If this was not you, please contact support immediately.`,
        html: `<p>Hello${userName ? ' ' + userName : ''},</p><p>Your Votely account has been <b>permanently deleted</b>. If this was not you, please contact support immediately.</p>`
      });
    }

    res.status(200).json({ success: true, message: 'Account and all associated data deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting account', error: error.message });
  }
};

// Export all user data (profile, votes, activities, polls)
exports.exportUserData = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = require('../models/User');
    const Vote = require('../models/Vote');
    const Activity = require('../models/Activity');
    const Poll = require('../models/Poll');

    const user = await User.findById(userId).lean();
    const votes = await Vote.find({ user: userId }).lean();
    const activities = await Activity.find({ user: userId }).lean();
    const polls = await Poll.find({ createdBy: userId }).lean();

    res.status(200).json({
      success: true,
      data: {
        user,
        votes,
        activities,
        polls
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error exporting user data', error: error.message });
  }
};

// Export multer upload for use in routes
exports.upload = upload;

// Set user active status (admin only)
exports.setUserActiveStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    const { userId, isActive } = req.body;
    if (!userId || typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'userId and isActive (boolean) required' });
    }
    const user = await require('../models/User').findByIdAndUpdate(userId, { isActive }, { new: true });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating user status', error: error.message });
  }
};

// Get user's favorite polls
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching favorites', error: error.message });
  }
};

// Add a poll to user's favorites
exports.addFavorite = async (req, res) => {
  try {
    const { pollId } = req.body;
    if (!pollId) {
      return res.status(400).json({ success: false, message: 'pollId is required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (!user.favorites.includes(pollId)) {
      user.favorites.push(pollId);
      await user.save();
    }
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error adding favorite', error: error.message });
  }
};

// Remove a poll from user's favorites
exports.removeFavorite = async (req, res) => {
  try {
    const { pollId } = req.body;
    if (!pollId) {
      return res.status(400).json({ success: false, message: 'pollId is required' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.favorites = user.favorites.filter(fav => fav.toString() !== pollId);
    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing favorite', error: error.message });
  }
};

// Get 2FA status
exports.getTwoFactorStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching 2FA status', error: error.message });
  }
};

// Update 2FA status
exports.setTwoFactorStatus = async (req, res) => {
  try {
    const { enabled } = req.body;
    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ success: false, message: 'enabled (boolean) is required' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { twoFactorEnabled: enabled },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, twoFactorEnabled: user.twoFactorEnabled });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating 2FA status', error: error.message });
  }
};

// Change password for authenticated user
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required.' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }
    // Optionally: Enforce strong password
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!strongPassword.test(newPassword)) {
      return res.status(400).json({ message: 'Password must contain uppercase, lowercase, number, and special character.' });
    }
    const User = require('../models/User');
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }
    user.password = newPassword;
    await user.save();
    return res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Failed to change password.' });
  }
}; 