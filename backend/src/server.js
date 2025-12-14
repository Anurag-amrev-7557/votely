const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/database/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const MongoStore = require('connect-mongo');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Connect to MongoDB
// Connect to MongoDB
// In Vercel/Serverless, we rely on Mongoose's connection buffering for the first request
connectDB().then((dbConnection) => {
  if (dbConnection) {
    console.log('Database connected successfully');
  } else {
    console.log('Database connection failed, but server will continue running');
  }
}).catch((error) => {
  console.log('Database connection error:', error.message);
});

// Start poll status cron job after DB connection attempt
// Only start cron job if NOT running on Vercel/Serverless
// Vercel sets VERCEL=1 or NOW_REGION env vars
if (!process.env.VERCEL) {
  const startStatusCron = require('./statusCron');
  startStatusCron();
}

const app = express();

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Get allowed origins from environment variables or use defaults
      const allowedOrigins = process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:5173', 'http://127.0.0.1:5173'];

      // Add production domains if specified
      if (process.env.FRONTEND_ORIGIN) {
        allowedOrigins.push(process.env.FRONTEND_ORIGIN);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
});

// Make io available for controllers
module.exports.io = io;

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Get allowed origins from environment variables or use defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];

    // Add production domains if specified
    if (process.env.FRONTEND_ORIGIN) {
      allowedOrigins.push(process.env.FRONTEND_ORIGIN);
    }

    // Log CORS check for debugging
    console.log('CORS check:', { origin, allowedOrigins, isAllowed: allowedOrigins.indexOf(origin) !== -1 });

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  } : false,
  crossOriginEmbedderPolicy: process.env.NODE_ENV === 'production' ? 'require-corp' : false,
  crossOriginResourcePolicy: process.env.NODE_ENV === 'production' ? 'cross-origin' : false
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Debug route to test if server is responding
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Debug route to check if profile routes are accessible
app.get('/api/profile/test', (req, res) => {
  res.json({ message: 'Profile route is accessible', timestamp: new Date().toISOString() });
});

// Admin health check route
app.get('/api/admin/health', (req, res) => {
  res.json({
    message: 'Admin API is accessible',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cors: {
      allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
        : ['http://localhost:5173', 'http://127.0.0.1:5173'],
      frontendOrigin: process.env.FRONTEND_ORIGIN || 'not set'
    }
  });
});

// Test poll creation endpoint (no auth required for debugging)
app.post('/api/test/poll', async (req, res) => {
  try {
    console.log('Test poll creation endpoint called');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    // Basic validation
    const { title, description, startDate, endDate, options, category } = req.body;
    if (!title || !startDate || !endDate || !options || !category) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'startDate', 'endDate', 'options', 'category'],
        received: Object.keys(req.body)
      });
    }

    // Test database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    res.json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      requestData: req.body,
      headers: req.headers
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      error: 'Test endpoint failed',
      message: error.message,
      stack: error.stack
    });
  }
});

// Proxy endpoint for Google profile photos to handle CORS
app.get('/api/proxy/google-photo', async (req, res) => {
  try {
    const { url } = req.query;

    console.log('Google photo proxy request:', { url });

    if (!url || !url.includes('googleusercontent.com')) {
      console.log('Invalid URL provided:', url);
      return res.status(400).json({ error: 'Invalid Google photo URL' });
    }

    console.log('Fetching Google photo from:', url);
    const response = await fetch(url);

    console.log('Google photo response status:', response.status);
    console.log('Google photo response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.log('Google photo not found, status:', response.status);
      return res.status(404).json({ error: 'Photo not found' });
    }

    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log('Successfully proxied Google photo, size:', buffer.byteLength, 'bytes');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('Error proxying Google photo:', error);
    res.status(500).json({ error: 'Failed to load photo', details: error.message });
  }
});

// Import all route files at the top
const pollRoutes = require('./routes/pollRoutes');
const voteRoutes = require('./routes/voteRoutes');
const commentRoutes = require('./routes/commentRoutes');

// Register all API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
const nominationRoutes = require('./routes/nominationRoutes');
app.use('/api/nominations', nominationRoutes);

