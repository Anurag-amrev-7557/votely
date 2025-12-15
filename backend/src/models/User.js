const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { encrypt, decrypt, hash } = require('../utils/cryptoUtils');

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
    trim: true, // Unique index removed (moved to emailHash), Validation handled in controller due to encryption
  },
  emailHash: {
    type: String,
    unique: true, // Uniqueness enforced on the hash
    select: false // Internal use for lookups
  },
  password: {
    type: String,
    required: false, // Changed to false for Magic Link / OAuth support
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false // Don't return password in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'election_committee'],
    default: 'user'
  },
  batch: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
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
  // Favorites: Array of Poll ObjectIds
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    default: []
  }],
  // Two-factor authentication
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  // Google OAuth
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Magic Link Auth
  magicLinkToken: {
    type: String,
    select: false
  },
  magicLinkExpires: {
    type: Date,
    select: false
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
  },
  // Passkey (WebAuthn) Support
  passkeys: [{
    credentialID: String,
    credentialPublicKey: String,
    counter: Number,
    transports: [String],
    backedUp: Boolean,
    deviceType: String
  }],
  currentChallenge: { type: String }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Handle PII Encryption
  if (this.isModified('email')) {
    // 1. Generate deterministic hash for lookups
    this.emailHash = hash(this.email.toLowerCase());
    // 2. Encrypt the actual data
    this.email = encrypt(this.email.toLowerCase());
  }

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
userSchema.pre('save', function (next) {
  this.lastActive = new Date();
  next();
});

// Decrypt PII after retrieving from DB
userSchema.post('init', function (doc) {
  if (doc.email && doc.email.includes(':')) { // Simple check if it might be encrypted
    try {
      doc.email = decrypt(doc.email);
    } catch (e) {
      // Keep as is if decryption fails (legacy data?)
    }
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Method to calculate profile completion
userSchema.methods.getProfileCompletion = function () {
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
userSchema.methods.updateActivityStats = function (type, increment = 1) {
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
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.id = user._id;
  delete user._id;
  delete user.__v;
  return user;
};

// Virtual for checking if user is admin
userSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

// Virtual for checking if user is election committee
userSchema.virtual('isCommittee').get(function () {
  return this.role === 'election_committee' || this.role === 'admin';
});

const User = mongoose.model('User', userSchema);

module.exports = User; 