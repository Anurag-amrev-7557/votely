const axios = require('axios');
// Assuming we have a way to authenticate or we test public endpoints.
// For this test, valid poll ID needed. We can fetch one active poll.

async function testResultPrivacy() {
    console.log('--- Testing Result Privacy ---');

    try {
        // 1. Get an active poll (assuming one exists from seed or prev usage)
        const pollsRes = await axios.get('http://localhost:5001/api/polls?status=active');
        const activePoll = pollsRes.data.polls?.[0];

        if (!activePoll) {
            console.log('⚠️ SKIPPING: No active polls found to test.');
            return;
        }

        console.log(`Testing Poll: ${activePoll.title} (${activePoll._id})`);

        // 2. Fetch results
        const resultsRes = await axios.get(`http://localhost:5001/api/polls/${activePoll._id}/results`);
        const options = resultsRes.data.options;

        // 3. Verify counts are hidden
        if (options && options.length > 0) {
            if (options[0].count === undefined && options[0].percent === undefined) {
                console.log('✅ PASSED: Vote counts and percentages are HIDDEN.');
            } else {
                console.error(`❌ FAILED: Vote counts/percentages leaked! Count: ${options[0].count}, Percent: ${options[0].percent}`);
            }
        } else {
            console.log('⚠️ SKIPPING: Active poll has no options?');
        }

    } catch (error) {
        console.error('❌ Error testing result privacy:', error.message);
    }
}

testResultPrivacy();
