const axios = require('axios');

async function createActivePoll() {
    console.log('--- Creating Active Poll ---');
    try {
        // Need to be authenticated to create a poll usually? 
        // Let's check pollRoutes.js -> router.post('/', auth.protect, ...);
        // Yes. So we need a token.
        // Let's first register/login a user "admin@iitbbs.ac.in".

        const email = 'admin@iitbbs.ac.in';
        const password = 'password123';

        // 1. Register/Login
        let token;
        try {
            await axios.post('http://localhost:5001/api/auth/register', {
                name: 'Admin User',
                email,
                password
            });
            console.log('Registered admin user.');
        } catch (e) {
            // If already exists, try login
            console.log('User might actally exist, trying login...');
        }

        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email,
            password
        });
        token = loginRes.data.token;
        console.log('Logged in, got token.');

        // 2. Create Poll
        const pollData = {
            title: 'Test Active Poll',
            description: 'Testing result privacy',
            category: 'Testing',
            startDate: new Date(Date.now() + 3000), // 3 seconds in future
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            options: [
                { text: 'Option A' },
                { text: 'Option B' }
            ],
            settings: {
                showResultsBeforeEnd: false
            }
        };

        const createRes = await axios.post('http://localhost:5001/api/polls', pollData, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('✅ Active poll created:', createRes.data._id);

        console.log('Waiting 5 seconds for poll to become active...');
        await new Promise(resolve => setTimeout(resolve, 5000));


    } catch (error) {
        console.error('❌ Failed to create poll:', error.response ? error.response.data : error.message);
    }
}

createActivePoll();
