import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useMemo, useCallback } from 'react';

import { categories, faqs } from '../data/faqData'; // Import data

// --- Extracted Components ---

const CategoryButton = React.memo(({ category, isActive, onClick }) => (
    <button
        onClick={() => onClick(category.id)}
        className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${isActive
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
        aria-pressed={isActive}
    >
        {category.icon}
        {category.label}
    </button>
));

const FaqItem = React.memo(({ faq, index, isExpanded, onToggle }) => (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 group transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500">
        <button
            onClick={() => onToggle(index)}
            className="flex cursor-pointer items-center justify-between gap-4 sm:gap-6 py-1.5 sm:py-2 w-full text-left"
            aria-expanded={isExpanded}
        >
            <p className="text-gray-900 dark:text-white text-sm sm:text-base font-medium leading-normal">
                {faq.question}
            </p>
            <div className={`text-gray-600 dark:text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
            </div>
        </button>
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                >
                    <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed py-1.5 sm:py-2 pt-2">
                        <p className="mb-2 sm:mb-3">{faq.answer}</p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {faq.tags.map((tag, tagIndex) => (
                                <span
                                    key={tagIndex}
                                    className="px-2 py-0.5 sm:py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
));

const EmptyState = React.memo(({ onReset }) => (
    <div className="flex flex-col items-center justify-center py-10 sm:py-16 animate-fade-in">
        {/* Animated SVG */}
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-4 sm:mb-6 flex items-center justify-center">
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 256 256"
                fill="none"
                initial={{ y: 0, opacity: 0.7, scale: 0.95 }}
                animate={{
                    y: [0, -8, 0, 8, 0],
                    opacity: [0.7, 1, 0.7],
                    scale: [0.95, 1.05, 0.95]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                }}
                className="drop-shadow-lg"
            >
                <defs>
                    <radialGradient id="noFaqGradient" cx="50%" cy="50%" r="60%">
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.3" />
                    </radialGradient>
                </defs>
                <circle cx="128" cy="128" r="104" fill="url(#noFaqGradient)" />
                <circle cx="128" cy="128" r="88" fill="#fff" fillOpacity="0.7" />
                <motion.g
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                >
                    <path
                        d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"
                        fill="#94a3b8"
                        className="dark:fill-gray-600"
                    />
                </motion.g>
                <motion.text
                    x="128"
                    y="140"
                    textAnchor="middle"
                    fontSize="56"
                    fontWeight="bold"
                    fill="#3b82f6"
                    opacity="0.7"
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                    style={{ fontFamily: 'Inter, sans-serif', pointerEvents: 'none', userSelect: 'none' }}
                >?</motion.text>
            </motion.svg>
            <motion.span
                className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl pointer-events-none"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
                aria-hidden="true"
            />
        </div>

        <motion.p
            className="text-gray-600 dark:text-gray-300 text-base sm:text-lg font-medium mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
        >
            No questions found matching your search.
        </motion.p>
        <motion.p
            className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, type: "spring" }}
        >
            Try a different search term or category, or
            <span className="inline-block mx-1">
                <motion.button
                    whileHover={{ scale: 1.08, backgroundColor: "#2563eb", color: "#fff" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={onReset}
                    aria-label="Reset FAQ search and filters"
                >
                    Reset Filters
                </motion.button>
            </span>
            to see all questions.
        </motion.p>
        <motion.div
            className="flex items-center justify-center gap-2 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        >
            <span className="text-xs text-gray-400 dark:text-gray-500">
                Need help?&nbsp;
            </span>
            <motion.button
                whileHover={{ scale: 1.07, backgroundColor: "#1e40af", color: "#fff" }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => {
                    const supportSection = document.getElementById('contact-support');
                    if (supportSection) {
                        supportSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }}
                aria-label="Contact Support"
            >
                Contact Support
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
                </svg>
            </motion.button>
        </motion.div>
    </div>
));

// --- Main Component ---

const FaqSection = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqs, setExpandedFaqs] = useState(new Set());

    const filteredFaqs = useMemo(() => {
        const queryLower = searchQuery.toLowerCase();
        return faqs.filter(faq => {
            const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
            const matchesSearch = !searchQuery ||
                faq.question.toLowerCase().includes(queryLower) ||
                faq.answer.toLowerCase().includes(queryLower) ||
                faq.tags.some(tag => tag.toLowerCase().includes(queryLower));
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const toggleFaq = useCallback((index) => {
        setExpandedFaqs(prev => {
            const newExpandedFaqs = new Set(prev);
            if (newExpandedFaqs.has(index)) {
                newExpandedFaqs.delete(index);
            } else {
                newExpandedFaqs.add(index);
            }
            return newExpandedFaqs;
        });
    }, []);

    const resetFilters = useCallback(() => {
        setSearchQuery('');
        setActiveCategory('all');
    }, []);

    return (
        <section className="faq-section bg-white dark:bg-gray-900" aria-labelledby="faq-main-heading" role="region" tabIndex={0} style={{ contentVisibility: 'auto' }}>
            <h2 id="faq-main-heading" className="sr-only">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col gap-4 sm:gap-6 text-center max-w-3xl mx-auto"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow] mx-auto"
                        tabIndex={0}
                        role="status"
                        aria-label="Help Center"
                    >
                        {/* Animated Glow Effect */}
                        <span
                            className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        {/* Help Icon */}
                        <svg
                            className="relative z-10 w-5 h-5 text-blue-500 dark:text-blue-300 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                            >
                                <animate
                                    attributeName="opacity"
                                    values="0.7;1;0.7"
                                    dur="2.2s"
                                    repeatCount="indefinite"
                                />
                            </path>
                            <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent text-xs sm:text-sm">
                            Help Center
                        </span>
                    </div>

                    <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Find answers to common questions about Votely's features, security, and pricing.
                    </p>
                </motion.div>

                <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4">
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search questions, topics, or keywords…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') setSearchQuery('');
                                }}
                                aria-label="Search FAQs"
                                autoComplete="off"
                                spellCheck
                                className="peer w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm sm:text-base transition-all duration-200 shadow-sm focus:shadow-lg"
                            />
                            {/* Animated search icon */}
                            <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="text-blue-400 dark:text-blue-300 transition-transform duration-300 group-focus-within:scale-110 group-hover:scale-110"
                                    aria-hidden="true"
                                >
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" className="opacity-80" />
                                    <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                                </svg>
                            </span>
                            {/* Clear button */}
                            {searchQuery && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    className="absolute right-9 sm:right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onClick={() => setSearchQuery('')}
                                    tabIndex={0}
                                >
                                    <svg width="14" height="14" fill="none" viewBox="0 0 20 20" aria-hidden="true">
                                        <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                            {categories.map(category => (
                                <CategoryButton
                                    key={category.id}
                                    category={category}
                                    isActive={activeCategory === category.id}
                                    onClick={setActiveCategory}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                        {filteredFaqs.map((faq, index) => (
                            <FaqItem
                                key={index}
                                index={index}
                                faq={faq}
                                isExpanded={expandedFaqs.has(index)}
                                onToggle={toggleFaq}
                            />
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <EmptyState onReset={resetFilters} />
                    )}

                    <div className="flex flex-col items-center gap-4 mt-4 text-center animate-fade-in">
                        <motion.p
                            className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
                        >
                            <svg className="w-4 h-4 text-blue-400 dark:text-blue-300 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
                                <path d="M12 8v4l2 2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Still have questions? <span className="hidden sm:inline">We're here to help.</span>
                        </motion.p>
                        <motion.button
                            whileHover={{
                                scale: 1.08,
                                background: "linear-gradient(90deg,#2563eb 0%,#1e40af 100%)",
                                boxShadow: "0 4px 24px 0 rgba(37,99,235,0.18)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="relative inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs sm:text-sm font-semibold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full sm:w-auto group"
                            onClick={() => {
                                const supportSection = document.getElementById('contact-support');
                                if (supportSection) {
                                    supportSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                } else {
                                    window.open('mailto:support@ballotbox.com', '_blank');
                                }
                            }}
                            aria-label="Contact Support"
                        >
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-yellow-300 drop-shadow animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                                </svg>
                                Contact Support
                            </span>
                        </motion.button>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                            <a
                                href="mailto:support@ballotbox.com"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M4 4h16v16H4z" strokeOpacity="0.2" />
                                    <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Email
                            </a>
                            <a
                                href="https://calendly.com/ballotbox/support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Book a Call
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

FaqSection.displayName = 'FaqSection';
export default React.memo(FaqSection);