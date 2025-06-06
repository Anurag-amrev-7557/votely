import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'

// Lazy load the App component
const App = lazy(() => import('./App.jsx'))

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Something went wrong</h2>
      <pre className="text-sm text-gray-600 dark:text-gray-300 mb-4 overflow-auto">
        {error.message}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
)

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  </div>
)

// Performance monitoring
const logPerformance = () => {
  if (process.env.NODE_ENV === 'development') {
    const metrics = performance.getEntriesByType('navigation')[0]
    console.log('Performance Metrics:', {
      'Time to First Byte': metrics.responseStart - metrics.requestStart,
      'DOM Content Loaded': metrics.domContentLoadedEventEnd - metrics.navigationStart,
      'Window Load': metrics.loadEventEnd - metrics.navigationStart,
    })
  }
}

// Initialize the app
const root = createRoot(document.getElementById('root'))

// Render with optimizations
root.render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error) => {
        // Log error to your error tracking service
        console.error('Application Error:', error)
      }}
    >
      <Suspense fallback={<LoadingFallback />}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </StrictMode>
)

// Log performance metrics after initial render
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', logPerformance)
}
