import React from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import { User, Clock, Calendar, Users, BarChart3, ArrowRight, CheckCircle, SparklesIcon } from '../ui/icons';

const PollCard = ({
    poll,
    index,
    handlePollClick,
    userVotes,
    handleViewResults,
    handleSetReminder,
    handlePollFavorite,
    favorites,
    favoriteLoading,
}) => {
    const cardMouseX = useMotionValue(0);
    const cardMouseY = useMotionValue(0);

    const handleCardMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        cardMouseX.set(clientX - left);
        cardMouseY.set(clientY - top);
    };

    // Helper to format time remaining
    const getTimeRemaining = (targetDate) => {
        const total = Date.parse(targetDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        if (total <= 0) return 'Ended';
        if (days > 0) return `${days}d left`;
        if (hours > 0) return `${hours}h left`;
        return `${minutes}m left`;
    };

    // Helper for status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'text-green-700 dark:text-green-400 bg-green-500/10 border-green-500/20';
            case 'Upcoming': return 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20';
            default: return 'text-gray-700 dark:text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    };

    const getCategoryIcon = (category) => {
        // You can add distinct icons per category if available, defaulting to Sparkles
        return <SparklesIcon className="w-3 h-3" />;
    };

    const isUpcoming = poll.status === 'Upcoming';
    const timerLabel = isUpcoming ? 'Starts In' : 'Time Left';
    const targetDate = isUpcoming ? poll.startDate : poll.endDate;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onMouseMove={handleCardMouseMove}
            onClick={() => handlePollClick(poll)}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white dark:bg-[#0f0f0f] border border-gray-200 dark:border-zinc-700/80 hover:border-gray-400 dark:hover:border-zinc-500 ring-1 ring-gray-100 dark:ring-zinc-800 hover:ring-gray-200 dark:hover:ring-zinc-600 transition-all duration-500 cursor-pointer h-full shadow-md hover:shadow-xl dark:shadow-lg dark:shadow-black/30 dark:hover:shadow-black/50"
        >
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none z-0"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Hover Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${cardMouseX}px ${cardMouseY}px,
              rgba(14, 165, 233, 0.08),
              transparent 80%
            )
          `,
                }}
            />

            {/* Card Content */}
            <div className="relative z-20 flex flex-col h-full p-6">

                {/* Top Metadata: Creator & Category */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                            {(poll.creator || 'U').charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {poll.creator || 'Votely User'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest border flex items-center gap-1.5 ${getStatusColor(poll.status)}`} aria-label={`Status: ${poll.status}`}>
                            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${poll.status === 'Active' ? 'bg-green-500' : 'hidden'}`}></span>
                                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${poll.status === 'Active' ? 'bg-green-600' : 'bg-current'}`}></span>
                            </span>
                            {poll.status}
                        </span>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider ${poll.status === 'Active' ? 'text-green-600' : poll.status === 'Upcoming' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {poll.status}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                            {poll.category}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {poll.title}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {poll.description}
                    </p>
                </div>

                {/* Stats Grid */}
                {/* Stats Grid */}
                <div className="mt-auto grid grid-cols-2 gap-3 mb-6">
                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/50">
                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" /> {timerLabel}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getTimeRemaining(targetDate)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 p-3 rounded-2xl bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800/50">
                        <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-gray-600 dark:text-gray-400">
                            <Users className="w-3 h-3" /> Votes
                        </span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {(poll.participantCount || poll.totalVotes || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (poll.status === 'Active') {
                                const hasVoted = userVotes[poll.id || poll._id];
                                if (hasVoted) handleViewResults(poll);
                                else handlePollClick(poll);
                            } else if (poll.status === 'Upcoming') {
                                handleSetReminder(poll);
                            } else {
                                handleViewResults(poll);
                            }
                        }}
                        className="group/btn flex-1 relative overflow-hidden py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {poll.status === 'Active'
                                ? (userVotes[poll.id || poll._id] ? 'View Results' : 'Vote Now')
                                : poll.status === 'Upcoming' ? 'Remind Me' : 'Results'}
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
                        </span>
                    </button>

                    <button
                        onClick={(e) => handlePollFavorite(poll.id || poll._id, e)}
                        disabled={favoriteLoading[poll.id || poll._id]}
                        className="p-3 rounded-xl border border-gray-300 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-red-500 active:scale-95"
                        aria-label={favorites.includes(poll.id || poll._id) ? "Remove from favorites" : "Add to favorites"}
                    >
                        {favorites.includes(poll.id || poll._id) ? (
                            <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        )}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PollCard;
