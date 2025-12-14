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
import axios from '../../utils/api/axiosConfig';

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
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pollResults, setPollResults] = useState(null);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [resultsError, setResultsError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/polls');
        // Defensive: handle both array and object response
        setPolls(Array.isArray(response.data) ? response.data : (response.data.polls || []));
        setError(null);
      } catch (err) {
        setError('Failed to load polls');
        setPolls([]); // Ensure polls is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedPoll && selectedPoll.id) {
      setResultsLoading(true);
      setResultsError(null);
      setPollResults(null);
      axios.get(`/api/polls/${selectedPoll.id}/results`)
        .then(res => {
          setPollResults(res.data);
          setResultsLoading(false);
        })
        .catch(err => {
          setResultsError('Failed to load poll results');
          setResultsLoading(false);
          toast.error('Failed to load poll results');
        });
    }
  }, [selectedPoll]);

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
      labels: (poll.demographics?.ageGroups ?? []).map(g => g.range),
      datasets: [{
        label: 'Voters by Age',
        data: (poll.demographics?.ageGroups ?? []).map(g => g.count),
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
      labels: (poll.demographics?.locations ?? []).map(l => l.city),
      datasets: [{
        label: 'Voters by Location',
        data: (poll.demographics?.locations ?? []).map(l => l.count),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: isDarkMode ? '#1f2937' : '#fff',
        borderWidth: 1
      }]
    };

    const deviceData = {
      labels: (poll.demographics?.devices ?? []).map(d => d.type),
      datasets: [{
        label: 'Voters by Device',
        data: (poll.demographics?.devices ?? []).map(d => d.count),
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
      labels: (poll.votingTrends?.hourly ?? []).map(h => `${h.hour}:00`),
      datasets: [{
        label: 'Votes per Hour',
        data: (poll.votingTrends?.hourly ?? []).map(h => h.votes),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: 'rgba(59, 130, 246, 1)',
        tension: 0.4
      }]
    };

    const dailyData = {
      labels: (poll.votingTrends?.daily ?? []).map(d => d.day),
      datasets: [{
        label: 'Votes per Day',
        data: (poll.votingTrends?.daily ?? []).map(d => d.votes),
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
    // Use the totalVotes from the backend response, not calculate from options
    const totalVotes = poll.totalVotes || 0;
    // For the leading option, we need to get the results to determine this
    // For now, just use the first option as placeholder
    const leadingOption = poll.options && poll.options.length > 0 ? poll.options[0] : { label: 'N/A', percentage: 0 };

    // Accent color for status
    const statusAccent = poll.status === 'active' ? 'bg-green-500' : poll.status === 'completed' ? 'bg-blue-500' : 'bg-gray-400';

    if (viewMode === 'list') {
      // List view: horizontal, full-width, minimal shadow, compact
      return (
        <motion.div
          key={poll.id || poll._id || index}
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
              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">Total Votes: <span className="font-bold text-gray-900 dark:text-white">{totalVotes}</span></span>
              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">Status: <span className="font-bold text-gray-900 dark:text-white">{poll.status}</span></span>
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
                  <div key={option.id || option.label || optionIndex} className="flex items-center">
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[80px]">{option.text}</span>
                    <div className="flex-1 mx-2">
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                        <div className="h-full rounded-full bg-gray-300 dark:bg-gray-600" style={{ width: '50%' }} />
                      </div>
                    </div>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">--</span>
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
        key={poll.id || poll._id || index}
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
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Total Votes</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{totalVotes}</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex-1 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Status</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{poll.status}</div>
          </div>
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-800 mx-2" />
          <div className="flex-1 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 whitespace-nowrap">Options</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">{poll.options?.length || 0}</div>
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
              <div key={option.id || option.label || optionIndex} className="flex items-center group">
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{option.text}</span>
                    <span className="font-medium text-gray-900 dark:text-white ml-2">
                      {option.count !== undefined ? `${option.count} votes` : '--'}
                      {option.percent !== undefined ? ` (${option.percent}%)` : ''}
                    </span>
                  </div>
                  <div className={`${styles.progressBar} h-2.5 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700`} title={option.count !== undefined ? `${option.count} votes (${option.percent || 0}%)` : 'No data'}>
                    <div className="h-full rounded-full bg-blue-500 group-hover:bg-blue-600 transition-all duration-300" style={{ width: `${option.percent || 0}%` }} />
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
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics?.devices?.[0]?.type || 'N/A'}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics?.devices?.[0]?.count ?? 0}%</div>
            </div>
            <div className="rounded-xl text-center py-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics?.ageGroups?.[1]?.range || 'N/A'}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics?.ageGroups?.[1]?.count ?? 0}%</div>
            </div>
            <div className="rounded-xl text-center py-3 bg-gray-50 dark:bg-gray-800 flex flex-col items-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-0.5 font-medium tracking-wide">{poll.demographics?.locations?.[0]?.city || 'N/A'}</div>
              <div className="text-xl font-extrabold text-gray-900 dark:text-white">{poll.demographics?.locations?.[0]?.count ?? 0}%</div>
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
    <div role="main" aria-label="Admin results management" tabIndex={0}>
      <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-600 text-white px-4 py-2 rounded z-50">Skip to main content</a>
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
                  className={`p-2 rounded-lg ${viewMode === 'grid'
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
                  className={`p-2 rounded-lg ${viewMode === 'list'
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
                data={Array.isArray(polls) ? polls.map(poll => ({
                  title: poll.title,
                  status: poll.status,
                  totalVotes: poll.totalVotes,
                  participation: `${poll.participation}%`,
                  createdAt: format(new Date(poll.createdAt), 'yyyy-MM-dd'),
                  endDate: format(new Date(poll.endDate), 'yyyy-MM-dd'),
                })) : []}
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
      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        {/* Stats Overview */}
        <section role="region" aria-labelledby="admin-results-overview-heading" tabIndex={0}>
          <h2 id="admin-results-overview-heading" className="sr-only">Results Overview</h2>
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
        </section>

        {/* Polls List/Grid */}
        <section role="region" aria-labelledby="admin-poll-results-heading" tabIndex={0}>
          <h2 id="admin-poll-results-heading" className="sr-only">Poll Results</h2>
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
            {Array.isArray(polls) && polls.map((poll, index) => (
              <React.Fragment key={poll.id || poll._id || index}>
                {renderResultCard(poll, index)}
              </React.Fragment>
            ))}
          </div>
        </section>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2m-4-4a4 4 0 100-8 4 4 0 000 8z" /></svg>
                  {selectedPoll.title}
                </h3>
                <button
                  onClick={() => setSelectedPoll(null)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  aria-label="Close poll details"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Enhanced Poll Summary */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.755 6.879 2.047M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300" title="Poll Creator">{selectedPoll.creatorName || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300" title="Duration">{format(new Date(selectedPoll.createdAt), 'MMM d, yyyy')} - {format(new Date(selectedPoll.endDate), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m4 0h-1V8h-1m-4 0h-1v4H7m4 0h-1v4h-1" /></svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300" title="Participation Rate">{selectedPoll.participation ? `${selectedPoll.participation}%` : '--'}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300" title="Status">{selectedPoll.status}</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 md:col-span-1">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="text-sm text-gray-700 dark:text-gray-300" title="Options Count">{selectedPoll.options?.length || 0} options</span>
                </div>
              </div>

              {/* Poll Description */}
              {selectedPoll.description && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-900 dark:text-blue-200 text-sm">
                  <strong>Description:</strong> {selectedPoll.description}
                </div>
              )}

              {/* Top Voted Option */}
              {pollResults && pollResults.options && pollResults.options.length > 0 && (
                <div className="mb-6 flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="font-semibold text-green-700 dark:text-green-300">Top Voted Option:</span>
                  <span className="text-gray-900 dark:text-white font-medium">{pollResults.options.reduce((a, b) => (a.count > b.count ? a : b)).text}</span>
                  <span className="text-gray-500 dark:text-gray-400">({pollResults.options.reduce((a, b) => (a.count > b.count ? a : b)).count} votes)</span>
                </div>
              )}

              {/* Results Chart */}
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Results
                </h4>
                {resultsLoading ? (
                  <div aria-live="polite" role="status">Loading poll results...</div>
                ) : resultsError ? (
                  <div className="py-8 text-center text-red-500 dark:text-red-400">{resultsError}</div>
                ) : pollResults && (
                  <>
                    {selectedPoll.settings?.voterNameDisplay === 'anonymized' && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-yellow-800 dark:text-yellow-200 text-sm">
                        <strong>This poll is anonymized.</strong> Voter identities are hidden for privacy.
                      </div>
                    )}
                    <div className="space-y-4">
                      {pollResults.options.map((option, index) => {
                        // Use the count and percent from backend response
                        const voteCount = option.count || 0;
                        const percentage = option.percent || 0;
                        return (
                          <div key={option.id || option.label || index}>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-300">{option.text}</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {voteCount} votes ({percentage}%)
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Participation Rate */}
                    <div className="mt-6">
                      <h5 className="text-md font-semibold mb-2">Participation Rate</h5>
                      <div className="text-lg font-bold">
                        {/* If you have total eligible voters, use it here. For now, just show total votes. */}
                        {pollResults.totalVotes} total votes
                      </div>
                    </div>
                    {/* Option Votes Bar Chart */}
                    <div className="mt-6">
                      <h5 className="text-md font-semibold mb-2">Votes by Option</h5>
                      <Bar
                        data={{
                          labels: pollResults.options.map(opt => opt.text),
                          datasets: [{
                            label: 'Votes',
                            data: pollResults.options.map(opt => opt.count || 0),
                            backgroundColor: 'rgba(59, 130, 246, 0.8)'
                          }]
                        }}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: { y: { beginAtZero: true } }
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Demographics */}
              {renderDemographicsCharts(selectedPoll)}

              {/* Voting Trends */}
              {renderVotingTrends(selectedPoll)}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResultsPage; 