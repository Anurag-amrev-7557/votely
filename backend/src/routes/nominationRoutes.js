const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const nominationController = require('../controllers/nominationController');

// Apply for nomination
router.post('/apply', auth.protect, nominationController.createNomination);

// Get my nominations
router.get('/my', auth.protect, nominationController.getMyNominations);

// Get nominations for a poll (Admin only)
router.get('/poll/:pollId', auth.protect, auth.authorize('admin', 'election_committee'), nominationController.getPollNominations);

// Update status (Admin only)
router.put('/:nominationId/status', auth.protect, auth.authorize('admin', 'election_committee'), nominationController.updateNominationStatus);

module.exports = router;
