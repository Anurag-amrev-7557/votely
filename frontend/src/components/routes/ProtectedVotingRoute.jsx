import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '../../utils/toastUtils';
import { Shield, CheckCircle, AlertCircle, Loader2, Eye } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/api/axiosConfig';

const ProtectedVotingRoute = ({ children }) => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [checkError, setCheckError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const checkVoteStatus = useCallback(async (isRetry = false) => {
    // Don't check if auth is still loading
    if (authLoading) {
      return;
    }

    // If user is not authenticated, allow access (they'll be prompted to login on the voting page)
    if (!user) {
      setIsChecking(false);
      setCheckError(null);
      return;
    }

    try {
      setCheckError(null);
      
      // Check if user has already voted in this poll
      const response = await axiosInstance.get(`/votes/${pollId}`);
      setHasVoted(true);
      
      // If they have voted and we're not already showing results, redirect to results
      const params = new URLSearchParams(location.search);
      if (params.get('showResults') !== '1') {
        toast.success('You have already voted in this poll. Redirecting to results...', {
          icon: '✅',
          duration: 3000,
          style: {
            background: '#10b981',
            color: '#fff',
          },
        });
        navigate(`/vote/${pollId}?showResults=1`, { replace: true });
      }
    } catch (error) {
      console.error('Vote status check error:', error);
      
      // If we get a 404 or other error, user hasn't voted
      if (error.response?.status === 404) {
        setHasVoted(false);
        setCheckError(null);
      } else {
        setCheckError(error.message || 'Failed to check vote status');
        
        // Auto-retry on network errors (up to 3 times)
        if (isRetry && retryCount < 3) {
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
            checkVoteStatus(true);
          }, 2000 * (retryCount + 1)); // Exponential backoff
        }
      }
    } finally {
      setIsChecking(false);
    }
  }, [pollId, user, authLoading, navigate, location.search, retryCount]);

  useEffect(() => {
    checkVoteStatus();
  }, [checkVoteStatus]);

  // Enhanced loading component with better UX
  const LoadingComponent = () => (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        {/* Animated background rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-800"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-300 dark:border-blue-700"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-full flex items-center justify-center shadow-2xl">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-10 h-10 text-white" />
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Verifying Vote Status
        </h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          {authLoading ? 'Checking authentication...' : 'Ensuring you can participate in this poll...'}
        </p>
        
        {retryCount > 0 && (
          <motion.p
            className="text-sm text-orange-600 dark:text-orange-400 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Retry attempt {retryCount}/3
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );

  // Error component with retry functionality
  const ErrorComponent = () => (
    <motion.div 
      className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-red-900/20 dark:via-orange-900/20 dark:to-yellow-900/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700 rounded-full flex items-center justify-center shadow-2xl mb-6"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <AlertCircle className="w-10 h-10 text-white" />
      </motion.div>
      
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Connection Error
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {checkError || 'Unable to verify your vote status. Please check your connection and try again.'}
        </p>
        
        <motion.button
          onClick={() => {
            setIsChecking(true);
            setRetryCount(0);
            checkVoteStatus(true);
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-700 dark:hover:from-blue-700 dark:hover:to-indigo-800 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/40"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );

  // Show loading while checking vote status
  if (isChecking || authLoading) {
    return <LoadingComponent />;
  }

  // Show error if check failed
  if (checkError && retryCount >= 3) {
    return <ErrorComponent />;
  }

  // If user has voted and we're not showing results, don't render the voting page
  if (hasVoted) {
    const params = new URLSearchParams(location.search);
    if (params.get('showResults') !== '1') {
      return null; // The redirect will handle this
    }
  }

  // Render the voting page if user hasn't voted or if we're showing results
  return children;
};

ProtectedVotingRoute.displayName = 'ProtectedVotingRoute';

export default ProtectedVotingRoute; 