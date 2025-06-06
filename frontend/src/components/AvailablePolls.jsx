import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, Bell, CaretDown, X } from './icons';
import { useTheme } from '../context/ThemeContext';

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

  const categories = useMemo(() => {
    return [...new Set(polls.map(poll => poll.category))];
  }, [polls]);

  const filteredPolls = useMemo(() => {
    return polls
      .filter(poll => {
        const matchesSearch = searchQuery === '' || 
          poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poll.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          poll.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = poll.status === activeTab;
        
        const matchesCategory = selectedCategories.length === 0 || 
          selectedCategories.includes(poll.category);
        
        const matchesDateRange = (!dateRange.start || new Date(poll.startDate) >= new Date(dateRange.start)) &&
          (!dateRange.end || new Date(poll.endDate) <= new Date(dateRange.end));
        
        return matchesSearch && matchesStatus && matchesCategory && matchesDateRange;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.startDate) - new Date(a.startDate);
          case 'oldest':
            return new Date(a.startDate) - new Date(b.startDate);
          case 'participants':
            return b.participants - a.participants;
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [polls, searchQuery, activeTab, selectedCategories, dateRange, sortBy]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setDateRange({ start: '', end: '' });
    setSortBy('newest');
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white dark:bg-[#15191e] dark:group/design-root overflow-x-hidden transition-colors duration-200" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-4 sm:py-5 mt-16 sm:mt-10">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mt-2 sm:mt-5">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:gap-6 p-3 sm:p-4 mb-6 sm:mb-8">
              {/* Title and Description */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                <h1 className="text-gray-900 dark:text-white text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">Available Polls</h1>
                <p className="text-gray-600 dark:text-[#a0acbb] text-sm sm:text-base font-normal leading-relaxed">
                  Browse and participate in current polls. Your vote matters!
                </p>
              </div>

              {/* Search and Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full sm:max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search polls..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-9 sm:h-10 pl-9 sm:pl-10 pr-9 sm:pr-10 rounded-lg border border-gray-200 dark:border-[#2c353f] bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-[#a0acbb] focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#c7d7e9] transition-all duration-200 text-sm sm:text-base"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MagnifyingGlass className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-[#a0acbb]" />
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-[#a0acbb] hover:text-gray-600 dark:hover:text-white"
                      >
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-[#2c353f] text-gray-700 dark:text-[#a0acbb] hover:bg-gray-50 dark:hover:bg-[#2c353f] transition-colors duration-200 text-sm"
                  >
                    <span>Filters</span>
                    <CaretDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                  <button
                    onClick={handleNotificationClick}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2c353f] transition-colors duration-200"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 dark:text-[#a0acbb]" />
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="p-4 sm:p-6 mb-6 bg-white dark:bg-[#1e242c] rounded-xl border border-gray-200 dark:border-[#2c353f] shadow-sm">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-gray-900 dark:text-white text-base sm:text-lg font-semibold">Advanced Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 dark:text-[#c7d7e9] hover:underline"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {/* Categories */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2 min-h-[60px] sm:min-h-[80px]">
                      {categories.map(category => (
                        <button
                          key={`category-${category}`}
                          onClick={() => handleCategoryToggle(category)}
                          className={`inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors duration-200 ${
                            selectedCategories.includes(category)
                              ? 'bg-blue-600 dark:bg-[#c7d7e9] text-white dark:text-[#15191e]'
                              : 'bg-gray-100 dark:bg-[#2c353f] text-gray-700 dark:text-[#a0acbb] hover:bg-gray-200 dark:hover:bg-[#3f4c5a]'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                      Date Range
                    </label>
                    <div className="grid grid-cols-2 gap-3 min-h-[60px] sm:min-h-[80px]">
                      <div className="space-y-1 sm:space-y-1.5">
                        <label className="block text-xs text-gray-500 dark:text-[#a0acbb]">Start Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-[#2c353f] bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#c7d7e9] text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-1 sm:space-y-1.5">
                        <label className="block text-xs text-gray-500 dark:text-[#a0acbb]">End Date</label>
                        <div className="relative">
                          <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-[#2c353f] bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#c7d7e9] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#a0acbb]">
                      Sort By
                    </label>
                    <div className="relative min-h-[60px] sm:min-h-[80px]">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 dark:border-[#2c353f] bg-white dark:bg-[#1e242c] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-[#c7d7e9] appearance-none text-sm"
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="participants">Most Participants</option>
                        <option value="title">Title (A-Z)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <CaretDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 dark:text-[#a0acbb]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters */}
                {(selectedCategories.length > 0 || dateRange.start || dateRange.end) && (
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-[#2c353f]">
                    <div className="flex flex-wrap gap-2">
                      {selectedCategories.map(category => (
                        <div
                          key={`filter-${category}`}
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs sm:text-sm"
                        >
                          <span>{category}</span>
                          <button
                            onClick={() => handleCategoryToggle(category)}
                            className="hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      ))}
                      {dateRange.start && (
                        <div
                          key="date-start"
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs sm:text-sm"
                        >
                          <span>From: {new Date(dateRange.start).toLocaleDateString()}</span>
                          <button
                            onClick={() => setDateRange(prev => ({ ...prev, start: '' }))}
                            className="hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                      {dateRange.end && (
                        <div
                          key="date-end"
                          className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs sm:text-sm"
                        >
                          <span>To: {new Date(dateRange.end).toLocaleDateString()}</span>
                          <button
                            onClick={() => setDateRange(prev => ({ ...prev, end: '' }))}
                            className="hover:text-blue-900 dark:hover:text-blue-300"
                          >
                            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-[#2c353f]">
              <div className="flex space-x-6 sm:space-x-8">
                {['Active', 'Upcoming', 'Past'].map((tab) => (
                  <button
                    key={`tab-${tab}`}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors duration-200 ${
                      activeTab === tab
                        ? 'border-blue-600 dark:border-[#c7d7e9] text-blue-600 dark:text-[#c7d7e9]'
                        : 'border-transparent text-gray-500 dark:text-[#a0acbb] hover:text-gray-700 dark:hover:text-[#c7d7e9]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-600 dark:text-[#a0acbb] mb-4 sm:mb-6">
              {filteredPolls.length} {filteredPolls.length === 1 ? 'poll' : 'polls'} found
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                {
                  label: 'Active Polls',
                  value: '1.2K+',
                  icon: (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  ),
                  bgColor: 'bg-blue-100 dark:bg-blue-900/30'
                },
                {
                  label: 'Votes Cast',
                  value: '50K+',
                  icon: (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  bgColor: 'bg-green-100 dark:bg-green-900/30'
                },
                {
                  label: 'Satisfaction',
                  value: '98%',
                  icon: (
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                  bgColor: 'bg-purple-100 dark:bg-purple-900/30'
                }
              ].map((stat, index) => (
                <div key={`stat-${index}`} className="bg-white dark:bg-[#1e242c] rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-[#2c353f]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-[#a0acbb]">{stat.label}</p>
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                      {stat.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Sort Options */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              {[
                { label: 'Newest', value: 'newest' },
                { label: 'Most Popular', value: 'participants' }
              ].map((option) => (
                <button
                  key={`sort-${option.value}`}
                  onClick={() => setSortBy(option.value)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 ${
                    sortBy === option.value
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      : 'text-gray-600 dark:text-[#a0acbb] hover:bg-gray-100 dark:hover:bg-[#2c353f]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {/* Polls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredPolls.map(poll => (
                <div
                  key={poll.id}
                  className="group bg-white dark:bg-[#1e242c] rounded-xl border border-gray-200 dark:border-[#2c353f] overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Poll Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={poll.image}
                      alt={poll.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <span className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                        poll.status === 'Active' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                          : poll.status === 'Upcoming'
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400'
                      }`}>
                        {poll.status}
                      </span>
                    </div>
                  </div>

                  {/* Poll Content */}
                  <div className="p-4 sm:p-6">
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

                    {/* Poll Stats */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-xs text-gray-500 dark:text-[#a0acbb]">Start Date</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(poll.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="space-y-0.5 sm:space-y-1">
                        <p className="text-xs text-gray-500 dark:text-[#a0acbb]">End Date</p>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(poll.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

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
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          {Math.floor(Math.random() * 24)} hours left
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(`/vote/${poll.id}`)}
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
              ))}
            </div>

            {/* Empty State */}
            {filteredPolls.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-[#a0acbb]">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1.5 sm:mb-2">No polls found</h3>
                <p className="text-sm text-gray-600 dark:text-[#a0acbb]">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailablePolls; 