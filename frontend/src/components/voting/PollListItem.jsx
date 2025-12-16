import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Clock, Users, ArrowRight, SparklesIcon } from '../ui/icons';

const PollListItem = ({
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
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    // Helper to format time remaining
    const getTimeRemaining = (endDate) => {
        const total = Date.parse(endDate) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
        const days = Math.floor(total / (1000 * 60 * 60 * 24));

        if (total <= 0) return 'Ended';
        if (days > 0) return `${days}d left`;
        if (hours > 0) return `${hours}h left`;
        return `${minutes}m left`;
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
        }).format(num);
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
        return <SparklesIcon className="w-3 h-3" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onMouseMove={handleMouseMove}
            onClick={() => handlePollClick(poll)}
            className="group relative flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#121212] border border-gray-100 dark:border-[#1E1E1E] hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md dark:shadow-none mb-3 overflow-hidden"
        >
            {/* Hover Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100 z-10"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.05),
              transparent 80%
            )
          `,
                }}
            />

            <div className="relative z-20 flex items-center gap-6 flex-1 min-w-0">
                {/* Status Indicator */}
                <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gray-50 dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800`}>
                        <span
                            className={`text-xs font-bold ${poll.status === 'Active' ? 'text-green-600 dark:text-green-400' : poll.status === 'Upcoming' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
                            aria-label={`Status: ${poll.status}`}
                        >
                            {poll.status === 'Active' ? 'LIVE' : poll.status === 'Upcoming' ? 'SOON' : 'END'}
                        </span>
                    </div>
                </div>

                {/* Info */}
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold uppercase tracking-wider ${poll.status === 'Active' ? 'text-green-600' : poll.status === 'Upcoming' ? 'text-blue-600' : 'text-gray-600'}`}>
                            {poll.status}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                            {poll.category}
                        </span>
                        <span className="text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            by {poll.creator || poll.createdBy?.username || 'Unknown'}
                        </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate pr-4 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {poll.title}
                    </h3>
                    <p className="text-xs text-gray-700 dark:text-gray-400 truncate max-w-lg">
                        {poll.description}
                    </p>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6 mr-4">
                    <div className="flex items-center gap-1.5" title="Participants">
                        <Users className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{formatNumber(poll.participantCount || 0)}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Time Remaining">
                        <Clock className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{getTimeRemaining(poll.endDate)}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="relative z-20 flex items-center gap-3 pl-4 border-l border-gray-300 dark:border-zinc-800">
                <button
                    onClick={(e) => handlePollFavorite(poll.id || poll._id, e)}
                    disabled={favoriteLoading[poll.id || poll._id]}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-red-500 active:scale-95"
                    aria-label={favorites.includes(poll.id || poll._id) ? "Remove from favorites" : "Add to favorites"}
                >
                    {favorites.includes(poll.id || poll._id) ? (
                        <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    )}
                </button>

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
                    className="flex items-center gap-2 py-2 px-4 bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-90 active:scale-[0.98] transition-all whitespace-nowrap"
                >
                    <span>
                        {poll.status === 'Active'
                            ? (userVotes[poll.id || poll._id] ? 'Results' : 'Vote')
                            : poll.status === 'Upcoming' ? 'Remind' : 'Results'}
                    </span>
                    <ArrowRight className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
};

export default PollListItem;
