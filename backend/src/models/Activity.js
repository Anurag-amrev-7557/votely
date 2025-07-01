const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Voted', 'Created', 'Commented', 'Shared', 'Login', 'Profile_Update'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  impact: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  metadata: {
    pollId: String,
    pollTitle: String,
    commentText: String,
    sharePlatform: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
activitySchema.index({ user: 1, timestamp: -1 });
activitySchema.index({ user: 1, type: 1 });
activitySchema.index({ timestamp: -1 });

// Static method to create activity
activitySchema.statics.createActivity = async function(userId, type, description, options = {}) {
  const activity = new this({
    user: userId,
    type,
    description,
    category: options.category || 'General',
    impact: options.impact || 'medium',
    metadata: options.metadata || {}
  });
  
  await activity.save();
  return activity;
};

// Static method to get user activity with pagination
activitySchema.statics.getUserActivity = async function(userId, options = {}) {
  const { page = 1, limit = 10, type, dateRange } = options;
  const skip = (page - 1) * limit;
  
  let query = { user: userId };
  
  // Filter by type if provided
  if (type && type !== 'all') {
    query.type = type;
  }
  
  // Filter by date range if provided
  if (dateRange) {
    const now = new Date();
    let startDate;
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
    }
    
    if (startDate) {
      query.timestamp = { $gte: startDate };
    }
  }
  
  const activities = await this.find(query)
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'name email profilePhoto');
  
  const total = await this.countDocuments(query);
  
  return {
    activities,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 