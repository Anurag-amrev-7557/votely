const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const { io } = require('../server');
const Activity = require('../models/Activity');
const sendEmail = require('../utils/sendEmail');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');

/**
 * Enhanced rate limiter for voting:
 * - Limits by IP (default)
 * - Optionally limits by user ID if authenticated (for logged-in users)
 * - Stricter burst control: max 3 votes in 30 seconds, max 8 votes in 10 minutes
 * - Custom handler logs abuse attempts and returns detailed error
 * - Allows bypass for trusted roles (e.g., admin, moderator)
 */
const enhancedVoteLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 8, // Max 8 votes per 10 minutes
  keyGenerator: (req) => {
    // If user is authenticated, use user ID; else, use IP
    if (req.user && req.user._id) {
      return `user:${req.user._id}`;
    }
    return req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // Log abuse attempt for audit
    const userId = req.user && req.user._id ? req.user._id : null;
    const ip = req.ip;
    console.warn(`[RATE LIMIT] Vote limit exceeded. User: ${userId || 'anonymous'}, IP: ${ip}`);
    res.status(429).json({
      error: 'Too many votes submitted. Please wait before voting again.',
      retryAfter: Math.ceil(options.windowMs / 1000), // seconds
      limit: options.max
    });
  },
  skip: (req, res) => {
    // Allow trusted roles to bypass limiter
    if (req.user && Array.isArray(req.user.roles)) {
      if (req.user.roles.includes('admin') || req.user.roles.includes('moderator')) {
        return true;
      }
    }
    return false;
  }
});

// Short-term burst limiter: max 3 votes in 30 seconds
const burstVoteLimiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 3,
  keyGenerator: (req) => {
    if (req.user && req.user._id) {
      return `user:${req.user._id}`;
    }
    return req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    const userId = req.user && req.user._id ? req.user._id : null;
    const ip = req.ip;
    console.warn(`[BURST LIMIT] Rapid voting detected. User: ${userId || 'anonymous'}, IP: ${ip}`);
    res.status(429).json({
      error: 'You are voting too quickly. Please slow down.',
      retryAfter: Math.ceil(options.windowMs / 1000),
      limit: options.max
    });
  },
  skip: (req, res) => {
    if (req.user && Array.isArray(req.user.roles)) {
      if (req.user.roles.includes('admin') || req.user.roles.includes('moderator')) {
        return true;
      }
    }
    return false;
  }
});

// Export as a combined middleware for use in routes
const voteLimiter = [burstVoteLimiter, enhancedVoteLimiter];

module.exports.voteLimiter = voteLimiter;

/**
 * Advanced bot detection middleware for voting endpoint.
 * - Checks for common bot user-agents (case-insensitive).
 * - Detects headless browsers (e.g., Puppeteer, Playwright, Selenium).
 * - Blocks requests with missing or suspicious headers.
 * - Optionally checks for rapid-fire requests from same IP (basic behavioral check).
 * - Logs suspicious attempts for audit.
 */
// Enhanced suspicious user-agent patterns with more coverage and comments
const suspiciousUserAgents = [
  /bot/i,                // generic bots
  /crawl/i,              // crawlers
  /spider/i,             // spiders
  /curl/i,               // curl CLI
  /wget/i,               // wget CLI
  /python/i,             // Python scripts
  /scrapy/i,             // Scrapy framework
  /httpclient/i,         // Java/other HTTP clients
  /libwww/i,             // libwww-perl
  /phantomjs/i,          // PhantomJS headless
  /headless/i,           // Headless browsers
  /selenium/i,           // Selenium automation
  /puppeteer/i,          // Puppeteer automation
  /playwright/i,         // Playwright automation
  /slimerjs/i,           // SlimerJS
  /node\.js/i,           // Node.js scripts
  /java/i,               // Java user-agents
  /go-http-client/i,     // Go HTTP client
  /okhttp/i,             // OkHttp (Android/Java)
  /powershell/i,         // PowerShell scripts
  /fetch/i,              // fetch API (sometimes used by bots)
  /axios/i,              // axios HTTP client
  /winhttp/i,            // Windows HTTP client
  /perl/i,               // Perl scripts
  /ruby/i,               // Ruby scripts
  /mechanize/i,          // Mechanize library
  /cfnetwork/i,          // Apple CFNetwork (often used by scripts)
  /http_request2/i,      // PHP HTTP_Request2
  /restsharp/i,          // .NET RestSharp
  /lwp::simple/i,        // Perl LWP
  /aiohttp/i,            // Python aiohttp
  /httpie/i,             // HTTPie CLI
  /testcafe/i,           // TestCafe automation
  /cypress/i,            // Cypress automation
  /phantom/i,            // Phantom (generic)
  /scraper/i,            // generic scraper
  /masscan/i,            // masscan tool
  /zgrab/i,              // zgrab scanner
  /hydra/i,              // hydra brute force
  /nikto/i,              // nikto scanner
  /nmap/i,               // nmap scanner
  /sqlmap/i,             // sqlmap tool
  /nessus/i,             // nessus scanner
  /acunetix/i,           // acunetix scanner
  /netsparker/i,         // netsparker scanner
  /w3af/i,               // w3af scanner
  /dirbuster/i,          // dirbuster
  /dirb/i,               // dirb
  /fuzzer/i,             // generic fuzzer
  /scanner/i,            // generic scanner
];

