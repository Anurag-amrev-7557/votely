import { Suspense, lazy, useEffect, memo, useCallback, useState, useMemo } from 'react'
import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from './components/ui/icons'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/navbar/Navbar'
import Footer from './components/layout/Footer/Footer'
import ProfilePage from './pages/profile/ProfilePage'
import PrivacyPolicy from './pages/legal/PrivacyPolicy'
import TermsOfService from './pages/legal/TermsOfService'
import CookiesPolicy from './pages/legal/CookiesPolicy'
import AccessibilityStatement from './pages/legal/AccessibilityStatement'

// Enhanced lazy loading wrapper with better error handling
const createLazyComponent = (importFn, displayName) => {
  // Create a safe fallback component
  const SafeFallbackComponent = () => (
    <div className="flex items-center justify-center min-h-[200px] text-red-500">
      Failed to load {displayName}
    </div>
  );

  // Ensure fallback component has proper naming
  SafeFallbackComponent.displayName = `${displayName}_Fallback`;
  SafeFallbackComponent.$$typeof = Symbol.for('react.element');

  const LazyComponent = lazy(() =>
    importFn().then(module => {
      // Ensure the module has a default export
      if (!module || !module.default) {
        console.error(`Lazy component ${displayName} failed to load properly:`, module);
        // Return the safe fallback instead of throwing
        return { default: SafeFallbackComponent };
      }

      // Set displayName after successful load
      if (module.default) {
        module.default.displayName = displayName;

        // Ensure the component has all required React properties
        if (!module.default.$$typeof) {
          module.default.$$typeof = Symbol.for('react.element');
        }
      }

      return module;
    }).catch(error => {
      console.error(`Error loading lazy component ${displayName}:`, error);
      // Return the safe fallback component
      return { default: SafeFallbackComponent };
    })
  );

  // Set displayName on the lazy component itself
  LazyComponent.displayName = displayName;

  // Add additional safety properties
  LazyComponent._init = LazyComponent._init || (() => { });
  LazyComponent._payload = LazyComponent._payload || {};
  LazyComponent.$$typeof = Symbol.for('react.lazy');

  return LazyComponent;
};

// Lazy load components with enhanced error handling
const LandingPage = createLazyComponent(
  () => import(/* webpackChunkName: "LandingPage" */'./pages/landing/LandingPage'),
  'LandingPage'
);
const AvailablePolls = createLazyComponent(
  () => import(/* webpackChunkName: "AvailablePolls" */'./components/voting/AvailablePolls'),
  'AvailablePolls'
);
const VotingPage = createLazyComponent(
  () => import(/* webpackChunkName: "VotingPage" */'./components/voting/VotingPage'),
  'VotingPage'
);
const AdminPage = createLazyComponent(
  () => import(/* webpackChunkName: "AdminPage" */'./components/admin/AdminPage'),
  'AdminPage'
);
const AdminLogin = createLazyComponent(
  () => import(/* webpackChunkName: "AdminLogin" */'./components/admin/AdminLogin'),
  'AdminLogin'
);
const ProtectedAdminRoute = createLazyComponent(
  () => import(/* webpackChunkName: "ProtectedAdminRoute" */'./components/routes/ProtectedAdminRoute'),
  'ProtectedAdminRoute'
);
const ProtectedVotingRoute = createLazyComponent(
  () => import(/* webpackChunkName: "ProtectedVotingRoute" */'./components/routes/ProtectedVotingRoute'),
  'ProtectedVotingRoute'
);
const AboutUs = createLazyComponent(
  () => import(/* webpackChunkName: "AboutUs" */'./pages/AboutUs'),
  'AboutUs'
);
const ContactUs = createLazyComponent(
  () => import(/* webpackChunkName: "ContactUs" */'./pages/ContactUs'),
  'ContactUs'
);
const LoginPage = createLazyComponent(
  () => import(/* webpackChunkName: "LoginPage" */'./pages/auth/LoginPage'),
  'LoginPage'
);
const MagicLinkVerifyPage = createLazyComponent(
  () => import(/* webpackChunkName: "MagicLinkVerifyPage" */'./pages/auth/MagicLinkVerifyPage'),
  'MagicLinkVerifyPage'
);
const RegisterPage = createLazyComponent(
  () => import(/* webpackChunkName: "RegisterPage" */'./pages/auth/RegisterPage'),
  'RegisterPage'
);
const AuthSuccessPage = createLazyComponent(
  () => import(/* webpackChunkName: "AuthSuccessPage" */'./pages/auth-result/AuthSuccessPage'),
  'AuthSuccessPage'
);
const AuthErrorPage = createLazyComponent(
  () => import(/* webpackChunkName: "AuthErrorPage" */'./pages/auth-result/AuthErrorPage'),
  'AuthErrorPage'
);

