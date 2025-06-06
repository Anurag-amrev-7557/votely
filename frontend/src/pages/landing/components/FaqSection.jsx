import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FaqSection = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedFaqs, setExpandedFaqs] = useState(new Set());

    const categories = [
        { id: 'all', label: 'All Questions', icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z' },
        { id: 'security', label: 'Security', icon: 'M208,40H48A16,16,0,0,0,32,56V200a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V56A16,16,0,0,0,208,40Zm0,16V200H48V56H208Zm-80,96a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm-8,40a12,12,0,1,1,12-12A12,12,0,0,1,120,192Z' },
        { id: 'features', label: 'Features', icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z' },
        { id: 'pricing', label: 'Pricing', icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z' },
        { id: 'support', label: 'Support', icon: 'M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z' }
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

    const toggleFaq = (index) => {
        const newExpandedFaqs = new Set(expandedFaqs);
        if (newExpandedFaqs.has(index)) {
            newExpandedFaqs.delete(index);
        } else {
            newExpandedFaqs.add(index);
        }
        setExpandedFaqs(newExpandedFaqs);
    };
    
    return (
        <section className="max-w-[1400px] mx-auto">
            <div className="flex flex-col gap-8 px-4 py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:gap-6 text-center max-w-3xl mx-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full mx-auto"
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
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
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </motion.svg>
                        <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                            Help Center
                        </span>
                    </motion.div>

                    <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Find answers to common questions about Votely's features, security, and pricing.
                    </p>
                </motion.div>

                <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search questions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm sm:text-base"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                fill="currentColor"
                                viewBox="0 0 256 256"
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                            >
                                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                            </svg>
                        </div>

                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
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
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                                        <path d={category.icon}></path>
                                    </svg>
                                    {category.label}
                                </button>
                            ))}
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
                                            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
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
                        <div className="text-center py-6 sm:py-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-400 dark:text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                                No questions found matching your search. Try a different search term or category.
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col items-center gap-3 sm:gap-4 mt-3 sm:mt-4 text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                            Still have questions? We're here to help.
                        </p>
                        <button className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium transition-all duration-300 hover:scale-105 w-full sm:w-auto">
                            Contact Support
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
              </div>
        </section>
    );
}

export default FaqSection;