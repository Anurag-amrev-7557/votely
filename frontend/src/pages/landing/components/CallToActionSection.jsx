import React from 'react';
import { motion } from 'framer-motion';

const CallToActionSection = () => {
    return (
        <section className="relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 -z-10 transition-colors duration-300 will-change-[background-color]" />
            
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl transition-colors duration-300 will-change-[background-color]" />
                <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl transition-colors duration-300 will-change-[background-color]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    {/* CTA Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 mb-4 sm:mb-6 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full mx-auto transition-colors duration-300 will-change-[background-color]"
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
                            className="text-blue-500 dark:text-blue-400 transition-colors duration-300 will-change-[color]"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <path d="M5 12h14" />
                            <path d="m12 5 7 7-7 7" />
                        </motion.svg>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors duration-300 will-change-[color]">
                            Get Started
                        </span>
                    </motion.div>

                    {/* Heading */}
                    <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[32px] md:text-4xl font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4 transition-colors duration-300 will-change-[color]">
                        Ready to Transform Your Voting Experience?
                    </h2>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 sm:mb-8">
                        Join thousands of organizations already using Votely to conduct secure, transparent, and efficient elections.
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
                        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-green-600 dark:text-green-400">
                                    <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Secure & Reliable</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-blue-600 dark:text-blue-400">
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Easy to Use</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200 dark:border-gray-700">
                            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="text-purple-600 dark:text-purple-400">
                                    <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">24/7 Support</span>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <a
                            href="/signup"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/25"
                        >
                            Get Started Free
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                        </a>
                        <a
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700 shadow-lg shadow-gray-500/10"
                        >
                            Contact Sales
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                        </a>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4">
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                            Trusted by organizations worldwide
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 opacity-75">
                            {/* Microsoft */}
                            <div className="h-6 sm:h-8 w-auto grayscale dark:invert">
                                <svg className="h-full w-auto" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0h23v23H0z" fill="#f3f3f3"/>
                                    <path d="M11.5 11.5H0V0h11.5v11.5z" fill="#f35325"/>
                                    <path d="M23 11.5H11.5V0H23v11.5z" fill="#81bc06"/>
                                    <path d="M11.5 23H0V11.5h11.5V23z" fill="#05a6f0"/>
                                    <path d="M23 23H11.5V11.5H23V23z" fill="#ffba08"/>
                                </svg>
                            </div>
                            {/* Google */}
                            <div className="h-6 sm:h-8 w-auto grayscale dark:invert">
                                <svg className="h-full w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                            </div>
                            {/* Amazon */}
                            <div className="h-6 sm:h-8 w-auto grayscale dark:invert">
                                <svg className="h-full w-auto" viewBox="0 0 448 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43 2.5 4.5 5.5 8.5 8.5 12.5 27.5 35.5 60.5 60 116.5 60 81 0 123.5-62.5 123.5-150.5 0-66.5-53.5-115.5-123.5-115.5-27.5 0-55 10-82.5 25.5-27.5 15.5-55 31-82.5 31-27.5 0-55-15.5-82.5-31-27.5-15.5-55-25.5-82.5-25.5-70 0-123.5 49-123.5 115.5 0 88 42.5 150.5 123.5 150.5 56 0 89-24.5 116.5-60 3-4 6-8 8.5-12.5 45.5 71 134.8 66.5 183.5 43 0-102-120.8-115.7-169.5-117.5z" fill="currentColor"/>
                                </svg>
                            </div>
                            {/* IBM */}
                            <div className="h-6 sm:h-8 w-auto grayscale dark:invert">
                                <svg className="h-full w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.362 5.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75zM22.362 11.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75zM22.362 17.214c-.43-.168-1.02-.24-1.77-.24-1.5 0-2.7.6-3.6 1.8-.9-1.2-2.1-1.8-3.6-1.8-.75 0-1.35.06-1.8.24-.45.18-.75.45-.9.75-.15.3-.15.6 0 .9.15.3.45.6.9.75.45.18 1.05.3 1.8.3 1.5 0 2.7-.6 3.6-1.8.9 1.2 2.1 1.8 3.6 1.8.75 0 1.35-.12 1.8-.3.45-.18.75-.45.9-.75.15-.3.15-.6 0-.9-.15-.3-.45-.57-.9-.75z" fill="currentColor"/>
                                </svg>
                            </div>
                            {/* Oracle */}
                            <div className="h-6 sm:h-8 w-auto grayscale dark:invert">
                                <svg className="h-full w-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default CallToActionSection;