const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const { hash, encrypt, decrypt } = require('./src/utils/cryptoUtils');

const UserSchema = new mongoose.Schema({
    email: String,
    emailHash: String,
    role: String,
    password: { type: String, select: true }
});
const User = mongoose.model('User', UserSchema); // Minimal schema to avoid hooks interfering with read

const debugUser = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const email = 'harrypotter08002@gmail.com';
        const hashedEmail = hash(email.toLowerCase());

        console.log(`\nSearching for email: ${email}`);
        console.log(`Computed Hash: ${hashedEmail}`);

        // Check by Hash (Login Flow)
        const userByHash = await User.findOne({ emailHash: hashedEmail });
        console.log('\n--- FIND BY HASH ---');
        console.log(userByHash ? `Found User: ${userByHash._id}` : 'User NOT found by hash');
        if (userByHash) {
            console.log('Stored Email (Raw):', userByHash.email);
            console.log('Stored Role:', userByHash.role);
            console.log('Has Password:', !!userByHash.password);
        }

        // Check by Plaintext (Fix Script Flow - likely failed if encrypted)
        const userByPlain = await User.findOne({ email: email });
        console.log('\n--- FIND BY PLAINTEXT ---');
        console.log(userByPlain ? `Found User: ${userByPlain._id}` : 'User NOT found by plaintext');

        // Check by Encrypted (If manually encrypted)
        // Note: encrypt() uses random IV so we can't search by it deterministically 
        // unless we built the query incorrectly.

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDisconnected.');
    }
};

debugUser();
