const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const jwt = require('jsonwebtoken');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start poll status cron job after DB connection
const startStatusCron = require('./statusCron');
startStatusCron();

const app = express();

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  },
});

// Make io available for controllers
module.exports.io = io;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

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

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes
app.use('/api/profile', profileRoutes);

// Poll routes
const pollRoutes = require('./routes/pollRoutes');
app.use('/api/polls', pollRoutes);

// Vote routes
const voteRoutes = require('./routes/voteRoutes');
app.use('/api/votes', voteRoutes);

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
},
async (accessToken, refreshToken, profile, done) => {
  try {
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

app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Start Google OAuth
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback
app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    // Issue JWT and set cookie
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 60 * 60 * 1000 });
    // PostMessage to frontend
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';
    res.send(`<script>
      window.opener.postMessage({ type: 'GOOGLE_AUTH_SUCCESS', user: ${JSON.stringify(req.user)} }, '${FRONTEND_ORIGIN}');
      window.close();
    </script>`);
  }
);

io.on('connection', (socket) => {
  // Client requests to join a poll room for real-time updates
  socket.on('joinPollRoom', (pollId) => {
    if (pollId) {
      socket.join(`poll_${pollId}`);
    }
  });
  // Optionally handle disconnects or other events here
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 