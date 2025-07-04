const express = require('express');
const router = express.Router();
const { register, login, logout, getMe, refreshToken, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const validateRegister = require('../middleware/validateRegister');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Centralized error handler for validation
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

// @route   POST /api/auth/register
router.post(
  '/register',
  [
    validateRegister,
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('name').optional().isString().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  ],
  handleValidationErrors,
  register
);

// @route   POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isString().notEmpty().withMessage('Password is required'),
  ],
  handleValidationErrors,
  login
);

// @route   POST /api/auth/logout
router.post('/logout', logout);

// @route   GET /api/auth/me
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the currently authenticated user's profile information.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 role:
 *                   type: string
 *                 isVerified:
 *                   type: boolean
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
router.get(
  '/me',
  protect,
  async (req, res, next) => {
    // Enhanced: Add detailed logging, timing, and robust error handling
    const start = Date.now();
    const userEmail = req.user && req.user.email ? req.user.email : 'Unknown';
    try {
      // Audit log: user access
      console.info(`[AUTH] User "${userEmail}" accessed /me at ${new Date().toISOString()}`);
      await getMe(req, res, next);
      const duration = Date.now() - start;
      console.info(`[AUTH] /me served for "${userEmail}" in ${duration}ms`);
    } catch (err) {
      // Error log with stack trace
      console.error(`[AUTH] Error in /me route for "${userEmail}":`, err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
      }
      // If headers already sent, delegate to Express error handler
      next(err);
    }
  }
);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using a valid refresh token
 * @access  Public
 * @body    { refreshToken: string }
 * @returns { accessToken: string, refreshToken: string }
 */
router.post(
  '/refresh-token',
  [
    body('refreshToken')
      .isString()
      .notEmpty()
      .withMessage('Refresh token is required')
      .bail()
      .matches(/^[A-Za-z0-9\-_\.]+$/)
      .withMessage('Refresh token format is invalid'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    const start = Date.now();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    try {
      console.info(`[AUTH] Refresh token attempt from IP: ${ip} at ${new Date().toISOString()}`);
      await refreshToken(req, res, next);
      const duration = Date.now() - start;
      console.info(`[AUTH] /refresh-token served in ${duration}ms`);
    } catch (err) {
      console.error(`[AUTH] Error in /refresh-token:`, err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
      }
      next(err);
    }
  }
);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verify user email with a verification token
 * @access  Public
 * @body    { token: string }
 * @returns { message: string }
 */
router.post(
  '/verify-email',
  [
    body('token')
      .isString()
      .notEmpty()
      .withMessage('Verification token is required')
      .bail()
      .matches(/^[A-Za-z0-9\-_\.]+$/)
      .withMessage('Verification token format is invalid'),
  ],
  handleValidationErrors,
  async (req, res, next) => {
    const start = Date.now();
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    try {
      console.info(`[AUTH] Email verification attempt from IP: ${ip} at ${new Date().toISOString()}`);
      await verifyEmail(req, res, next);
      const duration = Date.now() - start;
      console.info(`[AUTH] /verify-email served in ${duration}ms`);
    } catch (err) {
      console.error(`[AUTH] Error in /verify-email:`, err);
      if (!res.headersSent) {
        return res.status(500).json({ error: 'Internal server error', details: process.env.NODE_ENV === 'development' ? err.message : undefined });
      }
      next(err);
    }
  }
);

// @route   POST /api/auth/forgot-password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  ],
  handleValidationErrors,
  forgotPassword
);

// @route   POST /api/auth/reset-password
router.post(
  '/reset-password',
  [
    body('token').isString().notEmpty().withMessage('Reset token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  handleValidationErrors,
  resetPassword
);

module.exports = router;