#!/usr/bin/env node

/**
 * Deployment Configuration Checker
 * Run this script to verify your deployment configuration
 */

console.log('🔍 Checking deployment configuration...\n');

// Check required environment variables
const requiredVars = [
  'SESSION_SECRET',
  'MONGO_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const optionalVars = [
  'FRONTEND_ORIGIN',
  'ALLOWED_ORIGINS',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ADMIN_EMAIL'
];

console.log('📋 Required Environment Variables:');
let allRequiredSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} - Set`);
    if (varName.includes('SECRET') && value.length < 32) {
      console.log(`     ⚠️  Warning: ${varName} should be at least 32 characters long`);
    }
  } else {
    console.log(`  ❌ ${varName} - NOT SET`);
    allRequiredSet = false;
  }
});

console.log('\n📋 Optional Environment Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName} - Set`);
  } else {
    console.log(`  ⚠️  ${varName} - Not set (optional)`);
  }
});

console.log('\n🌍 Environment Configuration:');
console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`  FRONTEND_ORIGIN: ${process.env.FRONTEND_ORIGIN || 'not set'}`);
console.log(`  ALLOWED_ORIGINS: ${process.env.ALLOWED_ORIGINS || 'not set'}`);

// CORS configuration check
if (process.env.NODE_ENV === 'production') {
  console.log('\n🚨 Production Environment Checks:');
  
  if (!process.env.FRONTEND_ORIGIN) {
    console.log('  ❌ FRONTEND_ORIGIN should be set in production');
  } else {
    console.log('  ✅ FRONTEND_ORIGIN is set');
  }
  
  if (!process.env.ALLOWED_ORIGINS) {
    console.log('  ❌ ALLOWED_ORIGINS should be set in production');
  } else {
    console.log('  ✅ ALLOWED_ORIGINS is set');
  }
  
  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    console.log('  ⚠️  SESSION_SECRET should be at least 32 characters in production');
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.log('  ⚠️  JWT_SECRET should be at least 32 characters in production');
  }
}

console.log('\n📝 Summary:');
if (allRequiredSet) {
  console.log('  ✅ All required environment variables are set');
  console.log('  🚀 Your deployment configuration looks good!');
} else {
  console.log('  ❌ Some required environment variables are missing');
  console.log('  📖 Please check the SESSION_SETUP.md file for guidance');
}

console.log('\n🔧 Next Steps:');
console.log('  1. Set all required environment variables');
console.log('  2. Restart your server');
console.log('  3. Test the /api/admin/health endpoint');
console.log('  4. Try creating a poll from the admin page');

if (process.env.NODE_ENV === 'production') {
  console.log('\n🌐 Production Deployment Tips:');
  console.log('  - Use HTTPS for all production URLs');
  console.log('  - Set strong, unique secrets (32+ characters)');
  console.log('  - Configure CORS to allow only your domains');
  console.log('  - Monitor server logs for errors');
}
