const cron = require('node-cron');
const mongoose = require('mongoose');
const Poll = require('./models/Poll');

/**
 * Enhanced status cron:
 * - Configurable schedule via env or param
 * - Health check for DB connection
 * - Optional verbose logging
 * - Error notification stub (for future email/alert integration)
 * - Graceful shutdown support
 */
function startStatusCron({
  schedule = process.env.POLL_STATUS_CRON || '* * * * *',
  verbose = process.env.NODE_ENV !== 'production',
  onError = null, // Optional: function(err) for custom error handling/notification
} = {}) {
  let task;

  function isDbConnected() {
    // 1 = connected, 2 = connecting
    return mongoose.connection.readyState === 1;
  }

  task = cron.schedule(schedule, async () => {
    if (!isDbConnected()) {
      const msg = '[statusCron] Skipped: DB not connected';
      if (verbose) console.warn(msg);
      return;
    }
    const start = Date.now();
    try {
      const result = await Poll.updateStatuses();
      const duration = Date.now() - start;
      if (verbose) {
        console.log(`[statusCron] Poll statuses updated at ${new Date().toISOString()} (${duration}ms)`);
        if (result && typeof result === 'object') {
          // Optionally log how many polls were updated if available
          if (result.nModified !== undefined) {
            console.log(`[statusCron] Polls updated: ${result.nModified}`);
          } else if (result.modifiedCount !== undefined) {
            console.log(`[statusCron] Polls updated: ${result.modifiedCount}`);
          }
        }
      }
    } catch (err) {
      console.error('[statusCron] Failed to update poll statuses:', err);
      if (typeof onError === 'function') {
        try { onError(err); } catch (notifyErr) { console.error('[statusCron] Error in onError handler:', notifyErr); }
      }
      // Future: sendEmail({subject: ..., text: ...}) or integrate with alerting
    }
  }, {
    scheduled: true,
    timezone: process.env.TZ || 'UTC'
  });

  if (verbose) {
    console.log(`[statusCron] Poll status cron job scheduled (${schedule}, timezone: ${process.env.TZ || 'UTC'})`);
  }

  // Graceful shutdown support
  function stop() {
    if (task) {
      task.stop();
      if (verbose) console.log('[statusCron] Poll status cron job stopped');
    }
  }

  // Optionally handle process signals for graceful shutdown
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  // Return stop function for programmatic control
  return { stop };
}

module.exports = startStatusCron;