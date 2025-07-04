const Comment = require('../models/Comment');
const Poll = require('../models/Poll');
const User = require('../models/User');

// In-memory rate limit map: { userId: [timestamps] }
const rateLimitMap = {};
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 comments per minute

function isRateLimited(userId) {
  const now = Date.now();
  if (!rateLimitMap[userId]) rateLimitMap[userId] = [];
  // Remove old timestamps
  rateLimitMap[userId] = rateLimitMap[userId].filter(ts => now - ts < RATE_LIMIT_WINDOW);
  if (rateLimitMap[userId].length >= RATE_LIMIT_MAX) return true;
  rateLimitMap[userId].push(now);
  return false;
}

// Fetch comments for a poll (flat, with 1-level replies)
exports.getComments = async (req, res) => {
  try {
    const { pollId } = req.params;
    const comments = await Comment.find({ poll: pollId, approved: true })
      .populate('user', 'name email')
      .sort({ createdAt: 1 })
      .lean();
    // Group by parent for 1-level nesting
    const topLevel = comments.filter(c => !c.parent);
    const replies = comments.filter(c => c.parent);
    const replyMap = {};
    replies.forEach(r => {
      if (!replyMap[r.parent]) replyMap[r.parent] = [];
      replyMap[r.parent].push(r);
    });
    const result = topLevel.map(c => ({ ...c, replies: replyMap[c._id] || [] }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Post a new comment (optionally anonymous)
exports.postComment = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { content, parent, anonymous } = req.body;
    const userId = req.user ? req.user._id : null;
    if (!content || !pollId) return res.status(400).json({ error: 'Missing content or pollId' });
    if (!userId && !anonymous) return res.status(401).json({ error: 'Login required or set anonymous' });
    if (parent) {
      // Only allow 1-level nesting
      const parentComment = await Comment.findById(parent);
      if (!parentComment || parentComment.parent) {
        return res.status(400).json({ error: 'Invalid parent comment (nesting too deep)' });
      }
    }
    // Rate limit
    const rateKey = userId || req.ip;
    if (isRateLimited(rateKey)) {
      return res.status(429).json({ error: 'Too many comments, please wait' });
    }
    const comment = new Comment({
      poll: pollId,
      user: userId,
      content,
      parent: parent || null,
      approved: true, // auto-approve for now
    });
    await comment.save();
    const populated = await comment.populate('user', 'name email');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
};

// Moderate: approve, flag, delete
exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndUpdate(commentId, { approved: true }, { new: true });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve comment' });
  }
};

exports.flagComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findByIdAndUpdate(commentId, { flagged: true }, { new: true });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to flag comment' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    await Comment.findByIdAndDelete(commentId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}; 