const express = require('express');
const router = express.Router();
const { registerUser, loginUser, requestMagicLink, verifyMagicLink, getMe, googleAuth } = require('../controllers/authController');
const { getRegistrationOptions, verifyRegistration, getAuthenticationOptions, verifyAuthentication } = require('../controllers/webAuthnController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/magic-link', requestMagicLink);
router.post('/magic-link/verify', verifyMagicLink);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

// WebAuthn Routes
router.get('/webauthn/register/options', protect, getRegistrationOptions);
router.post('/webauthn/register/verify', protect, verifyRegistration);
router.post('/webauthn/login/options', getAuthenticationOptions);
router.post('/webauthn/login/verify', verifyAuthentication);

module.exports = router;
