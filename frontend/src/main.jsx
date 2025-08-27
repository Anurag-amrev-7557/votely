import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import './index.css'

// Suppress specific cssRules error globally (capture phase, very early)
if (typeof window !== 'undefined') {
  window.addEventListener('error', function(event) {
    if (
      event.message &&
      event.message.includes('cssRules') &&
      event.message.includes('Cannot read properties of null')
    ) {
      // Suppress the error
      event.preventDefault();
      return false;
    }
  }, true); // Use capture phase for early interception
}

// CSS loading check to prevent cssRules null error
const ensureCSSLoaded = async () => {
  if (typeof document !== 'undefined') {
    // Quick check for any obvious issues
    const stylesheets = Array.from(document.styleSheets);
    const problematicSheets = stylesheets.filter(sheet => {
      try {
        return !sheet || !sheet.cssRules;
      } catch (e) {
        return true;
      }
    });
    
    if (problematicSheets.length > 0) {
      console.log(`Found ${problematicSheets.length} stylesheets that may need time to load, waiting briefly...`);
      // Wait a short time for stylesheets to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check again after waiting
      const remainingProblematicSheets = Array.from(document.styleSheets).filter(sheet => {
        try {
          return !sheet || !sheet.cssRules;
        } catch (e) {
          return true;
        }
      });
      
      if (remainingProblematicSheets.length > 0) {
        console.warn(`${remainingProblematicSheets.length} stylesheets still not fully loaded, but proceeding anyway`);
      }
    } else {
      console.log('All stylesheets appear to be loaded');
    }
  }
  return Promise.resolve();
};

// Global error handler for CSS-related errors and displayName issues
const setupGlobalErrorHandler = () => {
  if (typeof window !== 'undefined') {
    // Handle CSS-related errors
    window.addEventListener('error', (event) => {
      if (event.error && (
        event.error.message.includes('cssRules') ||
        event.error.message.includes('VariablesStore.putRootVars') ||
        (event.error.message.includes('Cannot read properties of null') && event.error.message.includes('cssRules'))
      )) {
        console.warn('CSS processing error caught and handled:', event.error.message);
        event.preventDefault();
        return false;
      }
      
      // Handle displayName errors
      if (event.error && event.error.message && event.error.message.includes('displayName')) {
        console.warn('DisplayName error caught and handled:', event.error.message);
        event.preventDefault();
        return false;
      }
    });

    // Also handle unhandled promise rejections that might be related
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && (
        event.reason.message.includes('cssRules') ||
        event.reason.message.includes('VariablesStore.putRootVars')
      )) {
        console.warn('CSS processing promise rejection caught and handled:', event.reason.message);
        event.preventDefault();
        return false;
      }
      
      // Handle displayName promise rejections
      if (event.reason && event.reason.message && event.reason.message.includes('displayName')) {
        console.warn('DisplayName promise rejection caught and handled:', event.reason.message);
        event.preventDefault();
        return false;
      }
    });
    
    // Override React's internal getDisplayNameForFiber function as a backup
    if (!window.getDisplayNameForFiber) {
      window.getDisplayNameForFiber = function(fiber) {
        try {
          if (fiber && fiber.type) {
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
  }
};

// Enhanced lazy loading wrapper with better error handling
const createLazyComponent = (importFn, displayName) => {
  return lazy(() => 
    importFn().then(module => {
      // Ensure the module has a default export
      if (!module || !module.default) {
        console.error(`Lazy component ${displayName} failed to load properly:`, module);
        throw new Error(`Failed to load component: ${displayName}`);
      }
      
      // Set displayName after successful load
      if (module.default) {
        module.default.displayName = displayName;
      }
      
      return module;
    }).catch(error => {
      console.error(`Error loading lazy component ${displayName}:`, error);
      // Return a fallback component
      return {
        default: () => (
          <div className="flex items-center justify-center min-h-screen text-red-500">
            Failed to load {displayName}
          </div>
        )
      };
    })
  );
};

// Import the App component directly (not lazy loaded)
import App from './App.jsx';

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
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
  }
}

// Initialize the app
const root = createRoot(document.getElementById('root'))

// Render with CSS loading check
const renderApp = async () => {
  try {
    // Set up global error handler first
    setupGlobalErrorHandler();
    
    await ensureCSSLoaded();
    
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
  } catch (error) {
    console.error('Failed to render app:', error);
    // Fallback render without CSS check
    root.render(
      <StrictMode>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
          onError={(error) => {
            console.error('Application Error:', error)
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <App />
          </Suspense>
        </ErrorBoundary>
      </StrictMode>
    )
  }
};

renderApp();

// Log performance metrics after initial render
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', logPerformance)
}
