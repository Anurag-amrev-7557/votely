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

# CORS Configuration (for production)
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://yourdomain.com

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

## Deployment Troubleshooting

### Common Issues and Solutions

#### 1. CORS Errors
If you get CORS errors in production:
- Set `ALLOWED_ORIGINS` to include your production domain
- Set `FRONTEND_ORIGIN` to your production frontend URL
- Example: `ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com`

#### 2. "Something Went Wrong" Errors
If poll creation fails with generic errors:
- Check that `JWT_SECRET` is set correctly
- Verify `MONGO_URI` points to your production database
- Check server logs for specific error messages
- Ensure all required environment variables are set

#### 3. Authentication Issues
If users can't log in or create polls:
- Verify `SESSION_SECRET` is set and unique
- Check that cookies are being set correctly
- Ensure `NODE_ENV=production` for HTTPS cookies

#### 4. Database Connection Issues
If polls can't be saved:
- Verify `MONGO_URI` is correct and accessible
- Check network/firewall settings
- Ensure MongoDB is running and accessible

### Testing Your Deployment

1. **Health Check**: Visit `/api/admin/health` to verify API accessibility
2. **CORS Test**: Check browser console for CORS errors
3. **Database Test**: Try creating a simple poll and check server logs
4. **Authentication Test**: Verify login/logout works correctly

### Environment Variables Checklist

Make sure these are set in your production environment:
- [ ] `SESSION_SECRET` - Strong, unique session secret
- [ ] `MONGO_URI` - Production MongoDB connection string
- [ ] `JWT_SECRET` - Strong, unique JWT secret
- [ ] `NODE_ENV` - Set to `production`
- [ ] `FRONTEND_ORIGIN` - Your production frontend URL
- [ ] `ALLOWED_ORIGINS` - Comma-separated list of allowed origins
