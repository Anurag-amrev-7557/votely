const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const User = require('./src/models/User');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const inspectUsers = async () => {
    await connectDB();

    const id1 = '693fa1154ad7a6484d7e5971';

    const user = await User.findById(id1);
    console.log(`Current Role: ${user.role}`);

    if (user.role !== 'admin') {
        console.log('Promoting to admin...');
        user.role = 'admin';
        await user.save();
        console.log('User is now an Admin.');
    } else {
        console.log('User is already an Admin.');
    }

    process.exit();
};

inspectUsers();
