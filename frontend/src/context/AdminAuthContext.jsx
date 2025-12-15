import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
// Import the theme context to detect dark/light mode
import { useTheme } from './ThemeContext';

const AdminAuthContext = createContext(null);

AdminAuthContext.displayName = 'AdminAuthContext';

// Master credentials for testing

// Access control constants
const ADMIN_ROLES = ['admin', 'election_committee'];


// Session timeout in ms (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;
// Inactivity timeout in ms (15 minutes)
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
// Session expiry warning threshold (2 minutes before expiry)
const SESSION_WARNING_THRESHOLD = 2 * 60 * 1000;

const REQUIRE_2FA = import.meta.env.VITE_REQUIRE_2FA === 'true'; // for Vite
const TWO_FA_CODE = import.meta.env.VITE_2FA_CODE; // for Vite

export const AdminAuthProvider = ({ children }) => {
  const { user } = useAuth();
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
      // Derived from user role in AuthContext
      elevatedPrivileges = email && user && user.role === 'admin';
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

  // Sync with main AuthContext
  useEffect(() => {
    if (user && ADMIN_ROLES.includes(user.role)) {
      // Allow access if user has correct role
    } else if (user && !ADMIN_ROLES.includes(user.role)) {
      // Revoke if user logged in but not admin
      if (isAdmin) logout();
    }
  }, [user]);

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

  const login = async (email, password, twoFactorCode = null, securityChecks = null, explicitUser = null) => {
    try {
      // Enhanced: Rely on main AuthContext or explicitUser for login

      const logAttempt = (success, reason = '') => {
        console.info(`[Admin Login] Email: ${email}, Success: ${success}, Reason: ${reason}, Time: ${new Date().toISOString()}`);
      };

      const currentUser = explicitUser || user;

      // If already logged in as user, check role
      // Note: Comparing trim() just in case
      if (currentUser && currentUser.email.trim() === email.trim()) {
        if (ADMIN_ROLES.includes(currentUser.role)) {
          const token = 'admin-token-' + Date.now();
          localStorage.setItem('adminToken', token);
          localStorage.setItem('adminEmail', email);
          updateAdminData(Date.now(), email);
          setIsAdmin(true);
          logAttempt(true, 'Role Verification Success');
          return { success: true };
        } else {
          logAttempt(false, 'Insufficient Permissions');
          return { success: false, error: 'Access denied. Administrator privileges required.' };
        }
      }

      // If not logged in, we can't authenticate purely here without the backend API
      // So ensuring this function calls the API is best.
      // But since we removed the hardcoded credentials, we MUST use the API.

      // NOTE: The AdminLogin component should probably call `authContext.login` first.
      // If we want to keep this `login` signature, we can bridge it.

      return { success: false, error: 'Please use the main login page.' };

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