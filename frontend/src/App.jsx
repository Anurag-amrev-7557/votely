import { Suspense, lazy, useEffect, memo } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AdminAuthProvider } from './context/AdminAuthContext'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/navbar/Navbar'
import Footer from './components/Footer/Footer'

// Lazy load components with prefetching
const LandingPage = lazy(() => import('./pages/landing/LandingPage'))
const AvailablePolls = lazy(() => import('./components/AvailablePolls'))
const VotingPage = lazy(() => import('./components/VotingPage'))
const AdminPage = lazy(() => import('./components/AdminPage'))
const AdminLogin = lazy(() => import('./components/AdminLogin'))
const ProtectedAdminRoute = lazy(() => import('./components/ProtectedAdminRoute'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))

// Memoized Loading component
const LoadingSpinner = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <div className="absolute top-0 left-0 w-full h-full animate-pulse rounded-full bg-blue-500/10"></div>
    </div>
  </div>
))

// Memoized Toaster configuration
const ToasterConfig = memo(() => (
  <Toaster
    position="top-right"
    toastOptions={{
      duration: 3000,
      style: {
        background: '#333',
        color: '#fff',
      },
      success: {
        duration: 3000,
        theme: {
          primary: '#4aed88',
        },
      },
      error: {
        duration: 3000,
        theme: {
          primary: '#ff4b4b',
        },
      },
    }}
  />
))

// Memoized Layout component
const Layout = memo(({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
    <ToasterConfig />
    <Navbar />
    <main className="flex-grow">
      <Suspense fallback={<LoadingSpinner />}>
        {children}
      </Suspense>
    </main>
    <Footer />
  </div>
))

// Route change handler component
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
      // Prefetch about and contact pages when on landing
      const aboutPromise = import('./pages/AboutUs')
      const contactPromise = import('./pages/ContactUs')
    }
  }, [location])

  return null
})

// Create router with future flags
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
}

const App = () => {
  // Handle initial theme load
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
          import('./components/AvailablePolls')
        ])
      } catch (error) {
        console.error('Error prefetching routes:', error)
      }
    }

    prefetchCriticalRoutes()

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <Router future={router.future}>
            <RouteChangeHandler />
            <Layout>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/polls" element={<AvailablePolls />} />
                <Route path="/vote/:pollId" element={<VotingPage />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/admin/*"
                  element={
                    <ProtectedAdminRoute>
                      <AdminPage />
                    </ProtectedAdminRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default memo(App)
