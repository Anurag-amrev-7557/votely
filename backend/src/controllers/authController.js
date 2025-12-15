const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { hash } = require('../utils/cryptoUtils');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Please add all fields' });
        }

        // Restrict to IIT BBS domain (allow admin email exception)
        const ADMIN_EMAIL = 'anuragverma08002@gmail.com';
        if (!email.toLowerCase().endsWith('@iitbbs.ac.in') && email !== ADMIN_EMAIL) {
            return res.status(400).json({ error: 'Only @iitbbs.ac.in emails are allowed.' });
        }

        // Check if user exists
        const userExists = await User.findOne({ emailHash: hash(email.toLowerCase()) });

        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create user
        // Password hashing is handled in User model pre-save hook
        const Role = email === ADMIN_EMAIL ? 'admin' : 'user';
        const user = await User.create({
            name,
            email,
            password,
            role: Role
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: email, // Return plaintext email
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const ADMIN_EMAIL = 'anuragverma08002@gmail.com';

        // Check for user email
        const user = await User.findOne({ emailHash: hash(email.toLowerCase()) }).select('+password');

        if (user && (await bcrypt.compare(password, user.password))) {
            // Auto-fix: Ensure admin email always has admin role
            if (email === ADMIN_EMAIL && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }

            res.json({
                _id: user.id,
                name: user.name,
                email: email, // Return plaintext email
                role: user.role,
                profilePhoto: user.profilePhoto,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

const crypto = require('crypto');
const { sendMagicLinkEmail } = require('../utils/emailService');

// @desc    Request Magic Link (Login/Register)
// @route   POST /api/auth/magic-link
// @access  Public
const requestMagicLink = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Please provide an email address' });
        }

        // 1. Strict Domain Enforcement
        const ADMIN_EMAIL = 'anuragverma08002@gmail.com';
        if (!email.toLowerCase().endsWith('@iitbbs.ac.in') && email !== ADMIN_EMAIL) {
            // Security via obscurity: Don't explicitly say "Domain not allowed" to prevent enumeration?
            // "The Professional Approach": Strict feedback is better for internal corporate apps, less for public.
            // Given this is internal IIT, explicit error is helpful.
            return res.status(400).json({ error: 'Access restricted to @iitbbs.ac.in email addresses.' });
        }

        // 2. Find or Create User (Shadow Account until verified?)
        // For simplicity: We verify existence. If new, we'll create roughly on verify or now?
        // Better: Find user. If not found, create a "pending" user or just wait?
        // Let's Find or Create Staging User.
        let user = await User.findOne({ emailHash: hash(email.toLowerCase()) });

        if (!user) {
            user = await User.create({
                name: email.split('@')[0], // Placeholder name
                email,
                role: 'user',
                isVerified: false
            });
        }

        // 3. Generate Token
        // "The Tech": Hash the token before storing.
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 4. Save Token to User
        user.magicLinkToken = hashedToken;
        user.magicLinkExpires = Date.now() + 15 * 60 * 1000; // 15 Minutes
        await user.save();

        // 5. Send Email
        // Construct Link: frontend_url/login/verify?token=...
        // We need the Frontend URL.
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const magicLink = `${frontendUrl}/login/verify?token=${resetToken}&email=${email}`;

        try {
            await sendMagicLinkEmail(email, magicLink);
            res.status(200).json({ success: true, message: 'Magic link sent to your email.' });
        } catch (emailError) {
            user.magicLinkToken = undefined;
            await user.save();
            return res.status(500).json({ error: 'Email could not be sent', details: emailError.message });
        }

    } catch (error) {
        console.error('Magic Link Request Error:', error);
        res.status(500).json({ error: 'Server error processing request' });
    }
};

// @desc    Verify Magic Link and Login
// @route   POST /api/auth/magic-link/verify
// @access  Public
const verifyMagicLink = async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ error: 'Invalid link parameters' });
        }

        // 1. Hash the token to compare
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // 2. Find user with valid token
        const user = await User.findOne({
            emailHash: hash(email.toLowerCase()),
            magicLinkToken: hashedToken,
            magicLinkExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired link' });
        }

        // 3. Mark verified and cleared token
        user.isVerified = true;
        user.magicLinkToken = undefined;
        user.magicLinkExpires = undefined;
        // If name was placeholder, maybe we keep it until they update profile?
        await user.save();

        // 4. Issue JWT
        res.json({
            _id: user.id,
            name: user.name,
            email: email, // Return plaintext email
            role: user.role,
            profilePhoto: user.profilePhoto,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Magic Link Verify Error:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};


// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Google auth
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { name, email, picture, sub: googleId } = ticket.getPayload();

        // Restrict to IIT BBS domain
        const ADMIN_EMAIL = 'anuragverma08002@gmail.com';
        if (!email.toLowerCase().endsWith('@iitbbs.ac.in') && email !== ADMIN_EMAIL) {
            return res.status(400).json({ error: 'Only @iitbbs.ac.in emails are allowed.' });
        }

        // Check if user exists by Google ID first (Primary lookup)
        let user = await User.findOne({ googleId });

        if (user) {
            // User found by Google ID - Update profile photo if missing
            if (!user.profilePhoto) {
                user.profilePhoto = picture;
                await user.save();
            }
        } else {
            // If not found by Google ID, check by Email (Account Linking)
            user = await User.findOne({ emailHash: hash(email.toLowerCase()) });

            if (user) {
                // If user exists but no googleId (registered via email/password), link it
                if (!user.googleId) {
                    user.googleId = googleId;
                    user.profilePhoto = user.profilePhoto || picture; // Update photo if missing
                    await user.save();
                }
            } else {
                // Create new user
                // Generate a random password for google users
                const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

                user = await User.create({
                    name,
                    email,
                    password: randomPassword,
                    googleId,
                    profilePhoto: picture,
                    isVerified: true // Google emails are verified
                });
            }
        }

        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: email, // Return plaintext email
            role: user.role,
            profilePhoto: user.profilePhoto,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(400).json({ error: 'Google authentication failed' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    requestMagicLink,
    verifyMagicLink,
    getMe,
    googleAuth
};
