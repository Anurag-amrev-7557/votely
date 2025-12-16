const dotenv = require('dotenv');
// Load environment variables immediately
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/database/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const helmet = require('helmet');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/User');
const mongoose = require('mongoose'); // Added back for health checks

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
    if (!origin) return callback(null, true);
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
      : ['http://localhost:5173', 'http://127.0.0.1:5173'];
    if (process.env.FRONTEND_ORIGIN) allowedOrigins.push(process.env.FRONTEND_ORIGIN);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'X-Admin-Context'],
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for simplicity in mock mode
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check route
app.get('/', (req, res) => {
  res.send('API is running');
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
app.use('/api/profile', profileRoutes); // Profile routes might need adjustment or be mocking too
app.use('/api/polls', pollRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/comments', commentRoutes);
const nominationRoutes = require('./routes/nominationRoutes');
app.use('/api/nominations', nominationRoutes);
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

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