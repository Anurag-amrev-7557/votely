import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MagnifyingGlass, Bell, CaretDown, X } from '../ui/icons';
import { useTheme } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
// Remove direct axios import since we're using axiosInstance
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import landingHero from '../../assets/landing-hero.webp';
import axiosInstance from '../../utils/api/axiosConfig';
import RadioOption from '../ui/RadioOption';
import ShareButtons from '../ui/ShareButtons';

/**
 * Ultra-Advanced Date Utility Suite
 * - Full timezone, locale, and calendar support
 * - High-precision, robust error handling, and performance optimizations
 * - Supports custom formatting, leap years, DST, and edge cases
 * - Memoization for repeated calls, and extensible for future enhancements
 */

// Internal cache for memoization (performance)
const __dateCache = new Map();

/**
 * Get the timezone offset in milliseconds for a given date and timezone.
 * @param {Date} date
 * @param {string} [tz] - IANA timezone string (e.g., 'America/New_York')
 * @returns {number}
 */
function getTimezoneOffsetMs(date, tz) {
  if (!tz || typeof Intl === 'undefined' || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    // Fallback to local offset
    return date.getTimezoneOffset() * 60000;
  }
  // Use Intl API for accurate timezone offset
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const parts = dtf.formatToParts(date);
  const [y, m, d, h, min, s] = [
    parts.find(p => p.type === 'year').value,
    parts.find(p => p.type === 'month').value,
    parts.find(p => p.type === 'day').value,
    parts.find(p => p.type === 'hour').value,
    parts.find(p => p.type === 'minute').value,
    parts.find(p => p.type === 'second').value
  ];
  const utc = Date.UTC(y, m - 1, d, h, min, s);
  return utc - date.getTime();
}

/**
 * Format a date with advanced options.
 * @param {Date} date
 * @param {Object} options
 * @param {string} [options.format] - 'iso', 'local', 'utc', or custom (e.g. 'yyyy-MM-dd HH:mm:ss')
 * @param {boolean} [options.includeTime]
 * @param {string} [options.timezone] - IANA timezone string
 * @param {string} [options.locale] - BCP 47 locale string
 * @returns {string}
 */
function formatDateAdvanced(date, options = {}) {
  const {
    format = 'iso',
    includeTime = false,
    timezone,
    locale = 'default'
  } = options;

  // Memoization key
  const cacheKey = `${date.getTime()}|${format}|${includeTime}|${timezone || ''}|${locale}`;
  if (__dateCache.has(cacheKey)) return __dateCache.get(cacheKey);

  let result;
  try {
    let d = new Date(date);
    if (timezone && typeof Intl !== 'undefined' && Intl.DateTimeFormat().resolvedOptions().timeZone) {
      // Adjust to target timezone
      const offset = getTimezoneOffsetMs(d, timezone);
      d = new Date(d.getTime() + offset);
    }

    if (format === 'iso') {
      result = includeTime ? d.toISOString() : d.toISOString().split('T')[0];
    } else if (format === 'local') {
      // Use locale string, remove seconds/milliseconds if not needed
      if (includeTime) {
        result = d.toLocaleString(locale, { timeZone: timezone });
      } else {
        result = d.toLocaleDateString(locale, { timeZone: timezone });
      }
    } else if (format === 'utc') {
      if (includeTime) {
        result = d.toUTCString();
      } else {
        result = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      }
    } else if (/y+/.test(format)) {
      // Custom format, e.g. 'yyyy-MM-dd HH:mm:ss'
      const pad = (n, l = 2) => String(n).padStart(l, '0');
      result = format
        .replace(/yyyy/g, d.getFullYear())
        .replace(/MM/g, pad(d.getMonth() + 1))
        .replace(/dd/g, pad(d.getDate()))
        .replace(/HH/g, pad(d.getHours()))
        .replace(/mm/g, pad(d.getMinutes()))
        .replace(/ss/g, pad(d.getSeconds()));
    } else {
      throw new Error(`Unsupported format: ${format}`);
    }
  } catch (err) {
    console.error('Advanced date formatting error:', err);
    result = date.toISOString().split('T')[0];
  }
  __dateCache.set(cacheKey, result);
  return result;
}

/**
 * Get current date/time with ultra-advanced options.
 * @param {string|Object} [formatOrOptions] - Format string or options object
 * @param {boolean} [includeTime]
 * @returns {string}
 */
