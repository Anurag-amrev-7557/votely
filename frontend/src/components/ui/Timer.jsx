import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';

const Timer = ({ timeLimit, onExpire, showProgress = true, size = 'default' }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Memoize calculations
  const timerData = useMemo(() => {
    const progress = ((timeLimit - timeLeft) / timeLimit) * 100;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formattedTime = `${mins}:${secs.toString().padStart(2, '0')}`;
    
    // Enhanced color logic with more granular states
    let colorClass = 'text-blue-600 dark:text-blue-400';
    let urgencyLevel = 'normal';
    
    if (timeLeft <= 10) {
      colorClass = 'text-red-600 dark:text-red-400';
      urgencyLevel = 'critical';
    } else if (timeLeft <= 30) {
      colorClass = 'text-orange-600 dark:text-orange-400';
      urgencyLevel = 'warning';
    } else if (timeLeft <= 60) {
      colorClass = 'text-yellow-600 dark:text-yellow-400';
      urgencyLevel = 'caution';
    }

    return {
      progress,
      formattedTime,
      colorClass,
      urgencyLevel,
      isCritical: timeLeft <= 10,
      isWarning: timeLeft <= 30 && timeLeft > 10
    };
  }, [timeLeft, timeLimit]);

  // Enhanced timer logic with pause capability
  useEffect(() => {
    if (timeLeft <= 0 || isPaused) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isPaused, onExpire]);

  // Handle pause/resume
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Size variants
  const sizeClasses = {
    small: 'text-xs gap-1.5',
    default: 'text-sm gap-2',
    large: 'text-lg gap-3'
  };

  const iconSizes = {
    small: 'w-3 h-3',
    default: 'w-4 h-4',
    large: 'w-6 h-6'
  };

  return (
    <motion.div 
      className={`flex items-center ${sizeClasses[size]} font-semibold ${timerData.colorClass} transition-all duration-300`}
      role="timer"
      aria-live="polite"
      aria-label={`Time remaining: ${timerData.formattedTime}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        ...(timerData.isCritical && { scale: [1, 1.05, 1] })
      }}
      transition={{ 
        duration: 0.3,
        ...(timerData.isCritical && { 
          repeat: Infinity, 
          repeatType: "reverse",
          duration: 0.5 
        })
      }}
    >
      {/* Progress Ring (optional) */}
      {showProgress && (
        <div className="relative">
          <svg className={`${iconSizes[size]} transform -rotate-90`} viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="100"
              strokeDashoffset={100 - timerData.progress}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <svg className={`${iconSizes[size]} absolute top-0 left-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
      )}

      {/* Timer Display */}
      <AnimatePresence mode="wait">
        <motion.span
          key={timerData.formattedTime}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="font-mono"
        >
          {timerData.formattedTime}
        </motion.span>
      </AnimatePresence>

      {/* Pause/Resume Button */}
      <motion.button
        onClick={togglePause}
        className="ml-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isPaused ? 'Resume timer' : 'Pause timer'}
      >
        <svg className={`${iconSizes[size]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isPaused ? (
            <polygon points="5,3 19,12 5,21" stroke="currentColor" strokeWidth="2" fill="currentColor" />
          ) : (
            <rect x="6" y="4" width="4" height="16" stroke="currentColor" strokeWidth="2" fill="currentColor" />
          )}
        </svg>
      </motion.button>

      {/* Critical Time Warning */}
      {timerData.isCritical && (
        <motion.div
          className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          Hurry!
        </motion.div>
      )}
    </motion.div>
  );
};

Timer.propTypes = {
  timeLimit: PropTypes.number.isRequired,
  onExpire: PropTypes.func.isRequired,
  showProgress: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'default', 'large'])
};

export default Timer;