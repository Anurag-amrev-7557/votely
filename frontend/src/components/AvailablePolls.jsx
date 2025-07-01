import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Bell, CaretDown, X } from './icons';
import { useTheme } from '../context/ThemeContext';
import { useDebounce } from '../hooks/useDebounce';

/**
 * Advanced Date Utility Functions
 * Provides comprehensive date manipulation and formatting capabilities
 * with timezone support, validation, and performance optimizations
 */

// Performance optimization: Cache timezone offset
const TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60000;

/**
 * Get current date in ISO format with timezone consideration
 * @param {string} format - Output format ('iso', 'local', 'utc')
 * @param {boolean} includeTime - Whether to include time component
 * @returns {string} Formatted date string
 */
const getCurrentDate = (format = 'iso', includeTime = false) => {
  const now = new Date();
  
  try {
    switch (format) {
      case 'iso':
        return includeTime 
          ? now.toISOString() 
          : now.toISOString().split('T')[0];
      
      case 'local':
        const localDate = new Date(now.getTime() - TIMEZONE_OFFSET);
        return includeTime 
          ? localDate.toISOString() 
          : localDate.toISOString().split('T')[0];
      
      case 'utc':
        return includeTime 
          ? now.toISOString() 
          : `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-${String(now.getUTCDate()).padStart(2, '0')}`;
      
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Date formatting error:', error);
    return now.toISOString().split('T')[0]; // Fallback
  }
};

/**
 * Get date relative to current date with advanced options
 * @param {number|object} options - Days ago or options object
 * @param {number} options.days - Days to subtract
 * @param {number} options.hours - Hours to subtract
 * @param {number} options.minutes - Minutes to subtract
 * @param {string} options.format - Output format
 * @param {boolean} options.includeTime - Include time component
 * @returns {string} Formatted date string
 */
const getDateDaysAgo = (options) => {
  const now = new Date();
  let targetDate = new Date(now);
  
  try {
    // Handle both number and object parameters
    if (typeof options === 'number') {
      targetDate.setDate(now.getDate() - options);
    } else if (typeof options === 'object') {
      const { days = 0, hours = 0, minutes = 0, format = 'iso', includeTime = false } = options;
      
      // Calculate total milliseconds to subtract
      const totalMs = (days * 24 * 60 * 60 * 1000) + (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
      targetDate = new Date(now.getTime() - totalMs);
      
      return getCurrentDate(format, includeTime);
    } else {
      throw new Error('Invalid parameter type. Expected number or object.');
    }
    
    return targetDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Date calculation error:', error);
    return now.toISOString().split('T')[0]; // Fallback
  }
};

/**
 * Validate date string format
 * @param {string} dateString - Date string to validate
 * @param {string} format - Expected format ('iso', 'local')
 * @returns {boolean} Whether date is valid
 */
const isValidDate = (dateString, format = 'iso') => {
  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && dateString.length > 0;
  } catch {
    return false;
  }
};

/**
 * Format date with custom options
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
const formatDate = (date, options = {}) => {
  const {
    format = 'iso',
    includeTime = false,
    locale = 'en-US',
    timeZone = 'UTC'
  } = options;
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid date');
    }
    
    return dateObj.toLocaleDateString(locale, {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...(includeTime && {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toString();
  }
};

// Export all utility functions
export { getCurrentDate, getDateDaysAgo, isValidDate, formatDate };

// Move polls array outside the component so it is static and not re-created on every render
const polls = [
  {
    id: 'poll-1',
    title: 'Best Programming Language 2024',
    category: 'Technology',
    startDate: '2024-03-01',
    endDate: '2024-03-15',
    status: 'Active',
    description: 'Vote for your favorite programming language of 2024. Consider factors like ease of use, community support, and job opportunities.',
    participants: 1250,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'poll-2',
    title: 'Climate Change Solutions',
    category: 'Environment',
    startDate: '2024-03-10',
    endDate: '2024-03-25',
    status: 'Upcoming',
    description: 'Which climate change solution do you think will have the biggest impact in the next decade?',
    participants: 0,
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'poll-3',
    title: 'Favorite Movie Genre',
    category: 'Entertainment',
    startDate: '2024-02-15',
    endDate: '2024-02-28',
    status: 'Past',
    description: 'What is your favorite movie genre? Share your preference and see what others think!',
    participants: 3500,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'poll-4',
    title: 'Remote Work Preferences',
    category: 'Work',
    startDate: '2024-03-05',
    endDate: '2024-03-20',
    status: 'Active',
    description: 'How do you prefer to work? Share your thoughts on remote work, hybrid models, and office work.',
    participants: 890,
    image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&auto=format&fit=crop&q=60'
  },
  {
    id: 'poll-5',
    title: 'Sustainable Living',
    category: 'Lifestyle',
    startDate: '2024-03-15',
    endDate: '2024-03-30',
    status: 'Upcoming',
    description: 'What sustainable living practices do you follow? Share your eco-friendly habits!',
    participants: 0,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=60'
  }
];

const AvailablePolls = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState('newest');
  const [showNotifications, setShowNotifications] = useState(false);
  const [categorySearch, setCategorySearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showDatePresets, setShowDatePresets] = useState(false);
  const [dateValidation, setDateValidation] = useState({ startError: '', endError: '' });
  const [secondarySort, setSecondarySort] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [showCategorySearch, setShowCategorySearch] = useState(false);
  const [showCategoryStats, setShowCategoryStats] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [showStatusAnalytics, setShowStatusAnalytics] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  // Add mock notifications state
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Poll "Best Programming Language 2024" is ending soon!', read: false, time: '2h ago' },
    { id: 2, message: 'New poll "Climate Change Solutions" is now available.', read: false, time: '1d ago' },
    { id: 3, message: 'You have successfully voted in "Favorite Movie Genre".', read: false, time: '3d ago' },
  ]);

  // Status options for filtering
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Past', label: 'Past' }
  ];
  
  // Create filters object for tracking active filters
  const filters = {
    categories: selectedCategories,
    dateRange: dateRange,
    sortBy: sortBy,
    status: selectedStatuses.length > 0 ? selectedStatuses : activeTab
  };
  
  // Debounced search for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Generate search suggestions based on polls data
  const generateSearchSuggestions = useCallback((query) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
      return;
    }

    const queryLower = query.toLowerCase();
    const suggestions = new Set();

    // Add poll titles that match
    polls.forEach(poll => {
      if (poll.title.toLowerCase().includes(queryLower)) {
        suggestions.add(poll.title);
      }
    });

    // Add categories that match
    polls.forEach(poll => {
      if (poll.category.toLowerCase().includes(queryLower)) {
        suggestions.add(poll.category);
      }
    });

    // Add keywords from descriptions
    polls.forEach(poll => {
      const words = poll.description.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2 && word.includes(queryLower)) {
          suggestions.add(word);
        }
      });
    });

    // Add common search terms
    const commonTerms = ['active', 'upcoming', 'past', 'technology', 'environment', 'entertainment', 'work', 'lifestyle'];
    commonTerms.forEach(term => {
      if (term.includes(queryLower)) {
        suggestions.add(term);
      }
    });

    // Convert to array and limit results
    const suggestionsArray = Array.from(suggestions).slice(0, 8);
    setSearchSuggestions(suggestionsArray);
    setShowSearchSuggestions(suggestionsArray.length > 0);
  }, [polls]);

  const categories = useMemo(() => {
    return [...new Set(polls.map(poll => poll.category))];
  }, [polls]);

  const filteredCategories = useMemo(() => {
    if (!categorySearch) return categories;
    const searchLower = categorySearch.toLowerCase();
    return categories.filter(category => 
      category.toLowerCase().includes(searchLower)
    );
  }, [categories, categorySearch]);

  const filteredPolls = useMemo(() => {
    // Advanced fuzzy search using all poll fields, including partial and typo-tolerant matches
    const normalize = str => (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const searchTokens = normalize(debouncedSearchQuery).split(/\s+/).filter(Boolean);

    const fuzzyMatch = (text, tokens) => {
      if (!tokens.length) return true;
      const normText = normalize(text);
      return tokens.every(token => {
        // Allow typo-tolerance: Levenshtein distance <= 1 for short tokens, substring for longer
        if (token.length <= 3) {
          return normText.split(/\s+/).some(word => {
            if (word.includes(token)) return true;
            // Levenshtein distance for typo-tolerance
            let d = 0, i = 0, j = 0;
            const a = word, b = token;
            const dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(0));
            for (i = 0; i <= a.length; i++) dp[i][0] = i;
            for (j = 0; j <= b.length; j++) dp[0][j] = j;
            for (i = 1; i <= a.length; i++) {
              for (j = 1; j <= b.length; j++) {
                dp[i][j] = a[i - 1] === b[j - 1]
                  ? dp[i - 1][j - 1]
                  : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
              }
            }
            return dp[a.length][b.length] <= 1;
          });
        }
        return normText.includes(token);
      });
    };

    // Advanced date range: support open-ended, overlap, and "active during" logic
    const isWithinDateRange = (poll, range) => {
      const pollStart = new Date(poll.startDate);
      const pollEnd = new Date(poll.endDate);
      const rangeStart = range.start ? new Date(range.start) : null;
      const rangeEnd = range.end ? new Date(range.end) : null;
      // Overlap logic: poll is considered if it overlaps with the selected range
      if (!rangeStart && !rangeEnd) return true;
      if (rangeStart && rangeEnd) {
        return pollEnd >= rangeStart && pollStart <= rangeEnd;
      }
      if (rangeStart) {
        return pollEnd >= rangeStart;
      }
      if (rangeEnd) {
        return pollStart <= rangeEnd;
      }
      return true;
    };

    // Advanced category: support multi-select, "All", and partial matches
    const matchesCategory = (poll, selected) => {
      if (!selected || selected.length === 0) return true;
      return selected.some(cat =>
        normalize(poll.category).includes(normalize(cat))
      );
    };

    // Advanced status: allow "All" tab, or multi-status
    const matchesStatus = (poll, tab, selectedStatuses) => {
      if (selectedStatuses && selectedStatuses.length > 0) {
        return selectedStatuses.includes(poll.status);
      }
      if (!tab || tab === 'All') return true;
      if (Array.isArray(tab)) return tab.includes(poll.status);
      return poll.status === tab;
    };

    // Advanced sorting: stable, secondary sort by title, and allow custom sort functions
    const getSortFn = (sortBy, secondarySort, sortDirection) => {
      const direction = sortDirection === 'asc' ? 1 : -1;
      
      const getPrimarySort = (a, b) => {
        switch (sortBy) {
          case 'newest':
            return direction * (new Date(b.startDate) - new Date(a.startDate));
          case 'oldest':
            return direction * (new Date(a.startDate) - new Date(b.startDate));
          case 'participants':
            return direction * (b.participants - a.participants);
          case 'participants_asc':
            return direction * (a.participants - b.participants);
          case 'title':
            return direction * a.title.localeCompare(b.title);
          case 'title_desc':
            return direction * b.title.localeCompare(a.title);
          case 'category':
            return direction * a.category.localeCompare(b.category);
          case 'status':
            return direction * a.status.localeCompare(b.status);
          case 'end_date':
            return direction * (new Date(a.endDate) - new Date(b.endDate));
          case 'start_date':
            return direction * (new Date(a.startDate) - new Date(b.startDate));
          case 'relevance':
            // Simple relevance score based on participants and recency
            const aScore = a.participants + (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24);
            const bScore = b.participants + (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24);
            return direction * (bScore - aScore);
          case 'trending':
            // Trending based on participants per day
            const aDays = Math.max(1, (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24));
            const bDays = Math.max(1, (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24));
            const aTrend = a.participants / aDays;
            const bTrend = b.participants / bDays;
            return direction * (bTrend - aTrend);
          case 'random':
            return Math.random() - 0.5;
          default:
            return 0;
        }
      };

      const getSecondarySort = (a, b) => {
        if (!secondarySort) return 0;
        
        switch (secondarySort) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'participants':
            return b.participants - a.participants;
          case 'category':
            return a.category.localeCompare(b.category);
          case 'start_date':
            return new Date(a.startDate) - new Date(b.startDate);
          case 'end_date':
            return new Date(a.endDate) - new Date(b.endDate);
          default:
            return 0;
        }
      };

      return (a, b) => {
        const primaryResult = getPrimarySort(a, b);
        if (primaryResult !== 0) return primaryResult;
        return getSecondarySort(a, b);
      };
    };

    return polls
      .filter(poll => {
        // Fuzzy search across title, category, and description
        const matchesSearch =
          !searchTokens.length ||
          fuzzyMatch(poll.title, searchTokens) ||
          fuzzyMatch(poll.category, searchTokens) ||
          fuzzyMatch(poll.description, searchTokens);

        return (
          matchesSearch &&
          matchesStatus(poll, activeTab, selectedStatuses) &&
          matchesCategory(poll, selectedCategories) &&
          isWithinDateRange(poll, dateRange)
        );
      })
      .sort(getSortFn(sortBy, secondarySort, sortDirection));
  }, [polls, debouncedSearchQuery, activeTab, selectedCategories, selectedStatuses, dateRange, sortBy, secondarySort, sortDirection]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedStatuses([]);
    setDateRange({ start: '', end: '' });
    setSortBy('newest');
    setSecondarySort(null);
    setSortDirection('desc');
  };

  const handleNotificationClick = useCallback(() => {
    setShowNotifications(!showNotifications);
  }, [showNotifications]);

  const handlePollClick = useCallback((poll) => {
    setSelectedPoll(poll);
    navigate(`/vote/${poll.id}`);
  }, [navigate]);



  const handlePollFavorite = useCallback((pollId, e) => {
    e.stopPropagation();
    // Add to favorites logic here
    console.log('Added to favorites:', pollId);
  }, []);

  const handlePollShare = useCallback((poll, e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: poll.title,
        text: poll.description,
        url: `${window.location.origin}/vote/${poll.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/vote/${poll.id}`);
    }
  }, []);

  const validateDateRange = useCallback(() => {
    const errors = { startError: '', endError: '' };
    
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      if (startDate > endDate) {
        errors.startError = 'Start date cannot be after end date';
        errors.endError = 'End date cannot be before start date';
      }
    }
    
    if (dateRange.start) {
      const startDate = new Date(dateRange.start);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      
      if (startDate < currentDate && startDate.getTime() !== currentDate.getTime()) {
        errors.startError = 'Start date cannot be in the past';
      }
    }
    
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      const maxFutureDate = new Date();
      maxFutureDate.setDate(maxFutureDate.getDate() + 30); // Allow up to 30 days in future
      
      if (endDate > maxFutureDate) {
        errors.endError = 'End date cannot be more than 30 days in the future';
      }
    }
    
    setDateValidation(errors);
  }, [dateRange]);

  // Loading effect for search
  useEffect(() => {
    if (searchQuery !== debouncedSearchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 200);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, debouncedSearchQuery]);

  // Generate search suggestions when query changes
  useEffect(() => {
    generateSearchSuggestions(searchQuery);
    setSelectedSuggestionIndex(-1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape' && searchQuery) {
        setSearchQuery('');
        setShowSearchSuggestions(false);
      }
      if (e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        document.querySelector('input[type="text"]')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [searchQuery]);

  // Handle keyboard navigation for search suggestions
  const handleSearchKeyDown = (e) => {
    if (!showSearchSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < searchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && searchSuggestions[selectedSuggestionIndex]) {
          setSearchQuery(searchSuggestions[selectedSuggestionIndex]);
          setShowSearchSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSearchSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSearchSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Mark notifications as read when panel is opened
  useEffect(() => {
    if (showNotifications) {
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    }
  }, [showNotifications]);

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 dark:group/design-root overflow-x-hidden transition-colors duration-200" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-4 sm:py-5 mt-16 sm:mt-10">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 mt-2 sm:mt-5">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 mb-6 sm:mb-8">
              {/* Animated Title & Description */}
              <div className="flex flex-col gap-1.5 sm:gap-2 relative">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -top-3 -bottom-1 z-0"
                >
                  <div
                    className="w-full h-full rounded-2xl bg-blue-400/10 dark:bg-blue-900/10 blur-xl opacity-70 dark:opacity-40 animate-[pulse_3s_ease-in-out_infinite]"
                  />
                </div>
                <h1
                  className="relative z-10 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white"
                  tabIndex={0}
                  aria-label="Available Polls"
                >
                  Available Polls
                </h1>
                <p
                  className="relative z-10 text-gray-600 dark:text-[#a0acbb] text-sm sm:text-base font-normal leading-relaxed transition-colors duration-300"
                  tabIndex={0}
                  aria-live="polite"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V6m0 0l-5 5m5-5l5 5" />
                    </svg>
                    Browse and participate in current polls. <span className="font-semibold text-blue-600 dark:text-blue-400">Your vote matters!</span>
                  </span>
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                {/* Enhanced Search Bar */}
                <div className="relative flex-1 w-full sm:max-w-md group/search">
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="search"
                      autoComplete="off"
                      spellCheck={true}
                      aria-label="Search polls by title, category, or description"
                      placeholder="Search polls, categories, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => {
                        if (searchQuery.trim() && searchSuggestions.length > 0) {
                          setShowSearchSuggestions(true);
                        }
                      }}
                      onBlur={() => {
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setShowSearchSuggestions(false), 150);
                      }}
                      className={`
                        w-full h-10 sm:h-11 pl-10 sm:pl-12 pr-10 sm:pr-12 rounded-xl border-2
                        border-gray-300 dark:border-[#2c353f]
                        bg-white/90 dark:bg-[#1e242c]/90
                        text-gray-900 dark:text-white
                        placeholder-gray-500 dark:placeholder-[#a0acbb]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#c7d7e9]
                        transition-all duration-200 text-base sm:text-lg
                        shadow-sm dark:shadow-none
                        backdrop-blur-[2px]
                        group-hover/search:border-blue-400 group-focus-within/search:border-blue-500
                        group-hover/search:shadow-md group-focus-within/search:shadow-lg
                      `}
                      style={{
                        letterSpacing: '0.01em',
                        fontVariantLigatures: 'common-ligatures contextual',
                        WebkitFontSmoothing: 'antialiased',
                        MozOsxFontSmoothing: 'grayscale'
                      }}
                      maxLength={80}
                      autoFocus={false}
                    />
                    {/* Search icon with loading animation */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-transform duration-200 group-focus-within/search:scale-110 group-hover/search:scale-105">
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </motion.div>
                      ) : (
                        <MagnifyingGlass className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 dark:text-blue-300 transition-colors duration-200" />
                      )}
                    </div>
                    {/* Clear button */}
                    {searchQuery && (
                      <button
                        type="button"
                        tabIndex={0}
                        aria-label="Clear search"
                        title="Clear search"
                        onClick={() => {
                          setSearchQuery('');
                          setShowSearchSuggestions(false);
                          setSelectedSuggestionIndex(-1);
                        }}
                        className={`
                          absolute inset-y-0 right-0 flex items-center pr-3
                          text-gray-400 dark:text-[#a0acbb]
                          hover:text-blue-600 dark:hover:text-blue-300
                          focus:text-blue-600 dark:focus:text-blue-300
                          transition-colors duration-150
                          rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300
                        `}
                        onKeyDown={e => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSearchQuery('');
                            setShowSearchSuggestions(false);
                            setSelectedSuggestionIndex(-1);
                          }
                        }}
                      >
                        <span className="sr-only">Clear search</span>
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                      </button>
                    )}
                  </div>

                  {/* Search Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSearchSuggestions && searchSuggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1e242c] border border-gray-200 dark:border-[#2c353f] rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
                      >
                        <div className="p-2">
                          {searchSuggestions.map((suggestion, index) => (
                            <motion.button
                              key={`suggestion-${index}`}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className={`
                                w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-150
                                ${selectedSuggestionIndex === index
                                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                  : 'text-gray-700 dark:text-[#a0acbb] hover:bg-gray-50 dark:hover:bg-[#2c353f] border border-transparent'
                                }
                              `}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  selectedSuggestionIndex === index
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                  {selectedSuggestionIndex === index && (
                                    <motion.svg
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-2.5 h-2.5 text-white"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </motion.svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span className="font-medium">{suggestion}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {(() => {
                                      // Determine suggestion type
                                      if (polls.some(poll => poll.title === suggestion)) {
                                        return 'Poll title';
                                      } else if (polls.some(poll => poll.category === suggestion)) {
                                        return 'Category';
                                      } else if (['active', 'upcoming', 'past'].includes(suggestion.toLowerCase())) {
                                        return 'Status filter';
                                      } else {
                                        return 'Keyword';
                                      }
                                    })()}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                  Enter
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                        
                        {/* Footer with keyboard shortcuts */}
                        <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-[#2c353f] rounded-b-xl">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>Use ↑↓ to navigate, Enter to select</span>
                            <div className="flex items-center gap-2">
                              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs">↑</kbd>
                              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs">↓</kbd>
                              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded text-xs">Enter</kbd>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`
                      group relative flex items-center gap-2 px-4 py-2.5 
                      rounded-lg bg-white dark:bg-[#1e242c] 
                      border-2 border-gray-300 dark:border-[#2c353f]
                      text-gray-700 dark:text-[#a0acbb] 
                      hover:bg-gray-50 dark:hover:bg-[#232a33]
                      active:scale-[0.98] focus:outline-none focus:ring-2 
                      focus:ring-blue-500/20 dark:focus:ring-[#4a90e2]/20
                      transition-all duration-200 text-sm font-medium
                      ${showFilters ? 'bg-blue-50 dark:bg-[#1a2330] border-blue-200 dark:border-[#3f4c5a]' : ''}
                    `}
                    aria-expanded={showFilters}
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span>Filters</span>
                    <CaretDown 
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        showFilters ? 'rotate-180' : ''
                      }`} 
                    />
                    {(selectedCategories.length > 0 || dateRange.start || dateRange.end) && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>



                  {/* Notification Button */}
                  <div className="relative">
                    <button
                      onClick={handleNotificationClick}
                      className={`
                        relative p-2.5 rounded-lg bg-white dark:bg-[#1e242c]
                        border-2 border-gray-300 dark:border-[#2c353f]
                        text-gray-600 dark:text-[#a0acbb] 
                        hover:bg-gray-50 dark:hover:bg-[#232a33]
                        active:scale-[0.98] focus:outline-none focus:ring-2 
                        focus:ring-blue-500/20 dark:focus:ring-[#4a90e2]/20
                        transition-all duration-200
                      `}
                      aria-label="Notifications"
                    >
                      <Bell className="w-5 h-5" />
                      {/* Show red dot if there are unread notifications and panel is closed */}
                      {notifications.some(n => !n.read) && !showNotifications && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                    </button>
                    {/* Notification Dropdown/Panel */}
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 max-w-xs bg-white dark:bg-[#1e242c] border border-gray-200 dark:border-[#2c353f] rounded-xl shadow-xl z-50"
                      >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white text-base">Notifications</span>
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 focus:outline-none"
                            aria-label="Close notifications"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-gray-500 dark:text-gray-400 text-sm text-center">No notifications</div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className={`flex items-start gap-3 p-4 ${!n.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500" style={{ opacity: n.read ? 0.2 : 1 }}></div>
                                <div className="flex-1">
                                  <div className="text-sm text-gray-900 dark:text-white">{n.message}</div>
                                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Filters Section */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="mb-6 sm:mb-8"
                >
                  <div className="bg-white dark:bg-[#1e242c] rounded-xl border border-gray-200 dark:border-[#2c353f] p-4 sm:p-6">
                    <motion.div 
                      className="flex items-center justify-between mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Filters</h3>
                          <p className="text-xs text-gray-500 dark:text-[#a0acbb] mt-0.5">
                            {(selectedCategories.length > 0 || selectedStatuses.length > 0 || dateRange.start || dateRange.end) ? 
                              `${[selectedCategories.length, selectedStatuses.length, dateRange.start ? 1 : 0, dateRange.end ? 1 : 0].reduce((a, b) => a + b, 0)} active filters` : 
                              'No filters applied'
                            }
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {(selectedCategories.length > 0 || selectedStatuses.length > 0 || dateRange.start || dateRange.end) && (
                          <motion.span 
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                          >
                            {[selectedCategories.length, selectedStatuses.length, dateRange.start ? 1 : 0, dateRange.end ? 1 : 0].reduce((a, b) => a + b, 0)}
                          </motion.span>
                        )}
                        
                        <motion.button
                          onClick={clearFilters}
                          className="group relative inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={!(selectedCategories.length > 0 || selectedStatuses.length > 0 || dateRange.start || dateRange.end)}
                        >
                          <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Clear All</span>
                          
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                            Reset all filter selections
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {/* Advanced Categories Filter with Search, Grouping, and Smart Features */}
                                              <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                            Categories
                            {selectedCategories.length > 0 && (
                              <motion.span 
                                className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {selectedCategories.length}
                              </motion.span>
                            )}
                          </label>
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {filteredCategories.map((category) => (
                              <label key={category} className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={selectedCategories.includes(category)}
                                  onChange={() => handleCategoryToggle(category)}
                                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <span className="text-sm text-gray-700 dark:text-[#a0acbb]">{category}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                      {/* Advanced Date Range Filter with Presets and Validation */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                            Date Range
                          </label>
                          <motion.button
                            onClick={() => setShowDatePresets(prev => !prev)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {showDatePresets ? 'Hide' : 'Show'} Presets
                          </motion.button>
                        </div>

                        {/* Quick Date Presets */}
                        <AnimatePresence>
                          {showDatePresets && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 dark:bg-[#2c353f] rounded-lg border border-gray-200 dark:border-[#3a424a]">
                                {[
                                  { label: 'Today', start: getCurrentDate(), end: getCurrentDate() },
                                  { label: 'This Week', start: getDateDaysAgo(7), end: getCurrentDate() },
                                  { label: 'This Month', start: getDateDaysAgo(30), end: getCurrentDate() },
                                  { label: 'Last 3 Months', start: getDateDaysAgo(90), end: getCurrentDate() },
                                  { label: 'This Year', start: `${new Date().getFullYear()}-01-01`, end: getCurrentDate() },
                                  { label: 'Custom', start: '', end: '' }
                                ].map((preset) => (
                                  <motion.button
                                    key={preset.label}
                                    onClick={() => {
                                      setDateRange({ start: preset.start, end: preset.end });
                                      if (preset.label === 'Custom') {
                                        setShowDatePresets(false);
                                      }
                                    }}
                                    className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-[#a0acbb] bg-white dark:bg-[#1e242c] border border-gray-200 dark:border-[#3a424a] rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    {preset.label}
                                  </motion.button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Advanced Date Inputs with Validation */}
                        <div className="space-y-3">
                          <div className="relative">
                            <input
                              type="date"
                              value={dateRange.start}
                              onChange={(e) => {
                                const newStart = e.target.value;
                                setDateRange(prev => ({ 
                                  ...prev, 
                                  start: newStart,
                                  end: prev.end && newStart > prev.end ? newStart : prev.end
                                }));
                                setDateValidation(prev => ({ ...prev, startError: '' }));
                              }}
                              onBlur={() => validateDateRange()}
                              max={dateRange.end || getCurrentDate()}
                              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                                dateValidation.startError 
                                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400' 
                                  : 'border-gray-300 dark:border-[#2c353f]'
                              }`}
                              placeholder="Start date"
                            />
                            {dateValidation.startError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-0 text-xs text-red-600 dark:text-red-400"
                              >
                                {dateValidation.startError}
                              </motion.div>
                            )}
                          </div>

                          <div className="relative">
                            <input
                              type="date"
                              value={dateRange.end}
                              onChange={(e) => {
                                const newEnd = e.target.value;
                                setDateRange(prev => ({ 
                                  ...prev, 
                                  end: newEnd,
                                  start: prev.start && newEnd < prev.start ? newEnd : prev.start
                                }));
                                setDateValidation(prev => ({ ...prev, endError: '' }));
                              }}
                              onBlur={() => validateDateRange()}
                              min={dateRange.start || getDateDaysAgo(365)}
                              max={getDateDaysAgo(-30)} // Allow future dates up to 30 days
                              className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 ${
                                dateValidation.endError 
                                  ? 'border-red-300 dark:border-red-600 focus:ring-red-500 dark:focus:ring-red-400' 
                                  : 'border-gray-300 dark:border-[#2c353f]'
                              }`}
                              placeholder="End date"
                            />
                            {dateValidation.endError && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute -bottom-6 left-0 text-xs text-red-600 dark:text-red-400"
                              >
                                {dateValidation.endError}
                              </motion.div>
                            )}
                          </div>

                          {/* Date Range Summary */}
                          {(dateRange.start || dateRange.end) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                            >
                              <div className="text-xs text-blue-800 dark:text-blue-300">
                                <div className="flex items-center justify-between">
                                  <span>Selected Range:</span>
                                  <span className="font-medium">
                                    {dateRange.start || 'Any'} → {dateRange.end || 'Any'}
                                  </span>
                                </div>
                                {dateRange.start && dateRange.end && (
                                  <div className="mt-1 text-blue-600 dark:text-blue-400">
                                    {Math.ceil((new Date(dateRange.end) - new Date(dateRange.start)) / (1000 * 60 * 60 * 24))} days
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Advanced Sort By Filter with Multi-Sort and Custom Logic */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                            Sort By
                          </label>
                          <button
                            onClick={() => setSortBy('newest')}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Reset
                          </button>
                        </div>
                        
                        {/* Primary Sort */}
                        <div className="space-y-2">
                          <select
                            value={sortBy}
                            onChange={(e) => {
                              setSortBy(e.target.value);
                              // Clear secondary sort when changing primary
                              setSecondarySort && setSecondarySort(null);
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-[#2c353f] rounded-lg bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                          >
                            <option value="newest">🕒 Newest First</option>
                            <option value="oldest">📅 Oldest First</option>
                            <option value="participants">👥 Most Participants</option>
                            <option value="participants_asc">👤 Least Participants</option>
                            <option value="title">📝 Title A-Z</option>
                            <option value="title_desc">📝 Title Z-A</option>
                            <option value="category">🏷️ Category</option>
                            <option value="status">📊 Status</option>
                            <option value="end_date">⏰ Ending Soon</option>
                            <option value="start_date">🚀 Starting Soon</option>
                            <option value="relevance">🎯 Relevance Score</option>
                            <option value="trending">📈 Trending</option>
                            <option value="random">🎲 Random</option>
                          </select>
                        </div>

                        {/* Secondary Sort (Conditional) */}
                        {sortBy && sortBy !== 'random' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-2"
                          >
                            <label className="block text-xs font-medium text-gray-600 dark:text-[#8b9bb4]">
                              Then by (Optional)
                            </label>
                            <select
                              value={secondarySort || ''}
                              onChange={(e) => setSecondarySort && setSecondarySort(e.target.value || null)}
                              className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-[#374151] rounded-md bg-gray-50 dark:bg-[#2a3441] text-gray-700 dark:text-[#a0acbb] focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">None</option>
                              <option value="title" disabled={sortBy === 'title' || sortBy === 'title_desc'}>Title</option>
                              <option value="participants" disabled={sortBy === 'participants' || sortBy === 'participants_asc'}>Participants</option>
                              <option value="category" disabled={sortBy === 'category'}>Category</option>
                              <option value="start_date" disabled={sortBy === 'start_date'}>Start Date</option>
                              <option value="end_date" disabled={sortBy === 'end_date'}>End Date</option>
                            </select>
                          </motion.div>
                        )}

                        {/* Sort Direction Toggle */}
                        {sortBy && sortBy !== 'random' && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-[#2a3441] rounded-md"
                          >
                            <span className="text-xs text-gray-600 dark:text-[#8b9bb4]">Direction:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setSortDirection && setSortDirection('asc')}
                                className={`p-1 rounded text-xs transition-all ${
                                  sortDirection === 'asc' 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                title="Ascending"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => setSortDirection && setSortDirection('desc')}
                                className={`p-1 rounded text-xs transition-all ${
                                  sortDirection === 'desc' 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                                title="Descending"
                              >
                                ↓
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* Sort Preview */}
                        {sortBy && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                          >
                            <div className="text-xs text-blue-800 dark:text-blue-300">
                              <div className="flex items-center justify-between">
                                <span>Sorting by:</span>
                                <span className="font-medium">
                                  {sortBy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  {secondarySort && ` → ${secondarySort.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                                  {sortDirection && ` (${sortDirection.toUpperCase()})`}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Advanced Status Filter with Multi-Select, Smart Grouping, and Real-time Analytics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                            Status Filter
                            {selectedStatuses.length > 0 && (
                              <motion.span 
                                className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {selectedStatuses.length}
                              </motion.span>
                            )}
                          </label>
                          <div className="flex items-center gap-2">
                            <motion.button
                              onClick={() => setShowStatusAnalytics(prev => !prev)}
                              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {showStatusAnalytics ? 'Hide' : 'Show'} Analytics
                            </motion.button>
                            <motion.button
                              onClick={() => setSelectedStatuses([])}
                              className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={selectedStatuses.length === 0}
                            >
                              Clear
                            </motion.button>
                          </div>
                        </div>

                        {/* Status Analytics Panel */}
                        <AnimatePresence>
                          {showStatusAnalytics && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                  {statusOptions.map((status) => {
                                    const count = polls.filter(poll => poll.status === status.value).length;
                                    const percentage = polls.length > 0 ? Math.round((count / polls.length) * 100) : 0;
                                    const isSelected = selectedStatuses.includes(status.value);
                                    
                                    return (
                                      <motion.div
                                        key={status.value}
                                        className={`p-2 rounded-md cursor-pointer transition-all duration-200 ${
                                          isSelected 
                                            ? 'bg-blue-200 dark:bg-blue-800/40 border border-blue-300 dark:border-blue-700' 
                                            : 'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                        }`}
                                        onClick={() => handleStatusToggle(status.value)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <div className="flex items-center justify-between mb-1">
                                          <span className={`font-medium ${
                                            isSelected 
                                              ? 'text-blue-800 dark:text-blue-300' 
                                              : 'text-gray-700 dark:text-gray-300'
                                          }`}>
                                            {status.label}
                                          </span>
                                          <span className={`text-xs ${
                                            isSelected 
                                              ? 'text-blue-600 dark:text-blue-400' 
                                              : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                            {count}
                                          </span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                          <motion.div
                                            className="bg-blue-500 h-1.5 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 0.5, delay: 0.1 }}
                                          />
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          {percentage}%
                                        </div>
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Enhanced Status Selection */}
                        <div className="space-y-2">
                          {statusOptions.map((status) => {
                            const count = polls.filter(poll => poll.status === status.value).length;
                            const isSelected = selectedStatuses.includes(status.value);
                            
                            return (
                              <motion.label
                                key={status.value}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                  isSelected 
                                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700' 
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent'
                                }`}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <input
                                      type="checkbox"
                                      checked={isSelected}
                                      onChange={() => handleStatusToggle(status.value)}
                                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {isSelected && (
                                      <motion.div
                                        className="absolute inset-0 flex items-center justify-center"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.2 }}
                                      >
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      </motion.div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                      status.value === 'Active' ? 'bg-green-500' :
                                      status.value === 'Upcoming' ? 'bg-blue-500' :
                                      'bg-gray-500'
                                    }`} />
                                    <span className={`text-sm font-medium ${
                                      isSelected 
                                        ? 'text-blue-800 dark:text-blue-300' 
                                        : 'text-gray-700 dark:text-[#a0acbb]'
                                    }`}>
                                      {status.label}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {count} polls
                                  </span>
                                  {isSelected && (
                                    <motion.span
                                      className="text-xs text-blue-600 dark:text-blue-400"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                    >
                                      ✓
                                    </motion.span>
                                  )}
                                </div>
                              </motion.label>
                            );
                          })}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <motion.button
                            onClick={() => setSelectedStatuses(['Active', 'Upcoming'])}
                            className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Active + Upcoming
                          </motion.button>
                          <motion.button
                            onClick={() => setSelectedStatuses(['Active'])}
                            className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Active Only
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Active Filters Display */}
                    {(selectedCategories.length > 0 || selectedStatuses.length > 0 || dateRange.start || dateRange.end) && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-[#2c353f]">
                        <div className="flex flex-wrap gap-2">
                          {selectedCategories.map((category) => (
                            <span
                              key={category}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full"
                            >
                              {category}
                              <button
                                onClick={() => handleCategoryToggle(category)}
                                className="ml-1 hover:text-blue-600 dark:hover:text-blue-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {selectedStatuses.map((status) => (
                            <span
                              key={status}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 rounded-full"
                            >
                              {status}
                              <button
                                onClick={() => handleStatusToggle(status)}
                                className="ml-1 hover:text-purple-600 dark:hover:text-purple-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                          {dateRange.start && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                              From: {new Date(dateRange.start).toLocaleDateString()}
                              <button
                                onClick={() => setDateRange(prev => ({ ...prev, start: '' }))}
                                className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          )}
                          {dateRange.end && (
                            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full">
                              To: {new Date(dateRange.end).toLocaleDateString()}
                              <button
                                onClick={() => setDateRange(prev => ({ ...prev, end: '' }))}
                                className="ml-1 hover:text-green-600 dark:hover:text-green-300"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Tabs */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 border-b border-gray-200/60 dark:border-[#2c353f]/60 backdrop-blur-[1px]" />
              <div className="relative flex space-x-1 sm:space-x-2 p-1 sm:p-2 bg-gradient-to-r from-gray-50/50 via-transparent to-gray-50/50 dark:from-[#1e242c]/30 dark:via-transparent dark:to-[#1e242c]/30 rounded-t-xl">
                {['Active', 'Upcoming', 'Past'].map((tab, index) => (
                  <motion.button
                    key={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`relative flex-1 py-3 sm:py-4 px-3 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ease-out ${
                      activeTab === tab
                        ? 'text-blue-700 dark:text-[#c7d7e9] shadow-sm'
                        : 'text-gray-600 dark:text-[#a0acbb] hover:text-gray-800 dark:hover:text-[#e2e8f0]'
                    }`}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ 
                      scale: 0.98,
                      transition: { duration: 0.1 }
                    }}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute inset-0 bg-gradient-to-r from-blue-100/80 to-blue-50/80 dark:from-[#1e3a8a]/20 dark:to-[#1e40af]/20 border border-blue-200/50 dark:border-[#3b82f6]/30 rounded-lg shadow-sm"
                        initial={false}
                        transition={{ 
                          type: "spring", 
                          stiffness: 500, 
                          damping: 30,
                          mass: 0.8
                        }}
                      />
                    )}
                    
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {tab === 'Active' && (
                        <motion.div
                          animate={{ 
                            scale: activeTab === tab ? [1, 1.1, 1] : 1,
                            rotate: activeTab === tab ? [0, 5, -5, 0] : 0
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                      {tab === 'Upcoming' && (
                        <motion.div
                          animate={{ 
                            scale: activeTab === tab ? [1, 1.1, 1] : 1
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </motion.div>
                      )}
                      {tab === 'Past' && (
                        <motion.div
                          animate={{ 
                            scale: activeTab === tab ? [1, 1.1, 1] : 1
                          }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </motion.div>
                      )}
                      
                      <span className="font-semibold tracking-wide">
                        {tab}
                      </span>
                      
                      {activeTab === tab && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 dark:bg-[#c7d7e9] rounded-full"
                        />
                      )}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Results Counter */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center justify-between mb-4 sm:mb-6 mt-6"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-[#a0acbb]">
                <span className="hidden sm:inline">Showing</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredPolls.length}
                </span>
                <span>of {polls.length} polls</span>
                {filteredPolls.length !== polls.length && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                  >
                    Filtered
                  </motion.span>
                )}
              </div>
            </motion.div>

            {/* Enhanced Polls Grid */}
            <AnimatePresence mode="wait">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              >
                {filteredPolls.map((poll, index) => (
                  <motion.div
                    key={poll.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group bg-white dark:bg-[#1e242c] rounded-xl border border-gray-200 dark:border-[#2c353f] overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
                    onClick={() => handlePollClick(poll)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Poll Image */}
                    <div className="relative overflow-hidden group/image h-40 sm:h-48">
                      <motion.img
                        src={poll.image}
                        alt={poll.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.08 }}
                        transition={{ 
                          duration: 0.6, 
                          ease: [0.25, 0.46, 0.45, 0.94],
                          type: "spring",
                          stiffness: 300,
                          damping: 25
                        }}
                        loading="lazy"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <motion.button
                          onClick={(e) => handlePollFavorite(poll.id, e)}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors duration-200 border border-white/20 dark:border-white/10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </motion.button>
                        
                        <motion.button
                          onClick={(e) => handlePollShare(poll, e)}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 dark:bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 dark:hover:bg-black/30 transition-colors duration-200 border border-white/20 dark:border-white/10"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.3 }}
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </motion.button>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                        <motion.span 
                          className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold backdrop-blur-sm border ${
                            poll.status === 'Active' 
                              ? 'bg-green-500/20 dark:bg-green-400/20 text-green-100 dark:text-green-300 border-green-400/30 dark:border-green-300/30 shadow-lg shadow-green-500/25'
                              : poll.status === 'Upcoming'
                              ? 'bg-blue-500/20 dark:bg-blue-400/20 text-blue-100 dark:text-blue-300 border-blue-400/30 dark:border-blue-300/30 shadow-lg shadow-blue-500/25'
                              : 'bg-gray-500/20 dark:bg-gray-400/20 text-gray-100 dark:text-gray-300 border-gray-400/30 dark:border-gray-300/30 shadow-lg shadow-gray-500/25'
                          }`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          whileHover={{ scale: 1.05 }}
                        >
                          {poll.status === 'Active' && (
                            <motion.svg 
                              className="w-3 h-3 sm:w-4 sm:h-4" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                              animate={{ rotate: [0, 360] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            >
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                          {poll.status}
                        </motion.span>
                      </div>
                    </div>

                    {/* Poll Content */}
                    <div className="p-4 sm:p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                          {poll.title}
                        </h3>
                        <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 whitespace-nowrap">
                          {poll.category}
                        </span>
                      </div>

                      <p className="text-gray-600 dark:text-[#a0acbb] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                        {poll.description}
                      </p>

                      {/* Advanced Poll Stats with Enhanced Date Display */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {/* Start Date with Time Remaining */}
                        <motion.div 
                          className="space-y-0.5 sm:space-y-1 relative group/start-date"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-[#a0acbb] font-medium">Start Date</p>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(poll.startDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            {(() => {
                              const startDate = new Date(poll.startDate);
                              const now = new Date();
                              const diffTime = startDate - now;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              
                              if (diffDays > 0) {
                                return `${diffDays} day${diffDays !== 1 ? 's' : ''} until start`;
                              } else if (diffDays === 0) {
                                return 'Starts today';
                              } else {
                                return 'Started';
                              }
                            })()}
                          </p>
                          
                          {/* Enhanced Tooltip */}
                          <div className="absolute top-full left-0 mt-2 px-3 py-2 text-xs bg-gray-900 text-white rounded-lg opacity-0 group-hover/start-date:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            <div className="flex items-center gap-2">
                              <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(poll.startDate).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                          </div>
                        </motion.div>

                        {/* End Date with Countdown */}
                        <motion.div 
                          className="space-y-0.5 sm:space-y-1 relative group/end-date"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-xs text-gray-500 dark:text-[#a0acbb] font-medium">End Date</p>
                          </div>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">
                            {new Date(poll.endDate).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                            {(() => {
                              const endDate = new Date(poll.endDate);
                              const now = new Date();
                              const diffTime = endDate - now;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                              const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
                              
                              if (diffDays > 1) {
                                return `${diffDays} day${diffDays !== 1 ? 's' : ''} remaining`;
                              } else if (diffDays === 1) {
                                return 'Ends tomorrow';
                              } else if (diffHours > 0) {
                                return `${diffHours} hour${diffHours !== 1 ? 's' : ''} remaining`;
                              } else if (diffTime > 0) {
                                return 'Ending soon';
                              } else {
                                return 'Ended';
                              }
                            })()}
                          </p>
                          
                          {/* Enhanced Tooltip */}
                          <div className="absolute top-full right-0 mt-2 px-3 py-2 text-xs bg-gray-900 text-white rounded-lg opacity-0 group-hover/end-date:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            <div className="flex items-center gap-2">
                              <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(poll.endDate).toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Action Button - Now positioned at the bottom */}
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        {/* Participants */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {[...Array(Math.min(3, poll.participants))].map((_, i) => (
                                <div
                                  key={`participant-${poll.id}-${i}`}
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#1e242c] bg-gray-200 dark:bg-gray-700"
                                />
                              ))}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-[#a0acbb]">
                              {poll.participants} participants
                            </span>
                          </div>
                          {poll.status === 'Active' && (
                            <div className="flex flex-col items-end gap-1">
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                {Math.floor(Math.random() * 24)} hours left
                              </span>
                              <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-green-500 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.random() * 100}%` }}
                                  transition={{ duration: 1, delay: 0.5 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePollClick(poll);
                          }}
                          disabled={poll.status !== 'Active'}
                          className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                            poll.status === 'Active'
                              ? 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e] hover:bg-blue-700 dark:hover:bg-[#b3c7e0]'
                              : poll.status === 'Upcoming'
                              ? 'bg-gray-100 dark:bg-[#2c353f] text-gray-700 dark:text-[#a0acbb] hover:bg-gray-200 dark:hover:bg-[#3f4c5a]'
                              : 'bg-gray-100 dark:bg-[#2c353f] text-gray-700 dark:text-[#a0acbb] hover:bg-gray-200 dark:hover:bg-[#3f4c5a]'
                          }`}
                        >
                          {poll.status === 'Active'
                            ? 'Vote Now'
                            : poll.status === 'Upcoming'
                            ? 'Set Reminder'
                            : 'View Results'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredPolls.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8 sm:py-12"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-[#a0acbb]">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1.5 sm:mb-2">No polls found</h3>
                <p className="text-sm text-gray-600 dark:text-[#a0acbb]">
                  Try adjusting your search or filter criteria
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailablePolls; 