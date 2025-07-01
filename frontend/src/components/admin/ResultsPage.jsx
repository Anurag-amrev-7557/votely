import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import format from 'date-fns/format';
import toast from 'react-hot-toast';
import { CSVLink } from 'react-csv';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ResultsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [timeRange, setTimeRange] = useState('week');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [stats, setStats] = useState({
    totalVotes: 0,
    activePolls: 0,
    completedPolls: 0,
    averageParticipation: 0,
    totalParticipants: 0,
    voterDemographics: {
      ageGroups: [],
      locations: [],
      devices: []
    },
    votingTrends: {
      hourly: [],
      daily: [],
      weekly: []
    }
  });

  // Sample data - replace with actual API calls
  const polls = [
    {
      id: 1,
      title: 'Employee Satisfaction Survey',
      status: 'active',
      totalVotes: 156,
      participation: 78,
      createdAt: '2024-03-15',
      endDate: '2024-03-22',
      options: [
        { label: 'Very Satisfied', votes: 45, percentage: 28.8 },
        { label: 'Satisfied', votes: 68, percentage: 43.6 },
        { label: 'Neutral', votes: 25, percentage: 16.0 },
        { label: 'Dissatisfied', votes: 12, percentage: 7.7 },
        { label: 'Very Dissatisfied', votes: 6, percentage: 3.9 },
      ],
      demographics: {
        ageGroups: [
          { range: '18-24', count: 25 },
          { range: '25-34', count: 45 },
          { range: '35-44', count: 38 },
          { range: '45-54', count: 28 },
          { range: '55+', count: 20 }
        ],
        locations: [
          { city: 'New York', count: 45 },
          { city: 'Los Angeles', count: 38 },
          { city: 'Chicago', count: 25 },
          { city: 'Houston', count: 20 },
          { city: 'Others', count: 28 }
        ],
        devices: [
          { type: 'Mobile', count: 85 },
          { type: 'Desktop', count: 45 },
          { type: 'Tablet', count: 26 }
        ]
      },
      votingTrends: {
        hourly: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          votes: Math.floor(Math.random() * 20)
        })),
        daily: Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          votes: Math.floor(Math.random() * 50)
        }))
      }
    },
    // Add more sample polls...
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const styles = {
    container: `min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`,
    header: `bg-transparent border-b border-gray-200 dark:border-gray-700`,
    headerContent: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6`,
    title: `text-2xl font-bold text-gray-900 dark:text-white`,
    description: `mt-1 text-sm text-gray-500 dark:text-gray-400`,
    main: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8`,
    card: `bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
      transition-all duration-200 hover:shadow-md`,
    statCard: `p-6 flex flex-col`,
    statValue: `text-3xl font-bold text-gray-900 dark:text-white`,
    statLabel: `mt-1 text-sm text-gray-500 dark:text-gray-400`,
    filterButton: `inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 
      rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 
      bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
      transition-all duration-200`,
    pollCard: `p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 
      transition-colors duration-200`,
    progressBar: `h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden`,
    progressFill: `h-full rounded-full transition-all duration-500`,
    chartContainer: `h-64 mt-4`,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 70) return 'bg-green-500';
    if (percentage >= 40) return 'bg-blue-500';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#fff' : '#374151',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#fff',
        titleColor: isDarkMode ? '#fff' : '#374151',
        bodyColor: isDarkMode ? '#fff' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#374151'
        }
      },
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDarkMode ? '#fff' : '#374151'
        }
      }
    }
  };

  const renderDemographicsCharts = (poll) => {
    const ageData = {
      labels: poll.demographics.ageGroups.map(g => g.range),
      datasets: [{
        label: 'Voters by Age',
        data: poll.demographics.ageGroups.map(g => g.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ],
        borderColor: isDarkMode ? '#1f2937' : '#fff',
        borderWidth: 1
      }]
    };

    const locationData = {
      labels: poll.demographics.locations.map(l => l.city),
      datasets: [{
        label: 'Voters by Location',
        data: poll.demographics.locations.map(l => l.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: isDarkMode ? '#1f2937' : '#fff',
        borderWidth: 1
      }]
    };

    const deviceData = {
      labels: poll.demographics.devices.map(d => d.type),
      datasets: [{
        label: 'Voters by Device',
        data: poll.demographics.devices.map(d => d.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ],
        borderColor: isDarkMode ? '#1f2937' : '#fff',
        borderWidth: 1
      }]
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className={styles.card}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Age Distribution</h4>
          <div className={styles.chartContainer}>
            <Pie data={ageData} options={chartOptions} />
          </div>
        </div>
        <div className={styles.card}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Geographic Distribution</h4>
          <div className={styles.chartContainer}>
            <Bar data={locationData} options={chartOptions} />
          </div>
        </div>
        <div className={styles.card}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Device Usage</h4>
          <div className={styles.chartContainer}>
            <Pie data={deviceData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  const renderVotingTrends = (poll) => {
    const hourlyData = {
      labels: poll.votingTrends.hourly.map(h => `${h.hour}:00`),
      datasets: [{
        label: 'Votes per Hour',
        data: poll.votingTrends.hourly.map(h => h.votes),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4
      }]
    };

    const dailyData = {
      labels: poll.votingTrends.daily.map(d => d.day),
      datasets: [{
        label: 'Votes per Day',
        data: poll.votingTrends.daily.map(d => d.votes),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: isDarkMode ? '#1f2937' : '#fff',
        borderWidth: 1
      }]
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className={styles.card}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hourly Voting Pattern</h4>
          <div className={styles.chartContainer}>
            <Line data={hourlyData} options={chartOptions} />
          </div>
        </div>
        <div className={styles.card}>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Daily Voting Pattern</h4>
          <div className={styles.chartContainer}>
            <Bar data={dailyData} options={chartOptions} />
          </div>
        </div>
      </div>
    );
  };

  const renderResultCard = (poll, index) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const leadingOption = poll.options.reduce((prev, current) => 
      (prev.percentage > current.percentage) ? prev : current
    );

    // Accent color for status
    const statusAccent = poll.status === 'active' ? 'bg-green-500' : poll.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400';

    if (viewMode === 'list') {
      // List view: horizontal, full-width, minimal shadow, compact
      return (
        <motion.div
          key={poll.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-stretch px-4 py-4 md:py-6 md:px-8 group"
          style={{ boxShadow: 'none', borderRadius: 0 }}
        >
          {/* Left: Title & Stats */}
          <div className="flex-1 flex flex-col justify-center md:pr-8">
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm ${getStatusColor(poll.status)}`}>{poll.status}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{poll.title}</h3>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>{format(new Date(poll.createdAt), 'MMM d, yyyy')}</span>
              <span>{format(new Date(poll.endDate), 'MMM d, yyyy')}</span>
              <span className="font-semibold text-gray-900 dark:text-white">{totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">Participation: <span className="font-bold text-gray-900 dark:text-white">{poll.participation}%</span></span>
              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">Leading: <span className="font-bold text-gray-900 dark:text-white">{leadingOption.label}</span></span>
              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Lead Margin: <span className="font-bold text-gray-900 dark:text-white">{leadingOption.percentage}%</span></span>
            </div>
          </div>
          {/* Right: Results Preview & Actions */}
          <div className="flex flex-col justify-between md:w-2/5 mt-4 md:mt-0">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Results</span>
                <button onClick={() => setSelectedPoll(poll)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View Details</button>
              </div>
              <div className="space-y-1">
                {poll.options.slice(0, 2).map((option, optionIndex) => (
                  <div key={optionIndex} className="flex items-center">
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[80px]">{option.label}</span>
                    <div className="flex-1 mx-2">
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${option.percentage}%` }} transition={{ duration: 1, delay: 0.5 + optionIndex * 0.1 }} className={`${styles.progressFill} ${getProgressColor(option.percentage)} h-full rounded-full`} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">{option.percentage}%</span>
                  </div>
                ))}
                {poll.options.length > 2 && (
                  <button onClick={() => setSelectedPoll(poll)} className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-center py-0.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors duration-200">+{poll.options.length - 2} more</button>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-3 justify-end">
              <button onClick={() => setSelectedPoll(poll)} className="px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 rounded transition-all duration-200">View Details</button>
              <button onClick={() => { const shareUrl = `${window.location.origin}/polls/${poll.id}`; navigator.clipboard.writeText(shareUrl); toast.success('Poll link copied to clipboard!'); }} className="px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded transition-all duration-200">Share</button>
            </div>
          </div>
        </motion.div>
      );
    }

    // Card view (grid) - modern card design
    return (
      <motion.div
        key={poll.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`group relative overflow-hidden shadow-lg bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 min-w-[340px] max-w-[400px] mx-auto flex flex-col transition-all duration-300 hover:shadow-2xl`}
        style={{ padding: 0 }}
      >
        {/* Status Accent Bar */}
        <div className={`absolute top-0 left-0 w-full h-2 ${statusAccent} rounded-t-2xl`} />
        {/* Status Badge - moved to top-left, above title */}
        <div className="px-7 pt-7 pb-1 flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-sm ${getStatusColor(poll.status)}`}>{poll.status}</span>
        </div>
        {/* Header Section */}
        <div className="px-7 pt-2 pb-5 bg-gradient-to-r from-white to-blue-50 dark:from-gray-900 dark:to-blue-900/10 rounded-t-2xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 tracking-tight">{poll.title}</h3>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{format(new Date(poll.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>{format(new Date(poll.endDate), 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>
            <div className="text-right min-w-[70px] flex flex-col items-end justify-center">
              <div className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{totalVotes}</div>
              <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">Total Votes</div>
            </div>
          </div>
        </div>
        {/* Stats Section */}
        <div className="px-7 py-4 bg-white dark:bg-gray-900 flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex-1 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Participation</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{poll.participation}%</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex-1 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Leading</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{leadingOption.label}</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex-1 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 whitespace-nowrap">Lead Margin</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{leadingOption.percentage}%</div>
          </div>
        </div>
        {/* Results Preview */}
        <div className="px-7 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">Results Preview</h4>
            <button onClick={() => setSelectedPoll(poll)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">View Details</button>
          </div>
          <div className="space-y-2">
            {poll.options.slice(0, 3).map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{option.label}</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">{option.percentage}%</span>
                  </div>
                  <div className={`${styles.progressBar} h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700`}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${option.percentage}%` }} transition={{ duration: 1, delay: 0.5 + optionIndex * 0.1 }} className={`${styles.progressFill} ${getProgressColor(option.percentage)} h-full rounded-full`} />
                  </div>
                </div>
              </div>
            ))}
            {poll.options.length > 3 && (
              <button onClick={() => setSelectedPoll(poll)} className="w-full text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-center py-1 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors duration-200">+{poll.options.length - 3} more options</button>
            )}
          </div>
        </div>
        {/* Demographics Preview */}
        <div className="px-7 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">Demographics Preview</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl text-center py-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics.devices[0].type}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics.devices[0].count}%</div>
            </div>
            <div className="rounded-xl text-center py-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics.ageGroups[1].range}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics.ageGroups[1].count}%</div>
            </div>
            <div className="rounded-xl text-center py-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics.locations[0].city}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics.locations[0].count}%</div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="px-7 py-4 flex justify-end gap-3 bg-white dark:bg-gray-900 rounded-b-2xl">
          <button onClick={() => setSelectedPoll(poll)} className="px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> View Details
          </button>
          <button onClick={() => { const shareUrl = `${window.location.origin}/polls/${poll.id}`; navigator.clipboard.writeText(shareUrl); toast.success('Poll link copied to clipboard!'); }} className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg> Share
          </button>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={styles.title}>Poll Results</h1>
              <p className={styles.description}>
                View and analyze poll results and participation statistics
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={styles.filterButton}
              >
                <svg className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                </svg>
                Filters
              </button>
              <CSVLink
                data={polls.map(poll => ({
                  title: poll.title,
                  status: poll.status,
                  totalVotes: poll.totalVotes,
                  participation: `${poll.participation}%`,
                  createdAt: format(new Date(poll.createdAt), 'yyyy-MM-dd'),
                  endDate: format(new Date(poll.endDate), 'yyyy-MM-dd'),
                }))}
                headers={[
                  { label: "Poll Title", key: "title" },
                  { label: "Status", key: "status" },
                  { label: "Total Votes", key: "totalVotes" },
                  { label: "Participation", key: "participation" },
                  { label: "Created At", key: "createdAt" },
                  { label: "End Date", key: "endDate" },
                ]}
                filename={`poll-results-${format(new Date(), 'yyyy-MM-dd')}.csv`}
                className={styles.filterButton}
              >
                <svg className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 00-1.414-1.414L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 101.414 1.414l-3 3a1 1 0 00-1.414 0l-3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
                Export CSV
              </CSVLink>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={styles.card}
          >
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.totalVotes}</span>
              <span className={styles.statLabel}>Total Votes</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.card}
          >
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.activePolls}</span>
              <span className={styles.statLabel}>Active Polls</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.card}
          >
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.completedPolls}</span>
              <span className={styles.statLabel}>Completed Polls</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.card}
          >
            <div className={styles.statCard}>
              <span className={styles.statValue}>{stats.averageParticipation}%</span>
              <span className={styles.statLabel}>Average Participation</span>
            </div>
          </motion.div>
        </div>

        {/* Polls List/Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
          {polls.map((poll, index) => renderResultCard(poll, index))}
        </div>
      </main>

      {/* Poll Detail Modal */}
      <AnimatePresence>
        {selectedPoll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedPoll.title}
                </h3>
                <button
                  onClick={() => setSelectedPoll(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Poll Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <div className="mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPoll.status)}`}>
                        {selectedPoll.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Votes</div>
                    <div className="mt-1 text-lg font-medium text-gray-900 dark:text-white">
                      {selectedPoll.totalVotes}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                    <div className="mt-1 text-gray-900 dark:text-white">
                      {format(new Date(selectedPoll.createdAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">End Date</div>
                    <div className="mt-1 text-gray-900 dark:text-white">
                      {format(new Date(selectedPoll.endDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>

                {/* Results Chart */}
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Results
                  </h4>
                  <div className="space-y-4">
                    {selectedPoll.options.map((option, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {option.votes} votes ({option.percentage}%)
                          </span>
                        </div>
                        <div className={styles.progressBar}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${option.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className={`${styles.progressFill} ${getProgressColor(option.percentage)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Demographics */}
                {renderDemographicsCharts(selectedPoll)}

                {/* Voting Trends */}
                {renderVotingTrends(selectedPoll)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage; 