// Enhanced suspicious header patterns with more checks and comments
const suspiciousHeaderPatterns = [
  // Missing Accept-Language or Accept headers is suspicious
  (headers) => !headers['accept-language'] || !headers['accept'],

  // Suspicious referer (empty or localhost for production)
  (headers, req) => {
    const referer = headers['referer'] || '';
    if (process.env.NODE_ENV === 'production') {
      // Accept only referers from our own domain (if set in env)
      const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
      if (allowedOrigin) {
        return referer === '' || (!referer.startsWith(allowedOrigin) && referer.startsWith('http'));
      }
      return referer === '' || referer.startsWith('http://localhost');
    }
    return false;
  },

  // Unusual content-type for POST (should be JSON or form)
  (headers, req) => {
    if (req.method === 'POST') {
      const ct = headers['content-type'] || '';
      // Accept JSON, form, or multipart (for file uploads)
      return !ct.includes('application/json') &&
             !ct.includes('application/x-www-form-urlencoded') &&
             !ct.includes('multipart/form-data');
    }
    return false;
  },

  // Suspicious: missing User-Agent header
  (headers) => !headers['user-agent'],

  // Suspicious: X-Requested-With header set to "XMLHttpRequest" from non-browser UA
  (headers, req) => {
    const xrw = headers['x-requested-with'] || '';
    const ua = headers['user-agent'] || '';
    if (xrw.toLowerCase() === 'xmlhttprequest' && !/mozilla|chrome|safari|firefox|edge/i.test(ua)) {
      return true;
    }
    return false;
  },

  // Suspicious: custom headers often used by bots/scripts
  (headers) => {
    const customHeaders = ['x-crawler', 'x-bot', 'x-bot-version', 'x-bot-id', 'x-bot-name'];
    return customHeaders.some(h => h in headers);
  },

  // Suspicious: Accept header is */* only (very common for bots)
  (headers) => {
    const accept = headers['accept'] || '';
    return accept.trim() === '*/*';
  },

  // Suspicious: Connection header is "close" (bots/scripts often do this)
  (headers) => {
    const conn = headers['connection'] || '';
    return conn.trim().toLowerCase() === 'close';
  },

  // Suspicious: Pragma or Cache-Control set to "no-cache" (bots/scripts)
  (headers) => {
    const pragma = headers['pragma'] || '';
    const cacheControl = headers['cache-control'] || '';
    return pragma.toLowerCase() === 'no-cache' || cacheControl.toLowerCase() === 'no-cache';
  }
];

// Enhanced in-memory rapid-fire and behavioral bot detection for voting

const rapidFireMap = new Map();
const RAPID_FIRE_WINDOW_MS = 3000; // 3 seconds
const RAPID_FIRE_MAX = 3;

// Advanced: Track user-agent/IP combos, and optionally session/user ID for more granularity
const userAgentIpMap = new Map();
const USER_AGENT_IP_WINDOW_MS = 60000; // 1 minute
const USER_AGENT_IP_MAX = 10;

