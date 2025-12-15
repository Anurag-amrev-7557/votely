const axios = require('axios');

const API_URL = 'http://localhost:5001/api';
const ADMIN_EMAIL = 'anuragverma08002@gmail.com';
const STUDENT_EMAIL = 'student@iitbbs.ac.in';

async function verifyNomination() {
    console.log('🚀 Starting Nomination Verification...');

    try {
        // --- 1. AUTHENTICATION ---
        console.log('\n🔐 1. Authenticating...');
        let adminToken, studentToken;

        // Admin
        const adminRes = await axios.post(`${API_URL}/auth/login`, {
            email: ADMIN_EMAIL,
            password: 'password123'
        });
        adminToken = adminRes.data.token;
        console.log('   ✅ Admin Logged In');

        // Student
        const studentRes = await axios.post(`${API_URL}/auth/login`, {
            email: STUDENT_EMAIL,
            password: 'password123'
        });
        studentToken = studentRes.data.token;
        console.log('   ✅ Student Logged In');

        // --- 2. POLL CREATION (for Nomination) ---
        console.log('\n🗳️  2. Creating Poll for Nomination...');
        const pollData = {
            title: `Nomination Test Poll ${Date.now()}`,
            description: 'Test Poll',
            category: 'Election',
            startDate: new Date(Date.now() + 100000), // Upcoming
            endDate: new Date(Date.now() + 200000),
            options: [
                { text: 'Placeholder', description: 'Placeholder' },
                { text: 'Placeholder 2', description: 'Placeholder 2' }
            ],
            settings: {
                allowMultipleVotes: false
            }
        };

        const pollRes = await axios.post(`${API_URL}/polls`, pollData, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        const pollId = pollRes.data._id;
        console.log(`   ✅ Poll Created: ${pollId}`);

        // --- 3. APPLY FOR NOMINATION ---
        console.log('\n📝 3. Student Applying for Nomination...');
        const nominationData = {
            pollId: pollId,
            position: 'President',
            manifesto: '# My Manifesto\nI promise to code better.',
            sopUrl: 'http://example.com/sop.pdf'
        };

        const applyRes = await axios.post(`${API_URL}/nominations/apply`, nominationData, {
            headers: { Authorization: `Bearer ${studentToken}` }
        });

        const nominationId = applyRes.data.nomination._id;
        console.log(`   ✅ Application Successful! Nomination ID: ${nominationId}`);

        // --- 4. ADMIN LIST NOMINATIONS ---
        console.log('\n📋 4. Admin Listing Nominations...');
        const listRes = await axios.get(`${API_URL}/nominations/poll/${pollId}`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });

        const found = listRes.data.nominations.find(n => n._id === nominationId);
        if (found) {
            console.log(`   ✅ Admin sees the nomination for ${found.candidate.name}`);
        } else {
            console.error('   ❌ Admin cannot see the nomination');
        }

        // --- 5. APPROVE NOMINATION ---
        console.log('\n✅ 5. Admin Approving Nomination...');
        await axios.put(`${API_URL}/nominations/${nominationId}/status`, {
            status: 'approved',
            adminComments: 'Good manifesto'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('   ✅ Nomination Approved');

        // --- 6. VERIFY POLL OPTIONS UPDATED ---
        console.log('\n👀 6. Verifying Poll Options...');
        const updatedPollRes = await axios.get(`${API_URL}/polls/${pollId}`);
        const newOption = updatedPollRes.data.options.find(o => o.text === 'Student User'); // Name of student

        if (newOption) {
            console.log(`   ✅ Poll now contains option: ${newOption.text}`);
            console.log(`      Description (Manifesto): ${newOption.description}`);
        } else {
            console.error('   ❌ Poll does not contain the approved candidate!');
        }

    } catch (error) {
        console.error('\n❌ Verification Failed');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Error:', error.message);
        }
    }
}

verifyNomination();
