import React from 'react';
import { motion } from 'framer-motion';

const FooterBackground = () => {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
            aria-hidden="true"
        >
            {/* Animated blue orb top-left (light/dark responsive) */}
            <div
                className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-60 dark:opacity-70 animate-pulse-orb"
                style={{
                    background:
                        "radial-gradient(circle at 30% 30%, var(--footer-orb-blue1, #3b82f6) 60%, var(--footer-orb-blue2, #a5b4fc) 100%)",
                    animationDelay: "0s"
                }}
            >
            </div>
            {/* Animated indigo orb bottom-right (light/dark responsive) */}
            <div
                className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-60 dark:opacity-70 animate-pulse-orb"
                style={{
                    background:
                        "radial-gradient(circle at 70% 70%, var(--footer-orb-indigo1, #6366f1) 60%, var(--footer-orb-indigo2, #c7d2fe) 100%)",
                    animationDelay: "1.2s"
                }}
            >
            </div>
            {/* Animated purple orb center with pulse and color shift (light/dark responsive) */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-40 dark:opacity-50 animate-pulse-orb"
                style={{
                    background:
                        "radial-gradient(circle at 50% 50%, var(--footer-orb-purple1, #a78bfa) 60%, var(--footer-orb-purple2, #f3e8ff) 100%)",
                    animationDelay: "2.4s"
                }}
            >
            </div>
            {/* Subtle animated lines with color mode adaptation */}
            <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[120px] opacity-30 dark:opacity-25"
                viewBox="0 0 420 120"
                fill="none"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id="footer-line-gradient-light" x1="0" y1="60" x2="420" y2="60" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6366f1" stopOpacity="0.18" />
                        <stop offset="0.5" stopColor="#3b82f6" stopOpacity="0.32" />
                        <stop offset="1" stopColor="#a78bfa" stopOpacity="0.18" />
                    </linearGradient>
                    <linearGradient id="footer-line-gradient-dark" x1="0" y1="60" x2="420" y2="60" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#818cf8" stopOpacity="0.22" />
                        <stop offset="0.5" stopColor="#60a5fa" stopOpacity="0.38" />
                        <stop offset="1" stopColor="#c4b5fd" stopOpacity="0.22" />
                    </linearGradient>
                </defs>
                {/* Light mode line */}
                <motion.path
                    d="M10 60 Q 110 10 210 60 T 410 60"
                    stroke="url(#footer-line-gradient-light)"
                    strokeWidth="2.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.18 }}
                    animate={{ pathLength: 1, opacity: [0.18, 0.5, 0.18] }}
                    transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                    className="dark:hidden"
                />
                {/* Dark mode line */}
                <motion.path
                    d="M10 60 Q 110 10 210 60 T 410 60"
                    stroke="url(#footer-line-gradient-dark)"
                    strokeWidth="2.5"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0.18 }}
                    animate={{ pathLength: 1, opacity: [0.18, 0.5, 0.18] }}
                    transition={{
                        duration: 3.2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                    className="hidden dark:inline"
                />
            </svg>
            {/* Floating animated sparkles with color and blur adaptation */}
            <div className="absolute inset-0 pointer-events-none z-10">
                {[...Array(7)].map((_, i) => (
                    <span
                        key={i}
                        className={`
                            absolute w-2 h-2 rounded-full
                            bg-blue-400/70 dark:bg-blue-300/70
                            blur-[2.5px] animate-float-sparkle
                            sparkle-${i}
                            shadow-[0_0_8px_2px_rgba(59,130,246,0.18)]
                            dark:shadow-[0_0_10px_3px_rgba(165,180,252,0.22)]
                        `}
                        style={{
                            top: `${12 + i * 10 + (i % 2 === 0 ? 4 : -4)}%`,
                            left: `${8 + i * 12 + (i % 3 === 0 ? 6 : -6)}%`,
                            animationDelay: `${i * 0.5}s`
                        }}
                    />
                ))}
            </div>
            {/* Extra: Subtle animated grid overlay for depth */}
            <svg
                className="absolute inset-0 w-full h-full opacity-10 dark:opacity-15"
                viewBox="0 0 400 120"
                fill="none"
                aria-hidden="true"
            >
                <motion.rect
                    x="0"
                    y="0"
                    width="400"
                    height="120"
                    fill="url(#footer-grid-gradient)"
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: [0.1, 0.18, 0.1] }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut"
                    }}
                />
                <defs>
                    <linearGradient id="footer-grid-gradient" x1="0" y1="0" x2="400" y2="120" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3b82f6" stopOpacity="0.08" />
                        <stop offset="1" stopColor="#a78bfa" stopOpacity="0.08" />
                    </linearGradient>
                </defs>
            </svg>
            <style>
                {`
                    /* Color variables for light/dark mode */
                    :root {
                        --footer-orb-blue1: #3b82f6;
                        --footer-orb-blue2: #a5b4fc;
                        --footer-orb-indigo1: #6366f1;
                        --footer-orb-indigo2: #c7d2fe;
                        --footer-orb-purple1: #a78bfa;
                        --footer-orb-purple2: #f3e8ff;
                    }
                    @media (prefers-color-scheme: dark) {
                        :root {
                            --footer-orb-blue1: #60a5fa;
                            --footer-orb-blue2: #818cf8;
                            --footer-orb-indigo1: #818cf8;
                            --footer-orb-indigo2: #c7d2fe;
                            --footer-orb-purple1: #c4b5fd;
                            --footer-orb-purple2: #ede9fe;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default FooterBackground;
