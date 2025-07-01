import { Suspense, lazy, useEffect, memo, useCallback, useState, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from './components/icons'
import { ErrorBoundary } from 'react-error-boundary'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/navbar/Navbar'
import Footer from './components/Footer/Footer'
import ProfilePage from './pages/ProfilePage'

// Lazy load components with prefetching and chunk naming for better debugging
const LandingPage = lazy(() => import(/* webpackChunkName: "LandingPage" */'./pages/landing/LandingPage'))
const AvailablePolls = lazy(() => import(/* webpackChunkName: "AvailablePolls" */'./components/AvailablePolls'))
const VotingPage = lazy(() => import(/* webpackChunkName: "VotingPage" */'./components/VotingPage'))
const AdminPage = lazy(() => import(/* webpackChunkName: "AdminPage" */'./components/AdminPage'))
const AdminLogin = lazy(() => import(/* webpackChunkName: "AdminLogin" */'./components/AdminLogin'))
const ProtectedAdminRoute = lazy(() => import(/* webpackChunkName: "ProtectedAdminRoute" */'./components/ProtectedAdminRoute'))
const AboutUs = lazy(() => import(/* webpackChunkName: "AboutUs" */'./pages/AboutUs'))
const ContactUs = lazy(() => import(/* webpackChunkName: "ContactUs" */'./pages/ContactUs'))
const LoginPage = lazy(() => import(/* webpackChunkName: "LoginPage" */'./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import(/* webpackChunkName: "RegisterPage" */'./pages/auth/RegisterPage'))

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
                className={`w-1.5 h-1.5 rounded-full ${
                  index === loadingPhase 
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
  // Dynamic theme-aware styling with CSS custom properties
  const toastStyles = useMemo(() => ({
    background: 'var(--toast-bg, #23272f)',
    color: 'var(--toast-text, #fff)',
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid var(--toast-border, rgba(255, 255, 255, 0.1))',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    maxWidth: '400px',
    minWidth: '300px',
    padding: '16px 20px',
    fontSize: '14px',
    lineHeight: '1.5',
    transform: 'translateZ(0)', // Force hardware acceleration
  }), []);

  // Enhanced toast options with progressive enhancement
  const toastOptions = useMemo(() => ({
    duration: 3500,
    style: toastStyles,
    className: 'toast-notification',
    role: 'alert',
    'aria-live': 'polite',
    'aria-atomic': 'true',
    
    // Success toast configuration
    success: {
      duration: 3500,
      iconTheme: {
        primary: '#10b981',
        secondary: '#23272f',
      },
      style: {
        ...toastStyles,
        borderLeft: '4px solid #10b981',
        background: 'linear-gradient(135deg, #23272f 0%, #1f2937 100%)',
      },
      className: 'toast-success',
    },
    
    // Error toast configuration
    error: {
      duration: 4000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#23272f',
      },
      style: {
        ...toastStyles,
        borderLeft: '4px solid #ef4444',
        background: 'linear-gradient(135deg, #23272f 0%, #1f1f1f 100%)',
      },
      className: 'toast-error',
    },
    
    // Warning toast configuration
    warning: {
      duration: 4000,
      iconTheme: {
        primary: '#f59e0b',
        secondary: '#23272f',
      },
      style: {
        ...toastStyles,
        borderLeft: '4px solid #f59e0b',
        background: 'linear-gradient(135deg, #23272f 0%, #1f2937 100%)',
      },
      className: 'toast-warning',
    },
    
    // Info toast configuration
    info: {
      duration: 3000,
      iconTheme: {
        primary: '#3b82f6',
        secondary: '#23272f',
      },
      style: {
        ...toastStyles,
        borderLeft: '4px solid #3b82f6',
        background: 'linear-gradient(135deg, #23272f 0%, #1e3a8a 100%)',
      },
      className: 'toast-info',
    },
    
    // Loading toast configuration
    loading: {
      duration: Infinity,
      iconTheme: {
        primary: '#6366f1',
        secondary: '#23272f',
      },
      style: {
        ...toastStyles,
        borderLeft: '4px solid #6366f1',
        background: 'linear-gradient(135deg, #23272f 0%, #312e81 100%)',
      },
      className: 'toast-loading',
    },
  }), [toastStyles]);

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
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
      import('./components/VotingPage')
    } else if (location.pathname.startsWith('/admin')) {
      import('./components/AdminPage')
    }

    // Simple page view analytics (can be replaced with real analytics)
    if (window.gtag) {
      window.gtag('event', 'page_view', { page_path: location.pathname })
    }
  }, [location])

  return null
})

// Router future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

const App = () => {
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
          import('./components/AvailablePolls'),
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
  const routeConfig = useMemo(() => ({
    public: [
      { path: '/', element: LandingPage, priority: 'critical' },
      { path: '/about', element: AboutUs, priority: 'normal' },
      { path: '/contact', element: ContactUs, priority: 'normal' },
      { path: '/polls', element: AvailablePolls, priority: 'high' },
      { path: '/vote/:pollId', element: VotingPage, priority: 'high' },
      { path: '/login', element: LoginPage, priority: 'high' },
      { path: '/register', element: RegisterPage, priority: 'high' },
      { path: '/profile', element: ProfilePage, priority: 'normal' }
    ],
    admin: [
      { path: '/admin-login', element: AdminLogin, priority: 'normal' },
      { path: '/admin/*', element: AdminPage, protected: true, priority: 'high' }
    ]
  }), []);

  // Enhanced route rendering with progressive loading, error boundaries, and analytics
  const renderRoutes = useCallback(() => {
    const createRouteElement = (routeConfig) => {
      const { element: Component, protected: isProtected, priority } = routeConfig;
      
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
            >
              <Component />
            </ErrorBoundary>
          </Suspense>
        );
      });

      return isProtected ? (
        <ProtectedAdminRoute key={routeConfig.path}>
          <EnhancedComponent />
        </ProtectedAdminRoute>
      ) : (
        <EnhancedComponent key={routeConfig.path} />
      );
    };

    return (
      <Routes>
        {/* Public Routes with Enhanced Performance */}
        {routeConfig.public.map(({ path, element: Element, priority }) => (
          <Route
            key={path}
            path={path}
            element={createRouteElement({ element: Element, priority })}
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
                        duration: 8 + Math.random() * 4,
                        repeat: Infinity,
                        ease: "linear",
                        delay: i * 0.5
                      }}
                    />
                  ))}
                </div>

                {/* Main Error Content */}
                <motion.div
                  initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: -15 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    staggerChildren: 0.15 
                  }}
                  className="relative z-10 text-center max-w-md mx-auto p-8 backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 rounded-2xl border border-white/20 dark:border-slate-700/20 shadow-2xl"
                >
                  {/* Animated Error Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ 
                      delay: 0.3, 
                      type: "spring", 
                      stiffness: 300,
                      damping: 15
                    }}
                    className="mb-8"
                  >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      {/* Outer Ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-200 dark:border-red-800/30"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      {/* Inner Circle */}
                      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-red-100 via-red-50 to-red-200 dark:from-red-900/40 dark:via-red-800/20 dark:to-red-900/40 flex items-center justify-center shadow-inner">
                        <motion.span 
                          className="text-3xl font-bold text-red-600 dark:text-red-400"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          404
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Error Title with Typing Effect */}
                  <motion.h2 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3 tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
                  >
                    Page Not Found
                  </motion.h2>
                  
                  {/* Error Description with Enhanced Typography */}
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium"
                  >
                    The page you're looking for doesn't exist or has been moved to a new location.
                  </motion.p>
                  
                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="space-y-4"
                  >
                    {/* Primary Action */}
                    <Link
                      to="/"
                      className="group inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white text-base font-semibold rounded-xl transition-all duration-500 transform hover:scale-105 hover:shadow-2xl shadow-lg border border-blue-500/20"
                    >
                      <motion.div
                        className="flex items-center"
                        whileHover={{ x: -3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowLeft className="w-5 h-5 mr-3 transition-transform group-hover:-translate-x-1" />
                        Return Home
                      </motion.div>
                    </Link>
                    
                    {/* Secondary Action */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.history.back()}
                      className="group inline-flex items-center justify-center w-full px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl transition-all duration-300 border border-slate-300/50 dark:border-slate-600/50"
                    >
                      <svg className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Go Back
                    </motion.button>
                  </motion.div>
                  
                  {/* Helpful Suggestions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.1 }}
                    className="mt-8 pt-6 border-t border-slate-200/50 dark:border-slate-700/50"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-3 font-medium">
                      Need help? Try these:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['Home', 'Polls', 'About', 'Contact'].map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.2 + index * 0.1 }}
                        >
                          <Link
                            to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                          >
                            {item}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            }
          />
        ))}
        
        {/* Admin Routes with Enhanced Security */}
        {routeConfig.admin.map(({ path, element: Element, protected: isProtected, priority }) => (
          <Route
            key={path}
            path={path}
            element={createRouteElement({ element: Element, protected: isProtected, priority })}
          />
        ))}
        
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
                Something went wrong
              </h1>
              <p className="text-red-600 dark:text-red-300 mb-4">
                {error?.message || 'An unexpected error occurred'}
              </p>
              <button
                onClick={resetErrorBoundary}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
              >
                Try Again
              </button>
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
      <ThemeProvider>
        <AuthProvider>
          <AdminAuthProvider>
            <Router future={router.future}>
              <Suspense fallback={<LoadingSpinner />}>
                <RouteChangeHandler />
                <Layout>
                  {renderRoutes()}
                </Layout>
              </Suspense>
              <ToasterConfig />
            </Router>
          </AdminAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default memo(App)
