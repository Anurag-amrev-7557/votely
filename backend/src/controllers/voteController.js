const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const { io } = require('../server');
const Activity = require('../models/Activity');

// Cast a vote
exports.castVote = async (req, res) => {
  try {
    const { pollId, option } = req.body;
    const userId = req.user._id;

    // Check if poll exists and is active
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.status !== 'active') return res.status(400).json({ error: 'Poll is not active' });

    // Check if user already voted
    const existingVote = await Vote.findOne({ poll: pollId, user: userId });
    if (existingVote) return res.status(400).json({ error: 'You have already voted in this poll' });

    // Register vote
    const vote = new Vote({ poll: pollId, user: userId, option });
    await vote.save();

    // Update poll option vote count
    const optionIndex = poll.options.findIndex(opt => opt.text === option);
    if (optionIndex === -1) return res.status(400).json({ error: 'Invalid option' });
    poll.options[optionIndex].votes += 1;
    poll.totalVotes += 1;
    await poll.save();

    // Emit real-time results to poll room
    io.to(`poll_${pollId}`).emit('pollResults', {
      pollId,
      options: poll.options,
      totalVotes: poll.totalVotes,
    });

    // Audit log: record the vote action
    await Activity.create({
      user: userId,
      poll: pollId,
      option,
      action: 'vote_cast',
      timestamp: new Date(),
      meta: {
        // Add more metadata if needed (e.g., IP: req.ip)
      }
    });

    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's vote for a poll
exports.getUserVote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user._id;
    const vote = await Vote.findOne({ poll: pollId, user: userId });
    res.json(vote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 