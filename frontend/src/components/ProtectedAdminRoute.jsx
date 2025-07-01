import React, { useEffect, useCallback, useMemo, Suspense } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminAuth } from '../context/AdminAuthContext';

/**
 * Advanced Loading Component with Enhanced UX
 * Features progressive loading states, accessibility, and performance optimizations
 */
const AdvancedLoadingSpinner = React.memo(() => {
  const loadingMessages = useMemo(() => [
    'Verifying admin credentials...',
    'Loading secure dashboard...',
    'Initializing admin interface...',
    'Establishing secure connection...'
  ], []);

  const [currentMessageIndex, setCurrentMessageIndex] = React.useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-[#15191e] dark:via-[#1a1f26] dark:to-[#1e242c]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
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
        className="mt-4 w-32 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
});

AdvancedLoadingSpinner.displayName = 'AdvancedLoadingSpinner';

/**
 * Enhanced Protected Admin Route Component
 * Features advanced authentication, security checks, and user experience optimizations
 */
const ProtectedAdminRoute = React.memo(({ children, fallback, requireElevatedPrivileges = false }) => {
  const { isAdmin, isLoading, adminData, checkAdminPermissions } = useAdminAuth();
  const location = useLocation();

  // Memoized security checks
  const securityChecks = useMemo(() => ({
    isAuthenticated: isAdmin,
    hasValidSession: adminData?.sessionValid,
    hasRequiredPermissions: requireElevatedPrivileges ? adminData?.elevatedPrivileges : true,
    isSessionExpired: adminData?.sessionExpired
  }), [isAdmin, adminData, requireElevatedPrivileges]);

  // Enhanced permission validation
  const validatePermissions = useCallback(async () => {
    if (requireElevatedPrivileges && isAdmin) {
      try {
        await checkAdminPermissions();
      } catch (error) {
        console.error('Permission validation failed:', error);
        return false;
      }
    }
    return true;
  }, [requireElevatedPrivileges, isAdmin, checkAdminPermissions]);

  // Security monitoring and logging
  useEffect(() => {
    if (!isLoading && !isAdmin && !location.pathname.includes('/admin-login')) {
      // Log unauthorized access attempt (excluding login route)
      console.warn('Unauthorized access attempt to admin route:', {
        path: location.pathname,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    }
  }, [isLoading, isAdmin, location.pathname]);

  // Session monitoring
  useEffect(() => {
    if (securityChecks.isSessionExpired) {
      console.warn('Admin session expired, redirecting to login');
    }
  }, [securityChecks.isSessionExpired]);

  // Loading state with enhanced UX
  if (isLoading) {
    return fallback || <AdvancedLoadingSpinner />;
  }

  // Security validation with detailed error handling
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

  // Success state with smooth transition
  return (
    <Suspense fallback={<AdvancedLoadingSpinner />}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </Suspense>
  );
});

ProtectedAdminRoute.displayName = 'ProtectedAdminRoute';

export default ProtectedAdminRoute;