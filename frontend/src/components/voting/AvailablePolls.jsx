import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from 'framer-motion';
import { MagnifyingGlass, Bell, CaretDown, X, ArrowRight, User, Calendar, Clock, BarChart3, Users } from '../ui/icons';
import { Check, LayoutGrid, List, Filter, SlidersHorizontal, Plus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';
// Remove direct axios import since we're using axiosInstance
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../utils/toastUtils';
import landingHero from '../../assets/landing-hero.webp';
import axiosInstance from '../../utils/api/axiosConfig';
import RadioOption from '../ui/RadioOption';
import ShareButtons from '../ui/ShareButtons';

import PollCard from './PollCard';
import PollListItem from './PollListItem';

// --- Utility Functions ---
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
  const [viewMode, setViewMode] = useState('grid');
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

  // --- FILTER PRESETS STATE ---
  const [filterPresets, setFilterPresets] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pollFilterPresets') || '[]');
    } catch {
      return [];
    }
  });
  const [presetName, setPresetName] = useState('');
  const [showPresetDialog, setShowPresetDialog] = useState(false);

  // --- COLLAPSIBLE FILTER CARDS STATE ---
  const [openFilterCards, setOpenFilterCards] = useState({
    category: true,
    date: true,
    status: true,
    sort: true,
    participants: true,
    creators: true, // Added creators
  });
  const toggleFilterCard = (key) => setOpenFilterCards(prev => ({ ...prev, [key]: !prev[key] }));


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

    // --- Helper utilities (Moved to module scope) ---
    // const normalize = ...
    // const levenshtein = ...
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
    } catch { }
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

  const isWithinDateRange = (poll, range) => {
    const pollStart = new Date(poll.startDate);
    const pollEnd = new Date(poll.endDate);
    const rangeStart = range.start ? new Date(range.start) : null;
    const rangeEnd = range.end ? new Date(range.end) : null;
    if (!rangeStart && !rangeEnd) return true;
    if (rangeStart && rangeEnd) return pollEnd >= rangeStart && pollStart <= rangeEnd;
    if (rangeStart) return pollEnd >= rangeStart;
    if (rangeEnd) return pollStart <= rangeEnd;
    return true;
  };

  const matchesCategory = (poll, selected) => {
    if (!selected || selected.length === 0) return true;
    return selected.some(cat => normalize(poll.category).includes(normalize(cat)));
  };

  const matchesStatus = (poll, tab, selectedStatuses) => {
    if (selectedStatuses && selectedStatuses.length > 0) return selectedStatuses.includes(poll.status);
    if (!tab || tab === 'All') return true;
    if (Array.isArray(tab)) return tab.includes(poll.status);
    return poll.status === tab;
  };

  const matchesParticipantsRange = (poll, range) => {
    const min = range.min ? parseInt(range.min, 10) : null;
    const max = range.max ? parseInt(range.max, 10) : null;
    const participantCount = poll.participantCount || poll.totalVotes || 0;
    if (min !== null && participantCount < min) return false;
    if (max !== null && participantCount > max) return false;
    return true;
  };

  const getSortFn = (sortBy, secondarySort, sortDirection) => {
    const direction = sortDirection === 'asc' ? 1 : -1;
    const getPrimarySort = (a, b) => {
      switch (sortBy) {
        case 'newest': return direction * (new Date(b.startDate) - new Date(a.startDate));
        case 'oldest': return direction * (new Date(a.startDate) - new Date(b.startDate));
        case 'participants': return direction * ((b.participantCount || b.totalVotes || 0) - (a.participantCount || a.totalVotes || 0));
        case 'participants_asc': return direction * ((a.participantCount || a.totalVotes || 0) - (b.participantCount || b.totalVotes || 0));
        case 'title': return direction * a.title.localeCompare(b.title);
        case 'title_desc': return direction * b.title.localeCompare(a.title);
        case 'category': return direction * a.category.localeCompare(b.category);
        case 'status': return direction * a.status.localeCompare(b.status);
        case 'end_date': return direction * (new Date(a.endDate) - new Date(b.endDate));
        case 'start_date': return direction * (new Date(a.startDate) - new Date(b.startDate));
        case 'relevance':
          const aScore = (a.participantCount || a.totalVotes || 0) + (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24);
          const bScore = (b.participantCount || b.totalVotes || 0) + (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24);
          return direction * (bScore - aScore);
        case 'trending':
          const aDays = Math.max(1, (new Date().getTime() - new Date(a.startDate).getTime()) / (1000 * 60 * 60 * 24));
          const bDays = Math.max(1, (new Date().getTime() - new Date(b.startDate).getTime()) / (1000 * 60 * 60 * 24));
          const aTrend = (a.participantCount || a.totalVotes || 0) / aDays;
          const bTrend = (b.participantCount || b.totalVotes || 0) / bDays;
          return direction * (bTrend - aTrend);
        case 'random': return Math.random() - 0.5;
        default: return 0;
      }
    };
    const getSecondarySort = (a, b) => {
      if (!secondarySort) return 0;
      switch (secondarySort) {
        case 'title': return a.title.localeCompare(b.title);
        case 'participants': return (b.participantCount || b.totalVotes || 0) - (a.participantCount || a.totalVotes || 0);
        case 'category': return a.category.localeCompare(b.category);
        case 'start_date': return new Date(a.startDate) - new Date(b.startDate);
        case 'end_date': return new Date(a.endDate) - new Date(b.endDate);
        default: return 0;
      }
    };
    return (a, b) => {
      const primaryResult = getPrimarySort(a, b);
      if (primaryResult !== 0) return primaryResult;
      return getSecondarySort(a, b);
    };
  };

  const filteredPolls = useMemo(() => {
    // Advanced fuzzy search using all poll fields
    const searchTokens = normalize(debouncedSearchQuery).split(/\s+/).filter(Boolean);

    return polls
      .filter(poll => {
        const creatorName = poll.createdBy?.username || poll.creator || '';
        const combinedText = `${poll.title} ${poll.category} ${poll.description} ${creatorName}`;
        const matchesSearch = !searchTokens.length || fuzzyMatch(combinedText, searchTokens);
        const matchesCreators = selectedCreators.length === 0 || selectedCreators.includes(creatorName);

        return (
          matchesSearch &&
          matchesCreators &&
          matchesStatus(poll, activeTab, selectedStatuses) &&
          matchesCategory(poll, selectedCategories) &&
          isWithinDateRange(poll, dateRange) &&
          matchesParticipantsRange(poll, participantsRange)
        );
      })
      .sort(getSortFn(sortBy, secondarySort, sortDirection));
  }, [polls, debouncedSearchQuery, activeTab, selectedCategories, selectedStatuses, dateRange, sortBy, secondarySort, sortDirection, participantsRange, selectedCreators]);

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
          status: (() => {
            const s = String(poll.status || '').toLowerCase();
            if (s === 'active' || s === 'open' || s === 'live') return 'Active';
            if (s === 'upcoming' || s === 'pending' || s === 'soon') return 'Upcoming';
            if (s === 'completed' || s === 'closed' || s === 'ended') return 'Completed';
            return 'Active';
          })(),
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
      participantsRange,
      selectedCreators
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
    setParticipantsRange(preset.participantsRange || { min: '', max: '' });
    setSelectedCreators(preset.selectedCreators || []);
  };

  const deletePreset = (name) => {
    const updated = filterPresets.filter(p => p.name !== name);
    setFilterPresets(updated);
    localStorage.setItem('pollFilterPresets', JSON.stringify(updated));
  };

  // --- PARTICIPANTS RANGE FILTER STATE ---
  const handleParticipantsRangeChange = (key, value) => {
    if (/^\d*$/.test(value)) setParticipantsRange(prev => ({ ...prev, [key]: value }));
  };
  const clearParticipantsRange = () => setParticipantsRange({ min: '', max: '' });

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



  return (
    <div className="relative min-h-screen bg-white dark:bg-black selection:bg-blue-500/30 font-sans text-gray-900 dark:text-white overflow-x-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-8xl mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-24">

        {/* Massive Header */}
        <div className="mb-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>
              <span className="h-px w-12 bg-gray-400 dark:bg-zinc-600"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-500">
                Governance
              </span>
            </div>

            <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.85] mb-8">
              DECIDE.<br />
              <span className="text-gray-400 dark:text-zinc-600">COMMIT.</span>
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-300 dark:border-zinc-800 pb-12 gap-8">
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-xl leading-relaxed">
                Participate in decentralized decision making. Your voice is cryptographically secured and immutable.
              </p>

              {/* Minimalist Tab/Filter Toggle */}
              <div className="flex bg-gray-200 dark:bg-zinc-900 p-1 rounded-full">
                {['Active', 'Upcoming', 'Completed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab
                      ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-zinc-500 hover:text-gray-900'
                      }`}
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search */}
          <div className="relative w-full md:w-96 group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search protocols..."
              aria-label="Search protocols"
              className="w-full bg-transparent border-b border-gray-400 dark:border-zinc-700 py-3 pr-10 text-lg placeholder-gray-500 focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
            />
            <MagnifyingGlass className="absolute right-0 top-3.5 w-5 h-5 text-gray-500 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2 md:pb-0">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-wide transition-colors whitespace-nowrap ${showFilters
                ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent'
                : 'border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-gray-500'
                }`}
            >
              Advanced Filters
            </button>
            {categories.slice(0, 3).map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryToggle(cat)}
                className={`px-4 py-2 rounded-full border text-xs font-mono uppercase tracking-wide transition-colors whitespace-nowrap ${selectedCategories.includes(cat)
                  ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent'
                  : 'border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:border-gray-400'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-900 rounded-full p-1 border border-gray-200 dark:border-zinc-800 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters Area */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-gray-50/50 dark:bg-zinc-900/30 rounded-2xl mb-8 border border-gray-300 dark:border-zinc-800 p-6"
            >
              {/* Filter Presets Bar */}
              <div className="mb-6 flex flex-wrap gap-2 items-center justify-between border-b border-gray-300 dark:border-zinc-800 pb-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Presets:</span>
                  {filterPresets.map(preset => (
                    <span key={preset.name} className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-800 dark:text-gray-200">
                      <button onClick={() => applyPreset(preset)} className="hover:text-blue-700 dark:hover:text-blue-400 mr-1">{preset.name}</button>
                      <button onClick={() => deletePreset(preset.name)} className="text-gray-500 hover:text-red-600 ml-1">&times;</button>
                    </span>
                  ))}
                  <button
                    onClick={() => setShowPresetDialog(true)}
                    className="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Save Current
                  </button>
                </div>
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-600 font-medium">Reset All</button>
              </div>

              {/* Preset Dialog */}
              {showPresetDialog && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="preset-dialog-title"
                >
                  <div className="bg-white dark:bg-[#1e2530] p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-zinc-700">
                    <h4 id="preset-dialog-title" className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Save Filter Preset</h4>
                    <input
                      type="text"
                      value={presetName}
                      onChange={e => setPresetName(e.target.value)}
                      placeholder="e.g. 'Tech Polls', 'My Favorites'"
                      aria-label="Preset name"
                      className="w-full px-4 py-3 mb-4 rounded-xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => setShowPresetDialog(false)} className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800">Cancel</button>
                      <button onClick={savePreset} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90">Save Preset</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Categories */}
                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
                    onClick={() => toggleFilterCard('category')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilterCard('category')}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <LayoutGrid className="w-3 h-3" /> Categories
                    </h4>
                    <CaretDown className={`w-3 h-3 transition-transform ${openFilterCards.category ? 'rotate-180' : ''}`} />
                  </div>
                  {openFilterCards.category && (
                    <div className="max-h-48 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center gap-2.5 cursor-pointer group hover:bg-white dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-zinc-600 group-hover:border-blue-400'}`}>
                            {selectedCategories.includes(cat) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={() => handleCategoryToggle(cat)} />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">{cat}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Creators */}
                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
                    onClick={() => toggleFilterCard('creators')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilterCard('creators')}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <User className="w-3 h-3" /> Creators
                    </h4>
                    <CaretDown className={`w-3 h-3 transition-transform ${openFilterCards.creators ? 'rotate-180' : ''}`} />
                  </div>
                  {openFilterCards.creators && (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      <input
                        type="text"
                        placeholder="Find creator..."
                        value={creatorSearch}
                        onChange={(e) => setCreatorSearch(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:border-blue-500 outline-none mb-2"
                      />
                      {filteredCreators.slice(0, 10).map(c => (
                        <label key={c} className="flex items-center gap-2.5 cursor-pointer group hover:bg-white dark:hover:bg-zinc-800 p-1.5 rounded-lg transition-colors">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${selectedCreators.includes(c) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-zinc-600'}`}>
                            {selectedCreators.includes(c) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <input type="checkbox" className="hidden" checked={selectedCreators.includes(c)} onChange={() => handleCreatorToggle(c)} />
                          <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white truncate">{c}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Stats & Sort */}
                <div className="space-y-6">
                  {/* Participants */}
                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
                      onClick={() => toggleFilterCard('participants')}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilterCard('participants')}
                    >
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-3 h-3" /> Participants
                      </h4>
                      <CaretDown className={`w-3 h-3 transition-transform ${openFilterCards.participants ? 'rotate-180' : ''}`} />
                    </div>
                    {openFilterCards.participants && (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Min"
                          value={participantsRange.min}
                          onChange={e => handleParticipantsRangeChange('min', e.target.value)}
                          className="w-16 px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-center"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Max"
                          value={participantsRange.max}
                          onChange={e => handleParticipantsRangeChange('max', e.target.value)}
                          className="w-16 px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-center"
                        />
                        {(participantsRange.min || participantsRange.max) && (
                          <button onClick={clearParticipantsRange} className="text-xs text-red-500 ml-1">Clear</button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sorting */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">Sort By</h4>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="participants">Most Participants</option>
                      <option value="trending">Trending Now</option>
                      <option value="relevance">Relevance</option>
                      <option value="ending_soon">Ending Soon</option>
                    </select>
                  </div>
                </div>

                {/* Status & Date */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-white">Status</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Active', 'Upcoming', 'Completed'].map(s => (
                        <button
                          key={s}
                          onClick={() => handleStatusToggle(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedStatuses.includes(s)
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-sm'
                            : 'border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:border-gray-500'
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-3">
                  <div
                    className="flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-lg p-1"
                    onClick={() => toggleFilterCard('date')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFilterCard('date')}
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> Date Range
                    </h4>
                    <CaretDown className={`w-3 h-3 transition-transform ${openFilterCards.date ? 'rotate-180' : ''}`} />
                  </div>
                  {openFilterCards.date && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label htmlFor="date-start" className="text-[10px] uppercase font-bold text-gray-500">From</label>
                          <input
                            id="date-start"
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className={`w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border ${dateValidation.startError ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'} focus:border-blue-500 outline-none`}
                            aria-label="Start Date"
                          />
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="date-end" className="text-[10px] uppercase font-bold text-gray-500">To</label>
                          <input
                            id="date-end"
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className={`w-full px-2 py-1.5 text-xs rounded-lg bg-white dark:bg-zinc-800 border ${dateValidation.endError ? 'border-red-500' : 'border-gray-200 dark:border-zinc-700'} focus:border-blue-500 outline-none`}
                            aria-label="End Date"
                          />
                        </div>
                      </div>
                      {(dateValidation.startError || dateValidation.endError) && (
                        <p className="text-[10px] text-red-500">
                          {dateValidation.startError || dateValidation.endError}
                        </p>
                      )}
                      {(dateRange.start || dateRange.end) && (
                        <button
                          onClick={() => setDateRange({ start: '', end: '' })}
                          className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                          Clear Dates
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Polls Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          </div>
        ) : filteredPolls.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredPolls.map((poll, idx) => (
                <PollCard
                  key={poll.id || poll._id || idx}
                  poll={poll}
                  index={idx}
                  handlePollClick={handlePollClick}
                  userVotes={userVotes}
                  handleViewResults={handleViewResults}
                  handleSetReminder={handleSetReminder}
                  handlePollFavorite={handlePollFavorite}
                  favorites={favorites}
                  favoriteLoading={favoriteLoading}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredPolls.map((poll, idx) => (
                <PollListItem
                  key={poll.id || poll._id || idx}
                  poll={poll}
                  index={idx}
                  handlePollClick={handlePollClick}
                  userVotes={userVotes}
                  handleViewResults={handleViewResults}
                  handleSetReminder={handleSetReminder}
                  handlePollFavorite={handlePollFavorite}
                  favorites={favorites}
                  favoriteLoading={favoriteLoading}
                />
              ))}
            </div>
          )
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-24 h-24 mb-6 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-full flex items-center justify-center">
              <MagnifyingGlass className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No polls found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {polls.length > 0 && activeTab !== 'All'
                ? `You have ${polls.length} polls, but none match the "${activeTab}" status. Try switching tabs.`
                : "Try adjusting your filters or search query."}
            </p>

            {polls.length > 0 && activeTab !== 'All' && (
              <div className="flex gap-2 mt-4">
                {['Active', 'Upcoming', 'Completed'].filter(t => t !== activeTab).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="px-4 py-2 rounded-full bg-gray-100 dark:bg-zinc-800 text-xs font-bold uppercase tracking-wider hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    View {tab}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div >
  );
};

export default AvailablePolls;
