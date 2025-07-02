const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const Activity = require('../models/Activity');
const auth = require('../middleware/auth');

// Create poll
router.post('/', auth.protect, pollController.createPoll);
// List polls
router.get('/', pollController.getPolls);
// Get poll by ID
router.get('/:id', pollController.getPollById);
// Update poll
router.put('/:id', auth.protect, pollController.updatePoll);
// Delete poll
router.delete('/:id', auth.protect, pollController.deletePoll);
// Get poll results
router.get('/:id/results', pollController.getPollResults);

// Admin: Get audit logs for a poll
router.get('/:pollId/audit-logs', auth.protect, auth.admin, async (req, res) => {
  try {
    const { pollId } = req.params;
    const logs = await Activity.find({ poll: pollId }).populate('user', 'name email').sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 