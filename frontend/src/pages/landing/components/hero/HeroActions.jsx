import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../../context/AdminAuthContext';

const HeroActions = () => {
    const { isAdmin } = useAdminAuth();
    const navigate = useNavigate();

    const handleAdminClick = useCallback(() => {
        if (isAdmin) {
            navigate('/admin/dashboard', { replace: true });
        } else {
            navigate('/admin-login', { replace: true });
        }
    }, [isAdmin, navigate]);

    return (
        <motion.div
            className="flex flex-col @[480px]:flex-row flex-wrap gap-3 min-h-[48px] justify-center @[864px]:justify-start"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 }}
            role="group"
            aria-label="Primary actions"
        >
            {/* Enhanced Get Started Button */}
            <Link to="/polls" tabIndex={-1} aria-label="Go to Polls">
                <motion.button
                    whileHover={{
                        scale: 1.07,
                        boxShadow: "0 6px 32px 0 rgba(59,130,246,0.18)",
                        backgroundColor: "#1d4ed8"
                    }}
                    whileTap={{ scale: 0.96 }}
                    className="relative flex w-full @[480px]:w-auto min-w-[140px] max-w-[480px] items-center justify-center rounded-full h-12 px-6 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-base font-bold tracking-tight shadow-lg hover:shadow-xl transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                    aria-label="Get Started"
                    type="button"
                >
                    {/* Animated gradient border */}
                    <motion.span
                        className="absolute inset-0 rounded-full pointer-events-none z-0"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
                        style={{
                            background: "linear-gradient(90deg,rgba(59,130,246,0.18) 0%,rgba(59,130,246,0.04) 100%)",
                            filter: "blur(2px)"
                        }}
                        aria-hidden="true"
                    />
                    <span className="truncate z-10 flex items-center gap-2">
                        Get Started
                        {/* Animated arrow with shimmer */}
                        <motion.svg
                            className="w-5 h-5 ml-2 z-10"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            initial={{ x: 0, opacity: 0.8 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ x: 6, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 320, damping: 18 }}
                            aria-hidden="true"
                        >
                            <motion.path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                initial={{ pathLength: 0.7 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.7, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                            />
                        </motion.svg>
                    </span>
                    {/* Subtle animated highlight */}
                    <motion.span
                        className="absolute left-0 top-0 w-full h-full rounded-xl pointer-events-none z-0"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 0.12 }}
                        transition={{ duration: 0.22 }}
                        style={{
                            background: "linear-gradient(90deg,rgba(59,130,246,0.12) 0%,rgba(59,130,246,0.04) 100%)"
                        }}
                        aria-hidden="true"
                    />
                    {/* Confetti burst on hover for delight */}
                    <motion.span
                        className="absolute -top-4 left-1/2 -translate-x-1/2 pointer-events-none z-20"
                        initial={{ opacity: 0, scale: 0.7, y: 10 }}
                        whileHover={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        aria-hidden="true"
                    >
                        <svg width="32" height="16" viewBox="0 0 32 16" fill="none">
                            <circle cx="4" cy="8" r="2" fill="#60a5fa" />
                            <circle cx="16" cy="4" r="1.5" fill="#a78bfa" />
                            <circle cx="28" cy="10" r="2" fill="#34d399" />
                            <circle cx="10" cy="13" r="1" fill="#fbbf24" />
                            <circle cx="22" cy="3" r="1" fill="#f472b6" />
                        </svg>
                    </motion.span>
                </motion.button>
            </Link>
            {/* Enhanced Admin Button */}
            <motion.button
                onClick={handleAdminClick}
                whileHover={{
                    scale: 1.06,
                    boxShadow: "0 6px 32px 0 rgba(139,92,246,0.13)",
                    backgroundColor: isAdmin ? "#6d28d9" : "#18181b"
                }}
                whileTap={{ scale: 0.97 }}
                className={`
          relative flex w-full @[480px]:w-auto min-w-[120px] max-w-[480px] items-center justify-center
          rounded-full h-12 px-6
          ${isAdmin
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                        : "bg-gray-900/90 dark:bg-gray-800/90 text-white"}
          text-base font-semibold tracking-tight shadow-md hover:shadow-xl
          transition-all duration-200 gap-2
          focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
          group
          border border-transparent
          `}
                aria-label={isAdmin ? 'Go to Admin Dashboard' : 'Admin Access'}
                type="button"
            >
                <span className="absolute left-0 top-0 w-full h-full rounded-full pointer-events-none z-0">
                    {/* Subtle animated gradient border for admin */}
                    <motion.span
                        className={`block w-full h-full rounded-full ${isAdmin ? "bg-gradient-to-r from-purple-400/30 via-indigo-400/20 to-blue-400/10" : ""}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isAdmin ? 1 : 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        aria-hidden="true"
                    />
                </span>
                <motion.span
                    className="relative z-10 flex items-center gap-2"
                    initial={false}
                    animate={isAdmin ? { x: 0 } : { x: 0 }}
                >
                    <motion.span
                        className="flex items-center justify-center"
                        initial={{ scale: 1, rotate: 0 }}
                        whileHover={{ scale: 1.12, rotate: isAdmin ? 8 : 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                    >
                        {isAdmin ? (
                            // Modern shield check icon for admin
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l8 4v5c0 5.25-3.5 9.75-8 11-4.5-1.25-8-5.75-8-11V7l8-4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.5 12.5l2 2 3-3" />
                            </svg>
                        ) : (
                            // Minimalist lock icon for non-admin
                            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <rect x="5" y="11" width="14" height="8" rx="3" strokeWidth="2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0v4" />
                            </svg>
                        )}
                    </motion.span>
                    <span className="truncate">
                        {isAdmin ? (
                            <span className="flex items-center gap-1">
                                Admin Dashboard
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/90 ml-1 border border-white/20">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Active
                                </span>
                            </span>
                        ) : (
                            <span className="flex items-center gap-1">
                                Admin Access
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-800/60 text-gray-200 ml-1 border border-gray-700/40">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                                    </svg>
                                    Restricted
                                </span>
                            </span>
                        )}
                    </span>
                </motion.span>
                {/* Animated minimalist highlight */}
                <motion.span
                    className="absolute left-0 top-0 w-full h-full rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.10 }}
                    transition={{ duration: 0.18 }}
                    style={{
                        background: isAdmin
                            ? "linear-gradient(90deg,rgba(139,92,246,0.13) 0%,rgba(99,102,241,0.08) 100%)"
                            : "linear-gradient(90deg,rgba(24,24,27,0.10) 0%,rgba(24,24,27,0.04) 100%)"
                    }}
                    aria-hidden="true"
                />
                {/* Subtle animated border for focus */}
                <span
                    className="absolute inset-0 rounded-full pointer-events-none border-2 border-transparent group-focus:border-purple-400 transition-all duration-200"
                    aria-hidden="true"
                />
            </motion.button>
        </motion.div>
    );
};

export default memo(HeroActions);
