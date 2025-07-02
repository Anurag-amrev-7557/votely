import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const SecurityFeature = ({ icon, title, description }) => (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 will-change-[background-color]">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg w-fit transition-colors duration-300 will-change-[background-color]">
            {icon}
        </div>
        <h3 className="text-gray-900 dark:text-white font-semibold transition-colors duration-300 will-change-[color]">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300 will-change-[color]">{description}</p>
    </div>
);

const SecuritySection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);

    return (
        <section className={`max-w-7xl mx-auto ${sectionBg} transition-all duration-500 will-change-[background-color,color,box-shadow,filter]`}>
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-center max-w-3xl mx-auto"
                >
                    {/* Advanced Animated Security Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mx-auto relative group transition-all duration-500 will-change-[background-color,color,box-shadow]"
                        tabIndex={0}
                        role="status"
                        aria-label="Enterprise Security"
                    >
                        {/* Animated Glow Effect */}
                        <span
                            className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        {/* Animated Shield Icon */}
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
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
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
                            Enterprise Security
                        </span>
                        {/* Tooltip on focus/hover for accessibility */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            Advanced protection for your data and votes.
                        </div>
                    </motion.div>

                    <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl transition-colors duration-300 will-change-[color]">
                        Enterprise-Grade Security
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base transition-colors duration-300 will-change-[color]">
                        Our platform employs state-of-the-art security measures to safeguard the voting process and protect voter data.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 gap-6">
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                            </svg>
                        }
                        title="End-to-End Encryption"
                        description="All data is encrypted in transit and at rest using industry-standard encryption protocols."
                    />
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                <path d="M12 15v2" />
                                <path d="M8 15v2" />
                                <path d="M16 15v2" />
                            </svg>
                        }
                        title="Multi-Factor Authentication"
                        description="Secure access with multiple verification methods to prevent unauthorized access."
                    />
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                <path d="M9 12l2 2 4-4" />
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                            </svg>
                        }
                        title="Regular Security Audits"
                        description="Continuous monitoring and regular third-party security assessments."
                    />
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                <path d="M9 12l2 2 4-4" />
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                            </svg>
                        }
                        title="Vote Verification"
                        description="Each vote is cryptographically signed and can be independently verified."
                    />
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                            </svg>
                        }
                        title="DDoS Protection"
                        description="Advanced protection against distributed denial-of-service attacks."
                    />
                    <SecurityFeature
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-blue-600 dark:text-blue-400"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                            </svg>
                        }
                        title="Data Privacy"
                        description="Strict data protection measures in compliance with global privacy regulations."
                    />
                </div>

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>ISO 27001 Certified</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        <span>GDPR Compliant</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default React.memo(SecuritySection);

