import React, { useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Unlock,
  Key,
  Smartphone,
  Globe,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Fingerprint,
  RefreshCw,
  LogOut,
  Search,
  Chrome,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  MapPin
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import adminAxios from '../../utils/api/adminAxios';
import { startRegistration } from '@simplewebauthn/browser';
import { toast } from '../../utils/toastUtils';
import { useAuth } from '../../context/AuthContext';

// --- VISUAL UTILITIES ---
const NoiseTexture = () => (
  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

const SpotlightEffect = ({ mouseX, mouseY }) => (
  <motion.div
    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
    style={{
      background: useMotionTemplate`radial-gradient(
        650px circle at ${mouseX}px ${mouseY}px,
        rgba(14, 165, 233, 0.08),
        transparent 80%
      )`,
    }}
  />
);

// --- ILLUSTRATION COMPONENT ---
const SecurityShieldIllustration = ({ score }) => {
  const color = score >= 90 ? '#10b981' : score >= 70 ? '#eab308' : '#ef4444'; // green, yellow, red

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      {/* Outer Rotating Ring (Dashed) */}
      <motion.div
        className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-full opacity-30 will-change-transform"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {/* Middle Rotating Ring (Reverse) */}
      <motion.div
        className="absolute inset-4 border border-gray-300 dark:border-gray-600 rounded-full opacity-40 will-change-transform"
        style={{ borderTopColor: 'transparent', borderLeftColor: 'transparent' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulse Wave */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
      />

      {/* Glowing Core Background */}
      <div className="absolute w-40 h-40 bg-white dark:bg-zinc-900 rounded-full shadow-lg flex items-center justify-center z-10">
        <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ backgroundColor: color }} />
      </div>

      {/* Shield Icon with Gradient Fill */}
      <motion.div
        className="relative z-20 flex flex-col items-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      >
        <Shield
          className="w-20 h-20 drop-shadow-lg"
          style={{ color: color, fill: `${color}20` }}
          strokeWidth={1.5}
        />
        <motion.span
          className="mt-2 text-4xl font-black tracking-tighter"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: color }}
        >
          {score}
        </motion.span>
      </motion.div>

      {/* Floating Data Blips */}
      <motion.div className="absolute top-10 right-10 w-2 h-2 rounded-full bg-blue-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      <motion.div className="absolute bottom-12 left-12 w-2 h-2 rounded-full bg-blue-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 1.5 }} />
      <motion.div className="absolute top-1/2 left-2 w-1.5 h-1.5 rounded-full bg-purple-400" animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />

      {/* Scanning Radar Sector */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, transparent 300deg, ${color}30 360deg)`,
          borderRadius: '50%',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// --- DATA ---
const dummyActivity = [
  { type: 'login', desc: 'Logged in', time: '2024-06-01 10:23', device: 'Chrome on Mac', ip: '192.168.1.2', location: 'New York, USA', icon: Key },
  { type: '2fa', desc: 'Enabled 2FA', time: '2024-05-30 09:10', device: 'Chrome on Mac', ip: '192.168.1.2', location: 'New York, USA', icon: ShieldCheck },
  { type: 'password', desc: 'Changed password', time: '2024-05-20 14:45', device: 'Safari on iPhone', ip: '192.168.1.3', location: 'San Francisco, USA', icon: Lock },
  { type: 'login', desc: 'Logged in', time: '2024-05-18 08:00', device: 'Firefox on Windows', ip: '192.168.1.4', location: 'London, UK', icon: Key },
  { type: '2fa', desc: 'Disabled 2FA', time: '2024-05-15 12:30', device: 'Edge on Windows', ip: '192.168.1.5', location: 'Berlin, DE', icon: AlertTriangle },
  { type: 'password', desc: 'Changed password', time: '2024-05-10 14:45', device: 'Safari on iPhone', ip: '192.168.1.3', location: 'San Francisco, USA', icon: Lock },
];

const dummySessions = [
  { id: 1, device: 'Chrome on Mac', browser: 'chrome', os: 'mac', ip: '192.168.1.2', location: 'New York, USA', lastActive: '2 min ago', current: true },
  { id: 2, device: 'Safari on iPhone', browser: 'safari', os: 'ios', ip: '192.168.1.3', location: 'San Francisco, USA', lastActive: '1 day ago', current: false },
];

const backupCodes = ['8F3D-2A1B', '9C7E-4B2F', '1A2B-3C4D', '5E6F-7G8H', '2J3K-4L5M'];

const passwordRequirements = [
  { label: 'At least 8 characters', test: pwd => pwd.length >= 8 },
  { label: 'At least one uppercase letter', test: pwd => /[A-Z]/.test(pwd) },
  { label: 'At least one number', test: pwd => /[0-9]/.test(pwd) },
  { label: 'At least one special character', test: pwd => /[^A-Za-z0-9]/.test(pwd) },
];

const initialTips = [
  { id: 1, type: 'warning', icon: AlertCircle, text: 'Your password is over 90 days old. Consider changing it.', action: 'Change Password' },
  { id: 2, type: 'info', icon: CheckCircle, text: 'No unusual login activity detected.', action: null },
];

/* Optimized BentoCard with cached bounds to prevent layout thrashing */
const BentoCard = ({ children, className = '', glowColor = 'blue' }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardRef = React.useRef(null);
  const bounds = React.useRef(null);

  const handleMouseEnter = (e) => {
    bounds.current = e.currentTarget.getBoundingClientRect();
    const { left, top } = bounds.current;
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseMove = (e) => {
    if (!bounds.current) return;
    const { left, top } = bounds.current;
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const handleMouseLeave = () => {
    bounds.current = null;
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-500 rounded-3xl p-6 ${className}`}
    >
      <NoiseTexture />
      <SpotlightEffect mouseX={mouseX} mouseY={mouseY} />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
};

