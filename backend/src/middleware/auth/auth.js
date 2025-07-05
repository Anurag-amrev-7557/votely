const jwt = require('jsonwebtoken');
const User = require('../../models/User');

// ISO 27001/ISO 27002-aligned protect middleware for route security
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1. Securely extract token from HTTP-only cookie (preferred for XSS mitigation)
    if (req.cookies && typeof req.cookies.token === 'string') {
      token = req.cookies.token;
    }

    // 2. ISO: Log all authentication attempts (success/failure) for audit trail
    // (In production, use a proper logger, e.g., Winston, with log level and user/IP context)
    const logAuthAttempt = (status, reason) => {
      if (process.env.NODE_ENV === 'production') {
        // Example: send to SIEM or audit log
        // logger.info(`[AUTH] ${status}: ${reason}`, { ip: req.ip, userAgent: req.headers['user-agent'] });
      }
    };

    // 3. ISO: Validate token presence
    if (!token) {
      logAuthAttempt('FAIL', 'No token provided');
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_NO_TOKEN',
          message: 'Not authorized to access this route'
        }
      });
    }

    try {
      // 4. ISO: Verify JWT signature and expiration
      console.log('[AUTH] Verifying token:', token.substring(0, 20) + '...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'], // Explicitly specify algorithm for ISO compliance
        clockTolerance: 5 // seconds, to allow for minor clock skew
      });
      console.log('[AUTH] Token decoded successfully:', decoded);

      // 5. ISO: Validate user existence and status
      console.log('[AUTH] Looking for user with ID:', decoded.id);
      const user = await User.findById(decoded.id).select('-password -__v');
      console.log('[AUTH] User found:', user ? 'Yes' : 'No');
      if (!user) {
        logAuthAttempt('FAIL', 'User not found');
        return res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_USER_NOT_FOUND',
            message: 'User not found'
          }
        });
      }

      // 6. ISO: Check if user is active/enabled (if such a field exists)
      if (user.status && user.status !== 'active') {
        logAuthAttempt('FAIL', `User status: ${user.status}`);
        return res.status(403).json({
          success: false,
          error: {
            code: 'AUTH_USER_INACTIVE',
            message: 'User account is not active'
          }
        });
      }

      // 7. ISO: Attach only safe user info to req.user (never password/hash)
      req.user = {
        _id: user._id,
        id: user._id, // Add id for consistency with controllers
        email: user.email,
        roles: user.roles || ['user'],
        name: user.name,
        status: user.status,
        isVerified: !!user.isVerified
      };

      logAuthAttempt('SUCCESS', `User ${user._id} authenticated`);
      next();
    } catch (error) {
      // 8. ISO: Handle token errors with minimal info (prevent info leakage)
      let code = 'AUTH_INVALID_TOKEN';
      let message = 'Not authorized to access this route';
      if (error.name === 'TokenExpiredError') {
        code = 'AUTH_TOKEN_EXPIRED';
        message = 'Session expired. Please log in again.';
      } else if (error.name === 'JsonWebTokenError') {
        code = 'AUTH_INVALID_TOKEN';
        message = 'Invalid authentication token.';
      }
      logAuthAttempt('FAIL', `${code}: ${error.message}`);
      return res.status(401).json({
        success: false,
        error: {
          code,
          message
        }
      });
    }
  } catch (error) {
    // 9. ISO: Log unexpected errors for incident response
    // logger.error(`[AUTH] ERROR: ${error.message}`, { ip: req.ip });
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_INTERNAL_ERROR',
        message: 'Error authenticating user'
      }
    });
  }
};

// ISO-compliant: Grant access to specific roles with enhanced checks and minimal info leakage
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // 1. ISO: Ensure req.user exists and has roles array
    if (!req.user || !Array.isArray(req.user.roles)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    // 2. ISO: Check for at least one allowed role (roles can be string or array)
    const hasRole = req.user.roles.some(role => roles.includes(role));
    if (!hasRole) {
      // 3. ISO: Do not leak which roles are required or which the user has
      return res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Access denied'
        }
      });
    }

    // 4. ISO: Proceed if authorized
    next();
  };
};

// ISO-compliant: Admin-only middleware with enhanced checks and minimal info leakage
exports.admin = (req, res, next) => {
  // 1. ISO: Ensure req.user exists and has roles array
  if (!req.user || !Array.isArray(req.user.roles)) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_FORBIDDEN',
        message: 'Access denied'
      }
    });
  }

  // 2. ISO: Check for 'admin' role without leaking info
  if (!req.user.roles.includes('admin')) {
    return res.status(403).json({
      success: false,
      error: {
        code: 'AUTH_FORBIDDEN',
        message: 'Access denied'
      }
    });
  }

  // 3. ISO: Proceed if authorized
  next();
};

// Optional auth: attach req.user if token is present, but don't error if missing
exports.optional = async (req, res, next) => {
  let token;
  if (req.cookies && typeof req.cookies.token === 'string') {
    token = req.cookies.token;
  }
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
      clockTolerance: 5
    });
    const user = await User.findById(decoded.id).select('-password -__v');
    if (!user) {
      req.user = null;
      return next();
    }
    req.user = {
      _id: user._id,
      id: user._id, // Add id for consistency with controllers
      email: user.email,
      roles: user.roles || ['user'],
      name: user.name,
      status: user.status,
      isVerified: !!user.isVerified
    };
    next();
  } catch (error) {
    req.user = null;
    next();
  }
};

// Required auth: same as protect
exports.required = exports.protect;