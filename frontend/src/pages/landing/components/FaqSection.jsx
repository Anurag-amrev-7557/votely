import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const FaqSection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqs, setExpandedFaqs] = useState(new Set());

    // Advanced, extensible, and visually rich FAQ categories with icons, tooltips, and color themes
    const categories = [
        {
            id: 'all',
            label: 'All Questions',
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                    <circle cx="128" cy="128" r="104" fill="url(#allGradient)" />
                    <circle cx="128" cy="128" r="88" fill="white" fillOpacity="0.7" />
                    <defs>
                        <radialGradient id="allGradient" cx="0.5" cy="0.5" r="0.7">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="100%" stopColor="#1e3a8a" />
                        </radialGradient>
                    </defs>
                </svg>
            ),
            color: "from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40",
            tooltip: "Browse all frequently asked questions"
        },
        {
            id: 'security',
            label: 'Security',
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                    <rect x="32" y="40" width="192" height="176" rx="16" fill="url(#securityGradient)" />
                    <circle cx="120" cy="180" r="12" fill="#fff" fillOpacity="0.8" />
                    <rect x="104" y="112" width="16" height="32" rx="8" fill="#fff" fillOpacity="0.8" />
                    <defs>
                        <linearGradient id="securityGradient" x1="32" y1="40" x2="224" y2="216" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#34d399" />
                            <stop offset="1" stopColor="#059669" />
                        </linearGradient>
                    </defs>
                </svg>
            ),
            color: "from-green-100 via-green-200 to-green-100 dark:from-green-900/40 dark:via-green-800/30 dark:to-green-900/40",
            tooltip: "Learn about security, privacy, and encryption"
        },
        {
            id: 'features',
            label: 'Features',
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                    <circle cx="128" cy="128" r="104" fill="url(#featuresGradient)" />
                    <path d="M128 72v48h40" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                        <linearGradient id="featuresGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#fbbf24" />
                            <stop offset="1" stopColor="#f59e42" />
                        </linearGradient>
                    </defs>
                </svg>
            ),
            color: "from-yellow-100 via-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:via-yellow-800/30 dark:to-yellow-900/40",
            tooltip: "Explore platform features and capabilities"
        },
        {
            id: 'pricing',
            label: 'Pricing',
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                    <circle cx="128" cy="128" r="104" fill="url(#pricingGradient)" />
                    <text x="128" y="148" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#fff" fontFamily="Arial">$</text>
                    <defs>
                        <linearGradient id="pricingGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#38bdf8" />
                            <stop offset="1" stopColor="#0ea5e9" />
                        </linearGradient>
                    </defs>
                </svg>
            ),
            color: "from-sky-100 via-sky-200 to-sky-100 dark:from-sky-900/40 dark:via-sky-800/30 dark:to-sky-900/40",
            tooltip: "Questions about plans, billing, and refunds"
        },
        {
            id: 'support',
            label: 'Support',
            icon: (
                <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                    <circle cx="128" cy="128" r="104" fill="url(#supportGradient)" />
                    <path d="M88 168h80v-16a40 40 0 00-80 0v16z" fill="#fff" fillOpacity="0.8"/>
                    <circle cx="128" cy="120" r="16" fill="#fff" fillOpacity="0.9"/>
                    <defs>
                        <linearGradient id="supportGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#a78bfa" />
                            <stop offset="1" stopColor="#6366f1" />
                        </linearGradient>
                    </defs>
                </svg>
            ),
            color: "from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/30 dark:to-purple-900/40",
            tooltip: "Get help and support resources"
        }
    ];

    const faqs = [
        {
            question: "How does Votely ensure the security of votes?",
            answer: "Votely employs multiple layers of security including end-to-end encryption, blockchain technology, and regular security audits. Each vote is encrypted and can only be decrypted by authorized parties. We also implement multi-factor authentication and DDoS protection to ensure the integrity of the voting process.",
            category: "security",
            tags: ["security", "encryption", "authentication"]
        },
        {
            question: "Is Votely accessible to voters with disabilities?",
            answer: "Yes, Votely is fully accessible and compliant with WCAG 2.1 AA standards. We support screen readers, keyboard navigation, high contrast mode, and text scaling. Our platform is designed to be usable by everyone, regardless of their abilities.",
            category: "features",
            tags: ["accessibility", "compliance", "usability"]
        },
        {
            question: "What support options are available?",
            answer: "We offer various support options including email support, live chat, and priority support for enterprise customers. Our support team is available 24/7 for critical issues, and we provide comprehensive documentation and training resources.",
            category: "support",
            tags: ["support", "help", "documentation"]
        },
        {
            question: "Can I customize the voting interface?",
            answer: "Yes, Votely offers extensive customization options. You can customize the branding, colors, and layout of the voting interface. Enterprise customers can also access our API for deeper integration and customization.",
            category: "features",
            tags: ["customization", "branding", "api"]
        },
        {
            question: "How does the pricing work?",
            answer: "Votely offers flexible pricing plans based on your needs. We have a free plan for small organizations, a standard plan for growing businesses, and enterprise solutions for large organizations. All plans include our core features, with additional capabilities available in higher tiers.",
            category: "pricing",
            tags: ["pricing", "plans", "features"]
        },
        {
            question: "What happens if there's a technical issue during voting?",
            answer: "Votely has built-in redundancy and failover systems to prevent technical issues. In the rare case of an incident, our system automatically saves progress and can resume voting sessions. We also provide real-time monitoring and immediate support response for any issues.",
            category: "support",
            tags: ["technical", "support", "reliability"]
        },
        {
            question: "How is voter privacy protected?",
            answer: "We implement strict privacy measures including anonymous voting options, data encryption, and secure storage. Voter information is never shared with third parties, and we comply with global data protection regulations.",
            category: "security",
            tags: ["privacy", "security", "compliance"]
        },
        {
            question: "Can I get a refund if I'm not satisfied?",
            answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with our service, you can request a full refund within 30 days of your purchase.",
            category: "pricing",
            tags: ["refund", "guarantee", "satisfaction"]
        }
    ];

    const filteredFaqs = faqs.filter(faq => {
        const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
        const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    /**
     * Advanced FAQ toggle handler with accessibility, keyboard navigation, and analytics event tracking.
     * - Supports toggling via mouse and keyboard (Enter/Space).
     * - Optionally accepts a custom event (for keyboard support).
     * - Triggers analytics event on expand/collapse.
     * - Ensures only one FAQ is expanded at a time if "singleExpand" is enabled.
     */
    const singleExpand = false; // Set to true for accordion behavior (only one open at a time)

    const toggleFaq = (index, event = null) => {
        // Keyboard accessibility: only toggle on Enter/Space
        if (event && event.type === 'keydown' && !['Enter', ' '].includes(event.key)) {
            return;
        }

        setExpandedFaqs(prev => {
            let newExpandedFaqs;
            if (singleExpand) {
                newExpandedFaqs = prev.has(index) ? new Set() : new Set([index]);
            } else {
                newExpandedFaqs = new Set(prev);
                if (newExpandedFaqs.has(index)) {
                    newExpandedFaqs.delete(index);
                } else {
                    newExpandedFaqs.add(index);
                }
            }

            // Analytics: Track FAQ expand/collapse (replace with your analytics integration)
            if (typeof window !== "undefined" && window.gtag) {
                window.gtag('event', newExpandedFaqs.has(index) ? 'faq_expand' : 'faq_collapse', {
                    event_category: 'FAQ',
                    event_label: `FAQ ${index}`
                });
            }

            return newExpandedFaqs;
        });
    };
    
    return (
        <section className={`faq-section ${sectionBg}`} aria-labelledby="faq-main-heading" role="region" tabIndex={0}>
            <h2 id="faq-main-heading" className="sr-only">Frequently Asked Questions</h2>
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
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
                        {/* Animated Help Icon */}
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
                            <line
                                x1="12"
                                y1="17"
                                x2="12.01"
                                y2="17"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                            {/* Sparkle effect */}
                            <g>
                                <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#93c5fd" opacity="0.6" />
                                <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#dbeafe" opacity="0.5" />
                            </g>
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent text-xs sm:text-sm">
                            Help Center
                        </span>
                        {/* Tooltip on focus/hover for accessibility */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            Find answers and support for Votely.
                        </div>
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
                        <div className="relative">
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
                                spellCheck={true}
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
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="opacity-80"
                                    />
                                    <line
                                        x1="16.5"
                                        y1="16.5"
                                        x2="21"
                                        y2="21"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="animate-pulse"
                                    />
                                    <animate
                                        attributeName="opacity"
                                        values="0.7;1;0.7"
                                        dur="2.2s"
                                        repeatCount="indefinite"
                                    />
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
                                        <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                            {/* Search suggestions dropdown (advanced, optional) */}
                            {searchQuery && filteredFaqs.length > 0 && (
                                <ul className="absolute left-0 right-0 top-full mt-2 z-30 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl max-h-56 overflow-y-auto text-sm sm:text-base animate-fade-in">
                                    {filteredFaqs.slice(0, 5).map((faq, idx) => (
                                        <li
                                            key={idx}
                                            className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors duration-150"
                                            onClick={() => {
                                                setSearchQuery(faq.question);
                                                setExpandedFaqs(new Set([idx]));
                                            }}
                                        >
                                            <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                                            {faq.tags && faq.tags.length > 0 && (
                                                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                                    {faq.tags.slice(0,2).map((tag, tIdx) => (
                                                        <span key={tIdx} className="inline-block bg-gray-100 dark:bg-gray-700 rounded px-2 py-0.5 mr-1">{tag}</span>
                                                    ))}
                                                </span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
                                        activeCategory === category.id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {category.icon}
                                    {category.label}
                                </button>
                            ))}
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
                        {filteredFaqs.map((faq, index) => (
                            <div 
                                key={index}
                                className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 sm:p-4 group transition-all duration-300 hover:border-blue-500 dark:hover:border-blue-500"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex cursor-pointer items-center justify-between gap-4 sm:gap-6 py-1.5 sm:py-2 w-full text-left"
                                >
                                    <p className="text-gray-900 dark:text-white text-sm sm:text-base font-medium leading-normal">
                                        {faq.question}
                                    </p>
                                    <div className={`text-gray-600 dark:text-gray-300 transition-transform duration-300 ${expandedFaqs.has(index) ? 'rotate-180' : ''}`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                                            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                        </svg>
                                    </div>
                                </button>
                                {expandedFaqs.has(index) && (
                                    <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed py-1.5 sm:py-2">
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
                                )}
                            </div>
                        ))}
                    </div>

                    {filteredFaqs.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 sm:py-16 animate-fade-in">
                            {/* Animated SVG with subtle floating and color pulse */}
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
                                    {/* Animated question mark */}
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
                                {/* Subtle animated glow */}
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
                                        onClick={() => {
                                            setSearchQuery('');
                                            setActiveCategory('all');
                                        }}
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
                                        // Scroll to support/contact section or open modal
                                        const supportSection = document.getElementById('contact-support');
                                        if (supportSection) {
                                            supportSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                    aria-label="Contact Support"
                                >
                                    Contact Support
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                        <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                                    </svg>
                                </motion.button>
                            </motion.div>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-4 mt-4 text-center animate-fade-in">
                        <motion.p
                            className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.6, type: "spring" }}
                        >
                            <svg
                                className="w-4 h-4 text-blue-400 dark:text-blue-300 animate-pulse"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
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
                                <svg
                                    className="w-4 h-4 text-yellow-300 drop-shadow animate-spin-slow"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                >
                                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                                </svg>
                                Contact Support
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="ml-1 transition-transform duration-200 group-hover:translate-x-1"
                                aria-hidden="true"
                            >
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                            {/* Tooltip */}
                            <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30 whitespace-nowrap">
                                Our team typically replies within 1 hour during business hours.
                            </span>
                            {/* Animated Glow */}
                            <span
                                className="absolute -inset-1.5 rounded-2xl bg-blue-400/20 dark:bg-blue-700/20 blur-lg pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.5s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                        </motion.button>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 mt-2">
                            <a
                                href="mailto:support@ballotbox.com"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                                aria-label="Email Support"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M4 4h16v16H4z" strokeOpacity="0.2"/>
                                    <path d="M22 6l-10 7L2 6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Email
                            </a>
                            <a
                                href="https://calendly.com/ballotbox/support"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                                aria-label="Book a Call"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                                    <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Book a Call
                            </a>
                            <a
                                href="https://help.ballotbox.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                                aria-label="Help Center"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.2"/>
                                    <path d="M12 16h.01M12 8a4 4 0 0 1 4 4c0 2-2 3-4 3s-4-1-4-3a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Help Center
                            </a>
                        </div>
                    </div>
                </div>
              </div>
        </section>
    );
}

FaqSection.displayName = 'FaqSection';
export default React.memo(FaqSection);