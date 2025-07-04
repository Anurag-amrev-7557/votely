const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  poll: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poll',
    required: false
  },
  option: {
    type: String,
    required: false
  },
  action: {
    type: String,
    default: 'vote_cast'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  meta: {
    type: Object
  },
  type: {
    type: String,
    enum: ['Voted', 'Created', 'Commented', 'Shared', 'Login', 'Profile_Update', 'Vote_View_Batch'],
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
  }
}, {
  timestamps: true
});

// Enhanced indexes for more efficient and flexible querying
activitySchema.index({ user: 1, timestamp: -1 });
activitySchema.index({ user: 1, type: 1, timestamp: -1 });
activitySchema.index({ timestamp: -1 });
activitySchema.index({ type: 1, timestamp: -1 });
activitySchema.index({ category: 1, timestamp: -1 });
activitySchema.index({ impact: 1, timestamp: -1 });
activitySchema.index({ 'metadata.pollId': 1, timestamp: -1 });

// Enhanced static method to create activity with validation, extensibility, and error handling
activitySchema.statics.createActivity = async function(userId, type, description, options = {}) {
  if (!userId) throw new Error('userId is required');
  if (!type) throw new Error('type is required');
  if (!description) throw new Error('description is required');

  const allowedTypes = ['Voted', 'Created', 'Commented', 'Shared', 'Login', 'Profile_Update', 'Vote_View_Batch'];
  if (!allowedTypes.includes(type)) {
    throw new Error(`Invalid activity type: ${type}`);
  }

  const activityData = {
    user: userId,
    type,
    description,
    category: options.category || 'General',
    impact: options.impact || 'medium',
    metadata: options.metadata || {},
    timestamp: options.timestamp || Date.now(),
  };

  if (options.poll) activityData.poll = options.poll;
  if (options.option) activityData.option = options.option;
  if (options.meta) activityData.meta = options.meta;
  if (options.action) activityData.action = options.action;

  // Allow for additional extensibility
  if (options.extraFields && typeof options.extraFields === 'object') {
    Object.assign(activityData, options.extraFields);
  }

  try {
    const activity = new this(activityData);
    await activity.save();
    return activity;
  } catch (err) {
    // Optionally log error here
    throw new Error('Failed to create activity: ' + err.message);
  }
};

// Enhanced static method to get user activity with advanced filtering, sorting, and error handling
activitySchema.statics.getUserActivity = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 10,
    type,
    dateRange,
    category,
    impact,
    search,
    sortBy = 'timestamp',
    sortOrder = 'desc',
    pollId,
    includeMetadata = false,
    minDate,
    maxDate,
  } = options;

  const skip = (page - 1) * limit;
  let query = { user: userId };

  // Filter by type if provided
  if (type && type !== 'all') {
    if (Array.isArray(type)) {
      query.type = { $in: type };
    } else {
      query.type = type;
    }
  }

  // Filter by category if provided
  if (category && category !== 'all') {
    if (Array.isArray(category)) {
      query.category = { $in: category };
    } else {
      query.category = category;
    }
  }

  // Filter by impact if provided
  if (impact && impact !== 'all') {
    if (Array.isArray(impact)) {
      query.impact = { $in: impact };
    } else {
      query.impact = impact;
    }
  }

  // Filter by pollId if provided
  if (pollId) {
    query['metadata.pollId'] = pollId;
  }

  // Filter by date range if provided
  if (dateRange || minDate || maxDate) {
    const now = new Date();
    let startDate, endDate;
    if (dateRange) {
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
    }
    if (minDate) {
      startDate = new Date(minDate);
    }
    if (maxDate) {
      endDate = new Date(maxDate);
    }
    if (startDate && endDate) {
      query.timestamp = { $gte: startDate, $lte: endDate };
    } else if (startDate) {
      query.timestamp = { $gte: startDate };
    } else if (endDate) {
      query.timestamp = { $lte: endDate };
    }
  }

  // Fuzzy search in description or metadata if search provided
  if (search && typeof search === 'string' && search.trim().length > 0) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [
      { description: regex },
      ...(includeMetadata
        ? [
            { 'metadata.pollTitle': regex },
            { 'metadata.optionText': regex },
            { 'metadata.comment': regex },
          ]
        : []),
    ];
  }

  // Build sort object
  const sortObj = {};
  if (sortBy) {
    sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
  } else {
    sortObj.timestamp = -1;
  }

  try {
    const activitiesQuery = this.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email profilePhoto');

    // Optionally populate poll if requested
    if (includeMetadata) {
      activitiesQuery.populate('metadata.pollId', 'title status endDate');
    }

    const [activities, total] = await Promise.all([
      activitiesQuery.exec(),
      this.countDocuments(query),
    ]);

    return {
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      filters: {
        type,
        category,
        impact,
        dateRange,
        pollId,
        search,
        minDate,
        maxDate,
      },
      sort: {
        sortBy,
        sortOrder,
      },
    };
  } catch (err) {
    throw new Error('Failed to fetch user activity: ' + err.message);
  }
};

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 