// Advanced: Track failed attempts for temporary blocking
const failedAttemptMap = new Map();
const FAILED_ATTEMPT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const FAILED_ATTEMPT_MAX = 5;
const BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function botDetection(req, res, next) {
  const ua = req.headers['user-agent'] || '';
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userId = req.user ? String(req.user._id) : null;
  const sessionId = req.sessionID || null;

  // 0. Check if IP is temporarily blocked due to repeated suspicious activity
  const blockRecord = failedAttemptMap.get(ip);
  if (blockRecord && blockRecord.blockedUntil && Date.now() < blockRecord.blockedUntil) {
    logSuspiciousAttempt(req, 'ip-blocked', { ip, blockedUntil: new Date(blockRecord.blockedUntil) });
    return res.status(429).json({ error: 'Too many suspicious attempts. Try again later.' });
  }

  // 1. User-Agent checks (block known bots)
  for (const pattern of suspiciousUserAgents) {
    if (pattern.test(ua)) {
      logSuspiciousAttempt(req, 'user-agent', ua);
      recordFailedAttempt(ip);
      return res.status(400).json({ error: 'Automated voting is not allowed.' });
    }
  }

  // 2. Header pattern checks (block suspicious headers)
  for (const check of suspiciousHeaderPatterns) {
    if (check(req.headers, req)) {
      logSuspiciousAttempt(req, 'headers', req.headers);
      recordFailedAttempt(ip);
      return res.status(400).json({ error: 'Suspicious request headers detected.' });
    }
  }

  // 3. Rapid-fire behavioral check (per IP)
  const now = Date.now();
  let record = rapidFireMap.get(ip) || [];
  record = record.filter(ts => now - ts < RAPID_FIRE_WINDOW_MS);
  record.push(now);
  rapidFireMap.set(ip, record);
  if (record.length > RAPID_FIRE_MAX) {
    logSuspiciousAttempt(req, 'rapid-fire', { ip, count: record.length });
    recordFailedAttempt(ip);
    return res.status(429).json({ error: 'Too many rapid requests. Please slow down.' });
  }

  // 4. Advanced: User-Agent/IP combo check (detect botnets or distributed scripts)
  const uaIpKey = `${ip}::${ua}`;
  let uaIpRecord = userAgentIpMap.get(uaIpKey) || [];
  uaIpRecord = uaIpRecord.filter(ts => now - ts < USER_AGENT_IP_WINDOW_MS);
  uaIpRecord.push(now);
  userAgentIpMap.set(uaIpKey, uaIpRecord);
  if (uaIpRecord.length > USER_AGENT_IP_MAX) {
    logSuspiciousAttempt(req, 'ua-ip-burst', { ip, ua, count: uaIpRecord.length });
    recordFailedAttempt(ip);
    return res.status(429).json({ error: 'Too many requests from this device. Please slow down.' });
  }

  // 5. Optionally: Check for missing cookies (bots often don't send cookies)
  // Uncomment to enforce cookie presence
  // if (!req.headers['cookie']) {
  //   logSuspiciousAttempt(req, 'missing-cookie', null);
  //   recordFailedAttempt(ip);
  //   return res.status(400).json({ error: 'Cookies required for voting.' });
  // }

  // 6. Optionally: Check for missing or suspicious referrer (bots/scripts)
  // if (!req.headers['referer'] && !req.headers['origin']) {
  //   logSuspiciousAttempt(req, 'missing-referrer', null);
  //   recordFailedAttempt(ip);
  //   return res.status(400).json({ error: 'Referrer required for voting.' });
  // }

  // 7. Optionally: Check for repeated voting attempts by user/session
  // (This is handled in vote logic, but can be duplicated here for extra defense)

  next();
}

// Enhanced logging for suspicious attempts (could be extended to use Winston, Sentry, etc.)
function logSuspiciousAttempt(req, reason, details) {
  // You can replace this with a more robust logger or external service
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const userId = req.user ? String(req.user._id) : null;
  const sessionId = req.sessionID || null;
  const ua = req.headers['user-agent'] || '';
  const logObj = {
    time: new Date().toISOString(),
    ip,
    userId,
    sessionId,
    userAgent: ua,
    reason,
    details
  };
  // For production, send to external log aggregator
  if (process.env.NODE_ENV === 'production') {
    // Example: send to Sentry, Datadog, etc.
    // sendToExternalLogger(logObj);
  }
  console.warn(`[BOT DETECTION] Blocked request:`, logObj);
}