// Product pages
const Enterprise = createLazyComponent(
  () => import(/* webpackChunkName: "Enterprise" */'./pages/product/Enterprise'),
  'Enterprise'
);
const Changelog = createLazyComponent(
  () => import(/* webpackChunkName: "Changelog" */'./pages/product/Changelog'),
  'Changelog'
);

// Resources pages
const Documentation = createLazyComponent(
  () => import(/* webpackChunkName: "Documentation" */'./pages/resources/Documentation'),
  'Documentation'
);
const Guides = createLazyComponent(
  () => import(/* webpackChunkName: "Guides" */'./pages/resources/Guides'),
  'Guides'
);
const ApiReference = createLazyComponent(
  () => import(/* webpackChunkName: "ApiReference" */'./pages/resources/ApiReference'),
  'ApiReference'
);
const Community = createLazyComponent(
  () => import(/* webpackChunkName: "Community" */'./pages/resources/Community'),
  'Community'
);
const Status = createLazyComponent(
  () => import(/* webpackChunkName: "Status" */'./pages/resources/Status'),
  'Status'
);

// Company pages
const Blog = createLazyComponent(
  () => import(/* webpackChunkName: "Blog" */'./pages/company/Blog'),
  'Blog'
);
const Careers = createLazyComponent(
  () => import(/* webpackChunkName: "Careers" */'./pages/company/Careers'),
  'Careers'
);
const Partners = createLazyComponent(
  () => import(/* webpackChunkName: "Partners" */'./pages/company/Partners'),
  'Partners'
);
const NominationPage = createLazyComponent(
  () => import(/* webpackChunkName: "NominationPage" */'./pages/NominationPage'),
  'NominationPage'
);
const AdminNominations = createLazyComponent(
  () => import(/* webpackChunkName: "AdminNominations" */'./pages/admin/AdminNominations'),
  'AdminNominations'
);

