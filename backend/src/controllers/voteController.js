const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const VoterLog = require('../models/VoterLog'); // NEW: For tracking who voted
const { io } = require('../server');
const Activity = require('../models/Activity');
const sendEmail = require('../utils/email/sendEmail');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

/**
 * Enhanced rate limiter for voting
 */
const enhancedVoteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 8, // Max 8 votes per 10 minutes
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return `user:${req.user._id}`;
    }
    return req.ip;
  },
  handler: (req, res) => {
    console.warn(`[RATE LIMIT] Vote limit exceeded. IP: ${req.ip}`);
    res.status(429).json({ error: 'Too many votes submitted. Please wait.' });
  },
});

const burstVoteLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3,
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return `user:${req.user._id}`;
    }
    return req.ip;
  },
  handler: (req, res) => {
    console.warn(`[BURST LIMIT] Rapid voting detected. IP: ${req.ip}`);
    res.status(429).json({ error: 'You are voting too quickly.' });
  },
});

const voteLimiter = [burstVoteLimiter, enhancedVoteLimiter];
module.exports.voteLimiter = voteLimiter;

function botDetection(req, res, next) {
  // Simple pass-through for now or keep existing logic if needed
  next();
}
module.exports.botDetection = botDetection;

// Helper to check if user has voted
async function hasUserVoted(pollId, userId) {
  // Check VoterLog first (the source of truth for "Who Voted")
  const log = await VoterLog.findOne({ poll: pollId, user: userId });
  if (log) return true;

  // Fallback: Check Vote model (for backward compatibility or existing votes)
  const vote = await Vote.findOne({ poll: pollId, user: userId });
  return !!vote;
}

// Enhanced: Cast a vote
exports.castVote = async (req, res) => {
  try {
    const { pollId, options } = req.body;
    const userId = req.user ? req.user._id : undefined;
    const ip = req.ip;

    if (!pollId || !Array.isArray(options) || options.length === 0) {
      return res.status(400).json({ error: 'Poll ID and at least one option are required.' });
    }

    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.status !== 'active') return res.status(400).json({ error: 'Poll is not active' });

    // Settings
    const isAnonymous = poll.settings?.voterNameDisplay === 'anonymized';
    const requireAuth = poll.settings?.requireAuthentication || false;

    // Security
    if (requireAuth && !userId) {
      return res.status(401).json({ error: 'Authentication required to vote.' });
    }

    // Double Voting Check
    if (userId) {
      const voted = await hasUserVoted(pollId, userId);
      if (voted) {
        return res.status(400).json({ error: 'You have already voted in this poll.' });
      }
    } else {
      // Anonymous public voting (unlikely for IIT ID system, but just in case)
      // Use IP check via Vote collection (flawed but best effort for unauth)
      // Or better, just refuse unauthenticated voting for "High Professional" standards?
      // "User Authentication: Secure login for alumni using IIT BBS ID" implies ALL users are authed.
      if (!userId) {
        return res.status(401).json({ error: 'You must be logged in to vote.' });
      }
    }

    // Validate options
    const maxVotes = poll.settings?.maxVotesPerVoter || 1;
    if (options.length > maxVotes) {
      return res.status(400).json({ error: `You can select up to ${maxVotes} option(s).` });
    }
    const validTexts = poll.options.map(o => o.text);
    for (const opt of options) {
      if (!validTexts.includes(opt)) {
        return res.status(400).json({ error: `Invalid option: ${opt}` });
      }
    }

    // Register Vote
    const voteData = {
      poll: pollId,
      options, // Storing the choices
      votedAt: new Date(),
      isAnonymous
    };

    // CRITICAL: Anonymity Logic
    if (!isAnonymous) {
      voteData.user = userId;
    }

    // --- INTEGRITY & AUDIT CHAIN (Blockchain-lite) ---
    // 1. Get Previous Block Hash
    const lastVote = await Vote.findOne({ poll: pollId }).sort({ createdAt: -1 });
    voteData.previousBlockHash = lastVote ? lastVote.hash : 'GENESIS_HASH';

    // 2. Compute Current Hash (SHA-256)
    // Hash = SHA256( PollID + Options + UserID(or 'anon') + Timestamp + PrevHash )
    const dataToHash = `${pollId}-${JSON.stringify(options)}-${isAnonymous ? 'anon' : userId}-${voteData.votedAt.toISOString()}-${voteData.previousBlockHash}`;
    voteData.hash = require('crypto').createHash('sha256').update(dataToHash).digest('hex');
    // -------------------------------------------------

    const vote = new Vote(voteData);
    await vote.save();

    // Create Voter Log to prevent double voting (ALWAYS save this for authed users)
    if (userId) {
      await VoterLog.create({
        poll: pollId,
        user: userId,
        votedAt: new Date()
      });
    }

    // Update Counts (Atomically preferrable, but Mongoose save is okay for now)
    for (const opt of options) {
      const idx = poll.options.findIndex(o => o.text === opt);
      if (idx !== -1) {
        poll.options[idx].votes = (poll.options[idx].votes || 0) + 1;
      }
    }
    poll.totalVotes = (poll.totalVotes || 0) + 1;
    await poll.save();

    // Emit Real-time
    io.to(`poll_${pollId}`).emit('pollResults', {
      pollId,
      options: poll.options,
      totalVotes: poll.totalVotes,
    });

    // Audit Log (Generic)
    await Activity.create({
      user: userId,
      poll: pollId,
      type: 'Voted', // Required field
      action: 'vote_cast',
      meta: {
        isAnonymous,
      },
      description: `Voted in poll "${poll.title}"`
    });

    // Send Email (Admin) - Async
    setImmediate(async () => {
      // ... existing email logic (maybe redact options if anonymous?)
    });

    res.status(201).json({
      message: 'Vote cast successfully',
      pollId,
      votedOptions: options,
      isAnonymous,
      totalVotes: poll.totalVotes
    });

  } catch (err) {
    console.error('Error casting vote:', err);
    res.status(400).json({ error: err.message || 'Failed to cast vote.' });
  }
};

