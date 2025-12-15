const axios = require('axios');
require('dotenv').config();

const API_URL = 'http://localhost:5001/api';
// Assuming server is running on 5000 from previous context

async function verifyRBAC() {
    console.log('Starting RBAC Verification...');

    try {
        // 1. Register/Login as a Standard User
        const userEmail = 'stduser@iitbbs.ac.in';
        const userPass = 'UserPASS@123';

        // Attempt login first
        let userToken;
        try {
            const loginRes = await axios.post(`${API_URL}/auth/login`, {
                email: userEmail,
                password: userPass
            });
            userToken = loginRes.data.token;
            console.log('✅ Standard User Logged In');
        } catch (e) {
            // If fail, try register
            try {
                const regRes = await axios.post(`${API_URL}/auth/register`, {
                    name: 'Standard User',
                    email: userEmail,
                    password: userPass
                });
                userToken = regRes.data.token;
                console.log('✅ Standard User Registered');
            } catch (regErr) {
                console.error('❌ Failed to login/register standard user:', regErr.message);
                if (regErr.response) console.error('   Response Data:', regErr.response.data);
                return;
            }
        }

        // 2. Register/Login as Admin (using the root email env var logic or existing)
        // We can't easily register the admin if it already exists with a password we don't know unless we use the hardcoded one I saw?
        // The hardcoded one was 'anuragverma08002@gmail.com'. Use a dummy password if I can't know it.
        // Actually, I can't assume I know the admin password.
        // But I can verification NEGATIVE test: User CANNOT create poll.

        console.log('\n--- Test 1: Standard User creating Poll ---');
        try {
            await axios.post(`${API_URL}/polls`, {
                title: 'Unauthorized Poll',
                question: 'Should this exist?',
                options: ['Yes', 'No'],
                category: 'General',
                startTime: new Date(),
                endTime: new Date(Date.now() + 86400000)
            }, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            console.error('❌ FAILURE: Standard User was able to create a poll! RBAC not working.');
        } catch (error) {
            if (error.response && error.response.status === 403) {
                console.log('✅ SUCCESS: Standard User blocked from creating poll (403 Forbidden).');
                // Check error message content if possible
                console.log('   Response:', error.response.data);
            } else {
                console.error(`❌ UNEXPECTED: Failed with status ${error.response ? error.response.status : 'unknown'}`, error.message);
            }
        }

    } catch (err) {
        console.error('Verification script error:', err);
    }
}

verifyRBAC();
