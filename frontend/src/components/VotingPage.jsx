import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { X, Bell, ArrowLeft, ArrowRight } from './icons';

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

  useEffect(() => {
    // Enhanced scroll management with smooth animation and position restoration
    const scrollToTop = () => {
      // Check if we're already at the top to avoid unnecessary scrolling
      if (window.scrollY > 0) {
        // Use smooth scrolling for better UX, fallback to instant for older browsers
        const supportsSmoothScroll = 'scrollBehavior' in document.documentElement.style;
        
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: supportsSmoothScroll ? 'smooth' : 'instant'
        });
      }
    };

    // Execute scroll with a small delay to ensure DOM is fully rendered
    const scrollTimer = setTimeout(scrollToTop, 50);

    // Cleanup function to clear timeout if component unmounts
    return () => clearTimeout(scrollTimer);
  }, []);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        // Replace this with your actual API call
        const mockPoll = {
          id: pollId,
          title: "Who should be the next Mayor of Springfield?",
          description: "Vote for your preferred candidate for the position of Mayor.",
          currentQuestion: 1,
          totalQuestions: 2,
          progress: 50,
          endTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
          options: [
            { 
              id: '1', 
              label: 'Olivia Carter',
              description: 'Former City Council Member with 10 years of experience',
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
            },
            { 
              id: '2', 
              label: 'Ethan Bennett',
              description: 'Local Business Owner and Community Leader',
              image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
            },
            { 
              id: '3', 
              label: 'Sophia Ramirez',
              description: 'Environmental Activist and Policy Expert',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
            }
          ]
        };
        setPoll(mockPoll);
        setLoading(false);
      } catch (err) {
        setError('Failed to load poll');
        setLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  const handleNext = async () => {
    if (!selectedOption) {
      return;
    }

    if (currentQuestionIndex < poll.totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      try {
        setIsSubmitting(true);
        // Add your submission logic here
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setTimeout(() => navigate('/polls'), 1000);
      } catch (error) {
        setError('Failed to submit vote. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
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

          const currentIndex = selectedOption ? options.findIndex(opt => opt.id === selectedOption) : -1;
          let newIndex;

          if (e.key === 'ArrowUp') {
            newIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
          } else {
            newIndex = currentIndex >= options.length - 1 ? 0 : currentIndex + 1;
          }

          setSelectedOption(options[newIndex].id);
          
          // Scroll the selected option into view with smooth animation
          const optionElement = document.querySelector(`[data-option-id="${options[newIndex].id}"]`);
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
            setSelectedOption(options[optionIndex].id);
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

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };



  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50/80 dark:bg-[#15191e]/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-[#1e242c] rounded-2xl p-8 shadow-2xl border border-gray-200/50 dark:border-[#3f4c5a]/50">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-[#3f4c5a] border-t-blue-600 dark:border-t-[#c7d7e9]"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-blue-400 dark:border-t-[#8ba3c7] animate-ping opacity-20"></div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Loading Poll</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Preparing your voting experience...</p>
            </div>
            <div className="flex gap-1 mt-2">
              <div className="w-2 h-2 bg-blue-600 dark:bg-[#c7d7e9] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-[#c7d7e9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 dark:bg-[#c7d7e9] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-[#1e242c] rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-[#3f4c5a]/50">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Something went wrong</h3>
              <p className="text-red-600 dark:text-red-400 mb-6 text-sm leading-relaxed">{error}</p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-[#c7d7e9] dark:hover:bg-[#8ba3c7] dark:text-[#15191e] rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/polls')}
                  className="w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-[#3f4c5a] hover:border-gray-400 dark:hover:border-[#5a6b7a] rounded-lg transition-all duration-200 hover:shadow-md active:scale-95"
                >
                  Return to Polls
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-[#3f4c5a]">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  If this problem persists, please contact support
                </p>
              </div>
            </div>
          </div>
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

                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-0.5 sm:py-1 px-2 uppercase rounded-full text-blue-600 dark:text-[#c7d7e9] bg-blue-100 dark:bg-blue-900/30">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600 dark:text-[#c7d7e9]">
                          {Math.round(((currentQuestionIndex + 1) / poll?.totalQuestions) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-1.5 sm:h-2 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-[#3f4c5a]">
                      <div
                        className="transition-all duration-500 ease-out shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 dark:bg-[#c7d7e9]"
                        style={{ width: `${((currentQuestionIndex + 1) / poll?.totalQuestions) * 100}%` }}
                      />
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
                  {poll.options.map((option, index) => (
                    <RadioOption
                      key={option.id}
                      option={option}
                      isSelected={selectedOption === option.id}
                      onSelect={handleOptionChange}
                      index={index}
                      ref={el => optionsRef.current[index] = el}
                    />
                  ))}
                </div>
                
                <div className="flex px-2 sm:px-4 py-3 justify-end">
                  <button
                    onClick={handleBack}
                    disabled={!selectedOption || isSubmitting}
                    className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 sm:h-10 px-4 text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 ${
                      !selectedOption || isSubmitting
                        ? 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e] hover:bg-blue-700 dark:hover:bg-[#b3c7e0] transform hover:scale-105'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white dark:border-[#15191e] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="truncate flex items-center gap-2">
                        {currentQuestionIndex < poll.totalQuestions - 1 ? (
                          <>
                            Previous
                            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </>
                        ) : (
                          'Back to Polls'
                        )}
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