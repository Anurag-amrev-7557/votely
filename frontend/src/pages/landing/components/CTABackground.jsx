import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const CTABackground = ({ isVisible }) => {
    // If not visible, we can return null or a static placeholder to save memory and CPU.
    // However, to avoid layout shifts, we'll keep the container but stop animations.

    // Memoize the floating particles to avoid re-calculating random positions on every render
    const particles = useMemo(() => {
        return [...Array(7)].map((_, i) => ({
            id: i,
            top: ["18%", "32%", "60%", "75%", "22%", "48%", "68%"][i],
            left: ["12%", "80%", "30%", "65%", "55%", "78%", "40%"][i],
            delay: i * 0.4,
            duration: 2.5 + i * 0.3
        }));
    }, []);

    if (!isVisible) {
        return (
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10" aria-hidden="true">
                {/* Static or simpler background when not visible to save resources */}
                <div className="absolute inset-0 bg-blue-50/50 dark:bg-gray-900/50 opacity-20" />
            </div>
        );
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
            {/* Animated Gradient Blobs - Reduced blur radius for performance if needed, keeping visual fidelity */}
            <motion.div
                className="absolute -top-32 -left-32 w-80 sm:w-[30rem] h-80 sm:h-[30rem] rounded-full bg-gradient-to-br from-blue-400/30 via-blue-200/20 to-indigo-300/20 dark:from-blue-700/20 dark:via-blue-900/20 dark:to-indigo-800/20 blur-[90px] will-change-transform"
                animate={{
                    x: [0, 30, -20, 0],
                    y: [0, 20, -10, 0],
                    scale: [1, 1.08, 0.97, 1],
                    rotate: [0, 8, -6, 0],
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
                aria-hidden="true"
            />
            <motion.div
                className="absolute -bottom-32 -right-32 w-80 sm:w-[30rem] h-80 sm:h-[30rem] rounded-full bg-gradient-to-tr from-indigo-400/30 via-indigo-200/20 to-blue-300/20 dark:from-indigo-700/20 dark:via-blue-900/20 dark:to-blue-800/20 blur-[90px] will-change-transform"
                animate={{
                    x: [0, -30, 20, 0],
                    y: [0, -20, 10, 0],
                    scale: [1, 1.05, 0.95, 1],
                    rotate: [0, -8, 6, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
                aria-hidden="true"
            />
            {/* Parallax SVG Orbs */}
            <motion.svg
                className="absolute top-1/4 left-8 w-32 h-32 opacity-70"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden="true"
                animate={{ y: [0, 18, -12, 0] }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <defs>
                    <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#orb1)" />
            </motion.svg>
            <motion.svg
                className="absolute bottom-12 right-16 w-24 h-24 opacity-60"
                viewBox="0 0 100 100"
                fill="none"
                aria-hidden="true"
                animate={{ y: [0, -14, 10, 0] }}
                transition={{
                    duration: 19,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut"
                }}
            >
                <defs>
                    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.08" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="44" fill="url(#orb2)" />
            </motion.svg>
            {/* Animated Sparkle Particles */}
            {particles.map((p) => (
                <motion.span
                    key={p.id}
                    className="absolute w-2 h-2 rounded-full bg-white/80 shadow-lg"
                    style={{
                        top: p.top,
                        left: p.left,
                        filter: "blur(1.5px)"
                    }}
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        scale: [1, 1.3, 1],
                        y: [0, p.id % 2 === 0 ? 8 : -8, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                    aria-hidden="true"
                />
            ))}
            {/* Subtle Grid Overlay */}
            <svg
                className="absolute inset-0 w-full h-full opacity-10 dark:opacity-5 pointer-events-none"
                width="100%"
                height="100%"
                viewBox="0 0 400 400"
                fill="none"
                aria-hidden="true"
                preserveAspectRatio="none"
            >
                <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>
    );
};

export default React.memo(CTABackground);
