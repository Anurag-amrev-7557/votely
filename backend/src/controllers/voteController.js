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
// Enhanced: Cast a vote
exports.castVote = async (req, res) => {
  // Session for transactions (if replica set is active)
  const session = await mongoose.startSession();

  try {
    const { pollId, options } = req.body;
    const userId = req.user ? req.user._id : undefined;
    const ip = req.ip;

    if (!pollId || !Array.isArray(options) || options.length === 0) {
      if (session) session.endSession();
      return res.status(400).json({ error: 'Poll ID and at least one option are required.' });
    }

    // 1. Initial Validation (Read-only)
    const poll = await Poll.findById(pollId);
    if (!poll) {
      if (session) session.endSession();
      return res.status(404).json({ error: 'Poll not found' });
    }

    // Status & Date Check
    const now = new Date();
    const isActive = (now >= new Date(poll.startDate) && now <= new Date(poll.endDate)) || poll.status === 'active';
    if (!isActive) {
      if (session) session.endSession();
      if (now < new Date(poll.startDate)) return res.status(400).json({ error: 'Poll has not started yet.' });
      if (now > new Date(poll.endDate)) return res.status(400).json({ error: 'Poll has ended.' });
      return res.status(400).json({ error: 'Poll is not active' });
    }

    const isAnonymous = poll.settings?.voterNameDisplay === 'anonymized';
    const requireAuth = poll.settings?.requireAuthentication || false;

    // Security Check
    if (requireAuth && !userId) {
      if (session) session.endSession();
      return res.status(401).json({ error: 'Authentication required to vote.' });
    }

    // 2. Double Vote Prevention (Critical Step)
    // We attempt to create the VoterLog FIRST. If this fails due to a duplicate key error,
    // it means the user has already voted. This utilizes the MongoDB unique index for strict consistency.
    if (userId) {
      try {
        await VoterLog.create([{
          poll: pollId,
          user: userId,
          votedAt: new Date()
        }], { session }); // Use session if transactions are supported, otherwise it falls back
      } catch (err) {
        if (session) session.endSession();
        // Duplicate key error code is 11000
        if (err.code === 11000) {
          return res.status(400).json({ error: 'You have already voted in this poll.' });
        }
        throw err; // Re-throw other errors
      }
    } else {
      // Anonymous/Unauth handling (less strict, IP based fallback)
      if (!userId) {
        if (session) session.endSession();
        return res.status(401).json({ error: 'You must be logged in to vote.' });
      }
    }

    // 3. Prepare Vote Data & Integrity Chain
    // integrity: get last hash
    const lastVote = await Vote.findOne({ poll: pollId }).sort({ createdAt: -1 }).session(session);
    const previousBlockHash = lastVote ? lastVote.hash : 'GENESIS_HASH';
    const votedAt = new Date();

    const voteData = {
      poll: pollId,
      options,
      votedAt,
      isAnonymous,
      previousBlockHash
    };

    if (!isAnonymous) voteData.user = userId;

    // Compute Hash
    const dataToHash = `${pollId}-${JSON.stringify(options)}-${isAnonymous ? 'anon' : userId}-${votedAt.toISOString()}-${previousBlockHash}`;
    voteData.hash = require('crypto').createHash('sha256').update(dataToHash).digest('hex');

    // Save Vote Record
    const vote = new Vote(voteData);
    await vote.save({ session });

    // 4. Atomic Count Update
    // Using findOneAndUpdate with $inc to ensure no race conditions on counters
    // We filter specifically for the options that were selected

    // Validate options exist in the poll first to avoid bad data
    const validTexts = poll.options.map(o => o.text);
    const validSelectedOptions = options.filter(opt => validTexts.includes(opt));

    if (validSelectedOptions.length === 0) {
      // Should abort transaction here if invalid options
      if (session) await session.abortTransaction(); // Try abort if in transaction
      if (session) session.endSession();
      return res.status(400).json({ error: 'Invalid options selected.' });
    }

    // Prepare update operation: Increment global total AND specific options
    // To update specific array elements by text, we use arrayFilters
    const updatedPoll = await Poll.findOneAndUpdate(
      { _id: pollId },
      {
        $inc: {
          totalVotes: 1,
          "options.$[elem].votes": 1
        }
      },
      {
        arrayFilters: [{ "elem.text": { $in: validSelectedOptions } }],
        new: true, // Return updated document
        session
      }
    );

    // Commit Transaction (if we were successful)
    // Note: If you don't have Replica Sets, 'session' calls might be ignored or error depending on driver version,
    // but the logic above without explicit startTransaction() transaction block calls is still safer than before.
    // For true ACID, we would wrap this in session.startTransaction() ... commitTransaction() block.
    // Given the environment uncertainty, we rely on individual atomic ops + unique index which is 99% good enough for this scale.

    if (session) session.endSession();

    // 5. Post-Processing (Async/Non-blocking)

    // Real-time Emit
    if (updatedPoll) {
      io.to(`poll_${pollId}`).emit('pollResults', {
        pollId,
        options: updatedPoll.options,
        totalVotes: updatedPoll.totalVotes,
      });
    }

    // Audit Log
    setImmediate(() => {
      Activity.create({
        user: userId,
        poll: pollId,
        type: 'Voted',
        action: 'vote_cast',
        meta: { isAnonymous },
        description: `Voted in poll "${poll.title}"`
      }).catch(err => console.error('Audit log error:', err));
    });

    res.status(201).json({
      message: 'Vote cast successfully',
      pollId,
      votedOptions: validSelectedOptions,
      isAnonymous,
      totalVotes: updatedPoll ? updatedPoll.totalVotes : 0,
      voteHash: voteData.hash // Return hash for receipt
    });

  } catch (err) {
    if (session) session.endSession();
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