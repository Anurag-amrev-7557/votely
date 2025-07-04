const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const auth = require('../middleware/auth');
const { castVote, voteLimiter, botDetection } = require('../controllers/voteController');
const { body, param, validationResult } = require('express-validator');

// Centralized error handler for validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Enhanced: Cast a vote with bot detection, rate limiting, and validation
router.post(
  '/vote',
  botDetection,
  voteLimiter,
  [
    body('pollId').isMongoId().withMessage('Invalid poll ID'),
    body('options').isArray({ min: 1 }).withMessage('At least one option is required'),
    body('options.*').isString().trim().notEmpty().withMessage('Option text is required'),
  ],
  handleValidationErrors,
  castVote
);

// Enhanced: Batch get user's vote status for multiple polls (with validation)
router.post(
  '/batch',
  auth.protect,
  [
    body('pollIds').isArray({ min: 1 }).withMessage('pollIds must be a non-empty array'),
    body('pollIds.*').isMongoId().withMessage('Each pollId must be a valid Mongo ID'),
  ],
  handleValidationErrors,
  voteController.getUserVotesBatch
);

// Enhanced: Get user's vote for a poll (with validation)
router.get(
  '/:pollId',
  auth.protect,
  [
    param('pollId').isMongoId().withMessage('Invalid poll ID'),
  ],
  handleValidationErrors,
  voteController.getUserVote
);

module.exports = router;