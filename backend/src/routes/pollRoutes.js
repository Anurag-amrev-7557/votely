const express = require('express');
const router = express.Router();
const pollController = require('../controllers/pollController');
const Activity = require('../models/Activity');
const auth = require('../middleware/authMiddleware');

// Enhanced: Middleware for input validation and sanitization
const { body, param, validationResult } = require('express-validator');

// Utility: Centralized error handler for validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// Enhanced: Create poll (with validation)
router.post(
  '/',
  auth.protect,
  [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('options').isArray({ min: 2 }).withMessage('At least two options are required'),
    body('options.*.text').isString().trim().notEmpty().withMessage('Option text is required'),
    body('options.*.description').optional().isString(),
    body('options.*.party').optional().isString(),
    body('options.*.image').optional().isString(),
    // Add more validations as needed
  ],
  handleValidationErrors,
  pollController.createPoll
);

// Enhanced: List polls (with optional query params for filtering/pagination)
router.get(
  '/',
  [
    // Optionally validate query params for pagination/filtering
    // query('page').optional().isInt({ min: 1 }),
    // query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
  handleValidationErrors,
  pollController.getPolls
);

// Enhanced: Get poll by ID (with validation)
router.get(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid poll ID'),
  ],
  handleValidationErrors,
  pollController.getPollById
);

// Enhanced: Update poll (with validation)
router.put(
  '/:id',
  auth.protect,
  [
    param('id').isMongoId().withMessage('Invalid poll ID'),
    // Optionally validate body fields
  ],
  handleValidationErrors,
  pollController.updatePoll
);

// Enhanced: Delete poll (with validation)
router.delete(
  '/:id',
  auth.protect,
  [
    param('id').isMongoId().withMessage('Invalid poll ID'),
  ],
  handleValidationErrors,
  pollController.deletePoll
);

// Enhanced: Get poll results (with validation)
router.get(
  '/:id/results',
  [
    param('id').isMongoId().withMessage('Invalid poll ID'),
  ],
  handleValidationErrors,
  pollController.getPollResults
);

// Enhanced: Admin - Get audit logs for a poll (with validation, minimal info leakage)
router.get(
  '/:pollId/audit-logs',
  auth.protect,
  auth.admin,
  [
    param('pollId').isMongoId().withMessage('Invalid poll ID'),
  ],
  handleValidationErrors,
  async (req, res) => {
    try {
      const { pollId } = req.params;
      // Only return minimal user info in logs
      const logs = await Activity.find({ poll: pollId })
        .populate('user', 'name email _id')
        .sort({ timestamp: -1 })
        .lean();
      // Optionally, redact sensitive fields
      const safeLogs = logs.map(log => {
        if (log.user && typeof log.user === 'object') {
          log.user = {
            _id: log.user._id,
            name: log.user.name,
            email: log.user.email
          };
        }
        // Remove or redact any sensitive meta fields if needed
        if (log.meta && log.meta.ip) {
          log.meta.ip = '[REDACTED]';
        }
        return log;
      });
      res.json(safeLogs);
    } catch (err) {
      // Never leak internal error details in production
      res.status(500).json({ error: 'Failed to fetch audit logs.' });
    }
  }
);

module.exports = router;