
import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Globe,
  Shield,
  Users,
  Settings,
  BarChart3,
  FileText,
  Key,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Search,
  ChevronRight,
  LogOut,
  Zap
} from 'lucide-react';
import adminAxios from '../../utils/api/adminAxios';

// --- Mock Data ---
const mockUsers = [
  { id: 1, name: 'Alice Admin', email: 'alice@votely.com', role: 'Admin', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { id: 2, name: 'Bob Voter', email: 'bob@votely.com', role: 'Voter', status: 'Active', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { id: 3, name: 'Charlie Mod', email: 'charlie@votely.com', role: 'Moderator', status: 'Suspended', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
];
const mockRoles = [
  { id: 1, name: 'Admin', permissions: ['All Access'] },
  { id: 2, name: 'Voter', permissions: ['Vote Only'] },
  { id: 3, name: 'Moderator', permissions: ['Manage Content'] },
];
const mockLogs = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  event: i % 2 === 0 ? 'User Login' : 'Vote Submitted',
  user: i % 2 === 0 ? 'Alice Admin' : 'Bob Voter',
  time: `Oct 2${i}, 2024 • 12:3${i} PM`,
  status: i % 3 === 0 ? 'Success' : 'Info',
}));
const mockApiKeys = [
  { id: 1, label: 'Production API', key: 'sk_live_1234abcd5678efgh', created: 'Oct 01, 2024', lastUsed: 'Just now', status: 'Active' },
  { id: 2, label: 'Development Key', key: 'sk_test_8765wxyz4321lmno', created: 'Sep 15, 2024', lastUsed: '2 days ago', status: 'Inactive' },
];

// --- Reusable Components ---

const GlassCard = ({ children, className = '', hoverEffect = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`
      bg-white/60 dark:bg-zinc-900/50 backdrop-blur-xl 
      border border-white/20 dark:border-white/5 
      rounded-3xl shadow-xl overflow-hidden
      ${hoverEffect ? 'hover:border-blue-500/30 transition-colors duration-300' : ''} 
      ${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-offset-zinc-900
    `}
  >
    {children}
  </motion.div>
);

const SectionHeader = ({ title, description }) => (
  <div className="mb-6">
    <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none mb-2">
      {title}
    </h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </div>
);

const Toggle = ({ enabled, onChange, label }) => (
  <button
    role="switch"
    aria-checked={enabled}
    aria-label={label}
    onClick={() => onChange(!enabled)}
    className={`
      relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
      transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      ${enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-zinc-700'}
    `}
  >
    <span
      className={`
        pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 
        transition duration-200 ease-in-out
        ${enabled ? 'translate-x-5' : 'translate-x-0'}
      `}
    />
  </button>
);

const Input = (props) => (
  <input
    {...props}
    className={`
      w-full px-4 py-3 rounded-xl 
      bg-gray-50 dark:bg-black/50 
      border border-gray-200 dark:border-white/10 
      text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-300
      focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none 
      transition-all duration-200 focus-visible:ring-2 focus-visible:ring-blue-500
      ${props.className}
    `}
  />
);

const Select = (props) => (
  <div className="relative">
    <select
      {...props}
      className={`
        w-full appearance-none px-4 py-3 rounded-xl 
        bg-gray-50 dark:bg-black/50 
        border border-gray-200 dark:border-white/10 
        text-gray-900 dark:text-white
        focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 focus:outline-none 
        transition-all duration-200
        cursor-pointer
        ${props.className}
      `}
    />
    <ChevronRight className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none rotate-90" aria-hidden="true" />
  </div>
);

// --- Settings Page ---

const SettingsPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  // State from original file
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
  const [users, setUsers] = useState(mockUsers);
  const [roles, setRoles] = useState(mockRoles);
  const [logs, setLogs] = useState(mockLogs);
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showKey, setShowKey] = useState({});
  const [showUserModal, setShowUserModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // Toast State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showNotification('Settings saved successfully!');
    }, 1200);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings, description: 'System preferences' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Alert configuration' },
    { id: 'appearance', label: 'Appearance', icon: Globe, description: 'Theme & branding' },
    { id: 'security', label: 'Security', icon: Shield, description: 'Access control' },
    { id: 'users', label: 'Team', icon: Users, description: 'Manage members' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, description: 'Data insights' },
    { id: 'logs', label: 'Logs', icon: FileText, description: 'Audit trail' },
    { id: 'api', label: 'API Keys', icon: Key, description: 'Developer access' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GlassCard className="p-8">
            <SectionHeader title="General Settings" description="Configure global system parameters." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">System Language</label>
                <Select value={language} onChange={(e) => setLanguage(e.target.value)} aria-label="System Language">
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Timezone</label>
                <Select value={timezone} onChange={(e) => setTimezone(e.target.value)} aria-label="Timezone">
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Format</label>
                <Select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)} aria-label="Date Format">
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Format</label>
                <Select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)} aria-label="Time Format">
                  <option value="12h">12-hour Clock (AM/PM)</option>
                  <option value="24h">24-hour Clock</option>
                </Select>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-white/5">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Danger Zone</h4>
              <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30">
                <div>
                  <p className="text-red-700 dark:text-red-400 font-medium">Reset all settings</p>
                  <p className="text-red-600/70 dark:text-red-400/70 text-sm">This action cannot be undone.</p>
                </div>
                <button className="px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 text-sm font-medium rounded-lg transition-colors" aria-label="Reset System Settings">
                  Reset System
                </button>
              </div>
            </div>
          </GlassCard>
        );

      case 'notifications':
        return (
          <GlassCard className="p-8">
            <SectionHeader title="Notification Preferences" description="Manage how and when you want to be notified." />
            <div className="space-y-6">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      {key === 'email' && <Bell className="w-5 h-5" />}
                      {key === 'push' && <Zap className="w-5 h-5" />}
                      {key === 'sms' && <Settings className="w-5 h-5" />}
                      {key === 'weeklyReport' && <FileText className="w-5 h-5" />}
                      {key === 'securityAlerts' && <Shield className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {key === 'email' && 'Receive updates directly to your inbox.'}
                        {key === 'push' && 'Get instant push notifications.'}
                        {key === 'sms' && 'Get verified SMS alerts.'}
                        {key === 'weeklyReport' && 'Receive a summary of weekly activity.'}
                        {key === 'securityAlerts' && 'Get notified of suspicious login attempts.'}
                      </p>
                    </div>
                  </div>
                  <Toggle
                    enabled={value}
                    onChange={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                    label={`Toggle ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </GlassCard>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Team Management</h3>
                <p className="text-gray-600 dark:text-gray-300">Manage access and roles for your team members.</p>
              </div>
              <button
                onClick={() => { setEditUser(null); setShowUserModal(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-blue-600/30"
                aria-label="Add New Member"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            <div className="grid gap-4">
              {users.map(user => (
                <GlassCard key={user.id} className="p-4" hoverEffect>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-gray-100" />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        user.role === 'Voter' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                        }`}>
                        {user.role}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {user.status}
                      </span>
                      <div className="flex gap-2 border-l border-gray-200 dark:border-white/10 pl-4">
                        <button onClick={() => { setEditUser(user); setShowUserModal(true); }} className="p-2 text-gray-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg" aria-label={`Edit ${user.name}`}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setUsers(users.filter(u => u.id !== user.id))} className="p-2 text-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg" aria-label={`Delete ${user.name}`}>
                          <Edit2 className="hidden" />
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            <GlassCard className="p-8">
              <div className="flex justify-between items-start mb-8">
                <SectionHeader title="API Access" description="Manage your API keys for external integrations." />
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium shadow-lg hover:scale-105 transition-all"
                  aria-label="Generate New API Key"
                >
                  Generate New Key
                </button>
              </div>

              <div className="space-y-4">
                {apiKeys.map(key => (
                  <div key={key.id} className="group p-4 rounded-2xl bg-gray-50 dark:bg-black/30 border border-gray-100 dark:border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100/50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                          <Key className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{key.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${key.status === 'Active' ? 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 'text-gray-600 bg-gray-100'}`}>
                        {key.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-black/50 p-2 rounded-lg border border-gray-200 dark:border-white/5 font-mono text-sm text-gray-600 dark:text-gray-300">
                      <span className="flex-1 truncate">
                        {showKey[key.id] ? key.key : '•'.repeat(32)}
                      </span>
                      <button
                        onClick={() => setShowKey(s => ({ ...s, [key.id]: !s[key.id] }))}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label={showKey[key.id] ? "Hide API Key" : "Show API Key"}
                      >
                        {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { navigator.clipboard.writeText(key.key); showNotification('Copied API Key to clipboard'); }}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        aria-label="Copy API Key"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex gap-4 text-xs text-gray-600 dark:text-gray-300">
                      <span>Created: {key.created}</span>
                      <span>Last used: {key.lastUsed}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        );

      case 'security':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-xl">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">Security Status</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm">System Secure</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium dark:text-gray-200">Two-Factor Auth</p>
                    <p className="text-sm text-gray-600">Extra layer of security.</p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline" aria-label="Configure Two-Factor Authentication">Configure</button>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-medium dark:text-gray-200">Password</p>
                    <p className="text-sm text-gray-600">Last changed 3 months ago.</p>
                  </div>
                  <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline" aria-label="Update Password">Update</button>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 text-orange-600 rounded-xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg dark:text-white">Recent Activity</h3>
                  <p className="text-gray-600 text-sm">Monitor suspicious actions</p>
                </div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900 dark:text-gray-100">Successful login from New York, USA</p>
                      <p className="text-gray-600 dark:text-gray-300 text-xs">Today, 10:23 AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        );

      // Default Placeholder for other tabs
      default:
        return (
          <GlassCard className="p-12 flex flex-col items-center justify-center text-center opacity-80">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-6">
              <Settings className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Work in Progress</h3>
            <p className="text-gray-600 max-w-sm">
              The {activeTab} settings panel is currently under development. Check back soon for updates.
            </p>
          </GlassCard>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full p-4 md:p-8 overflow-hidden bg-gray-50 dark:bg-black transition-colors duration-500">

      {/* Background Decor - Blobs */}
      <div className="absolute top-0 left-0 w-full h-96 bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen transform -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-full h-96 bg-purple-500/10 dark:bg-purple-500/20 blur-[120px] rounded-full pointer-events-none mix-blend-multiply dark:mix-blend-screen transform translate-y-1/2" />

      {/* Main Container */}
      <div className="relative max-w-7xl mx-auto z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white mb-2">
              Settings.
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
              Manage your global preferences and system configurations.
            </p>
          </div>
          <motion.button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="Save Changes"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Save Changes</>}
          </motion.button>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Navigation Sidebar */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-8 space-y-1 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl p-2 rounded-2xl border border-white/20 dark:border-white/5 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900 ${activeTab === tab.id
                    ? 'text-blue-700 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'
                    }`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  aria-label={`Go to ${tab.label} settings`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white dark:bg-zinc-800 shadow-sm rounded-xl"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-3">
                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10"
            role="status"
            aria-live="polite"
          >
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Success</h4>
              <p className="text-sm text-gray-600">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowUserModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10"
              role="dialog" aria-modal="true" aria-labelledby="modal-title-user"
            >
              <h3 id="modal-title-user" className="text-xl font-bold mb-6 dark:text-white">{editUser ? 'Edit User' : 'Add New Member'}</h3>
              <form onSubmit={(e) => { e.preventDefault(); setShowUserModal(false); showNotification('User updated'); }} className="space-y-4">
                <Input
                  placeholder="Full Name"
                  defaultValue={editUser?.name}
                  required
                  aria-label="Full Name"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  defaultValue={editUser?.email}
                  required
                  aria-label="Email Address"
                />
                <Select defaultValue={editUser?.role || 'Voter'} aria-label="User Role">
                  {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </Select>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors dark:text-white"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors" aria-label="Save User">
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showApiKeyModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowApiKeyModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-2xl border border-white/10"
              role="dialog" aria-modal="true" aria-labelledby="modal-title-apikey"
            >
              <h3 id="modal-title-apikey" className="text-xl font-bold mb-6 dark:text-white">Generate API Key</h3>
              <form onSubmit={(e) => { e.preventDefault(); setShowApiKeyModal(false); showNotification('API Key generated'); }} className="space-y-4">
                <Input
                  placeholder="Key Label (e.g. Production Mobile App)"
                  required
                  aria-label="Key Label"
                />
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    type="button"
                    onClick={() => setShowApiKeyModal(false)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg text-sm font-medium transition-colors dark:text-white"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors">
                    Generate
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SettingsPage;