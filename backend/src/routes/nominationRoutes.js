const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth/auth');
const nominationController = require('../controllers/nominationController');

// Apply for nomination
router.post('/apply', protect, nominationController.createNomination);

// Get my nominations
router.get('/my', protect, nominationController.getMyNominations);

// Get nominations for a poll (Admin only)
router.get('/poll/:pollId', protect, authorize('admin', 'election_committee'), nominationController.getPollNominations);

// Update status (Admin only)
router.put('/:nominationId/status', protect, authorize('admin', 'election_committee'), nominationController.updateNominationStatus);

module.exports = router;