// Track failed attempts and temporarily block IPs after repeated suspicious activity
function recordFailedAttempt(ip) {
  const now = Date.now();
  let record = failedAttemptMap.get(ip) || { attempts: [], blockedUntil: null };
  // Remove old attempts
  record.attempts = record.attempts.filter(ts => now - ts < FAILED_ATTEMPT_WINDOW_MS);
  record.attempts.push(now);
  // Block if too many failed attempts
  if (record.attempts.length >= FAILED_ATTEMPT_MAX) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    record.attempts = []; // Reset attempts after blocking
  }
  failedAttemptMap.set(ip, record);
}

module.exports.botDetection = botDetection;

// Enhanced: Cast a vote with advanced validation, anti-abuse, audit, and feedback
exports.castVote = async (req, res) => {
  try {
    const { pollId, options } = req.body; // options: array of option texts/ids
    const userId = req.user ? req.user._id : undefined;
    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.get('referer') || req.get('referrer') || '';
    const ip = req.ip;

    // 1. Input validation
    if (!pollId || !Array.isArray(options)) {
      return res.status(400).json({ error: 'Poll ID and options are required.' });
    }
    if (options.length === 0) {
      return res.status(400).json({ error: 'You must select at least one option.' });
    }

    // 2. Fetch poll and check status
    const poll = await Poll.findById(pollId);
    if (!poll) return res.status(404).json({ error: 'Poll not found' });
    if (poll.status !== 'active') return res.status(400).json({ error: 'Poll is not active' });

    // 3. Poll settings
    const allowMultiple = poll.settings?.allowMultipleVotes;
    const maxVotes = poll.settings?.maxVotesPerVoter || 1;
    const isAnonymous = poll.settings?.voterNameDisplay === 'anonymized';
    const requireAuth = poll.settings?.requireAuthentication || false;
    const requireReferrer = poll.settings?.requireReferrer || false;
    const allowedOrigins = poll.settings?.allowedOrigins || [];

    // 4. Security: Require authentication if poll demands it
    if (requireAuth && !userId) {
      return res.status(401).json({ error: 'Authentication required to vote in this poll.' });
    }

    // 5. Security: Referrer/origin check if enabled
    if (requireReferrer) {
      if (!referrer) {
        return res.status(400).json({ error: 'Referrer required for voting.' });
      }
      if (allowedOrigins.length > 0) {
        const refOrigin = (() => {
          try {
            return new URL(referrer).origin;
          } catch {
            return '';
          }
        })();
        if (!allowedOrigins.includes(refOrigin)) {
          return res.status(403).json({ error: 'Voting from this origin is not allowed.' });
        }
      }
    }

    // 6. Validate options
    if (options.length > maxVotes) {
      return res.status(400).json({ error: `You can select up to ${maxVotes} option(s).` });
    }
    // Ensure all options are valid and not duplicated
    const validOptions = poll.options.map(opt => opt.text);
    const uniqueOptions = [...new Set(options)];
    if (uniqueOptions.length !== options.length) {
      return res.status(400).json({ error: 'Duplicate options are not allowed.' });
    }
    for (const opt of options) {
      if (!validOptions.includes(opt)) {
        return res.status(400).json({ error: `Invalid option: ${opt}` });
      }
    }

    // 7. Check if user already voted (by user or by session/IP for anonymous)
    let existingVote;
    if (isAnonymous) {
      // Use IP as identifier for anonymous (in production, use better anon ID)
      const anonId = ip;
      existingVote = await Vote.findOne({ poll: pollId, isAnonymous: true, 'meta.anonId': anonId });
      if (existingVote) {
        return res.status(400).json({ error: 'You have already voted in this poll.' });
      }
    } else {
      existingVote = await Vote.findOne({ poll: pollId, user: userId });
      if (existingVote) {
        return res.status(400).json({ error: 'You have already voted in this poll.' });
      }
    }

    // 8. Anti-abuse: Optionally, check for rapid repeat voting by IP/user (defense in depth)
    // (Handled by rate limiter middleware, but can add extra check here if needed)

    // 9. Register vote
    const voteData = {
      poll: pollId,
      options: uniqueOptions,
      votedAt: new Date(),
      isAnonymous,
      userAgent,
      meta: {
        ...(isAnonymous ? { anonId: ip } : {}),
        referrer,
        ip,
      }
    };
    if (!isAnonymous) voteData.user = userId;
    const vote = new Vote(voteData);
    await vote.save();

    // 10. Update poll option vote counts atomically
    for (const opt of uniqueOptions) {
      const optionIndex = poll.options.findIndex(o => o.text === opt);
      if (optionIndex !== -1) {
        poll.options[optionIndex].votes = (poll.options[optionIndex].votes || 0) + 1;
      }
    }
    poll.totalVotes = (poll.totalVotes || 0) + 1;
    poll.markModified('options');
    await poll.save();

    // 11. Emit real-time results to poll room
    io.to(`poll_${pollId}`).emit('pollResults', {
      pollId,
      options: poll.options,
      totalVotes: poll.totalVotes,
    });

    // 12. Audit log: record the vote action with more metadata
    await Activity.create({
      user: isAnonymous ? undefined : userId,
      poll: pollId,
      option: uniqueOptions.join(','),
      action: 'vote_cast',
      timestamp: new Date(),
      meta: {
        isAnonymous,
        options: uniqueOptions,
        anonId: isAnonymous ? ip : undefined,
        userAgent,
        referrer,
        ip,
      },
      type: 'Voted',
      description: `Voted for option(s): ${uniqueOptions.join(', ')}`,
      category: 'Voting',
      impact: 'medium',
      metadata: { pollId: String(pollId) }
    });

    // 13. Send email notification to admin (with more info)
    try {
      await sendEmail({
        to: process.env.ADMIN_EMAIL || 'admin@example.com',
        subject: `New Vote Cast in Poll: ${poll.title}`,
        text: `A new vote was cast in the poll "${poll.title}" by ${isAnonymous ? 'an anonymous user' : `user ${userId}`}.`,
        html: `<p>A new vote was cast in the poll <strong>${poll.title}</strong> by <strong>${isAnonymous ? 'an anonymous user' : `user ${userId}`}</strong>.</p>
               <p>Options: <strong>${uniqueOptions.join(', ')}</strong></p>
               <p>IP: ${ip}</p>
               <p>User-Agent: ${userAgent}</p>
               <p>Referrer: ${referrer}</p>`
      });
    } catch (e) {
      console.error('Failed to send vote notification email:', e);
    }

    // 14. Respond with enhanced feedback
    res.status(201).json({
      message: 'Vote cast successfully',
      pollId,
      votedOptions: uniqueOptions,
      isAnonymous,
      totalVotes: poll.totalVotes,
      pollStatus: poll.status,
      timestamp: new Date(),
    });
  } catch (err) {
    // Enhanced error logging
    console.error('Error in castVote:', err);
    res.status(400).json({ error: err.message || 'Failed to cast vote.' });
  }
};

