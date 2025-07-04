const Activity = require('../models/Activity');
const User = require('../models/User');

/**
 * Enhanced seeder for user activity data.
 * - Accepts options for custom activities, dry run, and verbose logging.
 * - Validates user existence.
 * - Handles errors gracefully.
 * - Returns a summary of seeded activities.
 * @param {String} userId - The user ID to seed activity for.
 * @param {Object} [options] - Optional settings.
 * @param {Array} [options.activities] - Custom activities to seed (default: built-in demo).
 * @param {Boolean} [options.dryRun] - If true, does not write to DB.
 * @param {Boolean} [options.verbose] - If true, logs detailed output.
 * @returns {Promise<{count: number, activities: Array, dryRun: boolean}>}
 */
const seedActivityData = async (userId, options = {}) => {
  const {
    activities: customActivities,
    dryRun = false,
    verbose = false
  } = options;

  // Validate user existence
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(`User with ID ${userId} not found.`);
  }

  // Default demo activities
  const defaultActivities = [
    {
      type: 'Voted',
      description: 'Voted in "Best Startup 2024"',
      category: 'Technology',
      impact: 'high',
      metadata: { pollId: 'poll_123', pollTitle: 'Best Startup 2024' },
      timestamp: new Date('2024-06-01T14:30:00Z')
    },
    {
      type: 'Created',
      description: 'Created poll "Favorite Framework"',
      category: 'Development',
      impact: 'medium',
      metadata: { pollId: 'poll_456', pollTitle: 'Favorite Framework' },
      timestamp: new Date('2024-05-20T09:15:00Z')
    },
    {
      type: 'Voted',
      description: 'Voted in "UI Trends"',
      category: 'Design',
      impact: 'low',
      metadata: { pollId: 'poll_789', pollTitle: 'UI Trends' },
      timestamp: new Date('2024-05-10T16:45:00Z')
    },
    {
      type: 'Commented',
      description: 'Added comment to "Remote Work Policies"',
      category: 'Workplace',
      impact: 'medium',
      metadata: { pollId: 'poll_101', pollTitle: 'Remote Work Policies', commentText: 'Great initiative!' },
      timestamp: new Date('2024-05-08T11:20:00Z')
    },
    {
      type: 'Shared',
      description: 'Shared "Climate Action Survey"',
      category: 'Environment',
      impact: 'high',
      metadata: { pollId: 'poll_202', pollTitle: 'Climate Action Survey', sharePlatform: 'Twitter' },
      timestamp: new Date('2024-05-05T13:10:00Z')
    },
    {
      type: 'Voted',
      description: 'Voted in "Team Building Activities"',
      category: 'Team',
      impact: 'low',
      metadata: { pollId: 'poll_303', pollTitle: 'Team Building Activities' },
      timestamp: new Date('2024-05-01T10:30:00Z')
    }
  ];

  const activities = Array.isArray(customActivities) && customActivities.length > 0
    ? customActivities
    : defaultActivities;

  const seeded = [];
  for (const activityData of activities) {
    if (verbose) {
      console.log(`[seedActivityData] Seeding activity:`, activityData);
    }
    if (!dryRun) {
      const created = await Activity.createActivity(
        userId,
        activityData.type,
        activityData.description,
        {
          category: activityData.category,
          impact: activityData.impact,
          metadata: activityData.metadata,
          timestamp: activityData.timestamp
        }
      );
      seeded.push(created);
    } else {
      seeded.push({ ...activityData, _dryRun: true });
    }
  }

  if (verbose || dryRun) {
    console.log(
      `Activity data ${dryRun ? '(dry run) ' : ''}seeded for user ${userId}: ${seeded.length} activities`
    );
  } else {
    console.log('Activity data seeded successfully');
  }

  return {
    count: seeded.length,
    activities: seeded,
    dryRun
  };
};

module.exports = { seedActivityData };