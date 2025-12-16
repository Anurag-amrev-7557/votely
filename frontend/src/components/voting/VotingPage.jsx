import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import { Canvas } from '@react-three/fiber';

// Components & Hooks
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../utils/api/axiosConfig';
import { toast } from '../../utils/toastUtils';
import { io as socketIOClient } from 'socket.io-client';
import CandidateDetailView from './CandidateDetailView';
import EnhancedResultsDisplay from './EnhancedResultsDisplay';
import EnhancedVoteConfirmation from './EnhancedVoteConfirmation';
import Timer from '../ui/Timer';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const VotingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Theme & Visuals
  const { isDarkMode } = useTheme();
  const bcgColor = isDarkMode ? '#000000' : '#ffffff';
  const finalParticleColor = isDarkMode ? '#ffffff' : '#111827';

  // State
  const { user, isLoading: authLoading } = useAuth();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Results & Confirmation State
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [results, setResults] = useState(null);

  // Socket
  const socketRef = useRef(null);

  // Initial Fetch & Logic
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    const fetchPoll = async () => {
      if (authLoading) return;

      // 1. Check if user already voted locally first (speculative check)
      if (user && !location.search.includes('showResults=1')) {
        try {
          // We can try to check status, but let's rely on the main fetch to be safe unless latency is high
        } catch (e) { }
      }

      setLoading(true);
      try {
        const response = await axiosInstance.get(`/polls/${pollId}`);
        const pollData = response.data;

        // Check vote status
        if (user) {
          try {
            const voteResponse = await axiosInstance.get(`/votes/${pollId}`);
            pollData.userVote = voteResponse.data.vote;
          } catch (err) {
            pollData.userVote = null;
            if (err.response?.status !== 404) console.warn(err);
          }
        } else {
          pollData.userVote = null;
        }

        setPoll(pollData);

        // Redirects logic
        if (pollData.userVote && !location.search.includes('showResults=1')) {
          toast.success('You have already voted. Showing results.');
          navigate(`/vote/${pollId}?showResults=1`, { replace: true });
          return;
        }

        if (pollData.status === 'completed') {
          toast('This poll has ended.');
          navigate(`/vote/${pollId}?showResults=1`, { replace: true });
          return;
        }

      } catch (err) {
        console.error(err);
        setError('Poll not found or access denied.');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId, user, authLoading, navigate, location.search]);

  // Results Mode Effect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showResults') === '1') {
      const loadResults = async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/polls/${pollId}/results`);
          setResults(res.data);
          setShowResults(true);
        } catch (e) {
          setError('Failed to load results.');
        } finally {
          setLoading(false);
        }
      }
      loadResults();
    }
  }, [location.search, pollId]);

  // Handle Option Selection
  const handleOptionChange = useCallback((optionText) => {
    if (!poll) return;
    const settings = poll.settings || {};
    const allowMultiple = settings.allowMultipleVotes;
    const maxVotes = settings.maxVotesPerVoter || 1;

    if (allowMultiple) {
      if (selectedOptions.includes(optionText)) {
        setSelectedOptions(prev => prev.filter(o => o !== optionText));
      } else {
        if (selectedOptions.length < maxVotes) {
          setSelectedOptions(prev => [...prev, optionText]);
        } else {
          toast.error(`Max options reached (${maxVotes})`);
        }
      }
    } else {
      setSelectedOptions([optionText]);
    }
  }, [poll, selectedOptions]);

  // Handle Submit
  const handleSubmitVote = async () => {
    if (!selectedOptions.length) return toast.error('Select an option first.');
    if (!user) return toast.error('Login required to vote.');

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/votes/vote', {
        pollId,
        options: selectedOptions
      });

      toast.success('Vote Cast Successfully! Immutable.');

      // Optimistic Update
      setPoll(prev => ({
        ...prev,
        userVote: {
          options: response.data.votedOptions,
          hash: response.data.voteHash,
          votedAt: new Date().toISOString()
        }
      }));

      setShowVoteConfirmation(false);
      navigate(`/vote/${pollId}?showResults=1`, { replace: true });

    } catch (err) {
      toast.error(err.response?.data?.error || 'Vote failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Socket Logic for Live Results
  useEffect(() => {
    if (!showResults) return;
    if (!socketRef.current) {
      const socket = socketIOClient('/', { withCredentials: true });
      socketRef.current = socket;
      socket.emit('joinPollRoom', pollId);
      socket.on('pollResults', (data) => {
        if (data.pollId === pollId) {
          setResults({ options: data.options, totalVotes: data.totalVotes });
        }
      });
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [showResults, pollId]);

  // Display Logic
  const displayedOptions = useMemo(() => {
    if (!poll || !poll.options) return [];
    if (poll.settings?.randomizeCandidateOrder) {
      // Need a consistently randomized order for the user session, but for now simple sort
      // In a real app we'd seed this. 
      // The original logic re-randomized on render? No, useMemo fixes that.
      return [...poll.options].sort(() => Math.random() - 0.5);
    }
    return poll.options;
  }, [poll]);

  // --- RENDER ---

  // 1. Loading State
  if (loading || authLoading) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-black overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="z-10 flex flex-col items-center gap-6"
        >
          <Loader2 className="w-12 h-12 animate-spin text-gray-900 dark:text-white" />
          <p className="text-xl tracking-widest font-bold uppercase text-gray-500">Loading Poll Data...</p>
        </motion.div>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 dark:text-white">Unable to Load Poll</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{error}</p>
          <button onClick={() => navigate('/polls')} className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:scale-105 transition-transform">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // 3. Results Mode
  if (showResults && results) {
    return (
      <EnhancedResultsDisplay
        poll={poll}
        results={results}
        userVote={poll?.userVote}
        onBack={() => navigate('/polls')}
        showLiveResults={poll?.settings?.showLiveResults}
      />
    );
  }

  // 4. Already Voted (Static View Mode) - If somehow we missed the redirect
  if (poll?.userVote && !showVoteConfirmation) {
    // Should have redirected, but safe fallback
    return null;
  }

  // 5. MAIN VOTING UI
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white overflow-x-hidden selection:bg-blue-500/30 font-sans">

      {/* Header / Nav (Simple) */}
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => setShowExitConfirmation(true)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Abort
          </button>
          <div className="text-sm font-mono text-gray-400">
            SECURE VOTING PROTOCOL
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="mx-auto px-4 py-8 md:py-16">

        {/* Poll Header Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-6">
            Official Ballot
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 text-gray-900 dark:text-white">
            {poll?.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {poll?.description || "Please review the candidates below carefully. Select your choice to proceed to the secure confirmation step."}
          </p>

          {/* Meta Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            {poll?.settings?.timeLimit && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-mono font-bold text-red-600 dark:text-red-400">
                  <Timer timeLimit={poll.settings.timeLimit} onExpire={() => { }} />
                </span>
              </div>
            )}
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-zinc-700" />
            <div>
              {poll?.options?.length} Candidates
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-zinc-700" />
            <div>
              {poll?.settings?.allowMultipleVotes ? `Select up to ${poll.settings.maxVotesPerVoter}` : 'Select One Choice'}
            </div>
          </div>
        </motion.div>

        {/* Detailed Candidate Grid */}
        <div
          className="grid grid-cols-2 gap-6 mb-24 mx-auto"
          role={poll?.settings?.allowMultipleVotes ? 'group' : 'radiogroup'}
          aria-label="Poll Options"
        >
          <AnimatePresence>
            {displayedOptions.map((option, idx) => (
              <CandidateDetailView
                key={option.id || idx}
                index={idx}
                option={option}
                isSelected={selectedOptions.includes(option.text)}
                onSelect={handleOptionChange}
                disabled={isSubmitting || !user}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Floating Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-200 dark:border-zinc-800 z-40"
        >
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {selectedOptions.length === 0
                ? "Your vote is ready to be cast."
                : <span className="text-gray-900 dark:text-white font-bold">{selectedOptions.length} candidate{selectedOptions.length !== 1 ? 's' : ''} selected</span>
              }
              {!user && <span className="text-red-500 ml-2">(Login required)</span>}
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              {selectedOptions.length > 0 && (
                <button
                  onClick={() => setSelectedOptions([])}
                  className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}

              <button
                onClick={() => setShowVoteConfirmation(true)}
                disabled={selectedOptions.length === 0 || isSubmitting || !user}
                className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold tracking-tight shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Review & Submit Vote"}
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showVoteConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowVoteConfirmation(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden"
            >
              <EnhancedVoteConfirmation
                poll={poll}
                selectedOptions={selectedOptions}
                isSubmitting={isSubmitting}
                onConfirm={handleSubmitVote}
                onCancel={() => setShowVoteConfirmation(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowExitConfirmation(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-zinc-800 text-center"
            >
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Exit Polling Station?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-sm leading-relaxed">
                Are you sure you want to leave? Your current selection will be lost and you will need to restart the voting process.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowExitConfirmation(false)}
                  className="px-4 py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate('/polls')}
                  className="px-4 py-3 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/20 transition-all"
                >
                  Yes, Exit
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VotingPage;