/**
 * Deployment Configuration
 * This file contains the configuration needed for deployment
 * Copy these values to your production environment variables
 */

module.exports = {
  // Required for production deployment
  required: {
    SESSION_SECRET: 'your_super_secret_session_key_change_this_in_production_32_chars_min',
    MONGO_URI: 'mongodb://localhost:27017/votely',
    JWT_SECRET: 'your_super_secret_jwt_key_change_this_in_production_32_chars_min',
    NODE_ENV: 'production'
  },
  
  // Optional but recommended for production
  optional: {
    FRONTEND_ORIGIN: 'https://yourdomain.com',
    ALLOWED_ORIGINS: 'https://yourdomain.com,https://www.yourdomain.com',
    GOOGLE_CLIENT_ID: 'your_google_client_id',
    GOOGLE_CLIENT_SECRET: 'your_google_client_secret',
    GOOGLE_CALLBACK_URL: 'https://yourdomain.com/api/auth/google/callback',
    ADMIN_EMAIL: 'admin@yourdomain.com',
    EMAIL_SERVICE: 'gmail',
    EMAIL_USER: 'your_email@gmail.com',
    EMAIL_PASS: 'your_app_password',
    EMAIL_FROM: 'your_email@gmail.com'
  },
  
  // Database configuration
  database: {
    DB_MAX_RETRIES: 5,
    DB_RETRY_DELAY: 3000
  },
  
  // Cron configuration
  cron: {
    POLL_STATUS_CRON: '* * * * *',
    TZ: 'UTC'
  },
  
  // Server configuration
  server: {
    PORT: 5001
  }
};

