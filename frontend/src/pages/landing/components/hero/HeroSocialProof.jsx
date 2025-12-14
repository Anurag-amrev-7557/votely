import { memo } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { BADGES_DATA, AVATAR_IDS } from './HeroConstants';
import { BadgeIcons } from './HeroIcons';
import { badgesContainer, badgeItem } from './animations';

// Helper to map keys to icons
const getBadgeIcon = (key) => {
    const map = {
        fortune: BadgeIcons.Fortune,
        universities: BadgeIcons.Universities,
        ngos: BadgeIcons.NGOs,
        more: BadgeIcons.More
    };
    return map[key];
};

const HeroSocialProof = () => {
    return (
        <div
            className="flex flex-col @[480px]:flex-row items-center gap-6 mt-6 justify-center @[864px]:justify-start relative"
            aria-label="Active voters and trusted organizations"
        >
            {/* Animated Avatars with Tooltip Popover */}
            <div className="flex -space-x-3 relative group" role="list" aria-label="Recent voters">
                {AVATAR_IDS.map((imgId, idx) => (
                    <div
                        key={imgId}
                        className="relative"
                        tabIndex={0}
                        role="listitem"
                        aria-label="Voter avatar"
                        style={{ zIndex: 10 - idx }}
                    >
                        <img
                            src={`https://i.pravatar.cc/150?img=${imgId}`}
                            alt="Voter avatar"
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 shadow-md transition-all duration-300 will-change-[background-color,transform] cursor-pointer focus:ring-2 focus:ring-blue-400 focus:z-20 hover:scale-110"
                            loading="lazy"
                        />
                        {/* Animated online indicator */}
                        <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-800 animate-pulse shadow" aria-hidden="true" />
                    </div>
                ))}
                {/* Animated "+N" overflow avatar */}
                <div
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 will-change-[background-color,transform] cursor-pointer hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:z-20"
                    tabIndex={0}
                    aria-label="More than 1,000 voters"
                >
                    +994
                </div>
            </div>

            {/* Animated Count-Up and Trust Badges - now batched/staggered */}
            <div className="flex flex-col items-start gap-1 min-w-[180px]">
                {/* Enhanced Animated Count-Up with celebratory confetti and accessibility improvements */}
                <span className="flex items-center gap-2 relative group">
                    <span
                        className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 flex items-center"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        <CountUp end={1000} duration={2.2} separator="," />
                        <span className="ml-0.5 animate-bounce text-blue-400 dark:text-blue-300" aria-hidden="true">+</span>
                        {/* Confetti burst on mount for extra delight */}
                        <motion.span
                            className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none"
                            initial={{ opacity: 0, scale: 0.7, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: 2.2, duration: 0.6, type: "spring" }}
                            aria-hidden="true"
                        >
                            <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                                <circle cx="4" cy="8" r="2" fill="#60a5fa" />
                                <circle cx="16" cy="4" r="1.5" fill="#a78bfa" />
                                <circle cx="28" cy="10" r="2" fill="#34d399" />
                                <circle cx="10" cy="13" r="1" fill="#fbbf24" />
                                <circle cx="22" cy="3" r="1" fill="#f472b6" />
                            </svg>
                        </motion.span>
                    </span>
                    <span className="text-gray-600 dark:text-gray-300 text-base font-medium sr-only">
                        active voters
                    </span>
                    <span
                        className="text-gray-600 dark:text-gray-300 text-base font-medium inline-flex items-center"
                        aria-hidden="true"
                    >
                        active voters
                    </span>
                    {/* Animated checkmark with subtle pulse */}
                    <motion.svg
                        className="w-5 h-5 text-green-500 dark:text-green-400 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        initial={{ scale: 0.8, opacity: 0.7 }}
                        animate={{ scale: [0.8, 1.1, 1], opacity: [0.7, 1, 0.9, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", delay: 0.5, ease: "easeInOut" }}
                    >
                        <motion.path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                            initial={false}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.1 }}
                        />
                    </motion.svg>
                    {/* Tooltip for screen readers and keyboard users */}
                    <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap"
                        role="tooltip"
                    >
                        Live active voters right now
                    </span>
                </span>

                {/* Ultra-Advanced Animated Trust Badges - batched/staggered */}
                <motion.div
                    className="flex flex-wrap gap-2 mt-1"
                    aria-label="Trusted by organizations"
                    role="list"
                    variants={badgesContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.7 }}
                >
                    {BADGES_DATA.map((badge) => (
                        <motion.span
                            key={badge.key}
                            className={`group relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text} ${badge.border} shadow-sm`}
                            tabIndex={0}
                            role="listitem"
                            aria-label={badge.name}
                            variants={badgeItem}
                            whileHover={{ scale: 1.08 }}
                            whileFocus={{ scale: 1.08 }}
                        >
                            {getBadgeIcon(badge.key)}
                            <span className="truncate">{badge.name}</span>
                            {/* Tooltip on hover/focus */}
                            <span
                                className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                role="tooltip"
                            >
                                {badge.tooltip}
                            </span>
                        </motion.span>
                    ))}
                </motion.div>
                {/* Subtext */}
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors duration-300">
                    Trusted by organizations worldwide
                </p>
            </div>
        </div>
    );
};

export default memo(HeroSocialProof);
