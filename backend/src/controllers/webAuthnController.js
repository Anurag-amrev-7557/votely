const {
    generateRegistrationOptions,
    verifyRegistrationResponse,
    generateAuthenticationOptions,
    verifyAuthenticationResponse,
} = require('@simplewebauthn/server');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { hash, decrypt } = require('../utils/cryptoUtils');

// Configuration
const rpName = 'Votely Admin';
const rpID = process.env.RP_ID || 'localhost'; // Should be your domain name e.g. 'votely.com' (no port, no protocol)
const origin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

/**
 * @desc    Get registration options
 * @route   GET /api/auth/webauthn/register/options
 */
const getRegistrationOptions = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const passkeys = user.passkeys || [];
        // Debug logging
        // console.log('Current Passkeys:', JSON.stringify(passkeys, null, 2));

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(user._id.toString())),
            userName: user.email,
            // Don't allow user to register same device twice
            excludeCredentials: passkeys
                .filter(key => key.credentialID) // Filter out any corrupted keys missing ID
                .map(key => ({
                    id: key.credentialID,
                    type: 'public-key',
                    transports: key.transports,
                })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform', // TouchID/FaceID prefer this
            },
        });

        // Save challenge temporarily
        user.currentChallenge = options.challenge;
        await user.save();

        res.json(options);
    } catch (error) {
        console.error('Detailed WebAuthn Reg Options Error:', error);
        // Respond with actual error for debugging (in dev)
        res.status(500).json({ error: error.message, stack: error.stack });
    }
};

/**
 * @desc    Verify registration response
 * @route   POST /api/auth/webauthn/register/verify
 */
const verifyRegistration = async (req, res) => {
    try {
        const { body } = req;
        const user = await User.findById(req.user._id);
        console.log(`[Reg Verify] Attempting for User ID: ${req.user._id}, Email: ${user.email}`);

        if (!user || !user.currentChallenge) {
            return res.status(400).json({ error: 'User or challenge not found' });
        }

        let verification;
        try {
            verification = await verifyRegistrationResponse({
                response: body,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                requireUserVerification: false, // Allow UP only
            });
        } catch (error) {
            console.error('Verification failed:', error);
            return res.status(400).json({ error: error.message });
        }

        const { verified, registrationInfo } = verification;

        if (verified && registrationInfo) {
            console.log('Registration Info Debug:', registrationInfo); // DEBUG LOG

            const newPasskey = {
                // Determine source of credential data
                // In v13, it seems to be in registrationInfo.credential
                credentialID: registrationInfo.credential && registrationInfo.credential.id
                    ? registrationInfo.credential.id // It's likely already a string if coming from json? verify log said 'y49...' which is string
                    : body.id,
                credentialPublicKey: registrationInfo.credential && registrationInfo.credential.publicKey
                    ? Buffer.from(registrationInfo.credential.publicKey).toString('base64url')
                    : '',
                counter: (registrationInfo.credential && registrationInfo.credential.counter) || 0,
                transports: registrationInfo.credential && registrationInfo.credential.transports
                    ? registrationInfo.credential.transports
                    : body.response.transports,
                deviceType: registrationInfo.credentialDeviceType,
                backedUp: registrationInfo.credentialBackedUp,
            };

            user.passkeys.push(newPasskey);
            user.currentChallenge = undefined; // clear challenge
            await user.save();
            console.log(`[Reg Verify] Saved Passkey. Total keys: ${user.passkeys.length}`);

            res.json({ verified: true });
        } else {
            res.status(400).json({ verified: false, error: 'Verification failed' });
        }

    } catch (error) {
        console.error('WebAuthn Reg Verify Error:', error);
        res.status(500).json({ error: 'Server error during verification' });
    }
};

/**
 * @desc    Get authentication options (login)
 * @route   POST /api/auth/webauthn/login/options
 * Note: Should require email if username-based, but cleaner if we just ask "who are you"
 */
const getAuthenticationOptions = async (req, res) => {
    try {
        const { email } = req.body;
        // This endpoint is generally public to start login flow
        // Use emailHash for lookup because email is encrypted
        const user = await User.findOne({ emailHash: hash(email.toLowerCase()) });

        if (user) {
            console.log(`[Auth Options] Found User ID: ${user._id} for email: ${email}`);
            console.log(`[Auth Options] Passkeys count: ${user.passkeys ? user.passkeys.length : 0}`);
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const options = await generateAuthenticationOptions({
            rpID,
            allowCredentials: user.passkeys
                .filter(key => key.credentialID) // Safely filter invalid keys
                .map(passkey => ({
                    id: passkey.credentialID,
                    transports: passkey.transports,
                })),
            userVerification: 'preferred',
        });

        user.currentChallenge = options.challenge;
        await user.save();

        res.json(options);
    } catch (error) {
        console.error('WebAuthn Auth Options Error:', error);
        res.status(500).json({ error: 'Could not generate authentication options' });
    }
};

/**
 * @desc    Verify authentication (login)
 * @route   POST /api/auth/webauthn/login/verify
 */
const verifyAuthentication = async (req, res) => {
    try {
        const { email, output } = req.body;
        // Use emailHash for lookup
        const user = await User.findOne({ emailHash: hash(email.toLowerCase()) }).select('+password');

        if (!user || !user.currentChallenge) {
            return res.status(400).json({ error: 'Invalid login attempt' });
        }

        const passkey = user.passkeys.find(key => key.credentialID === output.id);

        if (!passkey) {
            console.error('Passkey mismatch debug:');
            console.error('Received ID:', output.id);
            console.error('Stored IDs:', user.passkeys.map(k => k.credentialID));
            return res.status(400).json({ error: 'Passkey not found for this user' });
        }

        let verification;
        try {
            verification = await verifyAuthenticationResponse({
                response: output,
                expectedChallenge: user.currentChallenge,
                expectedOrigin: origin,
                expectedRPID: rpID,
                credential: {
                    id: passkey.credentialID,
                    publicKey: Buffer.from(passkey.credentialPublicKey, 'base64url'),
                    counter: passkey.counter || 0,
                    transports: passkey.transports,
                },
                requireUserVerification: false, // Allow UP only
            });
        } catch (error) {
            console.error('Auth Verification Error:', error);
            return res.status(400).json({ error: error.message });
        }

        const { verified, authenticationInfo } = verification;

        if (verified) {
            // Update counter
            passkey.counter = authenticationInfo.newCounter;
            user.currentChallenge = undefined;
            await user.save();

            // Successful login!
            res.json({
                _id: user.id,
                name: user.name,
                email: decrypt(user.email), // Ensure decrypted email is sent
                role: user.role,
                profilePhoto: user.profilePhoto,
                token: generateToken(user._id),
            });
        } else {
            console.error('WebAuthn Verification Failed:', verification);
            res.status(400).json({ verified: false, error: 'Authentication failed' });
        }
    } catch (error) {
        console.error('WebAuthn Auth Verify Error:', error);
        res.status(500).json({ error: 'Server error during authentication', details: error.message });
    }
};

module.exports = {
    getRegistrationOptions,
    verifyRegistration,
    getAuthenticationOptions,
    verifyAuthentication
};
