import React, { useState } from 'react';
import FooterBackground from './FooterBackground';
import Newsletter from './Newsletter';
import FooterLinks from './FooterLinks';
import FooterBottom from './FooterBottom';

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
                    <FooterBackground />
                    <Newsletter />
                </div>

                {/* Main Footer Content */}
                <FooterLinks handleStubClick={handleStubClick} />

                {/* Enhanced Bottom Section */}
                <FooterBottom />
            </div>

            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() => setModalOpen(false)}
                >
                    <div
                        className="bg-white dark:bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-lg relative mx-4"
                        onClick={e => e.stopPropagation()}
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
                        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{modalContent}</h2>
                        <p className="mb-4 text-gray-600 dark:text-gray-300">This page is under construction. Please check back soon!</p>
                    </div>
                </div>
            )}
        </footer>
    );
};

export default Footer;