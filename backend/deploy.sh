#!/bin/bash

# Votely Backend Deployment Script
# This script helps prepare your backend for production deployment

echo "🚀 Votely Backend Deployment Setup"
echo "=================================="

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo "❌ Please don't run this script as root"
    exit 1
fi

# Check Node.js version
echo "📋 Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check npm version
echo "📋 Checking npm version..."
NPM_VERSION=$(npm --version)
echo "✅ npm version: $NPM_VERSION"

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating template..."
    cat > .env << 'EOF'
# Session Configuration
SESSION_SECRET=your_super_secret_session_key_change_this_in_production_32_chars_min

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/votely

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_32_chars_min

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback

# Frontend Configuration
FRONTEND_ORIGIN=https://yourdomain.com

# CORS Configuration (for production)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Environment
NODE_ENV=production

# Email Configuration (if using email features)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=your_email@gmail.com

# Admin Configuration
ADMIN_EMAIL=admin@yourdomain.com

# Database Configuration
DB_MAX_RETRIES=5
DB_RETRY_DELAY=3000

# Poll Status Cron
POLL_STATUS_CRON=* * * * *
TZ=UTC

# Server Configuration
PORT=5001
EOF
    echo "📝 Created .env template. Please update with your actual values!"
    echo "🔑 IMPORTANT: Change the secret keys to strong, unique values!"
else
    echo "✅ .env file found"
fi

# Create uploads directory if it doesn't exist
echo "📁 Creating uploads directory..."
mkdir -p uploads/poll-images
mkdir -p uploads/profile-photos

# Set proper permissions
echo "🔐 Setting proper permissions..."
chmod 755 uploads
chmod 755 uploads/poll-images
chmod 755 uploads/profile-photos

# Check deployment configuration
echo "🔍 Running deployment check..."
node deployment-check.js

echo ""
echo "🎯 Next Steps:"
echo "1. Update the .env file with your production values"
echo "2. Set NODE_ENV=production"
echo "3. Update FRONTEND_ORIGIN and ALLOWED_ORIGINS with your domain"
echo "4. Set strong, unique secrets for SESSION_SECRET and JWT_SECRET"
echo "5. Update MONGO_URI to point to your production database"
echo "6. Test the deployment with: npm start"
echo ""
echo "📚 For more help, see SESSION_SETUP.md and TROUBLESHOOTING.md"
echo "�� Happy deploying!"

