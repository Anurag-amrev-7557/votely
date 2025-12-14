const axios = require('axios');

const API_URL = 'http://localhost:5001/api/auth';

async function testAuth() {
    console.log('--- Starting Auth Tests ---');
    console.log(`Target URL: ${API_URL}`);

    const uniqueId = Date.now();
    const testUser = {
        name: 'Test User',
        email: `test${uniqueId}@example.com`,
        password: 'password123'
    };

    try {
        // 1. Register
        console.log(`\n1. Testing Register with ${testUser.email}...`);
        const regRes = await axios.post(`${API_URL}/register`, testUser);

        const regData = regRes.data;
        console.log('✅ Register Success:', regData.email);
        const token = regData.token;

        // 2. Login
        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });

        const loginData = loginRes.data;
        console.log('✅ Login Success:', loginData.email);

        // 3. Get Me
        console.log('\n3. Testing Get Me (Protected Route)...');
        const meRes = await axios.get(`${API_URL}/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const meData = meRes.data;
        console.log('✅ Get Me Success:', meData.email);

        console.log('\n--- All Tests Passed ---');

    } catch (error) {
        console.error('\n❌ Test Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else if (error.request) {
            console.error('No response received (Connection refused/timeout?)');
            console.error('Code:', error.code);
            console.error('Message:', error.message);
        } else {
            console.error('Error:', error.message);
        }
        process.exit(1);
    }
}

testAuth();
