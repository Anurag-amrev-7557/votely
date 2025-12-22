import React, { useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    FileText,
    User,
    Calendar,
    Award,
    Clock,
    Filter,
    Search,
    ChevronDown,
    MoreVertical,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import useAdminNominations from '../../hooks/useAdminNominations';
import adminAxios from '../../utils/api/adminAxios';
import { useTheme } from '../../context/ThemeContext';
import { CustomDropdown } from '../../components/ui/CustomDropdown'; // Added import

// --- VISUAL UTILITIES ---
const NoiseTexture = () => (
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
    </div>
);

const SpotlightEffect = ({ mouseX, mouseY }) => (
    <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
            background: useMotionTemplate`radial-gradient(
        650px circle at ${mouseX}px ${mouseY}px,
        rgba(14, 165, 233, 0.08),
        transparent 80%
      )`,
        }}
    />
);

const AdminNominations = () => {
    const [polls, setPolls] = useState([]);
    const [selectedPoll, setSelectedPoll] = useState('');
    const [nominations, setNominations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { getPollNominations, updateNominationStatus } = useAdminNominations();
    const { isDarkMode } = useTheme();

    // Mouse tracking for spotlight
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const res = await adminAxios.get('/polls');
                setPolls(res.data.polls || []);
                if (res.data.polls?.length > 0) {
                    setSelectedPoll(res.data.polls[0]._id);
                }
            } catch (err) {
                console.error("Failed to fetch polls");
            }
        };
        fetchPolls();
    }, []);

    useEffect(() => {
        if (selectedPoll) {
            loadNominations(selectedPoll);
        }
    }, [selectedPoll]);

    const loadNominations = async (pollId) => {
        const data = await getPollNominations(pollId);
        setNominations(data || []);
    };

    const handleAction = async (id, status) => {
        if (window.confirm(`Are you sure you want to ${status} this nomination?`)) {
            await updateNominationStatus(id, status);
            loadNominations(selectedPoll);
        }
    };

    return (
        <div className="w-full min-h-screen py-4 px-3 pr-1  space-y-8 animate-fade-in">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500 mb-2">
                        Election Control
                    </h2>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-none">
                        Candidate <span className="text-gray-500 dark:text-zinc-500">Nominations.</span>
                    </h1>
                </div>

                {/* Poll Selector */}
                <div className="w-full md:w-72">
                    <CustomDropdown
                        value={selectedPoll}
                        onChange={(value) => setSelectedPoll(value)}
                        options={polls.map(p => ({ value: p._id, label: p.title }))}
                        icon={Award}
                        placeholder="Select Election"
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <motion.div
                onMouseMove={handleMouseMove}
                className="relative group overflow-hidden rounded-2xl h-[calc(100vh-13rem)] border border-gray-200 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 shadow-xl backdrop-blur-xl"
            >
                <NoiseTexture />
                <SpotlightEffect mouseX={mouseX} mouseY={mouseY} />

                {/* Toolbar */}
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800/50 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                            <Filter className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 uppercase tracking-wider">
                            {nominations.length} Candidates
                        </span>
                    </div>

                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-transparent focus:bg-white dark:focus:bg-zinc-800 focus:border-blue-500/50 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="relative z-10 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-zinc-800/50 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-500">
                                <th className="px-6 py-4">Candidate Identity</th>
                                <th className="px-6 py-4">Manifesto / SOP</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/50">
                            <AnimatePresence>
                                {nominations.map((nom, idx) => (
                                    <motion.tr
                                        key={nom._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group/row hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-zinc-700 dark:to-zinc-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-zinc-300 shadow-inner">
                                                    {nom.candidate?.profilePhoto ? (
                                                        <img className="w-full h-full rounded-full object-cover" src={nom.candidate.profilePhoto} alt="" />
                                                    ) : (
                                                        nom.candidate?.name?.charAt(0) || <User className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                                        {nom.candidate?.name || 'Unknown Candidate'}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-500 font-mono mt-0.5">
                                                        {nom.candidate?.email || 'ID: #MISSING'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-start gap-2 max-w-sm">
                                                <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-2 leading-relaxed" title={nom.manifesto}>
                                                    {nom.manifesto || "No manifesto submitted."}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${nom.status === 'approved'
                                                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50'
                                                : nom.status === 'rejected'
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50'
                                                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/50'
                                                }`}>
                                                {nom.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                                                {nom.status === 'rejected' && <XCircle className="w-3 h-3" />}
                                                {nom.status === 'pending' && <Clock className="w-3 h-3" />}
                                                {nom.status}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            {nom.status === 'pending' ? (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleAction(nom._id, 'approved')}
                                                        className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(nom._id, 'rejected')}
                                                        className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 italic">Action taken</div>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {nominations.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500 dark:text-zinc-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="p-3 rounded-full bg-gray-100 dark:bg-zinc-800">
                                                <User className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-medium">No nominations found for this election.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminNominations;
