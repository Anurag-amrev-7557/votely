const path = require('path');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const User = require('../src/models/User'); // Adjust path as needed
const { hash } = require('../src/utils/cryptoUtils');

const cleanupAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const targetEmail = 'admin@votely.com';
        const targetHash = hash(targetEmail.toLowerCase());

        console.log(`Searching for duplicates with hash: ${targetHash}`);

        // Find ALL users with this hash
        const users = await User.find({ emailHash: targetHash });

        console.log(`Found ${users.length} users with email ${targetEmail}`);

        if (users.length > 0) {
            console.log('Deleting found users...');
            const result = await User.deleteMany({ emailHash: targetHash });
            console.log(`Deleted ${result.deletedCount} users.`);
        } else {
            console.log('No users found to delete.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

cleanupAdmins();
