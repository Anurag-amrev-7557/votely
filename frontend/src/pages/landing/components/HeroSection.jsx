import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import landingHeroWebp from '../../../assets/landing-hero.webp';
import landingHeroPng from '../../../assets/landing-hero.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import CountUp from 'react-countup';
import { useTheme } from '../../../context/ThemeContext';

const HeroSection = ({ isVisible }) => {
  const { isAdmin } = useAdminAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Memoize theme-dependent classes
  const headlineColor = useMemo(() => isDarkMode ? 'text-white' : 'text-gray-900', [isDarkMode]);

  // Memoized admin navigation logic
  const handleAdminClick = useCallback(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/admin-login', { replace: true });
    }
  }, [isAdmin, navigate]);

  // Optionally, memoize admin status for advanced UI/UX (e.g., button state)
  const adminStatus = useMemo(() => ({
    isAdmin,
    label: isAdmin ? 'Go to Admin Dashboard' : 'Admin Login',
    icon: isAdmin ? '🛡️' : '🔒'
  }), [isAdmin]);

  return (
  <div className="relative w-full flex flex-col items-center justify-center min-h-[600px] pb-20 sm:pb-28">
    <div className="w-full flex flex-col-reverse @[864px]:flex-row gap-8 @[480px]:gap-10 px-6 py-6 @[480px]:py-10 sm:px-8 transition-colors duration-300 will-change-[background-color]">
      {/* Text Section */}
      <div className={`flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center flex-1 text-center @[864px]:text-left ${headlineColor}`}>
        {/* Advanced Animated Badge */}
        <motion.div
          className="relative hidden @[480px]:inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 w-fit transition-all duration-500 will-change-[background-color,color,box-shadow]"
          initial={{ opacity: 0, y: 32, scale: 0.95, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
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
              className="relative z-10 text-4xl @[480px]:text-5xl @[864px]:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight transition-colors duration-300 will-change-[color]"
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
                        <stop stopColor="#3B82F6" stopOpacity="0.7"/>
                        <stop offset="0.5" stopColor="#60A5FA" stopOpacity="1"/>
                        <stop offset="1" stopColor="#38BDF8" stopOpacity="0.7"/>
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
            className="text-balance text-[clamp(1.1rem,2vw,1.35rem)] text-gray-700 dark:text-gray-200 max-w-xl font-normal leading-relaxed tracking-tight transition-colors duration-300 will-change-[color] opacity-90"
            initial={{ opacity: 0, y: 24, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
          >
            <span className="inline-block bg-gradient-to-r from-blue-500/10 via-transparent to-green-400/10 dark:bg-none rounded-lg py-0.5">
              Effortless, secure, and transparent online elections.<br className="hidden sm:inline" />
              <span className="text-gray-500 dark:text-gray-400 font-light">
                Integrity and accessibility for every vote.
              </span>
            </span>
          </motion.p>
        </div>

        {/* Advanced Features Grid */}
        <div
          className="relative grid grid-cols-1 sm:grid-cols-3 gap-6 min-h-[96px] py-2 px-1 sm:px-0"
          aria-label="Platform Features"
        >
          {[
            {
              icon: (
                // Shield with animated check
                <span className="relative flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-green-500 dark:text-green-400 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      initial={{ pathLength: 0.7, opacity: 0.7 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
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
                </span>
              ),
              text: (
                <>
                  End-to-End <span className="font-semibold text-green-600 dark:text-green-400">Encryption</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                    Your vote is private and tamper-proof.
                  </span>
                </>
              ),
              tooltip: "Votes are encrypted on your device and never exposed."
            },
            {
              icon: (
                // Bar chart with animated bars
                <span className="relative flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-blue-500 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <motion.rect
                      x="4"
                      y="12"
                      width="3"
                      height="8"
                      rx="1.5"
                      fill="currentColor"
                      initial={{ height: 0, y: 20 }}
                      animate={{ height: 8, y: 12 }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
                    />
                    <motion.rect
                      x="10.5"
                      y="8"
                      width="3"
                      height="12"
                      rx="1.5"
                      fill="currentColor"
                      initial={{ height: 0, y: 20 }}
                      animate={{ height: 12, y: 8 }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                    />
                    <motion.rect
                      x="17"
                      y="4"
                      width="3"
                      height="16"
                      rx="1.5"
                      fill="currentColor"
                      initial={{ height: 0, y: 20 }}
                      animate={{ height: 16, y: 4 }}
                      transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                    />
                  </svg>
                </span>
              ),
              text: (
                <>
                  Real-time <span className="font-semibold text-blue-600 dark:text-blue-400">Results</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                    Instant, transparent tallying.
                  </span>
                </>
              ),
              tooltip: "See live updates as votes are counted."
            },
            {
              icon: (
                // Globe with animated pulse
                <span className="relative flex items-center justify-center">
                  <svg
                    className="w-7 h-7 text-purple-500 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      initial={{ scale: 0.95, opacity: 0.7 }}
                      animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span className="absolute -right-1 -top-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                  </span>
                </span>
              ),
              text: (
                <>
                  24/7 <span className="font-semibold text-purple-600 dark:text-purple-400">Support</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400 font-light mt-0.5">
                    Global help, anytime you need it.
                  </span>
                </>
              ),
              tooltip: "Our team is always available to assist you."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="group relative flex items-start gap-3 p-3 rounded-xl bg-white/70 dark:bg-gray-900/60 border border-gray-100 dark:border-0 shadow-sm hover:shadow-lg transition-all duration-300 will-change-[box-shadow,background-color] cursor-pointer"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.5, delay: 0.1 * index, ease: [0.4, 0, 0.2, 1] }}
              tabIndex={0}
              aria-label={typeof feature.text === "string" ? feature.text : undefined}
              role="listitem"
            >
              <div className="flex-shrink-0">{feature.icon}</div>
              <div className="flex-1 min-w-0">
                <span className="truncate block">{feature.text}</span>
              </div>
              {/* Tooltip on hover/focus */}
              {feature.tooltip && (
                <span
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                  role="tooltip"
                >
                  {feature.tooltip}
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-col @[480px]:flex-row flex-wrap gap-3 min-h-[48px] justify-center @[864px]:justify-start"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 }}
          role="group"
          aria-label="Primary actions"
        >
          {/* Get Started Button */}
          <Link to="/polls" tabIndex={-1} aria-label="Go to Polls">
            <motion.button
              whileHover={{
                scale: 1.04,
                boxShadow: "0 4px 24px 0 rgba(59,130,246,0.10)",
                backgroundColor: "#2563eb"
              }}
              whileTap={{ scale: 0.98 }}
              className="relative flex w-full @[480px]:w-auto min-w-[120px] max-w-[480px] items-center justify-center rounded-lg h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold tracking-tight shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              aria-label="Get Started"
              type="button"
            >
              <span className="truncate z-10">Get Started</span>
              <motion.svg
                className="w-4 h-4 ml-2 z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
              {/* Minimalist animated highlight */}
              <motion.span
                className="absolute left-0 top-0 w-full h-full rounded-lg pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 0.08 }}
                transition={{ duration: 0.18 }}
                style={{
                  background: "linear-gradient(90deg,rgba(59,130,246,0.08) 0%,rgba(59,130,246,0.02) 100%)"
                }}
                aria-hidden="true"
              />
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
              rounded-lg h-12 px-6
              ${isAdmin
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                : "bg-gray-900/90 dark:bg-gray-800/90 text-white"}
              text-base font-semibold tracking-tight shadow-md hover:shadow-xl
              transition-all duration-200 gap-2
              focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2
              group
              border border-transparent
              `}
            aria-label={isAdmin ? "Go to Admin Dashboard" : "Admin Access"}
            type="button"
          >
            <span className="absolute left-0 top-0 w-full h-full rounded-lg pointer-events-none z-0">
              {/* Subtle animated gradient border for admin */}
              <motion.span
                className={`block w-full h-full rounded-lg ${isAdmin ? "bg-gradient-to-r from-purple-400/30 via-indigo-400/20 to-blue-400/10" : ""}`}
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
              className="absolute left-0 top-0 w-full h-full rounded-lg pointer-events-none"
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
              className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent group-focus:border-purple-400 transition-all duration-200"
              aria-hidden="true"
            />
          </motion.button>
        </motion.div>

        {/* 
          Advanced Social Proof Section: 
          - Animated avatars with hover/focus popover
          - Animated count-up for voter number
          - Animated trust badges
          - Accessible for screen readers
        */}
        <div
          className="flex flex-col @[480px]:flex-row items-center gap-6 mt-6 justify-center @[864px]:justify-start relative"
          aria-label="Active voters and trusted organizations"
        >
          {/* Animated Avatars with Tooltip Popover */}
          <div className="flex -space-x-3 relative group" role="list" aria-label="Recent voters">
            {[11, 12, 13, 14, 15, 16].map((imgId, idx) => (
              <div
                key={imgId}
                className="relative"
                tabIndex={0}
                role="listitem"
                aria-label={`Voter avatar ${idx + 1}`}
                style={{ zIndex: 10 - idx }}
              >
                <img
                  src={`https://i.pravatar.cc/150?img=${imgId}`}
                  alt={`Voter avatar ${idx + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 shadow-md transition-all duration-300 will-change-[background-color,transform] cursor-pointer focus:ring-2 focus:ring-blue-400 focus:z-20 hover:scale-110"
                  loading="lazy"
                />
                {/* Animated online indicator */}
                <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white dark:border-gray-800 animate-pulse shadow" aria-hidden="true" />
                {/* Tooltip on hover/focus */}
                <span
                  className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap"
                  role="tooltip"
                >
                  Active Voter
                </span>
              </div>
            ))}
            {/* Animated "+N" overflow avatar */}
            <div
              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-md transition-all duration-300 will-change-[background-color,transform] cursor-pointer hover:scale-110 focus:ring-2 focus:ring-blue-400 focus:z-20"
              tabIndex={0}
              aria-label="More than 1,000 voters"
            >
              +994
            </div>
          </div>
          {/* Animated Count-Up and Trust Badges */}
          <div className="flex flex-col items-start gap-1 min-w-[180px]">
            {/* Animated Count-Up */}
            <span className="flex items-center gap-2">
              <span
                className="text-2xl font-bold text-blue-600 dark:text-blue-400"
                aria-live="polite"
                aria-atomic="true"
              >
                <CountUp end={1000} duration={2.2} separator="," />+
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-base font-medium">active voters</span>
              {/* Animated checkmark */}
              <svg className="w-5 h-5 text-green-500 dark:text-green-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                  initial={{ pathLength: 0, opacity: 0.5 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </svg>
            </span>
            {/* Ultra-Advanced Animated Trust Badges */}
            <div
              className="flex flex-wrap gap-2 mt-1"
              aria-label="Trusted by organizations"
              role="list"
            >
              {[
                {
                  name: "Fortune 500",
                  color: "blue",
                  bg: "bg-blue-100 dark:bg-blue-900/30",
                  text: "text-blue-800 dark:text-blue-400",
                  border: "border-blue-200 dark:border-blue-800/40",
                  delay: 0,
                  icon: (
                    <motion.svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={{ rotate: -10, scale: 0.8, opacity: 0.7 }}
                      animate={{ rotate: [0, 10, -10, 0], scale: [0.8, 1.1, 0.95, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.1 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414m12.728 0l-1.414-1.414M6.05 6.05L4.636 4.636"
                        initial={{ pathLength: 0.7, opacity: 0.7 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      />
                    </motion.svg>
                  ),
                  tooltip: "Trusted by leading global enterprises"
                },
                {
                  name: "Universities",
                  color: "green",
                  bg: "bg-green-100 dark:bg-green-900/30",
                  text: "text-green-800 dark:text-green-400",
                  border: "border-green-200 dark:border-green-800/40",
                  delay: 0.1,
                  icon: (
                    <motion.svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={{ scale: 0.8, opacity: 0.7 }}
                      animate={{ scale: [0.8, 1.1, 0.95, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.2 }}
                      />
                    </motion.svg>
                  ),
                  tooltip: "Used by top educational institutions"
                },
                {
                  name: "NGOs",
                  color: "purple",
                  bg: "bg-purple-100 dark:bg-purple-900/30",
                  text: "text-purple-800 dark:text-purple-400",
                  border: "border-purple-200 dark:border-purple-800/40",
                  delay: 0.2,
                  icon: (
                    <motion.svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={{ scale: 0.8, opacity: 0.7 }}
                      animate={{ scale: [0.8, 1.1, 0.95, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.3 }}
                    >
                      <motion.circle
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        initial={{ pathLength: 0.7, opacity: 0.7 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      />
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4m0 4h.01"
                        initial={{ pathLength: 0, opacity: 0.5 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.3 }}
                      />
                    </motion.svg>
                  ),
                  tooltip: "Empowering non-profits worldwide"
                },
                {
                  name: "More",
                  color: "gray",
                  bg: "bg-gray-100 dark:bg-gray-800/30",
                  text: "text-gray-800 dark:text-gray-200",
                  border: "border-gray-200 dark:border-gray-700/40",
                  delay: 0.3,
                  icon: (
                    <motion.svg
                      className="w-3.5 h-3.5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      initial={{ scale: 0.8, opacity: 0.7 }}
                      animate={{ scale: [0.8, 1.1, 0.95, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
                    >
                      <motion.path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                        initial={{ pathLength: 0.7, opacity: 0.7 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                      />
                    </motion.svg>
                  ),
                  tooltip: "And many more organizations"
                }
              ].map((badge, idx) => (
                <motion.span
                  key={badge.name}
                  className={`
                    group relative inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
                    ${badge.bg} ${badge.text} ${badge.border}
                    shadow-sm animate-fade-in
                  `}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  tabIndex={0}
                  role="listitem"
                  aria-label={badge.name}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.5, delay: badge.delay, ease: [0.4, 0, 0.2, 1] }}
                  whileHover={{ scale: 1.08, boxShadow: "0 2px 12px 0 rgba(59,130,246,0.10)" }}
                  whileFocus={{ scale: 1.08, boxShadow: "0 2px 12px 0 rgba(59,130,246,0.12)" }}
                >
                  {badge.icon}
                  <span className="truncate">{badge.name}</span>
                  {/* Tooltip on hover/focus */}
                  <span
                    className={`
                      pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg
                      bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100
                      transition-opacity duration-200 shadow-lg whitespace-pre-line
                    `}
                    role="tooltip"
                  >
                    {badge.tooltip}
                  </span>
                  {/* Animated highlight ring */}
                  <motion.span
                    className="absolute -inset-1 rounded-full pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.12 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      background: `linear-gradient(90deg,rgba(59,130,246,0.08) 0%,rgba(59,130,246,0.02) 100%)`
                    }}
                    aria-hidden="true"
                  />
                </motion.span>
              ))}
            </div>
            {/* Subtext */}
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 transition-colors duration-300 will-change-[color]">
              Trusted by organizations worldwide
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Image Section with Parallax, Animated Overlay, and Accessibility */}
      <div className="flex-1 flex items-center justify-center">
        <img
          src={landingHeroWebp}
          srcSet={`${landingHeroWebp} 1x, ${landingHeroPng} 2x`}
          alt="Online voting platform hero"
          className="max-w-full h-auto rounded-xl transition-all duration-500"
          loading="lazy"
          width={600}
          height={400}
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>

    {/* Advanced Scroll Indicator */}
    <motion.div
      className="absolute left-1/2 bottom-0 mb-4 sm:mb-8 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6, type: "spring", stiffness: 60 }}
      aria-label="Scroll down indicator"
      tabIndex={0}
      role="presentation"
    >
      {/* Animated "Scroll to explore" with gradient shimmer */}
      <motion.div
        className="relative text-gray-500 dark:text-gray-400 text-sm font-semibold transition-colors duration-300 will-change-[color] select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <span className="relative z-10">Scroll to explore</span>
        <motion.span
          className="absolute left-0 top-0 h-full w-full bg-gradient-to-r from-blue-400/30 via-transparent to-blue-400/30 rounded blur-sm pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0], x: [0, 20, 0] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
            delay: 1.2,
          }}
        />
      </motion.div>
      {/* Interactive Mouse/Touch Scroll Icon */}
      <motion.button
        type="button"
        aria-label="Scroll down"
        tabIndex={0}
        className="group w-8 h-14 rounded-full border-2 border-gray-300 dark:border-gray-600 flex flex-col items-center justify-start p-1.5 bg-white/70 dark:bg-[#23272f]/70 shadow-lg hover:scale-105 focus:scale-105 active:scale-95 transition-all duration-200 will-change-[transform,border-color,background-color] outline-none ring-0 focus-visible:ring-2 focus-visible:ring-blue-400"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring", stiffness: 80 }}
        onClick={() => {
          // Smooth scroll to next section
          const next = document.querySelector('[data-hero-next]');
          if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      >
        {/* Mouse body */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          width="32"
          height="56"
          viewBox="0 0 32 56"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="24"
            height="48"
            rx="12"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-300 dark:text-gray-600"
            style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.04))" }}
          />
        </svg>
        {/* Animated dot */}
        <motion.div
          className="relative z-10 w-2 h-2 rounded-full bg-blue-400 dark:bg-blue-500 shadow-md"
          animate={{
            y: [0, 18, 0],
            opacity: [1, 1, 0.7, 1],
            scale: [1, 1.1, 1, 1],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        />
        {/* Animated chevrons */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 pointer-events-none">
          <motion.svg
            width="16"
            height="8"
            viewBox="0 0 16 8"
            fill="none"
            className="text-blue-400 dark:text-blue-500"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: [0, 1, 0], y: [0, 4, 8] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.2,
            }}
            aria-hidden="true"
          >
            <path d="M2 2l6 4 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
          <motion.svg
            width="16"
            height="8"
            viewBox="0 0 16 8"
            fill="none"
            className="text-blue-300 dark:text-blue-400"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: [0, 0.7, 0], y: [0, 2, 6] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 0.5,
            }}
            aria-hidden="true"
          >
            <path d="M2 2l6 4 6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </motion.svg>
        </div>
      </motion.button>
      {/* Optional: Keyboard hint */}
      <motion.div
        className="hidden @[480px]:flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        aria-hidden="true"
      >
        <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-mono">↓</kbd>
        <span>or scroll</span>
      </motion.div>
    </motion.div>
  </div>
);
};

export default memo(HeroSection); 