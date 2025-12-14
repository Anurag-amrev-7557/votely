import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import PropTypes from 'prop-types';

const NavbarMobileMenu = ({
    isOpen,
    setIsOpen,
    navLinks,
    onLinkClick,
    user,
    handleLogout
}) => {
    const { isDarkMode, toggleTheme } = useTheme();

    // Animation variants
    const menuVariants = {
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
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: -20,
            scale: 0.95,
            filter: "blur(4px)",
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.9,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1]
            }
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 35,
                mass: 0.9,
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };

    // Component logic from original Navbar
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, setIsOpen]);

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ top: '68px' }}
                        className="fixed inset-x-0 bottom-0 bg-black/20 backdrop-blur-[2px] z-[45] will-change-[opacity]"
                        onClick={() => setIsOpen(false)}
                        aria-hidden="true"
                    />
                    <motion.div
                        id="mobile-menu"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                        className="mobile-menu md:hidden fixed inset-x-0 top-[68px] z-[50] overflow-hidden will-change-transform focus:outline-none"
                        tabIndex={-1}
                    >
                        <div className="max-w-[calc(100%-24px)] mx-auto mt-3">
                            <motion.div
                                className="px-6 py-8 space-y-8 flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 transition-colors duration-150 will-change-[background-color]"
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                variants={menuVariants}
                            >
                                <motion.div
                                    className="flex flex-col space-y-3"
                                    variants={itemVariants}
                                >
                                    {navLinks.map((link, index) => (
                                        <Link
                                            key={link.href}
                                            to={link.href}
                                            onClick={onLinkClick(link.sectionId)}
                                            style={{ textDecoration: 'none' }}
                                            tabIndex={0}
                                            aria-label={link.label}
                                            className="focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                        >
                                            <motion.div
                                                className="group relative block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 rounded-xl transition-all duration-300 text-base font-medium will-change-transform border border-transparent hover:border-blue-200 dark:hover:border-blue-800/30 flex items-center gap-3 overflow-hidden"
                                                whileHover={{
                                                    x: 5,
                                                    scale: 1.02,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 400,
                                                        damping: 25,
                                                        mass: 0.8
                                                    }
                                                }}
                                                whileTap={{
                                                    scale: 0.98,
                                                    transition: {
                                                        type: "spring",
                                                        stiffness: 600,
                                                        damping: 30
                                                    }
                                                }}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    duration: 0.3,
                                                    delay: index * 0.1,
                                                    ease: [0.16, 1, 0.3, 1]
                                                }}
                                                style={{
                                                    transformOrigin: "left center"
                                                }}
                                            >
                                                {/* Animated Background Gradient */}
                                                <motion.div
                                                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    initial={false}
                                                    whileHover={{
                                                        scale: 1.1,
                                                        transition: { duration: 0.3 }
                                                    }}
                                                />

                                                {/* Enhanced Text with Gradient */}
                                                <motion.span
                                                    className="relative z-10 font-semibold bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-100 group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 bg-clip-text text-transparent transition-all duration-300"
                                                    whileHover={{
                                                        x: 2,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                >
                                                    {link.label}
                                                </motion.span>

                                                {/* Animated Arrow Indicator */}
                                                <motion.div
                                                    className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                                    initial={{ x: -10, opacity: 0 }}
                                                    whileHover={{
                                                        x: 0,
                                                        opacity: 1,
                                                        transition: { duration: 0.3 }
                                                    }}
                                                >
                                                    <svg className="w-4 h-4 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </motion.div>
                                            </motion.div>
                                        </Link>
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
                                                setIsOpen(false);
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1 px-4 py-3 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-200 rounded-xl font-semibold transition-all duration-150 text-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                                            tabIndex={0}
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
                                                    setIsOpen(false);
                                                }}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-400/70"
                                                aria-label="Logout"
                                                tabIndex={0}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                </svg>
                                                Logout
                                            </motion.button>
                                            <Link to="/profile" tabIndex={0} aria-label="Profile" className="focus-visible:ring-2 focus-visible:ring-blue-400/70">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                                    onClick={() => setIsOpen(false)}
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
                                            <Link to="/login" tabIndex={0} aria-label="Login" className="focus-visible:ring-2 focus-visible:ring-blue-400/70">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 flex items-center justify-center gap-2"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                    </svg>
                                                    Login
                                                </motion.button>
                                            </Link>
                                            <Link to="/register" tabIndex={0} aria-label="Sign Up" className="focus-visible:ring-2 focus-visible:ring-blue-400/70">
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-150 text-sm shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                                                    onClick={() => setIsOpen(false)}
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
    );
};

NavbarMobileMenu.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
    navLinks: PropTypes.arrayOf(PropTypes.shape({
        href: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        sectionId: PropTypes.string.isRequired
    })).isRequired,
    onLinkClick: PropTypes.func.isRequired,
    user: PropTypes.object,
    handleLogout: PropTypes.func.isRequired
};

export default NavbarMobileMenu;
