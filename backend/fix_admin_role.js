
const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./src/models/User');

const ADMIN_EMAIL = 'anuragverma08002@gmail.com';

const updateAdminRole = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const user = await User.findOne({ email: ADMIN_EMAIL });
        if (!user) {
            console.log('Admin user not found!');
        } else {
            console.log(`Found user: ${user.name}, Role: ${user.role}`);
            if (user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
                console.log('Successfully updated user role to ADMIN.');
            } else {
                console.log('User is already an ADMIN.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

updateAdminRole();
