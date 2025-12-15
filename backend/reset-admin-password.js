const mongoose = require('mongoose');
const User = require('./src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: 'backend/.env' });

const ADMIN_EMAIL = 'anuragverma08002@gmail.com';
const NEW_PASSWORD = 'password123';

async function resetPassword() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const user = await User.findOne({ email: ADMIN_EMAIL });
        if (!user) {
            console.log('Admin user not found. Creating...');
            await User.create({
                name: 'Admin User',
                email: ADMIN_EMAIL,
                password: NEW_PASSWORD,
                role: 'admin'
            });
            console.log('Admin created.');
        } else {
            console.log('Admin user found. Updating password...');
            // Manually hash because findOneAndUpdate bypasses pre-save, 
            // but setting property and saving triggers pre-save.
            user.password = NEW_PASSWORD;
            await user.save();
            console.log('Password updated.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetPassword();
