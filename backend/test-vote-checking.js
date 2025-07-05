const mongoose = require('mongoose');
require('dotenv').config();

// Test configuration
const TEST_POLL_ID = '6868b928d1ffa1b37513e68c';
const TEST_USER_ID = '68689855a51e0c6d9c293288';

// Import models
const Vote = require('./src/models/Vote');
const Poll = require('./src/models/Poll');

async function testVoteChecking() {
  try {
    console.log('🔌 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to database');

    // Test 1: Check if vote exists with user field
    console.log('\n🔍 Test 1: Checking vote with user field...');
    const voteWithUser = await Vote.findOne({ 
      poll: TEST_POLL_ID, 
      user: TEST_USER_ID 
    }).lean();
    console.log('Vote with user field:', voteWithUser ? 'Found' : 'Not found');

    // Test 2: Check if vote exists without user field (fallback)
    console.log('\n🔍 Test 2: Checking vote without user field...');
    const voteWithoutUser = await Vote.findOne({ 
      poll: TEST_POLL_ID, 
      isAnonymous: false, 
      user: { $exists: false } 
    }).lean();
    console.log('Vote without user field:', voteWithoutUser ? 'Found' : 'Not found');

    // Test 3: Check poll settings
    console.log('\n🔍 Test 3: Checking poll settings...');
    const poll = await Poll.findById(TEST_POLL_ID).lean();
    console.log('Poll settings:', {
      voterNameDisplay: poll.settings?.voterNameDisplay,
      isAnonymous: poll.settings?.voterNameDisplay === 'anonymized'
    });

    // Test 4: Simulate batch vote check logic
    console.log('\n🔍 Test 4: Simulating batch vote check...');
    const votes = await Vote.find({
      user: TEST_USER_ID,
      poll: { $in: [TEST_POLL_ID] }
    }).lean();
    console.log('Batch vote check - found votes:', votes.length);

    // Test 5: Simulate fallback logic
    if (votes.length === 0) {
      console.log('No votes found with user field, checking fallback...');
      const fallbackVotes = await Vote.find({
        poll: { $in: [TEST_POLL_ID] },
        isAnonymous: false,
        user: { $exists: false }
      }).lean();
      console.log('Fallback votes found:', fallbackVotes.length);
    }

    console.log('\n🎉 Vote checking tests completed!');
    
    // Summary
    console.log('\n📊 Summary:');
    console.log('- Vote with user field:', voteWithUser ? '✅ Present' : '❌ Missing');
    console.log('- Vote without user field:', voteWithoutUser ? '⚠️ Present (needs fixing)' : '✅ None');
    console.log('- Poll anonymity:', poll.settings?.voterNameDisplay === 'anonymized' ? 'Anonymous' : 'Public');
    console.log('- Batch check result:', votes.length > 0 ? '✅ Found votes' : '❌ No votes found');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

testVoteChecking(); 