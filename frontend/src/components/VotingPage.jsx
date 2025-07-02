import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { X, Bell, ArrowLeft, ArrowRight } from './icons';
import axios from 'axios';
import toast from 'react-hot-toast';
import { io as socketIOClient } from 'socket.io-client';

const ProgressBar = ({ progress, totalQuestions, currentQuestion }) => (
  <div className="flex flex-col gap-3 p-4" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
    <div className="flex gap-6 justify-between items-center">
      <div className="flex items-center gap-2">
        <p className="text-gray-900 dark:text-white text-base font-medium leading-normal">Progress</p>
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
          {currentQuestion}/{totalQuestions}
        </span>
      </div>
      <p className="text-gray-600 dark:text-[#a0acbb] text-sm font-normal leading-normal">{progress}%</p>
    </div>
    <div className="rounded bg-gray-200 dark:bg-[#3f4c5a] overflow-hidden">
      <div 
        className="h-2 rounded bg-blue-600 dark:bg-[#c7d7e9] transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

const RadioOption = React.forwardRef(({ option, isSelected, onSelect, index }, ref) => (
  <div
    ref={ref}
    role="radio"
    aria-checked={isSelected}
    tabIndex={0}
    onClick={() => onSelect(option.id)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onSelect(option.id);
      }
    }}
    className={`group relative flex items-start p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
      isSelected 
        ? 'border-blue-600 dark:border-[#c7d7e9] bg-blue-50 dark:bg-[#1a2634] shadow-lg scale-[1.02]' 
        : 'border-gray-200 dark:border-[#3f4c5a] hover:border-blue-400 dark:hover:border-[#8ba3c7] hover:shadow-md'
    }`}
  >
    <div className="min-w-0 flex-1">
      <div className="flex items-start gap-4 sm:gap-6">
        {option.image && (
          <div className="relative">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-4 transition-all duration-300 ${
              isSelected 
                ? 'ring-blue-600 dark:ring-[#c7d7e9]' 
                : 'ring-gray-200 dark:ring-[#3f4c5a] group-hover:ring-blue-400 dark:group-hover:ring-[#8ba3c7]'
            }`}>
              <img 
                src={option.image} 
                alt={option.text}
                className="w-full h-full object-cover"
              />
            </div>
            {isSelected && (
              <div className="absolute -bottom-1 -right-1 bg-blue-600 dark:bg-[#c7d7e9] rounded-full p-1.5 animate-scale-in">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white dark:text-[#15191e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <h3 className={`text-base sm:text-lg font-semibold ${
              isSelected 
                ? 'text-blue-900 dark:text-[#c7d7e9]' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {option.text}
            </h3>
            <div className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              isSelected 
                ? 'border-blue-600 dark:border-[#c7d7e9] bg-blue-600 dark:bg-[#c7d7e9]' 
                : 'border-gray-300 dark:border-[#3f4c5a] group-hover:border-blue-400 dark:group-hover:border-[#8ba3c7]'
            }`}>
              {isSelected && (
                <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-white dark:bg-[#15191e] animate-scale-in" />
              )}
            </div>
          </div>
          {option.description && (
            <p className={`mt-1 text-xs sm:text-sm ${
              isSelected 
                ? 'text-blue-700 dark:text-[#8ba3c7]' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {option.description}
            </p>
          )}
          {option.party && (
            <div className={`mt-2 sm:mt-3 inline-flex items-center px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
              isSelected
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                : 'bg-gray-100 dark:bg-[#2c353f] text-gray-600 dark:text-gray-300'
            }`}>
              {option.party}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
));

const VotingPage = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [selectedOption, setSelectedOption] = useState(null);
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
  const isPollActive = poll => poll && (poll.status === 'Active' || poll.status === 'active');
  const isPollPast = poll => poll && (poll.status === 'Past' || poll.status === 'completed');
  const isPollUpcoming = poll => poll && (poll.status === 'Upcoming' || poll.status === 'upcoming');

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
      setLoading(true);
      try {
        const response = await axios.get(`/api/polls/${pollId}`);
        setPoll(response.data);
        setError(null);
        // Route guard: If poll is not active, redirect to results or /polls
        if (response.data.status && (response.data.status.toLowerCase() === 'past' || response.data.status.toLowerCase() === 'completed')) {
          toast('This poll has ended. Redirecting to results...', { icon: 'ℹ️' });
          setTimeout(() => navigate(`/vote/${pollId}?showResults=1`), 1500);
          setRedirecting(true);
        } else if (response.data.status && response.data.status.toLowerCase() === 'upcoming') {
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
  }, [pollId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('showResults') === '1') {
      (async () => {
        setLoading(true);
        try {
          const res = await axios.get(`/api/polls/${pollId}/results`);
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

  const handleNext = async () => {
    if (!selectedOption) {
      toast.error('Please select an option to vote.');
      return;
    }
    try {
      setIsSubmitting(true);
      await axios.post('http://localhost:5001/api/votes', { pollId, option: selectedOption }, { withCredentials: true });
      toast.success('Your vote has been submitted!');
      // Fetch latest poll data to get settings/resultDate
      const pollRes = await axios.get(`/api/polls/${pollId}`);
      const updatedPoll = pollRes.data;
      setPoll(updatedPoll);
      // Decide whether to show results or confirmation
      const showResultsAfterVote = updatedPoll.settings?.showResultsAfterVote;
      const resultDate = updatedPoll.resultDate ? new Date(updatedPoll.resultDate) : null;
      const now = new Date();
      if (showResultsAfterVote || (resultDate && now >= resultDate)) {
        // Fetch results after voting
        const res = await axios.get(`/api/polls/${pollId}/results`);
        setResults(res.data);
        setShowResults(true);
      } else if (resultDate) {
        setShowVoteConfirmation(true);
        toast.success(`Results will be available on ${resultDate.toLocaleString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })}`);
      } else {
        setShowVoteConfirmation(true);
        toast.success('Results will be available after the poll ends.');
      }
    } catch (error) {
      console.error('Vote submission error:', error?.response?.data || error);
      const backendMsg = error?.response?.data?.error || 'Failed to submit vote. Please try again.';
      toast.error(backendMsg);
      if (backendMsg === 'You have already voted in this poll') {
        navigate(`/vote/${pollId}?showResults=1`);
        // Do not set redirecting, just navigate immediately
      }
      // For other errors, do not set redirecting
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(null);
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
          if (selectedOption && currentQuestionIndex < poll?.totalQuestions - 1) {
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

          const currentIndex = selectedOption ? options.findIndex(opt => opt.text === selectedOption) : -1;
          let newIndex;

          if (e.key === 'ArrowUp') {
            newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
          } else {
            newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
          }

          setSelectedOption(options[newIndex].text);
          
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
            setSelectedOption(options[optionIndex].text);
          }
        });
      }

      // Enter/Space for option selection and navigation
      else if (['Enter', ' '].includes(e.key) && !showExitModal && !showKeyboardShortcuts) {
        e.preventDefault();
        debouncedKeyHandler(() => {
          if (selectedOption) {
            if (currentQuestionIndex < poll?.totalQuestions - 1) {
              handleNext();
            } else {
              handleNext(); // This will trigger submission
            }
          }
        });
      }

      // Accessibility: Screen reader announcements
      else if (e.key === 'Tab') {
        // Announce current state to screen readers
        const announcement = `Question ${currentQuestionIndex + 1} of ${poll?.totalQuestions || 0}. ${selectedOption ? 'Option selected' : 'No option selected'}`;
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
    selectedOption, 
    currentQuestionIndex, 
    poll?.totalQuestions, 
    poll?.options,
    handleNext,
    handleBack
  ]);

  const handleOptionChange = (optionText) => {
    setSelectedOption(optionText);
  };

  // Real-time results subscription
  useEffect(() => {
    if (!showResults && !showVoteConfirmation) return;
    if (!pollId) return;
    if (socketRef.current) return; // Prevent multiple connections

    const socket = socketIOClient('http://localhost:5001', {
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
        <div className="text-sm text-gray-500 dark:text-gray-400">Please try refreshing the page.</div>
      </div>
    );
  }

  if (showResults && results) {
    const totalVotes = results.totalVotes || (results.options ? results.options.reduce((sum, o) => sum + (o.votes || 0), 0) : 0);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] flex flex-col items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1e242c] rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Poll Results</h2>
          <h3 className="text-lg font-semibold mb-2 text-center">{poll?.title}</h3>
          <ul className="space-y-4">
            {results.options.map((option, idx) => {
              const percent = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
              return (
                <li key={idx} className="flex flex-col gap-1">
                  <span className="font-medium">{option.text}</span>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-blue-600 h-4 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span>{option.votes} votes</span>
                    <span>{percent}%</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex justify-center">
                <button
                  onClick={() => navigate('/polls')}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
              Back to Polls
                </button>
          </div>
        </div>
      </div>
    );
  }

  if (showVoteConfirmation && results) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-[#1e242c] rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Thank you for voting!</h2>
          <p className="mb-6">Your vote has been recorded. You can now view the poll results.</p>
          <button
            onClick={() => setShowVoteConfirmation(false)}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

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
              {poll.title && (
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Poll:</span> {poll.title}
                </span>
              )}
              {poll.createdBy && (
                <span>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Created by:</span> {poll.createdBy.name || poll.createdBy.email || "Unknown"}
                </span>
              )}
              {poll.createdAt && (
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="exit-modal-title"
          aria-describedby="exit-modal-description"
        >
          <div 
            className="bg-white dark:bg-[#1e242c] rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 animate-scale-in shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 animate-pulse">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 
                id="exit-modal-title"
                className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white"
              >
                Exit Voting Session?
              </h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <p 
                id="exit-modal-description"
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                {currentQuestionIndex > 0 
                  ? "You have made progress in this poll. Are you sure you want to exit? Your progress will be lost."
                  : "Are you sure you want to exit? You can return to this poll later."}
              </p>
              
              {currentQuestionIndex > 0 && (
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                        Progress Warning
                      </p>
                      <p className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300 mt-0.5">
                        You have completed {currentQuestionIndex} out of {poll?.totalQuestions} questions.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-[#2c353f] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e242c]"
                aria-label="Continue voting session"
              >
                Continue Voting
              </button>
              <button
                onClick={handleExit}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e242c]"
                aria-label="Exit voting session and return to polls"
              >
                <ArrowLeft className="w-4 h-4" />
                Exit to Polls
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="layout-container flex h-full grow flex-col">
        <div className="flex-1 pt-16 sm:pt-8 pb-4 sm:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="mt-4 sm:mt-16 rounded-xl shadow-sm border border-gray-200 dark:border-[#3f4c5a]">
              <div className="p-4 sm:p-6">
                <ProgressBar
                  progress={Math.round(((currentQuestionIndex + 1) / (poll?.totalQuestions || 1)) * 100)}
                  totalQuestions={poll?.totalQuestions || 1}
                  currentQuestion={currentQuestionIndex + 1}
                />
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

                  <div className="mt-4 sm:mt-6">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                      {poll?.options[currentQuestionIndex]?.text}
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                      Select one option to continue
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-3 p-2 sm:p-4" role="radiogroup" aria-label="Voting options">
                  {poll.options && poll.options.length > 0 ? poll.options.map((option, index) => (
                    <div key={option.id || option._id || index} className="flex items-center gap-4 p-4 rounded-lg border transition-all duration-200 cursor-pointer" onClick={() => handleOptionChange(option.text)}>
                      {option.image && (
                        <img src={option.image} alt={option.text} className="w-10 h-10 rounded-full object-cover" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold text-base sm:text-lg">{option.text}</div>
                        {option.description && <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>}
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedOption === option.text ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>{selectedOption === option.text && <div className="h-2.5 w-2.5 rounded-full bg-white" />}</div>
                    </div>
                  )) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">No options available for this poll.</div>
                  )}
                </div>

                <div className="flex px-2 sm:px-4 py-3 justify-end gap-4">
                  <button
                    onClick={handleBack}
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 ${
                      'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Back
                    </span>
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!selectedOption || isSubmitting}
                    className={`flex min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 ${
                      !selectedOption || isSubmitting
                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e] hover:bg-blue-700 dark:hover:bg-[#b3c7e0] transform hover:scale-105'
                    }`}
                    aria-label="Submit Vote"
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