const axios = require('axios');

async function testAuthRestriction() {
    console.log('--- Testing Auth Restriction ---');

    const validEmail = 'student@iitbbs.ac.in';
    const invalidEmail = 'hacker@gmail.com';
    const password = 'password123';

    // Test Invalid Registration
    try {
        console.log(`[1] Attempting registration with ${invalidEmail}...`);
        await axios.post('http://localhost:5001/api/auth/register', {
            name: 'Hacker',
            email: invalidEmail,
            password
        });
        console.error('❌ FAILED: Registration with gmail should have failed.');
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.error.includes('@iitbbs.ac.in')) {
            console.log('✅ PASSED: Registration blocked correctly.');
        } else {
            console.error('❌ FAILED: Unexpected error:', JSON.stringify(error.response ? error.response.data : error.message, null, 2));
        }
    }

    // Test Valid Registration (Dry Run - don't actually spam DB if possible, or just expect it to proceed past domain check)
    // For this test, we just want to ensure it DOESN'T fail with domain error.
    // We can assume if it fails with "User already exists" or succeeds, the domain check passed.
}

testAuthRestriction();
