import React from 'react';
import { motion } from 'framer-motion';

const AccessibilityFeature = ({ icon, title, description }) => (
    <div className="flex flex-col gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
        <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-fit">
            {icon}
        </div>
        <h3 className="text-gray-900 dark:text-white font-semibold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
);

const AccessibilitySection = () => {
    return (
        <section className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-center max-w-3xl mx-auto"
                >
                    {/* Accessibility Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full mx-auto"
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500 dark:text-blue-400"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
                            <path d="M12 11h4" />
                            <path d="M12 16h4" />
                            <path d="M8 11h.01" />
                            <path d="M8 16h.01" />
                        </motion.svg>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                            Universal Access
                        </span>
                    </motion.div>

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

export default AccessibilitySection;