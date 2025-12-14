#!/usr/bin/env node

/**
 * Poll Creation Debug Script
 * This script helps debug poll creation issues step by step
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Configuration
const config = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:5001',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/votely',
  jwtSecret: process.env.JWT_SECRET || 'test-secret',
  testUserId: process.env.TEST_USER_ID || '507f1f77bcf86cd799439011' // Example ObjectId
};

console.log('🔍 Poll Creation Debug Script\n');
console.log('Configuration:');
console.log(`  Base URL: ${config.baseURL}`);
console.log(`  MongoDB URI: ${config.mongoUri}`);
console.log(`  JWT Secret: ${config.jwtSecret ? 'Set' : 'NOT SET'}`);
console.log(`  Test User ID: ${config.testUserId}\n`);

// Test data for poll creation
const testPollData = {
  title: 'Test Poll Debug',
  description: 'This is a test poll for debugging',
  category: 'Test',
  startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
  endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
  options: [
    { text: 'Option 1', description: 'First option' },
    { text: 'Option 2', description: 'Second option' }
  ],
  settings: {
    allowMultipleVotes: false,
    showResultsBeforeEnd: false,
    showResultsAfterVote: true,
    requireAuthentication: false,
    enableComments: true,
    showVoterNames: false,
    notifyOnVote: false,
    notifyOnEnd: false
  }
};

async function testDatabaseConnection() {
  console.log('1️⃣ Testing Database Connection...');
  try {
    await mongoose.connect(config.mongoUri);
    console.log('  ✅ MongoDB connected successfully');
    
    // Test if we can access the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`  ✅ Database accessible, found ${collections.length} collections`);
    
    // Check if Poll model can be created
    const Poll = require('./src/models/Poll');
    console.log('  ✅ Poll model loaded successfully');
    
    return true;
  } catch (error) {
    console.log('  ❌ Database connection failed:', error.message);
    return false;
  }
}

async function testJWTToken() {
  console.log('\n2️⃣ Testing JWT Token Generation...');
  try {
    if (!config.jwtSecret) {
      console.log('  ❌ JWT_SECRET not set');
      return null;
    }
    
    const token = jwt.sign({ id: config.testUserId }, config.jwtSecret, { expiresIn: '1h' });
    console.log('  ✅ JWT token generated successfully');
    console.log(`  📝 Token: ${token.substring(0, 20)}...`);
    
    // Verify the token
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('  ✅ JWT token verified successfully');
    console.log(`  📝 Decoded: ${JSON.stringify(decoded)}`);
    
    return token;
  } catch (error) {
    console.log('  ❌ JWT token generation failed:', error.message);
    return null;
  }
}

async function testAPIEndpoints(token) {
  console.log('\n3️⃣ Testing API Endpoints...');
  
  if (!token) {
    console.log('  ⚠️  Skipping API tests - no valid token');
    return false;
  }
  
  try {
    // Test health endpoint
    console.log('  🔍 Testing /api/admin/health...');
    const healthResponse = await axios.get(`${config.baseURL}/api/admin/health`);
    console.log('  ✅ Health endpoint accessible');
    console.log('  📝 Response:', healthResponse.data);
    
    // Test polls endpoint (GET)
    console.log('  🔍 Testing GET /api/polls...');
    const pollsResponse = await axios.get(`${config.baseURL}/api/polls`, {
      headers: { 'Cookie': `token=${token}` }
    });
    console.log('  ✅ Polls endpoint accessible');
    console.log('  📝 Response status:', pollsResponse.status);
    
    return true;
  } catch (error) {
    console.log('  ❌ API endpoint test failed:', error.message);
    if (error.response) {
      console.log('  📝 Response status:', error.response.status);
      console.log('  📝 Response data:', error.response.data);
    }
    return false;
  }
}

async function testPollCreation(token) {
  console.log('\n4️⃣ Testing Poll Creation...');
  
  if (!token) {
    console.log('  ⚠️  Skipping poll creation test - no valid token');
    return false;
  }
  
  try {
    console.log('  🔍 Attempting to create test poll...');
    console.log('  📝 Poll data:', JSON.stringify(testPollData, null, 2));
    
    const response = await axios.post(`${config.baseURL}/api/polls`, testPollData, {
      headers: { 
        'Cookie': `token=${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('  ✅ Poll created successfully!');
    console.log('  📝 Response status:', response.status);
    console.log('  📝 Poll ID:', response.data._id || response.data.id);
    
    return true;
  } catch (error) {
    console.log('  ❌ Poll creation failed:', error.message);
    if (error.response) {
      console.log('  📝 Response status:', error.response.status);
      console.log('  📝 Response data:', error.response.data);
      console.log('  📝 Response headers:', error.response.headers);
    }
    return false;
  }
}

async function runDebugTests() {
  console.log('🚀 Starting debug tests...\n');
  
  const dbOk = await testDatabaseConnection();
  const token = await testJWTToken();
  const apiOk = await testAPIEndpoints(token);
  const pollOk = await testPollCreation(token);
  
  console.log('\n📊 Debug Test Results:');
  console.log(`  Database: ${dbOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`  JWT: ${token ? '✅ OK' : '❌ FAILED'}`);
  console.log(`  API: ${apiOk ? '✅ OK' : '❌ FAILED'}`);
  console.log(`  Poll Creation: ${pollOk ? '✅ OK' : '❌ FAILED'}`);
  
  if (!dbOk) {
    console.log('\n🔧 Database Issues:');
    console.log('  - Check MONGO_URI environment variable');
    console.log('  - Verify MongoDB is running and accessible');
    console.log('  - Check network/firewall settings');
  }
  
  if (!token) {
    console.log('\n🔧 JWT Issues:');
    console.log('  - Check JWT_SECRET environment variable');
    console.log('  - Ensure JWT_SECRET is at least 32 characters long');
  }
  
  if (!apiOk) {
    console.log('\n🔧 API Issues:');
    console.log('  - Check server is running');
    console.log('  - Verify CORS configuration');
    console.log('  - Check authentication middleware');
  }
  
  if (!pollOk) {
    console.log('\n🔧 Poll Creation Issues:');
    console.log('  - Check server logs for specific errors');
    console.log('  - Verify Poll model validation');
    console.log('  - Check user authentication');
  }
  
  // Cleanup
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log('\n🔌 Database connection closed');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('  1. Fix any issues identified above');
  console.log('  2. Check server logs for additional error details');
  console.log('  3. Verify all environment variables are set correctly');
  console.log('  4. Test again with this script');
}

// Run the debug tests
runDebugTests().catch(console.error);
