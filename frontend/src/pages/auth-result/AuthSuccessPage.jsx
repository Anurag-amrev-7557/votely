import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  ShieldCheckIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';

const AuthSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 2000;

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setError('No authentication token found. Please try logging in again.');
      setStatus('error');
      return;
    }

    // Enhanced token verification with retry logic
    const verifyToken = async (attempt = 1) => {
      try {
        setStatus(attempt === 1 ? 'verifying' : 'retrying');
        setIsRetrying(attempt > 1);
        
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
          setStatus('success');
          setRetryCount(0);
          setIsRetrying(false);
          
          // Enhanced redirect with user feedback
          setTimeout(() => {
            navigate('/', { 
              replace: true,
              state: { 
                authSuccess: true,
                user: data.user 
              }
            });
          }, 2000);
        } else {
          throw new Error('Invalid user data received from server');
        }
      } catch (err) {
        console.error(`Auth verification error (attempt ${attempt}):`, err);
        
        if (attempt < MAX_RETRIES) {
          setRetryCount(attempt);
          setTimeout(() => verifyToken(attempt + 1), RETRY_DELAY);
        } else {
          setError(err.message || 'Authentication failed after multiple attempts');
          setStatus('error');
          setIsRetrying(false);
        }
      }
    };

    verifyToken();
  }, [searchParams, setUser, navigate]);

  const getStatusContent = () => {
    switch (status) {
      case 'processing':
        return {
          title: 'Processing Authentication',
          message: 'Please wait while we verify your login credentials...',
          icon: ClockIcon,
          color: 'text-blue-600'
        };
      case 'verifying':
        return {
          title: 'Verifying Token',
          message: 'Validating your authentication credentials securely...',
          icon: ShieldCheckIcon,
          color: 'text-indigo-600'
        };
      case 'retrying':
        return {
          title: `Retrying Authentication (${retryCount}/${MAX_RETRIES})`,
          message: 'Connection issue detected. Attempting to reconnect...',
          icon: ArrowPathIcon,
          color: 'text-yellow-600'
        };
      case 'success':
        return {
          title: 'Authentication Successful!',
          message: 'Welcome back! Redirecting you to the home page...',
          icon: CheckCircleIcon,
          color: 'text-green-600'
        };
      case 'error':
        return {
          title: 'Authentication Failed',
          message: error || 'An unexpected error occurred during authentication',
          icon: XCircleIcon,
          color: 'text-red-600'
        };
      default:
        return {
          title: 'Processing',
          message: 'Please wait while we process your request...',
          icon: ClockIcon,
          color: 'text-gray-600'
        };
    }
  };

  const content = getStatusContent();
  const IconComponent = content.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full mx-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 p-8 text-center"
        >
          {/* Status Icon with Enhanced Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.3, 
              type: "spring", 
              stiffness: 200,
              damping: 15
            }}
            className="relative mb-8 flex justify-center"
          >
            <div className="text-7xl mb-2 relative flex justify-center">
              <IconComponent className={`w-24 h-24 ${content.color}`} />
              {/* Glow effect for success */}
              {status === 'success' && (
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 text-green-400 blur-lg flex justify-center"
                >
                  <IconComponent className="w-24 h-24" />
                </motion.div>
              )}
            </div>
            
            {/* Progress ring for processing states */}
            {(status === 'processing' || status === 'verifying') && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="absolute inset-0 w-24 h-24 border-4 border-blue-200 border-t-blue-600 rounded-full"
              />
            )}
          </motion.div>

          {/* Enhanced Title with Typing Effect */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4"
          >
            {content.title}
          </motion.h1>

          {/* Enhanced Message with Better Typography */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed"
          >
            {content.message}
          </motion.p>

          {/* Enhanced Loading Spinner */}
          {(status === 'processing' || status === 'verifying') && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col items-center mb-6 space-y-4"
            >
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin" style={{ animationDelay: '-0.5s' }}></div>
              </div>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-sm text-gray-500 dark:text-gray-400"
              >
                Please wait...
              </motion.div>
            </motion.div>
          )}

          {/* Enhanced Error Actions */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Try Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/')}
                className="w-full px-6 py-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:from-gray-300 hover:to-gray-400 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Go Home
              </motion.button>
            </motion.div>
          )}

          {/* Enhanced Success Animation */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="space-y-4"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-green-500 text-lg font-semibold"
              >
                Redirecting...
              </motion.div>
              <motion.div
                animate={{ width: [0, 100] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"
              />
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AuthSuccessPage; 