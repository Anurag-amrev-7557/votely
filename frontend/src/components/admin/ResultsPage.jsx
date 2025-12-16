import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import format from 'date-fns/format';
import { toast } from '../../utils/toastUtils';
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
import {
  Search, Filter, Activity, CheckCircle, BarChart2, PieChart, Users, Calendar,
  Download, ChevronRight, X, Clock, MapPin, Smartphone, Share2, Eye
} from 'lucide-react';
import adminAxios from '../../utils/api/adminAxios';
import { DashboardWidget, StatValue } from './AdminWidgets';
import { AnimatedModal } from '../ui/AnimatedModal';
// PollCard is likely NOT exported as default from PollsPage.jsx based on previous reads.
// PollCard was an internal component in PollsPage.jsx. 
// I will re-implement a similar card design here for consistency or refactor PollsPage later.
// For now, I will implement a consistent card view locally to avoid breaking PollsPage import.

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
  const [pollResults, setPollResults] = useState(null);
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

  // Fetch Results when a poll is selected
  useEffect(() => {
    if (selectedPoll?.id) {
      fetchPollResults(selectedPoll.id);
    }
  }, [selectedPoll]);

  const fetchPollResults = async (pollId) => {
    setResultsLoading(true);
    setPollResults(null);
    try {
      const res = await adminAxios.get(`/api/polls/${pollId}/results`);
      setPollResults(res.data);
    } catch (err) {
      toast.error('Failed to load detailed results');
    } finally {
      setResultsLoading(false);
    }
  };

  // Derived Stats
  const activePollsCount = polls.filter(p => p.status === 'active').length;
  const totalVotesCast = polls.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0);
  const completedPollsCount = polls.filter(p => p.status === 'completed').length;
  // Mock participation calculation if not available
  const avgParticipation = polls.length > 0 ? Math.round(polls.reduce((acc, p) => acc + (p.participation || 0), 0) / polls.length) : 0;

  // Filter Logic
  const filteredPolls = polls.filter(poll => {
    const matchesSearch = poll.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || poll.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Chart Configuration
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: { size: 13, weight: 'bold' },
        bodyFont: { size: 12 }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 11 } } },
      y: { grid: { color: 'rgba(200,200,200,0.1)', borderDash: [5, 5] }, ticks: { font: { size: 11 } } }
    },
    elements: {
      bar: { borderRadius: 4 },
      line: { tension: 0.4 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#0a0a0a] p-6 lg:p-10 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600 dark:text-zinc-400 mb-2">
            Analytics & Insights
          </h2>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
            Poll <span className="text-gray-600 dark:text-zinc-400">Results.</span>
          </h1>
        </div>

        <div className="flex flex-col-reverse md:flex-row md:items-center gap-4">
          {/* Pill Styled Stats */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-full px-5 py-2.5 shadow-sm overflow-x-auto max-w-full custom-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <Activity className="w-4 h-4 text-blue-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{totalVotesCast.toLocaleString()}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">votes</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <BarChart2 className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{activePollsCount}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">active</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{completedPollsCount}</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">completed</span>
              </div>
            </div>
            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-800 shrink-0"></div>
            <div className="flex items-center gap-2 shrink-0">
              <Users className="w-4 h-4 text-purple-500" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900 dark:text-white">{avgParticipation}%</span>
                <span className="text-xs text-gray-500 dark:text-zinc-500 font-medium hidden sm:inline-block">participation</span>
              </div>
            </div>
          </div>

          <CSVLink
            data={polls.map(p => ({
              title: p.title,
              status: p.status,
              votes: p.totalVotes,
              created: format(new Date(p.createdAt), 'yyyy-MM-dd')
            }))}
            filename={`results_export_${format(new Date(), 'yyyyMMdd')}.csv`}
            className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-black border border-transparent rounded-full text-sm font-bold hover:scale-105 transition-transform shadow-lg"
          >
            <Download className="w-4 h-4" /> Export
          </CSVLink>
        </div>
      </header>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-20 md:static backdrop-blur-md bg-gray-50/80 dark:bg-[#0a0a0a]/80 py-2 md:py-0">
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-gray-900 dark:group-focus-within:text-white transition-colors" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search results..."
            className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-1 focus:ring-gray-900 dark:focus:ring-white outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex gap-1 p-1 bg-gray-200/50 dark:bg-zinc-800/50 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              aria-label="Grid view"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              aria-label="List view"
            >
              <Filter className="w-4 h-4" /> {/* Using Filter icon as List proxy or get List icon */}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : filteredPolls.length === 0 ? (
        <div className="text-center py-20 text-gray-500 dark:text-zinc-500">
          No polls found matching your criteria.
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
          <AnimatePresence>
            {filteredPolls.map((poll, index) => (
              <ResultItem
                key={poll.id || `poll-${index}`}
                poll={poll}
                viewMode={viewMode}
                index={index}
                onClick={() => setSelectedPoll(poll)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Detailed Modal using standard modal structure tailored for results */}
      <AnimatePresence>
        {selectedPoll && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedPoll(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#111] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-gray-200 dark:border-zinc-800"
            >
              {/* Modal Header */}
              <div className="shrink-0 p-6 md:p-8 border-b border-gray-100 dark:border-zinc-800 flex items-start justify-between bg-gray-50/50 dark:bg-zinc-900/20">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${selectedPoll.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      selectedPoll.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                      {selectedPoll.status}
                    </span>
                    <span className="text-gray-400 dark:text-zinc-500 text-sm flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {format(new Date(selectedPoll.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {selectedPoll.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPoll(null)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {resultsLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : pollResults ? (
                  <div className="space-y-8">
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Votes</h4>
                        <p className="text-3xl font-bold font-mono text-gray-900 dark:text-white">{pollResults.totalVotes}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Leading Option</h4>
                        <p className="text-lg font-bold text-gray-900 dark:text-white truncate">
                          {pollResults.options.reduce((a, b) => a.count > b.count ? a : b).text}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Participation</h4>
                        <div className="flex items-end gap-2">
                          <p className="text-3xl font-bold font-mono text-gray-900 dark:text-white">{selectedPoll.participation || 0}%</p>
                          <span className="text-xs text-green-500 font-bold mb-1.5">+2.4% vs avg</span>
                        </div>
                      </div>
                    </div>

                    {/* Main Visualization Area */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Bar Chart */}
                      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Vote Distribution</h3>
                        <div className="h-64">
                          <Bar
                            data={{
                              labels: pollResults.options.map(o => o.text),
                              datasets: [{
                                label: 'Votes',
                                data: pollResults.options.map(o => o.count),
                                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                                borderRadius: 4
                              }]
                            }}
                            options={chartOptions}
                          />
                        </div>
                      </div>

                      {/* Voting Trends Line Chart */}
                      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Voting Activity</h3>
                        <div className="h-64">
                          <Line
                            data={{
                              labels: selectedPoll.votingTrends?.daily?.map(d => d.day) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                              datasets: [{
                                label: 'Votes Cast',
                                data: selectedPoll.votingTrends?.daily?.map(d => d.votes) || [12, 19, 3, 5, 2],
                                borderColor: 'rgb(16, 185, 129)',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                fill: true,
                              }]
                            }}
                            options={chartOptions}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Demographics Section */}
                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-8">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Voter Demographics</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Age, Location, Device Placeholders */}
                        <DemographicCard title="Age Groups" type="pie" data={selectedPoll.demographics?.ageGroups} />
                        <DemographicCard title="Locations" type="bar" horizontal data={selectedPoll.demographics?.locations} />
                        <DemographicCard title="Devices" type="doughnut" data={selectedPoll.demographics?.devices} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No detailed results available.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Sub-components

const ResultItem = ({ poll, viewMode, onClick, index }) => {
  const totalVotes = poll.totalVotes || 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        role="button"
        tabIndex={0}
        className="group flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 hover:border-blue-500/30 hover:shadow-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <div className={`w-1.5 h-12 rounded-full ${poll.status === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-700'}`} />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-white truncate">{poll.title}</h3>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
            <span>{format(new Date(poll.createdAt), 'MMM d')}</span>
            <span>{poll.options?.length || 0} Options</span>
          </div>
        </div>
        <div className="flex items-center gap-8 px-4">
          <div className="text-center">
            <div className="text-lg font-bold font-mono dark:text-white">{totalVotes}</div>
            <div className="text-[10px] uppercase font-bold text-gray-400">Votes</div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
        </div>
      </motion.div>
    )
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      role="button"
      tabIndex={0}
      className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${poll.status === 'active' ? 'bg-gradient-to-r from-green-400 to-emerald-600' : 'bg-gray-200 dark:bg-zinc-700'}`} />

      <div className="mb-4">
        <div className="flex justify-between items-start mb-2">
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${poll.status === 'active' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-gray-100 text-gray-500 dark:bg-zinc-800'
            }`}>
            {poll.status}
          </span>
          <BarChart2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2">
          {poll.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-500">
          Ended: {format(new Date(poll.endDate), 'MMM d, yyyy')}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-2 py-4 border-t border-gray-50 dark:border-zinc-800/50">
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{totalVotes}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase">Votes</div>
        </div>
        <div className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800/50 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white">{poll.options?.length || 0}</div>
          <div className="text-[10px] font-bold text-gray-400 uppercase">Options</div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
        <span>View Full Analytics</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.div>
  );
};

const DemographicCard = ({ title, type, data, horizontal }) => {
  // Placeholder chart logic
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800">
      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">{title}</h4>
      <div className="h-40 flex items-center justify-center text-gray-400 text-xs italic bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
        Chart Visualization
      </div>
    </div>
  )
}

export default ResultsPage;