// Google OAuth configuration
const googleCallbackURL = process.env.GOOGLE_CALLBACK_URL;
if (!googleCallbackURL) {
  console.warn('GOOGLE_CALLBACK_URL not set, using default');
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: googleCallbackURL || 'http://localhost:5001/api/auth/google/callback',
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;

      // Enforce IIT BBS domain
      if (!email.toLowerCase().endsWith('@iitbbs.ac.in')) {
        return done(new Error('Login restricted to IIT Bhubaneswar emails (@iitbbs.ac.in)'), null);
      }

      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Try to find by email in case user registered locally first
        user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          user.googleId = profile.id;
          // Update profile photo if not set
          if (!user.profilePhoto && profile.photos && profile.photos.length > 0) {
            user.profilePhoto = profile.photos[0].value;
          }
          await user.save();
        } else {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            isVerified: true,
            profilePhoto: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            // You may want to set a random password or leave it blank
            password: Math.random().toString(36).slice(-8) + 'A1!'
          });
        }
      }
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/votely',
    collectionName: 'sessions',
    ttl: 24 * 60 * 60, // 1 day
    autoRemove: 'native',
    touchAfter: 24 * 3600 // Only update session once per day
  }),
  name: 'votely.sid', // Custom session name
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/'
  },
  rolling: true, // Extend session on each request
  unset: 'destroy' // Remove session when unset
}));
app.use(passport.initialize());
app.use(passport.session());

// Start Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/google/error', session: false }),
  (req, res) => {
    // Issue JWT and set cookie
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    // Set security headers to allow cross-origin communication
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

    // PostMessage to frontend with better error handling
    // We use '*' as targetOrigin to ensure the message reaches the opener regardless of subdomain/port differences
    // This is acceptable here as the sensitive token is in an HttpOnly cookie, and the user data is public profile info.
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

    res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Authentication Complete</title>
    <meta charset="utf-8">
    <script>
      function closeWindow() {
        try {
          if (window.opener) {
            window.opener.postMessage({ 
              type: 'GOOGLE_AUTH_SUCCESS', 
              user: ${JSON.stringify(req.user)} 
            }, '*');
          }
          window.close();
        } catch (e) {
          console.error(e);
          // Fallback: Redirect if close fails
          window.location.href = '${FRONTEND_ORIGIN}/auth-success';
        }
      }
      
      // Attempt to close immediately
      window.onload = function() {
        setTimeout(closeWindow, 500);
      };
    </script>
</head>
<body style="background: #f3f4f6; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
    <div style="text-align: center; padding: 20px; background: white; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <h3 style="color: #111827; margin-bottom: 10px;">Authentication Successful</h3>
        <p style="color: #4b5563; margin-bottom: 20px;">You can now close this window.</p>
        <button onclick="closeWindow()" style="background: #2563eb; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            Back to App
        </button>
    </div>
</body>
</html>`);
  }
);

// Google OAuth error callback
app.get('/api/auth/google/error', (req, res) => {
  const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');

  res.send(`<!DOCTYPE html>
<html>
<head>
    <title>Authentication Failed</title>
    <meta charset="utf-8">
</head>
<body>
    <script>
      try {
        if (window.opener) {
          window.opener.postMessage({ 
            type: 'GOOGLE_AUTH_ERROR', 
            error: 'Authentication failed. Please try again.' 
          }, '${FRONTEND_ORIGIN}');
          window.close();
        } else {
          // Fallback: redirect to frontend with error parameter
          window.location.href = '${FRONTEND_ORIGIN}/auth-error?error=authentication_failed';
        }
      } catch (error) {
        console.error('PostMessage error:', error);
        // Fallback: redirect to frontend with error parameter
        window.location.href = '${FRONTEND_ORIGIN}/auth-error?error=authentication_failed';
      }
    </script>
    <p>Authentication failed. You can close this window and try again.</p>
</body>
</html>`);
});

io.on('connection', (socket) => {
  // Client requests to join a poll room for real-time updates
  socket.on('joinPollRoom', (pollId) => {
    if (pollId) {
      socket.join(`poll_${pollId}`);
    }
  });
  // Optionally handle disconnects or other events here
});

// Global error handler for unhandled errors
app.use((error, req, res, next) => {
  console.error('Global error handler caught:', error);

  // Don't expose internal errors to client
  const statusCode = error.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Handle 404 errors
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export app for Vercel
module.exports = app;

// Only start server if running directly (not required as a module)
if (require.main === module) {
  const PORT = process.env.PORT || 5001;
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
} 