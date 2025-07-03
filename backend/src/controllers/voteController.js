const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const { io } = require('../server');
const Activity = require('../models/Activity');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

// Rate limiter: max 5 votes per 10 minutes per IP
const voteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: { error: 'Too many votes from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Advanced bot detection middleware for voting endpoint.
 * - Checks for common bot user-agents (case-insensitive).
 * - Detects headless browsers (e.g., Puppeteer, Playwright, Selenium).
 * - Blocks requests with missing or suspicious headers.
 * - Optionally checks for rapid-fire requests from same IP (basic behavioral check).
 * - Logs suspicious attempts for audit.
 */
const suspiciousUserAgents = [
  /bot/i, /crawl/i, /spider/i, /curl/i, /wget/i, /python/i, /scrapy/i, /httpclient/i, /libwww/i,
  /phantomjs/i, /headless/i, /selenium/i, /puppeteer/i, /playwright/i, /slimerjs/i, /node\.js/i
];

const suspiciousHeaderPatterns = [
  // Missing Accept-Language or Accept headers is suspicious
  (headers) => !headers['accept-language'] || !headers['accept'],
  // Suspicious referer (empty or localhost for production)
  (headers, req) => {
    const referer = headers['referer'] || '';
    if (process.env.NODE_ENV === 'production') {
      return referer === '' || referer.startsWith('http://localhost');
    }
    return false;
  },
  // Unusual content-type for POST (should be JSON or form)
  (headers, req) => {
    if (req.method === 'POST') {
      const ct = headers['content-type'] || '';
      return !ct.includes('application/json') && !ct.includes('application/x-www-form-urlencoded');
    }
    return false;
  }
];

// In-memory rapid-fire IP tracker (for basic behavioral detection)
const rapidFireMap = new Map();
const RAPID_FIRE_WINDOW_MS = 3000; // 3 seconds
const RAPID_FIRE_MAX = 3;

function botDetection(req, res, next) {
  const ua = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';

  // 1. User-Agent checks
  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(ua)) {
      logSuspiciousAttempt(req, 'user-agent', ua);
      return res.status(400).json({ error: 'Automated voting is not allowed.' });
    }
  }

  // 2. Header pattern checks
  for (const check of suspiciousHeaderPatterns) {
    if (check(req.headers, req)) {
      logSuspiciousAttempt(req, 'headers', req.headers);
      return res.status(400).json({ error: 'Suspicious request headers detected.' });
    }
  }

  // 3. Rapid-fire behavioral check (per IP)
  const now = Date.now();
  let record = rapidFireMap.get(ip) || [];
  // Remove old timestamps
  record = record.filter(ts => now - ts < RAPID_FIRE_WINDOW_MS);
  record.push(now);
  rapidFireMap.set(ip, record);
  if (record.length > RAPID_FIRE_MAX) {
    logSuspiciousAttempt(req, 'rapid-fire', { ip, count: record.length });
    return res.status(429).json({ error: 'Too many rapid requests. Please slow down.' });
  }

  // 4. Optionally: Check for missing cookies (bots often don't send cookies)
  // (Uncomment if you want to enforce this)
  // if (!req.headers['cookie']) {
  //   logSuspiciousAttempt(req, 'missing-cookie', null);
  //   return res.status(400).json({ error: 'Cookies required for voting.' });
  // }

  next();
}

// Advanced logging for suspicious attempts (could be extended to use Winston, Sentry, etc.)
function logSuspiciousAttempt(req, reason, details) {
  // You can replace this with a more robust logger or external service
  console.warn(`[BOT DETECTION] Blocked request from IP ${req.ip || 'unknown'}: ${reason}`, details);
}

module.exports.botDetection = botDetection;

