import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Shield,
  Users,
  BarChart3,
  Eye,
  Lock,
  Calendar,
  User,
  Info,
  ArrowLeft
} from '../ui/icons';

const EnhancedVoteConfirmation = ({
  poll,
  selectedOptions,
  isSubmitting,
  onConfirm,
  onCancel,
  onBack
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Calculate time remaining for the poll
  useEffect(() => {
    if (poll?.endDate) {
      const endTime = new Date(poll.endDate).getTime();
      const now = new Date().getTime();
      const remaining = endTime - now;

      if (remaining > 0) {
        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

        setTimeRemaining({ days, hours, minutes });
      }
    }
  }, [poll?.endDate]);

  const getVoteTypeInfo = () => {
    if (poll?.settings?.allowMultipleVotes) {
      const maxVotes = poll?.settings?.maxVotesPerVoter || selectedOptions.length;
      return {
        type: 'Multiple Choice',
        description: `You can select up to ${maxVotes} option${maxVotes > 1 ? 's' : ''}`,
        icon: Users,
        color: 'blue'
      };
    }
    return {
      type: 'Single Choice',
      description: 'You can select only one option',
      icon: CheckCircle,
      color: 'green'
    };
  };

  const getPrivacyInfo = () => {
    if (poll?.settings?.voterNameDisplay === 'anonymized') {
      return {
        type: 'Anonymous',
        description: 'Your vote will be completely anonymous',
        icon: Lock,
        color: 'purple'
      };
    }
    return {
      type: 'Public',
      description: 'Your vote may be visible to poll administrators',
      icon: Eye,
      color: 'orange'
    };
  };

  const voteTypeInfo = getVoteTypeInfo();
  const privacyInfo = getPrivacyInfo();
  const VoteTypeIcon = voteTypeInfo.icon;
  const PrivacyIcon = privacyInfo.icon;

  const getProgressPercentage = () => {
    if (!poll?.totalVotes) return 0;
    const maxExpected = 100; // Mock value - replace with actual expected voters
    return Math.min((poll.totalVotes / maxExpected) * 100, 100);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onCancel();
        }
      }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 w-full max-w-6xl mx-auto relative overflow-hidden max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 30 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 30,
          duration: 0.5
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/10 dark:to-indigo-900/20 rounded-3xl"></div>

        {/* Main Content - Horizontal Layout */}
        <div className="relative flex flex-col lg:flex-row min-h-0">
          {/* Left Side - Header and Poll Info */}
          <div className="flex-1 p-6 lg:p-8 lg:border-r border-gray-200/50 dark:border-gray-700/50">
            {/* Header Section */}
            <div className="text-center lg:text-left mb-6">
              <motion.div
                className="relative w-16 h-16 lg:w-20 lg:h-20 mx-auto lg:mx-0 mb-4 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 dark:from-emerald-600 dark:via-green-700 dark:to-teal-700 rounded-full flex items-center justify-center shadow-2xl"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 20,
                  delay: 0.1
                }}
                whileHover={{
                  scale: 1.05,
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Animated background rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30 dark:border-gray-300/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white/50 dark:border-gray-200/50"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />

                {/* Main icon container */}
                <motion.div
                  className="relative z-10"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.3,
                    type: "spring",
                    stiffness: 400,
                    damping: 15
                  }}
                  whileHover={{
                    scale: 1.1,
                    transition: { duration: 0.15 }
                  }}
                >
                  <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 text-white drop-shadow-lg" />
                </motion.div>

                {/* Success sparkle effect */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div
                    className="w-full h-full bg-yellow-300 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Confirm Your Vote
              </motion.h2>

              <motion.p
                className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Please carefully review your selections before submitting your vote
              </motion.p>
            </div>

            {/* Poll Information - Compact */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl p-4 border border-gray-200/60 dark:border-gray-600/60">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 text-center lg:text-left">
                  {poll?.title}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg bg-${voteTypeInfo.color}-100 dark:bg-${voteTypeInfo.color}-900/30 flex items-center justify-center`}>
                      <VoteTypeIcon className={`w-4 h-4 text-${voteTypeInfo.color}-600 dark:text-${voteTypeInfo.color}-400`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{voteTypeInfo.type}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{voteTypeInfo.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                    <div className={`w-8 h-8 rounded-lg bg-${privacyInfo.color}-100 dark:bg-${privacyInfo.color}-900/30 flex items-center justify-center`}>
                      <PrivacyIcon className={`w-4 h-4 text-${privacyInfo.color}-600 dark:text-${privacyInfo.color}-400`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">{privacyInfo.type}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{privacyInfo.description}</p>
                    </div>
                  </div>
                </div>

                {/* Poll Stats - Compact */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{poll?.totalVotes || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total Votes</div>
                  </div>
                  <div className="text-center p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">{poll?.options?.length || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Options</div>
                  </div>
                  <div className="text-center p-2 bg-white/80 dark:bg-gray-700/80 rounded-lg">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{selectedOptions.length}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Your Votes</div>
                  </div>
                </div>

                {/* Time Remaining - Compact */}
                {timeRemaining && (
                  <div className="flex items-center justify-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                    <span className="text-xs text-yellow-800 dark:text-yellow-200">
                      Ends in: {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Warning Notice - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-yellow-800 dark:text-yellow-200">
                    <p className="font-semibold mb-1">Important Notice</p>
                    <p>Once submitted, your vote cannot be changed or withdrawn.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Selections and Actions */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col">
            {/* Selected Options */}
            <motion.div
              className="flex-1 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="mb-3">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Your Selections ({selectedOptions.length})
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Review the options you've selected for this poll
                </p>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedOptions.map((option, index) => (
                  <motion.div
                    key={option}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200/50 dark:border-blue-700/50 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
                      {index + 1}
                    </div>
                    <span className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200">{option}</span>
                    <motion.div
                      className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Additional Details Toggle - Compact */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Additional Details
                </span>
                <motion.div
                  animate={{ rotate: showDetails ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </button>

              <AnimatePresence>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 space-y-2 overflow-hidden"
                  >
                    {/* Poll Creator Info */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs font-semibold text-blue-900 dark:text-blue-100">Poll Creator</span>
                      </div>
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        {poll?.createdBy?.name || poll?.createdBy?.email || 'Unknown'}
                      </p>
                    </div>

                    {/* Poll Dates */}
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <span className="text-xs font-semibold text-green-900 dark:text-green-100">Poll Timeline</span>
                      </div>
                      <div className="space-y-1 text-xs text-green-800 dark:text-green-200">
                        <p>Created: {poll?.createdAt ? new Date(poll.createdAt).toLocaleDateString() : 'Unknown'}</p>
                        <p>Ends: {poll?.endDate ? new Date(poll.endDate).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </div>

                    {/* Poll Description */}
                    {poll?.description && (
                      <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Eye className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                          <span className="text-xs font-semibold text-purple-900 dark:text-purple-100">Description</span>
                        </div>
                        <p className="text-xs text-purple-800 dark:text-purple-200">{poll.description}</p>
                      </div>
                    )}

                    {/* Participation Progress */}
                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                        <span className="text-xs font-semibold text-orange-900 dark:text-orange-100">Participation</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-orange-800 dark:text-orange-200">Progress</span>
                          <span className="text-orange-800 dark:text-orange-200 font-semibold">{getProgressPercentage().toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-orange-200 dark:bg-orange-800 rounded-full h-1.5">
                          <motion.div
                            className="bg-orange-500 h-1.5 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage()}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              {/* Primary Action Row */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
              >
                <button
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white font-bold hover:from-emerald-600 hover:to-teal-600 dark:hover:from-emerald-700 dark:hover:to-teal-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-emerald-500/40 focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-98 shadow-xl hover:shadow-2xl text-base relative overflow-hidden group"
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span className="font-semibold">Processing Vote...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-3 relative z-10">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring", stiffness: 400 }}
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.div>
                      <span className="font-semibold">Confirm & Submit Vote</span>
                    </span>
                  )}
                </button>
              </motion.div>

              {/* Secondary Actions Row */}
              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <button
                  onClick={onBack}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 font-semibold hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-slate-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-95 shadow-lg hover:shadow-xl text-sm border border-slate-300 dark:border-slate-600"
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      whileHover={{ x: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </motion.div>
                    <span>Go Back</span>
                  </span>
                </button>

                <button
                  onClick={onCancel}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-rose-50 to-red-100 dark:from-rose-900/40 dark:to-red-900/40 text-rose-700 dark:text-rose-200 font-semibold hover:from-rose-100 hover:to-red-200 dark:hover:from-rose-800/60 dark:hover:to-red-800/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-rose-500/30 focus:ring-offset-2 dark:focus:ring-offset-gray-800 active:scale-95 shadow-lg hover:shadow-xl text-sm border border-rose-200 dark:border-rose-800"
                >
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <XCircle className="w-4 h-4" />
                    </motion.div>
                    <span>Cancel Vote</span>
                  </span>
                </button>
              </motion.div>

              {/* Success Indicator */}
              {isSubmitting && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </motion.div>
                  <span>Securing your vote...</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedVoteConfirmation; 