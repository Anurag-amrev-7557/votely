import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const CallToActionSection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'from-blue-50 to-indigo-50', [isDarkMode]);

    return (
        <section className="relative rounded-2xl overflow-hidden transition-all duration-500 will-change-[background-color,color,box-shadow,filter]" aria-labelledby="cta-main-heading" role="region" tabIndex={0}>
            {/* Visually hidden heading for accessibility */}
            <h2 id="cta-main-heading" className="sr-only">Get Started with Votely</h2>
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${sectionBg} -z-10 transition-all duration-500 will-change-[background-color,color,box-shadow,filter]`} />
            
            {/* Advanced Decorative Elements with Animated SVGs, Gradients, and Parallax */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                {/* Animated Gradient Blobs */}
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
                    initial={{ y: 0 }}
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
                    initial={{ y: 0 }}
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
                {[...Array(7)].map((_, i) => (
                    <motion.span
                        key={i}
                        className={`absolute w-2 h-2 rounded-full bg-white/80 shadow-lg`}
                        style={{
                            top: [
                                "18%", "32%", "60%", "75%", "22%", "48%", "68%"
                            ][i],
                            left: [
                                "12%", "80%", "30%", "65%", "55%", "78%", "40%"
                            ][i],
                            filter: "blur(1.5px)"
                        }}
                        animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.3, 1],
                            y: [0, i % 2 === 0 ? 8 : -8, 0]
                        }}
                        transition={{
                            duration: 2.5 + i * 0.3,
                            repeat: Infinity,
                            repeatType: "mirror",
                            delay: i * 0.4,
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

            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
                <div className="flex flex-col items-center text-center max-w-8xl mx-auto">
                    {/* CTA Tag */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow] mx-auto"
                        tabIndex={0}
                        role="status"
                        aria-label="Get Started"
                    >
                        {/* Animated Glow Effect */}
                        <span
                            className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        {/* Animated Arrow Icon */}
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
                                d="M5 12h14"
                            >
                                <animate
                                    attributeName="opacity"
                                    values="0.7;1;0.7"
                                    dur="2.2s"
                                    repeatCount="indefinite"
                                />
                            </path>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m12 5 7 7-7 7"
                            />
                            {/* Sparkle effect */}
                            <g>
                                <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                                <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                            </g>
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent text-xs sm:text-sm">
                            Get Started
                        </span>
                        {/* Tooltip on focus/hover for accessibility */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            Start your journey with Votely!
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[32px] md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4 transition-colors duration-300 will-change-[color]">
                        Ready to Transform Your Voting Experience?
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
                        Join thousands of organizations already using Votely to conduct secure, transparent, and efficient elections.
                    </p>
                    
                    {/* Advanced Features Grid with Increased Widths */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 mb-6 sm:mb-8 w-full items-stretch">
                        {/* Secure & Reliable */}
                        <div className="group relative flex flex-col sm:flex-row items-center sm:items-center gap-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-transform duration-200 h-full">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                {/* Animated Shield Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="text-green-600 dark:text-green-400 animate-pulse-slow" aria-hidden="true" focusable="false">
                                    <path d="M16 4l12 4v7c0 7.18-5.16 13.41-12 15-6.84-1.59-12-7.82-12-15V8l12-4z" fill="currentColor" fillOpacity="0.15"/>
                                    <path d="M16 4l12 4v7c0 7.18-5.16 13.41-12 15-6.84-1.59-12-7.82-12-15V8l12-4z" stroke="currentColor" strokeWidth="2"/>
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2.5s" repeatCount="indefinite"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <span className="text-gray-900 dark:text-gray-100 text-base font-semibold flex items-center gap-1">
                                    Secure &amp; Reliable
                                    <span className="ml-1">
                                        <svg className="w-5 h-5 text-green-400 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" opacity="0.15"/><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">End-to-end encryption, audit logs, and compliance.</span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded-lg bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 w-max min-w-[200px]">
                                Your votes are protected with industry-leading security.
                            </div>
                        </div>
                        {/* Easy to Use */}
                        <div className="group relative flex flex-col sm:flex-row items-center sm:items-center gap-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-transform duration-200 h-full">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                {/* Animated Lightning Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="text-blue-600 dark:text-blue-400 animate-bounce-x" aria-hidden="true" focusable="false">
                                    <path d="M16 3v13h7l-9 13v-13h-7l9-13z" fill="currentColor" fillOpacity="0.15"/>
                                    <path d="M16 3v13h7l-9 13v-13h-7l9-13z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <span className="text-gray-900 dark:text-gray-100 text-base font-semibold flex items-center gap-1">
                                    Easy to Use
                                    <span className="ml-1">
                                        <svg className="w-5 h-5 text-blue-400 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" opacity="0.15"/><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Intuitive interface, quick setup, and real-time results.</span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded-lg bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 w-max min-w-[200px]">
                                No training required. Launch your election in minutes.
                            </div>
                        </div>
                        {/* 24/7 Support */}
                        <div className="group relative flex flex-col sm:flex-row items-center sm:items-center gap-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-transform duration-200 h-full">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                {/* Animated Headset Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="text-purple-600 dark:text-purple-400 animate-fade-in" aria-hidden="true" focusable="false">
                                    <circle cx="16" cy="16" r="13" fill="currentColor" fillOpacity="0.12"/>
                                    <path d="M8 20v-3a8 8 0 0 1 16 0v3" stroke="currentColor" strokeWidth="2" fill="none"/>
                                    <rect x="7" y="20" width="4" height="6" rx="2" fill="currentColor" opacity="0.2"/>
                                    <rect x="21" y="20" width="4" height="6" rx="2" fill="currentColor" opacity="0.2"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <span className="text-gray-900 dark:text-gray-100 text-base font-semibold flex items-center gap-1">
                                    24/7 Support
                                    <span className="ml-1">
                                        <svg className="w-5 h-5 text-purple-400 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" opacity="0.15"/><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Expert help via chat, email, and phone—anytime.</span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded-lg bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 w-max min-w-[200px]">
                                Get instant answers and personalized assistance, 24/7.
                            </div>
                        </div>
                        {/* Customizable & Flexible */}
                        <div className="group relative flex flex-col sm:flex-row items-center sm:items-center gap-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-transform duration-200 h-full">
                            <div className="flex-shrink-0 mb-4 sm:mb-0">
                                {/* Animated Settings Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32" className="text-yellow-600 dark:text-yellow-400 animate-spin-slow" aria-hidden="true" focusable="false">
                                    <circle cx="16" cy="16" r="13" fill="currentColor" fillOpacity="0.12"/>
                                    <path d="M16 10a6 6 0 1 1 0 12 6 6 0 0 1 0-12zm0-5v3m0 16v3m8.66-13.66l-2.12 2.12m-13.08 13.08l-2.12 2.12m16.97-2.12l-2.12-2.12m-13.08-13.08l-2.12-2.12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <span className="text-gray-900 dark:text-gray-100 text-base font-semibold flex items-center gap-1">
                                    Customizable &amp; Flexible
                                    <span className="ml-1">
                                        <svg className="w-5 h-5 text-yellow-400 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10" opacity="0.15"/><path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                    </span>
                                </span>
                                <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">Branding, workflows, and integrations tailored to you.</span>
                            </div>
                            {/* Tooltip */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded-lg bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 w-max min-w-[200px]">
                                Make Votely your own—custom domains, APIs, and more.
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons - Advanced */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        {/* Get Started Free Button */}
                        <a
                            href="/signup"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 hover:from-blue-700 hover:via-blue-600 hover:to-blue-500 text-white text-sm sm:text-base font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 relative overflow-hidden"
                            tabIndex={0}
                            aria-label="Get Started Free with Votely"
                        >
                            {/* Animated Glow */}
                            <span
                                className="absolute -inset-2 rounded-xl bg-blue-400/20 dark:bg-blue-700/20 blur-lg pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.5s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                            {/* Animated Icon */}
                            <span className="relative z-10 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="animate-bounce-x text-white drop-shadow-[0_1px_2px_rgba(59,130,246,0.25)]"
                                    aria-hidden="true"
                                >
                                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                </svg>
                            </span>
                            <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-100 via-white to-blue-200 bg-clip-text text-transparent">
                                Get Started Free
                            </span>
                            {/* Tooltip on focus/hover for accessibility */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30"
                                role="tooltip"
                            >
                                No credit card required. Start your first election in minutes!
                            </div>
                        </a>
                        {/* Contact Sales Button */}
                        <a
                            href="/contact"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/90 dark:bg-gray-900/80 text-gray-900 dark:text-white text-sm sm:text-base font-semibold border border-gray-200 dark:border-gray-700 shadow-xl shadow-gray-500/10 transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800 relative overflow-hidden"
                            tabIndex={0}
                            aria-label="Contact Sales at Votely"
                        >
                            {/* Animated Glow */}
                            <span
                                className="absolute -inset-2 rounded-xl bg-blue-400/10 dark:bg-blue-700/10 blur-lg pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.5s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                            {/* Animated Icon */}
                            <span className="relative z-10 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="currentColor"
                                    viewBox="0 0 256 256"
                                    className="animate-bounce-x text-blue-500 dark:text-blue-300"
                                    aria-hidden="true"
                                >
                                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                </svg>
                            </span>
                            <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                                Contact Sales
                            </span>
                            {/* Tooltip on focus/hover for accessibility */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30"
                                role="tooltip"
                            >
                                Talk to our experts for custom solutions, demos, and pricing.
                            </div>
                        </a>
                        {/* Book a Demo Button */}
                        <a
                            href="https://calendly.com/votely/demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r from-purple-500 via-blue-400 to-blue-300 hover:from-purple-600 hover:via-blue-500 hover:to-blue-400 text-white text-sm sm:text-base font-semibold shadow-xl shadow-purple-400/20 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 dark:focus:ring-purple-800 relative overflow-hidden"
                            tabIndex={0}
                            aria-label="Book a Demo with Votely"
                        >
                            {/* Animated Glow */}
                            <span
                                className="absolute -inset-2 rounded-xl bg-purple-400/20 dark:bg-purple-700/20 blur-lg pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.5s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                            {/* Animated Calendar Icon */}
                            <span className="relative z-10 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="animate-spin-slow text-white"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
                                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                            <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-purple-100 via-white to-blue-100 bg-clip-text text-transparent">
                                Book a Demo
                            </span>
                            {/* Tooltip on focus/hover for accessibility */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30"
                                role="tooltip"
                            >
                                Schedule a personalized walkthrough with our team.
                            </div>
                        </a>
                    </div>

                    {/* Trust indicators - Advanced */}
                    <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                            </svg>
                            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium">
                                Trusted by <span className="font-semibold text-blue-600 dark:text-blue-400">10,000+</span> organizations worldwide
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-90">
                            {/* Microsoft */}
                            <div className="relative group h-6 sm:h-8 w-auto grayscale hover:grayscale-0 dark:invert transition-all duration-300">
                                <svg className="h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft" aria-hidden="true" focusable="false">
                                    <title>Microsoft</title>
                                    <desc>Microsoft logo</desc>
                                    <path d="M0 0h23v23H0z" fill="#f3f3f3"/>
                                    <path d="M11.5 11.5H0V0h11.5v11.5z" fill="#f35325"/>
                                    <path d="M23 11.5H11.5V0H23v11.5z" fill="#81bc06"/>
                                    <path d="M11.5 23H0V11.5h11.5V23z" fill="#05a6f0"/>
                                    <path d="M23 23H11.5V11.5H23V23z" fill="#ffba08"/>
                                </svg>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 whitespace-nowrap">
                                    Microsoft
                                </span>
                            </div>
                            {/* Google */}
                            <div className="relative group h-6 sm:h-8 w-auto grayscale hover:grayscale-0 dark:invert transition-all duration-300">
                                <svg className="h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google" aria-hidden="true" focusable="false">
                                    <title>Google</title>
                                    <desc>Google logo</desc>
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 whitespace-nowrap">
                                    Google
                                </span>
                            </div>
                            {/* Amazon */}
                            <div className="relative group h-6 sm:h-8 w-auto grayscale hover:grayscale-0 dark:invert transition-all duration-300">
                                <svg className="h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Amazon" aria-hidden="true" focusable="false">
                                    <title>Amazon</title>
                                    <desc>Amazon logo</desc>
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43 2.5 4.5 5.5 8.5 8.5 12.5 27.5 35.5 60.5 60 116.5 60 81 0 123.5-62.5 123.5-150.5 0-66.5-53.5-115.5-123.5-115.5-27.5 0-55 10-82.5 25.5-27.5 15.5-55 31-82.5 31-27.5 0-55-15.5-82.5-31-27.5-15.5-55-25.5-82.5-25.5-70 0-123.5 49-123.5 115.5 0 88 42.5 150.5 123.5 150.5 56 0 89-24.5 116.5-60 3-4 6-8 8.5-12.5 45.5 71 134.8 66.5 183.5 43 0-102-120.8-115.7-169.5-117.5z" fill="currentColor"/>
                                </svg>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 whitespace-nowrap">
                                    Amazon
                                </span>
                            </div>
                            {/* IBM */}
                            <div className="relative group h-6 sm:h-8 w-auto grayscale hover:grayscale-0 dark:invert transition-all duration-300">
                                <svg className="h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IBM" aria-hidden="true" focusable="false">
                                    <title>IBM</title>
                                    <desc>IBM logo</desc>
                                    <path d="M22.362 5.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75zM22.362 11.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75zM22.362 17.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75z" fill="currentColor"/>
                                </svg>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 whitespace-nowrap">
                                    IBM
                                </span>
                            </div>
                            {/* Oracle */}
                            <div className="relative group h-6 sm:h-8 w-auto grayscale hover:grayscale-0 dark:invert transition-all duration-300">
                                <svg className="h-full w-auto drop-shadow-lg group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Oracle" aria-hidden="true" focusable="false">
                                    <title>Oracle</title>
                                    <desc>Oracle logo</desc>
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                                </svg>
                                <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 z-30 whitespace-nowrap">
                                    Oracle
                                </span>
                            </div>
                            {/* Add more logos as needed */}
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/>
                                </svg>
                                <span className="text-xs text-gray-500 dark:text-gray-400">SOC 2 Type II</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/>
                                </svg>
                                <span className="text-xs text-gray-500 dark:text-gray-400">GDPR Compliant</span>
                            </div>
                            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">|</span>
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"/>
                                </svg>
                                <span className="text-xs text-gray-500 dark:text-gray-400">99.99% Uptime SLA</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <svg className="w-4 h-4 text-blue-500 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13h-2v6h6v-2h-4V5z"/>
                            </svg>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                <span className="font-semibold text-blue-600 dark:text-blue-400">4.9/5</span> average customer rating
                                <span className="ml-1 text-yellow-400">★★★★★</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(CallToActionSection);