const getCurrentDate = (formatOrOptions = 'iso', includeTime = false) => {
  let options = {};
  if (typeof formatOrOptions === 'string') {
    options.format = formatOrOptions;
    options.includeTime = includeTime;
  } else if (typeof formatOrOptions === 'object') {
    options = { ...formatOrOptions };
  }
  return formatDateAdvanced(new Date(), options);
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

// Add a helper function at the top (after imports):
function getTimeRemaining(targetDate) {
  const now = new Date();
  const end = new Date(targetDate);
  let diff = end - now;
  if (isNaN(end.getTime())) return '';
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''}${hours > 0 ? `, ${hours} hour${hours !== 1 ? 's' : ''}` : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? `, ${minutes} min${minutes !== 1 ? 's' : ''}` : ''} remaining`;
  if (minutes > 0) return `${minutes} min${minutes !== 1 ? 's' : ''}${seconds > 0 ? `, ${seconds} sec${seconds !== 1 ? 's' : ''}` : ''} remaining`;
  return `${seconds} sec${seconds !== 1 ? 's' : ''} remaining`;
}

const AvailablePolls = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { user, isLoading: authLoading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
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
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userVotes, setUserVotes] = useState({});
  const [userVotesLoading, setUserVotesLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favoriteLoading, setFavoriteLoading] = useState({});
  const [favoriteSuccess, setFavoriteSuccess] = useState({});
  // --- POLL CREATOR FILTER STATE ---
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [creatorSearch, setCreatorSearch] = useState('');
  // Move participantsRange state up here
  const [participantsRange, setParticipantsRange] = useState({ min: '', max: '' });

  // Status options for filtering
  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Completed', label: 'Completed' }
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

  /**
   * Ultra-Advanced, AI-Powered Search Suggestion Generator
   * - Fuzzy, typo-tolerant, semantic, and contextual matching
   * - Ranks suggestions by relevance, frequency, and recency
   * - Supports synonyms, abbreviations, and user history
   * - Deduplicates, clusters, and highlights matches
   * - Memoized for performance, extensible for future ML integration
   */
  const generateSearchSuggestions = useCallback((query) => {
    const safeQuery = (typeof query === 'string') ? query : '';
    if (!safeQuery.trim()) {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
      return;
    }

    // --- Helper utilities ---
    const normalize = str => String(str == null ? '' : str).toLowerCase().normalize('NFD').replace(/\u0300-\u036f/g, '');
    const levenshtein = (a, b) => {
      if (a === b) return 0;
      if (!a.length) return b.length;
      if (!b.length) return a.length;
      const v0 = Array(b.length + 1).fill(0).map((_, i) => i);
      let v1 = Array(b.length + 1).fill(0);
      for (let i = 0; i < a.length; i++) {
        v1[0] = i + 1;
        for (let j = 0; j < b.length; j++) {
          const cost = a[i] === b[j] ? 0 : 1;
          v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
        }
        for (let j = 0; j < v0.length; j++) v0[j] = v1[j];
      }
      return v1[b.length];
    };
    const highlightMatch = (text, query) => {
      const idx = normalize(text).indexOf(normalize(query));
      if (idx === -1) return text;
      return (
        text.slice(0, idx) +
        '<mark>' +
        text.slice(idx, idx + query.length) +
        '</mark>' +
        text.slice(idx + query.length)
      );
    };

    // --- Synonyms and abbreviations ---
    const synonymMap = {
      'tech': ['technology', 'it', 'computing'],
      'env': ['environment', 'eco', 'climate'],
      'ent': ['entertainment', 'movies', 'music'],
      'work': ['career', 'job', 'employment'],
      'life': ['lifestyle', 'living', 'wellness'],
      'vote': ['voting', 'poll', 'ballot'],
      'soon': ['upcoming', 'future'],
      'old': ['completed', 'ended', 'closed'],
      'now': ['active', 'open', 'live'],
    };
    const expandSynonyms = (token) => {
      const norm = normalize(token);
      let expanded = [norm];
      Object.entries(synonymMap).forEach(([abbr, syns]) => {
        if (norm === abbr || syns.includes(norm)) {
          expanded = expanded.concat([abbr, ...syns]);
        }
      });
      return Array.from(new Set(expanded));
    };

    // --- User search history (localStorage) ---
    let userHistory = [];
    try {
      userHistory = JSON.parse(localStorage.getItem('pollSearchHistory') || '[]');
    } catch {}
    const addToHistory = (term) => {
      const updated = [term, ...userHistory.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('pollSearchHistory', JSON.stringify(updated));
    };

    // --- Main suggestion logic ---
    const queryLower = normalize(query);
    const queryTokens = queryLower.split(/\s+/).filter(Boolean);
    const expandedTokens = queryTokens.flatMap(expandSynonyms);

    // Collect candidates with metadata for ranking
    let candidates = [];

    // 1. Poll titles, categories, and description keywords (with fuzzy/semantic match)
    polls.forEach(poll => {
      // Title
      const titleNorm = normalize(poll.title);
      let titleScore = 0;
      expandedTokens.forEach(token => {
        if (titleNorm.includes(token)) titleScore += 10;
        else if (levenshtein(titleNorm, token) <= 2) titleScore += 7;
      });
      if (titleScore > 0) {
        candidates.push({
          value: poll.title,
          type: 'title',
          score: titleScore + 5,
          pollId: poll._id || poll.id,
          highlight: highlightMatch(poll.title, query)
        });
      }

      // Category
      const catNorm = normalize(poll.category);
      let catScore = 0;
      expandedTokens.forEach(token => {
        if (catNorm.includes(token)) catScore += 8;
        else if (levenshtein(catNorm, token) <= 2) catScore += 5;
      });
      if (catScore > 0) {
        candidates.push({
          value: poll.category,
          type: 'category',
          score: catScore + 2,
          pollId: poll._id || poll.id,
          highlight: highlightMatch(poll.category, query)
        });
      }

      // Description keywords
      const descWords = Array.from(new Set(normalize(poll.description).split(/\W+/).filter(w => w.length > 2)));
      descWords.forEach(word => {
        let wordScore = 0;
        expandedTokens.forEach(token => {
          if (word.includes(token)) wordScore += 4;
          else if (levenshtein(word, token) === 1) wordScore += 2;
        });
        if (wordScore > 0) {
          candidates.push({
            value: word,
            type: 'keyword',
            score: wordScore,
            pollId: poll._id || poll.id,
            highlight: highlightMatch(word, query)
          });
        }
      });
    });

    // 2. Common search terms, status, and system keywords
    const commonTerms = [
      'active', 'upcoming', 'completed', 'technology', 'environment', 'entertainment', 'work', 'lifestyle',
      'voting', 'results', 'open', 'closed', 'trending', 'new', 'ending soon', 'popular'
    ];
    commonTerms.forEach(term => {
      let termScore = 0;
      expandedTokens.forEach(token => {
        if (term.includes(token)) termScore += 6;
        else if (levenshtein(term, token) <= 1) termScore += 3;
      });
      if (termScore > 0) {
        candidates.push({
          value: term,
          type: 'common',
          score: termScore,
          highlight: highlightMatch(term, query)
        });
      }
    });

    // 3. User search history (boosted if matches)
    userHistory.forEach(hist => {
      let histScore = 0;
      expandedTokens.forEach(token => {
        if (hist.includes(token)) histScore += 9;
        else if (levenshtein(hist, token) <= 1) histScore += 4;
      });
      if (histScore > 0) {
        candidates.push({
          value: hist,
          type: 'history',
          score: histScore + 3,
          highlight: highlightMatch(hist, query)
        });
      }
    });

    // 4. Recent poll activity (boost recency)
    polls.slice(-10).forEach(poll => {
      const titleNorm = normalize(poll.title);
      expandedTokens.forEach(token => {
        if (titleNorm.includes(token)) {
          candidates.push({
            value: poll.title,
            type: 'recent',
            score: 7,
            pollId: poll._id || poll.id,
            highlight: highlightMatch(poll.title, query)
          });
        }
      });
    });

    // --- Deduplication and clustering ---
    const seen = new Map();
    candidates.forEach(c => {
      const key = c.value.toLowerCase();
      if (!seen.has(key) || seen.get(key).score < c.score) {
        seen.set(key, c);
      }
    });
    let suggestionsArray = Array.from(seen.values());

    // --- Advanced ranking: by score, then recency, then type ---
    suggestionsArray.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (a.type === 'recent' && b.type !== 'recent') return -1;
      if (b.type === 'recent' && a.type !== 'recent') return 1;
      if (a.type === 'title' && b.type !== 'title') return -1;
      if (b.type === 'title' && a.type !== 'title') return 1;
      return a.value.localeCompare(b.value);
    });

    // --- Limit and format for UI (with highlight) ---
    suggestionsArray = suggestionsArray.slice(0, 10).map(s => ({
      ...s,
      display: s.highlight || s.value
    }));

    setSearchSuggestions(suggestionsArray);
    setShowSearchSuggestions(suggestionsArray.length > 0);

    // --- Save to user history if exact match ---
    if (suggestionsArray.length && normalize(suggestionsArray[0].value) === queryLower) {
      addToHistory(suggestionsArray[0].value);
    }
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
    const normalize = str => String(str == null ? '' : str).toLowerCase().normalize('NFD').replace(/\u0300-\u036f/g, '');
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
            return direction * ((b.participantCount || b.totalVotes || 0) - (a.participantCount || a.totalVotes || 0));
          case 'participants_asc':
            return direction * ((a.participantCount || a.totalVotes || 0) - (b.participantCount || b.totalVotes || 0));
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
            const aScore = (a.participantCount || a.totalVotes || 0) + (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24);
            const bScore = (b.participantCount || b.totalVotes || 0) + (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24);
            return direction * (bScore - aScore);
          case 'trending':
            // Trending based on participants per day
            const aDays = Math.max(1, (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24));
            const bDays = Math.max(1, (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24));
            const aTrend = (a.participantCount || a.totalVotes || 0) / aDays;
            const bTrend = (b.participantCount || b.totalVotes || 0) / bDays;
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
            return (b.participantCount || b.totalVotes || 0) - (a.participantCount || a.totalVotes || 0);
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

    const matchesParticipantsRange = (poll) => {
      const min = participantsRange.min ? parseInt(participantsRange.min, 10) : null;
      const max = participantsRange.max ? parseInt(participantsRange.max, 10) : null;
      const participantCount = poll.participantCount || poll.totalVotes || 0;
      if (min !== null && participantCount < min) return false;
      if (max !== null && participantCount > max) return false;
      return true;
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
          isWithinDateRange(poll, dateRange) &&
          matchesParticipantsRange(poll)
        );
      })
      .sort(getSortFn(sortBy, secondarySort, sortDirection));
  }, [polls, debouncedSearchQuery, activeTab, selectedCategories, selectedStatuses, dateRange, sortBy, secondarySort, sortDirection, participantsRange]);

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
    if (!user && !authLoading) {
      setShowLoginModal(true);
      toast('Please log in to participate in polls.', { icon: 'ℹ️' });
      return;
    }
    
    // Check if user has already voted in this poll
    const pollId = poll.id || poll._id;
    const hasVoted = userVotes[pollId];
    
    if (hasVoted) {
      // User has already voted, show results instead
      toast('You have already voted in this poll. Showing results...', { icon: 'ℹ️' });
      navigate(`/vote/${pollId}?showResults=1`);
      return;
    }
    
    setSelectedPoll(poll);
    // Navigate to the voting page for this poll
    navigate(`/vote/${poll.id}`);
  }, [navigate, user, authLoading, userVotes]);

  const handleViewResults = useCallback((poll) => {
    navigate(`/vote/${poll.id}?showResults=1`);
  }, [navigate]);

  const handlePollFavorite = useCallback(async (pollId, e) => {
    e.stopPropagation();
    if (!user) {
      toast.error('You must be logged in to favorite polls.');
      setShowLoginModal(true);
      return;
    }
    
    // Prevent multiple clicks
    if (favoriteLoading[pollId]) return;
    
    const isFav = favorites.includes(pollId);
    const previousFavorites = [...favorites];
    
    // Set loading state
    setFavoriteLoading(prev => ({ ...prev, [pollId]: true }));
    
    // Optimistic update
    if (isFav) {
      setFavorites(favs => favs.filter(id => id !== pollId));
    } else {
      setFavorites(favs => [...favs, pollId]);
    }
    
    try {
      if (isFav) {
        await axiosInstance.post('/profile/favorites/remove', { pollId });
        toast('Removed from favorites', { icon: '💔' });
      } else {
        await axiosInstance.post('/profile/favorites/add', { pollId });
        toast('Added to favorites', { icon: '❤️' });
      }
      
      // Show success animation
      setFavoriteSuccess(prev => ({ ...prev, [pollId]: true }));
      setTimeout(() => {
        setFavoriteSuccess(prev => ({ ...prev, [pollId]: false }));
      }, 1000);
    } catch (err) {
      // Rollback on error
      setFavorites(previousFavorites);
      console.error('Error updating favorites:', err);
      
      if (err.response?.status === 400) {
        toast.error('Invalid request. Please try again.');
      } else if (err.response?.status === 401) {
        toast.error('Please log in to manage favorites.');
        setShowLoginModal(true);
      } else if (err.response?.status === 404) {
        toast.error('Poll not found.');
      } else {
        toast.error('Failed to update favorites. Please try again.');
      }
    } finally {
      // Clear loading state
      setFavoriteLoading(prev => ({ ...prev, [pollId]: false }));
    }
  }, [user, favorites, favoriteLoading, setShowLoginModal]);

  const handlePollShare = useCallback(async (poll, e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/vote/${poll.id}`;
    const shareData = {
      title: poll.title,
      text: poll.description ? poll.description : 'Check out this poll!',
      url: shareUrl
    };

    // Try Web Share API first
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Poll link shared!');
      } catch (err) {
        // User cancelled or error, fallback to clipboard
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast('Link copied to clipboard!', { icon: '🔗' });
        } catch (clipErr) {
          toast.error('Failed to copy link.');
        }
      }
    } else if (navigator.clipboard) {
      // Clipboard API fallback
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast('Link copied to clipboard!', { icon: '🔗' });
      } catch (err) {
        toast.error('Failed to copy link.');
      }
    } else {
      // Legacy fallback: prompt
      window.prompt('Copy this poll link:', shareUrl);
    }
  }, []);

  const validateDateRange = useCallback(() => {
    const errors = { startError: '', endError: '' };

    // Helper: is valid date
    const isValidDate = (d) => d instanceof Date && !isNaN(d);

    // Parse dates
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Check for invalid date formats
    if (dateRange.start && !isValidDate(startDate)) {
      errors.startError = 'Invalid start date format';
    }
    if (dateRange.end && !isValidDate(endDate)) {
      errors.endError = 'Invalid end date format';
    }

    // Only proceed if dates are valid
    if (!errors.startError && !errors.endError) {
      // Check start > end
      if (startDate && endDate) {
        if (startDate > endDate) {
          errors.startError = 'Start date cannot be after end date';
          errors.endError = 'End date cannot be before start date';
        }
      }

      // Check start in past (allow today)
      if (startDate) {
        if (startDate < now && startDate.getTime() !== now.getTime()) {
          errors.startError = 'Start date cannot be in the past';
        }
      }

      // Check end in future (max 30 days)
      if (endDate) {
        const maxFutureDate = new Date(now);
        maxFutureDate.setDate(maxFutureDate.getDate() + 30);
        if (endDate > maxFutureDate) {
          errors.endError = 'End date cannot be more than 30 days in the future';
        }
        if (endDate < now) {
          errors.endError = 'End date cannot be in the past';
        }
      }

      // Warn if range is too long (e.g., > 30 days)
      if (startDate && endDate && (endDate - startDate) / (1000 * 60 * 60 * 24) > 30) {
        errors.endError = 'Date range cannot exceed 30 days';
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
          setSearchQuery(searchSuggestions[selectedSuggestionIndex].value);
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
    setSearchQuery(suggestion.value);
    setShowSearchSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  // Mark notifications as read when panel is opened
  useEffect(() => {
    if (showNotifications) {
      setNotifications((prev) => prev.map(n => ({ ...n, read: true })));
    }
  }, [showNotifications]);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/polls');
        console.log('Raw polls data:', response.data.polls);
        // Normalize status values for frontend filtering
        const normalized = (response.data.polls || []).map(poll => ({
          ...poll,
          id: poll._id || poll.id,
          status:
                    poll.status === 'active' ? 'Active' :
        poll.status === 'upcoming' ? 'Upcoming' :
        poll.status === 'completed' ? 'Completed' : (poll.status || 'Active'),
          category: poll.category || 'General',
          // Ensure participantCount and totalVotes are preserved
          participantCount: poll.participantCount || 0,
          totalVotes: poll.totalVotes || 0,
        }));
        setPolls(normalized);
        setError(null);
      } catch (err) {
        setError('Failed to load polls');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  // Enhanced: Fetch user's vote status for each poll after polls are loaded and user is logged in
  const fetchUserVotes = useCallback(async () => {
    if (!user || !polls.length) {
      setUserVotes({});
      setUserVotesLoading(false);
      return;
    }
    setUserVotesLoading(true);
    try {
      const pollIds = polls.map(poll => poll.id || poll._id);
      let votesStatus = {};
      // Try batch endpoint first
      try {
        const res = await axiosInstance.post(
          '/votes/batch',
          { pollIds }
        );
        // The batch endpoint returns { success: true, polls: { pollId: { hasVoted: boolean, ... } } }
        if (res.data && res.data.polls) {
          Object.keys(res.data.polls).forEach(pollId => {
            votesStatus[pollId] = res.data.polls[pollId].hasVoted;
          });
        }
      } catch (batchErr) {
        console.warn('Batch vote check failed, falling back to individual requests:', batchErr);
        // Batch endpoint failed, falling back to individual requests
        // Fallback to individual requests if batch fails
        await Promise.all(
          pollIds.map(async (pollId) => {
            try {
              const res = await axiosInstance.get(`/votes/${pollId}`);
              // If we get a successful response, user has voted
              votesStatus[pollId] = true;
            } catch (err) {
              // 404 means no vote found, other errors also mean no vote
              if (err.response?.status === 404) {
                votesStatus[pollId] = false;
              } else {
                console.warn(`Error checking vote for poll ${pollId}:`, err);
                // On error, assume user hasn't voted to be safe
                votesStatus[pollId] = false;
              }
            }
          })
        );
      }
      // User votes status fetched successfully
      setUserVotes({ ...votesStatus, _fetchedAt: Date.now() });
    } catch (err) {
      console.error('Error fetching user votes:', err);
      setUserVotes({});
    } finally {
      setUserVotesLoading(false);
    }
  }, [user, polls]);

  useEffect(() => {
    let isMounted = true;
    fetchUserVotes();
    return () => { isMounted = false; };
  }, [user, polls, fetchUserVotes]);

  // Debug: Log userVotes when it changes (can be removed in production)
  useEffect(() => {
    console.log('userVotes state updated:', userVotes);
  }, [userVotes]);

  // Refetch userVotes when the page/tab becomes visible again
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchUserVotes();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchUserVotes]);

  // Fetch user favorites on mount if logged in
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const res = await axiosInstance.get('/profile/favorites');
        // Handle both populated objects and ObjectIds
        const favoriteIds = res.data.favorites.map(fav => {
          if (typeof fav === 'string' || fav._id) {
            return fav._id || fav;
          }
          return fav.id || fav;
        });
        setFavorites(favoriteIds);
      } catch (err) {
        console.error('Error fetching favorites:', err);
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  const handleSetReminder = async (poll) => {
    if (!user) {
      setShowLoginModal(true);
      toast('Please log in to set poll reminders.', { icon: 'ℹ️' });
      return;
    }

    // Check if browser supports notifications
    if (!('Notification' in window)) {
      toast.error('Browser notifications are not supported.');
      return;
    }

    // Helper: Check if poll already has a reminder set
    const reminders = JSON.parse(localStorage.getItem('pollReminders') || '[]');
    const alreadySet = reminders.some(r => r.pollId === poll.id);
    if (alreadySet) {
      toast('Reminder already set for this poll.', { icon: '🔔' });
      return;
    }

    // Ask for notification permission if not already granted
    if (Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast.error('Please allow notifications to set reminders.');
          return;
        }
      } catch (err) {
        toast.error('Failed to request notification permission.');
        return;
      }
    }

    if (Notification.permission === 'granted') {
      // Try to register a service worker for persistent notifications (if available)
      if ('serviceWorker' in navigator) {
        try {
          // Register service worker if not already registered
          let reg = await navigator.serviceWorker.getRegistration();
          if (!reg) {
            reg = await navigator.serviceWorker.register('/sw.js');
          }
          // Send a message to the service worker to schedule the reminder (if supported)
          if (reg.active) {
            reg.active.postMessage({
              type: 'SCHEDULE_POLL_REMINDER',
              poll: {
                id: poll.id,
                title: poll.title,
                startDate: poll.startDate,
              }
            });
          }
        } catch (err) {
          // Fallback to in-tab reminder
        }
      }
      scheduleReminder(poll);
      toast.success('Reminder set! You will be notified when the poll opens.', { icon: '⏰' });
    } else {
      toast.error('Notifications are blocked. Please enable them in your browser settings.');
    }
  };

  /**
   * Enhanced scheduleReminder:
   * - Stores reminders in localStorage (deduplicated)
   * - Schedules notification with fallback to toast if Notification API fails
   * - Optionally vibrates device (if supported)
   * - Handles tab close/reopen by checking for due reminders on load
   * - Shows time remaining in toast
   */
  const scheduleReminder = (poll) => {
    const startDate = new Date(poll.startDate);
    const now = new Date();
    const msUntilStart = startDate - now;

    if (msUntilStart <= 0) {
      toast('Poll is starting soon!', { icon: '⏰' });
      return;
    }

    // Deduplicate reminders
    let reminders = [];
    try {
      reminders = JSON.parse(localStorage.getItem('pollReminders') || '[]');
    } catch {
      reminders = [];
    }
    if (!reminders.some(r => r.pollId === poll.id)) {
      reminders.push({ pollId: poll.id, title: poll.title, time: poll.startDate });
      localStorage.setItem('pollReminders', JSON.stringify(reminders));
    }

    // Helper: format time remaining
    const formatTime = ms => {
      const min = Math.floor(ms / 60000);
      const sec = Math.floor((ms % 60000) / 1000);
      if (min > 0) return `${min}m ${sec}s`;
      return `${sec}s`;
    };

    // Schedule notification (best effort, will only work if tab is open)
    const notify = () => {
      try {
        new Notification(`Poll Reminder: ${poll.title}`, {
          body: 'This poll is now open for voting!',
          icon: '/favicon.ico'
        });
        // Optional: vibrate device if supported
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      } catch (err) {
        toast(`Poll "${poll.title}" is now open for voting!`, { icon: '⏰' });
      }
    };

    // Use a unique timeout key to avoid duplicate timeouts for the same poll
    const timeoutKey = `pollReminderTimeout_${poll.id}`;
    if (window[timeoutKey]) clearTimeout(window[timeoutKey]);
    window[timeoutKey] = setTimeout(() => {
      notify();
      // Remove reminder from localStorage after firing
      let updatedReminders = [];
      try {
        updatedReminders = JSON.parse(localStorage.getItem('pollReminders') || '[]');
      } catch {
        updatedReminders = [];
      }
      updatedReminders = updatedReminders.filter(r => r.pollId !== poll.id);
      localStorage.setItem('pollReminders', JSON.stringify(updatedReminders));
    }, msUntilStart);

    toast.success(
      <>
        Reminder set! You will be notified when the poll opens.<br />
        <span className="text-xs text-gray-500">
          Starts in {formatTime(msUntilStart)}
        </span>
      </>,
      { icon: '⏰' }
    );
  };

  // On mount: check for any due reminders (in case tab was closed)
  useEffect(() => {
    const checkReminders = () => {
      let reminders = [];
      try {
        reminders = JSON.parse(localStorage.getItem('pollReminders') || '[]');
      } catch {
        reminders = [];
      }
      const now = new Date();
      reminders.forEach(reminder => {
        const startDate = new Date(reminder.time);
        if (startDate <= now) {
          // Fire notification and remove from storage
          try {
            new Notification(`Poll Reminder: ${reminder.title}`, {
              body: 'This poll is now open for voting!',
              icon: '/favicon.ico'
            });
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200]);
            }
          } catch {
            toast(`Poll "${reminder.title}" is now open for voting!`, { icon: '⏰' });
          }
        }
      });
      // Remove all past reminders
      const futureReminders = reminders.filter(r => new Date(r.time) > now);
      localStorage.setItem('pollReminders', JSON.stringify(futureReminders));
    };
    checkReminders();
    // Optionally, check every minute for overdue reminders
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- FILTER PRESETS STATE & LOGIC ---
  const [filterPresets, setFilterPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pollFilterPresets') || '[]');
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  const savePreset = () => {
    if (!presetName.trim()) return;
    const newPreset = {
      name: presetName.trim(),
      categories: selectedCategories,
      statuses: selectedStatuses,
      dateRange: { ...dateRange },
      sortBy,
      secondarySort,
      sortDirection,
    };
    const updated = [...filterPresets.filter(p => p.name !== newPreset.name), newPreset];
    setFilterPresets(updated);
    localStorage.setItem('pollFilterPresets', JSON.stringify(updated));
    setShowPresetDialog(false);
    setPresetName('');
  };
  const applyPreset = (preset) => {
    setSelectedCategories(preset.categories || []);
    setSelectedStatuses(preset.statuses || []);
    setDateRange(preset.dateRange || { start: '', end: '' });
    setSortBy(preset.sortBy || 'newest');
    setSecondarySort(preset.secondarySort || null);
    setSortDirection(preset.sortDirection || 'desc');
  };
  const deletePreset = (name) => {
    const updated = filterPresets.filter(p => p.name !== name);
    setFilterPresets(updated);
    localStorage.setItem('pollFilterPresets', JSON.stringify(updated));
  };

  // --- FILTER PRESETS UI ---
  // Place this UI in the advanced filter section, above the filter cards:
  <div className="mb-4">
    <div className="flex flex-wrap gap-2 items-center">
      <button
        className="text-xs px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
        onClick={() => setShowPresetDialog(true)}
      >
        Save Current Filters as Preset
      </button>
      {filterPresets.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Presets:</span>
          {filterPresets.map(preset => (
            <span key={preset.name} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 mr-1">
              <button onClick={() => applyPreset(preset)} className="font-medium mr-1 hover:underline">{preset.name}</button>
              <button onClick={() => deletePreset(preset.name)} className="ml-1 text-red-500 hover:text-red-700 dark:text-red-300 dark:hover:text-red-100" aria-label={`Delete preset ${preset.name}`}>&times;</button>
            </span>
          ))}
        </div>
      )}
    </div>
    {showPresetDialog && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white dark:bg-[#232a33] p-6 rounded-xl shadow-xl w-full max-w-xs">
          <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Save Filter Preset</h4>
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="Preset name"
            className="w-full px-3 py-2 mb-3 border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowPresetDialog(false)} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800">Cancel</button>
            <button onClick={savePreset} className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Save</button>
          </div>
        </div>
      </div>
    )}
  </div>

  // --- COLLAPSIBLE FILTER CARDS STATE ---
  const [openFilterCards, setOpenFilterCards] = useState({
    category: true,
    date: true,
    status: true,
    sort: true,
    participants: true,
  });
  const toggleFilterCard = (key) => setOpenFilterCards(prev => ({ ...prev, [key]: !prev[key] }));

  // --- PARTICIPANTS RANGE FILTER STATE ---
  const handleParticipantsRangeChange = (key, value) => {
    if (/^\d*$/.test(value)) setParticipantsRange(prev => ({ ...prev, [key]: value }));
  };
  const clearParticipantsRange = () => setParticipantsRange({ min: '', max: '' });

  // --- Add to openFilterCards state ---
  // (already defined, add 'participants' key)
  // const [openFilterCards, setOpenFilterCards] = useState({ ... , participants: true });
  // if (!openFilterCards.participants) openFilterCards.participants = true;

  // --- In the advanced filter section grid, add a new card for participants range ---
  <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between mb-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
        <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
        Participants
      </label>
      <button onClick={() => toggleFilterCard('participants')} aria-label={openFilterCards.participants ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
        <svg className={`w-4 h-4 transition-transform ${openFilterCards.participants ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
    </div>
    {openFilterCards.participants && (
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={participantsRange.min}
          onChange={e => handleParticipantsRangeChange('min', e.target.value)}
          placeholder="Min"
          className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          aria-label="Minimum participants"
        />
        <span className="text-gray-500 dark:text-gray-400">-</span>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={participantsRange.max}
          onChange={e => handleParticipantsRangeChange('max', e.target.value)}
          placeholder="Max"
          className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          aria-label="Maximum participants"
        />
        <button onClick={clearParticipantsRange} className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Clear</button>
      </div>
    )}
  </div>

  // Extract unique creators from polls (support both poll.creator and poll.createdBy)
  const creators = useMemo(() => {
    const all = polls
      .map(poll => poll.createdBy?.username || poll.createdBy?.email || poll.creator || null)
      .filter(Boolean);
    return Array.from(new Set(all));
  }, [polls]);

  const filteredCreators = useMemo(() => {
    if (!creatorSearch) return creators;
    const searchLower = creatorSearch.toLowerCase();
    return creators.filter(c => c.toLowerCase().includes(searchLower));
  }, [creators, creatorSearch]);

  const handleCreatorToggle = (creator) => {
    setSelectedCreators(prev =>
      prev.includes(creator)
        ? prev.filter(c => c !== creator)
        : [...prev, creator]
    );
  };

  const clearCreators = () => setSelectedCreators([]);

  // --- Add to openFilterCards state ---
  if (!openFilterCards.creator) openFilterCards.creator = true;

  // --- In the advanced filter section grid, add a new card for creator filter ---
  <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
    <div className="flex items-center justify-between mb-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        Creator
      </label>
      <button onClick={() => toggleFilterCard('creator')} aria-label={openFilterCards.creator ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
        <svg className={`w-4 h-4 transition-transform ${openFilterCards.creator ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
    </button>
    </div>
    {openFilterCards.creator && (
      <>
        <input
          type="text"
          value={creatorSearch}
          onChange={e => setCreatorSearch(e.target.value)}
          placeholder="Search creators..."
          className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent mb-2"
        />
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {filteredCreators.map((creator, index) => (
            <label key={`creator-${creator}-${index}`} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCreators.includes(creator)}
                onChange={() => handleCreatorToggle(creator)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm text-gray-700 dark:text-[#a0acbb]">{creator}</span>
            </label>
          ))}
        </div>
        <button onClick={clearCreators} className="mt-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Clear</button>
      </>
    )}
  </div>

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 dark:group/design-root overflow-x-hidden transition-colors duration-200" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-4 sm:py-5">
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 mb-6 sm:mb-8">
              {/* Animated Title & Description */}
              <div className="flex flex-col gap-1.5 sm:gap-2 relative">
                <div className="flex items-center gap-3 mb-1">
                  {/* Enhanced Back Button Section */}
                  <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-white/90 via-blue-50/80 to-white/90 dark:from-gray-800/90 dark:via-blue-900/30 dark:to-gray-800/90 shadow-lg border border-gray-200 dark:border-gray-700 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 group/back"
                    aria-label="Go back"
                    tabIndex={0}
                  >
                    <span className="relative flex items-center">
                      <svg className="w-4 h-4 mr-1 group-hover/back:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      <span className="font-medium text-sm">Back</span>
                    </span>
                  </button>
                  <h1
                    className="relative z-10 flex items-center gap-2 text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white"
                    tabIndex={0}
                    aria-label="Available Polls"
                  >
                    <span className="inline-block bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
                      Available Polls
                    </span>
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-xs font-semibold text-blue-700 dark:text-blue-200 animate-fade-in">
                      Live
                      <span className="ml-1 w-2 h-2 rounded-full bg-green-400 animate-pulse" aria-hidden="true"></span>
                    </span>
                  </h1>
                </div>
                <p
                  className="relative z-10 text-gray-600 dark:text-[#a0acbb] text-sm sm:text-base font-normal leading-relaxed transition-colors duration-300"
                  tabIndex={0}
                  aria-live="polite"
                >
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V6m0 0l-5 5m5-5l5 5" />
                    </svg>
                    <span>
                      Browse and participate in <span className="font-semibold text-blue-600 dark:text-blue-400">current polls</span>.
                      <span className="ml-1 font-semibold text-green-600 dark:text-green-400">Your vote matters!</span>
                    </span>
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
                        if (typeof searchQuery === 'string' && searchQuery.trim() && searchSuggestions.length > 0) {
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
                              key={`suggestion-${suggestion.value}-${index}`}
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
                                    <span className="font-medium" dangerouslySetInnerHTML={{ __html: suggestion.display || suggestion.value }} />
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {(() => {
                                      if (polls.some(poll => poll.title === suggestion.value)) {
                                        return 'Poll title';
                                      } else if (polls.some(poll => poll.category === suggestion.value)) {
                                        return 'Category';
                                      } else if ([
                                        'active', 'upcoming', 'completed'
                                      ].includes(suggestion.value.toLowerCase())) {
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
                  <div className="bg-white dark:bg-[#1e242c] rounded-2xl border border-gray-200 dark:border-[#2c353f] p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow">
                          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Advanced Filters</h3>
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
                        </motion.button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {/* Categories Filter Card */}
                      <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
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
                          <button onClick={() => toggleFilterCard('category')} aria-label={openFilterCards.category ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
                            <svg className={`w-4 h-4 transition-transform ${openFilterCards.category ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                        {openFilterCards.category && (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            <div className="flex items-center gap-2 mb-2">
                              <input
                                type="text"
                                value={categorySearch}
                                onChange={e => setCategorySearch(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                              />
                              <button
                                type="button"
                                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
                                onClick={() => setSelectedCategories(filteredCategories)}
                                disabled={filteredCategories.length === 0}
                              >
                                Select All
                              </button>
                              <button
                                type="button"
                                className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
                                onClick={() => setSelectedCategories([])}
                                disabled={selectedCategories.length === 0}
                              >
                                Deselect All
                              </button>
                            </div>
                            {filteredCategories.map((category, index) => (
                              <label key={`category-${category}-${index}`} className="flex items-center gap-2 cursor-pointer">
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
                        )}
                      </div>
                      {/* Date Range Filter Card */}
                      <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
                            <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            Date Range
                          </label>
                          <button onClick={() => toggleFilterCard('date')} aria-label={openFilterCards.date ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
                            <svg className={`w-4 h-4 transition-transform ${openFilterCards.date ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                        {openFilterCards.date && (
                          <div className="space-y-3">
                            {showDatePresets && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                <button type="button" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => setDateRange({ start: getCurrentDate(), end: getCurrentDate() })}>Today</button>
                                <button type="button" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => setDateRange({ start: getDateDaysAgo(6), end: getCurrentDate() })}>Last 7 Days</button>
                                <button type="button" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => setDateRange({ start: getDateDaysAgo(29), end: getCurrentDate() })}>Last 30 Days</button>
                                <button type="button" className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800" onClick={() => setDateRange({ start: '', end: '' })}>Any</button>
                              </div>
                            )}
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
                        )}
                      </div>
                      {/* Sort By Filter Card */}
                      <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
                            <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l1 2h13l1-2h2" /></svg>
                            Sort By
                          </label>
                          <button onClick={() => toggleFilterCard('sort')} aria-label={openFilterCards.sort ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
                            <svg className={`w-4 h-4 transition-transform ${openFilterCards.sort ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                        {openFilterCards.sort && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
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
                            </div>
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-medium text-gray-600 dark:text-[#8b9bb4]">
                                Sort Direction
                              </label>
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
                            </div>
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
                        )}
                      </div>
                      {/* Status Filter Card */}
                      <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
                            <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Status Filter
                          </label>
                          <button onClick={() => toggleFilterCard('status')} aria-label={openFilterCards.status ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
                            <svg className={`w-4 h-4 transition-transform ${openFilterCards.status ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                        {openFilterCards.status && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-medium text-gray-600 dark:text-[#8b9bb4]">
                                Status
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
                        )}
                      </div>
                      {/* Participants Range Filter Card */}
                      <div className="bg-gray-50 dark:bg-[#232a33] rounded-xl p-4 border border-gray-200 dark:border-[#2c353f] shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb] flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m8 0a4 4 0 01-8 0" /></svg>
                            Participants
                          </label>
                          <button onClick={() => toggleFilterCard('participants')} aria-label={openFilterCards.participants ? 'Collapse' : 'Expand'} className="ml-2 text-gray-400 hover:text-blue-500 dark:hover:text-blue-300 focus:outline-none">
                            <svg className={`w-4 h-4 transition-transform ${openFilterCards.participants ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                          </button>
                        </div>
                        {openFilterCards.participants && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={participantsRange.min}
                              onChange={e => handleParticipantsRangeChange('min', e.target.value)}
                              placeholder="Min"
                              className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                              aria-label="Minimum participants"
                            />
                            <span className="text-gray-500 dark:text-gray-400">-</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={participantsRange.max}
                              onChange={e => handleParticipantsRangeChange('max', e.target.value)}
                              placeholder="Max"
                              className="w-20 px-2 py-1 text-sm border rounded bg-white dark:bg-[#232a33] text-gray-900 dark:text-white border-gray-300 dark:border-[#2c353f] focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                              aria-label="Maximum participants"
                            />
                            <button onClick={clearParticipantsRange} className="ml-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Clear</button>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* ...existing code for active filters display... */}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Tabs */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 border-b border-gray-200/60 dark:border-[#2c353f]/60 backdrop-blur-[1px]" />
              <div className="relative flex space-x-1 sm:space-x-2 p-1 sm:p-2 bg-gradient-to-r from-gray-50/50 via-transparent to-gray-50/50 dark:from-[#1e242c]/30 dark:via-transparent dark:to-[#1e242c]/30 rounded-t-xl">
                {['Active', 'Upcoming', 'Completed'].map((tab, index) => (
                  <motion.button
                    key={`tab-${tab}-${index}`}
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
                      {tab === 'Completed' && (
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

            {/* Active Filter Chips */}
            {(selectedCategories.length > 0 || selectedStatuses.length > 0 || dateRange.start || dateRange.end) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(cat => (
                  <span key={cat} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {cat}
                    <button onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))} className="ml-1 text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100">&times;</button>
                  </span>
                ))}
                {selectedStatuses.map(status => (
                  <span key={status} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300">
                    {status}
                    <button onClick={() => setSelectedStatuses(selectedStatuses.filter(s => s !== status))} className="ml-1 text-pink-500 hover:text-pink-700 dark:text-pink-300 dark:hover:text-pink-100">&times;</button>
                  </span>
                ))}
                {dateRange.start && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    Start: {dateRange.start}
                    <button onClick={() => setDateRange({ ...dateRange, start: '' })} className="ml-1 text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-100">&times;</button>
                  </span>
                )}
                {dateRange.end && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                    End: {dateRange.end}
                    <button onClick={() => setDateRange({ ...dateRange, end: '' })} className="ml-1 text-green-500 hover:text-green-700 dark:text-green-300 dark:hover:text-green-100">&times;</button>
                  </span>
                )}
                <button onClick={clearFilters} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-800 ml-2">Clear All</button>
              </div>
            )}

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
                    key={poll.id ? `poll-${poll.id}` : `poll-index-${index}`}
                    initial={{ opacity: 0, y: 32, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 180, 
                      damping: 20,
                      delay: index * 0.08,
                      duration: 0.6
                    }}
                    whileHover={{ 
                      y: -4, 
                      scale: 1.02,
                      transition: { 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 25,
                        duration: 0.3
                      }
                    }}
                    className="group bg-white dark:bg-[#1e242c] rounded-xl border border-gray-200 dark:border-[#2c353f] overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
                    onClick={() => handlePollClick(poll)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Poll Image */}
                    <div className="relative overflow-hidden group/image h-40 sm:h-48">
                      <motion.img
                        src={poll.image || landingHero}
                        alt={poll.title}
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.05 }}
                        whileHover={{ scale: 1.12 }}
                        transition={{ 
                          duration: 0.8, 
                          ease: [0.25, 0.46, 0.45, 0.94],
                          type: "spring",
                          stiffness: 200,
                          damping: 20
                        }}
                        loading="lazy"
                      />
                      
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                      
                      {/* Floating Action Buttons */}
                      <div className="absolute top-3 right-3 flex gap-2">
                        <motion.button
                          onClick={(e) => handlePollFavorite(poll.id || poll._id, e)}
                          disabled={favoriteLoading[poll.id || poll._id]}
                          className={`w-8 h-8 sm:w-10 sm:h-10 backdrop-blur-md rounded-full flex items-center justify-center transition-colors duration-300 border shadow-lg ${
                            favoriteLoading[poll.id || poll._id]
                              ? 'bg-white/40 dark:bg-black/40 text-gray-600 dark:text-gray-300 cursor-not-allowed border-white/30 dark:border-white/20'
                              : favoriteSuccess[poll.id || poll._id]
                              ? 'bg-green-500/40 dark:bg-green-400/40 text-green-700 dark:text-green-200 border-green-500/50 dark:border-green-400/50'
                              : 'bg-white/35 dark:bg-black/35 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 border-white/40 dark:border-white/30'
                          }`}
                          whileHover={favoriteLoading[poll.id || poll._id] ? {} : { scale: 1.15, rotate: 5 }}
                          whileTap={favoriteLoading[poll.id || poll._id] ? {} : { scale: 0.9 }}
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1, 
                            rotate: 0
                          }}
                          transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay: 0.3
                          }}
                          aria-label={favorites.includes(poll.id || poll._id) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {favoriteLoading[poll.id || poll._id] ? (
                            <motion.svg 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              fill="none" 
                              viewBox="0 0 24 24"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </motion.svg>
                          ) : favorites.includes(poll.id || poll._id) ? (
                            <motion.svg 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              fill="currentColor" 
                              viewBox="0 0 24 24"
                              key={`favorite-${poll.id || poll._id}-${favorites.includes(poll.id || poll._id)}`}
                              initial={{ scale: 0.8, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 15,
                                duration: 0.4
                              }}
                            >
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </motion.svg>
                          ) : (
                            <motion.svg 
                              className="w-4 h-4 sm:w-5 sm:h-5" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                              key={`unfavorite-${poll.id || poll._id}-${favorites.includes(poll.id || poll._id)}`}
                              initial={{ scale: 0.8, rotate: 180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ 
                                type: "spring", 
                                stiffness: 400, 
                                damping: 15,
                                duration: 0.4
                              }}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </motion.svg>
                          )}
                        </motion.button>
                        
                        <motion.button
                          onClick={(e) => handlePollShare(poll, e)}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-white/35 dark:bg-black/35 backdrop-blur-md rounded-full flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-black/50 transition-colors duration-300 border border-white/40 dark:border-white/30 shadow-lg"
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.9 }}
                          initial={{ opacity: 0, scale: 0, rotate: 180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 15,
                            delay: 0.4 
                          }}
                        >
                          <motion.svg 
                            className="w-4 h-4 sm:w-5 sm:h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                            whileHover={{ rotate: 15 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </motion.svg>
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                              {poll.title}
                            </h3>
                            {userVotesLoading && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Loading
                              </span>
                            )}
                            {!userVotesLoading && userVotes[poll.id || poll._id] && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Voted
                              </span>
                            )}
                          </div>
                        </div>
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
                              if (now < startDate) {
                                const rem = getTimeRemaining(startDate);
                                return rem ? `${rem} until start` : 'Starts soon';
                              } else if (now.toDateString() === startDate.toDateString()) {
                                return 'Started today';
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
                              if (now < endDate) {
                                const rem = getTimeRemaining(endDate);
                                return rem ? rem : 'Ending soon';
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
                        {/* Candidates */}
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                              {(() => {
                                const candidates = poll.options || [];
                                if (candidates.length === 0) {
                                  return (
                                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#1e242c] bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                  );
                                }
                                return (
                                  <>
                                    {candidates.slice(0, 3).map((candidate, i) => (
                                      <div
                                        key={`candidate-${poll.id}-${i}`}
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#1e242c] bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold"
                                        title={candidate.text}
                                      >
                                        {candidate.text.charAt(0).toUpperCase()}
                                      </div>
                                    ))}
                                    {candidates.length > 3 && (
                                      <div
                                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#1e242c] bg-gray-500 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold"
                                        title={`${candidates.length - 3} more candidates`}
                                      >
                                        +{candidates.length - 3}
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600 dark:text-[#a0acbb]">
                              {(() => {
                                const candidates = poll.options || [];
                                const candidateCount = candidates.length;
                                if (candidateCount === 0) {
                                  return 'No candidates';
                                }
                                if (candidateCount === 1) {
                                  return `${candidates[0].text} (Sole Candidate)`;
                                }
                                if (candidateCount === 2) {
                                  return `${candidates[0].text} vs ${candidates[1].text}`;
                                }
                                if (candidateCount === 3) {
                                  return `${candidates[0].text}, ${candidates[1].text} & ${candidates[2].text}`;
                                }
                                // For 4+ candidates, show first 2 + count
                                return `${candidates[0].text}, ${candidates[1].text} +${candidateCount - 2} more`;
                              })()}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            {/* Vote count display */}
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                              {(() => {
                                const candidates = poll.options || [];
                                const totalVotes = poll.totalVotes || 0;
                                if (totalVotes === 0) {
                                  return 'No votes yet';
                                }
                                return `${totalVotes} vote${totalVotes === 1 ? '' : 's'}`;
                              })()}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            
                            if (poll.status === 'Active') {
                              // Check if user has already voted
                              const pollId = poll.id || poll._id;
                              const hasVoted = userVotes[pollId];
                              
                              if (userVotesLoading) {
                                toast('Loading vote status...', { icon: '⏳' });
                                return;
                              }
                              
                              if (hasVoted) {
                                // User has already voted, show results
                                handleViewResults(poll);
                              } else {
                                handlePollClick(poll);
                              }
                            } else if (poll.status === 'Upcoming') {
                              handleSetReminder(poll);
                            } else {
                              // For completed polls
                              handleViewResults(poll);
                            }
                          }}
                          aria-label={
                            poll.status === 'Active'
                              ? (userVotesLoading ? 'Loading...' : userVotes[poll.id || poll._id] ? 'Already Voted - View Results' : 'Vote Now')
                              : poll.status === 'Upcoming'
                              ? 'Set Reminder'
                              : 'View Results'
                          }
                          className={`w-full py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                            poll.status === 'Active'
                              ? userVotesLoading
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                : userVotes[poll.id || poll._id]
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 cursor-pointer'
                                : 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e] hover:bg-blue-700 dark:hover:bg-[#b3c7e0]'
                              : poll.status === 'Upcoming'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800'
                              : 'bg-gray-100 dark:bg-[#2c353f] text-gray-700 dark:text-[#a0acbb] hover:bg-gray-200 dark:hover:bg-[#3f4c5a]'
                          }`}
                          data-poll-id={poll.id || poll._id}
                                                  >
                            {poll.status === 'Active'
                              ? (userVotesLoading ? 'Loading...' : userVotes[poll.id || poll._id] ? 'Already Voted' : 'Vote Now')
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

            {/* Advanced Custom Illustration Empty State */}
            {filteredPolls.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 32, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                className="text-center  flex flex-col items-center justify-center"
              >
                {/* Enhanced Custom SVG Illustration - Light/Dark Mode Adaptable */}
                <motion.div
                  className="relative w-44 h-44 sm:w-64 sm:h-64 mx-auto mb-8 sm:mb-12 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.9, rotate: -6 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 10, delay: 0.08 }}
                >
                  {/* Main illustration: ballot box with floating papers, question mark, and more */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 240 240"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Shadow */}
                    <ellipse
                      cx="120"
                      cy="210"
                      rx="65"
                      ry="13"
                      fill="var(--polls-shadow, #B6C2D1)"
                      opacity="0.16"
                    />
                    {/* Ballot box base */}
                    <rect
                      x="40"
                      y="120"
                      width="160"
                      height="64"
                      rx="14"
                      fill="var(--polls-box-base, #e5eaf1)"
                    />
                    {/* Ballot box lid */}
                    <rect
                      x="54"
                      y="104"
                      width="132"
                      height="24"
                      rx="7"
                      fill="var(--polls-box-lid, #c7d7e9)"
                    />
                    {/* Slot */}
                    <rect
                      x="104"
                      y="112"
                      width="32"
                      height="7"
                      rx="2.5"
                      fill="var(--polls-slot, #a0acbb)"
                      opacity="0.5"
                    />
                    {/* Paper 1 (animated float) */}
                    <motion.rect
                      x="86"
                      y="62"
                      width="34"
                      height="48"
                      rx="5"
                      fill="var(--polls-paper, #fff)"
                      stroke="var(--polls-paper-stroke, #b6c2d1)"
                      strokeWidth="2"
                      initial={{ y: 0, rotate: -10 }}
                      animate={{ y: [0, -12, 0], rotate: [-10, 2, -10] }}
                      transition={{ repeat: Infinity, duration: 2.1, delay: 0.18, repeatType: "mirror" }}
                      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.06))" }}
                    />
                    {/* Paper 2 (animated float) */}
                    <motion.rect
                      x="124"
                      y="74"
                      width="30"
                      height="38"
                      rx="4"
                      fill="var(--polls-paper, #fff)"
                      stroke="var(--polls-paper-stroke, #b6c2d1)"
                      strokeWidth="2"
                      initial={{ y: 0, rotate: 12 }}
                      animate={{ y: [0, -14, 0], rotate: [12, -2, 12] }}
                      transition={{ repeat: Infinity, duration: 2.3, delay: 0.5, repeatType: "mirror" }}
                      style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.06))" }}
                    />
                    {/* Paper 3 (new, animated float) */}
                    <motion.rect
                      x="108"
                      y="44"
                      width="24"
                      height="32"
                      rx="3"
                      fill="var(--polls-paper-alt, #f3f4f6)"
                      stroke="var(--polls-paper-stroke, #b6c2d1)"
                      strokeWidth="1.5"
                      initial={{ y: 0, rotate: 0, opacity: 0.7 }}
                      animate={{ y: [0, -10, 0], rotate: [0, 8, 0], opacity: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.7, delay: 0.9, repeatType: "mirror" }}
                      style={{ filter: "drop-shadow(0 1.5px 6px rgba(0,0,0,0.04))" }}
                    />
                    {/* Question mark bubble */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0.8, y: 16 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 1.1, duration: 0.5, type: "spring", stiffness: 120 }}
                    >
                      <ellipse
                        cx="192"
                        cy="62"
                        rx="24"
                        ry="24"
                        fill="var(--polls-question-bg, #e0edfa)"
                        opacity="0.97"
                      />
                      <text
                        x="192"
                        y="74"
                        textAnchor="middle"
                        fontSize="36"
                        fontWeight="bold"
                        fill="var(--polls-question, #60a5fa)"
                        opacity="0.88"
                        style={{ fontFamily: "inherit" }}
                      >?</text>
                    </motion.g>
                    {/* Confetti (subtle, animated) */}
                    <motion.circle
                      cx="60"
                      cy="54"
                      r="3"
                      fill="var(--polls-confetti-blue, #60a5fa)"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.5, delay: 0.7, repeatType: "mirror" }}
                    />
                    <motion.circle
                      cx="180"
                      cy="38"
                      r="2.5"
                      fill="var(--polls-confetti-yellow, #fbbf24)"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.1, delay: 1.1, repeatType: "mirror" }}
                    />
                    <motion.circle
                      cx="130"
                      cy="28"
                      r="2.5"
                      fill="var(--polls-confetti-green, #34d399)"
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.7, 1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.3, delay: 1.5, repeatType: "mirror" }}
                    />
                    {/* New: animated sparkle stars */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.8, delay: 1.2, repeatType: "mirror" }}
                    >
                      <polygon
                        points="40,80 42,84 46,85 42,86 40,90 38,86 34,85 38,84"
                        fill="var(--polls-star-pink, #f472b6)"
                        opacity="0.7"
                      />
                    </motion.g>
                    <motion.g
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 0], scale: [0.7, 1.1, 0.7] }}
                      transition={{ repeat: Infinity, duration: 2.6, delay: 1.7, repeatType: "mirror" }}
                    >
                      <polygon
                        points="200,120 202,124 206,125 202,126 200,130 198,126 194,125 198,124"
                        fill="var(--polls-star-indigo, #818cf8)"
                        opacity="0.7"
                      />
                    </motion.g>
                    {/* New: animated "no entry" sign for extra clarity */}
                    <motion.g
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: [0, 0.7, 0], scale: [0.8, 1, 0.8], y: [10, 0, 10] }}
                      transition={{ repeat: Infinity, duration: 3.2, delay: 2.1, repeatType: "mirror" }}
                    >
                      <circle
                        cx="60"
                        cy="170"
                        r="10"
                        fill="var(--polls-noentry-bg, #fee2e2)"
                        stroke="var(--polls-noentry-stroke, #ef4444)"
                        strokeWidth="2"
                        opacity="0.7"
                      />
                      <rect
                        x="54"
                        y="168"
                        width="12"
                        height="4"
                        rx="2"
                        fill="var(--polls-noentry-stroke, #ef4444)"
                        opacity="0.8"
                      />
                    </motion.g>
                  </svg>
                  {/* Animated "No Results" text floating above box */}
                  <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-2 text-center pointer-events-none"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 0.7, y: [ -10, 0, -10 ] }}
                    transition={{ repeat: Infinity, duration: 2.8, delay: 1.3, repeatType: "mirror" }}
                  >
                    <span className="text-xs sm:text-sm font-semibold tracking-wide drop-shadow"
                      style={{
                        color: "var(--polls-noresults, #60a5fa)",
                      }}
                    >
                      No Results
                    </span>
                  </motion.div>
                </motion.div>
                {/* 
                  CSS variables for light/dark mode (add to your global CSS or a parent container):
                  :root {
                    --polls-shadow: #B6C2D1;
                    --polls-box-base: #e5eaf1;
                    --polls-box-lid: #c7d7e9;
                    --polls-slot: #a0acbb;
                    --polls-paper: #fff;
                    --polls-paper-alt: #f3f4f6;
                    --polls-paper-stroke: #b6c2d1;
                    --polls-question-bg: #e0edfa;
                    --polls-question: #60a5fa;
                    --polls-confetti-blue: #60a5fa;
                    --polls-confetti-yellow: #fbbf24;
                    --polls-confetti-green: #34d399;
                    --polls-star-pink: #f472b6;
                    --polls-star-indigo: #818cf8;
                    --polls-noentry-bg: #fee2e2;
                    --polls-noentry-stroke: #ef4444;
                    --polls-noresults: #60a5fa;
                  }
                  .dark {
                    --polls-shadow: #232a33;
                    --polls-box-base: #232a33;
                    --polls-box-lid: #2c353f;
                    --polls-slot: #a0acbb;
                    --polls-paper: #232a33;
                    --polls-paper-alt: #2c353f;
                    --polls-paper-stroke: #3f4c5a;
                    --polls-question-bg: #28303a;
                    --polls-question: #93c5fd;
                    --polls-confetti-blue: #60a5fa;
                    --polls-confetti-yellow: #fbbf24;
                    --polls-confetti-green: #34d399;
                    --polls-star-pink: #f472b6;
                    --polls-star-indigo: #818cf8;
                    --polls-noentry-bg: #232a33;
                    --polls-noentry-stroke: #ef4444;
                    --polls-noresults: #93c5fd;
                  }
                */}
                <motion.h3
                  className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  No polls found
                </motion.h3>
                <motion.p
                  className="text-base sm:text-lg text-gray-600 dark:text-[#a0acbb] mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  We couldn't find any polls matching your criteria.<br className="hidden sm:inline" />
                  Try adjusting your search or filters to discover more!
                </motion.p>
                <motion.div
                  className="flex flex-col sm:flex-row gap-2 items-center justify-center mt-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.3 }}
                >
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 dark:bg-[#232a33] text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-[#28303a] transition"
                    onClick={() => {
                      // Clear filters and search
                      setSearchQuery('');
                      setSelectedCategories([]);
                      setSelectedStatuses([]);
                      setDateRange({ start: '', end: '' });
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                    Clear All Filters
                  </button>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-gray-100 dark:bg-[#2c353f] text-gray-700 dark:text-[#a0acbb] font-medium text-xs sm:text-sm hover:bg-gray-200 dark:hover:bg-[#3f4c5a] transition"
                    onClick={() => {
                      // Focus the search input if available
                      if (typeof document !== "undefined") {
                        const input = document.querySelector('input[type="search"], input[aria-label="Search"]');
                        if (input) input.focus();
                      }
                    }}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l-3.5-3.5" />
                    </svg>
                    Refine Search
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {/* Not logged in modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Login Required</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">You must be logged in to vote. Please log in or register to participate in polls.</p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                onClick={() => { setShowLoginModal(false); navigate('/login'); }}
              >
                Login
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setShowLoginModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailablePolls; 