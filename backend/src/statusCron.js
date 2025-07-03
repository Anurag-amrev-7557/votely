const cron = require('node-cron');
const mongoose = require('mongoose');
const Poll = require('./models/Poll');

// Ensure this file is required after mongoose connection is established
function startStatusCron() {
  cron.schedule('* * * * *', async () => {
    try {
      await Poll.updateStatuses();
      console.log(`[statusCron] Poll statuses updated at ${new Date().toISOString()}`);
    } catch (err) {
      console.error('[statusCron] Failed to update poll statuses:', err);
    }
  });
  console.log('[statusCron] Poll status cron job scheduled (every minute)');
}

module.exports = startStatusCron; 