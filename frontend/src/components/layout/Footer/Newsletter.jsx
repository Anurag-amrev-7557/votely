import React from 'react';
import { Link } from 'react-router-dom';

const Newsletter = () => {
    return (
        <div className="max-w-2xl mx-auto text-center relative">
            {/* Advanced Animated Newsletter Badge */}
            <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow]"
                tabIndex={0}
                role="status"
                aria-label="Newsletter Subscription"
            >
                {/* Animated Glow Effect */}
                <span
                    className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0 animate-pulse-orb"
                    aria-hidden="true"
                    style={{ animationDuration: '2.8s' }}
                />
                {/* Animated Envelope Icon */}
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
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                        <circle className="animate-float-sparkle" style={{ animationDelay: '0.2s' }} cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                        <circle className="animate-float-sparkle" style={{ animationDelay: '0.8s' }} cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                        <circle className="animate-float-sparkle" style={{ animationDelay: '1.4s' }} cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                    </g>
                </svg>
                <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                    Newsletter
                </span>
                {/* Tooltip on focus/hover for accessibility */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                    role="tooltip"
                >
                    Get exclusive updates and tips in your inbox!
                </div>
            </div>
            {/* Animated Heading with Gradient and Subtle Motion */}
            <h3
                className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 relative"
                tabIndex={0}
                aria-label="Stay Updated with Votely"
            >
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 dark:from-blue-300 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent animate-gradient-x">
                    Stay Updated with Votely
                </span>
                {/* Animated underline */}
                <span
                    className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-gradient-to-r from-blue-400/40 via-blue-500/60 to-purple-400/40 rounded-full blur-sm opacity-80 pointer-events-none animate-pulse-orb"
                    aria-hidden="true"
                    style={{ animationDuration: '2.5s' }}
                />
            </h3>
            {/* Animated Description with Fade-in and Accessibility */}
            <p
                className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-lg mx-auto transition-opacity duration-700 will-change-[opacity] animate-fade-in"
                style={{ animationDelay: "0.15s" }}
                tabIndex={0}
                aria-label="Get the latest updates on new features, security enhancements, and best practices for secure voting."
            >
                <span className="inline-block align-middle">
                    Get the latest updates on&nbsp;
                    <span className="font-semibold text-blue-600 dark:text-blue-400">new features</span>
                    ,&nbsp;
                    <span className="font-semibold text-blue-600 dark:text-blue-400">security enhancements</span>
                    , and&nbsp;
                    <span className="font-semibold text-blue-600 dark:text-blue-400">best practices</span>
                    &nbsp;for secure voting.
                </span>
            </p>

            {/* Advanced Features Grid with Animation, Tooltips, and Accessibility */}
            <div
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8"
                role="list"
                aria-label="Newsletter Features"
            >
                {[
                    { label: 'Weekly Updates', iconPath: 'M5 13l4 4L19 7', desc: 'Get a summary of the latest features and improvements every week.', delay: '0.1s' },
                    { label: 'Security Tips', iconPath: 'M5 13l4 4L19 7', desc: 'Actionable advice to keep your voting experience safe and secure.', delay: '0.25s' },
                    { label: 'Best Practices', iconPath: 'M5 13l4 4L19 7', desc: 'Learn how to get the most out of Votely with expert tips and guides.', delay: '0.4s' }
                ].map((feature, idx) => (
                    <div
                        key={idx}
                        className="group relative flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400"
                        tabIndex={0}
                        role="listitem"
                        aria-label={feature.label}
                    >
                        {/* Animated Icon */}
                        <svg
                            className="w-5 h-5 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d={feature.iconPath}
                            />
                            <animate
                                attributeName="stroke-dasharray"
                                from="0,24"
                                to="24,0"
                                dur="0.7s"
                                fill="freeze"
                                begin={feature.delay}
                            />
                        </svg>
                        <span className="font-medium">{feature.label}</span>
                        {/* Tooltip */}
                        <span
                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                            role="tooltip"
                        >
                            {feature.desc}
                        </span>
                        {/* Animated highlight ring */}
                        <span
                            className="absolute -inset-1 rounded-lg pointer-events-none"
                            style={{
                                background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                                opacity: 0.12,
                                transition: "opacity 0.18s"
                            }}
                            aria-hidden="true"
                        />
                    </div>
                ))}
            </div>

            {/* Advanced Newsletter Subscription Form */}
            <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto animate-fade-in-up will-change-[opacity,transform]"
                autoComplete="off"
                aria-label="Newsletter Subscription Form"
                tabIndex={0}
                role="form"
                onSubmit={e => { e.preventDefault(); }}
            >
                {/* Animated Input with Floating Label and Icon */}
                <div className="flex-1 relative group">
                    <input
                        type="email"
                        name="newsletter-email"
                        id="newsletter-email"
                        required
                        autoComplete="email"
                        placeholder=" "
                        aria-label="Email address"
                        className={`
                            peer w-full px-4 py-2.5 sm:py-3 rounded-lg border border-gray-200 dark:border-gray-700
                            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent
                            transition-all duration-200 group-hover:border-blue-400 dark:group-hover:border-blue-600
                            shadow-sm focus:shadow-md
                            will-change-[box-shadow,border-color]
                        `}
                    />
                    {/* Floating Label */}
                    <label
                        htmlFor="newsletter-email"
                        className={`
                            absolute left-4 top-2.5 sm:top-3 text-gray-500 dark:text-gray-400
                            text-sm pointer-events-none transition-all duration-200
                            peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base
                            peer-placeholder-shown:text-gray-500 peer-focus:-top-3 peer-focus:text-xs
                            peer-focus:text-blue-700 dark:peer-focus:text-blue-300
                            bg-white dark:bg-gray-800 px-1 rounded
                        `}
                        aria-hidden="true"
                    >
                        Enter your email
                    </label>
                    {/* Animated Icon */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200 animate-float-sparkle"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                            />
                            <animate
                                attributeName="opacity"
                                values="0.7;1;0.7"
                                dur="2.2s"
                                repeatCount="indefinite"
                            />
                        </svg>
                    </div>
                    {/* Animated Glow Effect */}
                    <span
                        className="absolute -inset-1.5 rounded-lg bg-blue-400/10 dark:bg-blue-700/10 blur-lg pointer-events-none z-0 animate-pulse-orb"
                        aria-hidden="true"
                        style={{ animationDuration: '2.8s' }}
                    />
                </div>
                {/* Animated Subscribe Button */}
                <button
                    type="submit"
                    className={`
                        relative w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700
                        hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200
                        flex items-center justify-center gap-2 font-medium shadow-sm hover:shadow-lg
                        hover:scale-[1.03] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-blue-400
                        will-change-[transform,box-shadow]
                        group/button
                    `}
                    aria-label="Subscribe to newsletter"
                    tabIndex={0}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        <span className="inline-block">Subscribe</span>
                        {/* Animated Arrow Icon */}
                        <svg
                            className="w-4 h-4 transition-transform duration-200 group-hover/button:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                            <animate
                                attributeName="opacity"
                                values="0.7;1;0.7"
                                dur="1.5s"
                                repeatCount="indefinite"
                            />
                        </svg>
                    </span>
                    {/* Loading Spinner */}
                    <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 hidden group-[.loading]/button:inline-block"
                        aria-live="polite"
                        aria-busy="true"
                    >
                        <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </span>
                    {/* Animated Glow Under Button */}
                    <span
                        className="absolute left-1/2 -translate-x-1/2 bottom-0 w-2/3 h-1 bg-gradient-to-r from-blue-400/40 via-blue-500/60 to-purple-400/40 rounded-full blur-sm opacity-80 pointer-events-none animate-pulse-orb"
                        aria-hidden="true"
                        style={{ animationDuration: '2.5s' }}
                    />
                </button>
            </form>
            {/* Animated Success/Error Feedback */}
            <div
                className="w-full max-w-md mx-auto mt-2"
                aria-live="polite"
                aria-atomic="true"
            >
                {/* Example: Success message */}
                <div className="hidden animate-fade-in bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700/40 dark:text-green-300 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2" role="status">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Subscribed! Please check your inbox.
                </div>
                {/* Example: Error message */}
                <div className="hidden animate-fade-in bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-300 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2" role="alert">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Oops! Please enter a valid email address.
                </div>
            </div>
            {/* Policy Notice */}
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-3 sm:mt-4 text-center animate-fade-in" tabIndex={0}>
                By subscribing, you agree to our{" "}
                <Link
                    to="/privacy-policy"
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:underline underline-offset-2 transition-colors duration-150 relative"
                    tabIndex={0}
                    aria-label="Read our Privacy Policy"
                >
                    Privacy Policy
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-200 origin-left" aria-hidden="true"></span>
                </Link>
                {" "}and{" "}
                <Link
                    to="/terms-of-service"
                    className="text-blue-600 dark:text-blue-400 hover:underline focus:underline underline-offset-2 transition-colors duration-150 relative"
                    tabIndex={0}
                    aria-label="Read our Terms of Service"
                >
                    Terms of Service
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400 rounded-full scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-200 origin-left" aria-hidden="true"></span>
                </Link>.
            </p>
            <div
                className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 animate-fade-in"
                role="list"
                aria-label="Subscription Security and Privacy Features"
            >
                {/* Secure & Private */}
                <span
                    className="group relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer"
                    tabIndex={0}
                    role="listitem"
                    aria-label="Secure & Private"
                >
                    {/* Animated Lock Icon */}
                    <svg
                        className="w-4 h-4 text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)] animate-fade-in"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                        <animate
                            attributeName="stroke-dasharray"
                            from="0,24"
                            to="24,0"
                            dur="0.7s"
                            fill="freeze"
                            begin="0.2s"
                        />
                    </svg>
                    <span className="font-medium">Secure &amp; Private</span>
                    {/* Tooltip */}
                    <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                        role="tooltip"
                    >
                        Your email is encrypted and never shared. We use industry-leading security.
                    </span>
                    {/* Animated highlight ring */}
                    <span
                        className="absolute -inset-1 rounded-lg pointer-events-none"
                        style={{
                            background: "linear-gradient(90deg,rgba(34,197,94,0.08) 0%,rgba(59,130,246,0.02) 100%)",
                            opacity: 0.12,
                            transition: "opacity 0.18s"
                        }}
                        aria-hidden="true"
                    />
                </span>
                {/* Divider Dot */}
                <span
                    className="hidden sm:inline text-gray-400 dark:text-gray-500 select-none"
                    aria-hidden="true"
                >
                    <svg className="w-1.5 h-1.5 mx-1" viewBox="0 0 6 6" fill="currentColor">
                        <circle cx="3" cy="3" r="3" />
                    </svg>
                </span>
                {/* Unsubscribe Anytime */}
                <span
                    className="group relative flex items-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/20 focus-within:ring-2 focus-within:ring-blue-400 cursor-pointer"
                    tabIndex={0}
                    role="listitem"
                    aria-label="Unsubscribe Anytime"
                >
                    {/* Animated Envelope Icon */}
                    <svg
                        className="w-4 h-4 text-blue-500 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)] animate-fade-in"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                            <circle className="animate-float-sparkle" style={{ animationDelay: '0.2s' }} cx="19" cy="6" r="0.7" fill="#60a5fa" opacity="0.7" />
                            <circle className="animate-float-sparkle" style={{ animationDelay: '0.8s' }} cx="6" cy="5" r="0.5" fill="#818cf8" opacity="0.6" />
                        </g>
                    </svg>
                    <span className="font-medium">Unsubscribe Anytime</span>
                    {/* Tooltip */}
                    <span
                        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                        role="tooltip"
                    >
                        No spam. Opt out with a single click at any time.
                    </span>
                    {/* Animated highlight ring */}
                    <span
                        className="absolute -inset-1 rounded-lg pointer-events-none"
                        style={{
                            background: "linear-gradient(90deg,rgba(59,130,246,0.08) 0%,rgba(34,197,94,0.02) 100%)",
                            opacity: 0.12,
                            transition: "opacity 0.18s"
                        }}
                        aria-hidden="true"
                    />
                </span>
            </div>
        </div >
    );
};

export default Newsletter;
