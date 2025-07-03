import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  ChartBarIcon,
  DocumentTextIcon,
  KeyIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowPathIcon,
  ClipboardIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';

const mockUsers = [
  { id: 1, name: 'Alice Admin', email: 'alice@votely.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Voter', email: 'bob@votely.com', role: 'Voter', status: 'Active' },
  { id: 3, name: 'Charlie Mod', email: 'charlie@votely.com', role: 'Moderator', status: 'Suspended' },
];
const mockRoles = [
  { id: 1, name: 'Admin', permissions: ['All'] },
  { id: 2, name: 'Voter', permissions: ['Vote'] },
  { id: 3, name: 'Moderator', permissions: ['Moderate'] },
];
const mockLogs = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  event: i % 2 === 0 ? 'Login' : 'Vote Cast',
  user: i % 2 === 0 ? 'Alice Admin' : 'Bob Voter',
  time: `2024-06-0${(i % 9) + 1} 12:3${i}`,
  status: i % 3 === 0 ? 'Success' : 'Info',
}));
const mockApiKeys = [
  { id: 1, label: 'Main API', key: 'sk_live_1234abcd5678efgh', created: '2024-05-01', lastUsed: '2024-06-01', status: 'Active' },
  { id: 2, label: 'Dev Key', key: 'sk_test_8765wxyz4321lmno', created: '2024-04-15', lastUsed: '2024-05-30', status: 'Inactive' },
];

const SettingsPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    weeklyReport: true,
    securityAlerts: true,
  });
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  const [timeFormat, setTimeFormat] = useState('12h');
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [logs, setLogs] = useState(mockLogs);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showKey, setShowKey] = useState({});
  const [loading, setLoading] = useState(false);

  const settingsTabs = [
    { id: 'general', label: 'General', icon: CogIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'appearance', label: 'Appearance', icon: GlobeAltIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'users', label: 'Users & Roles', icon: UserGroupIcon },
    { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
    { id: 'logs', label: 'System Logs', icon: DocumentTextIcon },
    { id: 'api', label: 'API Keys', icon: KeyIcon },
  ];

  const handleSave = () => {
    setShowToast(true);
    setToastMsg('Settings saved successfully!');
    setTimeout(() => setShowToast(false), 2000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            >
              <option value="UTC">UTC</option>
              <option value="EST">Eastern Time</option>
              <option value="PST">Pacific Time</option>
              <option value="GMT">GMT</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Format</label>
              <select
                value={timeFormat}
                onChange={(e) => setTimeFormat(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              >
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Notification Preferences</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Receive push notifications'}
                  {key === 'sms' && 'Receive SMS notifications'}
                  {key === 'weeklyReport' && 'Get weekly activity reports'}
                  {key === 'securityAlerts' && 'Get security alerts'}
                </p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  value
                    ? isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
                    : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Theme Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Switch between light and dark theme
              </p>
            </div>
            <button
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                isDarkMode
                  ? 'bg-blue-600'
                  : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Accent Color</label>
            <div className="flex gap-2">
              {['blue', 'purple', 'green', 'red'].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 hover:ring-offset-2 hover:ring-${color}-500 transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Security Overview</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheckIcon className="h-6 w-6 text-blue-500" />
              <span className="font-medium text-gray-900 dark:text-white">2FA Enabled</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Your account is protected with two-factor authentication.</p>
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition">Manage 2FA</button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <KeyIcon className="h-6 w-6 text-green-500" />
              <span className="font-medium text-gray-900 dark:text-white">Password Last Changed</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">May 20, 2024</p>
            <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition">Change Password</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Users</h3>
          <button onClick={() => { setEditUser(null); setShowUserModal(true); }} className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"><PlusIcon className="h-4 w-4" />Add User</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="py-2 px-2 text-left">Name</th>
                <th className="py-2 px-2 text-left">Email</th>
                <th className="py-2 px-2 text-left">Role</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2">{user.name}</td>
                  <td className="py-2 px-2">{user.email}</td>
                  <td className="py-2 px-2">{user.role}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>{user.status}</span>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button onClick={() => { setEditUser(user); setShowUserModal(true); }} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><PencilIcon className="h-4 w-4" /></button>
                    <button onClick={() => setUsers(users.filter(u => u.id !== user.id))} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-800"><TrashIcon className="h-4 w-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* User Modal */}
      {showUserModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="user-modal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`p-6 rounded-xl w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
            <h4 id="user-modal-title" className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit User</h4>
            <form onSubmit={e => { e.preventDefault(); setShowUserModal(false); setShowToast(true); setToastMsg('User updated!'); setTimeout(() => setShowToast(false), 2000); }} className="space-y-4">
              <input className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white" placeholder="Name" defaultValue={editUser?.name || ''} required />
              <input className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white" placeholder="Email" type="email" defaultValue={editUser?.email || ''} required />
              <select className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white" defaultValue={editUser?.role || 'Voter'}>
                {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
              </select>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnalyticsSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Analytics Preferences</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> Enable Analytics
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="form-checkbox" /> Weekly Reports
          </label>
        </div>
        <button className="px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition">Export Data</button>
      </div>
    </div>
  );

  const renderLogsSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">System Logs</h3>
        <div className="overflow-x-auto max-h-64">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="py-2 px-2 text-left">Event</th>
                <th className="py-2 px-2 text-left">User</th>
                <th className="py-2 px-2 text-left">Time</th>
                <th className="py-2 px-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2">{log.event}</td>
                  <td className="py-2 px-2">{log.user}</td>
                  <td className="py-2 px-2">{log.time}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${log.status === 'Success' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200'}`}>{log.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderApiKeysSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">API Keys</h3>
          <button onClick={() => setShowApiKeyModal(true)} className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 text-white text-xs hover:bg-blue-700 transition"><PlusIcon className="h-4 w-4" />New Key</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400">
                <th className="py-2 px-2 text-left">Label</th>
                <th className="py-2 px-2 text-left">Key</th>
                <th className="py-2 px-2 text-left">Created</th>
                <th className="py-2 px-2 text-left">Last Used</th>
                <th className="py-2 px-2 text-left">Status</th>
                <th className="py-2 px-2"></th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map(key => (
                <tr key={key.id} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-2 px-2">{key.label}</td>
                  <td className="py-2 px-2 flex items-center gap-2">
                    <span className="font-mono">{showKey[key.id] ? key.key : '••••••••••••••••••••••••'}</span>
                    <button onClick={() => setShowKey(s => ({ ...s, [key.id]: !s[key.id] }))} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                      {showKey[key.id] ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                    <button onClick={() => {navigator.clipboard.writeText(key.key); setShowToast(true); setToastMsg('API key copied!'); setTimeout(() => setShowToast(false), 2000);}} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"><ClipboardIcon className="h-4 w-4" /></button>
                  </td>
                  <td className="py-2 px-2">{key.created}</td>
                  <td className="py-2 px-2">{key.lastUsed}</td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${key.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200' : 'bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200'}`}>{key.status}</span>
                  </td>
                  <td className="py-2 px-2 flex gap-2">
                    <button onClick={() => setApiKeys(apiKeys.filter(k => k.id !== key.id))} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-800"><TrashIcon className="h-4 w-4 text-red-500" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* API Key Modal */}
      {showApiKeyModal && (
        <div role="dialog" aria-modal="true" aria-labelledby="api-key-modal-title" className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className={`p-6 rounded-xl w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} shadow-xl`}>
            <h4 id="api-key-modal-title" className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">New API Key</h4>
            <form onSubmit={e => { e.preventDefault(); setShowApiKeyModal(false); setShowToast(true); setToastMsg('API key created!'); setTimeout(() => setShowToast(false), 2000); }} className="space-y-4">
              <input className="w-full px-3 py-2 rounded border bg-gray-100 dark:bg-gray-800 dark:text-white" placeholder="Label" required />
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowApiKeyModal(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">Cancel</button>
                <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'users':
        return renderUsersSettings();
      case 'analytics':
        return renderAnalyticsSettings();
      case 'logs':
        return renderLogsSettings();
      case 'api':
        return renderApiKeysSettings();
      default:
        return (
          <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
            <p className="text-gray-500 dark:text-gray-400">Select a settings category to begin.</p>
          </div>
        );
    }
  };

  return (
    <div role="main" aria-label="Admin settings management" tabIndex={0}>
      <div className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Manage your system preferences and configurations
              </p>
            </div>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              aria-label="Save settings"
            >
              Save Changes
            </button>
          </div>
          {/* Toast */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed top-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg flex items-center gap-2"
              >
                <CheckCircleIcon className="h-5 w-5" />
                {toastMsg}
              </motion.div>
            )}
          </AnimatePresence>
          {/* Settings Navigation */}
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border border-gray-200 dark:border-gray-700`}>
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? isDarkMode
                            ? 'bg-gray-700 text-white'
                            : 'bg-gray-100 text-gray-900'
                          : isDarkMode
                            ? 'text-gray-400 hover:bg-gray-700 hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            {/* Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 