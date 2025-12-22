import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
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
import { intervalToDuration, formatDuration } from 'date-fns';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Share, Download, Eye, Users, Clock, Calendar,
  TrendingUp, Award, BarChart3, PieChart, Activity, CheckCircle,
  Trophy, Shield, Hash, MapPin, Smartphone
} from 'lucide-react';

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

// --- Sub-components for cleaner code ---

const StatCard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    className="relative overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 shadow-xl shadow-gray-200/50 dark:shadow-black/50"
  >
    <div className={`absolute top-0 right-0 p-4 opacity-10 ${colorClass}`}>
      <Icon className="w-24 h-24 transform translate-x-8 -translate-y-8" />
    </div>
    <div className="relative z-10">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colorClass.replace('text-', 'bg-').replace('600', '100').replace('400', '900/30')} ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</h3>
    </div>
  </motion.div>
);

const WinnerHero = ({ winner, totalVotes }) => {
  if (!winner) return null;
  const percentage = winner.percent || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent border border-amber-500/20 p-8 mb-12 text-center md:text-left"
    >
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-yellow-400/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="relative">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-yellow-300 to-amber-600 p-[3px] shadow-lg shadow-amber-500/30">
            <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden">
              {winner.image ? (
                <img src={winner.image} alt={winner.text} className="w-full h-full object-cover" />
              ) : (
                <Trophy className="w-10 h-10 md:w-14 md:h-14 text-amber-500" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-zinc-900">
            WINNER
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-2">Leading Choice</h2>
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-2">
            {winner.text}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
            Currently leading with <span className="font-bold text-gray-900 dark:text-white">{winner.count} votes</span>,
            gathering substantial support from the electorate.
          </p>
        </div>

        <div className="text-center md:text-right">
          <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            {percentage}%
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-1">
            Of Total Votes
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

const EnhancedResultsDisplay = ({
  poll,
  results,
  userVote,
  onBack,
  showLiveResults = false,
}) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(0);

  useEffect(() => {
    // Stagger animations on mount
    const timer = setTimeout(() => setAnimationDelay(0.1), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalVotes = results?.totalVotes || 0;

  // Robustly sort options
  const options = useMemo(() => {
    let opts = results?.options || [];
    // Handle format differences (backend sometimes returns simple array of strings for mock)
    // but our updated backend returns object with text, count, percent.
    return [...opts].sort((a, b) => (b.count || 0) - (a.count || 0));
  }, [results]);

  const winningOption = options[0];
  const userVotedOptions = userVote?.options || [];

  // --- Real Analytics Data ---

  // 1. Time Remaining
  const timeRemainingLabel = useMemo(() => {
    if (!poll?.endDate) return 'Ongoing';
    const now = new Date();
    const end = new Date(poll.endDate);
    if (now > end) return 'Ended';

    try {
      const duration = intervalToDuration({ start: now, end });
      if (duration.days && duration.days > 0) return `${duration.days} Days`;
      if (duration.hours) return `${duration.hours} Hours`;
      return `${duration.minutes || 0} Mins`;
    } catch (e) {
      return 'N/A';
    }
  }, [poll?.endDate]);

  // 2. Voting Trends (Real Data)
  const trendData = useMemo(() => {
    const trends = results?.votingTrends || { labels: [], data: [] };
    return {
      labels: trends.labels.length ? trends.labels : ['Start', 'Now'],
      datasets: [{
        label: 'Votes Collected',
        data: trends.data.length ? trends.data : [0, totalVotes], // Fallback if empty
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3b82f6',
        pointBorderWidth: 2,
      }]
    };
  }, [results?.votingTrends, totalVotes]);

  // 3. Peak Activity (derived from trends)
  const peakActivity = useMemo(() => {
    const data = results?.votingTrends?.data || [];
    if (!data.length) return "N/A";
    const max = Math.max(...data);
    return `${max} / day`;
  }, [results?.votingTrends]);


  // --- Chart Configurations ---

  const commonChartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDarkMode ? '#9ca3af' : '#4b5563',
          font: { family: "Inter, sans-serif", size: 12, weight: 500 },
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#18181b' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#a1a1aa' : '#52525b',
        borderColor: isDarkMode ? '#27272a' : '#e4e4e7',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: { family: "Inter, sans-serif", size: 14, weight: 600 },
        bodyFont: { family: "Inter, sans-serif", size: 13 },
        displayColors: true,
        usePointStyle: true,
      }
    },
    scales: {
      y: {
        grid: { color: isDarkMode ? '#27272a' : '#f4f4f5', drawBorder: false },
        ticks: { color: isDarkMode ? '#9ca3af' : '#6b7280', font: { family: "Inter, sans-serif", size: 11 } },
        border: { display: false }
      },
      x: {
        grid: { display: false },
        ticks: { color: isDarkMode ? '#9ca3af' : '#6b7280', font: { family: "Inter, sans-serif", size: 11 } },
        border: { display: false }
      }
    }
  }), [isDarkMode]);

  // Colors Palette
  const chartColors = [
    { bg: 'rgba(59, 130, 246, 0.8)', border: '#3b82f6' }, // Blue
    { bg: 'rgba(16, 185, 129, 0.8)', border: '#10b981' }, // Green
    { bg: 'rgba(249, 115, 22, 0.8)', border: '#f97316' }, // Orange
    { bg: 'rgba(139, 92, 246, 0.8)', border: '#8b5cf6' }, // Violet
    { bg: 'rgba(236, 72, 153, 0.8)', border: '#ec4899' }, // Pink
    { bg: 'rgba(14, 165, 233, 0.8)', border: '#0ea5e9' }, // Sky
  ];

  const barChartData = useMemo(() => ({
    labels: options.map(opt => opt.text),
    datasets: [{
      label: 'Votes',
      data: options.map(opt => opt.count || 0),
      backgroundColor: options.map((_, i) => chartColors[i % chartColors.length].bg),
      borderRadius: 6,
      barThickness: 32,
    }]
  }), [options, chartColors]);

  const pieChartData = useMemo(() => ({
    labels: options.map(opt => opt.text),
    datasets: [{
      data: options.map(opt => opt.count || 0),
      backgroundColor: options.map((_, i) => chartColors[i % chartColors.length].bg),
      borderColor: isDarkMode ? '#18181b' : '#ffffff',
      borderWidth: 2,
    }]
  }), [options, chartColors, isDarkMode]);


  // --- Actions ---

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/vote/${poll?.id}?showResults=1`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'charts', label: 'Detailed Charts', icon: BarChart3 },
    { id: 'insights', label: 'Insights', icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white selection:bg-blue-500/30">

      {/* --- Sticky Header --- */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-base font-bold leading-none">{poll?.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Ends: {poll?.endDate ? format(new Date(poll.endDate), 'MMM d') : 'N/A'}
                </span>
                {showLiveResults && (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wide">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    Live
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors text-sm font-semibold text-gray-900 dark:text-white"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Share className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* --- Main Content --- */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">

        {/* User Vote Receipt */}
        {userVote && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100">Vote Authenticated & Recorded</h3>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Your selection: <span className="font-semibold">{userVotedOptions.join(', ')}</span>
                </p>
              </div>
            </div>
            {userVote.hash && (
              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 bg-white dark:bg-black/50 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/5 w-full md:w-auto overflow-hidden">
                <Hash className="w-3 h-3 flex-shrink-0" />
                <span className="truncate max-w-[200px]">{userVote.hash}</span>
              </div>
            )}
          </motion.div>
        )}

        <WinnerHero winner={winningOption} totalVotes={totalVotes} />

        {/* KPI Grid - REAL DATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard
            title="Total Votes"
            value={totalVotes.toLocaleString()}
            icon={Users}
            colorClass="text-blue-600"
            delay={0.1}
          />
          <StatCard
            title="Peak Activity"
            value={peakActivity}
            icon={Activity}
            colorClass="text-purple-600"
            delay={0.2}
          />
          <StatCard
            title="Leading Margin"
            value={`+${(options[0]?.count || 0) - (options[1]?.count || 0)}`}
            icon={TrendingUp}
            colorClass="text-green-600"
            delay={0.3}
          />
          <StatCard
            title={`${poll?.status === 'completed' ? 'Ended' : 'Ends In'}`}
            value={timeRemainingLabel}
            icon={Clock}
            colorClass="text-orange-600"
            delay={0.4}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                            relative flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap
                            ${isActive
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-200 dark:shadow-white/10'
                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
                  }
                        `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute -bottom-2 left-1/2 w-1 h-1 bg-gray-900 dark:bg-white rounded-full"
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Panels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* --- Overview Tab --- */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List View */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-zinc-800">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                    Breakdown
                  </h3>
                  <div className="space-y-4">
                    {options.map((opt, idx) => {
                      const percent = opt.percent || 0;
                      const isLeader = idx === 0;
                      return (
                        <div key={opt.id || idx} className="group">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                              {isLeader && <Trophy className="w-3 h-3 text-amber-500" />}
                              {opt.text}
                            </span>
                            <span className="font-mono text-gray-500 dark:text-gray-400">
                              {opt.count} votes ({percent}%)
                            </span>
                          </div>
                          <div className="h-4 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percent}%` }}
                              transition={{ duration: 1, delay: 0.2 + (idx * 0.1) }}
                              className={`absolute top-0 left-0 h-full rounded-full ${isLeader ? 'bg-amber-500' : 'bg-blue-600'} opacity-90`}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Doughnut Chart */}
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-zinc-800 flex flex-col items-center justify-center min-h-[400px]">
                  <h3 className="text-xl font-bold mb-8 w-full">Distribution</h3>
                  <div className="w-64 h-64 md:w-80 md:h-80 relative">
                    <Doughnut
                      data={pieChartData}
                      options={{
                        ...commonChartOptions,
                        cutout: '70%',
                        plugins: { ...commonChartOptions.plugins, legend: { display: false } }
                      }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">{totalVotes}</span>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Votes</span>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    {options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length].bg }}></span>
                        {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- Charts Tab --- */}
            {activeTab === 'charts' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-zinc-800 h-[500px]">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold">Vote Distribution</h3>
                    <p className="text-sm text-gray-500">Comparative view of all choices</p>
                  </div>
                  <Bar data={barChartData} options={commonChartOptions} />
                </div>
              </div>
            )}

            {/* --- Insights Tab --- */}
            {activeTab === 'insights' && (
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-zinc-800 h-[400px]">
                  <h3 className="text-xl font-bold mb-6">Vote Velocity</h3>
                  <Line data={trendData} options={commonChartOptions} />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};

export default EnhancedResultsDisplay;