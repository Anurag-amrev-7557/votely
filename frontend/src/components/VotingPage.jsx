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
    // Scroll to top when component mounts
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showExitModal) {
          setShowExitModal(false);
        } else if (showKeyboardShortcuts) {
          setShowKeyboardShortcuts(false);
        } else {
          setShowExitModal(true);
        }
      } else if (e.key === '?' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowKeyboardShortcuts(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showExitModal, showKeyboardShortcuts]);

  const handleOptionChange = (optionId) => {
    setSelectedOption(optionId);
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-[#c7d7e9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={() => navigate('/polls')}
          className="text-blue-600 dark:text-[#c7d7e9] hover:underline"
        >
          Return to Polls
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#15191e] transition-colors duration-200">
      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-[#1e242c] rounded-xl p-6 sm:p-8 max-w-md w-full mx-4 animate-scale-in">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                Exit Voting Session?
              </h3>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {currentQuestionIndex > 0 
                  ? "You have made progress in this poll. Are you sure you want to exit? Your progress will be lost."
                  : "Are you sure you want to exit? You can return to this poll later."}
              </p>
              
              {currentQuestionIndex > 0 && (
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
                    You have completed {currentQuestionIndex} out of {poll?.totalQuestions} questions.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                Continue Voting
              </button>
              <button
                onClick={handleExit}
                className="w-full sm:w-auto px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
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