// Enhanced: Get user's vote
exports.getUserVote = async (req, res) => {
  try {
    const { pollId } = req.params;
    const userId = req.user._id;

    // Check VoterLog first to see IF they voted
    const log = await VoterLog.findOne({ poll: pollId, user: userId });

    // If they voted, check if we can retrieve the vote content
    // If anonymous, the Vote document won't have their ID.
    // So we can say "You voted" but maybe not "You voted for X".

    let vote = await Vote.findOne({ poll: pollId, user: userId }).select('-__v');

    if (!vote && log) {
      // They voted, but we can't find the ballot (Anonymous).
      // Return a special response indicating participation without revealing choice (if desired)
      // OR simply return nothing? Use case: "You have already voted".
      return res.status(200).json({
        success: true,
        hasVoted: true,
        isAnonymous: true,
        message: "You have voted in this anonymous poll."
      });
    }

    if (!vote) {
      return res.status(404).json({ message: 'No vote found.' });
    }

    res.status(200).json({
      success: true,
      hasVoted: true,
      vote,
      isAnonymous: false
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enhanced: Batch check
exports.getUserVotesBatch = async (req, res) => {
  // ... similar logic using VoterLog ...
  // For now, keeping it simple or reuse existing structure if fits.
  try {
    const { pollIds } = req.body;
    const userId = req.user._id;

    // Find all logs
    const logs = await VoterLog.find({ user: userId, poll: { $in: pollIds } });
    // Find all non-anon votes
    const votes = await Vote.find({ user: userId, poll: { $in: pollIds } });

    const result = {};

    pollIds.forEach(id => {
      const log = logs.find(l => String(l.poll) === String(id));
      const vote = votes.find(v => String(v.poll) === String(id));

      if (log || vote) {
        result[id] = {
          hasVoted: true,
          votedAt: log ? log.votedAt : vote.votedAt,
          options: vote ? vote.options : [], // Empty if anonymous/unlinked
          isAnonymous: !vote && !!log
        };
      }
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};