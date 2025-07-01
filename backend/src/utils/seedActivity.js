const Activity = require('../models/Activity');
const User = require('../models/User');

const seedActivityData = async (userId) => {
  const activities = [
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

  for (const activityData of activities) {
    await Activity.createActivity(
      userId,
      activityData.type,
      activityData.description,
      {
        category: activityData.category,
        impact: activityData.impact,
        metadata: activityData.metadata
      }
    );
  }

  console.log('Activity data seeded successfully');
};

module.exports = { seedActivityData }; 