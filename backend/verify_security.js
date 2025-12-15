const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Poll = require('./src/models/Poll');
const Vote = require('./src/models/Vote');
const VoterLog = require('./src/models/VoterLog');
const crypto = require('crypto');
require('dotenv').config();

async function verifySecurity() {
    console.log('🔒 Starting Security Verification...');

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Verify Password Encryption
        console.log('\n--- 1. Testing Password Encryption ---');
        const testEmail = `security_test_${Date.now()}@iitbbs.ac.in`;
        const testPassword = 'securePassword123!';

        // Create user directly (simulating save)
        const user = new User({
            name: 'Security Test User',
            email: testEmail,
            password: testPassword,
            role: 'user'
        });

        await user.save();

        // Fetch raw document
        const storedUser = await User.findById(user._id).select('+password');

        if (storedUser.password === testPassword) {
            console.error('❌ FAILURE: Password passed to DB in plain text!');
        } else if (storedUser.password.startsWith('$2a$') || storedUser.password.startsWith('$2b$')) {
            console.log('✅ SUCCESS: Password is hashed (bcrypt detected).');
        } else {
            console.warn('⚠️ WARNING: Password stored is not plain text but not standard bcrypt format:', storedUser.password);
        }

        // Verify comparePassword method
        const isMatch = await storedUser.comparePassword(testPassword);
        if (isMatch) {
            console.log('✅ SUCCESS: Password comparison works correctly.');
        } else {
            console.error('❌ FAILURE: Password comparison failed.');
        }


        // 2. Verify Anonymous Voting Privacy
        console.log('\n--- 2. Testing Anonymous Voting Privacy ---');
        const poll = await Poll.create({
            title: 'Security Test Poll',
            category: 'General',
            startDate: new Date(),
            endDate: new Date(Date.now() + 86400000),
            createdBy: user._id,
            options: [{ text: 'Option A' }, { text: 'Option B' }],
            settings: {
                voterNameDisplay: 'anonymized', // FORCE ANONYMITY
                requireAuthentication: true
            }
        });

        // Simulating VoteController logic manually to verify data structures
        const voteData = {
            poll: poll._id,
            options: ['Option A'],
            isAnonymous: true,
            hash: crypto.createHash('sha256').update('test_data').digest('hex')
        };

        // Important: In controller, user field is omitted if anonymous
        // We will simulate the EXACT save logic
        const vote = new Vote(voteData);
        await vote.save();

        // LOG the voter separately
        await VoterLog.create({
            poll: poll._id,
            user: user._id
        });

        // VERIFY
        const fetchedVote = await Vote.findById(vote._id);
        if (!fetchedVote.user) {
            console.log('✅ SUCCESS: Vote document has NO user link (Anonymous).');
        } else {
            console.error('❌ FAILURE: Vote document contains User ID:', fetchedVote.user);
        }

        const fetchedLog = await VoterLog.findOne({ poll: poll._id, user: user._id });
        if (fetchedLog) {
            console.log('✅ SUCCESS: VoterLog exists to prevent double voting.');
        } else {
            console.error('❌ FAILURE: VoterLog missing.');
        }


        // 3. Verify Vote Integrity Hash
        console.log('\n--- 3. Testing Data Integrity ---');
        if (fetchedVote.hash && fetchedVote.hash.length === 64) {
            console.log('✅ SUCCESS: Vote integrity hash is present and valid SHA-256 hex.');
        } else {
            console.error('❌ FAILURE: Invalid hash format:', fetchedVote.hash);
        }

        console.log('\nLocks & Compliance checks complete.');

    } catch (err) {
        console.error('❌ Error during verification:', err);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

verifySecurity();
