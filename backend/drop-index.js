const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Drop the index
        try {
            await mongoose.connection.collection('users').dropIndex('googleId_1');
            console.log('Dropped index googleId_1');
        } catch (e) {
            console.log('Index googleId_1 might not exist or failed to drop:', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

connectDB();
