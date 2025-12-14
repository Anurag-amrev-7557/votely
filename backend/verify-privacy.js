const axios = require('axios');

async function verifyPrivacy() {
    console.log('--- Verifying Poll Privacy ---');
    try {
        const email = 'admin@iitbbs.ac.in';
        const password = 'password123';

        // 1. Login
        let token;
        try {
            await axios.post('http://localhost:5001/api/auth/register', { name: 'Admin', email, password });
        } catch (e) { }
        const loginRes = await axios.post('http://localhost:5001/api/auth/login', { email, password });
        token = loginRes.data.token;

        // 2. Create Poll (Start in future to pass validation)
        const pollData = {
            title: 'Privacy Check Poll Fixed',
            description: 'Testing privacy',
            category: 'Testing',
            startDate: new Date(Date.now() + 2000), // Start in 2s
            endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
            options: [{ text: 'Yes' }, { text: 'No' }],
            settings: { showResultsBeforeEnd: false }
        };

        const createRes = await axios.post('http://localhost:5001/api/polls', pollData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const pollId = createRes.data._id;
        console.log(`Poll created: ${pollId}. Waiting 4s for activation...`);

        await new Promise(resolve => setTimeout(resolve, 4000));

        // 3. Vote (to ensure there is data to hide)
        await axios.post('http://localhost:5001/api/votes/vote', {
            pollId,
            options: ['Yes']
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        console.log('Vote cast.');

        // 4. Verify Results Privacy
        const resultsRes = await axios.get(`http://localhost:5001/api/polls/${pollId}/results`);
        const options = resultsRes.data.options;
        const status = resultsRes.data.status;

        console.log(`Poll Status validation: ${status}`);

        if (status === 'active') {
            if (options[0].count === undefined && options[0].percent === undefined) {
                console.log('✅ PASSED: Count and Percent are HIDDEN for active poll.');
            } else {
                console.error(`❌ FAILED: Data leaked! Count: ${options[0].count}`);
            }
        } else {
            console.log('⚠️ SKIPPING: Poll not active? Status: ' + status);
        }

    } catch (error) {
        console.error('❌ Error:', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    }
}

verifyPrivacy();
