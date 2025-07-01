const User = require('../models/User');
const Activity = require('../models/Activity');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = 'uploads/profile-photos';
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `profile-${req.user.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate profile completion
    const profileCompletion = user.getProfileCompletion();

    res.status(200).json({
      success: true,
      user,
      profileCompletion
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

// Update activity stats
exports.updateActivityStats = async (req, res) => {
  try {
    const { type, increment = 1 } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.updateActivityStats(type, increment);

    res.status(200).json({
      success: true,
      message: 'Activity stats updated successfully',
      activityStats: user.activityStats
    });
  } catch (error) {
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

// Export multer upload for use in routes
exports.upload = upload; 