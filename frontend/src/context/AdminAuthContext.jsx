import { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Import the theme context to detect dark/light mode
import { useTheme } from './ThemeContext';

const AdminAuthContext = createContext(null);

// Master credentials for testing
const MASTER_EMAIL = 'anuragverma08002@gmail.com';
const MASTER_PASSWORD = 'Anshverma$1234';

// Session timeout in ms (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Inactivity timeout in ms (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
// Session expiry warning threshold (2 minutes before expiry)
const SESSION_WARNING_THRESHOLD = 2 * 60 * 1000;

export const AdminAuthProvider = ({ children }) => {
  // Use theme context to detect dark or light mode
  const { isDarkMode } = useTheme ? useTheme() : { isDarkMode: false };
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminData, setAdminData] = useState({
    sessionValid: false,
    sessionExpired: false,
    elevatedPrivileges: false,
  });
  const [adminEmail, setAdminEmail] = useState(null);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const updateAdminData = useCallback((tokenTimestamp, email) => {
    const now = Date.now();
    let sessionExpired = false;
    let sessionValid = false;
    let elevatedPrivileges = false;

    if (tokenTimestamp) {
      sessionExpired = now - tokenTimestamp > SESSION_TIMEOUT;
      sessionValid = !sessionExpired;
      // Only master email has elevated privileges
      elevatedPrivileges = email === MASTER_EMAIL;
    }

    setAdminData({
      sessionValid,
      sessionExpired,
      elevatedPrivileges,
    });
  }, []);

  // Helper: Reset inactivity timer
  const resetInactivityTimer = () => setLastActivity(Date.now());

  // Initial session check: only run on mount
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    let tokenTimestamp = null;
    if (adminToken) {
      const parts = adminToken.split('-');
      tokenTimestamp = parseInt(parts[2], 10);
    }
    updateAdminData(tokenTimestamp, adminEmail);
    setIsAdmin(!!adminToken && tokenTimestamp && Date.now() - tokenTimestamp < SESSION_TIMEOUT);
    setIsLoading(false);
    setAdminEmail(adminEmail);
  }, []); // Only run on mount

  // Effect: Auto-logout on inactivity
  useEffect(() => {
    if (!isAdmin) return;
    const handleActivity = () => resetInactivityTimer();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 10000);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(interval);
    };
  }, [isAdmin, lastActivity]);

  // Effect: Session expiry warning
  useEffect(() => {
    if (!isAdmin) {
      setShowSessionWarning(false);
      return;
    }
    const adminToken = localStorage.getItem('adminToken');
    let tokenTimestamp = null;
    if (adminToken) {
      const parts = adminToken.split('-');
      tokenTimestamp = parseInt(parts[2], 10);
    }
    if (!tokenTimestamp) return;
    const expiryTime = tokenTimestamp + SESSION_TIMEOUT;
    const warningTime = expiryTime - SESSION_WARNING_THRESHOLD;
    const now = Date.now();
    if (now >= warningTime && now < expiryTime) {
      setShowSessionWarning(true);
    } else {
      setShowSessionWarning(false);
    }
    const timeout = setTimeout(() => {
      setShowSessionWarning(true);
    }, Math.max(warningTime - now, 0));
    return () => clearTimeout(timeout);
  }, [isAdmin, adminData, lastActivity]);

  const login = async (email, password, twoFactorCode = null, securityChecks = null) => {
    try {
      // Check against master credentials
      if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
        // For biometric login, we'll accept it as valid
        if (email === 'biometric') {
          const token = 'admin-token-' + Date.now(); // Generate a simple token
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminEmail', email);
          updateAdminData(Date.now(), email);
          setIsAdmin(true);
          return { success: true, ip: '127.0.0.1' }; // Mock IP for biometric
        }
        // For regular login, validate credentials
        const token = 'admin-token-' + Date.now(); // Generate a simple token
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminEmail', email);
        updateAdminData(Date.now(), email);
        setIsAdmin(true);
        return { success: true, ip: '127.0.0.1' }; // Mock IP
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminEmail');
    setIsAdmin(false);
    setAdminData({
      sessionValid: false,
      sessionExpired: false,
      elevatedPrivileges: false,
    });
  };

  const validateSession = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const adminEmail = localStorage.getItem('adminEmail');
      let tokenTimestamp = null;
      if (adminToken) {
        const parts = adminToken.split('-');
        tokenTimestamp = parseInt(parts[2], 10);
      }
      updateAdminData(tokenTimestamp, adminEmail);
      if (!adminToken || adminData.sessionExpired) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        setIsAdmin(false);
        return false;
      }
      setIsAdmin(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, [adminData.sessionExpired, updateAdminData]);

  const checkAdminPermissions = async () => {
    // Only allow if elevatedPrivileges is true
    return adminData.elevatedPrivileges;
  };

  // Manual session refresh
  const refreshSession = () => {
    if (!isAdmin) return;
    const adminToken = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminToken && adminEmail) {
      const newToken = 'admin-token-' + Date.now();
      localStorage.setItem('adminToken', newToken);
      updateAdminData(Date.now(), adminEmail);
      setShowSessionWarning(false);
    }
  };

  // Provide a wrapper that applies a background and text color for admin context
  // This ensures any admin-only UI is visually consistent with the current theme
  return (
    <AdminAuthContext.Provider value={{
      isAdmin,
      isLoading,
      login,
      logout,
      validateSession,
      adminData,
      checkAdminPermissions,
      adminEmail,
      showSessionWarning,
      refreshSession
    }}>
      <div
        className={isDarkMode ? 'dark' : 'light'}
        style={{
          backgroundColor: isDarkMode ? '#181f29' : '#f8fafc',
          color: isDarkMode ? '#e2e8f0' : '#1e293b',
          minHeight: '100vh',
          transition: 'background-color 0.2s, color 0.2s',
        }}
      >
        {children}
      </div>
    </AdminAuthContext.Provider>
  );
};

// Export the hook as a named export
export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === null) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}; 