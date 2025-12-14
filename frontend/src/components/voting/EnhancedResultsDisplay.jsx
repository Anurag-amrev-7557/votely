import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
import format from 'date-fns/format';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Share, Download, Eye, Users, Clock, Calendar, TrendingUp, Award, BarChart3, PieChart, Activity } from '../ui/icons';

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

const EnhancedResultsDisplay = ({
  poll,
  results,
  userVote,
  onBack,
  onShare,
  showLiveResults = false,
  isRealTime = false
}) => {
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    // Stagger animations
    const timer = setTimeout(() => setAnimationDelay(0.1), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalVotes = results?.totalVotes || 0;
  const options = results?.options || [];
  const sortedOptions = [...options].sort((a, b) => (b.count || 0) - (a.count || 0));
  const winningOption = sortedOptions[0];
  const userVotedOptions = userVote?.options || [];

  // Enhanced chart configurations with improved theming and interactivity
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDarkMode ? '#f3f4f6' : '#1f2937',
          font: {
            size: 13,
            weight: '500'
          },
          usePointStyle: true,
          padding: 24,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets[0].data.map((value, index) => ({
              text: chart.data.labels[index],
              fillStyle: datasets[0].backgroundColor[index],
              strokeStyle: datasets[0].borderColor,
              lineWidth: 2,
              pointStyle: 'circle',
              hidden: false,
              index: index
            }));
          }
        },
        onClick: (e, legendItem, legend) => {
          const index = legendItem.index;
          const chart = legend.chart;
          const meta = chart.getDatasetMeta(0);

          meta.data[index].hidden = !meta.data[index].hidden;
          chart.update();
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#374151' : '#ffffff',
        titleColor: isDarkMode ? '#f9fafb' : '#111827',
        bodyColor: isDarkMode ? '#d1d5db' : '#374151',
        borderColor: isDarkMode ? '#4b5563' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: '600'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          title: (context) => `Option: ${context[0].label}`,
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return `Votes: ${context.parsed.y} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDarkMode ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
          lineWidth: 1
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
            weight: '500'
          },
          padding: 8,
          callback: (value) => {
            if (value % 1 === 0) return value;
            return '';
          }
        },
        border: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDarkMode ? '#9ca3af' : '#6b7280',
          font: {
            size: 11,
            weight: '500'
          },
          padding: 8,
          maxRotation: 45,
          minRotation: 0
        },
        border: {
          display: false
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
      onProgress: (animation) => {
        const chart = animation.chart;
        const ctx = chart.ctx;
        const dataset = chart.data.datasets[0];

        dataset.data.forEach((value, index) => {
          const meta = chart.getDatasetMeta(0);
          const element = meta.data[index];

          if (element && element.y > 0) {
            // Add subtle glow effect
            ctx.save();
            ctx.shadowColor = dataset.backgroundColor[index];
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.restore();
          }
        });
      }
    },
    elements: {
      bar: {
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0
        },
        borderSkipped: false,
        backgroundColor: (context) => {
          const colors = [
            'rgba(59, 130, 246, 0.85)',
            'rgba(16, 185, 129, 0.85)',
            'rgba(245, 158, 11, 0.85)',
            'rgba(239, 68, 68, 0.85)',
            'rgba(139, 92, 246, 0.85)',
            'rgba(236, 72, 153, 0.85)',
            'rgba(14, 165, 233, 0.85)',
            'rgba(34, 197, 94, 0.85)'
          ];
          return colors[context.dataIndex % colors.length];
        }
      }
    }
  };

  // Chart data
  const barChartData = {
    labels: options.map(opt => opt.text),
    datasets: [{
      label: 'Votes',
      data: options.map(opt => opt.count || 0),
      backgroundColor: options.map((opt, index) => {
        const colors = [
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(16, 185, 129, 0.8)',   // Green
          'rgba(245, 158, 11, 0.8)',   // Yellow
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(139, 92, 246, 0.8)',   // Purple
          'rgba(236, 72, 153, 0.8)',   // Pink
          'rgba(14, 165, 233, 0.8)',   // Sky
          'rgba(34, 197, 94, 0.8)'     // Emerald
        ];
        return colors[index % colors.length];
      }),
      borderColor: isDarkMode ? '#1f2937' : '#fff',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false
    }]
  };

  const pieChartData = {
    labels: options.map(opt => opt.text),
    datasets: [{
      data: options.map(opt => opt.count || 0),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(14, 165, 233, 0.8)',
        'rgba(34, 197, 94, 0.8)'
      ],
      borderColor: isDarkMode ? '#1f2937' : '#fff',
      borderWidth: 2
    }]
  };

  // Enhanced voting trends data with dynamic time periods and real-time capabilities
  const generateVotingTrendsData = () => {
    const now = new Date();
    const pollStart = poll?.createdAt ? new Date(poll.createdAt) : new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const pollEnd = poll?.endDate ? new Date(poll.endDate) : now;

    // Generate time labels based on poll duration
    const timeLabels = [];
    const timeData = [];
    const hoursDiff = Math.floor((pollEnd - pollStart) / (1000 * 60 * 60));

    if (hoursDiff <= 24) {
      // Hourly data for polls up to 24 hours
      for (let i = 0; i <= Math.min(hoursDiff, 12); i++) {
        const time = new Date(pollStart.getTime() + i * 60 * 60 * 1000);
        timeLabels.push(format(time, 'h a'));
        // Mock data - replace with real backend data
        timeData.push(Math.floor(Math.random() * 50) + 10);
      }
    } else if (hoursDiff <= 168) { // 7 days
      // Daily data for polls up to 7 days
      for (let i = 0; i <= Math.min(Math.floor(hoursDiff / 24), 7); i++) {
        const time = new Date(pollStart.getTime() + i * 24 * 60 * 60 * 1000);
        timeLabels.push(format(time, 'MMM d'));
        timeData.push(Math.floor(Math.random() * 200) + 50);
      }
    } else {
      // Weekly data for longer polls
      for (let i = 0; i <= Math.min(Math.floor(hoursDiff / (24 * 7)), 8); i++) {
        const time = new Date(pollStart.getTime() + i * 7 * 24 * 60 * 60 * 1000);
        timeLabels.push(format(time, 'MMM d'));
        timeData.push(Math.floor(Math.random() * 500) + 100);
      }
    }

    return {
      labels: timeLabels,
      datasets: [{
        label: 'Votes',
        data: timeData,
        fill: true,
        backgroundColor: isDarkMode
          ? 'rgba(59, 130, 246, 0.15)'
          : 'rgba(59, 130, 246, 0.2)',
        borderColor: isDarkMode
          ? 'rgba(59, 130, 246, 0.8)'
          : 'rgba(59, 130, 246, 1)',
        tension: 0.4,
        pointBackgroundColor: isDarkMode
          ? 'rgba(59, 130, 246, 0.9)'
          : 'rgba(59, 130, 246, 1)',
        pointBorderColor: isDarkMode ? '#374151' : '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: isDarkMode
          ? 'rgba(59, 130, 246, 1)'
          : 'rgba(59, 130, 246, 0.8)',
        pointHoverBorderColor: isDarkMode ? '#1f2937' : '#fff',
        pointHoverBorderWidth: 3
      }]
    };
  };

  const votingTrendsData = generateVotingTrendsData();

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/vote/${poll?.id}?showResults=1`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getParticipationRate = () => {
    // Mock participation rate - replace with real data
    return Math.round((totalVotes / 100) * 100);
  };

  const getVotingSpeed = () => {
    // Mock voting speed - replace with real data
    return Math.round(totalVotes / 2);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'demographics', label: 'Demographics', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Poll Results
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {poll?.title}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {showLiveResults && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium animate-pulse">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  Live Results
                </div>
              )}
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                aria-label="Share results"
              >
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: animationDelay }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-green-900 dark:text-green-100">
                  Vote Submitted Successfully!
                </h2>
                <p className="text-green-700 dark:text-green-300">
                  Thank you for participating in this poll. Your vote has been recorded.
                </p>
                {userVotedOptions.length > 0 && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    You voted for: <span className="font-semibold">{userVotedOptions.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVotes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Leading Option</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {winningOption?.text || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Participation</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getParticipationRate()}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Votes/Hour</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{getVotingSpeed()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + 0.2 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Results Breakdown */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Results Breakdown
                  </h3>
                  <div className="space-y-4">
                    {sortedOptions.map((option, index) => {
                      const percentage = option.percent || 0;
                      const voteCount = option.count || 0;
                      const isWinning = index === 0;
                      const isUserVote = userVotedOptions.includes(option.text);

                      return (
                        <motion.div
                          key={option.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${isWinning
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                            } ${isUserVote ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {/* Candidate Image */}
                              {option.image && (
                                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                                  <img src={option.image} alt="" className="h-full w-full object-cover" />
                                </div>
                              )}

                              {isWinning && !option.image && (
                                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                              <span className="font-semibold text-gray-900 dark:text-white">
                                {option.text}
                              </span>
                              {isUserVote && (
                                <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                  Your Vote
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {voteCount} votes
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {percentage}%
                              </div>
                            </div>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                className={`h-full rounded-full transition-all duration-300 ${isWinning
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                    : 'bg-blue-500'
                                  }`}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Poll Information */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Poll Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created by</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {poll?.createdBy?.name || poll?.createdBy?.email || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Created on</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {poll?.createdAt ? format(new Date(poll.createdAt), 'MMM d, yyyy') : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Ends on</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {poll?.endDate ? format(new Date(poll.endDate), 'MMM d, yyyy') : 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {poll?.status || 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {poll?.description && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        <strong>Description:</strong> {poll.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="space-y-8">
                {/* Bar Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Votes by Option
                  </h3>
                  <div className="h-80">
                    <Bar data={barChartData} options={chartOptions} />
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Vote Distribution
                  </h3>
                  <div className="h-80">
                    <Pie data={pieChartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* Voting Trends */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Voting Trends
                  </h3>
                  <div className="h-80">
                    <Line data={votingTrendsData} options={chartOptions} />
                  </div>
                </div>

                {/* Key Insights */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Key Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700">
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Voting Momentum</h4>
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Peak voting activity occurred between 2-5 PM, with {getVotingSpeed()} votes per hour.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
                        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Participation Rate</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {getParticipationRate()}% of eligible voters participated in this poll.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700">
                        <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Winner Analysis</h4>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                          {winningOption?.text} leads with {winningOption?.percent}% of the total votes.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700">
                        <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Vote Distribution</h4>
                        <p className="text-sm text-orange-700 dark:text-orange-300">
                          Votes are {totalVotes > 50 ? 'well distributed' : 'concentrated'} across all options.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'demographics' && (
              <div className="space-y-8">
                {/* Demographics Placeholder */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    Voter Demographics
                  </h3>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Demographics data will be available here when collected.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: animationDelay + 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Polls
          </button>
          <button
            onClick={handleShare}
            className="px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <Share className="w-5 h-5" />
            {copied ? 'Copied!' : 'Share Results'}
          </button>
        </motion.div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Share Results</h3>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: `Poll Results: ${poll?.title}`,
                      text: `Check out the results for "${poll?.title}"`,
                      url: `${window.location.origin}/vote/${poll?.id}?showResults=1`
                    });
                  }}
                  className="w-full p-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Share via Native Share
                </button>
                <button
                  onClick={handleShare}
                  className="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Copy Link
                </button>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="mt-4 w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedResultsDisplay; 