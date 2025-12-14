import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';

const ScrollIndicator = () => {
    const handleScrollClick = useCallback(() => {
        const next = document.querySelector('[data-hero-next]');
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, []);

    return (
        <motion.div
            className="absolute left-1/2 bottom-0 mb-4 sm:mb-4 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 60 }}
            aria-label="Scroll down indicator"
            tabIndex={0}
            role="presentation"
        >
            {/* Animated "Scroll to explore" with gradient shimmer */}
            <motion.div
                className="relative text-gray-500 dark:text-gray-400 text-sm font-semibold transition-colors duration-300 will-change-[color] select-none"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
            >
                <span className="relative z-10">Scroll to explore</span>
                <motion.span
                    className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-blue-400/30 via-transparent to-blue-400/30 rounded blur-sm pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.7, 0], x: [0, 20, 0] }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 1.2,
                    }}
                />
            </motion.div>
            {/* Interactive Mouse/Touch Scroll Icon */}
            <motion.button
                type="button"
                aria-label="Scroll down"
                tabIndex={0}
                className="group w-8 h-14 rounded-full border-2 border-gray-300 dark:border-gray-600 flex flex-col items-center justify-start p-1.5 bg-white/70 dark:bg-[#23272f]/70 shadow-lg hover:scale-105 focus:scale-105 active:scale-95 transition-all duration-200 will-change-[transform,border-color,background-color] outline-none ring-0 focus-visible:ring-2 focus-visible:ring-blue-400"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 80 }}
                onClick={handleScrollClick}
            >
                {/* Mouse body */}
                <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    width="32"
                    height="56"
                    viewBox="0 0 32 56"
                    fill="none"
                    aria-hidden="true"
                >
                    <rect
                        x="4"
                        y="4"
                        width="24"
                        height="48"
                        rx="12"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-300 dark:text-gray-600"
                        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.04))" }}
                    />
                </svg>
                {/* Animated dot */}
                <motion.div
                    className="relative z-10 w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 shadow-md"
                    animate={{
                        y: [0, 18, 0],
                        opacity: [1, 1, 0.7, 1],
                        scale: [1, 1.1, 1, 1],
                    }}
                    transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                />
                {/* Animated chevrons */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
                    <motion.svg
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                        className="text-blue-400 dark:text-blue-500"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: [0, 1, 0], y: [0, 4, 8] }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: 0.2,
                        }}
                        aria-hidden="true"
                    >
                        <path d="M2 2l6 4 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                    <motion.svg
                        width="16"
                        height="8"
                        viewBox="0 0 16 8"
                        fill="none"
                        className="text-blue-300 dark:text-blue-400"
                        initial={{ opacity: 0, y: -2 }}
                        animate={{ opacity: [0, 0.7, 0], y: [0, 2, 6] }}
                        transition={{
                            duration: 1.6,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: 0.5,
                        }}
                        aria-hidden="true"
                    >
                        <path d="M2 2l6 4 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                </div>
            </motion.button>
            {/* Optional: Keyboard hint */}
            <motion.div
                className="hidden @[480px]:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
                aria-hidden="true"
            >
                <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono">↓</kbd>
                <span>or scroll</span>
            </motion.div>
        </motion.div>
    );
};

export default memo(ScrollIndicator);