const SecurityPage = () => {
  const { user, setUser } = useAuth();
  const { isDarkMode } = useTheme();

  // State
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
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showDisable2FAConfirm, setShowDisable2FAConfirm] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [tips, setTips] = useState(initialTips);
  const [loading, setLoading] = useState(true);

  const ACTIVITY_PAGE_SIZE = 5;

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const checkStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 7) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    setPwdStrength(score);
  };

  const pwdReqs = passwordRequirements.map(req => ({ ...req, met: req.test(password) }));
  const securityScore = (is2FAEnabled ? 50 : 0) + (pwdStrength * 10) + 30;

  const filteredActivity = dummyActivity.filter(a =>
    (activityType === 'all' || a.type === activityType) &&
    (a.desc.toLowerCase().includes(search.toLowerCase()) ||
      a.device.toLowerCase().includes(search.toLowerCase()))
  );

  const pagedActivity = filteredActivity.slice((activityPage - 1) * ACTIVITY_PAGE_SIZE, activityPage * ACTIVITY_PAGE_SIZE);

  const handleRegisterBiometric = async () => {
    try {
      const resp = await adminAxios.get('/auth/webauthn/register/options');
      const options = resp.data;
      let attResp;
      try {
        attResp = await startRegistration({ optionsJSON: options });
      } catch (error) {
        if (error.name === 'InvalidStateError') toast.error('Device already registered.');
        else toast.error('Registration cancelled or failed.');
        return;
      }
      const verificationResp = await adminAxios.post('/auth/webauthn/register/verify', attResp);
      if (verificationResp.data.verified) {
        toast.success('Biometric device registered successfully!');
        const userResp = await adminAxios.get('/auth/me');
        setUser(userResp.data);
      } else {
        toast.error('Verification failed. Try again.');
      }
    } catch (error) {
      toast.error('Failed to initiate biometric registration.');
    }
  };



  return (
    <div className="min-h-screen w-full p-6 md:p-8 space-y-8 pb-24 animate-fade-in font-sans">
      {/* Header */}
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 mb-2">
            System Defense
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Security <span className="text-gray-600 dark:text-zinc-400">Center.</span>
          </h1>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

        {/* 1. Security Score Hero (Large) */}
        <BentoCard className="md:col-span-4 md:row-span-2 flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-zinc-800/50 dark:to-zinc-900/50">
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-blue-900 dark:text-blue-200">Safety Score</span>
          </div>

          <div className="my-8">
            <SecurityShieldIllustration score={securityScore} />
          </div>

          <div className="absolute bottom-6 w-full px-8">
            <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              <span>Vulnerable</span>
              <span>Secure</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${securityScore}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full rounded-full ${securityScore >= 90 ? 'bg-green-500' : securityScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
              />
            </div>
          </div>
        </BentoCard>

        {/* 2. Biometric Auth */}
        <BentoCard className="md:col-span-4 md:row-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-2xl">
              <Fingerprint className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            {user?.passkeys?.length > 0 && (
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Active
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Biometrics</h3>
          <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4 line-clamp-2">
            Secure your account with FaceID, TouchID or Windows Hello.
          </p>
          <button
            onClick={handleRegisterBiometric}
            className="w-full py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all border border-transparent dark:border-zinc-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
          >
            {user?.passkeys?.length > 0 ? 'Add Another Device' : 'Register Device'}
          </button>
        </BentoCard>

        {/* 3. 2FA Status */}
        <BentoCard className="md:col-span-4 md:row-span-1">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl">
              <Smartphone className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${is2FAEnabled ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
              {is2FAEnabled ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
              {is2FAEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Two-Factor</h3>
          <p className="text-sm text-gray-600 dark:text-zinc-300 mb-4">
            Extra layer of security using authenticator app.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => is2FAEnabled ? setShowDisable2FAConfirm(true) : setShow2FAModal(true)}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {is2FAEnabled ? 'Manage' : 'Enable'}
            </button>
            {is2FAEnabled && (
              <button
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                title="View Backup Codes"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </BentoCard>

        {/* 4. Password Management */}
        <BentoCard className="md:col-span-8 md:row-span-1 overflow-visible">
          <div className="flex items-center gap-4 h-full">
            <div className="hidden md:flex flex-col items-center justify-center w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex-shrink-0 relative overflow-hidden">
              <Key className="w-10 h-10 text-orange-500 dark:text-orange-400 relative z-10" />
              <div className="absolute inset-0 bg-orange-200 dark:bg-orange-800 opacity-20 animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Password & Authentication</h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-zinc-400">
                <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Updated 24 days ago</span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-600" />
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Strong</span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => setShowPwdModal(true)} className="px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-sm font-bold tracking-wide hover:shadow-lg transition-transform hover:-translate-y-0.5 border-none">
                  Change Password
                </button>
                <button className="px-5 py-2.5 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                  Reset Options
                </button>
              </div>
            </div>
            {/* Visual Password Strength Pattern */}
            <div className="hidden lg:flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`w-2 h-8 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-zinc-700'}`} />
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 5. Active Sessions (Map placeholder) */}
        <BentoCard className="md:col-span-6 md:row-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Active Sessions</h3>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold">
                {dummySessions.length} active
              </span>
            </div>
            <button className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1">
              <LogOut className="w-3 h-3" /> Revoke All
            </button>
          </div>

          <div className="space-y-3">
            {dummySessions.map(session => (
              <button key={session.id} className="w-full text-left group/session flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-800/80 border border-gray-100 dark:border-zinc-700/50 hover:border-gray-300 dark:hover:border-zinc-600 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                onClick={() => { setSelectedSession(session); setShowRevokeModal(true); }}>
                <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-zinc-900 flex items-center justify-center text-xl">
                  {session.browser === 'chrome' ? <Chrome className="w-5 h-5 text-gray-900 dark:text-white" /> : <Globe className="w-5 h-5 text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{session.device}</h4>
                    {session.current && <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Current</span>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-zinc-400 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.location}</span>
                    <span>•</span>
                    <span>{session.ip}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-gray-900 dark:text-white">{session.lastActive}</div>
                </div>
              </button>
            ))}
          </div>
        </BentoCard>

        {/* 6. Activity Log */}
        <BentoCard className="md:col-span-6 md:row-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search details..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-32 bg-gray-100 dark:bg-zinc-800 border-none rounded-lg py-1.5 pl-8 pr-3 text-xs focus:ring-1 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                />
              </div>
              <select
                value={activityType}
                onChange={e => setActivityType(e.target.value)}
                className="bg-gray-100 dark:bg-zinc-800 border-none rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-blue-500 text-gray-900 dark:text-white"
              >
                <option value="all">All</option>
                <option value="login">Login</option>
                <option value="2fa">2FA</option>
                <option value="password">Security</option>
              </select>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-zinc-800" />

            <div className="space-y-6 h-full overflow-y-auto pr-2 custom-scrollbar">
              {pagedActivity.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="relative flex items-start gap-4 pl-2 group/item">
                    <div className="absolute left-6 top-2 w-2 h-2 -ml-1 rounded-full bg-white dark:bg-zinc-900 border-2 border-blue-500 z-10 transition-transform group-hover/item:scale-125" />
                    <div className="mt-0.5 p-2 rounded-lg bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 text-gray-600 dark:text-zinc-400 transition-colors group-hover/item:bg-blue-50 dark:group-hover/item:bg-blue-900/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors">{item.desc}</p>
                      <p className="text-xs text-gray-600 dark:text-zinc-400 mt-0.5 flex items-center gap-2">
                        <span>{item.time}</span>
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-400" />
                        <span>{item.location}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BentoCard>

      </div>

      {/* Modals - Keeping simplistic for now, could convert to AnimatedModal later */}
      <AnimatePresence>
        {showPwdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-zinc-800">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Change Password</h3>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showPasswordInput ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); checkStrength(e.target.value); }}
                    placeholder="New Password"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border-none ring-1 ring-gray-200 dark:ring-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                  />
                  <button onClick={() => setShowPasswordInput(!showPasswordInput)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
                    {showPasswordInput ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="h-1.5 w-full bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${pwdStrength < 2 ? 'bg-red-500' : pwdStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${(pwdStrength / 4) * 100}%` }} />
                </div>
                <div className="space-y-2">
                  {pwdReqs.map((req, i) => (
                    <div key={i} className={`flex items-center gap-2 text-xs transition-colors ${req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-zinc-600'}`}>
                      {req.met ? <CheckCircle className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
                      {req.label}
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex gap-3">
                  <button onClick={() => setShowPwdModal(false)} className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500">Cancel</button>
                  <button className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">Update</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global background styles */}
      <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(156, 163, 175, 0.5);
                    border-radius: 4px;
                }
             `}</style>
    </div>
  );
};

export default SecurityPage;