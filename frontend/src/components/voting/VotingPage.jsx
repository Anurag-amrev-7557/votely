import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';

import { useAuth } from '../../context/AuthContext';
import { X, Bell, ArrowLeft, ArrowRight } from '../ui/icons';
// Remove direct axios import since we're using axiosInstance
import toast from 'react-hot-toast';
import { io as socketIOClient } from 'socket.io-client';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import ProgressBar from '../ui/ProgressBar';
import RadioOption from '../ui/RadioOption';
import ShareButtons from '../ui/ShareButtons';
import Timer from '../ui/Timer';
import EnhancedResultsDisplay from './EnhancedResultsDisplay';
import EnhancedVoteConfirmation from './EnhancedVoteConfirmation';
import axiosInstance from '../../utils/api/axiosConfig';

// Memoize RadioOption for performance
const MemoRadioOption = React.memo(RadioOption);

const VotingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const optionsRef = useRef([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const location = useLocation();
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const socketRef = useRef(null);
  const [redirecting, setRedirecting] = useState(false);

  // Helper: Check if poll is active
  const isPollActive = poll => poll && poll.status === 'active';
const isPollPast = poll => poll && poll.status === 'completed';
const isPollUpcoming = poll => poll && poll.status === 'upcoming';

  useEffect(() => {
    // Enhanced scroll management with smooth animation and position restoration
    const scrollToTop = () => {
      if (window.scrollY > 0) {
        const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: supportsSmoothScroll ? 'smooth' : 'instant'
        });
      }
    };
    const scrollTimer = setTimeout(scrollToTop, 50);
    return () => clearTimeout(scrollTimer);
  }, []);

  useEffect(() => {
    const fetchPoll = async () => {
      // Don't fetch if auth is still loading
      if (authLoading) {
        return;
      }
      
      // Quick check: If user is authenticated, check if they've already voted before fetching poll
      if (user && !authLoading && !location.search.includes('showResults=1')) {
        try {
          const voteResponse = await axiosInstance.get(`/votes/${pollId}`);
          // If we get here, user has already voted - redirect immediately
          toast('You have already voted in this poll. Redirecting to results...', { icon: 'ℹ️' });
          setTimeout(() => navigate(`/vote/${pollId}?showResults=1`), 1500);
          setRedirecting(true);
          return;
        } catch (voteErr) {
          // User hasn't voted or there was an error - continue with normal flow
          if (voteErr.response?.status !== 404) {
            console.warn('Error checking vote status:', voteErr);
          }
        }
      }
      
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/polls/${pollId}`);
        const pollData = response.data;
        
        // Check if user has already voted in this poll (only if authenticated and auth is loaded)
        if (user && !authLoading) {
          try {
            const voteResponse = await axiosInstance.get(`/votes/${pollId}`);
            pollData.userVote = voteResponse.data.vote;
          } catch (voteErr) {
            // User hasn't voted or there was an error - that's fine
            if (voteErr.response?.status !== 404) {
              console.warn('Error checking vote status during poll fetch:', voteErr);
            }
            pollData.userVote = null;
          }
        } else {
          // User is not authenticated or auth is still loading, so they haven't voted
          pollData.userVote = null;
        }
        
        setPoll(pollData);
        setError(null);
        
        // Strict check: If user has already voted, redirect to results immediately
        if (pollData.userVote && !location.search.includes('showResults=1')) {
          toast('You have already voted in this poll. Redirecting to results...', { icon: 'ℹ️' });
          setTimeout(() => navigate(`/vote/${pollId}?showResults=1`), 1500);
          setRedirecting(true);
          return;
        }
        
        // Route guard: If poll is not active, redirect to results or /polls
        if (pollData.status === 'completed') {
          toast('This poll has ended. Redirecting to results...', { icon: 'ℹ️' });
          setTimeout(() => navigate(`/vote/${pollId}?showResults=1`), 1500);
          setRedirecting(true);
        } else if (pollData.status === 'upcoming') {
          toast('This poll is not open yet. Redirecting to polls...', { icon: 'ℹ️' });
          setTimeout(() => navigate('/polls'), 1500);
          setRedirecting(true);
        }
      } catch (err) {
        setError('Failed to load poll');
        toast.error('Poll not found. Redirecting to polls...');
        setTimeout(() => navigate('/polls'), 2000);
        setRedirecting(true);
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pollId, user, authLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showResults') === '1') {
      (async () => {
        setLoading(true);
        try {
          const res = await axiosInstance.get(`/polls/${pollId}/results`);
          setResults(res.data);
          setShowResults(true);
        } catch (err) {
          setError('Failed to load results');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [location.search, pollId]);

  useEffect(() => {
    if (poll && poll.options && poll.settings?.randomizeCandidateOrder) {
      const shuffled = [...poll.options].sort(() => Math.random() - 0.5);
      setPoll(prev => ({ ...prev, options: shuffled }));
    }
    // eslint-disable-next-line
  }, [pollId, poll?.settings?.randomizeCandidateOrder]);

  const handleNext = async () => {
    if (!selectedOptions.length) {
      toast.error('Please select at least one option to vote.');
      return;
    }
    
    if (!user || authLoading) {
      toast.error('You must be logged in to vote.');
      return;
    }
    
    setShowVoteConfirmation(true);
  };

  const handleSubmitVote = async () => {
    if (!selectedOptions.length) {
      toast.error('Please select at least one option to vote.');
      return;
    }

    if (!user || authLoading) {
      toast.error('You must be logged in to vote.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/votes/vote', {
        pollId: pollId,
        options: selectedOptions
      });

      toast.success('Vote submitted successfully!');
      
      // Show results after successful vote
      setShowVoteConfirmation(false);
      setShowResults(true);
      
      // Fetch updated results
      const resultsResponse = await axiosInstance.get(`/polls/${pollId}/results`);
      setResults(resultsResponse.data);
      
    } catch (error) {
      console.error('Error submitting vote:', error);
      const errorMessage = error.response?.data?.error || 'Failed to submit vote. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOptions([]);
    } else {
      setShowExitModal(true);
    }
  };

  const handleExit = () => {
    navigate('/polls');
  };

  // Advanced Keyboard Navigation System with Accessibility, Performance, and UX Enhancements
  useEffect(() => {
    // Performance optimization: Debounced key handler to prevent excessive re-renders
    let keyDownTimeout;
    const debouncedKeyHandler = (handler) => {
      clearTimeout(keyDownTimeout);
      keyDownTimeout = setTimeout(handler, 10);
    };

    // Enhanced keyboard navigation with comprehensive shortcuts
    const handleKeyDown = (e) => {
      // Prevent default behavior for application shortcuts
      const isApplicationShortcut = (e.metaKey || e.ctrlKey) && 
        ['?', 'k', 'n', 'p', 'b', 'Enter', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
      
      if (isApplicationShortcut) {
        e.preventDefault();
      }

      // Modal management with intelligent state handling
      if (e.key === 'Escape') {
        debouncedKeyHandler(() => {
          if (showExitModal) {
            setShowExitModal(false);
            // Focus management: Return focus to the last active element
            const lastActiveElement = document.querySelector('[data-last-active]');
            if (lastActiveElement) {
              lastActiveElement.focus();
              lastActiveElement.removeAttribute('data-last-active');
            }
          } else if (showKeyboardShortcuts) {
            setShowKeyboardShortcuts(false);
          } else {
            // Store current focus for restoration
            const activeElement = document.activeElement;
            if (activeElement && activeElement !== document.body) {
              activeElement.setAttribute('data-last-active', 'true');
            }
            setShowExitModal(true);
          }
        });
      }

      // Advanced shortcut system with modifier key support
      else if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        debouncedKeyHandler(() => setShowKeyboardShortcuts(true));
      }

      // Navigation shortcuts for better UX
      else if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        debouncedKeyHandler(() => {
          if (selectedOptions.length > 0) {
            handleNext();
          }
        });
      }

      else if (e.key === 'p' && (e.metaKey || e.ctrlKey)) {
        debouncedKeyHandler(() => {
          if (currentQuestionIndex > 0) {
            handleBack();
          }
        });
      }

      // Arrow key navigation for option selection
      else if (['ArrowUp', 'ArrowDown'].includes(e.key) && !showExitModal && !showKeyboardShortcuts) {
        e.preventDefault();
        debouncedKeyHandler(() => {
          const options = poll?.options || [];
          if (options.length === 0) return;

          const currentIndex = selectedOptions.length > 0 ? selectedOptions.findIndex(opt => opt === selectedOptions[0]) : -1;
          let newIndex;

          if (e.key === 'ArrowUp') {
            newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
          } else {
            newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
          }

          const newSelectedOptions = [options[newIndex]];
          setSelectedOptions(newSelectedOptions);
          
          // Scroll the selected option into view with smooth animation
          const optionElement = document.querySelector(`[data-option-text="${options[newIndex].text}"]`);
          if (optionElement) {
            optionElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'nearest',
              inline: 'nearest'
            });
          }
        });
      }

      // Quick selection with number keys
      else if (/^[1-9]$/.test(e.key) && !showExitModal && !showKeyboardShortcuts) {
        debouncedKeyHandler(() => {
          const options = poll?.options || [];
          const optionIndex = parseInt(e.key) - 1;
          if (optionIndex < options.length) {
            setSelectedOptions([options[optionIndex].text]);
          }
        });
      }

      // Enter/Space for option selection and navigation
      else if (['Enter', ' '].includes(e.key) && !showExitModal && !showKeyboardShortcuts) {
        e.preventDefault();
        debouncedKeyHandler(() => {
          if (selectedOptions.length > 0) {
            handleNext();
          }
        });
      }

      // Accessibility: Screen reader announcements
      else if (e.key === 'Tab') {
        // Announce current state to screen readers
        const announcement = `Question ${currentQuestionIndex + 1} of ${poll?.totalQuestions || 0}. ${selectedOptions.length > 0 ? 'Options selected' : 'No options selected'}`;
        const announcementElement = document.createElement('div');
        announcementElement.setAttribute('aria-live', 'polite');
        announcementElement.setAttribute('aria-atomic', 'true');
        announcementElement.className = 'sr-only';
        announcementElement.textContent = announcement;
        document.body.appendChild(announcementElement);
        
        // Clean up after announcement
        setTimeout(() => {
          if (announcementElement.parentNode) {
            announcementElement.parentNode.removeChild(announcementElement);
          }
        }, 1000);
      }
    };

    // Enhanced event listener with passive option for better performance
    const options = { passive: false, capture: false };
    window.addEventListener('keydown', handleKeyDown, options);

    // Cleanup function with comprehensive cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown, options);
      clearTimeout(keyDownTimeout);
      
      // Clean up any remaining data attributes
      const lastActiveElements = document.querySelectorAll('[data-last-active]');
      lastActiveElements.forEach(el => el.removeAttribute('data-last-active'));
    };
  }, [
    showExitModal, 
    showKeyboardShortcuts, 
    selectedOptions, 
    currentQuestionIndex, 
    poll?.totalQuestions, 
    poll?.options,
    handleNext,
    handleBack
  ]);

  // Memoize shuffled options if randomizeCandidateOrder is enabled
  const displayedOptions = useMemo(() => {
    if (poll && poll.options && poll.settings?.randomizeCandidateOrder) {
      return [...poll.options].sort(() => Math.random() - 0.5);
    }
    return poll?.options || [];
  }, [poll]);

  // Memoize progress calculation
  const progress = useMemo(() => Math.round(((currentQuestionIndex + 1) / (poll?.totalQuestions || 1)) * 100), [currentQuestionIndex, poll?.totalQuestions]);

  // Stable handlers
  const handleOptionChange = useCallback((optionText) => {
    const allowMultiple = poll?.settings?.allowMultipleVotes;
    const maxVotes = poll?.settings?.maxVotesPerVoter || 1;
    if (allowMultiple) {
      if (selectedOptions.includes(optionText)) {
        setSelectedOptions(selectedOptions.filter(opt => opt !== optionText));
      } else {
        if (selectedOptions.length < maxVotes) {
          setSelectedOptions([...selectedOptions, optionText]);
        } else {
          toast.error(`You can select up to ${maxVotes} option(s).`);
        }
      }
    } else {
      setSelectedOptions([optionText]);
    }
  }, [poll?.settings?.allowMultipleVotes, poll?.settings?.maxVotesPerVoter, selectedOptions]);

  // Real-time results subscription
  useEffect(() => {
    if (!showResults && !showVoteConfirmation) return;
    if (!pollId) return;
    if (socketRef.current) return; // Prevent multiple connections

          const socket = socketIOClient('/', {
      withCredentials: true,
    });
    socketRef.current = socket;
    socket.emit('joinPollRoom', pollId);
    socket.on('pollResults', (data) => {
      if (data.pollId === pollId) {
        setResults({ options: data.options, totalVotes: data.totalVotes });
      }
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [showResults, showVoteConfirmation, pollId]);

  // Loading state for all async actions
  if (loading || redirecting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-[#3f4c5a] border-t-blue-600 dark:border-t-[#c7d7e9] mb-4"></div>
        <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">{redirecting ? 'Redirecting...' : 'Loading poll...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">{error}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">If this problem persists, please try refreshing the page or report the issue below.</div>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/polls')}
            className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            Back to Polls
          </button>
          <button
            onClick={() => window.open(`mailto:support@yourpollapp.com?subject=Voting%20Error%20for%20Poll%20ID%20${encodeURIComponent(pollId)}&body=Describe%20the%20issue%20here.`)}
            className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition focus:outline-none focus:ring-2 focus:ring-red-400 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
            Report Issue
          </button>
        </div>
      </div>
    );
  }

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

  // Check if user has already voted and show appropriate message
  if (poll?.userVote && !showResults && !showVoteConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
        <div className="layout-container flex h-full grow flex-col">
          <div className="flex-1 pt-16 sm:pt-8 pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="mt-4 sm:mt-16 rounded-xl shadow-sm border border-gray-200 dark:border-[#3f4c5a] bg-white dark:bg-[#1e242c]">
                <div className="p-6 sm:p-8">
                  {/* Header */}
                  <div className="flex items-center gap-3 sm:gap-4 mb-6">
                    <button
                      onClick={() => navigate('/polls')}
                      className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                      aria-label="Go back to polls"
                    >
                      <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                        Already Voted
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                        {poll?.title}
                      </p>
                    </div>
                  </div>

                  {/* Already Voted Message */}
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      You have already voted in this poll
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                      Thank you for participating! Your vote has been recorded successfully.
                    </p>
                    
                    {/* Show previous vote if not anonymized */}
                    {poll?.settings?.voterNameDisplay !== 'anonymized' && poll.userVote.options && poll.userVote.options.length > 0 && (
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 mb-6">
                        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">
                          Your previous vote:
                        </p>
                        <p className="text-sm text-blue-700 dark:text-blue-300 font-semibold">
                          {poll.userVote.options.join(', ')}
                        </p>
                      </div>
                    )}
                    
                    {poll?.settings?.voterNameDisplay === 'anonymized' && (
                      <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                          This poll is anonymized. Your vote is private and cannot be shown.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <button
                      onClick={async () => {
                        try {
                          const res = await axiosInstance.get(`/polls/${pollId}/results`);
                          setResults(res.data);
                          setShowResults(true);
                        } catch (err) {
                          toast.error('Failed to load results');
                        }
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-blue-600 dark:bg-blue-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Results
                    </button>
                    <button
                      onClick={() => navigate('/polls')}
                      className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Back to Polls
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced Vote Confirmation Modal
  const VoteConfirmationModal = () => {
    if (!showVoteConfirmation || results) return null;
    
    return (
      <div role="dialog" aria-modal="true" aria-labelledby="vote-confirmation-title">
        <EnhancedVoteConfirmation
          poll={poll}
          selectedOptions={selectedOptions}
          isSubmitting={isSubmitting}
          onConfirm={handleSubmitVote}
          onCancel={() => setShowVoteConfirmation(false)}
          onBack={() => setShowVoteConfirmation(false)}
        />
      </div>
    );
  };

  if (poll && (!poll.options || poll.options.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        {/* Animated Icon with Pulse and Tooltip */}
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30 shadow-lg animate-pulse">
          <svg
            className="w-10 h-10 text-yellow-600 dark:text-yellow-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-yellow-50 dark:bg-yellow-900/80 text-yellow-800 dark:text-yellow-200 text-xs px-3 py-1 rounded shadow-lg border border-yellow-200 dark:border-yellow-800 opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
            No options configured
          </div>
        </div>
        {/* Advanced Message with Contextual Help */}
        <div className="text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-2">
          No options available for this poll.
          <span className="relative group">
            <button
              tabIndex={0}
              aria-label="Learn more about poll options"
              className="ml-1 text-yellow-500 hover:text-yellow-700 focus:outline-none"
            >
              <svg className="w-5 h-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0-4h.01" />
              </svg>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition">
              <strong>What does this mean?</strong>
              <br />
              This poll currently has no options to vote for. If you are an admin, you can add options in the poll management dashboard. If you believe this is an error, please contact the poll organizer.
            </div>
          </span>
        </div>
        {/* Poll Metadata (if available) */}
        {poll && (
          <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 text-center max-w-md">
            <div className="flex flex-col sm:flex-row sm:justify-center gap-2">
              {poll?.title && (
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Poll:</span> {poll.title}
                </span>
              )}
              {poll?.createdBy && (
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Created by:</span> {poll.createdBy.name || poll.createdBy.email || "Unknown"}
                </span>
              )}
              {poll?.createdAt && (
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Created:</span> {new Date(poll.createdAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        )}
        {/* Advanced: Suggest Action for Admins */}
        {poll?.isAdmin && (
          <div className="mb-4 flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 text-blue-700 dark:text-blue-200 text-sm animate-fade-in">
            <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
            </svg>
            <span>
              As an admin, you can <button
                onClick={() => navigate(`/admin/polls/${poll._id || poll.id}`)}
                className="underline font-semibold hover:text-blue-900 dark:hover:text-white focus:outline-none"
              >add options to this poll</button> in the dashboard.
            </span>
          </div>
        )}
        {/* Advanced: Report Issue Button */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            onClick={() => navigate('/polls')}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Back to Polls
          </button>
          <button
            onClick={() => window.open('mailto:support@yourpollapp.com?subject=Poll%20has%20no%20options&body=Poll%20ID:%20' + encodeURIComponent(poll?._id || poll?.id || ''))}
            className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition focus:outline-none focus:ring-2 focus:ring-yellow-400 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
            Report Issue
          </button>
        </div>
        {/* Accessibility: Live region for announcements */}
        <div
          aria-live="polite"
          className="sr-only"
          id="poll-no-options-announcement"
        >
          No options are available for this poll. Please return to the polls list or contact support.
        </div>
      </div>
    );
  }

  // Safety check: Don't render main interface if poll is null
  if (!poll) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div 
          className="relative"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-20 h-20 rounded-full border-4 border-gray-200 dark:border-[#3f4c5a] border-t-blue-600 dark:border-t-[#c7d7e9] shadow-lg"></div>
          <motion.div 
            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-400 dark:border-t-[#a8c7e8] opacity-60"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        <motion.div 
          className="mt-6 text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Loading Poll
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            Fetching poll details and preparing your voting experience...
          </p>
        </motion.div>
        
        <motion.div 
          className="mt-8 flex space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
      {/* Add skip link for accessibility at the top of the page */}
      <div className="sr-only focus:not-sr-only absolute top-2 left-2 z-50">
        <a href="#poll-options-label" className="bg-blue-600 text-white px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">Skip to Poll Options</a>
      </div>

      {/* Enhanced Exit Confirmation Modal */}
      <AnimatePresence>
        {showExitModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-modal-title"
            aria-describedby="exit-modal-description"
            tabIndex={-1}
            onKeyDown={e => {
              if (e.key === 'Tab') {
                // Trap focus inside modal
                const focusableEls = Array.from(document.querySelectorAll('.exit-modal [tabindex]:not([tabindex="-1"])'));
                if (focusableEls.length === 0) return;
                const firstEl = focusableEls[0];
                const lastEl = focusableEls[focusableEls.length - 1];
                if (e.shiftKey && document.activeElement === firstEl) {
                  e.preventDefault();
                  lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                  e.preventDefault();
                  firstEl.focus();
                }
              }
            }}
          >
            <motion.div 
              className="exit-modal bg-white dark:bg-[#1e242c] rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50"
              onClick={(e) => e.stopPropagation()}
              tabIndex={0}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-400 to-red-600 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400 to-yellow-600 rounded-full translate-y-12 -translate-x-12"></div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <motion.div 
                    className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <motion.h3 
                    id="exit-modal-title"
                    className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Exit Voting Session?
                  </motion.h3>
                </div>
                
                <motion.div 
                  className="space-y-3 sm:space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p 
                    id="exit-modal-description"
                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
                  >
                    {currentQuestionIndex > 0 
                      ? "You have made progress in this poll. Are you sure you want to exit? Your progress will be lost."
                      : "Are you sure you want to exit? You can return to this poll later."}
                  </p>
                  
                  {currentQuestionIndex > 0 && (
                    <motion.div 
                      className="p-3 sm:p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start gap-2">
                        <motion.svg 
                          className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, -5, 5, 0]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </motion.svg>
                        <div>
                          <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                            Progress Warning
                          </p>
                          <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-0.5">
                            You have completed {currentQuestionIndex} out of {poll?.totalQuestions} questions.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                <motion.div 
                  className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.button
                    onClick={() => setShowExitModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#2c353f] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e242c]"
                    aria-label="Continue voting session"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue Voting
                  </motion.button>
                  <motion.button
                    onClick={handleExit}
                    className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e242c]"
                    aria-label="Exit voting session and return to polls"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Exit to Polls
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vote Confirmation Modal */}
      <VoteConfirmationModal />

      <div className="layout-container flex h-full grow flex-col">
        <div className="flex-1 pt-16 sm:pt-8 pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mt-4 sm:mt-16 rounded-xl shadow-sm border border-gray-200 dark:border-[#3f4c5a]">
              <div className="p-4 sm:p-6">
                {/* Sticky Progress Bar for mobile */}
                <div className="sm:static fixed top-0 left-0 w-full z-40 bg-white dark:bg-[#15191e] sm:bg-transparent sm:dark:bg-transparent shadow sm:shadow-none transition-all duration-200" style={{ minHeight: '44px' }}>
                  <ProgressBar
                    progress={progress}
                    totalQuestions={poll?.totalQuestions || 1}
                    currentQuestion={currentQuestionIndex + 1}
                  />
                </div>
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <button
                        onClick={() => setShowExitModal(true)}
                        className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
                        aria-label="Exit voting session"
                      >
                        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                          Cast Your Vote
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                          {poll?.title}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300">
                        Question {currentQuestionIndex + 1} of {poll?.totalQuestions}
                      </span>
                    </div>
                  </div>

                  {/* Authentication Notice */}
                  {authLoading && (
                    <div className="mb-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 border-2 border-blue-600 dark:border-blue-400 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                            Loading...
                          </p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                            Checking authentication status...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!user && !authLoading && (
                    <div className="mb-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Login Required to Vote
                          </p>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            You need to be logged in to cast your vote in this poll.
                          </p>
                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() => navigate('/login')}
                              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200"
                            >
                              Login
                            </button>
                            <button
                              onClick={() => navigate('/register')}
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-200"
                            >
                              Register
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {poll?.options[currentQuestionIndex]?.text}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                      Select one option to continue
                    </p>
                  </div>
                </div>

                <section role="radiogroup" aria-labelledby="poll-options-label" aria-activedescendant={selectedOptions[0] ? `option-${selectedOptions[0]}` : undefined} className="mt-6">
                  <h2 id="poll-options-label" className="sr-only">
                    {poll?.title ? `${poll.title} options` : 'Poll options'}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-300">How to vote?</span>
                    <span className="relative group">
                      <button
                        tabIndex={0}
                        aria-label="Voting rules help"
                        className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                          <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </button>
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-xs rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-events-none transition">
                        <strong>Voting Rules:</strong>
                        <ul className="list-disc ml-4 mt-1 space-y-1">
                          <li>{poll?.settings?.allowMultipleVotes ? `You can select up to ${poll?.settings?.maxVotesPerVoter || 1} options.` : 'Select one option.'}</li>
                          {poll?.settings?.randomizeCandidateOrder && <li>Options are shown in random order for each voter.</li>}
                          {poll?.settings?.requireAuth && <li>You must be logged in to vote.</li>}
                        </ul>
                      </div>
                    </span>
                  </div>
                  <div className="flex justify-end mb-2">
                    {poll?.settings?.timeLimit && (
                      <Timer timeLimit={poll.settings.timeLimit} onExpire={handleExit} />
                    )}
                  </div>
                  <TransitionGroup className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-4" role={poll?.settings?.allowMultipleVotes ? 'group' : 'radiogroup'} aria-label="Voting options">
                    {displayedOptions && displayedOptions.length > 0 ? displayedOptions.map((option, index) => (
                      <CSSTransition key={option.id || option._id || index} timeout={300} classNames="fade-slide">
                        <div
                          id={`option-${option.text}`}
                          className={`flex items-center gap-4 p-4 py-2 rounded-2xl border transition-all duration-200 min-h-[44px] min-w-[44px] ${!user || authLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'} ${selectedOptions.includes(option.text) ? 'ring-2 ring-blue-500 scale-[1.03] bg-blue-50 dark:bg-blue-900/20' : 'hover:scale-[1.01] hover:bg-gray-50 dark:hover:bg-[#232b36]'} animate-fade-in`}
                          onClick={() => user && !authLoading && handleOptionChange(option.text)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              user && !authLoading && handleOptionChange(option.text);
                            }
                          }}
                          tabIndex={user && !authLoading ? 0 : -1}
                          role={poll?.settings?.allowMultipleVotes ? 'checkbox' : 'radio'}
                          aria-checked={selectedOptions.includes(option.text)}
                          aria-label={option.text + (option.description ? (', ' + option.description) : '')}
                          aria-selected={selectedOptions.includes(option.text)}
                          aria-disabled={!user || authLoading}
                          data-option-text={option.text}
                        >
                          <MemoRadioOption
                            option={option}
                            isSelected={selectedOptions.includes(option.text)}
                            onSelect={handleOptionChange}
                            index={index}
                            ref={(el) => (optionsRef.current[index] = el)}
                          />
                        </div>
                      </CSSTransition>
                    )) : (
                      <div className="text-center text-gray-500 dark:text-gray-400 py-8" aria-live="polite">No options available for this poll.</div>
                    )}
                  </TransitionGroup>
                  {poll?.settings?.allowMultipleVotes && (
                    <div className="mb-2 text-xs text-blue-600 dark:text-blue-300">You can select up to {poll?.settings?.maxVotesPerVoter || 1} options.</div>
                  )}
                </section>

                <div className="flex px-2 sm:px-4 py-3 justify-end gap-4">
                  <button
                    onClick={handleBack}
                    className={`flex min-w-[84px] max-w-[480px] min-h-[44px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                    aria-label="Go back to previous question"
                  >
                    <span className="truncate flex items-center gap-2">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Back
                    </span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedOptions.length || isSubmitting || !user || authLoading}
                    className={`flex min-w-[120px] max-w-[480px] min-h-[44px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 ${!selectedOptions.length || isSubmitting || !user || authLoading ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed' : 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e] hover:bg-blue-700 dark:hover:bg-[#b3c7e0] transform hover:scale-105'} focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                    aria-label="Submit Vote"
                    aria-disabled={!selectedOptions.length || isSubmitting || !user || authLoading}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white dark:border-[#15191e] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="truncate flex items-center gap-2">
                        Submit Vote
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingPage;