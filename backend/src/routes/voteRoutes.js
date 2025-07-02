const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const auth = require('../middleware/auth');

// Cast a vote
router.post('/', auth.protect, voteController.castVote);
// Get user's vote for a poll
router.get('/:pollId', auth.protect, voteController.getUserVote);

module.exports = router; 