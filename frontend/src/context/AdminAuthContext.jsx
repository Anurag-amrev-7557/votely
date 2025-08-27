import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
// Import the theme context to detect dark/light mode
import { useTheme } from './ThemeContext';

const AdminAuthContext = createContext(null);

AdminAuthContext.displayName = 'AdminAuthContext';

// Master credentials for testing
const MASTER_EMAIL = 'anuragverma08002@gmail.com';
const MASTER_PASSWORD = 'Anshverma$1234';

// Session timeout in ms (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Inactivity timeout in ms (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
// Session expiry warning threshold (2 minutes before expiry)
const SESSION_WARNING_THRESHOLD = 2 * 60 * 1000;

const REQUIRE_2FA = import.meta.env.VITE_REQUIRE_2FA === 'true'; // for Vite
const TWO_FA_CODE = import.meta.env.VITE_2FA_CODE; // for Vite

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

  const lastActivityRef = useRef(lastActivity);
  useEffect(() => {
    lastActivityRef.current = lastActivity;
  }, [lastActivity]);

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
      if (Date.now() - lastActivityRef.current > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 10000);
    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      clearInterval(interval);
    };
    // Only depend on isAdmin!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

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
      // Enhanced: Add support for 2FA, security checks, and logging
      const logAttempt = (success, reason = '') => {
        // You could send this to a logging endpoint or just log locally
        console.info(`[Admin Login] Email: ${email}, Success: ${success}, Reason: ${reason}, Time: ${new Date().toISOString()}`);
      };

      // Biometric login shortcut (for demo/dev)
      if (email === 'biometric') {
        const token = 'admin-token-' + Date.now();
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminEmail', email);
        updateAdminData(Date.now(), email);
        setIsAdmin(true);
        logAttempt(true, 'Biometric');
        return { success: true, ip: '127.0.0.1', method: 'biometric' };
      }

      // Check against master credentials
      if (email === MASTER_EMAIL && password === MASTER_PASSWORD) {
        // Optional: Enforce 2FA if enabled
        if (REQUIRE_2FA) {
          if (!twoFactorCode || twoFactorCode !== TWO_FA_CODE) {
            logAttempt(false, '2FA required or invalid');
            return { success: false, error: 'Two-factor authentication required or invalid code.' };
          }
        }

        // Optional: Security checks (e.g., IP, device, etc.)
        if (securityChecks && typeof securityChecks === 'function') {
          const securityResult = await securityChecks(email);
          if (!securityResult.success) {
            logAttempt(false, 'Security check failed');
            return { success: false, error: 'Security check failed.' };
          }
        }

        const token = 'admin-token-' + Date.now();
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminEmail', email);
        updateAdminData(Date.now(), email);
        setIsAdmin(true);
        logAttempt(true, 'Master credentials');
        // Optionally, get real IP from a service or backend
        return { success: true, ip: '127.0.0.1', method: 'password' };
      }

      logAttempt(false, 'Invalid credentials');
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const logout = () => {
    try {
      // Remove all admin-related data from localStorage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminSessionStart');
      localStorage.removeItem('admin2FA');
      // Optionally clear any session warnings or other admin UI state
      if (typeof setShowSessionWarning === 'function') {
        setShowSessionWarning(false);
      }
      setIsAdmin(false);
      setAdminData({
        sessionValid: false,
        sessionExpired: false,
        elevatedPrivileges: false,
        email: null,
        sessionStart: null,
      });
      // Optionally, redirect to login or home page
      if (typeof window !== 'undefined' && window.location) {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Optionally, show a notification to the user
    }
  };

  const validateSession = useCallback(async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const adminEmail = localStorage.getItem('adminEmail');
      let tokenTimestamp = null;
      let isTokenValid = false;

      if (adminToken) {
        const parts = adminToken.split('-');
        if (parts.length === 3 && !isNaN(parseInt(parts[2], 10))) {
          tokenTimestamp = parseInt(parts[2], 10);

          // Enhance: Check if token is not expired (e.g., 2 hours validity)
          const now = Date.now();
          const maxSessionDuration = 2 * 60 * 60 * 1000; // 2 hours in ms
          if (now - tokenTimestamp < maxSessionDuration) {
            isTokenValid = true;
          }
        }
      }

      updateAdminData(tokenTimestamp, adminEmail);

      if (!adminToken || !isTokenValid || adminData.sessionExpired) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        setIsAdmin(false);
        // Optionally, notify user of session expiration
        if (typeof setShowSessionWarning === 'function') {
          setShowSessionWarning(true);
        }
        return false;
      }

      setIsAdmin(true);

      // Optionally, proactively refresh session if it's about to expire (e.g., < 10 min left)
      if (tokenTimestamp) {
        const now = Date.now();
        const timeLeft = (tokenTimestamp + 2 * 60 * 60 * 1000) - now;
        if (timeLeft < 10 * 60 * 1000 && typeof refreshSession === 'function') {
          refreshSession();
        }
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      // Optionally, show a notification to the user
      return false;
    }
  }, [adminData.sessionExpired, updateAdminData]);

  /**
   * Enhanced permission check for admin actions.
   * Optionally accepts a permission string for future extensibility.
   * Returns an object with more info for UI/UX (e.g., for tooltips or logging).
   */
  const checkAdminPermissions = async (permission = null) => {
    // Only allow if elevatedPrivileges is true
    // In the future, you could check for specific permissions here
    const allowed = !!adminData.elevatedPrivileges;
    return {
      allowed,
      reason: allowed
        ? 'Elevated privileges granted.'
        : 'Insufficient privileges. Only master admin can perform this action.',
      checkedPermission: permission,
      adminEmail,
      timestamp: Date.now(),
    };
  };

  /**
   * Enhanced manual session refresh.
   * - Optionally accepts a force parameter to allow forced refresh.
   * - Returns a boolean indicating if refresh was successful.
   * - Updates session warning and admin data.
   */
  const refreshSession = (force = false) => {
    if (!isAdmin && !force) return false;
    const adminToken = localStorage.getItem('adminToken');
    const adminEmail = localStorage.getItem('adminEmail');
    if (adminToken && adminEmail) {
      const newToken = 'admin-token-' + Date.now();
      localStorage.setItem('adminToken', newToken);
      updateAdminData(Date.now(), adminEmail);
      setShowSessionWarning(false);
      // Optionally, show a notification or log the refresh
      // e.g., toast('Session refreshed successfully');
      return true;
    }
    return false;
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

// Enhanced useAdminAuth hook with additional developer-friendly features
import { useDebugValue } from 'react';

/**
 * Custom hook to access the AdminAuthContext.
 * - Throws a descriptive error if used outside the provider.
 * - Adds React DevTools debug value for easier inspection.
 * - Optionally accepts a selector function for performance optimization.
 */
export const useAdminAuth = (selector) => {
  const context = useContext(AdminAuthContext);
  if (context === null) {
    throw new Error(
      'useAdminAuth must be used within an AdminAuthProvider. ' +
      'Make sure your component is wrapped in <AdminAuthProvider>.'
    );
  }
  // Add debug value for React DevTools
  useDebugValue(context, ctx => ({
    isAdmin: ctx.isAdmin,
    adminEmail: ctx.adminEmail,
    sessionValid: ctx.adminData?.sessionValid,
    sessionExpired: ctx.adminData?.sessionExpired,
    elevatedPrivileges: ctx.adminData?.elevatedPrivileges,
  }));

  // Support selector pattern for performance (optional)
  if (typeof selector === 'function') {
    return selector(context);
  }
  return context;
};