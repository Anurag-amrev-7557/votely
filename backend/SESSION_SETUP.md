# Session Configuration Setup

## Overview
This guide explains how to set up your environment variables to resolve the MemoryStore warning and use MongoDB for session storage.

## The Problem
You were getting this warning:
```
Warning: connect.session() MemoryStore is not designed for a production environment, as it will leak memory, and will not scale past a single process.
```

This happens because Express.js uses an in-memory session store by default, which isn't suitable for production.

## The Solution
We've updated your code to use MongoDB for session storage via `connect-mongo`. This provides:
- Persistent session storage
- Scalability across multiple processes
- Automatic session cleanup
- Better security

## Required Environment Variables

Create a `.env` file in your backend directory with these variables:

```bash
# Session Configuration
SESSION_SECRET=your_super_secret_session_key_change_this_in_production

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/votely

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Frontend Configuration
FRONTEND_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development

# Email Configuration (if using email features)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Admin Configuration
ADMIN_EMAIL=admin@example.com

# Database Configuration
DB_MAX_RETRIES=5
DB_RETRY_DELAY=3000

# Poll Status Cron
POLL_STATUS_CRON=* * * * *
TZ=UTC
```

## Important Notes

1. **SESSION_SECRET**: This should be a long, random string. In production, make sure it's at least 32 characters long.

2. **MONGO_URI**: This should match your MongoDB connection string. The code now uses this for both database connections and session storage.

3. **Security**: The session configuration now includes:
   - `httpOnly: true` - Prevents XSS attacks
   - `sameSite: 'lax'` - Protects against CSRF attacks
   - `secure: true` in production - Ensures HTTPS-only cookies
   - Custom session name to avoid fingerprinting

4. **Performance**: Sessions are configured with:
   - 1-day TTL (time to live)
   - Rolling sessions (extended on each request)
   - Touch optimization (only updates once per day)

## What Changed

1. **Added `connect-mongo`** for MongoDB session storage
2. **Added `helmet`** for security headers
3. **Updated session configuration** with better security and performance settings
4. **Fixed MongoDB URI variable** to use `MONGO_URI` consistently

## Testing

After setting up your `.env` file, restart your server. The warning should be gone, and you should see sessions being stored in your MongoDB database in a `sessions` collection.

## Production Considerations

1. **Change all secrets** to strong, unique values
2. **Use HTTPS** in production (set `NODE_ENV=production`)
3. **Consider using Redis** for session storage if you need even better performance
4. **Monitor session collection** size and cleanup
5. **Use environment-specific MongoDB URIs** (development vs production)
