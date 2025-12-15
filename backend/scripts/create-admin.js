const path = require('path');
const dotenv = require('dotenv');

// Load env vars immediately
dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User'); // Adjust path as needed

const createAdmin = async () => {
    try {
        const crypto = require('crypto');

        const args = process.argv.slice(2);
        const emailArg = args.find(arg => arg.startsWith('--email='));
        const passwordArg = args.find(arg => arg.startsWith('--password='));
        const nameArg = args.find(arg => arg.startsWith('--name='));

        if (!emailArg) {
            console.error('Usage: node scripts/create-admin.js --email=admin@example.com [ --password=securepassword ] [ --name="Admin Name" ]');
            process.exit(1);
        }

        const email = emailArg.split('=')[1];
        let password = passwordArg ? passwordArg.split('=')[1] : null;
        const name = nameArg ? nameArg.split('=')[1] : 'Super Admin';

        // Generate secure password if not provided
        if (!password) {
            const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
            const length = 16;
            password = "";

            // Ensure at least one of each required type
            password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)]; // Lower
            password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]; // Upper
            password += "0123456789"[Math.floor(Math.random() * 10)];             // Number
            password += "!@#$%^&*()_+"[Math.floor(Math.random() * 12)];           // Special

            // Fill the rest randomly
            for (let i = 0; i < length - 4; i++) {
                password += charset[Math.floor(Math.random() * charset.length)];
            }

            // Shuffle the password
            password = password.split('').sort(() => 0.5 - Math.random()).join('');

            console.log('\n----------------------------------------');
            console.log('⚠️  NO PASSWORD PROVIDED - GENERATING COMPLEX SECURE PASSWORD');
            console.log(`🔑  GENERATED PASSWORD: ${password}`);
            console.log('----------------------------------------\n');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User ${email} already exists. Updating role to admin...`);
            user.role = 'admin';
            user.name = name; // Update name if provided
            // If you want to update password:
            // user.password = password; 
            // But usually we don't want to accidentally overwrite passwords if user exists unless explicitly handled.
            // For this script, let's assume we might want to reset password if it's a seed script.
            // Let's explicitly save the password which triggers pre-save hash
            user.password = password;
            await user.save();
            console.log('User updated to Admin successfully.');
        } else {
            console.log(`Creating new admin user: ${email}`);
            user = await User.create({
                name,
                email,
                password,
                role: 'admin',
                status: 'active'
            });
            console.log('Admin user created successfully.');
            console.log(`\nlogin: ${email}`);
            console.log(`password: ${password}\n`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
