const express = require('express');
const router = express.Router();
const { registerUser, loginUser, requestMagicLink, verifyMagicLink, getMe, googleAuth } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/magic-link', requestMagicLink);
router.post('/magic-link/verify', verifyMagicLink);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

module.exports = router;