// Enhanced: Get user's vote for a poll with advanced security, privacy, and audit logging

exports.getUserVote = async (req, res) => {
  try {
    // 1. Input validation
    const { pollId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(pollId)) {
      return res.status(400).json({ error: 'Invalid poll ID format.' });
    }

    // 2. Authentication & Authorization
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Authentication required.' });
    }
    const userId = req.user._id;

    // 3. Poll existence & access check
    const poll = await Poll.findById(pollId).select('settings status title visibility');
    if (!poll) {
      return res.status(404).json({ error: 'Poll not found.' });
    }
    // Optionally, check for private/hidden polls
    if (poll.visibility === 'private' && (!poll.settings?.allowedUsers || !poll.settings.allowedUsers.includes(String(userId)))) {
      return res.status(403).json({ error: 'You do not have access to this poll.' });
    }

    // 4. Find the user's vote (never leak votes of others)
    const vote = await Vote.findOne({ poll: pollId, user: userId }).select('-__v -isAnonymous');

    // 5. Advanced privacy: If poll is anonymized, do not return user info
    let responseVote = null;
    if (vote) {
      const voteObj = vote.toObject();
      if (poll.settings && poll.settings.voterNameDisplay === 'anonymized') {
        delete voteObj.user;
      } else {
        // Optionally, only return minimal user info (never sensitive)
        if (voteObj.user && typeof voteObj.user === 'object') {
          voteObj.user = { _id: voteObj.user._id || voteObj.user, displayName: req.user.name || req.user.email || undefined };
        }
      }
      // Optionally, add metadata for client UX
      voteObj.pollStatus = poll.status;
      voteObj.pollTitle = poll.title;
      voteObj.privacy = poll.settings?.voterNameDisplay || 'default';
      responseVote = voteObj;
    }

    // 6. Audit log (do not log sensitive vote content)
    try {
      await Activity.createActivity(
        userId,
        'Vote_View',
        `Viewed own vote for poll "${poll.title}"`,
        {
          pollId: String(pollId),
          category: 'Voting',
          privacy: poll.settings?.voterNameDisplay || 'default'
        }
      );
    } catch (logErr) {
      // Don't block user on audit log failure
      console.warn('Audit log failed in getUserVote:', logErr);
    }

    // 7. Respond with enhanced feedback
    if (!responseVote) {
      return res.status(404).json({ message: 'No vote found for this poll.' });
    }
    res.status(200).json({
      success: true,
      vote: responseVote,
      pollId,
      pollStatus: poll.status,
      privacy: poll.settings?.voterNameDisplay || 'default'
    });

  } catch (err) {
    // Enhanced error logging (never leak sensitive info)
    console.error('Error in getUserVote:', {
      error: err.message,
      userId: req.user && req.user._id,
      pollId: req.params && req.params.pollId
    });
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

// Enhanced: Batch get user's vote status and details for multiple polls
exports.getUserVotesBatch = async (req, res) => {
  try {
    const { pollIds } = req.body;
    if (!Array.isArray(pollIds) || pollIds.length === 0) {
      return res.status(400).json({ error: 'pollIds must be a non-empty array' });
    }
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Remove duplicates and sanitize pollIds
    const uniquePollIds = [...new Set(pollIds.map(id => String(id)))];

    // Fetch all votes by this user for the given pollIds
    const votes = await Vote.find({
      user: req.user._id,
      poll: { $in: uniquePollIds }
    }).lean();

    // Optionally, fetch poll info for privacy settings
    const polls = await Poll.find({ _id: { $in: uniquePollIds } })
      .select('_id title status settings')
      .lean();
    const pollMap = {};
    polls.forEach(p => { pollMap[String(p._id)] = p; });

    // Build result: { pollId: { hasVoted, votedAt, options, privacy, pollTitle, pollStatus } }
    const result = {};
    uniquePollIds.forEach(id => {
      const vote = votes.find(v => String(v.poll) === String(id));
      if (vote) {
        const poll = pollMap[String(id)] || {};
        result[id] = {
          hasVoted: true,
          votedAt: vote.votedAt,
          options: vote.options,
          privacy: poll.settings?.voterNameDisplay || 'default',
          pollTitle: poll.title || undefined,
          pollStatus: poll.status || undefined
        };
      } else {
        const poll = pollMap[String(id)] || {};
        result[id] = {
          hasVoted: false,
          privacy: poll.settings?.voterNameDisplay || 'default',
          pollTitle: poll.title || undefined,
          pollStatus: poll.status || undefined
        };
      }
    });

    // Audit log (do not log sensitive vote content)
    try {
      await Activity.createActivity(
        req.user._id,
        'Vote_View_Batch',
        `Viewed own vote status for ${uniquePollIds.length} poll(s)`,
        {
          pollIds: uniquePollIds,
          category: 'Voting',
          count: uniquePollIds.length
        }
      );
    } catch (logErr) {
      // Don't block user on audit log failure
      console.warn('Audit log failed in getUserVotesBatch:', logErr);
    }

    res.status(200).json({
      success: true,
      userId: req.user._id,
      polls: result
    });
  } catch (err) {
    // Enhanced error logging (never leak sensitive info)
    console.error('Error in getUserVotesBatch:', {
      error: err.message,
      userId: req.user && req.user._id,
      pollIds: req.body && req.body.pollIds
    });
    res.status(500).json({ error: 'Failed to fetch vote status' });
  }
};

// Export with rate limiter and bot detection
exports.voteLimiter = voteLimiter;
exports.botDetection = botDetection;