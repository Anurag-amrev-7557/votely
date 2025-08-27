const mongoose = require('mongoose');

/**
 * MongoDB connection utility (2024+).
 * - Removes deprecated options: useNewUrlParser, useUnifiedTopology
 * - Handles connection/reconnection events
 * - Logs connection status and errors with timestamps
 * - Retries on failure (configurable)
 * - Graceful shutdown support
 * - Warns if deprecated options are passed
 */

const DEFAULT_OPTIONS = {
  // poolSize: 10,
  // connectTimeoutMS: 10000,
  // No longer need useNewUrlParser or useUnifiedTopology (see Node.js driver >= 4.0.0)
};

let isConnectedBefore = false;
let retryCount = 0;
const MAX_RETRIES = process.env.DB_MAX_RETRIES ? parseInt(process.env.DB_MAX_RETRIES) : 5;
const RETRY_DELAY = process.env.DB_RETRY_DELAY ? parseInt(process.env.DB_RETRY_DELAY) : 3000;

function log(msg, ...args) {
  console.log(`[MongoDB][${new Date().toISOString()}] ${msg}`, ...args);
}

function warnIfDeprecatedOptions(options) {
  if ('useNewUrlParser' in options) {
    log('Warning: useNewUrlParser is deprecated and has no effect with MongoDB Node.js Driver >= 4.0.0');
    delete options.useNewUrlParser;
  }
  if ('useUnifiedTopology' in options) {
    log('Warning: useUnifiedTopology is deprecated and has no effect with MongoDB Node.js Driver >= 4.0.0');
    delete options.useUnifiedTopology;
  }
}

async function connectWithRetry(uri, options = {}) {
  // Remove deprecated options if present
  warnIfDeprecatedOptions(options);
  
  log(`Attempting to connect to MongoDB...`);
  log(`Connection URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials in logs
  
  try {
    const conn = await mongoose.connect(uri, { ...DEFAULT_OPTIONS, ...options });
    log(`Connected: ${conn.connection.host}`);
    isConnectedBefore = true;
    retryCount = 0;
    return conn;
  } catch (error) {
    log(`Connection error: ${error.message}`);
    log(`Error code: ${error.code || 'N/A'}`);
    log(`Error name: ${error.name || 'N/A'}`);
    
    if (error.code === 'ENOTFOUND') {
      log('DNS resolution failed. Check if the hostname is correct.');
    } else if (error.code === 'ECONNREFUSED') {
      log('Connection refused. Check if MongoDB is running and accessible.');
    } else if (error.code === 'ETIMEDOUT') {
      log('Connection timeout. Check network connectivity and firewall settings.');
    } else if (error.message.includes('Authentication failed')) {
      log('Authentication failed. Check username and password.');
    } else if (error.message.includes('ENODATA')) {
      log('No data returned from DNS lookup.');
    }
    
    retryCount++;
    if (retryCount <= MAX_RETRIES) {
      log(`Retrying to connect in ${RETRY_DELAY}ms (attempt ${retryCount}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_DELAY));
      return connectWithRetry(uri, options);
    } else {
      log('Max retries reached. Continuing without database connection...');
      // Don't exit process, just return null to indicate connection failed
      return null;
    }
  }
}

const connectDB = async (options = {}) => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    log('MONGO_URI not set in environment variables.');
    log('Continuing without database connection...');
    return null;
  }

  // Listen for connection events
  mongoose.connection.on('connected', () => {
    log('Mongoose connected');
  });

  mongoose.connection.on('error', err => {
    log('Mongoose connection error:', err);
    log('Error details:', {
      code: err.code,
      name: err.name,
      message: err.message
    });
  });

  mongoose.connection.on('disconnected', () => {
    log('Mongoose disconnected');
    if (!isConnectedBefore) {
      log('Initial connection lost. Will retry on next operation...');
      // Don't exit process, just log the disconnection
    }
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      log('Mongoose disconnected on app termination');
    }
    process.exit(0);
  });

  return connectWithRetry(uri, options);
};

module.exports = connectDB;