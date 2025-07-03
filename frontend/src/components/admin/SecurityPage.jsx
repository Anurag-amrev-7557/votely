import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LockClosedIcon,
  KeyIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  ArrowRightOnRectangleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MapPinIcon,
  EyeSlashIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { CSVLink } from 'react-csv';

const dummyActivity = [
  { type: 'login', desc: 'Logged in', time: '2024-06-01 10:23', device: 'Chrome on Mac', ip: '192.168.1.2', location: 'New York, USA', icon: <KeyIcon className="w-5 h-5 text-blue-500" aria-hidden="true" /> },
  { type: '2fa', desc: 'Enabled 2FA', time: '2024-05-30 09:10', device: 'Chrome on Mac', ip: '192.168.1.2', location: 'New York, USA', icon: <ShieldCheckIcon className="w-5 h-5 text-green-500" aria-hidden="true" /> },
  { type: 'password', desc: 'Changed password', time: '2024-05-20 14:45', device: 'Safari on iPhone', ip: '192.168.1.3', location: 'San Francisco, USA', icon: <LockClosedIcon className="w-5 h-5 text-yellow-500" aria-hidden="true" /> },
  { type: 'login', desc: 'Logged in', time: '2024-05-18 08:00', device: 'Firefox on Windows', ip: '192.168.1.4', location: 'London, UK', icon: <KeyIcon className="w-5 h-5 text-blue-500" aria-hidden="true" /> },
  { type: '2fa', desc: 'Disabled 2FA', time: '2024-05-15 12:30', device: 'Edge on Windows', ip: '192.168.1.5', location: 'Berlin, DE', icon: <ShieldCheckIcon className="w-5 h-5 text-red-500" aria-hidden="true" /> },
  { type: 'password', desc: 'Changed password', time: '2024-05-10 14:45', device: 'Safari on iPhone', ip: '192.168.1.3', location: 'San Francisco, USA', icon: <LockClosedIcon className="w-5 h-5 text-yellow-500" aria-hidden="true" /> },
];
const dummySessions = [
  { id: 1, device: 'Chrome on Mac', browser: 'chrome', os: 'mac', ip: '192.168.1.2', location: 'New York, USA', lastActive: '2 min ago', current: true },
  { id: 2, device: 'Safari on iPhone', browser: 'safari', os: 'ios', ip: '192.168.1.3', location: 'San Francisco, USA', lastActive: '1 day ago', current: false },
];
const backupCodes = [
  '8F3D-2A1B', '9C7E-4B2F', '1A2B-3C4D', '5E6F-7G8H', '2J3K-4L5M'
];

