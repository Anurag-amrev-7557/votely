import { memo } from 'react';
import { motion } from 'framer-motion';

const HeroText = ({ isVisible }) => {
    return (
        <>
            {/* Advanced Animated Badge */}
            <motion.div
                className="relative hidden @[480px]:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 w-fit transition-all duration-500 will-change-[background-color,color,box-shadow]"
                initial={isVisible ? { opacity: 0, y: 32, scale: 0.95, filter: "blur(4px)" } : false}
                animate={isVisible ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : false}
                transition={{ type: "spring", stiffness: 320, damping: 24, duration: 0.7 }}
                tabIndex={0}
                role="status"
                aria-label="Trusted by Organizations Worldwide"
            >
                {/* Animated Glow Effect */}
                <motion.span
                    className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                    initial={{ opacity: 0.3, scale: 0.8 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
                    aria-hidden="true"
                />
                {/* Animated Shield Check Icon */}
                <motion.svg
                    className="relative z-10 w-5 h-5 text-green-500 dark:text-green-400 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
                    animate={{ scale: [0.7, 1.15, 1], rotate: [0, 8, 0], opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.18, type: "tween", ease: "easeInOut" }}
                    aria-hidden="true"
                >
                    <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
                    />
                </motion.svg>
                {/* Animated Text */}
                <motion.span
                    className="relative z-10 ml-2 bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent font-semibold tracking-wide"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.35, type: "spring", stiffness: 200, damping: 18 }}
                >
                    Trusted by <span className="font-bold underline decoration-wavy decoration-blue-400/60 dark:decoration-blue-300/60 underline-offset-2">Organizations Worldwide</span>
                </motion.span>
                {/* Tooltip on focus/hover for accessibility */}
                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                    whileFocus={{ opacity: 1 }}
                    tabIndex={-1}
                    aria-hidden="true"
                >
                    <span>
                        <strong>Verified</strong> by leading institutions for security and reliability.
                    </span>
                </motion.div>
            </motion.div>

            <div className="flex flex-col gap-4 text-left">
                <div className="relative min-h-[120px] @[480px]:min-h-[140px] flex items-center">
                    {/* Animated background glow */}
                    <motion.div
                        className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400/40 via-blue-200/30 to-blue-600/20 dark:from-blue-900/40 dark:via-blue-700/30 dark:to-blue-400/20 rounded-full blur-3xl opacity-60 pointer-events-none z-0"
                        initial={{ scale: 0.7, opacity: 0.3, filter: "blur(32px)" }}
                        animate={{
                            scale: [0.7, 1.1, 1],
                            opacity: [0.3, 0.7, 0.5, 0.7],
                            filter: ["blur(32px)", "blur(48px)", "blur(32px)"]
                        }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                        aria-hidden="true"
                    />
                    {/* Animated headline with gradient and shimmer */}
                    <motion.h1
                        className="relative z-10 text-3xl @[480px]:text-4xl @[864px]:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight transition-colors duration-300 will-change-[color]"
                        initial={{ opacity: 0, y: 32, letterSpacing: "-0.04em" }}
                        animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
                        transition={{ duration: 0.7, delay: 0.05, type: "spring", stiffness: 180, damping: 18 }}
                    >
                        <span className="inline-block relative">
                            <span className="pr-2">Secure</span>
                            {/* Animated lock icon */}
                            <motion.span
                                className="inline-block align-middle"
                                initial={{ scale: 0.7, rotate: -10, opacity: 0 }}
                                animate={{ scale: [0.7, 1.15, 1], rotate: [0, 8, 0], opacity: 1 }}
                                transition={{ duration: 0.7, delay: 0.18, type: "tween", ease: "easeInOut" }}
                                aria-hidden="true"
                            >
                                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <motion.path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 17a2 2 0 002-2v-2a2 2 0 10-4 0v2a2 2 0 002 2zm6-6V9a6 6 0 10-12 0v2m14 0H4a2 2 0 00-2 2v7a2 2 0 002 2h16a2 2 0 002-2v-7a2 2 0 00-2-2z"
                                        initial={{ pathLength: 0, opacity: 0.5 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut" }}
                                    />
                                </svg>
                            </motion.span>
                            <span className="pl-2">Online Voting</span>
                        </span>
                        <br />
                        <span className="relative inline-block">
                            {/* Animated gradient text with shimmer */}
                            <motion.span
                                className="bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent transition-colors duration-300 will-change-[color] font-black"
                                initial={{ backgroundPosition: "0% 50%" }}
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ repeat: Infinity, duration: 3.5, ease: "linear" }}
                                style={{
                                    backgroundSize: "200% 200%",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent"
                                }}
                            >
                                Made Simple
                            </motion.span>
                            {/* Animated underline shimmer */}
                            <motion.span
                                className="absolute left-0 right-0 -bottom-1 h-2 pointer-events-none"
                                initial={{ opacity: 0, scaleX: 0.7 }}
                                animate={{
                                    opacity: [0.2, 0.7, 0.2],
                                    scaleX: [0.7, 1.1, 1],
                                }}
                                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                                aria-hidden="true"
                            >
                                <svg width="100%" height="100%" viewBox="0 0 180 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <motion.path
                                        d="M4 4c40 8 132-8 172 0"
                                        stroke="url(#shimmer-underline)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0.2, opacity: 0.5 }}
                                        animate={{ pathLength: 1, opacity: 1 }}
                                        transition={{ duration: 1.2, delay: 0.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                                    />
                                    <defs>
                                        <linearGradient id="shimmer-underline" x1="0" y1="0" x2="180" y2="0" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#3B82F6" stopOpacity="0.7" />
                                            <stop offset="0.5" stopColor="#60A5FA" stopOpacity="1" />
                                            <stop offset="1" stopColor="#38BDF8" stopOpacity="0.7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </motion.span>
                        </span>
                    </motion.h1>
                    {/* Subtle floating shield icon for extra security visual */}
                    <motion.div
                        className="absolute top-2 right-2 z-20"
                        initial={{ y: -10, opacity: 0, scale: 0.8, rotate: -8 }}
                        animate={{ y: [0, 6, 0], opacity: 0.7, scale: [0.8, 1.1, 1], rotate: [0, 8, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        aria-hidden="true"
                    >
                        <svg className="w-8 h-8 text-green-500 dark:text-green-400 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                            />
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4"
                                initial={{ pathLength: 0, opacity: 0.5 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ duration: 1.1, delay: 0.3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                            />
                        </svg>
                    </motion.div>
                </div>
                <motion.p
                    className="text-balance text-[clamp(1rem,1.5vw,1.15rem)] text-gray-700 dark:text-gray-200 max-w-xl font-normal leading-relaxed tracking-tight transition-colors duration-300 will-change-[color] opacity-90"
                    initial={{ opacity: 0, y: 24, filter: "blur(2px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
                >
                    <span className="inline-block via-transparent to-green-400/10 dark:bg-none rounded-lg py-0.5">
                        {`Effortless, secure, and transparent online elections.`}<br className="hidden sm:inline" />
                        <span className="text-gray-500 dark:text-gray-400 font-light">
                            Integrity and accessibility for every vote.
                        </span>
                    </span>
                </motion.p>
            </div>
        </>
    );
};

export default memo(HeroText);
