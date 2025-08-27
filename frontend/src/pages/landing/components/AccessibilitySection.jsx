import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const AccessibilityFeature = ({ icon, title, description }) => (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-fit">
            {icon}
        </div>
        <h3 className="text-gray-900 dark:text-white font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
);

const AccessibilitySection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);

    return (
        <section className={`max-w-7xl mx-auto ${sectionBg} transition-all duration-500 will-change-[background-color,color,box-shadow,filter]`} aria-labelledby="accessibility-main-heading" role="region" tabIndex={0}>
            <h2 id="accessibility-main-heading" className="sr-only">Accessibility Commitment</h2>
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-center max-w-3xl mx-auto"
                >
                    {/* Advanced Animated Accessibility Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/30 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-semibold shadow-lg ring-1 ring-purple-200 dark:ring-purple-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow] mx-auto"
                        tabIndex={0}
                        role="status"
                        aria-label="Universal Access"
                    >
                        {/* Animated Glow Effect */}
                        <span
                            className="absolute -inset-1.5 rounded-full bg-purple-400/20 dark:bg-purple-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        {/* Animated Accessibility Icon */}
                        <svg
                            className="relative z-10 w-5 h-5 text-purple-500 dark:text-purple-300 drop-shadow-[0_1px_2px_rgba(168,85,247,0.15)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
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
                                d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 11h4"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 16h4"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 11h.01"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 16h.01"
                            />
                            {/* Sparkle effect */}
                            <g>
                                <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#a78bfa" opacity="0.7" />
                                <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#c4b5fd" opacity="0.6" />
                                <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#f3e8ff" opacity="0.5" />
                            </g>
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 dark:from-purple-300 dark:via-purple-400 dark:to-purple-500 bg-clip-text text-transparent">
                            Universal Access
                        </span>
                        {/* Tooltip on focus/hover for accessibility */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            Designed for everyone, everywhere.
                        </div>
                    </div>

                    <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl">
                        Accessibility Commitment
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base">
                        Votely is dedicated to ensuring that our platform is accessible to all users. We adhere to WCAG guidelines and continuously improve our design to meet the diverse needs of our voters.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 @[640px]:grid-cols-2 @[1024px]:grid-cols-3 gap-6">
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                                <path d="M8 12h8" />
                            </svg>
                        }
                        title="Screen Reader Support"
                        description="Full compatibility with screen readers and assistive technologies for seamless navigation."
                    />
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                <path d="M12 15v2" />
                                <path d="M8 15v2" />
                                <path d="M16 15v2" />
                            </svg>
                        }
                        title="Keyboard Navigation"
                        description="Intuitive keyboard controls and shortcuts for efficient navigation without a mouse."
                    />
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l2.83 2.83" />
                                <path d="M16.24 16.24l2.83 2.83" />
                                <path d="M2 12h4" />
                                <path d="M18 12h4" />
                                <path d="m4.93 19.07 2.83-2.83" />
                                <path d="m16.24 7.76 2.83-2.83" />
                            </svg>
                        }
                        title="High Contrast Mode"
                        description="Enhanced visibility options with customizable contrast settings for better readability."
                    />
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                            </svg>
                        }
                        title="Text Scaling"
                        description="Adjustable text sizes and spacing to accommodate different visual needs."
                    />
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                                <path d="M8 8h8" />
                                <path d="M12 2v20" />
                            </svg>
                        }
                        title="Voice Commands"
                        description="Voice control support for hands-free navigation and interaction."
                    />
                    <AccessibilityFeature
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
                                className="text-purple-600 dark:text-purple-400"
                            >
                                <path d="M12 2v4" />
                                <path d="M12 18v4" />
                                <path d="M4.93 4.93l14.14 14.14" />
                                <path d="M19.07 4.93L4.93 19.07" />
                                <path d="M12 8v4" />
                                <path d="M12 16h.01" />
                                <path d="M8 12h8" />
                                <path d="M12 8v8" />
                                <path d="M8 8h8" />
                                <path d="M12 2v20" />
                            </svg>
                        }
                        title="Alternative Text"
                        description="Comprehensive alt text and ARIA labels for all visual elements."
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
                        <span>WCAG 2.1 AA Compliant</span>
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
                        <span>Section 508 Compliant</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

AccessibilitySection.displayName = 'AccessibilitySection';
export default React.memo(AccessibilitySection);