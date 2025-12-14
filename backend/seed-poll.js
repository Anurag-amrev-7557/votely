const mongoose = require('mongoose');
const Poll = require('./src/models/Poll');
const User = require('./src/models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedPoll = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://votely-user:votely-pass@cluster0.klfdgwz.mongodb.net/?retryWrites=true&w=majority&appName=Votely');
        console.log('DB Connected');

        // Find User
        const user = await User.findOne({ email: 'force.test@iitbbs.ac.in' });
        if (!user) { throw new Error('User not found'); }

        // Create Poll
        const poll = await Poll.create({
            title: 'Integrity Test Poll',
            description: 'Testing hash chain',
            category: 'Test',
            createdBy: user._id, // Add creator
            startDate: new Date(),
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            options: [{ text: 'Yes' }, { text: 'No' }],
            status: 'active',
            settings: {
                requireAuthentication: true,
                voterNameDisplay: 'public'
            }
        });

        console.log('POLL_ID:', poll._id.toString());
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedPoll();
