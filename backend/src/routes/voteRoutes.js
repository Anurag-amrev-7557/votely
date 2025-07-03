const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const auth = require('../middleware/auth');
const { castVote, voteLimiter, botDetection } = require('../controllers/voteController');

// Cast a vote
router.post('/vote', castVote);
// Batch get user's vote status for multiple polls
router.post('/batch', auth.protect, voteController.getUserVotesBatch);
// Get user's vote for a poll
router.get('/:pollId', auth.protect, voteController.getUserVote);

module.exports = router; 