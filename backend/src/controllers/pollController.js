const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

// Create a new poll
exports.createPoll = async (req, res) => {
  try {
    // --- Robust Validation ---
    const { title, description, startDate, endDate, options, resultDate, settings } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.length > 100) {
      return res.status(400).json({ error: 'Title is required (min 3, max 100 chars)' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be at most 500 characters' });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end date are required' });
    }
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    if (start < now) {
      return res.status(400).json({ error: 'Start date/time cannot be in the past' });
    }
    if (end <= start) {
      return res.status(400).json({ error: 'End date/time must be after start date/time' });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }
    const texts = options.map(o => (o.text || '').trim());
    if (texts.some(t => !t)) {
      return res.status(400).json({ error: 'Option text cannot be empty' });
    }
    if (texts.some(t => t.length > 100)) {
      return res.status(400).json({ error: 'Option text must be at most 100 characters' });
    }
    const textSet = new Set(texts.map(t => t.toLowerCase()));
    if (textSet.size !== texts.length) {
      return res.status(400).json({ error: 'Option text must be unique' });
    }
    if (resultDate) {
      const resultDt = new Date(resultDate);
      if (isNaN(resultDt)) {
        return res.status(400).json({ error: 'Invalid result date format' });
      }
      if (resultDt < new Date(endDate)) {
        return res.status(400).json({ error: 'Result date must be after end date' });
      }
    }
    // --- End Validation ---
    const poll = new Poll({ ...req.body, createdBy: req.user._id });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// List all polls with advanced filtering, search, and pagination
exports.getPolls = async (req, res) => {
  try {
    // Query params: search, category, status, dateRange, sort, page, limit
    const {
      search = '',
      category,
      status,
      startDate,
      endDate,
      sort = '-createdAt',
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Advanced search (title, description, options.text, category)
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { category: regex },
        { 'options.text': regex },
      ];
    }

    // Category filter (single or array)
    if (category) {
      if (Array.isArray(category)) {
        query.category = { $in: category };
      } else {
        query.category = category;
      }
    }

    // Status filter (single or array)
    if (status) {
      if (Array.isArray(status)) {
        query.status = { $in: status };
      } else {
        query.status = status;
      }
    }

    // Date range filter (overlap logic)
    if (startDate || endDate) {
      query.$and = query.$and || [];
      if (startDate) {
        query.$and.push({ endDate: { $gte: new Date(startDate) } });
      }
      if (endDate) {
        query.$and.push({ startDate: { $lte: new Date(endDate) } });
      }
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * pageSize;

    // Sorting
    let sortObj = {};
    if (typeof sort === 'string') {
      // e.g. '-createdAt' or 'title'
      if (sort.startsWith('-')) {
        sortObj[sort.slice(1)] = -1;
      } else {
        sortObj[sort] = 1;
      }
    }

    // Count total for pagination
    const total = await Poll.countDocuments(query);

    // Fetch polls
    const polls = await Poll.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Optionally, add totalVotes and participant count for each poll (aggregation)
    // (Assumes Poll has a votes array or similar)
    // If you want to include stats, uncomment below and adjust as needed:
    /*
    for (const poll of polls) {
      poll.totalVotes = poll.votes ? poll.votes.length : 0;
      poll.participantCount = poll.votes
        ? new Set(poll.votes.map(v => String(v.user))).size
        : 0;
    }
    */

    res.json({
      polls,
      page: pageNum,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enhanced: Get a poll by ID with stats, options, and optional population
exports.getPollById = async (req, res) => {
  try {
    const pollId = req.params.id;
    if (!pollId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid poll ID format' });
    }

    // Populate options and optionally votes (if needed)
    // .lean() for performance, but we can add computed fields after
    let poll = await Poll.findById(pollId)
      .populate('createdBy', 'username email') // Example: populate creator info
      .lean();

    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // Add stats: totalVotes, participantCount, status, etc.
    // (Assumes poll.votes is an array of { user, ... })
    poll.totalVotes = Array.isArray(poll.votes) ? poll.votes.length : 0;
    poll.participantCount = Array.isArray(poll.votes)
      ? new Set(poll.votes.map(v => String(v.user))).size
      : 0;

    // Compute status (Active, Upcoming, Past)
    const now = new Date();
    const start = new Date(poll.startDate);
    const end = new Date(poll.endDate);
    if (now < start) {
      poll.status = 'Upcoming';
    } else if (now >= start && now <= end) {
      poll.status = 'Active';
    } else {
      poll.status = 'Past';
    }

    // Optionally, include option vote counts
    if (Array.isArray(poll.options) && Array.isArray(poll.votes)) {
      const optionCounts = {};
      poll.options.forEach(opt => {
        optionCounts[String(opt._id)] = 0;
      });
      poll.votes.forEach(vote => {
        if (vote.option && optionCounts.hasOwnProperty(String(vote.option))) {
          optionCounts[String(vote.option)] += 1;
        }
      });
      poll.options = poll.options.map(opt => ({
        ...opt,
        voteCount: optionCounts[String(opt._id)] || 0,
      }));
    }

    // Remove sensitive fields if any (e.g., poll.votes, internal fields)
    if (poll.votes) delete poll.votes;
    if (poll.__v !== undefined) delete poll.__v;

    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enhanced: Update a poll with robust validation, permission check, audit logging, and option management
exports.updatePoll = async (req, res) => {
  try {
    // --- Permission check: Only creator or admin can update ---
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    if (!req.user || (String(poll.createdBy) !== String(req.user._id) && !req.user.isAdmin)) {
      return res.status(403).json({ error: 'Not authorized to update this poll' });
    }

    // --- Robust Validation (same as create) ---
    const { title, description, startDate, endDate, options, resultDate, settings, category } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3 || title.length > 100) {
      return res.status(400).json({ error: 'Title is required (min 3, max 100 chars)' });
    }
    if (description && description.length > 500) {
      return res.status(400).json({ error: 'Description must be at most 500 characters' });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end date are required' });
    }
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    // Only allow moving start date to the future if poll hasn't started yet
    if (start < now && now < new Date(poll.startDate)) {
      return res.status(400).json({ error: 'Start date/time cannot be in the past' });
    }
    if (end <= start) {
      return res.status(400).json({ error: 'End date/time must be after start date/time' });
    }
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'At least 2 options are required' });
    }
    const texts = options.map(o => (o.text || '').trim());
    if (texts.some(t => !t)) {
      return res.status(400).json({ error: 'Option text cannot be empty' });
    }
    if (texts.some(t => t.length > 100)) {
      return res.status(400).json({ error: 'Option text must be at most 100 characters' });
    }
    const textSet = new Set(texts.map(t => t.toLowerCase()));
    if (textSet.size !== texts.length) {
      return res.status(400).json({ error: 'Option text must be unique' });
    }
    if (resultDate) {
      const resultDt = new Date(resultDate);
      if (isNaN(resultDt)) {
        return res.status(400).json({ error: 'Invalid result date format' });
      }
      if (resultDt < new Date(endDate)) {
        return res.status(400).json({ error: 'Result date must be after end date' });
      }
    }

    // --- Option management: Prevent removing options that already have votes ---
    // (Assumes poll.options and poll.votes exist)
    if (Array.isArray(poll.options) && Array.isArray(poll.votes)) {
      const oldOptionIds = poll.options.map(opt => String(opt._id));
      const newOptionIds = options.map(opt => opt._id ? String(opt._id) : null).filter(Boolean);
      const removedOptionIds = oldOptionIds.filter(id => !newOptionIds.includes(id));
      if (removedOptionIds.length > 0) {
        // Check if any removed option has votes
        const Vote = require('../models/Vote');
        const votesForRemoved = await Vote.find({ poll: poll._id, option: { $in: removedOptionIds } }).limit(1);
        if (votesForRemoved.length > 0) {
          return res.status(400).json({ error: 'Cannot remove options that already have votes.' });
        }
      }
    }

    // --- Update poll fields ---
    poll.title = title;
    poll.description = description;
    poll.startDate = startDate;
    poll.endDate = endDate;
    poll.options = options;
    poll.resultDate = resultDate;
    poll.settings = settings;
    if (category !== undefined) poll.category = category;

    await poll.save();

    // --- Audit log (optional) ---
    console.log(`[AUDIT] Poll updated: ${poll._id} by user ${req.user ? req.user._id : 'unknown'}`);

    // --- Return updated poll (lean, with stats) ---
    const updatedPoll = await Poll.findById(poll._id)
      .populate('createdBy', 'username email')
      .lean();

    // Add stats: totalVotes, participantCount, status, etc.
    const Vote = require('../models/Vote');
    const votes = await Vote.find({ poll: poll._id }).lean();
    updatedPoll.totalVotes = votes.length;
    updatedPoll.participantCount = new Set(votes.map(v => String(v.user))).size;

    // Compute status (Active, Upcoming, Past)
    const now2 = new Date();
    const start2 = new Date(updatedPoll.startDate);
    const end2 = new Date(updatedPoll.endDate);
    if (now2 < start2) {
      updatedPoll.status = 'Upcoming';
    } else if (now2 >= start2 && now2 <= end2) {
      updatedPoll.status = 'Active';
    } else {
      updatedPoll.status = 'Past';
    }

    // Optionally, include option vote counts
    if (Array.isArray(updatedPoll.options)) {
      const optionCounts = {};
      updatedPoll.options.forEach(opt => {
        optionCounts[String(opt._id)] = 0;
      });
      votes.forEach(vote => {
        if (vote.option && optionCounts.hasOwnProperty(String(vote.option))) {
          optionCounts[String(vote.option)] += 1;
        }
      });
      updatedPoll.options = updatedPoll.options.map(opt => ({
        ...opt,
        voteCount: optionCounts[String(opt._id)] || 0,
      }));
    }

    // Remove sensitive fields if any
    if (updatedPoll.votes) delete updatedPoll.votes;
    if (updatedPoll.__v !== undefined) delete updatedPoll.__v;

    res.json(updatedPoll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Enhanced: Delete a poll and all associated votes, with audit logging and permission check
exports.deletePoll = async (req, res) => {
  try {
    // --- Permission check: Only creator or admin can delete ---
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // If using authentication middleware, req.user should be set
    if (!req.user || (String(poll.createdBy) !== String(req.user._id) && !req.user.isAdmin)) {
      return res.status(403).json({ error: 'Not authorized to delete this poll' });
    }

    // --- Delete all associated votes ---
    const votesDeleted = await Vote.deleteMany({ poll: poll._id });

    // --- Delete the poll itself ---
    await poll.deleteOne();

    // --- Audit log (optional, for demonstration) ---
    // You could use a real logger or DB collection for audit logs
    console.log(`[AUDIT] Poll deleted: ${poll._id} by user ${req.user ? req.user._id : 'unknown'}. Votes deleted: ${votesDeleted.deletedCount}`);

    res.json({ 
      message: 'Poll and associated votes deleted', 
      pollId: poll._id, 
      votesDeleted: votesDeleted.deletedCount 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Enhanced: Get poll results with detailed stats, percentages, and user vote (if authenticated)
exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).lean();
    if (!poll) return res.status(404).json({ error: 'Poll not found' });

    // Aggregate votes for this poll
    const votes = await Vote.find({ poll: poll._id }).lean();

    // Count votes per option
    const optionVoteCounts = {};
    poll.options.forEach(opt => {
      optionVoteCounts[String(opt._id)] = 0;
    });
    votes.forEach(vote => {
      if (vote.option && optionVoteCounts.hasOwnProperty(String(vote.option))) {
        optionVoteCounts[String(vote.option)] += 1;
      }
    });

    // Calculate total votes
    const totalVotes = votes.length;

    // Calculate percentages and build detailed options array
    const options = poll.options.map(opt => {
      const count = optionVoteCounts[String(opt._id)] || 0;
      const percent = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
      return {
        _id: opt._id,
        text: opt.text,
        image: opt.image,
        count,
        percent: Math.round(percent * 10) / 10, // 1 decimal place
      };
    });

    // Find the user's vote if authenticated
    let userVote = null;
    if (req.user) {
      const userVoteDoc = await Vote.findOne({ poll: poll._id, user: req.user._id });
      if (userVoteDoc) {
        userVote = {
          option: userVoteDoc.option,
          votedAt: userVoteDoc.createdAt,
        };
      }
    }

    // Optionally, include poll status and resultDate
    const now = new Date();
    let status = "Upcoming";
    if (now < new Date(poll.startDate)) status = "Upcoming";
    else if (now > new Date(poll.endDate)) status = "Past";
    else status = "Active";

    res.json({
      pollId: poll._id,
      title: poll.title,
      description: poll.description,
      options,
      totalVotes,
      status,
      resultDate: poll.resultDate,
      userVote,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};