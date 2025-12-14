import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';
import { getBestProfilePhoto } from '../../../utils/ui/photoUtils';
import throttle from 'lodash/throttle';
import NavbarMobileMenu from './NavbarMobileMenu';

const isExternal = url => /^https?:\/\//.test(url);

const AdvancedNavLink = memo(
    ({
        href,
        label,
        labelNode,
        index = 0,
        icon: Icon,
        tooltip,
        className = '',
        onClick,
        activeClassName = 'text-blue-600 dark:text-blue-400 font-semibold',
        inactiveClassName = 'text-gray-600 dark:text-gray-300',
        underlineColor = 'bg-blue-600 dark:bg-blue-400',
        underlineHeight = 'h-0.5',
        onMouseEnter,
        ...rest
    }) => {
        const location = useLocation();
        const isActive =
            !isExternal(href) &&
            (location.pathname === href ||
                (href !== '/' && location.pathname.startsWith(href)));

        // Accessibility: id for tooltip
        const tooltipId = tooltip && typeof label === 'string' ? `navlink-tooltip-${label.replace(/\s+/g, '-')}` : undefined;

        // Animation variants for underline
        const underlineVariants = {
            initial: { width: 0 },
            hover: { width: '100%' },
            active: { width: '100%' },
        };

        // Animation for link entrance
        const linkVariants = {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
        };

        // Choose element: <Link> for internal, <a> for external
        const LinkComponent = isExternal(href) ? 'a' : Link;

        return (
            <motion.div
                variants={linkVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 300, damping: 24 }}
                className="relative inline-block"
            >
                <LinkComponent
                    to={!isExternal(href) ? href : undefined}
                    href={isExternal(href) ? href : undefined}
                    target={isExternal(href) ? '_blank' : undefined}
                    rel={isExternal(href) ? 'noopener noreferrer' : undefined}
                    tabIndex={0}
                    aria-current={isActive ? 'page' : undefined}
                    aria-describedby={tooltipId}
                    className={`
            group flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70
            ${isActive ? activeClassName : inactiveClassName}
            ${className}
          `}
                    onClick={onClick}
                    onMouseEnter={onMouseEnter}
                    {...rest}
                >
                    {Icon && <Icon className="w-4 h-4" aria-hidden="true" />}
                    <span>{labelNode || label}</span>
                    {/* Tooltip (optional) */}
                    {tooltip && tooltipId && (
                        <span
                            id={tooltipId}
                            role="tooltip"
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 px-2 py-1 rounded bg-gray-800 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 pointer-events-none transition-opacity duration-150"
                        >
                            {tooltip}
                        </span>
                    )}
                    {/* Animated underline */}
                    <motion.span
                        className={`absolute bottom-0 left-0 ${underlineHeight} ${underlineColor} rounded-full transition-all duration-200`}
                        variants={underlineVariants}
                        initial="initial"
                        animate={isActive ? 'active' : undefined}
                        whileHover="hover"
                        whileFocus="hover"
                        style={{ right: 0 }}
                        layout
                    />
                </LinkComponent>
            </motion.div>
        );
    }
);

AdvancedNavLink.displayName = 'AdvancedNavLink';

AdvancedNavLink.propTypes = {
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    labelNode: PropTypes.node,
    index: PropTypes.number,
    icon: PropTypes.elementType,
    tooltip: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    activeClassName: PropTypes.string,
    inactiveClassName: PropTypes.string,
    underlineColor: PropTypes.string,
    underlineHeight: PropTypes.string,
    onMouseEnter: PropTypes.func,
};

export { AdvancedNavLink as NavLink };