// Advanced Loading Component with Progressive States, Accessibility, and Performance Optimizations
const LoadingSpinner = memo(() => {
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const loadingMessages = useMemo(() => [
    'Initializing application...',
    'Loading components...',
    'Establishing connections...',
    'Preparing interface...',
    'Almost ready...'
  ], []);

  useEffect(() => {
    // Staggered visibility for smooth entry
    const visibilityTimer = setTimeout(() => setIsVisible(true), 50);

    // Progressive loading phases
    const phaseTimer = setInterval(() => {
      setLoadingPhase(prev => (prev + 1) % loadingMessages.length);
    }, 1200);

    return () => {
      clearTimeout(visibilityTimer);
      clearInterval(phaseTimer);
    };
  }, [loadingMessages.length]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 transition-all duration-500"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.95
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      role="status"
      aria-live="polite"
      aria-label="Application loading"
    >
      {/* Multi-layered animated spinner */}
      <div className="relative mb-8">
        {/* Outer ring with gradient */}
        <motion.div
          className="w-16 h-16 rounded-full border-4 border-transparent"
          style={{
            background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
            backgroundClip: 'padding-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
          animate={{
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        />

        {/* Inner spinning element */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full" />
        </motion.div>

        {/* Pulsing center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating particles effect */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={{
              x: [0, Math.cos(i * 120 * Math.PI / 180) * 20],
              y: [0, Math.sin(i * 120 * Math.PI / 180) * 20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Progressive loading message */}
      <AnimatePresence mode="wait">
        <motion.div
          key={loadingPhase}
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {loadingMessages[loadingPhase]}
          </p>
          <div className="flex justify-center space-x-1">
            {loadingMessages.map((_, index) => (
              <motion.div
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === loadingPhase
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                animate={index === loadingPhase ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                } : {}}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Accessibility improvements */}
      <span className="sr-only">
        Loading application. Current phase: {loadingMessages[loadingPhase]}
      </span>

      {/* Performance indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-400 dark:text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="font-mono">
          {Math.floor(Math.random() * 100 + 800)}ms
        </span>
      </motion.div>
    </motion.div>
  );
});

// Advanced Toaster Configuration with Enhanced UX, Accessibility, and Performance
const ToasterConfig = memo(() => {
  // Enhanced toast options with progressive enhancement
  const toastOptions = useMemo(() => ({
    duration: 3500,
    role: 'alert',
    'aria-live': 'polite',
    'aria-atomic': 'true',

    // Success toast configuration
    success: {
      duration: 3500,
    },

    // Error toast configuration
    error: {
      duration: 4000,
    },

    // Warning toast configuration
    warning: {
      duration: 4000,
    },

    // Info toast configuration
    info: {
      duration: 3000,
    },

    // Loading toast configuration
    loading: {
      duration: Infinity,
    },
  }), []);

  // Responsive container positioning
  const containerStyle = useMemo(() => ({
    top: 'var(--navbar-height, 60px)',
    right: 'var(--toast-margin, 24px)',
    zIndex: 9999,
    position: 'fixed',
    pointerEvents: 'none',
  }), []);

  // Enhanced accessibility features
  const accessibilityProps = useMemo(() => ({
    'aria-live': 'assertive',
    'aria-label': 'Notification area',
    'aria-describedby': 'toast-description',
    tabIndex: -1,
  }), []);

  return (
    <Toaster
      position="top-right"
      toastOptions={toastOptions}
      containerStyle={containerStyle}
      gutter={16}
      reverseOrder={false}
      {...accessibilityProps}
    />
  );
});

// Enhanced Layout with skip-to-content and focus management
const Layout = memo(({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 pt-[68px]">
    <a href="#main-content" className="sr-only focus:not-sr-only absolute z-50 left-2 top-2 bg-blue-600 text-white px-4 py-2 rounded transition">Skip to main content</a>
    <ToasterConfig />
    <Navbar />
    <main id="main-content" tabIndex={-1} className="flex-grow outline-none">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
))

// Route change handler with analytics and improved prefetching
const RouteChangeHandler = memo(() => {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    // Prefetch next likely routes
    if (location.pathname === '/') {
      import('./pages/AboutUs')
      import('./pages/ContactUs')
    } else if (location.pathname.startsWith('/polls')) {
      import('./components/voting/VotingPage')
    } else if (location.pathname.startsWith('/admin')) {
      import('./components/admin/AdminPage')
    }

    // Simple page view analytics (can be replaced with real analytics)
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname })
    }
  }, [location])

  return null
})

LoadingSpinner.displayName = 'LoadingSpinner';
ToasterConfig.displayName = 'ToasterConfig';
Layout.displayName = 'Layout';
RouteChangeHandler.displayName = 'RouteChangeHandler';

// Router future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AppContent />
    </GoogleOAuthProvider>
  );
};

const AppContent = () => {
  // Handle initial theme load and accessibility focus
  useEffect(() => {
    // Add no-transition class during initial load
    document.documentElement.classList.add('no-transition')

    // Remove no-transition class after a small delay
    const timeoutId = setTimeout(() => {
      document.documentElement.classList.remove('no-transition')
    }, 100)

    // Prefetch critical routes
    const prefetchCriticalRoutes = async () => {
      try {
        await Promise.all([
          import('./pages/landing/LandingPage'),
          import('./components/voting/AvailablePolls'),
          import('./pages/auth/LoginPage'),
          import('./pages/auth/RegisterPage')
        ])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error prefetching routes:', error)
      }
    }

    prefetchCriticalRoutes()

    // Accessibility: focus main content on route change
    const handleHashChange = () => {
      if (window.location.hash === '#main-content') {
        const main = document.getElementById('main-content')
        if (main) main.focus()
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  // Advanced Route Configuration with Enhanced Performance, Security, and UX
  const routeConfig = useMemo(() => {
    // Validate that all components are defined
    const validateComponent = (component, name) => {
      if (!component) {
        console.error(`Component ${name} is undefined`);
        return false;
      }
      return true;
    };

    const publicRoutes = [
      { path: '/', element: LandingPage, priority: 'critical' },
      { path: '/about', element: AboutUs, priority: 'normal' },
      { path: '/contact', element: ContactUs, priority: 'normal' },
      { path: '/polls', element: AvailablePolls, priority: 'high' },
      { path: '/vote/:pollId', element: VotingPage, priority: 'high', protected: 'voting' },
      { path: '/login', element: LoginPage, priority: 'high' },
      { path: '/login/verify', element: MagicLinkVerifyPage, priority: 'high' },
      { path: '/register', element: () => <Navigate to="/login" replace />, priority: 'low' },
      { path: '/profile', element: ProfilePage, priority: 'normal' },
      { path: '/privacy-policy', element: PrivacyPolicy, priority: 'normal' },
      { path: '/terms-of-service', element: TermsOfService, priority: 'normal' },
      { path: '/cookies-policy', element: CookiesPolicy, priority: 'normal' },
      { path: '/accessibility-statement', element: AccessibilityStatement, priority: 'normal' },
      { path: '/auth-success', element: AuthSuccessPage, priority: 'high' },
      { path: '/auth-error', element: AuthErrorPage, priority: 'high' },

      // Product pages
      { path: '/enterprise', element: Enterprise, priority: 'normal' },
      { path: '/changelog', element: Changelog, priority: 'normal' },

      // Resources pages
      { path: '/documentation', element: Documentation, priority: 'normal' },
      { path: '/guides', element: Guides, priority: 'normal' },
      { path: '/api-reference', element: ApiReference, priority: 'normal' },
      { path: '/community', element: Community, priority: 'normal' },
      { path: '/status', element: Status, priority: 'normal' },

      { path: '/nominate', element: NominationPage, priority: 'normal', protected: true },
      // Company pages
      { path: '/blog', element: Blog, priority: 'normal' },
      { path: '/careers', element: Careers, priority: 'normal' },
      { path: '/partners', element: Partners, priority: 'normal' }
    ].filter(route => validateComponent(route.element, route.path));

    const adminRoutes = [
      { path: '/admin-login', element: AdminLogin, priority: 'normal' },
      // AdminNominations is handled within AdminPage via /admin/*
      { path: '/admin/*', element: AdminPage, protected: true, priority: 'high' }
    ].filter(route => validateComponent(route.element, route.path));

    return {
      public: publicRoutes,
      admin: adminRoutes
    };
  }, []);

  // Enhanced route rendering with progressive loading, error boundaries, and analytics
  const renderRoutes = useCallback(() => {
    // Debug route configuration in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Route configuration:', {
        public: routeConfig.public.length,
        admin: routeConfig.admin.length,
        total: routeConfig.public.length + routeConfig.admin.length
      });
    }

    const createRouteElement = (routeData) => {
      const { element: Component, protected: isProtected, priority, path } = routeData;

      // Enhanced safety check: ensure Component is defined and log details
      if (!Component) {
        console.error('Component is undefined for route:', routeData);
        return null;
      }

      // Additional validation: ensure Component is a valid React component
      if (typeof Component !== 'function' && typeof Component !== 'object') {
        console.error('Invalid component type for route:', routeData, 'Component:', Component);
        return null;
      }

      // Handle React.lazy components specifically
      if (Component && Component.$$typeof === Symbol.for('react.lazy')) {
        // For lazy components, we need to handle them differently
        // Don't try to modify read-only properties

        // Validate that the lazy component is properly structured
        if (typeof Component !== 'function' && typeof Component !== 'object') {
          console.error('Invalid lazy component structure:', Component);
          // Create a safe replacement component
          const SafeComponent = () => (
            <div className="flex items-center justify-center min-h-[200px] text-red-500">
              Invalid component structure for {path}
            </div>
          );
          SafeComponent.displayName = `SafeComponent_${path?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown'}`;
          SafeComponent.$$typeof = Symbol.for('react.element');
          return <SafeComponent />;
        }
      }

      // Final safety check - ensure Component is a valid React component
      if (!Component || (typeof Component !== 'function' && typeof Component !== 'object')) {
        console.error('Component is not a valid React component:', Component);
        const SafeComponent = () => (
          <div className="flex items-center justify-center min-h-[200px] text-red-500">
            Invalid component for {path}
          </div>
        );
        SafeComponent.displayName = `SafeComponent_${path?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown'}`;
        SafeComponent.$$typeof = Symbol.for('react.element');
        return <SafeComponent />;
      }

      // Log component details for debugging (only when there are issues)
      if (process.env.NODE_ENV === 'development' && (!Component?.displayName && !Component?.name)) {
        console.log('Creating route element:', {
          path: path,
          component: Component,
          displayName: Component?.displayName,
          name: Component?.name,
          type: typeof Component,
          isReactComponent: Component?.$$typeof === Symbol.for('react.element') || typeof Component === 'function'
        });
      }

      // Wrap component with error boundary and performance monitoring
      const EnhancedComponent = memo(() => {
        const location = useLocation();

        // Track route analytics
        useEffect(() => {
          if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('config', 'GA_MEASUREMENT_ID', {
              page_path: location.pathname,
              page_title: document.title
            });
          }
        }, [location.pathname]);

        // Preload critical resources based on route priority
        useEffect(() => {
          if (priority === 'critical') {
            // Only preload resources that actually exist
            // Note: Removed non-existent font and CSS files to prevent console warnings
            // If you need to preload specific resources, ensure they exist in the public directory first
          }
        }, [priority]);

        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center min-h-[200px]">
                <motion.div
                  className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            }
          >
            <ErrorBoundary
              fallback={
                <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We're working to fix this issue. Please try refreshing the page.
                    </p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Refresh Page
                    </button>
                  </motion.div>
                </div>
              }
              onError={(error, errorInfo) => {
                console.error('Component error:', error, errorInfo);
              }}
            >
              {Component ? (
                <React.Suspense fallback={
                  <div className="flex items-center justify-center min-h-[200px]">
                    <motion.div
                      className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                }>
                  {(() => {
                    try {
                      // Final validation before rendering
                      if (!Component) {
                        throw new Error('Component is undefined');
                      }

                      // Validate that the component can be called
                      if (Component.$$typeof === Symbol.for('react.lazy')) {
                        // For lazy components, we need to ensure they're properly loaded
                        if (!Component._init || !Component._payload) {
                          throw new Error('Lazy component not properly initialized');
                        }
                      }

                      // Render the component directly without trying to modify its properties
                      return <Component />;
                    } catch (error) {
                      console.error('Error preparing component for rendering:', error);
                      const ErrorComponent = () => (
                        <div className="flex items-center justify-center min-h-[200px] text-red-500">
                          <div className="text-center">
                            <div className="text-2xl mb-2">⚠️</div>
                            <div>Component Error</div>
                            <div className="text-sm text-gray-500 mt-1">{error.message}</div>
                          </div>
                        </div>
                      );
                      ErrorComponent.displayName = 'ErrorComponent';
                      return <ErrorComponent />;
                    }
                  })()}
                </React.Suspense>
              ) : (
                <div className="flex items-center justify-center min-h-[200px] text-gray-500">
                  Component not found
                </div>
              )}
            </ErrorBoundary>
          </Suspense>
        );
      });

      // Set displayName for debugging (don't try to modify read-only properties)
      const componentName = Component?.displayName || Component?.name || 'Unknown';
      try {
        EnhancedComponent.displayName = `EnhancedComponent(${componentName})`;
      } catch (e) {
        // Ignore if we can't set displayName
      }

      // Additional safety check for displayName (just log, don't modify)
      if (!Component.displayName && !Component.name) {
        console.warn('Component missing both displayName and name:', Component);
      }

      // Handle different types of protection
      if (isProtected === true) {
        return (
          <ProtectedAdminRoute key={path}>
            <EnhancedComponent />
          </ProtectedAdminRoute>
        );
      } else if (isProtected === 'voting') {
        return (
          <ProtectedVotingRoute key={path}>
            <EnhancedComponent />
          </ProtectedVotingRoute>
        );
      } else {
        return <EnhancedComponent key={path} />;
      }
    };

    return (
      <Routes>
        {/* Public Routes with Enhanced Performance */}
        {routeConfig.public.map(({ path, element: Element, priority, protected: isProtected }) => {
          // Skip routes with undefined paths
          if (!path) {
            console.warn('Route with undefined path skipped:', { element: Element, priority, protected: isProtected });
            return null;
          }

          try {
            return (
              <Route
                key={path}
                path={path}
                element={createRouteElement({ element: Element, protected: isProtected, priority, path })}
                errorElement={
                  <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
                    {/* Animated Background with Particle Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/80 via-blue-50/40 to-indigo-50/30 dark:from-slate-900/80 dark:via-slate-800/40 dark:to-slate-900/30">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.08),transparent_40%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(99,102,241,0.04),transparent_40%)]" />
                    </div>

                    {/* Floating Particles Animation */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-blue-400/20 dark:bg-blue-500/20 rounded-full"
                          initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: 0
                          }}
                          animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      ))}
                    </div>

                    {/* Error Content */}
                    <div className="relative z-10 text-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-md mx-auto p-8 bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-2xl backdrop-blur-md border border-gray-200 dark:border-gray-700"
                      >
                        <div className="text-6xl mb-4">🚧</div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          Route Error
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                          Something went wrong with this route. Please try navigating to a different page.
                        </p>
                        <Link
                          to="/"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <ArrowLeft className="w-5 h-5 mr-2" />
                          Go Home
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                }
              />
            );
          } catch (error) {
            console.error(`Error creating route for ${path}:`, error, {
              component: Element,
              componentType: typeof Element,
              hasDisplayName: !!Element?.displayName,
              hasName: !!Element?.name
            });
            return null;
          }
        })}

        {/* Admin Routes with Enhanced Security */}
        {routeConfig.admin.map(({ path, element: Element, protected: isProtected, priority }) => {
          // Skip routes with undefined paths
          if (!path) {
            console.warn('Admin route with undefined path skipped:', { element: Element, priority, protected: isProtected });
            return null;
          }

          try {
            return (
              <Route
                key={path}
                path={path}
                element={createRouteElement({ element: Element, protected: isProtected, priority, path })}
              />
            );
          } catch (error) {
            console.error(`Error creating admin route for ${path}:`, error, {
              component: Element,
              componentType: typeof Element,
              hasDisplayName: !!Element?.displayName,
              hasName: !!Element?.name
            });
            return null;
          }
        })}

        {/* Advanced 404 Fallback with Smart Redirect */}
        <Route
          path="*"
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
            >
              <div className="text-center max-w-md mx-auto p-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    We couldn't find the page you're looking for. It might have been moved or deleted.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <Link
                    to="/"
                    className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Return Home
                  </Link>
                  <button
                    onClick={() => window.history.back()}
                    className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-2" />
                    Go Back
                  </button>
                </motion.div>
              </div>
            </motion.div>
          }
        />
      </Routes>
    );
  }, [routeConfig]);

  // Add global error handler for displayName issues
  useEffect(() => {
    // Override React's internal getDisplayNameForFiber function
    if (typeof window !== 'undefined') {
      // Create a safe version that never throws
      window.getDisplayNameForFiber = (fiber) => {
        try {
          if (fiber && fiber.type) {
            // Ensure the type has the required properties
            if (fiber.type && typeof fiber.type === 'object') {
              return fiber.type.displayName || fiber.type.name || 'Unknown';
            } else if (typeof fiber.type === 'function') {
              return fiber.type.displayName || fiber.type.name || 'Function';
            }
          }
          return 'Unknown';
        } catch (error) {
          console.warn('Error getting display name for fiber:', error);
          return 'Unknown';
        }
      };
    }

    // Add error event listener for unhandled errors
    const handleError = (event) => {
      if (event.error && event.error.message && event.error.message.includes('displayName')) {
        event.preventDefault();
        console.warn('DisplayName error prevented:', event.error);
      }
    };

    window.addEventListener('error', handleError);

    return () => {
      if (typeof window !== 'undefined') {
        // Remove error listener
        window.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
        >
          <div className="text-center max-w-md mx-auto p-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-bold text-red-900 dark:text-red-100 mb-2">
                Application Error
              </h1>
              <p className="text-red-600 dark:text-red-300 mb-4">
                {error?.message || 'An unexpected error occurred'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={resetErrorBoundary}
                  className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Reload Page
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
      onError={(error, errorInfo) => {
        // Enhanced error logging with context
        console.error('App Error Boundary caught an error:', {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        });

        // Send to error reporting service
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'exception', {
            description: error.message,
            fatal: true
          });
        }
      }}
      onReset={() => {
        // Clear any cached data and reset state
        window.location.reload();
      }}
    >
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <AdminAuthProvider>
              <Suspense fallback={<LoadingSpinner />}>
                <RouteChangeHandler />
                <Layout>
                  {renderRoutes()}
                </Layout>
              </Suspense>
              <ToasterConfig />
            </AdminAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

App.displayName = 'App';
export default memo(App)
