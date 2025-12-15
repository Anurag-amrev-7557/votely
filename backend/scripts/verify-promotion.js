const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const ADMIN_EMAIL = 'admin@votely.com';
const ADMIN_PASSWORD = '4@XXrtQCeMU3fDn5'; // The credentials we just generated

async function verifyPromotion() {
    try {
        console.log('1. Logging in as System Admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });
        const adminToken = loginRes.data.token;
        console.log('✅ Admin logged in. Token acquired.');

        console.log('\n2. Registering a new "Normal User"...');
        const testUserEmail = `promo_test_${Date.now()}@iitbbs.ac.in`;
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Promotion Test User',
            email: testUserEmail,
            password: 'password123'
        });
        const userId = regRes.data._id;
        console.log(`✅ Normal User registered: ${testUserEmail} (ID: ${userId})`);

        console.log('\n3. Promoting Normal User to Admin via API...');
        // The endpoint is PUT /api/users/:id
        const promoteRes = await axios.put(
            `${API_URL}/users/${userId}`,
            { role: 'admin' },
            { headers: { Authorization: `Bearer ${adminToken}` } }
        );

        if (promoteRes.data.role === 'admin') {
            console.log('✅ Success! User role updated to:', promoteRes.data.role);
        } else {
            console.error('❌ Failed! User role is still:', promoteRes.data.role);
            return;
        }

        console.log('\n4. Verifying New Admin can access Admin Resource...');
        // Try to access a protected admin route using the NEW user's token? 
        // We'd need to login as the new user first to get their updated token with the admin role in it (if using JWT payload for role)
        // OR the system checks DB. Let's login as the new user.

        const newAdminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: testUserEmail,
            password: 'password123'
        });
        const newAdminToken = newAdminLogin.data.token;
        const newAdminRole = newAdminLogin.data.role;

        console.log('✅ Logged in as promoted user.');
        console.log('New User Role in Login Response:', newAdminRole);

        if (newAdminRole === 'admin') {
            console.log('🎉 VERIFICATION PASSED: User was successfully promoted to Admin.');
        } else {
            console.log('❌ VERIFICATION FAILED: User token does not reflect admin role.');
        }

    } catch (error) {
        console.error('❌ Error during verification:', error.response ? error.response.data : error.message);
    }
}

verifyPromotion();
