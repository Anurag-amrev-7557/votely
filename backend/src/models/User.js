const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Profile fields
  profilePhoto: {
    type: String, // URL to stored image
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  socialLinks: {
    twitter: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    }
  },
  // Account status and preferences
  isPremium: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    pushNotifications: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'en'
    },
    timezone: {
      type: String,
      default: 'UTC'
    }
  },
  // Activity tracking
  activityStats: {
    totalVotes: {
      type: Number,
      default: 0
    },
    pollsCreated: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    participationRate: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update lastActive before saving
userSchema.pre('save', function(next) {
  this.lastActive = new Date();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to calculate profile completion
userSchema.methods.getProfileCompletion = function() {
  let completion = 0;
  if (this.name) completion += 20;
  if (this.email) completion += 15;
  if (this.profilePhoto) completion += 20;
  if (this.bio && this.bio.length > 10) completion += 15;
  if (this.socialLinks.twitter || this.socialLinks.linkedin || this.socialLinks.github || this.socialLinks.website) completion += 10;
  if (this.isVerified) completion += 10;
  if (this.createdAt) completion += 10;
  return Math.min(completion, 100);
};

// Method to update activity stats
userSchema.methods.updateActivityStats = function(type, increment = 1) {
  switch (type) {
    case 'vote':
      this.activityStats.totalVotes += increment;
      break;
    case 'create':
      this.activityStats.pollsCreated += increment;
      break;
    case 'comment':
      this.activityStats.comments += increment;
      break;
    case 'share':
      this.activityStats.shares += increment;
      break;
  }
  return this.save();
};

// Transform document to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 