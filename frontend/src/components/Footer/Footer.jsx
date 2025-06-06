import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
            {/* Top Border Gradient */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
                {/* Newsletter Section */}
                <div className="mb-8 sm:mb-12 p-4 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 dark:bg-purple-900/20 rounded-full blur-3xl opacity-30"></div>
                    </div>
                    
                    <div className="max-w-2xl mx-auto text-center relative">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Newsletter
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Stay Updated with Votely</h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-lg mx-auto">
                            Get the latest updates on new features, security enhancements, and best practices for secure voting.
                        </p>

                        {/* Features Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Weekly Updates
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Security Tips
                            </div>
                            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                Best Practices
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <div className="flex-1 relative group">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-blue-300 dark:group-hover:border-blue-700"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                </div>
                            </div>
                            <button className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]">
                                Subscribe
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4">
                            By subscribing, you agree to our <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a> and <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Terms of Service</a>.
                        </p>
                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure & Private
                            </span>
                            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
                            <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Unsubscribe Anytime
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
                    {/* Company Info */}
                    <div className="col-span-2 sm:col-span-1 flex flex-col gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                    Votely
                                </span>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                            Secure, transparent, and efficient voting solutions for organizations worldwide.
                        </p>
                        <div className="flex gap-4">
                            {/* Twitter/X */}
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </a>
                            {/* GitHub */}
                            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Product</h3>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pricing</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Security</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Enterprise</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Changelog</a>
                        </div>
                    </div>

                    {/* Resources Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Resources</h3>
                        <div className="flex flex-col gap-2">
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Documentation</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Guides</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">API Reference</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Status</a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="flex flex-col gap-3 sm:gap-4">
                        <h3 className="text-gray-900 dark:text-white text-sm font-semibold">Company</h3>
                        <div className="flex flex-col gap-2">
                            <Link to="/about" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Blog</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</a>
                            <Link to="/contact" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Partners</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <p className="text-gray-600 dark:text-gray-300 text-sm text-center sm:text-left">
                                © 2025 Votely. All rights reserved.
                            </p>
                            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">•</span>
                            <p className="text-gray-600 dark:text-gray-300 text-sm text-center sm:text-left">
                                Made with ❤️ for democracy
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Cookie Policy</a>
                            <a href="#" className="text-gray-600 dark:text-gray-300 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Accessibility</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;