const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Enhanced JWT Token Generation with custom claims and refresh support
const generateToken = (user, options = {}) => {
  // user: can be userId or user object
  const payload = {
    id: typeof user === 'object' ? user._id : user,
    email: user.email || undefined,
    name: user.name || undefined,
    isVerified: user.isVerified || undefined,
    // You can add more claims as needed
  };
  // Remove undefined fields
  Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);

  const expiresIn = options.expiresIn || '30d';
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

// Enhanced Set token cookie with refresh token support and custom options
const setTokenCookie = (res, token, opts = {}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: opts.maxAge || 30 * 24 * 60 * 60 * 1000 // 30 days
  };
  res.cookie(opts.cookieName || 'token', token, cookieOptions);

  // Optionally set refresh token
  if (opts.refreshToken) {
    res.cookie('refreshToken', opts.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: opts.refreshMaxAge || 60 * 24 * 60 * 60 * 1000 // 60 days
    });
  }
};

// Enhanced Register new user
exports.register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // --- Input Validation ---
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Name is required (2-50 characters)'
      });
    }
    if (!email || typeof email !== 'string' || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'A valid email is required'
      });
    }
    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Password is required (6-100 characters)'
      });
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Optionally: Enforce password strength (at least 1 uppercase, 1 lowercase, 1 number)
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!strongPassword.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Optionally: Remove sensitive fields before sending response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    // Generate token
    const token = generateToken(user._id);

    // Set token cookie
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    // Optionally: Log error for debugging
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Enhanced Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Input Validation ---
    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password is required and must be at least 6 characters'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password +isVerified +roles +googleId');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Optionally, check if user is verified (if your app requires email verification)
    // if (!user.isVerified) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Please verify your email before logging in'
    //   });
    // }

    // Generate token
    const token = generateToken(user._id);

    // Set token cookie
    setTokenCookie(res, token);

    // Remove sensitive fields from response
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.__v;

    // Add enhanced/computed fields
    userObj.isVerified = userObj.isVerified || false;
    userObj.roles = userObj.roles || ['user'];
    userObj.hasGoogleAuth = !!userObj.googleId;

    res.status(200).json({
      success: true,
      user: userObj
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Enhanced logout: clears token cookie securely and destroys session if exists
exports.logout = (req, res) => {
  // Clear JWT cookie
  res.cookie('token', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0)
  });

  // Destroy session if using express-session (for OAuth or passport)
  if (req.session) {
    req.session.destroy(() => {
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } else {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  }
};

// Get current user with enhanced response (no password, includes roles, verification status, and more)
exports.getMe = async (req, res) => {
  try {
    // Populate additional fields if needed (e.g., roles, profile, etc.)
    // Also populate Google auth info if present
    const user = await User.findById(req.user.id)
      .select('-password -__v -resetPasswordToken -resetPasswordExpires')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Compute additional fields
    const enhancedUser = {
      ...user,
      isVerified: !!user.isVerified,
      roles: Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : ['user'],
      hasGoogleAuth: !!user.googleId,
      displayName: user.name || user.email,
      registeredAt: user.createdAt,
      lastLogin: user.lastLogin || null,
      // Add more computed fields as needed
    };

    // Optionally, include info about OAuth providers
    enhancedUser.providers = [];
    if (user.googleId) enhancedUser.providers.push('google');
    // Add other providers here if needed

    // Optionally, include a gravatar or avatar URL
    if (user.email) {
      const crypto = require('crypto');
      const hash = crypto.createHash('md5').update(user.email.trim().toLowerCase()).digest('hex');
      enhancedUser.avatarUrl = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    }

    res.status(200).json({
      success: true,
      user: enhancedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
      error: error.message
    });
  }
};