import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import React, { useState } from 'react';

const Footer = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState('');

    const handleStubClick = (label) => (e) => {
        e.preventDefault();
        setModalContent(label);
        setModalOpen(true);
    };

    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800" role="contentinfo" aria-label="Footer" tabIndex={0}>
            {/* Skip to content link for keyboard users */}
            <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 z-50 bg-blue-600 text-white px-4 py-2 rounded focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Skip to main content</a>
            {/* Top Border Gradient */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Newsletter Section */}
                <div className="mb-8 sm:mb-12 p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    {/* Ultra-Advanced Decorative Elements with Animation, Accessibility, and Responsive Light/Dark Mode */}
                    <div
                        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0"
                        aria-hidden="true"
                    >
                        {/* Animated blue orb top-left (light/dark responsive) */}
                        <motion.div
                            className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl opacity-60 dark:opacity-70"
                            style={{
                                background:
                                    "radial-gradient(circle at 30% 30%, var(--footer-orb-blue1, #3b82f6) 60%, var(--footer-orb-blue2, #a5b4fc) 100%)"
                            }}
                            initial={{ scale: 0.92, opacity: 0.4 }}
                            animate={{ scale: [0.92, 1.08, 1], opacity: [0.4, 0.7, 0.6, 0.7, 0.4] }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut"
                            }}
                        >
                            <span className="sr-only">Blue decorative orb</span>
                        </motion.div>
                        {/* Animated indigo orb bottom-right (light/dark responsive) */}
                        <motion.div
                            className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-60 dark:opacity-70"
                            style={{
                                background:
                                    "radial-gradient(circle at 70% 70%, var(--footer-orb-indigo1, #6366f1) 60%, var(--footer-orb-indigo2, #c7d2fe) 100%)"
                            }}
                            initial={{ scale: 1.08, opacity: 0.4 }}
                            animate={{ scale: [1.08, 0.95, 1], opacity: [0.4, 0.7, 0.6, 0.7, 0.4] }}
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                                delay: 1.2
                            }}
                        >
                            <span className="sr-only">Indigo decorative orb</span>
                        </motion.div>
                        {/* Animated purple orb center with pulse and color shift (light/dark responsive) */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-40 dark:opacity-50"
                            style={{
                                background:
                                    "radial-gradient(circle at 50% 50%, var(--footer-orb-purple1, #a78bfa) 60%, var(--footer-orb-purple2, #f3e8ff) 100%)"
                            }}
                            initial={{ scale: 0.98, opacity: 0.35, rotate: 0 }}
                            animate={{
                                scale: [0.98, 1.08, 1, 0.98],
                                opacity: [0.35, 0.6, 0.45, 0.35],
                                rotate: [0, 8, -8, 0]
                            }}
                            transition={{
                                duration: 5.2,
                                repeat: Infinity,
                                repeatType: "loop",
                                ease: "easeInOut"
                            }}
                        >
                            <span className="sr-only">Purple decorative orb</span>
                        </motion.div>
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
                                <motion.span
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
                                        left: `${8 + i * 12 + (i % 3 === 0 ? 6 : -6)}%`
                                    }}
                                    initial={{ opacity: 0.7, scale: 0.9 }}
                                    animate={{
                                        opacity: [0.7, 1, 0.7],
                                        scale: [0.9, 1.2, 0.9],
                                        filter: [
                                            "blur(2.5px)",
                                            "blur(4px)",
                                            "blur(2.5px)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 3.5 + i * 0.2,
                                        repeat: Infinity,
                                        repeatType: "mirror",
                                        delay: i * 0.5,
                                        ease: "easeInOut"
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
                        {/* Custom styles for advanced effects */}
                        <style>
                            {`
                                @keyframes pulse-orb {
                                    0%, 100% { opacity: 0.40; transform: scale(1);}
                                    50% { opacity: 0.60; transform: scale(1.08);}
                                }
                                @keyframes float-sparkle {
                                    0% { transform: translateY(0) scale(1);}
                                    50% { transform: translateY(-12px) scale(1.2);}
                                    100% { transform: translateY(0) scale(1);}
                                }
                                .animate-float-sparkle {
                                    animation: float-sparkle 3.5s ease-in-out infinite;
                                }
                                /* Unique delays for sparkles */
                                .sparkle-0 { animation-delay: 0.2s; }
                                .sparkle-1 { animation-delay: 0.8s; }
                                .sparkle-2 { animation-delay: 1.4s; }
                                .sparkle-3 { animation-delay: 2.1s; }
                                .sparkle-4 { animation-delay: 2.7s; }
                                .sparkle-5 { animation-delay: 3.3s; }
                                .sparkle-6 { animation-delay: 3.9s; }
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
                    
                    <div className="max-w-2xl mx-auto text-center relative">
                        {/* Advanced Animated Newsletter Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow]"
                            tabIndex={0}
                            role="status"
                            aria-label="Newsletter Subscription"
                        >
                            {/* Animated Glow Effect */}
                            <span
                                className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.8s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                            {/* Animated Envelope Icon */}
                            <svg
                                className="relative z-10 w-5 h-5 text-blue-500 dark:text-blue-300 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                >
                                    <animate
                                        attributeName="opacity"
                                        values="0.7;1;0.7"
                                        dur="2.2s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                                {/* Sparkle effect */}
                                <g>
                                    <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                    <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                                    <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                                </g>
                            </svg>
                            <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                                Newsletter
                            </span>
                            {/* Tooltip on focus/hover for accessibility */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                                role="tooltip"
                            >
                                Get exclusive updates and tips in your inbox!
                            </div>
                        </div>
                        {/* Animated Heading with Gradient and Subtle Motion */}
                        <h3
                            className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 relative"
                            tabIndex={0}
                            aria-label="Stay Updated with Votely"
                        >
                            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                                Stay Updated with Votely
                            </span>
                            {/* Animated underline */}
                            <span
                                className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-gradient-to-r from-blue-400/40 via-blue-500/60 to-purple-400/40 rounded-full blur-sm opacity-80 pointer-events-none"
                                aria-hidden="true"
                                style={{
                                    animation: "pulse-orb 2.5s ease-in-out infinite"
                                }}
                            />
                        </h3>
                        {/* Animated Description with Fade-in and Accessibility */}
                        <p
                            className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-lg mx-auto transition-opacity duration-700 will-change-[opacity] animate-fade-in"
                            style={{ animationDelay: "0.15s" }}
                            tabIndex={0}
                            aria-label="Get the latest updates on new features, security enhancements, and best practices for secure voting."
                        >
                            <span className="inline-block align-middle">
                                Get the latest updates on&nbsp;
                                <span className="font-semibold text-blue-600 dark:text-blue-400">new features</span>
                                ,&nbsp;
                                <span className="font-semibold text-blue-600 dark:text-blue-400">security enhancements</span>
                                , and&nbsp;
                                <span className="font-semibold text-blue-600 dark:text-blue-400">best practices</span>
                                &nbsp;for secure voting.
                            </span>
                        </p>

                        {/* Advanced Features Grid with Animation, Tooltips, and Accessibility */}
                        <div
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
                            role="list"
                            aria-label="Newsletter Features"
                        >
                            {/* Feature: Weekly Updates */}
                            <div
                                className="group relative flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400"
                                tabIndex={0}
                                role="listitem"
                                aria-label="Weekly Updates"
                            >
                                {/* Animated Icon */}
                                <svg
                                    className="w-5 h-5 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                    <animate
                                        attributeName="stroke-dasharray"
                                        from="0,24"
                                        to="24,0"
                                        dur="0.7s"
                                        fill="freeze"
                                        begin="0.1s"
                                    />
                                </svg>
                                <span className="font-medium">Weekly Updates</span>
                                {/* Tooltip */}
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                    role="tooltip"
                                >
                                    Get a summary of the latest features and improvements every week.
                                </span>
                                {/* Animated highlight ring */}
                                <span
                                    className="absolute -inset-1 rounded-lg pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                                        opacity: 0.12,
                                        transition: "opacity 0.18s"
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                            {/* Feature: Security Tips */}
                            <div
                                className="group relative flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400"
                                tabIndex={0}
                                role="listitem"
                                aria-label="Security Tips"
                            >
                                {/* Animated Icon */}
                                <svg
                                    className="w-5 h-5 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                    <animate
                                        attributeName="stroke-dasharray"
                                        from="0,24"
                                        to="24,0"
                                        dur="0.7s"
                                        fill="freeze"
                                        begin="0.25s"
                                    />
                                </svg>
                                <span className="font-medium">Security Tips</span>
                                {/* Tooltip */}
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                    role="tooltip"
                                >
                                    Actionable advice to keep your voting experience safe and secure.
                                </span>
                                {/* Animated highlight ring */}
                                <span
                                    className="absolute -inset-1 rounded-lg pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                                        opacity: 0.12,
                                        transition: "opacity 0.18s"
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                            {/* Feature: Best Practices */}
                            <div
                                className="group relative flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400"
                                tabIndex={0}
                                role="listitem"
                                aria-label="Best Practices"
                            >
                                {/* Animated Icon */}
                                <svg
                                    className="w-5 h-5 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                    <animate
                                        attributeName="stroke-dasharray"
                                        from="0,24"
                                        to="24,0"
                                        dur="0.7s"
                                        fill="freeze"
                                        begin="0.4s"
                                    />
                                </svg>
                                <span className="font-medium">Best Practices</span>
                                {/* Tooltip */}
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                    role="tooltip"
                                >
                                    Learn how to get the most out of Votely with expert tips and guides.
                                </span>
                                {/* Animated highlight ring */}
                                <span
                                    className="absolute -inset-1 rounded-lg pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                                        opacity: 0.12,
                                        transition: "opacity 0.18s"
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        {/* Advanced Newsletter Subscription Form with Animation, Validation, Accessibility, and Feedback */}
                        <form
                            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-in-up will-change-[opacity,transform]"
                            autoComplete="off"
                            aria-label="Newsletter Subscription Form"
                            tabIndex={0}
                            role="form"
                            onSubmit={e => { e.preventDefault(); /* handle submit here */ }}
                        >
                            {/* Animated Input with Floating Label and Icon */}
                            <div className="flex-1 relative group">
                                <input
                                    type="email"
                                    name="newsletter-email"
                                    id="newsletter-email"
                                    required
                                    autoComplete="email"
                                    placeholder=" "
                                    aria-label="Email address"
                                    className={`
                                        peer w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700
                                        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                        transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-700
                                        shadow-sm focus:shadow-md
                                        will-change-[box-shadow,border-color]
                                    `}
                                />
                                {/* Floating Label */}
                                <label
                                    htmlFor="newsletter-email"
                                    className={`
                                        absolute left-4 top-2.5 sm:top-3 text-gray-400 dark:text-gray-500
                                        text-sm pointer-events-none transition-all duration-200
                                        peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base
                                        peer-placeholder-shown:text-gray-400 peer-focus:-top-3 peer-focus:text-xs
                                        peer-focus:text-blue-600 dark:peer-focus:text-blue-400
                                        bg-white dark:bg-gray-800 px-1 rounded
                                    `}
                                    aria-hidden="true"
                                >
                                    Enter your email
                                </label>
                                {/* Animated Icon */}
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 animate-float-sparkle"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            values="0.7;1;0.7"
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                        />
                                    </svg>
                                </div>
                                {/* Animated Glow Effect */}
                                <span
                                    className="absolute -inset-1.5 rounded-lg bg-blue-400/10 dark:bg-blue-700/10 blur-lg pointer-events-none z-0"
                                    style={{
                                        animation: "pulse-orb 2.8s ease-in-out infinite"
                                    }}
                                    aria-hidden="true"
                                />
                            </div>
                            {/* Animated Subscribe Button with Loading State */}
                            <button
                                type="submit"
                                className={`
                                    relative w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700
                                    hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200
                                    flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-lg
                                    hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400
                                    will-change-[transform,box-shadow]
                                    group/button
                                `}
                                aria-label="Subscribe to newsletter"
                                tabIndex={0}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    <span className="inline-block">Subscribe</span>
                                    {/* Animated Arrow Icon */}
                                    <svg
                                        className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                        <animate
                                            attributeName="opacity"
                                            values="0.7;1;0.7"
                                            dur="1.5s"
                                            repeatCount="indefinite"
                                        />
                                    </svg>
                                </span>
                                {/* Loading Spinner (hidden by default, show on submit) */}
                                <span
                                    className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-[.loading]/button:inline-block"
                                    aria-live="polite"
                                    aria-busy="true"
                                >
                                    <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                </span>
                                {/* Animated Glow Under Button */}
                                <span
                                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-gradient-to-r from-blue-400/40 via-blue-500/60 to-purple-400/40 rounded-full blur-sm opacity-80 pointer-events-none"
                                    aria-hidden="true"
                                    style={{
                                        animation: "pulse-orb 2.5s ease-in-out infinite"
                                    }}
                                />
                            </button>
                        </form>
                        {/* Animated Success/Error Feedback (hidden by default, show on submit) */}
                        <div
                            className="w-full max-w-md mx-auto mt-2"
                            aria-live="polite"
                            aria-atomic="true"
                        >
                            {/* Example: Success message */}
                            <div className="hidden animate-fade-in bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700/40 dark:text-green-300 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2" role="status">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Subscribed! Please check your inbox.
                            </div>
                            {/* Example: Error message */}
                            <div className="hidden animate-fade-in bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-300 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2" role="alert">
                                <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Oops! Please enter a valid email address.
                            </div>
                        </div>
                        {/* Policy Notice with Animated Underline and Accessibility */}
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 text-center animate-fade-in" tabIndex={0}>
                            By subscribing, you agree to our{" "}
                            <Link
                                to="/privacy-policy"
                                className="text-blue-600 dark:text-blue-400 hover:underline focus:underline underline-offset-2 transition-colors duration-150 relative"
                                tabIndex={0}
                                aria-label="Read our Privacy Policy"
                            >
                                Privacy Policy
                                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-200 origin-left" aria-hidden="true"></span>
                            </Link>
                            {" "}and{" "}
                            <Link
                                to="/terms-of-service"
                                className="text-blue-600 dark:text-blue-400 hover:underline focus:underline underline-offset-2 transition-colors duration-150 relative"
                                tabIndex={0}
                                aria-label="Read our Terms of Service"
                            >
                                Terms of Service
                                <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-200 origin-left" aria-hidden="true"></span>
                            </Link>.
                        </p>
                        <div
                            className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 animate-fade-in"
                            role="list"
                            aria-label="Subscription Security and Privacy Features"
                        >
                            {/* Secure & Private */}
                            <span
                                className="group relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer"
                                tabIndex={0}
                                role="listitem"
                                aria-label="Secure & Private"
                            >
                                {/* Animated Lock Icon */}
                                <svg
                                    className="w-4 h-4 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                    <animate
                                        attributeName="stroke-dasharray"
                                        from="0,24"
                                        to="24,0"
                                        dur="0.7s"
                                        fill="freeze"
                                        begin="0.2s"
                                    />
                                </svg>
                                <span className="font-medium">Secure &amp; Private</span>
                                {/* Tooltip */}
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                    role="tooltip"
                                >
                                    Your email is encrypted and never shared. We use industry-leading security.
                                </span>
                                {/* Animated highlight ring */}
                                <span
                                    className="absolute -inset-1 rounded-lg pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                                        opacity: 0.12,
                                        transition: "opacity 0.18s"
                                    }}
                                    aria-hidden="true"
                                />
                            </span>
                            {/* Divider Dot */}
                            <span
                                className="hidden sm:inline text-gray-400 dark:text-gray-500 select-none"
                                aria-hidden="true"
                            >
                                <svg className="w-1.5 h-1.5 mx-1" viewBox="0 0 6 6" fill="currentColor">
                                    <circle cx="3" cy="3" r="3" />
                                </svg>
                            </span>
                            {/* Unsubscribe Anytime */}
                            <span
                                className="group relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer"
                                tabIndex={0}
                                role="listitem"
                                aria-label="Unsubscribe Anytime"
                            >
                                {/* Animated Envelope Icon */}
                                <svg
                                    className="w-4 h-4 text-blue-500 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)] animate-fade-in"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    >
                                        <animate
                                            attributeName="opacity"
                                            values="0.7;1;0.7"
                                            dur="2.2s"
                                            repeatCount="indefinite"
                                        />
                                    </path>
                                    {/* Sparkle effect */}
                                    <g>
                                        <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="0.7" fill="#60a5fa" opacity="0.7" />
                                        <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.5" fill="#818cf8" opacity="0.6" />
                                    </g>
                                </svg>
                                <span className="font-medium">Unsubscribe Anytime</span>
                                {/* Tooltip */}
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                                    role="tooltip"
                                >
                                    No spam. Opt out with a single click at any time.
                                </span>
                                {/* Animated highlight ring */}
                                <span
                                    className="absolute -inset-1 rounded-lg pointer-events-none"
                                    style={{
                                        background: "linear-gradient(90deg,rgba(59,130,246,0.08) 0%,rgba(34,197,94,0.02) 100%)",
                                        opacity: 0.12,
                                        transition: "opacity 0.18s"
                                    }}
                                    aria-hidden="true"
                                />
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Company Info */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                    Votely
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Secure, transparent, and efficient voting solutions for organizations worldwide.
                        </p>
                        <div className="flex gap-4">
                            {/* Twitter/X */}
                            <a onClick={handleStubClick('Votely on Twitter')} aria-label="Votely on Twitter" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a onClick={handleStubClick('Votely on LinkedIn')} aria-label="Votely on LinkedIn" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            {/* GitHub */}
                            <a onClick={handleStubClick('Votely on GitHub')} aria-label="Votely on GitHub" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Product</h3>
                        <div className="flex flex-col gap-2">
                            <a href="/#features-heading" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Features</a>
                            <a href="/#pricing" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Pricing</a>
                            <a href="/#security" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Security</a>
                            <Link to="/enterprise" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Enterprise</Link>
                            <Link to="/changelog" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Changelog</Link>
                        </div>
                    </div>

                    {/* Resources Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Resources</h3>
                        <div className="flex flex-col gap-2">
                            <Link to="/documentation" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Documentation</Link>
                            <Link to="/guides" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Guides</Link>
                            <Link to="/api-reference" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>API Reference</Link>
                            <Link to="/community" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Community</Link>
                            <Link to="/status" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Status</Link>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Company</h3>
                        <div className="flex flex-col gap-2">
                            <Link to="/about" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>About</Link>
                            <Link to="/blog" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Blog</Link>
                            <Link to="/careers" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Careers</Link>
                            <Link to="/contact" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Contact</Link>
                            <Link to="/partners" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:ring-2 focus-visible:ring-blue-400/70" tabIndex={0}>Partners</Link>
                        </div>
                    </div>
                </div>

                {/* Enhanced Bottom Section */}
                <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        {/* Copyright & Tagline */}
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <span>
                                <svg className="inline-block w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14.5A6.5 6.5 0 1110 17.5 6.5 6.5 0 0110 3.5zm0 2.25a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zm0 1.5a2.75 2.75 0 110 5.5 2.75 2.75 0 010-5.5z"/>
                                </svg>
                                2025 Votely
                            </span>
                            <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></span>
                            <span className="hidden sm:inline">Democracy powered by technology</span>
                            <span className="sm:hidden">Empowering voters</span>
                        </div>
                        {/* Footer Navigation with tooltips and icons */}
                        <nav className="flex items-center gap-4 sm:gap-6" role="navigation" aria-label="Footer navigation">
                            <Link
                                to="/privacy-policy"
                                className="group relative flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                aria-label="Privacy Policy"
                                tabIndex={0}
                            >
                                <svg className="w-4 h-4 mr-1 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M12 3v1m0 0a9 9 0 019 9v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a9 9 0 019-9z" />
                                </svg>
                                Privacy
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20">
                                    Read our privacy policy
                                </span>
                            </Link>
                            <Link
                                to="/terms-of-service"
                                className="group relative flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                aria-label="Terms"
                                tabIndex={0}
                            >
                                <svg className="w-4 h-4 mr-1 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M8 17l4 4 4-4m-4-5v9" />
                                </svg>
                                Terms
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20">
                                    View terms of service
                                </span>
                            </Link>
                            <Link
                                to="/cookies-policy"
                                className="group relative flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                aria-label="Cookies"
                                tabIndex={0}
                            >
                                <svg className="w-4 h-4 mr-1 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="1.5" />
                                    <circle cx="16" cy="8" r="1" />
                                    <circle cx="8" cy="16" r="1" />
                                </svg>
                                Cookies
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20">
                                    Cookie preferences
                                </span>
                            </Link>
                            <Link
                                to="/accessibility-statement"
                                className="group relative flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                aria-label="Accessibility"
                                tabIndex={0}
                            >
                                <svg className="w-4 h-4 mr-1 text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-200 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                                    <circle cx="12" cy="7" r="4" />
                                    <path d="M12 11v7m-4 0h8" />
                                </svg>
                                Accessibility
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-90 group-focus:opacity-90 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20">
                                    Accessibility statement
                                </span>
                            </Link>
                        </nav>
                    </div>
                    {/* Subtle animated accent bar */}
                    <div className="mt-6 h-1 w-24 mx-auto bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full blur-[2px] opacity-70 animate-pulse" aria-hidden="true"></div>
                </div>
            </div>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50"
                    style={{ pointerEvents: 'auto' }}
                >
                    <div
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-lg"
                        style={{ minWidth: 320 }}
                    >
                        <button
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white"
                            onClick={() => setModalOpen(false)}
                            aria-label="Close modal"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold mb-2">{modalContent}</h2>
                        <p className="mb-4">This page is under construction. Please check back soon!</p>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;