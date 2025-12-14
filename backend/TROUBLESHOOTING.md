# Poll Creation Error Troubleshooting Guide

## The Problem
You're getting "something went wrong please try again" when creating polls from the admin page in production.

## Quick Diagnostic Steps

### 1. Check Server Logs
First, check your server logs for specific error messages:
```bash
# If using PM2
pm2 logs

# If using Docker
docker logs your-container-name

# If running directly
# Check the console output where you started the server
```

### 2. Test Basic Connectivity
Test if your API is accessible:
```bash
# Test health endpoint
curl https://yourdomain.com/api/admin/health

# Test basic endpoint
curl https://yourdomain.com/api/test/poll
```

### 3. Run the Debug Script
Use the debug script to test step by step:
```bash
cd backend
node debug-poll-creation.js
```

## Common Issues and Solutions

### Issue 1: CORS Errors
**Symptoms**: Browser console shows CORS errors, requests fail with "No 'Access-Control-Allow-Origin' header"

**Solution**:
1. Set `ALLOWED_ORIGINS` in your `.env` file:
   ```bash
   ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```
2. Set `FRONTEND_ORIGIN`:
   ```bash
   FRONTEND_ORIGIN=https://yourdomain.com
   ```
3. Restart your server

### Issue 2: Authentication Failures
**Symptoms**: 401 errors, "Not authorized" messages

**Solution**:
1. Verify `JWT_SECRET` is set and unique (32+ characters)
2. Check that cookies are being sent correctly
3. Ensure `NODE_ENV=production` for HTTPS cookies

### Issue 3: Database Connection Issues
**Symptoms**: 500 errors, "Database error" messages

**Solution**:
1. Verify `MONGO_URI` points to your production database
2. Check network/firewall settings
3. Ensure MongoDB is running and accessible
4. Test database connection manually

### Issue 4: Missing Environment Variables
**Symptoms**: Server crashes, undefined errors

**Solution**:
1. Run the deployment checker:
   ```bash
   node deployment-check.js
   ```
2. Set all required variables in your `.env` file
3. Restart the server

## Step-by-Step Debugging

### Step 1: Test Without Authentication
Use the test endpoint that doesn't require authentication:
```bash
curl -X POST https://yourdomain.com/api/test/poll \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","category":"Test","startDate":"2024-12-25T10:00:00Z","endDate":"2024-12-26T18:00:00Z","options":[{"text":"Option 1"},{"text":"Option 2"}]}'
```

### Step 2: Test With Authentication
If the test endpoint works, test with authentication:
```bash
# First, get a valid JWT token (you'll need to implement this)
# Then test the protected endpoint
curl -X POST https://yourdomain.com/api/polls \
  -H "Content-Type: application/json" \
  -H "Cookie: token=your-jwt-token" \
  -d '{"title":"Test","category":"Test","startDate":"2024-12-25T10:00:00Z","endDate":"2024-12-26T18:00:00Z","options":[{"text":"Option 1"},{"text":"Option 2"}]}'
```

### Step 3: Check Frontend Network Tab
1. Open browser developer tools
2. Go to Network tab
3. Try to create a poll
4. Look for failed requests and check:
   - Request URL
   - Request headers
   - Response status
   - Response body

### Step 4: Verify Environment Variables
Make sure these are set in production:
```bash
# Required
SESSION_SECRET=your_32_character_secret_here
MONGO_URI=mongodb://your-production-db
JWT_SECRET=your_32_character_jwt_secret_here
NODE_ENV=production

# Production URLs
FRONTEND_ORIGIN=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Using the Test HTML Page

1. Open `test-poll-frontend.html` in your browser
2. Set the API URL to your production domain
3. Test each endpoint step by step:
   - Start with "Health Check" (no auth required)
   - Then "Test Endpoint" (no auth required)
   - Finally "Create Poll" (auth required)

## Common Production Mistakes

1. **Hardcoded localhost URLs**: Make sure all URLs use environment variables
2. **Missing HTTPS**: Production should use HTTPS, set `NODE_ENV=production`
3. **Weak secrets**: Use strong, unique secrets (32+ characters)
4. **CORS too restrictive**: Allow your production domains
5. **Database not accessible**: Check network/firewall settings

## Getting Help

If you're still having issues:

1. **Check server logs** for specific error messages
2. **Run the debug script** and share the output
3. **Test with the HTML page** and share the results
4. **Check environment variables** are all set correctly
5. **Verify database connectivity** from your production server

## Quick Fix Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOWED_ORIGINS` to include your production domain
- [ ] Set `FRONTEND_ORIGIN` to your production URL
- [ ] Verify `MONGO_URI` points to production database
- [ ] Ensure `JWT_SECRET` and `SESSION_SECRET` are strong and unique
- [ ] Restart your server
- [ ] Test with the debug script
- [ ] Check server logs for errors