// Memoized ThemeToggle component
const ThemeToggle = memo(({ isDarkMode, isSwitching, handleThemeToggle }) => (
    <motion.button
        onClick={handleThemeToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${isSwitching ? 'scale-90' : ''
            } theme-icon-transition`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
    >
        <div className="relative w-5 h-5">
            <motion.svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 will-change-[opacity,transform] ${isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDarkMode ? '#6B7280' : '#F59E0B'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                    rotate: isDarkMode ? 90 : 0,
                    scale: isDarkMode ? 0 : 1,
                    opacity: isDarkMode ? 0 : 1
                }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
            >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.svg>
            <motion.svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 will-change-[opacity,transform] ${isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                    }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke={isDarkMode ? '#FFFFFF' : '#6B7280'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                    rotate: isDarkMode ? 0 : -90,
                    scale: isDarkMode ? 1 : 0,
                    opacity: isDarkMode ? 1 : 0
                }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
            >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </motion.svg>
        </div>
        <div className="relative h-5 w-20 overflow-hidden flex items-center">
            <motion.div
                className="absolute inset-0 transform-gpu flex items-center"
                animate={{
                    y: isDarkMode ? -20 : 0,
                    opacity: isDarkMode ? 0 : 1
                }}
                transition={{
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.1 }
                }}
            >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    Light Mode
                </span>
            </motion.div>
            <motion.div
                className="absolute inset-0 transform-gpu flex items-center"
                animate={{
                    y: isDarkMode ? 0 : 20,
                    opacity: isDarkMode ? 1 : 0
                }}
                transition={{
                    duration: 0.15,
                    ease: [0.4, 0, 0.2, 1],
                    opacity: { duration: 0.1 }
                }}
            >
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                    Dark Mode
                </span>
            </motion.div>
        </div>
    </motion.button>
));

ThemeToggle.displayName = 'ThemeToggle';

// Static navLinks configuration to avoid recreation
const NAV_LINKS_CONFIG = [
    { href: '/nominate', label: 'Nominate', sectionId: 'nominate' },
    { href: '#how-it-works', label: 'How it works', sectionId: 'how-it-works' },
    { href: '#security', label: 'Security', sectionId: 'security' },
    { href: '#accessibility', label: 'Accessibility', sectionId: 'accessibility' },
    { href: '#pricing', label: 'Pricing', sectionId: 'pricing' }
];

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isAdmin } = useAdminAuth();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSwitching, setIsSwitching] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = React.useRef(window.scrollY);
    const menuButtonRef = React.useRef(null);

    // Optimized scroll handler with throttle
    useEffect(() => {
        const handleScroll = throttle(() => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 20);

            if (currentScrollY < 20) {
                setShowNavbar(true);
            } else if (currentScrollY > lastScrollY.current) {
                // Scrolling down
                setShowNavbar(false);
            } else {
                // Scrolling up
                setShowNavbar(true);
            }
            lastScrollY.current = currentScrollY;
        }, 150); // Throttle to run at most every 150ms

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            handleScroll.cancel();
        };
    }, []);

    // Memoize theme toggle handler
    const handleThemeToggle = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setIsSwitching(true);

        document.documentElement.style.setProperty('--x', `${x}%`);
        document.documentElement.style.setProperty('--y', `${y}%`);

        toggleTheme();
        setIsSwitching(false);
    }, [toggleTheme]);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/');
    }, [logout, navigate]);

    // Helper: Smooth scroll to section by id
    const scrollToSection = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Handler for nav link click
    const handleNavLinkClick = useCallback((sectionId) => (e) => {
        e.preventDefault();
        if (window.location.pathname === '/') {
            scrollToSection(sectionId);
        } else {
            navigate('/', { replace: false });
            setTimeout(() => scrollToSection(sectionId), 100); // Delay for navigation
        }
        setIsMobileMenuOpen(false); // Close mobile menu if open
    }, [navigate, scrollToSection]);

    // Helper: Preload landing page chunk on hover if not already on '/'
    const handleNavLinkHover = useCallback(() => {
        if (window.location.pathname !== '/') {
            import('../../../pages/landing/LandingPage');
        }
    }, []);

    // Focus management for mobile menu
    useEffect(() => {
        if (!isMobileMenuOpen && menuButtonRef.current) {
            // Return focus to button when menu closes
            // Using a small timeout to ensure the element is focusable
            setTimeout(() => {
                menuButtonRef.current?.focus();
            }, 0);
        }
    }, [isMobileMenuOpen]);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: showNavbar ? 0 : -100 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ease-in-out will-change-[background-color,box-shadow] ${isScrolled
                ? 'bg-white dark:bg-gray-900 shadow-sm'
                : 'bg-white dark:bg-gray-900'
                }`}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3">
                    <Link to="/" className="flex items-center gap-4">
                        <motion.div
                            className="size-6 text-blue-600 dark:text-blue-400 relative z-10"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <path
                                    d="M42.4379 44C42.4379 44 36.0744 33.9038 41.1692 24C46.8624 12.9336 42.2078 4 42.2078 4L7.01134 4C7.01134 4 11.6577 12.932 5.96912 23.9969C0.876273 33.9029 7.27094 44 7.27094 44L42.4379 44Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </motion.div>
                        <motion.h2
                            className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] relative z-10"
                            whileHover={{ color: isDarkMode ? '#60A5FA' : '#2563EB' }}
                            transition={{ duration: 0.2 }}
                        >
                            Votely
                        </motion.h2>
                    </Link>

                    {/* Desktop Navigation - Advanced */}
                    <nav
                        className="hidden md:flex flex-1 justify-end gap-8 items-center"
                        aria-label="Main navigation"
                        role="navigation"
                        tabIndex={0}
                    >
                        {/* Animated Nav Links with Enhanced Icons */}
                        <div className="flex items-center gap-9">
                            {NAV_LINKS_CONFIG.map((link, index) => {
                                // Assign relevant icons for each nav link
                                let IconComponent = null;
                                switch (link.href) {
                                    case '#how-it-works':
                                        IconComponent = (
                                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 20v-6"></path>
                                                <path d="M12 4v2"></path>
                                                <path d="M6.93 6.93l-1.42-1.42"></path>
                                                <path d="M17.07 6.93l1.42-1.42"></path>
                                                <circle cx="12" cy="12" r="8"></circle>
                                            </svg>
                                        );
                                        break;
                                    case '#security':
                                        IconComponent = (
                                            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                            </svg>
                                        );
                                        break;
                                    case '#accessibility':
                                        IconComponent = (
                                            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle cx="12" cy="7" r="4"></circle>
                                                <path d="M5.5 21l1.5-7 2.5-2.5"></path>
                                                <path d="M18.5 21l-1.5-7-2.5-2.5"></path>
                                                <path d="M12 11v10"></path>
                                            </svg>
                                        );
                                        break;
                                    case '#pricing':
                                        IconComponent = (
                                            <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <path d="M12 8v4l3 3"></path>
                                            </svg>
                                        );
                                        break;
                                    default:
                                        IconComponent = null;
                                }
                                return (
                                    <AdvancedNavLink
                                        key={link.href}
                                        href={link.href}
                                        label={link.label}
                                        labelNode={
                                            <motion.span
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.08 * index, duration: 0.35, type: "spring", stiffness: 180 }}
                                                className="inline-flex items-center gap-1"
                                            >
                                                {IconComponent}
                                                {link.label}
                                            </motion.span>
                                        }
                                        index={index}
                                        tooltip={`Learn more about ${link.label}`}
                                        onClick={handleNavLinkClick(link.sectionId)}
                                        onMouseEnter={handleNavLinkHover}
                                    />
                                );
                            })}
                        </div>
                        {/* Right-side controls */}
                        <div className="flex items-center gap-2">
                            {/* Theme Toggle with Tooltip */}
                            <div className="relative group">
                                <ThemeToggle
                                    isDarkMode={isDarkMode}
                                    isSwitching={isSwitching}
                                    handleThemeToggle={handleThemeToggle}
                                />
                                <span
                                    className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg"
                                    role="tooltip"
                                >
                                    {isDarkMode ? (
                                        <>
                                            <svg className="inline w-4 h-4 mr-1 text-yellow-300" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.03a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zm-2.03 4.22a1 1 0 011.42 1.42l-.7.7a1 1 0 01-1.42-1.42l.7-.7zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-2.03a1 1 0 00-1.42 1.42l.7.7a1 1 0 001.42-1.42l-.7-.7zM4 11a1 1 0 100-2H3a1 1 0 100 2h1zm2.03-4.22a1 1 0 00-1.42-1.42l-.7.7a1 1 0 001.42 1.42l.7-.7z" /></svg>
                                            Switch to light mode
                                        </>
                                    ) : (
                                        <>
                                            <svg className="inline w-4 h-4 mr-1 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                            Switch to dark mode
                                        </>
                                    )}
                                </span>
                            </div>
                            {/* Auth Buttons */}
                            {user ? (
                                <>
                                    {/* Logout Button with Animated Icon and Tooltip */}
                                    <div className="relative group">
                                        <motion.button
                                            onClick={handleLogout}
                                            whileHover={{ scale: 1.08, boxShadow: "0 2px 12px 0 rgba(59,130,246,0.10)" }}
                                            whileTap={{ scale: 0.96 }}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg gap-2"
                                            aria-label="Logout"
                                        >
                                            <motion.svg
                                                initial={{ rotate: 0 }}
                                                whileHover={{ rotate: 90 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                className="w-4 h-4 mr-1 text-red-500"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path d="M17 16l4-4m0 0l-4-4m4 4H7"></path>
                                                <path d="M7 8v8a4 4 0 004 4h1"></path>
                                            </motion.svg>
                                            <span className="truncate">Logout</span>
                                        </motion.button>
                                        <span
                                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg"
                                            role="tooltip"
                                        >
                                            <svg className="inline w-4 h-4 mr-1 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"></path></svg>
                                            Sign out of your account
                                        </span>
                                    </div>
                                    {/* Profile Button with Avatar and Tooltip */}
                                    <div className="relative group">
                                        <Link to="/profile" tabIndex={-1}>
                                            <motion.button
                                                whileHover={{ scale: 1.08, boxShadow: "0 2px 12px 0 rgba(59,130,246,0.10)" }}
                                                whileTap={{ scale: 0.96 }}
                                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg gap-2"
                                                aria-label="Profile"
                                            >
                                                {/* User Avatar or Fallback Icon */}
                                                {getBestProfilePhoto(user, null, null, false) ? (
                                                    <img
                                                        src={getBestProfilePhoto(user, null, null, false)}
                                                        alt="User avatar"
                                                        className="w-6 h-6 rounded-full object-cover mr-2"
                                                        loading="lazy"
                                                        draggable="false"
                                                        onError={e => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <svg
                                                        className="w-5 h-5 mr-2 text-white/80"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        viewBox="0 0 24 24"
                                                        aria-hidden="true"
                                                    >
                                                        <circle cx="12" cy="8" r="4" />
                                                        <path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4"></path>
                                                    </svg>
                                                )}
                                                <span className="truncate">Profile</span>
                                            </motion.button>
                                        </Link>
                                        <span
                                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg"
                                            role="tooltip"
                                        >
                                            <svg className="inline w-4 h-4 mr-1 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M6 20c0-2.21 3.58-4 6-4s6 1.79 6 4"></path></svg>
                                            View your profile
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Login Button with Icon and Tooltip */}
                                    <div className="relative group">
                                        <Link to="/login" tabIndex={-1}>
                                            <motion.button
                                                whileHover={{ scale: 1.08, boxShadow: "0 2px 12px 0 rgba(59,130,246,0.10)" }}
                                                whileTap={{ scale: 0.96 }}
                                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg gap-2"
                                                aria-label="Login"
                                            >
                                                <svg
                                                    className="w-5 h-5 mr-2 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    viewBox="0 0 24 24"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M15 12H3m0 0l4-4m-4 4l4 4"></path>
                                                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                                <span className="truncate">Login</span>
                                            </motion.button>
                                        </Link>
                                        <span
                                            className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg"
                                            role="tooltip"
                                        >
                                            <svg className="inline w-4 h-4 mr-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M15 12H3m0 0l4-4m-4 4l4 4"></path></svg>
                                            Sign in to your account
                                        </span>
                                    </div>
                                    {/* Sign Up Button Removed - Unified Login Flow */}
                                </>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <motion.button
                        ref={menuButtonRef}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-controls="mobile-menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <svg
                            className="w-6 h-6 text-gray-600 dark:text-gray-300 transition-colors duration-150 will-change-[color]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </motion.button>
                </div>

                {/* Mobile Menu Component */}
                <NavbarMobileMenu
                    isOpen={isMobileMenuOpen}
                    setIsOpen={setIsMobileMenuOpen}
                    navLinks={NAV_LINKS_CONFIG}
                    onLinkClick={handleNavLinkClick}
                    user={user}
                    handleLogout={handleLogout}
                />
            </div>
        </motion.header>
    );
};

export default Navbar;