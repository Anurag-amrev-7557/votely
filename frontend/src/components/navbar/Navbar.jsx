import React, { useState, useEffect, useCallback, memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useAuth } from '../../context/AuthContext';

// Memoized NavLink component
const NavLink = memo(({ href, label, index }) => (
    <motion.a
        href={href}
        className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-normal hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 relative group"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
    >
        {label}
        <motion.span 
            className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.2 }}
        />
    </motion.a>
));

// Memoized ThemeToggle component
const ThemeToggle = memo(({ isDarkMode, isSwitching, handleThemeToggle }) => (
    <motion.button
        onClick={handleThemeToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 ${
            isSwitching ? 'scale-90' : ''
        } theme-icon-transition`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme"
    >
        <div className="relative w-5 h-5">
            <motion.svg
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 will-change-[opacity,transform] ${
                    isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
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
                className={`absolute inset-0 w-5 h-5 transition-all duration-150 will-change-[opacity,transform] ${
                    isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
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

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { isAdmin, logout: adminLogout } = useAdminAuth();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSwitching, setIsSwitching] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Memoize scroll handler
    const handleScroll = useCallback(() => {
        setIsScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

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

    // Memoize admin click handler
    const handleAdminClick = useCallback(() => {
        if (isAdmin) {
            navigate('/admin');
        } else {
            navigate('/admin-login');
        }
    }, [isAdmin, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Memoize navLinks array
    const navLinks = React.useMemo(() => [
        { href: '/how-it-works', label: 'How it works' },
        { href: '/security', label: 'Security' },
        { href: '/accessibility', label: 'Accessibility' },
        { href: '/pricing', label: 'Pricing' }
    ], []);

    return (
        <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 ease-in-out will-change-[background-color,box-shadow] ${
                isScrolled 
                    ? 'bg-white dark:bg-gray-800 shadow-sm' 
                    : 'bg-white dark:bg-gray-800'
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            {navLinks.map((link, index) => (
                                <NavLink key={link.href} href={link.href} label={link.label} index={index} />
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <ThemeToggle isDarkMode={isDarkMode} isSwitching={isSwitching} handleThemeToggle={handleThemeToggle} />
                            {user ? (
                                <>
                                    <motion.button
                                        onClick={handleLogout}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg"
                                    >
                                        <span className="truncate">Logout</span>
                                    </motion.button>
                                    <Link to="/profile">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg"
                                        >
                                            <span className="truncate">Profile</span>
                                        </motion.button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg"
                                        >
                                            <span className="truncate">Login</span>
                                        </motion.button>
                                    </Link>
                                    <Link to="/register">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-200 hover:shadow-lg"
                                        >
                                            <span className="truncate">Sign Up</span>
                                        </motion.button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
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

                {/* Mobile Menu */}
                <AnimatePresence mode="wait">
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                style={{ top: '68px' }}
                                className="fixed inset-x-0 bottom-0 bg-black/20 backdrop-blur-[2px] z-[45] will-change-[opacity]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            />
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ 
                                    height: "auto",
                                    opacity: 1
                                }}
                                exit={{ 
                                    height: 0,
                                    opacity: 0
                                }}
                                transition={{ 
                                    height: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                        mass: 0.8,
                                        duration: 0.3
                                    },
                                    opacity: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                        mass: 0.8,
                                        duration: 0.3
                                    },
                                    exit: {
                                        height: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.8,
                                            duration: 0.3
                                        },
                                        opacity: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25,
                                            mass: 0.8,
                                            duration: 0.3
                                        }
                                    }
                                }}
                                className="md:hidden fixed inset-x-0 top-[68px] z-[50] overflow-hidden will-change-transform"
                            >
                                <div className="max-w-[calc(100%-24px)] mx-auto mt-3">
                                    <motion.div 
                                        className="px-6 py-8 space-y-8 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors duration-150 will-change-[background-color]"
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={{
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.03,
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                    mass: 0.8
                                                }
                                            },
                                            hidden: {
                                                transition: {
                                                    staggerChildren: 0.03,
                                                    staggerDirection: -1,
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 30,
                                                    mass: 0.8,
                                                    when: "afterChildren"
                                                }
                                            }
                                        }}
                                    >
                                        <motion.div 
                                            className="flex flex-col space-y-3"
                                            variants={{
                                                hidden: { 
                                                    opacity: 0,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                        mass: 0.8
                                                    }
                                                },
                                                visible: { 
                                                    opacity: 1,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                        mass: 0.8
                                                    }
                                                }
                                            }}
                                        >
                                            {navLinks.map((link, index) => (
                                                <motion.a
                                                    key={link.href}
                                                    href={link.href}
                                                    className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all duration-150 text-base font-medium will-change-transform border border-transparent hover:border-gray-100 dark:hover:border-gray-800 flex items-center gap-3"
                                                    whileHover={{ x: 5, scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    transition={{ 
                                                        duration: 0.15,
                                                        ease: [0.16, 1, 0.3, 1]
                                                    }}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    style={{
                                                        transformOrigin: "left center"
                                                    }}
                                                >
                                                    {link.label === "How it works" && (
                                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                    {link.label === "Security" && (
                                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    )}
                                                    {link.label === "Accessibility" && (
                                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                    )}
                                                    {link.label === "Pricing" && (
                                                        <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    )}
                                                    {link.label}
                                                </motion.a>
                                            ))}
                                        </motion.div>
                                        <motion.div 
                                            className="flex flex-col gap-3"
                                            variants={{
                                                hidden: { 
                                                    opacity: 0,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                        mass: 0.8
                                                    }
                                                },
                                                visible: { 
                                                    opacity: 1,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 30,
                                                        mass: 0.8
                                                    }
                                                }
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                <motion.button
                                                    onClick={() => {
                                                        toggleTheme();
                                                        setIsMobileMenuOpen(false);
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="flex-1 px-4 py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-all duration-150 text-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2"
                                                >
                                                    {isDarkMode ? (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                            <span>Light Mode</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                            </svg>
                                                            <span>Dark Mode</span>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                            {user ? (
                                                <>
                                                    <motion.button
                                                        onClick={() => {
                                                            handleLogout();
                                                            setIsMobileMenuOpen(false);
                                                        }}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        Logout
                                                    </motion.button>
                                                    <Link to="/profile">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            Profile
                                                        </motion.button>
                                                    </Link>
                                                </>
                                            ) : (
                                                <>
                                                    <Link to="/login">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                            </svg>
                                                            Login
                                                        </motion.button>
                                                    </Link>
                                                    <Link to="/register">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                                            onClick={() => setIsMobileMenuOpen(false)}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                            </svg>
                                                            Sign Up
                                                        </motion.button>
                                                    </Link>
                                                </>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Navbar;