// Cast a vote
exports.castVote = async (req, res) => {
  try {
    const { pollId, options } = req.body; // options: array of option texts/ids
    let userId = req.user ? req.user._id : undefined;

    // Check if poll exists and is active
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.status !== 'active') return res.status(400).json({ error: 'Poll is not active' });

    // Settings
    const allowMultiple = poll.settings?.allowMultipleVotes;
    const maxVotes = poll.settings?.maxVotesPerVoter || 1;
    const isAnonymous = poll.settings?.voterNameDisplay === 'anonymized';

    // Validate options
    if (!Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'You must select at least one option.' });
    }
    if (options.length > maxVotes) {
      return res.status(400).json({ error: `You can select up to ${maxVotes} option(s).` });
    }
    // Ensure all options are valid
    const validOptions = poll.options.map(opt => opt.text);
    for (const opt of options) {
      if (!validOptions.includes(opt)) {
        return res.status(400).json({ error: `Invalid option: ${opt}` });
      }
    }

    // Check if user already voted (by user or by session/IP for anonymous)
    let existingVote;
    if (isAnonymous) {
      // For demo: use IP as identifier for anonymous (in production, use better anon ID)
      const anonId = req.ip;
      existingVote = await Vote.findOne({ poll: pollId, isAnonymous: true, 'meta.anonId': anonId });
      if (existingVote) return res.status(400).json({ error: 'You have already voted in this poll' });
    } else {
      existingVote = await Vote.findOne({ poll: pollId, user: userId });
      if (existingVote) return res.status(400).json({ error: 'You have already voted in this poll' });
    }

    // Register vote
    const voteData = {
      poll: pollId,
      options,
      votedAt: new Date(),
      isAnonymous,
    };
    if (!isAnonymous) voteData.user = userId;
    else voteData.meta = { anonId: req.ip };
    const vote = new Vote(voteData);
    await vote.save();

    // Update poll option vote counts
    for (const opt of options) {
      const optionIndex = poll.options.findIndex(o => o.text === opt);
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes += 1;
      }
    }
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
      user: isAnonymous ? undefined : userId,
      poll: pollId,
      option: options.join(','),
      action: 'vote_cast',
      timestamp: new Date(),
      meta: {
        isAnonymous,
        options,
        anonId: isAnonymous ? req.ip : undefined,
      },
      type: 'Voted',
      description: `Voted for option(s): ${options.join(', ')}`,
      category: 'Voting',
      impact: 'medium',
      metadata: { pollId: String(pollId) }
    });

    // Send email notification to admin (placeholder)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: `New Vote Cast in Poll: ${poll.title}`,
        text: `A new vote was cast in the poll "${poll.title}".`,
        html: `<p>A new vote was cast in the poll <strong>${poll.title}</strong>.</p>`
      });
    } catch (e) {
      console.error('Failed to send vote notification email:', e);
    }

    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's vote for a poll with advanced security and privacy

exports.getUserVote = async (req, res) => {
  try {
    // Input validation
    const { pollId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ error: 'Invalid poll ID format.' });
    }

    // Ensure user is authenticated and authorized
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const userId = req.user._id;

    // Check poll existence and access
    const poll = await Poll.findById(pollId).select('settings status');
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    // Optionally, check if poll is accessible to this user (e.g., private polls)
    // if (poll.settings.requireAuthentication && !req.user) { ... }

    // Find the user's vote, but never leak votes of others
    const vote = await Vote.findOne({ poll: pollId, user: userId }).select('-__v -isAnonymous');

    // Advanced privacy: If poll is anonymized, do not return user info
    if (vote && poll.settings && poll.settings.voterNameDisplay === 'anonymized') {
      // Remove user field from response
      const voteObj = vote.toObject();
      delete voteObj.user;
      return res.json(voteObj);
    }

    // Only return the user's own vote, never more
    res.json(vote);

  } catch (err) {
    // Log error securely (never leak sensitive info)
    console.error('Error in getUserVote:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Batch get user's vote status for multiple polls
exports.getUserVotesBatch = async (req, res) => {
  try {
    const { pollIds } = req.body;
    if (!Array.isArray(pollIds) || pollIds.length === 0) {
      return res.status(400).json({ error: 'pollIds must be a non-empty array' });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    // DEBUG LOGGING
    console.log('getUserVotesBatch:', { pollIds, userId: req.user._id });
    // Find all votes by this user for the given pollIds
    const votes = await Vote.find({
      user: req.user._id,
      poll: { $in: pollIds }
    });
    console.log('Votes found:', votes);
    // Build result: { pollId: true/false }
    const result = {};
    pollIds.forEach(id => {
      result[id] = votes.some(v => String(v.poll) === String(id));
    });
    console.log('Batch result:', result);
    res.json(result);
  } catch (err) {
    console.error('Batch vote status error:', err);
    res.status(500).json({ error: 'Failed to fetch vote status' });
  }
};

// Export with rate limiter and bot detection
exports.voteLimiter = voteLimiter;
exports.botDetection = botDetection;