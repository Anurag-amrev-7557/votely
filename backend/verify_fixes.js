require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User'); // Adjust path as needed
// const { expect } = require('chai'); // Removed dep

const API_URL = 'http://localhost:5001/api';
// Assuming you have a way to get a valid token, or we can mock/bypass for this tailored script
// validToken should be obtained by running the frontend or a separate login check provided we have a seeded user.
// For this script, we'll try to register users which is public.

// We will use a unique run ID to avoid collisions
const RUN_ID = Math.floor(Math.random() * 100000);

async function runTests() {
    console.log('--- Starting Verification Script ---');

    // Connect to DB to promote user
    if (process.env.MONGO_URI) {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(' [INFO] Connected to DB for setup');
    } else {
        console.warn(' [WARN] No MONGO_URI, relying on existing admin or failing');
    }

    let token;

    // 1. ID Validation Test
    console.log('\n[Test 1] ID Validation (Auth)');
    try {
        const invalidIdEmail = `coolguy${RUN_ID}@iitbbs.ac.in`;
        console.log(` Attempting registration with invalid ID: ${invalidIdEmail}`);
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Attacker',
            email: invalidIdEmail,
            password: 'password123'
        });
        console.error(' [FAIL] Registration should have failed but succeeded.');
    } catch (err) {
        if (err.response) {
            if (err.response.data.error && err.response.data.error.includes('Invalid Student ID Format')) {
                console.log(' [PASS] Registration failed as expected with correct error.');
            } else {
                console.error(' [FAIL] Unexpected error message:', JSON.stringify(err.response.data));
            }
        } else {
            console.error(' [FAIL] Network/Server error:', err.message);
        }
    }

    // 2. Optimistic Locking Test
    console.log('\n[Test 2] Concurrency / Optimistic Locking (Polls)');

    try {
        // Register valid user
        const adminEmail = `s18cs${RUN_ID}@iitbbs.ac.in`;
        const registerRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Admin',
            email: adminEmail,
            password: 'password123'
        });
        const userId = registerRes.data._id;

        // Promote to Admin
        await User.findByIdAndUpdate(userId, { role: 'admin' });
        console.log(' [INFO] Promoted user to Admin via DB');

        // Login again or just use token (role might be embedded in token but permission checked on DB? 
        // Usually middleware checks DB or decoded token. If token, we need to re-login to get new token with admin role)

        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: 'password123'
        });
        token = loginRes.data.token;
        console.log(' [INFO] Logged in with Admin Token');

        // Create a poll
        const pollRes = await axios.post(`${API_URL}/polls`, {
            title: `Concurrency Test Poll ${RUN_ID}`,
            description: 'Testing locking',
            category: 'General',
            startDate: new Date(Date.now() + 10 * 60 * 1000),
            endDate: new Date(Date.now() + 86400000),
            options: [{ text: 'Opt 1' }, { text: 'Opt 2' }]
        }, { headers: { Authorization: `Bearer ${token}` } });

        const pollId = pollRes.data._id;
        const initialVersion = pollRes.data.__v || 0;
        console.log(` [INFO] Created Poll ${pollId} (Avail Version: ${initialVersion})`);

        // Simulate Client A (The Winner)
        await axios.put(`${API_URL}/polls/${pollId}`, {
            title: `Concurrency Test Poll ${RUN_ID} - UPDATED`,
            description: 'Testing locking',
            category: 'General',
            startDate: new Date(Date.now() + 10 * 60 * 1000),
            endDate: new Date(Date.now() + 86400000),
            options: [{ text: 'Opt 1' }, { text: 'Opt 2' }],
            version: initialVersion
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log(' [INFO] Client A updated poll successfully.');

        // Simulate Client B (The Loser) using OLD version
        try {
            await axios.put(`${API_URL}/polls/${pollId}`, {
                title: `Concurrency Test Poll ${RUN_ID} - CONFLICT`,
                description: 'Should fail',
                category: 'General',
                startDate: new Date(Date.now() + 10 * 60 * 1000),
                endDate: new Date(Date.now() + 86400000),
                options: [{ text: 'Opt 1' }, { text: 'Opt 2' }],
                version: initialVersion
            }, { headers: { Authorization: `Bearer ${token}` } });
            console.error(' [FAIL] Client B update should have failed to 409 Conflict.');
        } catch (conflictErr) {
            if (conflictErr.response && conflictErr.response.status === 409) {
                console.log(' [PASS] Client B blocked with 409 Conflict as expected.');
            } else {
                console.error(' [FAIL] Unexpected error for Client B:', conflictErr.response ? conflictErr.response.data : conflictErr.message);
            }
        }

    } catch (err) {
        console.error(' [ERROR] Setup failed:', err.message, err.response ? err.response.data : '');
    } finally {
        await mongoose.disconnect();
    }

}

runTests();
