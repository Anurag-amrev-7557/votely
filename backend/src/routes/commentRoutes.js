const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/authMiddleware');

// Fetch comments for a poll
router.get('/polls/:pollId/comments', commentController.getComments);

// Post a new comment (auth required unless anonymous)
router.post('/polls/:pollId/comments', auth.optional, commentController.postComment);

// Approve a comment (admin/mod only)
router.post('/:commentId/approve', auth.protect, auth.admin, commentController.approveComment);

// Flag a comment (auth required)
router.post('/:commentId/flag', auth.protect, commentController.flagComment);

// Delete a comment (admin/mod or comment owner)
router.delete('/:commentId', auth.protect, commentController.deleteComment);

module.exports = router; 