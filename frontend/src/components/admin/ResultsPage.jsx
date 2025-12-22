import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from '../../utils/toastUtils';
import { CSVLink } from 'react-csv';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
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
import {
  Search, Filter, Activity, CheckCircle, BarChart2, PieChart, Users, Calendar,
  Download, ChevronRight, X, Clock, MapPin, Smartphone, Share2, Eye, Award,
  TrendingUp, ArrowUpRight, Zap, Target
} from 'lucide-react';
import adminAxios from '../../utils/api/adminAxios';

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
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [pollResults, setPollResults] = useState(null); // Detailed results
  const [resultsLoading, setResultsLoading] = useState(false);

  // Filter states
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch Polls
  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const response = await adminAxios.get('/polls');
      setPolls(Array.isArray(response.data) ? response.data : (response.data.polls || []));
    } catch (err) {
      toast.error('Failed to load polls');
      setPolls([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Detailed Results when a poll is selected
  useEffect(() => {
    const pollId = selectedPoll?.id || selectedPoll?._id;
    if (pollId) {
      fetchPollResults(pollId);
    }
  }, [selectedPoll]);

  const fetchPollResults = async (pollId) => {
    setResultsLoading(true);
    setPollResults(null);
    try {
      const res = await adminAxios.get(`/polls/${pollId}/results`);
      setPollResults(res.data);
    } catch (err) {
      console.error('Error fetching results:', err);
      toast.error('Failed to load detailed results');
    } finally {
      setResultsLoading(false);
    }
  };

  // Derived Stats
  const activePollsCount = polls.filter(p => p.status === 'active').length;
  const totalVotesCast = polls.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0);
  const completedPollsCount = polls.filter(p => p.status === 'completed').length;
  // Calculate average participation (mock logic if field missing, ideally from backend)
  const avgParticipation = polls.length > 0 ? Math.round(polls.reduce((acc, p) => acc + (p.participation || 0), 0) / polls.length) : 0;

  // Filter Logic
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || poll.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Modern Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 20,
          font: { family: "'Inter', sans-serif", size: 11 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        padding: 12,
        cornerRadius: 12,
        titleFont: { family: "'Inter', sans-serif", size: 13, weight: '600' },
        bodyFont: { family: "'Inter', sans-serif", size: 12 },
        displayColors: false,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)'
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 10 }, color: '#9CA3AF' }
      },
      y: {
        grid: { color: 'rgba(243, 244, 246, 0.6)', borderDash: [4, 4], drawBorder: false },
        ticks: { font: { family: "'Inter', sans-serif", size: 10 }, color: '#9CA3AF', padding: 8 }
      }
    },
    layout: {
      padding: { top: 10, bottom: 10 }
    },
    elements: {
      bar: { borderRadius: 6 },
      line: { tension: 0.4, borderWidth: 3 }
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: {
      legend: { position: 'right', labels: { usePointStyle: true, boxWidth: 6, font: { size: 11 } } }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/30 dark:bg-black py-4 px-3 pr-1 space-y-10 font-[Inter]">
      {/* Header Section */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500">
              Analytics Dashboard
            </h2>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
            Results <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">& Insights</span>
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 max-w-xl text-sm md:text-base">
            Real-time data visualization and comprehensive analytics for your polls and elections.
          </p>
        </div>

        {/* Floating Quick Stats */}
        <div className="flex flex-wrap items-center gap-3">
          <QuickStatPill
            icon={Activity}
            label="Total Votes"
            value={totalVotesCast.toLocaleString()}
            color="text-blue-500"
            bgColor="bg-blue-50 dark:bg-blue-900/20"
          />
          <QuickStatPill
            icon={Zap}
            label="Active Polls"
            value={activePollsCount}
            color="text-amber-500"
            bgColor="bg-amber-50 dark:bg-amber-900/20"
          />
          <QuickStatPill
            icon={CheckCircle}
            label="Completed"
            value={completedPollsCount}
            color="text-emerald-500"
            bgColor="bg-emerald-50 dark:bg-emerald-900/20"
          />

          <div className="h-8 w-px bg-gray-200 dark:bg-zinc-800 mx-2 hidden xl:block"></div>

          <CSVLink
            data={polls.map(p => ({
              title: p.title,
              status: p.status,
              votes: p.totalVotes,
              created: format(new Date(p.createdAt), 'yyyy-MM-dd')
            }))}
            filename={`results_export_${format(new Date(), 'yyyyMMdd')}.csv`}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-black dark:hover:bg-gray-200 rounded-full text-xs font-bold transition-all shadow-xl shadow-gray-200/50 dark:shadow-none"
          >
            <Download className="w-3.5 h-3.5" /> Export Data
          </CSVLink>
        </div>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-4 z-30">
        {/* Search */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by poll title..."
            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl text-sm font-medium shadow-sm shadow-gray-200/20 dark:shadow-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* View Toggles & Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <FilterTab
            label="All"
            active={filterStatus === 'all'}
            onClick={() => setFilterStatus('all')}
          />
          <FilterTab
            label="Active"
            active={filterStatus === 'active'}
            onClick={() => setFilterStatus('active')}
            count={activePollsCount}
          />
          <FilterTab
            label="Completed"
            active={filterStatus === 'completed'}
            onClick={() => setFilterStatus('completed')}
            count={completedPollsCount}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-xl shadow-sm hidden md:flex">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'}`}
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-zinc-300'}`}
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-100 dark:border-blue-900/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-sm font-medium text-gray-400 animate-pulse">Loading analytics...</p>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
          <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-900 rounded-full flex items-center justify-center">
            <Search className="w-10 h-10 text-gray-300 dark:text-zinc-700" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No polls found</h3>
            <p className="text-gray-500 dark:text-zinc-500 text-sm mt-1">Try adjusting your search or filters.</p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6" : "space-y-3"}
          >
            {filteredPolls.map((poll, index) => (
              <ResultCard
                key={poll._id || poll.id || `poll-${index}`}
                poll={poll}
                viewMode={viewMode}
                index={index}
                onClick={() => setSelectedPoll(poll)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Detailed Analytics Modal */}
      <AnimatePresence>
        {selectedPoll && (
          <ModalBackdrop onClick={() => setSelectedPoll(null)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-50 dark:bg-[#09090b] w-full max-w-6xl max-h-[95vh] rounded-[2rem] overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-zinc-800"
            >
              {/* Modal Header */}
              <div className="shrink-0 px-8 py-6 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-[#0c0c0e] flex items-start justify-between z-10">
                <div className="flex items-start gap-6">
                  <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/10 items-center justify-center shrink-0">
                    {selectedPoll.type === 'election' ? <Users className="w-7 h-7 text-blue-600" /> : <PieChart className="w-7 h-7 text-blue-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge status={selectedPoll.status} />
                      <span className="text-gray-400 dark:text-zinc-500 text-xs font-medium flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        Ended {format(new Date(selectedPoll.endDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                      {selectedPoll.title}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPoll(null)}
                  className="group p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="bg-gray-100 dark:bg-zinc-800 p-1 rounded-full group-hover:scale-90 transition-transform">
                    <X className="w-5 h-5 text-gray-500 dark:text-zinc-400" />
                  </div>
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {resultsLoading ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                  </div>
                ) : pollResults ? (
                  <div className="p-8 space-y-10">

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <MetricCard
                        title="Total Impressions"
                        value={(pollResults.totalVotes * 1.4).toFixed(0)} // Mock derived metric
                        subtext="Views"
                        icon={Eye}
                        trend="+12%"
                      />
                      <MetricCard
                        title="Total Votes"
                        value={pollResults.totalVotes.toLocaleString()}
                        subtext="Verified Voters"
                        icon={CheckCircle}
                        highlight
                      />
                      <MetricCard
                        title="Peak Activity"
                        value={pollResults.votingTrends?.daily?.length > 0 ? Math.max(...pollResults.votingTrends.daily.map(d => d.votes)) : 0}
                        subtext="Votes in one day"
                        icon={TrendingUp}
                      />
                      <MetricCard
                        title="Completion Rate"
                        value="94%"
                        subtext="Avg. Time: 45s"
                        icon={Target}
                      />
                    </div>

                    {/* Leading Candidate Highlight (If Election) */}
                    {pollResults.positions && pollResults.positions.length > 0 && (
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 to-indigo-900 p-8 text-white shadow-xl">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Award className="w-5 h-5 text-yellow-400" />
                              <span className="text-blue-200 font-bold tracking-widest uppercase text-xs">Current Leader</span>
                            </div>
                            <h3 className="text-3xl font-bold mb-1">
                              {pollResults.positions[0]?.candidates[0]?.text || 'No votes yet'}
                            </h3>
                            <p className="text-blue-200 text-sm">
                              Leading Position 1 with <span className="text-white font-bold">{pollResults.positions[0]?.candidates[0]?.count || 0} votes</span>
                            </p>
                          </div>
                          <div className="h-16 w-16 md:h-20 md:w-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                            <TrendingUp className="w-8 h-8 text-green-400" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Data Visualization Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <BarChart2 className="w-5 h-5 text-blue-500" />
                          Detailed Breakdown
                        </h3>
                      </div>

                      {/* Election vs Standard Poll View */}
                      {pollResults.positions && pollResults.positions.length > 0 ? (
                        <div className="grid grid-cols-1 gap-12">
                          {pollResults.positions.map((pos, idx) => (
                            <PositionSection key={idx} position={pos} index={idx} chartOptions={chartOptions} />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Main Bar Chart */}
                          <div className="lg:col-span-2 bg-white dark:bg-[#121214] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-zinc-500 mb-6 uppercase tracking-wider">Vote Distribution</h4>
                            <div className="h-80">
                              <Bar
                                data={{
                                  labels: pollResults.options.map(o => o.text),
                                  datasets: [{
                                    label: 'Votes',
                                    data: pollResults.options.map(o => o.count),
                                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                    hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                                    borderRadius: 4
                                  }]
                                }}
                                options={chartOptions}
                              />
                            </div>
                          </div>

                          {/* Trend Line Chart */}
                          <div className="bg-white dark:bg-[#121214] p-6 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-zinc-500 mb-6 uppercase tracking-wider">Timeline</h4>
                            <div className="h-80">
                              <Line
                                data={{
                                  labels: pollResults.votingTrends?.daily?.map(d => format(new Date(d.day), 'MMM d')) || [],
                                  datasets: [{
                                    label: 'Activity',
                                    data: pollResults.votingTrends?.daily?.map(d => d.votes) || [],
                                    borderColor: '#10B981',
                                    backgroundColor: (context) => {
                                      const ctx = context.chart.ctx;
                                      const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                                      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
                                      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
                                      return gradient;
                                    },
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6
                                  }]
                                }}
                                options={{ ...chartOptions, scales: { ...chartOptions.scales, x: { ...chartOptions.scales.x, display: false } } }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-zinc-500">
                    <p>No results data available.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Sub Components ---

const QuickStatPill = ({ icon: Icon, label, value, color, bgColor }) => (
  <div className={`flex items-center gap-3 px-4 py-2 rounded-2xl ${bgColor}`}>
    <Icon className={`w-4 h-4 ${color}`} />
    <div className="flex flex-col leading-none">
      <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-zinc-400 opacity-80">{label}</span>
      <span className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{value}</span>
    </div>
  </div>
);

const FilterTab = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${active
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
        : 'bg-white dark:bg-zinc-900 text-gray-500 dark:text-zinc-400 hover:bg-gray-50 dark:hover:bg-zinc-800'
      }`}
  >
    {label}
    {count !== undefined && (
      <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${active ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-500'
        }`}>
        {count}
      </span>
    )}
  </button>
);

const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-200 dark:border-green-500/20",
    completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20",
    upcoming: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20"
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider border ${styles[status] || styles.active}`}>
      {status}
    </span>
  );
};

const ResultCard = ({ poll, viewMode, onClick, index }) => {
  // List View
  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        onClick={onClick}
        className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800/50 hover:border-blue-500/30 dark:hover:border-blue-500/30 rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left"
      >
        <div className={`w-1.5 h-10 rounded-full shrink-0 ${poll.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`}></div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate text-base">{poll.title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
              {format(new Date(poll.createdAt), 'MMM d')}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700"></span>
            <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
              {poll.type === 'election' ? 'Election' : 'Standard Poll'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-6 pl-4 sm:pl-0 border-t sm:border-t-0 border-gray-100 dark:border-zinc-800 pt-3 sm:pt-0">
          <div className="text-right">
            <span className="block text-lg font-black font-mono text-gray-900 dark:text-white leading-none">
              {poll.totalVotes || 0}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Votes</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors text-gray-400">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-[#121214] border border-gray-100 dark:border-zinc-800 rounded-[1.5rem] hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden text-left"
    >
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <StatusBadge status={poll.status} />
          {poll.type === 'election' && <div title="Election" className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600"><Award className="w-3.5 h-3.5" /></div>}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {poll.title}
        </h3>
        <p className="text-xs text-gray-400 dark:text-zinc-500 font-medium">
          Created {format(new Date(poll.createdAt), 'MMMM d, yyyy')}
        </p>
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between border-t border-gray-50 dark:border-zinc-800 pt-4">
          <div>
            <span className="block text-2xl font-black font-mono text-gray-900 dark:text-white leading-none">
              {poll.totalVotes || 0}
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Votes</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#121214] bg-gray-200 dark:bg-zinc-700"></div>
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium mt-1">+{(poll.totalVotes || 0) > 3 ? (poll.totalVotes - 3) : 0} others</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ModalBackdrop = ({ children, onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
  >
    {children}
  </motion.div>
);

const MetricCard = ({ title, value, subtext, icon: Icon, trend, highlight }) => (
  <div className={`p-6 rounded-3xl border flex flex-col justify-between h-32 ${highlight ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-500/20' : 'bg-white dark:bg-[#121214] border-gray-100 dark:border-zinc-800'}`}>
    <div className="flex items-center justify-between">
      <h4 className={`text-xs font-bold uppercase tracking-wider ${highlight ? 'text-blue-200' : 'text-gray-400'}`}>{title}</h4>
      {Icon && <Icon className={`w-4 h-4 ${highlight ? 'text-blue-200' : 'text-gray-400'}`} />}
    </div>
    <div>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-black font-mono ${highlight ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{value}</span>
        {trend && <span className="text-xs font-bold text-green-500 mb-1.5 bg-green-500/10 px-1.5 py-0.5 rounded">{trend}</span>}
      </div>
      <p className={`text-xs font-medium mt-1 ${highlight ? 'text-blue-100' : 'text-gray-500'}`}>{subtext}</p>
    </div>
  </div>
);

const PositionSection = ({ position, index, chartOptions }) => (
  <div className="bg-white dark:bg-[#121214] rounded-[2rem] border border-gray-100 dark:border-zinc-800 p-8 shadow-sm">
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-gray-100 dark:border-zinc-800 pb-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0">
          {index + 1}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{position.title}</h3>
          <p className="text-sm text-gray-500 dark:text-zinc-500 max-w-lg mt-1">{position.description || "Detailed results for this position"}</p>
        </div>
      </div>

      {position.candidates[0] && position.candidates[0].count > 0 && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/10 px-4 py-2 rounded-xl border border-green-100 dark:border-green-900/20">
          <div className="text-right">
            <span className="block text-[10px] font-bold text-green-600 uppercase tracking-wider">Winner</span>
            <span className="block text-sm font-bold text-gray-900 dark:text-white">{position.candidates[0].text}</span>
          </div>
          <div className="h-8 w-8 rounded-full bg-green-500 text-white flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
      {/* Chart Area */}
      <div className="h-72">
        <Bar
          data={{
            labels: position.candidates.map(c => c.text),
            datasets: [{
              label: 'Votes',
              data: position.candidates.map(c => c.count),
              backgroundColor: position.candidates.map((_, i) => i === 0 ? '#10B981' : '#3B82F6'),
              borderRadius: 6,
              barThickness: 30
            }]
          }}
          options={chartOptions}
        />
      </div>

      {/* Candidates List */}
      <div className="overflow-y-auto max-h-72 custom-scrollbar pr-2">
        <div className="flex flex-col gap-3">
          {position.candidates.map((cand, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-zinc-800">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{cand.text}</p>
                  <p className="text-xs text-gray-500">{cand.party || 'Independent'}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="block font-bold text-gray-900 dark:text-white">{cand.count}</span>
                <span className="text-[10px] text-gray-400 uppercase">Votes</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ResultsPage;