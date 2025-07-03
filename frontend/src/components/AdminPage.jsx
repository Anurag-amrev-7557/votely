import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import PollsPage from './admin/PollsPage';
import UsersPage from './admin/UsersPage';
import ResultsPage from './admin/ResultsPage';
import SecurityPage from './admin/SecurityPage';
import SettingsPage from './admin/SettingsPage';
import AdminDashboard from './admin/AdminDashboard';

const AdminPage = () => {
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

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z"></path>
        </svg>
      ),
      label: 'Dashboard',
      path: 'dashboard',
      active: activeTab === 'dashboard',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z"></path>
        </svg>
      ),
      label: 'Polls',
      path: 'polls',
      active: activeTab === 'polls',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92ZM40,108a44,44,0,1,1,44,44A44.05,44.05,0,0,1,40,108Zm210.14,98.7a8,8,0,0,1-11.07-2.33A79.83,79.83,0,0,0,172,168a8,8,0,0,1,0-16,44,44,0,1,0-16.34-84.87,8,8,0,1,1-5.94-14.85,60,60,0,0,1,55.53,105.64,95.83,95.83,0,0,1,47.22,37.71A8,8,0,0,1,250.14,206.7Z"></path>
        </svg>
      ),
      label: 'Users',
      path: 'users',
      active: activeTab === 'users',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M216,40H48A16,16,0,0,0,32,56V58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
        </svg>
      ),
      label: 'Results',
      path: 'results',
      active: activeTab === 'results',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M208,40H48A16,16,0,0,0,32,56v58.78c0,89.61,75.82,119.34,91,124.39a15.53,15.53,0,0,0,10,0c15.2-5.05,91-34.78,91-124.39V56A16,16,0,0,0,208,40Zm0,74.79c0,78.42-66.35,104.62-80,109.18-13.53-4.51-80-30.69-80-109.18V56H208ZM82.34,141.66a8,8,0,0,1,11.32-11.32L112,148.68l50.34-50.34a8,8,0,0,1,11.32,11.32l-56,56a8,8,0,0,1-11.32,0Z"></path>
        </svg>
      ),
      label: 'Security',
      path: 'security',
      active: activeTab === 'security',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z"></path>
        </svg>
      ),
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
              <p className="text-gray-600 dark:text-gray-300 text-center">Your admin session will expire in less than 2 minutes due to inactivity or session timeout.<br/>Would you like to stay logged in?</p>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={refreshSession}
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-colors"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={logout}
                  className="px-5 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Logout Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Layout */}
      <div className={`relative flex size-full min-h-screen flex-col ${isDarkMode ? 'bg-[#15191e]' : 'bg-gray-50'} transition-colors duration-200`}>
        <div className="layout-container flex h-full grow flex-col">
          <div className="gap-1 px-6 mt-16 flex flex-1 justify-center py-5">
            {/* Sidebar */}
            <aside className="layout-content-container flex flex-col w-90" role="complementary" aria-label="Admin sidebar navigation" tabIndex={0}>
              <div className={`flex h-full min-h-[700px] flex-col ${isDarkMode ? 'bg-[#15191e]' : 'bg-white'} p-6 rounded-xl shadow-sm transition-all duration-200 relative overflow-hidden`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 0)`,
                    backgroundSize: '24px 24px'
                  }}></div>
                </div>

                {/* Profile Section */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative group">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-110">
                      AS
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-[#15191e] shadow-lg shadow-green-500/20">
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={`text-base font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Admin User</h2>
                    <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{adminEmail || 'admin@votesafe.com'}</p>
                  </div>
                  <button className={`p-2 rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'hover:bg-[#2c353f] text-gray-400 hover:text-white' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex flex-col gap-1 mt-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden ${
                        item.active 
                          ? isDarkMode 
                            ? 'bg-[#2c353f] text-white' 
                            : 'bg-blue-50 text-blue-600'
                          : isDarkMode
                            ? 'text-gray-400 hover:bg-[#2c353f] hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => {
                        setActiveTab(item.path);
                        navigate(`/admin/${item.path}`);
                      }}
                    >
                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <div className={`transition-colors duration-200 ${
                        item.active
                          ? isDarkMode
                            ? 'text-white'
                            : 'text-blue-600'
                          : isDarkMode
                            ? 'text-gray-400 group-hover:text-white'
                            : 'text-gray-500 group-hover:text-gray-900'
                      }`}>
                        {item.icon}
                      </div>
                      <span className={`text-sm font-medium transition-colors duration-200 ${
                        item.active
                          ? isDarkMode
                            ? 'text-white'
                            : 'text-blue-600'
                          : isDarkMode
                            ? 'text-gray-400 group-hover:text-white'
                            : 'text-gray-600 group-hover:text-gray-900'
                      }`}>
                        {item.label}
                      </span>
                      {item.active && (
                        <div className={`ml-auto w-1 h-6 rounded-full ${
                          isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                        }`} />
                      )}
                      {/* Notification Badge */}
                      {item.label === 'Polls' && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col gap-4 pt-6 border-t border-gray-200 dark:border-gray-700 relative">
                {/* Quick Actions */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Quick Actions
                    </h3>
                    <button className={`text-xs font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
                      View All
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button className={`group flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-[#2c353f] text-gray-200 hover:bg-[#3a4552]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      New Poll
                    </button>
                    <button className={`group flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                      isDarkMode
                        ? 'bg-[#2c353f] text-gray-200 hover:bg-[#3a4552]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Help
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#2c353f]' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>System Status</span>
                    <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      All Systems Operational
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="block">CPU Load</span>
                      <span className="font-medium text-green-500">32%</span>
                    </div>
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <span className="block">Memory</span>
                      <span className="font-medium text-green-500">45%</span>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`group flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                    isDarkMode
                      ? 'bg-red-600/10 text-red-400 hover:bg-red-600/20'
                      : 'bg-red-50 text-red-600 hover:bg-red-100'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 8a1 1 0 10-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Logout
                </button>
              </div>
            </aside>
            {/* Main Content */}
            <main className="flex-1" role="region" aria-labelledby="admin-main-heading" tabIndex={0}>
              <h1 id="admin-main-heading" className="sr-only">Admin Dashboard Main Content</h1>
              <Routes>
                <Route path="polls" element={<PollsPage />} />
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
            className={`relative rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transition-all duration-300 transform scale-100 ${
              isDarkMode
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
              className="absolute top-4 right-4 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Close"
              tabIndex={0}
            >
              <svg
                className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div
                className={`rounded-full p-3 shadow-lg ${
                  isDarkMode
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
              className={`text-xl font-bold mb-2 text-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              Confirm Logout
            </h3>
            {/* Description */}
            <p
              id="logout-modal-desc"
              className={`mb-6 text-center ${
                isDarkMode ? 'text-[#a0acbb]' : 'text-gray-600'
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
                  }`}
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
                  }`}
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
          {/* Animations */}
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
            `}
          </style>
        </div>
      )}

      {/* 
        Advanced Responsive Table Styles:
        - Uses @container queries for fine-grained column hiding
        - Adds smooth transitions for column appearance/disappearance
        - Supports dark mode and accessibility
        - Includes print-friendly adjustments
        - Animates column visibility for enhanced UX
      */}
      <style>
        {`
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
    </div>
  );
};

export default AdminPage; 