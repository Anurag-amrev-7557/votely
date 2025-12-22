import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  Vote,
  Users,
  BarChart2,
  ShieldCheck,
  Settings,
  Award,
  LogOut,
  Plus,
  HelpCircle,
  FileText,
  Menu,
  X,
  Zap,
  Activity,
  ChevronRight,
  Cpu,
  Wifi,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  GripVertical
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import PollsPage from './PollsPage';
import UsersPage from './UsersPage';
import ResultsPage from './ResultsPage';
import SecurityPage from './SecurityPage';
import SettingsPage from './SettingsPage';
import AdminDashboard from './AdminDashboard';

import AdminNominations from '../../pages/admin/AdminNominations';
import adminAxios from '../../utils/api/adminAxios';

// --- VISUAL UTILITIES ---
const NoiseTexture = () => (
  <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
  </div>
);

const SpotlightEffect = ({ mouseX, mouseY }) => (
  <motion.div
    className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-500 group-hover:opacity-100"
    style={{
      background: useMotionTemplate`radial-gradient(
        400px circle at ${mouseX}px ${mouseY}px,
        rgba(255, 255, 255, 0.05),
        transparent 80%
      )`,
    }}
  />
);

// --- SIDEBAR MENU ITEM ---
const SidebarMenuItem = ({ icon, label, isActive, onClick, hasNotification, index, isCollapsed }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`group relative w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'gap-3 px-4'} py-1 rounded-xl transition-all duration-300 overflow-hidden ${isActive
        ? ''
        : ''
        } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
    >

      {/* Icon container */}
      <div className={`relative z-10 flex items-center justify-center transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-9 h-9'} rounded-lg ${isActive
        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
        : 'bg-gray-100 dark:bg-zinc-700/50 text-gray-600 dark:text-zinc-400 group-hover:bg-gray-200 dark:group-hover:bg-zinc-700 group-hover:text-gray-900 dark:group-hover:text-white'
        }`}>
        <motion.div
          whileHover={{ scale: 1.1, rotate: isActive ? 0 : 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {icon}
        </motion.div>
      </div>

      {/* Label */}
      {!isCollapsed && (
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 'auto' }}
          exit={{ opacity: 0, width: 0 }}
          className={`relative z-10 text-sm font-medium tracking-tight whitespace-nowrap overflow-hidden transition-colors duration-300 ${isActive
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-white'
            }`}
        >
          {label}
        </motion.span>
      )}

      {/* Arrow indicator */}
      {!isCollapsed && (
        <ChevronRight className={`ml-auto w-4 h-4 transition-all duration-300 ${isActive
          ? 'opacity-100 text-gray-900 dark:text-white translate-x-0'
          : 'opacity-0 -translate-x-2 text-gray-400'
          }`} />
      )}
    </motion.button>
  );
};

// --- SYSTEM STATUS WIDGET ---
const SystemStatusWidget = ({ isCollapsed, onToggle }) => {
  const [stats, setStats] = useState({ cpu: 34, memory: 56, network: 98 });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative p-4 rounded-2xl bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-700/50 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500">
            System
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
          </span>
          <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase">Live</span>
        </div>
      </div>

      <div className="space-y-3">
        {[
          { label: 'CPU', value: stats.cpu, icon: Cpu },
          { label: 'MEM', value: stats.memory, icon: Zap },
          { label: 'NET', value: stats.network, icon: Wifi },
        ].map((stat, i) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-medium text-gray-500 dark:text-zinc-500 uppercase tracking-wide">{stat.label}</span>
              <span className="text-xs font-mono font-bold text-gray-700 dark:text-zinc-300">{stat.value}%</span>
            </div>
            <div className="h-1 w-full bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.value}%` }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gray-900 dark:bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const AdminPage = () => {
  // ... (existing helper function calls)

  // ... (existing useEffect)

  // ... (menuItems definition from previous step will be here)

  // ... (rest of the component)

  // Inside return statement, inside Routes:
  /*
                <main className="flex-1" role="region" aria-labelledby="admin-main-heading" tabIndex={0}>
              <h1 id="admin-main-heading" className="sr-only">Admin Dashboard Main Content</h1>
              <Routes>
                <Route path="polls" element={<PollsPage />} />
                <Route path="nominations" element={<AdminNominations />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="results" element={<ResultsPage />} />
  */

  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { logout, adminEmail, showSessionWarning, refreshSession } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    // Set initial active tab based on current path
    const path = location.pathname.split('/').pop();
    return path === 'admin' ? 'dashboard' : path;
  });

  // Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Load saved preference
  useEffect(() => {
    const savedWidth = localStorage.getItem('adminSidebarWidth');
    const savedCollapsed = localStorage.getItem('adminSidebarCollapsed');
    if (savedWidth) setSidebarWidth(parseInt(savedWidth));
    if (savedCollapsed) setIsSidebarCollapsed(savedCollapsed === 'true');
  }, []);

  // Save preference
  useEffect(() => {
    localStorage.setItem('adminSidebarWidth', sidebarWidth);
    localStorage.setItem('adminSidebarCollapsed', isSidebarCollapsed);
  }, [sidebarWidth, isSidebarCollapsed]);

  // Resizing Logic
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      let newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth < 240) newWidth = 240;
      if (newWidth > 480) newWidth = 480;
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      path: 'dashboard',
      active: activeTab === 'dashboard',
    },
    {
      icon: <Award size={20} />,
      label: 'Nominations',
      path: 'nominations',
      active: activeTab === 'nominations',
    },

    {
      icon: <Vote size={20} />,
      label: 'Polls',
      path: 'polls',
      active: activeTab === 'polls',
    },
    {
      icon: <Users size={20} />,
      label: 'Users',
      path: 'users',
      active: activeTab === 'users',
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Results',
      path: 'results',
      active: activeTab === 'results',
    },
    {
      icon: <ShieldCheck size={20} />,
      label: 'Security',
      path: 'security',
      active: activeTab === 'security',
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      path: 'settings',
      active: activeTab === 'settings',
    },
  ];

  const recentActivity = [
    {
      timestamp: '2024-03-15 10:23 AM',
      action: 'Poll Created',
      user: 'Admin User',
      details: 'New poll \'City Council Election\' created',
      status: 'success',
    },
    {
      timestamp: '2024-03-15 11:45 AM',
      action: 'User Registered',
      user: 'System',
      details: 'New user \'Emily Carter\' registered',
      status: 'info',
    },
    {
      timestamp: '2024-03-15 01:12 PM',
      action: 'Vote Cast',
      user: 'Emily Carter',
      details: 'Vote cast in \'City Council Election\'',
      status: 'success',
    },
    {
      timestamp: '2024-03-15 02:30 PM',
      action: 'Security Log',
      user: 'System',
      details: 'Login attempt from unknown IP address',
      status: 'warning',
    },
    {
      timestamp: '2024-03-15 03:48 PM',
      action: 'Poll Closed',
      user: 'Admin User',
      details: 'Poll \'Student Body President\' closed',
      status: 'info',
    },
  ];

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-[#15191e]' : 'bg-gray-50'}`} role="status" aria-live="polite">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div role="main" aria-label="Admin main content" tabIndex={0}>
      {/* Session Expiry Warning Modal */}
      {showSessionWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="session-expiry-heading">
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-blue-200 dark:border-blue-800 animate-popIn">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 id="session-expiry-heading" className="text-xl font-bold text-gray-900 dark:text-white text-center">Session Expiring Soon</h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">Your admin session will expire in less than 2 minutes due to inactivity or session timeout.<br />Would you like to stay logged in?</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={refreshSession}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Layout */}
      <div className={`relative flex size-full min-h-screen flex-col ${isDarkMode ? 'bg-zinc-950' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="gap-1 p-3 flex flex-1 justify-center pt-1">
            {/* Sidebar */}
            <motion.aside
              ref={sidebarRef}
              initial={false}
              animate={{
                width: isSidebarCollapsed ? 80 : sidebarWidth,
                transition: { duration: isResizing ? 0 : 0.3, type: "spring", stiffness: 300, damping: 30 }
              }}
              className="layout-content-container flex flex-col shrink-0 relative group/sidebar print:hidden"
              role="complementary"
              aria-label="Admin sidebar navigation"
            >
              <div
                className={`flex h-[calc(100vh-5.5rem)] flex-col ${isDarkMode ? 'bg-zinc-900/80 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl'} rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 transition-all duration-300 relative overflow-hidden border border-gray-200/50 dark:border-zinc-700/50`}
              >
                {/* Top Section */}
                <div className={`mt-auto space-y-4 relative z-10 px-2 py-2`}>
                  {/* User Profile Card */}
                  <motion.div
                    layout
                    className={`relative rounded-2xl overflow-hidden transition-all ${isSidebarCollapsed ? 'p-2 flex flex-col gap-4 justify-center' : 'p-2'}`}
                  >
                    <div className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center mb-0' : 'mb-3'}`}>
                      <div className="relative group">
                        <div className="w-10 h-10 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 text-sm font-bold shadow-lg transition-transform duration-300 group-hover:scale-110">
                          {(adminEmail?.[0] || 'A').toUpperCase()}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-zinc-800">
                          <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />
                        </div>
                      </div>
                      {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            Admin User
                          </p>
                          <p className="text-xs text-gray-600 dark:text-zinc-500 truncate">
                            {adminEmail || 'admin@votely.io'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Logout Button */}
                    <motion.button
                      layout
                      onClick={handleLogout}
                      className={`group relative w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-3' : 'gap-2 px-3 py-3'} rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30 text-red-600 dark:text-red-400 font-medium transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:shadow-lg hover:shadow-red-500/10 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                      <LogOut className={`w-4 h-4 transition-transform group-hover:-translate-x-0.5 ${isSidebarCollapsed ? '' : ''}`} />
                      {!isSidebarCollapsed && <span className="text-sm">Sign Out</span>}
                    </motion.button>
                </motion.div>
                </div>



                {/* Navigation Menu */}
                <nav className={`flex-1 flex flex-col gap-6 relative z-10 overflow-y-auto overflow-x-hidden ${isSidebarCollapsed ? '' : 'px-0'}`}>
                  {/* Core Section */}
                  <div className="space-y-1">
                    {!isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-zinc-500">Core</span>
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {menuItems.slice(0, 3).map((item, index) => (
                      <SidebarMenuItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.active}
                        hasNotification={item.label === 'Polls'}
                        index={index}
                        isCollapsed={isSidebarCollapsed}
                        onClick={() => {
                          setActiveTab(item.path);
                          navigate(`/admin/${item.path}`);
                        }}
                      />
                    ))}
                  </div>

                  {/* Management Section */}
                  <div className="space-y-1">
                    {!isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-zinc-500">Manage</span>
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {menuItems.slice(3, 5).map((item, index) => (
                      <SidebarMenuItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.active}
                        index={index + 3}
                        isCollapsed={isSidebarCollapsed}
                        onClick={() => {
                          setActiveTab(item.path);
                          navigate(`/admin/${item.path}`);
                        }}
                      />
                    ))}
                  </div>

                  {/* System Section */}
                  <div className="space-y-1">
                    {!isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-zinc-500">System</span>
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {isSidebarCollapsed && (
                      <div className="flex items-center gap-2 px-2 mb-3">
                        <span className="h-px flex-1 bg-gray-200 dark:bg-zinc-700/50" />
                      </div>
                    )}
                    {menuItems.slice(5, 7).map((item, index) => (
                      <SidebarMenuItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        isActive={item.active}
                        index={index + 5}
                        isCollapsed={isSidebarCollapsed}
                        onClick={() => {
                          setActiveTab(item.path);
                          navigate(`/admin/${item.path}`);
                        }}
                      />
                    ))}
                  </div>
                </nav>
              </div>

              {/* Collapse Toggle (Moved Outside) */}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className={`absolute z-20 top-[calc(100vh-38rem)] -right-3 p-1.5 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 shadow-md text-gray-500 dark:text-zinc-400 hover:text-blue-500 hover:scale-110 transition-all duration-200 opacity-0 group-hover/sidebar:opacity-100 focus:opacity-100 ${isSidebarCollapsed ? 'rotate-180 translate-x-1' : ''}`}
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Resize Handle */}
              {!isSidebarCollapsed && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize z-10 flex items-center justify-center transition-opacity opacity-0 hover:opacity-100"
                  onMouseDown={startResizing}
                >
                  <div className="w-[1px] h-full bg-black/50 dark:bg-zinc-700/50" />
                </div>
              )}
            </motion.aside>
            {/* Main Content */}
            <main className="flex-1 min-w-0" role="region" aria-labelledby="admin-main-heading" tabIndex={0}>
              <h1 id="admin-main-heading" className="sr-only">Admin Dashboard Main Content</h1>
              <Routes>

                <Route path="polls" element={<PollsPage />} />
                <Route path="nominations" element={<AdminNominations />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="security" element={<SecurityPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="*" element={<AdminDashboard isDarkMode={isDarkMode} />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      {/* Advanced Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
        >
          {/* Animated Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
            onClick={() => setShowLogoutConfirm(false)}
            aria-label="Close logout modal"
          />
          {/* Modal Content */}
          <div
            className={`relative rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transition-all duration-300 transform scale-100 ${isDarkMode
              ? 'bg-gradient-to-br from-[#232b36] via-[#2c353f] to-[#1a202c] border border-gray-700'
              : 'bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200'
              } animate-modalPop`}
            role="document"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-desc"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close"
              tabIndex={0}
            >
              <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </button>
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div
                className={`rounded-full p-3 shadow-lg ${isDarkMode
                  ? 'bg-red-900/30'
                  : 'bg-red-100'
                  } animate-pulse`}
              >
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                  />
                </svg>
              </div>
            </div>
            {/* Title */}
            <h3
              id="logout-modal-title"
              className={`text-xl font-bold mb-2 text-center ${isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
            >
              Confirm Logout
            </h3>
            {/* Description */}
            <p
              id="logout-modal-desc"
              className={`mb-6 text-center ${isDarkMode ? 'text-[#a0acbb]' : 'text-gray-600'
                }`}
            >
              Are you sure you want to log out? <span className="font-medium">Any unsaved changes will be lost.</span>
              <br />
              <span className="text-xs block mt-2 opacity-80">
                For your security, you will be signed out of the admin dashboard.
              </span>
            </p>
            {/* Accessibility: Focus trap */}
            <div tabIndex={0} aria-hidden="true" />
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800`}
                autoFocus
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
                  ${isDarkMode
                    ? 'bg-gradient-to-r from-red-700 via-red-600 to-red-500 hover:from-red-800 hover:to-red-600 text-white shadow-md'
                    : 'bg-gradient-to-r from-red-500 via-red-400 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-800`}
                aria-label="Confirm logout"
              >
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7" />
                  </svg>
                  Logout
                </span>
              </button>
            </div>
            {/* Accessibility: Focus trap */}
            <div tabIndex={0} aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Animations & Styles */}
      <style>
        {`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              .animate-fadeIn {
                animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1);
              }
              @keyframes modalPop {
                0% { opacity: 0; transform: scale(0.95) translateY(20px);}
                100% { opacity: 1; transform: scale(1) translateY(0);}
              }
              .animate-modalPop {
                animation: modalPop 0.3s cubic-bezier(.4,0,.2,1);
              }
          
          /* Container queries for responsive column hiding */
          @container (max-width: 120px) {
            .table-column-120 { display: none !important; }
          }
          @container (max-width: 240px) {
            .table-column-240 { display: none !important; }
          }
          @container (max-width: 360px) {
            .table-column-360 { display: none !important; }
          }
          @container (max-width: 480px) {
            .table-column-480 { display: none !important; }
          }
          @container (max-width: 640px) {
            .table-column-640 { display: none !important; }
          }
          @container (max-width: 768px) {
            .table-column-768 { display: none !important; }
          }
          @container (max-width: 900px) {
            .table-column-900 { display: none !important; }
          }

          /* Smooth fade/slide transitions for columns */
          .responsive-table th,
          .responsive-table td {
            transition: opacity 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
            will-change: opacity, transform;
          }
          .responsive-table [style*="display: none"] {
            opacity: 0 !important;
            transform: translateX(-20px) scale(0.95);
            pointer-events: none;
          }

          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .responsive-table {
              background-color: #181c23;
              color: #e5e7eb;
            }
            .responsive-table th, .responsive-table td {
              border-color: #23272f;
            }
          }

          /* Print-friendly: always show all columns on print */
          @media print {
            .responsive-table th,
            .responsive-table td {
              display: table-cell !important;
              opacity: 1 !important;
              transform: none !important;
            }
          }

          /* Accessibility: focus highlight for table cells */
          .responsive-table td:focus, .responsive-table th:focus {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
            z-index: 1;
            position: relative;
          }
        `}
      </style>
    </div >
  );
};

export default AdminPage;