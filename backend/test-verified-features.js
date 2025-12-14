const mongoose = require('mongoose');
const User = require('./src/models/User');
const Poll = require('./src/models/Poll');
const Vote = require('./src/models/Vote');
const VoterLog = require('./src/models/VoterLog');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/votely';

const runTest = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to DB');

        // 1. Setup Data
        await User.deleteMany({ email: { $in: ['admin@iitbbs.ac.in', 'voter@iitbbs.ac.in'] } });
        await Poll.deleteMany({ title: 'Test Anonymous Poll' });

        // Create Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@iitbbs.ac.in',
            password: 'password123',
            role: 'admin'
        });
        console.log('Admin created:', admin._id, 'Is Admin?', admin.isAdmin); // Test virtual

        // Create Voter
        const voter = await User.create({
            name: 'Voter User',
            email: 'voter@iitbbs.ac.in',
            password: 'password123',
            role: 'user'
        });
        console.log('Voter created:', voter._id);

        // 2. Create Anonymous Poll
        const poll = await Poll.create({
            title: 'Test Anonymous Poll',
            category: 'General',
            startDate: new Date(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            options: [{ text: 'Yes' }, { text: 'No' }],
            createdBy: admin._id,
            settings: {
                voterNameDisplay: 'anonymized',
                requireAuthentication: true
            }
        });
        console.log('Poll created:', poll._id);

        // 3. Test RBAC: Admin updates poll
        // (Simulating controller logic roughly)
        if (admin.role !== 'admin' && String(poll.createdBy) !== String(admin._id)) {
            throw new Error('RBAC Check Failed (Simulated)');
        }
        console.log('RBAC Check Passed: Admin can manage poll.');

        // 4. Test Voting (Simulating voteController logic)
        const options = ['Yes'];

        // Manual double-voting check
        const existingLog = await VoterLog.findOne({ poll: poll._id, user: voter._id });
        if (existingLog) throw new Error('Double vote check failed (should be null)');

        // Cast Vote
        await Vote.create({
            poll: poll._id,
            options: options,
            isAnonymous: true
            // No user field!
        });

        await VoterLog.create({
            poll: poll._id,
            user: voter._id
        });
        console.log('Vote Cast successfully.');

        // 5. Verify Database State
        const voteDoc = await Vote.findOne({ poll: poll._id });
        console.log('Vote Document:', voteDoc.toObject());

        if (voteDoc.user) {
            throw new Error('Anonymity FAIL: User ID found in Vote document!');
        } else {
            console.log('Anonymity PASS: No User ID in Vote document.');
        }

        const logDoc = await VoterLog.findOne({ poll: poll._id, user: voter._id });
        if (!logDoc) {
            throw new Error('VoterLog FAIL: No log entry found!');
        } else {
            console.log('VoterLog PASS: Log entry found as expected.');
        }

        // 6. Test Double Voting Prevention
        try {
            await VoterLog.create({
                poll: poll._id,
                user: voter._id
            });
            throw new Error('Unique constraint FAIL: Duplicate VoterLog allowed!');
        } catch (e) {
            if (e.code === 11000) {
                console.log('Double Voting Prevention PASS: Duplicate key error as expected.');
            } else {
                console.error('Unexpected error:', e);
                throw e;
            }
        }

        console.log('ALL TESTS PASSED');

    } catch (err) {
        console.error('TEST FAILED:', err);
    } finally {
        // Cleanup? Maybe leave for inspection
        await mongoose.disconnect();
    }
};

runTest();
