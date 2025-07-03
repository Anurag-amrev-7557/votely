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

// List all polls
exports.getPolls = async (req, res) => {
  try {
    // await Poll.updateStatuses(); // Removed for performance, now handled by cron
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a poll by ID
exports.getPollById = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a poll
exports.updatePoll = async (req, res) => {
  try {
    // --- Robust Validation (same as create) ---
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
    const poll = await Poll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a poll
exports.deletePoll = async (req, res) => {
  try {
    const poll = await Poll.findByIdAndDelete(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json({ message: 'Poll deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get poll results
exports.getPollResults = async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    res.json({ options: poll.options, totalVotes: poll.totalVotes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 