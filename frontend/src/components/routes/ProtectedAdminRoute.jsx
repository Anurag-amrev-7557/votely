import React, { useEffect, useCallback, useMemo, Suspense, useRef } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../../context/AdminAuthContext';

/**
 * Ultra-Enhanced Loading Spinner with Accessibility, Progress, and Animation
 */
const AdvancedLoadingSpinner = React.memo(() => {
  const loadingMessages = useMemo(() => [
    'Verifying admin credentials...',
    'Loading secure dashboard...',
    'Initializing admin interface...',
    'Establishing secure connection...',
    'Checking security policies...',
    'Syncing admin preferences...',
    'Almost there...'
  ], []);

  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const progressRef = useRef();

  // Cycle loading messages
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  // Simulate progress bar
  useEffect(() => {
    let start = Date.now();
    let raf;
    const animate = () => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Ease out as it approaches 100
        const elapsed = Date.now() - start;
        let next = Math.min(100, prev + 0.2 + 2 * Math.exp(-0.002 * elapsed));
        return next;
      });
      if (progressRef.current < 100) {
        raf = requestAnimationFrame(animate);
      }
    };
    progressRef.current = 0;
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-[#15191e] dark:via-[#1a1f26] dark:to-[#1e242c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      {/* Enhanced Loading Spinner */}
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Outer Ring */}
        <motion.div
          className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900/30 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner Spinner */}
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 rounded-full"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        {/* Center Dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Accessibility: Visually hidden loading text */}
        <span className="sr-only">Loading admin area...</span>
      </motion.div>

      {/* Loading Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentMessageIndex}
          className="mt-6 text-sm font-medium text-gray-600 dark:text-gray-300 text-center max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {loadingMessages[currentMessageIndex]}
        </motion.p>
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div
        className="mt-4 w-40 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        aria-label="Loading progress"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </motion.div>
      <span className="mt-1 text-xs text-gray-400 dark:text-gray-500" aria-live="polite">
        {Math.round(progress)}%
      </span>
    </motion.div>
  );
});

AdvancedLoadingSpinner.displayName = 'AdvancedLoadingSpinner';

/**
 * Ultra-Enhanced Protected Admin Route Component
 * - Advanced authentication, security checks, user experience, and audit logging
 * - Handles session expiry, privilege escalation, and route-based access control
 * - Provides detailed error feedback and smooth transitions
 */
const ProtectedAdminRoute = React.memo(
  ({
    children,
    fallback,
    requireElevatedPrivileges = false,
    auditLog = true,
    onAccessDenied,
    onSessionExpired,
    onPrivilegeError
  }) => {
    const { isAdmin, isLoading, adminData, checkAdminPermissions } = useAdminAuth();
    const location = useLocation();
    const hasLoggedUnauthorized = useRef(false);

    // Memoized security checks
    const securityChecks = useMemo(() => ({
      isAuthenticated: !!isAdmin,
      hasValidSession: !!adminData?.sessionValid,
      hasRequiredPermissions: requireElevatedPrivileges ? !!adminData?.elevatedPrivileges : true,
      isSessionExpired: !!adminData?.sessionExpired
    }), [isAdmin, adminData, requireElevatedPrivileges]);

    // Enhanced permission validation (async, can be awaited for future expansion)
    const validatePermissions = useCallback(async () => {
      if (requireElevatedPrivileges && isAdmin) {
        try {
          await checkAdminPermissions();
        } catch (error) {
          if (auditLog) {
            // eslint-disable-next-line no-console
            console.error('Permission validation failed:', error);
          }
          return false;
        }
      }
      return true;
    }, [requireElevatedPrivileges, isAdmin, checkAdminPermissions, auditLog]);

    // Security monitoring and logging (audit trail)
    useEffect(() => {
      if (
        auditLog &&
        !isLoading &&
        !isAdmin &&
        !location.pathname.includes('/admin-login') &&
        !hasLoggedUnauthorized.current
      ) {
        hasLoggedUnauthorized.current = true;
        // Log unauthorized access attempt (excluding login route)
        // Could be sent to a backend audit log endpoint
        // eslint-disable-next-line no-console
        console.warn('Unauthorized access attempt to admin route:', {
          path: location.pathname,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        });
        if (typeof onAccessDenied === 'function') {
          onAccessDenied({
            path: location.pathname,
            reason: 'not_authenticated',
            timestamp: Date.now()
          });
        }
      }
    }, [isLoading, isAdmin, location.pathname, auditLog, onAccessDenied]);

    // Session monitoring
    useEffect(() => {
      if (securityChecks.isSessionExpired) {
        // eslint-disable-next-line no-console
        if (auditLog) {
          console.warn('Admin session expired, redirecting to login');
        }
        if (typeof onSessionExpired === 'function') {
          onSessionExpired({
            path: location.pathname,
            reason: 'session_expired',
            timestamp: Date.now()
          });
        }
      }
    }, [securityChecks.isSessionExpired, auditLog, location.pathname, onSessionExpired]);

    // Privilege error monitoring
    useEffect(() => {
      if (
        requireElevatedPrivileges &&
        !isLoading &&
        securityChecks.isAuthenticated &&
        !securityChecks.hasRequiredPermissions
      ) {
        if (auditLog) {
          // eslint-disable-next-line no-console
          console.warn('Insufficient admin privileges for route:', {
            path: location.pathname,
            timestamp: new Date().toISOString()
          });
        }
        if (typeof onPrivilegeError === 'function') {
          onPrivilegeError({
            path: location.pathname,
            reason: 'insufficient_privileges',
            timestamp: Date.now()
          });
        }
      }
    }, [
      requireElevatedPrivileges,
      isLoading,
      securityChecks.isAuthenticated,
      securityChecks.hasRequiredPermissions,
      auditLog,
      location.pathname,
      onPrivilegeError
    ]);

    // Loading state with enhanced UX
    if (isLoading) {
      return fallback || <AdvancedLoadingSpinner />;
    }

    // Security validation with detailed error handling and audit
    if (!securityChecks.isAuthenticated) {
      return (
        <Navigate
          to="/admin-login"
          state={{
            from: location,
            reason: 'authentication_required',
            timestamp: Date.now()
          }}
          replace
        />
      );
    }

    if (!securityChecks.hasValidSession) {
      return (
        <Navigate
          to="/admin-login"
          state={{
            from: location,
            reason: 'session_invalid',
            timestamp: Date.now()
          }}
          replace
        />
      );
    }

    if (requireElevatedPrivileges && !securityChecks.hasRequiredPermissions) {
      return (
        <Navigate
          to="/admin-login"
          state={{
            from: location,
            reason: 'insufficient_privileges',
            timestamp: Date.now()
          }}
          replace
        />
      );
    }

    // Success state with smooth transition and audit
    return (
      <Suspense fallback={<AdvancedLoadingSpinner />}>
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </Suspense>
    );
  }
);

ProtectedAdminRoute.displayName = 'ProtectedAdminRoute';

export default ProtectedAdminRoute;