const passwordRequirements = [
  { label: 'At least 8 characters', test: pwd => pwd.length >= 8 },
  { label: 'At least one uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
  { label: 'At least one number', test: pwd => /[0-9]/.test(pwd) },
  { label: 'At least one special character', test: pwd => /[^A-Za-z0-9]/.test(pwd) },
];

const passwordHistory = [
  { date: '2024-05-20', value: '********' },
  { date: '2024-03-10', value: '********' },
  { date: '2023-12-01', value: '********' },
];
const passwordLastChanged = '2024-05-20';
const passwordExpiresInDays = 5; // Demo: password expires in 5 days

const twoFAMethod = 'Authenticator App';
const twoFASecret = 'JBSWY3DPEHPK3PXP';
const qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/YourApp:admin@example.com?secret=JBSWY3DPEHPK3PXP&issuer=YourApp';

const browserEmoji = { chrome: '🌐', safari: '🧭', firefox: '🦊', edge: '🔵', other: '💻' };
const osEmoji = { mac: '🍎', windows: '🪟', ios: '📱', android: '🤖', linux: '��', other: '💻' };

const eventTypeBadge = {
  login: 'bg-blue-100 text-blue-700',
  '2fa': 'bg-green-100 text-green-700',
  password: 'bg-yellow-100 text-yellow-700',
};

const ACTIVITY_PAGE_SIZE = 3;

const initialTips = [
  { id: 1, type: 'warning', icon: <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3" aria-hidden="true" />, text: 'Your password is over 90 days old. Consider changing it.', action: 'Change Password' },
  { id: 2, type: 'info', icon: <CheckCircleIcon className="w-6 h-6 text-blue-500 mr-3" aria-hidden="true" />, text: 'No unusual login activity detected.', action: null },
];

const SecurityPage = () => {
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [pwdStrength, setPwdStrength] = useState(0);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [activityType, setActivityType] = useState('all');
  const [showPassword, setShowPassword] = useState(false);
  const [forceLogout, setForceLogout] = useState(true);
  const [showRegenerateCodes, setShowRegenerateCodes] = useState(false);
  const [showDisable2FAConfirm, setShowDisable2FAConfirm] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [tips, setTips] = useState(initialTips);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // Demo skeleton loader
    return () => clearTimeout(timer);
  }, []);

  // Password strength logic (simple)
  const checkStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 7) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPwdStrength(score);
  };

  // Password requirements feedback
  const pwdReqs = passwordRequirements.map(req => ({ ...req, met: req.test(password) }));

  // Security score (out of 100)
  const securityScore = (is2FAEnabled ? 50 : 0) + (pwdStrength * 10) + 30;

  // Filtered activity log
  const filteredActivity = dummyActivity.filter(a =>
    (activityType === 'all' || a.type === activityType) &&
    (a.desc.toLowerCase().includes(search.toLowerCase()) ||
      a.device.toLowerCase().includes(search.toLowerCase()))
  );

  const pagedActivity = filteredActivity.slice((activityPage-1)*ACTIVITY_PAGE_SIZE, activityPage*ACTIVITY_PAGE_SIZE);
  const totalPages = Math.ceil(filteredActivity.length / ACTIVITY_PAGE_SIZE);

  return (
    <div role="main" aria-label="Admin security management" tabIndex={0}>
      {/* Security Score Bar */}
      <section role="region" aria-labelledby="admin-security-score-heading" tabIndex={0}>
        <h2 id="admin-security-score-heading" className="sr-only">Security Score</h2>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheckIcon className="w-7 h-7 text-blue-500" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">Security Score</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${securityScore >= 90 ? 'bg-green-100 text-green-700' : securityScore >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{securityScore}/100</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${securityScore >= 90 ? 'bg-green-500' : securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${securityScore}%` }}></div>
          </div>
        </div>
      </section>

      {/* Security Recommendations (Dismissible) */}
      <section role="region" aria-labelledby="admin-security-recommendations-heading" tabIndex={0}>
        <h2 id="admin-security-recommendations-heading" className="sr-only">Security Recommendations</h2>
        <div className="mb-8 grid gap-4 md:grid-cols-2" aria-live="polite">
          {tips.map(tip => (
            <div key={tip.id} className={`flex items-center p-4 rounded-lg border-l-4 ${tip.type === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400' : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'}`}>
              {tip.icon}
              <div className="flex-1">
                <div className={`font-semibold ${tip.type === 'warning' ? 'text-yellow-800 dark:text-yellow-200' : 'text-blue-800 dark:text-blue-200'}`}>{tip.text}</div>
                {tip.action && <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1" aria-label={tip.action}>{tip.action}</button>}
              </div>
              <button onClick={() => setTips(tips.filter(t => t.id !== tip.id))} className="ml-2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" aria-label="Dismiss tip">
                &times;
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-8" />

      {/* Password Management */}
      <section role="region" aria-labelledby="admin-password-management-heading" tabIndex={0}>
        <h2 id="admin-password-management-heading" className="sr-only">Password Management</h2>
        <motion.div layout className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-2">
            <LockClosedIcon className="w-6 h-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Password Management</h2>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm flex flex-col gap-1">
              <span>Last changed: <span className="font-medium text-gray-900 dark:text-white">{passwordLastChanged}</span></span>
              {passwordExpiresInDays <= 7 && (
                <span className="text-xs text-yellow-700 dark:text-yellow-300 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4" />Password expires in {passwordExpiresInDays} days</span>
              )}
            </div>
            <button onClick={() => setShowPwdModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Change Password</button>
          </div>
          {/* Password History */}
          <div className="mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Password History</div>
            <ul className="space-y-1">
              {passwordHistory.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-200">
                  <LockClosedIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
                  <span>{item.value}</span>
                  <span className="ml-2 text-gray-400">({item.date})</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* 2FA Section */}
      <section role="region" aria-labelledby="admin-2fa-heading" tabIndex={0}>
        <h2 id="admin-2fa-heading" className="sr-only">Two-Factor Authentication</h2>
        <motion.div layout className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-2">
            <ShieldCheckIcon className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</h2>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 mb-4" />
          <div className="flex items-center justify-between mb-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              Status: {is2FAEnabled ? <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1"><CheckCircleIcon className="w-4 h-4" />Enabled</span> : <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4" />Disabled</span>}
              <span className="ml-3 inline-flex items-center px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/20 text-xs text-blue-700 dark:text-blue-300 font-medium">{twoFAMethod}</span>
            </div>
            <button onClick={() => is2FAEnabled ? setShowDisable2FAConfirm(true) : setShow2FAModal(true)} className={`px-4 py-2 rounded-lg font-medium transition ${is2FAEnabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>{is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}</button>
          </div>
          {is2FAEnabled && (
            <div className="mt-4 flex flex-col gap-2">
              <button onClick={() => setShowBackupCodes(v => !v)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium mb-1 w-fit" aria-label={showBackupCodes ? 'Hide backup codes' : 'Show backup codes'}>{showBackupCodes ? 'Hide' : 'Show'} Backup Codes</button>
              <button onClick={() => setShowRegenerateCodes(true)} className="text-xs text-yellow-600 dark:text-yellow-400 hover:underline font-medium mb-1 w-fit" aria-label="Regenerate backup codes">Regenerate Backup Codes</button>
              <AnimatePresence>
                {showBackupCodes && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-gray-50 dark:bg-gray-800 rounded p-4 flex flex-wrap gap-2">
                    {backupCodes.map(code => (
                      <span key={code} className="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-xs text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600">{code}</span>
                    ))}
                    <button className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline" aria-label="Copy all backup codes">Copy All</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </section>

      {/* Session Management */}
      <section role="region" aria-labelledby="admin-session-management-heading" tabIndex={0}>
        <h2 id="admin-session-management-heading" className="sr-only">Session Management</h2>
        <motion.div layout className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-2">
            <DevicePhoneMobileIcon className="w-6 h-6 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Sessions</h2>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 mb-4" />
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 px-2 text-left font-medium">Device</th>
                  <th className="py-2 px-2 text-left font-medium">IP</th>
                  <th className="py-2 px-2 text-left font-medium">Location</th>
                  <th className="py-2 px-2 text-left font-medium">Last Active</th>
                  <th className="py-2 px-2 text-left font-medium">Current</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {dummySessions.map(session => (
                  <tr key={session.id} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 flex items-center gap-2">
                      <span title={session.browser}>{browserEmoji[session.browser] || browserEmoji.other}</span>
                      <span title={session.os}>{osEmoji[session.os] || osEmoji.other}</span>
                      {session.device}
                    </td>
                    <td className="py-2 px-2">{session.ip}</td>
                    <td className="py-2 px-2 flex items-center gap-2"><MapPinIcon className="w-4 h-4 text-gray-400" />{session.location}</td>
                    <td className="py-2 px-2">{session.lastActive}</td>
                    <td className="py-2 px-2">
                      {session.current ? (
                        <span className="inline-block px-2 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded cursor-help" title="This is your current session">This device</span>
                      ) : ''}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {!session.current && (
                        <button onClick={() => { setSelectedSession(session); setShowRevokeModal(true); }} className="text-xs text-red-600 hover:underline" aria-label={`Revoke session for ${session.device} at ${session.location}`}>Revoke</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-3">
            <button className="px-3 py-1 text-xs font-semibold text-red-600 hover:text-red-700 rounded transition-all duration-200 flex items-center gap-1" aria-label="Revoke all sessions except this"><ArrowRightOnRectangleIcon className="w-4 h-4" aria-hidden="true" />Revoke all sessions except this</button>
          </div>
        </motion.div>
      </section>

      {/* Activity Log */}
      <section role="region" aria-labelledby="admin-activity-log-heading" tabIndex={0}>
        <h2 id="admin-activity-log-heading" className="sr-only">Recent Admin Activity</h2>
        <motion.div layout className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center mb-2">
            <KeyIcon className="w-6 h-6 text-indigo-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Admin Activity</h2>
            <div className="ml-auto">
              <CSVLink
                data={filteredActivity.map(a => ({
                  event: a.desc,
                  type: a.type,
                  time: a.time,
                  device: a.device,
                  ip: a.ip,
                  location: a.location
                }))}
                headers={[
                  { label: 'Event', key: 'event' },
                  { label: 'Type', key: 'type' },
                  { label: 'Time', key: 'time' },
                  { label: 'Device', key: 'device' },
                  { label: 'IP', key: 'ip' },
                  { label: 'Location', key: 'location' },
                ]}
                filename={`admin-activity-${new Date().toISOString().slice(0,10)}.csv`}
                className="px-3 py-1 text-xs font-semibold text-blue-600 hover:text-blue-800 rounded border border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-300 ml-2"
                aria-label="Export admin activity as CSV"
              >
                Export CSV
              </CSVLink>
            </div>
          </div>
          <div className="border-b border-gray-100 dark:border-gray-800 mb-4" />
          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-4 gap-2">
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={e => { setActivityPage(1); setSearch(e.target.value); }}
              className="w-full md:w-64 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search activity log"
            />
            <select value={activityType} onChange={e => { setActivityPage(1); setActivityType(e.target.value); }} className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm" aria-label="Filter activity type">
              <option value="all">All Events</option>
              <option value="login">Logins</option>
              <option value="2fa">2FA</option>
              <option value="password">Password</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="py-2 px-2 text-left font-medium">Event</th>
                  <th className="py-2 px-2 text-left font-medium">Type</th>
                  <th className="py-2 px-2 text-left font-medium">Time</th>
                  <th className="py-2 px-2 text-left font-medium">Device</th>
                  <th className="py-2 px-2 text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {pagedActivity.length === 0 ? (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-400 italic">No activity found.</td></tr>
                ) : pagedActivity.map((a, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-2 flex items-center gap-2">{a.icon}{a.desc}</td>
                    <td className="py-2 px-2"><span className={`px-2 py-0.5 rounded text-xs font-semibold ${eventTypeBadge[a.type] || 'bg-gray-100 text-gray-700'}`}>{a.type}</span></td>
                    <td className="py-2 px-2">{a.time}</td>
                    <td className="py-2 px-2">{a.device}</td>
                    <td className="py-2 px-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer" title={`IP: ${a.ip}\nLocation: ${a.location}`} aria-label={`Details for event from IP ${a.ip} at ${a.location}`}>Details</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 mt-4">
              <button disabled={activityPage === 1} onClick={() => setActivityPage(p => Math.max(1, p-1))} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50" aria-label="Previous page">Prev</button>
              <span className="text-xs text-gray-500 dark:text-gray-400">Page {activityPage} of {totalPages}</span>
              <button disabled={activityPage === totalPages} onClick={() => setActivityPage(p => Math.min(totalPages, p+1))} className="px-2 py-1 text-xs rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 disabled:opacity-50" aria-label="Next page">Next</button>
            </div>
          )}
        </motion.div>
      </section>

      {/* Change Password Modal */}
      <AnimatePresence>
        {showPwdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="change-password-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="change-password-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <div className="relative mb-3">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }} placeholder="New password" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm pr-10" aria-label="New password" aria-describedby="password-requirements" />
                <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" tabIndex={-1} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeSlashIcon className="w-5 h-5" aria-hidden="true" /> : <EyeIcon className="w-5 h-5" aria-hidden="true" />}
                </button>
              </div>
              <div className="mb-4">
                <div className="h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className={`h-2 rounded transition-all duration-300 ${pwdStrength === 0 ? 'w-0' : pwdStrength === 1 ? 'w-1/4 bg-red-500' : pwdStrength === 2 ? 'w-2/4 bg-yellow-500' : pwdStrength === 3 ? 'w-3/4 bg-blue-500' : 'w-full bg-green-500'}`}></div>
                </div>
                <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">Password strength: {['Very weak', 'Weak', 'Medium', 'Strong', 'Very strong'][pwdStrength]}</div>
                <ul id="password-requirements" className="mt-2 space-y-1">
                  {pwdReqs.map((req, i) => (
                    <li key={i} className={`flex items-center gap-2 text-xs ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      <CheckCircleIcon className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} aria-hidden="true" />
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex items-center mb-4">
                <input id="force-logout" type="checkbox" checked={forceLogout} onChange={e => setForceLogout(e.target.checked)} className="mr-2" />
                <label htmlFor="force-logout" className="text-xs text-gray-700 dark:text-gray-300">Force logout from all other sessions after password change</label>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPwdModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">Update Password</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2FA Modal (Enable) */}
      <AnimatePresence>
        {show2FAModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="enable-2fa-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="enable-2fa-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Enable 2FA</h3>
              <div className="mb-4">
                <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">Scan this QR code with your authenticator app:</div>
                <div className="flex items-center justify-center mb-4">
                  <img src={qrCodeUrl} alt="2FA QR Code" className="w-32 h-32 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700" />
                </div>
                <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">Or enter this secret key manually:</div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="font-mono px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm border border-gray-200 dark:border-gray-700">{twoFASecret}</span>
                  <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline" aria-label="Copy 2FA secret key">Copy</button>
                </div>
                <input type="text" placeholder="Enter 6-digit code" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm mb-3" />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShow2FAModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition">Enable</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Regenerate Backup Codes Modal */}
      <AnimatePresence>
        {showRegenerateCodes && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="regenerate-backup-codes-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="regenerate-backup-codes-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Regenerate Backup Codes</h3>
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">Are you sure you want to regenerate your backup codes? Old codes will no longer work.</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRegenerateCodes(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 transition">Regenerate</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disable 2FA Confirmation Modal */}
      <AnimatePresence>
        {showDisable2FAConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="disable-2fa-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="disable-2fa-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Disable 2FA</h3>
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">Are you sure you want to disable two-factor authentication?</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowDisable2FAConfirm(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">Disable</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revoke Session Modal */}
      <AnimatePresence>
        {showRevokeModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" role="dialog" aria-modal="true" aria-labelledby="revoke-session-title">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h3 id="revoke-session-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Revoke Session</h3>
              <div className="mb-4 text-sm text-gray-700 dark:text-gray-300">Are you sure you want to revoke access for <span className="font-semibold">{selectedSession?.device}</span> ({selectedSession?.location})?</div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowRevokeModal(false)} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition">Cancel</button>
                <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition">Revoke</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skeleton Loader Demo */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10 pointer-events-none" aria-live="polite" aria-busy="true">
          <div className="w-80 h-40 bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      )}
    </div>
  );
};

export default SecurityPage; 