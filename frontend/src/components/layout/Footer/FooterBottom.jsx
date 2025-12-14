import React from 'react';
import { Link } from 'react-router-dom';

const FooterBottom = () => {
    return (
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800/50">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                {/* Copyright & Tagline */}
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                        <svg className="inline-block w-4 h-4 mr-1 text-blue-500 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-14.5A6.5 6.5 0 1110 17.5 6.5 6.5 0 0110 3.5zm0 2.25a4.25 4.25 0 100 8.5 4.25 4.25 0 000-8.5zm0 1.5a2.75 2.75 0 110 5.5 2.75 2.75 0 010-5.5z" />
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
    );
};

export default FooterBottom;
