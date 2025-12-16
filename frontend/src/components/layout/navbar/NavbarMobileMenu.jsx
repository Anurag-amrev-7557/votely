import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
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

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, setIsOpen]);

    // --- Animation Variants ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        }
    };

    const linkVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        exit: { y: 20, opacity: 0 }
    };

    const bottomVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.4, delay: 0.2 }
        },
        exit: { y: 20, opacity: 0 }
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="mobile-menu"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="fixed inset-0 z-[110] flex flex-col bg-white dark:bg-black overflow-hidden"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Mobile Navigation"
                >
                    {/* --- Aurora Background Effects --- */}
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 dark:bg-blue-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-600/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
                        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-indigo-500/10 dark:bg-indigo-600/20 blur-[80px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
                    </div>

                    {/* --- Header (Close Button) --- */}
                    <div className="relative z-20 flex justify-between items-center px-6 py-6 md:px-8">
                        {/* Brand (Optional, keeps context) */}
                        <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Votely
                        </span>

                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white hover:scale-110 transition-transform"
                            aria-label="Close menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    {/* --- Main Navigation Links --- */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 space-y-4">
                        {navLinks.map((link, i) => (
                            <motion.div key={link.href} variants={linkVariants} custom={i}>
                                <Link
                                    to={link.href}
                                    onClick={onLinkClick(link.sectionId)}
                                    className="group block"
                                >
                                    <span className="block text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                                        {link.label}
                                    </span>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* --- Bottom Actions --- */}
                    <motion.div
                        variants={bottomVariants}
                        className="relative z-20 px-6 py-8 border-t border-gray-300 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md"
                    >
                        <div className="flex flex-col gap-4">
                            {/* Primary Action Row */}
                            <div className="flex gap-4">
                                {user ? (
                                    <>
                                        <Link to="/profile" className="flex-1" onClick={() => setIsOpen(false)}>
                                            <button className="w-full h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                                                My Profile
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => { handleLogout(); setIsOpen(false); }}
                                            className="h-14 px-6 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/register" className="flex-1" onClick={() => setIsOpen(false)}>
                                            <button className="w-full h-14 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-bold text-lg tracking-wide hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg">
                                                Get Started
                                            </button>
                                        </Link>
                                        <Link to="/login" className="flex-1" onClick={() => setIsOpen(false)}>
                                            <button className="w-full h-14 rounded-full border border-gray-300 dark:border-white/20 text-gray-900 dark:text-white font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                                                Log In
                                            </button>
                                        </Link>
                                    </>
                                )}
                            </div>

                            {/* Secondary Row: Theme & Socials placeholder */}
                            <div className="flex justify-between items-center mt-2">
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    {isDarkMode ? (
                                        <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg> Switch to Light</>
                                    ) : (
                                        <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg> Switch to Dark</>
                                    )}
                                </button>
                                <span className="text-xs text-gray-600">© 2024 Votely</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
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
