import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getBestProfilePhoto } from '../../../utils/ui/photoUtils';
import NavbarMobileMenu from './NavbarMobileMenu';

const isExternal = url => /^https?:\/\//.test(url);

const AdvancedNavLink = memo(
    ({
        href,
        label,
        index = 0,
        className = '',
        onClick,
        activeClassName = 'text-gray-900 dark:text-white font-medium bg-gray-100/50 dark:bg-white/10',
        inactiveClassName = 'text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5',
        onMouseEnter,
        sectionId, // Destructure sectionId so it is not passed in ...rest
        ...rest
    }) => {
        const location = useLocation();
        const isActive =
            !isExternal(href) &&
            (location.pathname === href ||
                (href !== '/' && location.pathname.startsWith(href)));

        const LinkComponent = isExternal(href) ? 'a' : Link;

        return (
            <LinkComponent
                to={!isExternal(href) ? href : undefined}
                href={isExternal(href) ? href : undefined}
                target={isExternal(href) ? '_blank' : undefined}
                rel={isExternal(href) ? 'noopener noreferrer' : undefined}
                className={`
                    relative px-4 py-2 rounded-full text-sm transition-all duration-300
                    ${isActive ? activeClassName : inactiveClassName}
                    ${className}
                `}
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                {...rest}
            >
                {label}
            </LinkComponent>
        );
    }
);

AdvancedNavLink.displayName = 'AdvancedNavLink';

const ThemeToggle = memo(({ isDarkMode, toggleTheme }) => (
    <button
        onClick={toggleTheme}
        className="relative w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-400"
        aria-label="Toggle theme"
    >
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ y: -20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: 20, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
            >
                {isDarkMode ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </motion.div>
        </AnimatePresence>
    </button>
));

ThemeToggle.displayName = 'ThemeToggle';

const NAV_LINKS_CONFIG = [
    { href: '/nominate', label: 'Nominate', sectionId: 'nominate' },
    { href: '#how-it-works', label: 'Process', sectionId: 'how-it-works' },
    { href: '#security', label: 'Security', sectionId: 'security' },
    { href: '#pricing', label: 'Plans', sectionId: 'pricing' }
];

const Navbar = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Refs for direct DOM manipulation to avoid re-renders
    const headerRef = useRef(null);
    const sentinelRef = useRef(null);

    // Optimized scroll handler using IntersectionObserver
    useEffect(() => {
        const sentinelEl = sentinelRef.current;
        const headerEl = headerRef.current;

        if (!sentinelEl || !headerEl) return;

        const observer = new IntersectionObserver(([entry]) => {
            // If sentinel is NOT intersecting (scrolled past top), add scrolled classes
            if (!entry.isIntersecting) {
                requestAnimationFrame(() => {
                    headerEl.classList.add(
                        'bg-white/80',
                        'dark:bg-black/60',
                        'shadow-lg',
                        'border-gray-300/50',
                        'dark:border-white/10',
                        'backdrop-blur-xl',
                        'supports-[backdrop-filter]:bg-white/60'
                    );
                    headerEl.classList.remove(
                        'bg-white/50',
                        'dark:bg-black/30',
                        'border-transparent',
                        'backdrop-blur-md'
                    );
                });
            } else {
                requestAnimationFrame(() => {
                    headerEl.classList.remove(
                        'bg-white/80',
                        'dark:bg-black/60',
                        'shadow-lg',
                        'border-gray-300/50',
                        'dark:border-white/10',
                        'backdrop-blur-xl',
                        'supports-[backdrop-filter]:bg-white/60'
                    );
                    headerEl.classList.add(
                        'bg-white/50',
                        'dark:bg-black/30',
                        'border-transparent',
                        'backdrop-blur-md'
                    );
                });
            }
        }, {
            root: null,
            threshold: 0,
            rootMargin: '-20px 0px 0px 0px' // Trigger slightly after scroll starts
        });

        observer.observe(sentinelEl);

        return () => observer.disconnect();
    }, []);

    const handleLogout = useCallback(async () => {
        await logout();
        navigate('/');
    }, [logout, navigate]);

    const scrollToSection = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    const handleNavLinkClick = useCallback((sectionId) => (e) => {
        e.preventDefault();
        if (window.location.pathname === '/') {
            scrollToSection(sectionId);
        } else {
            navigate('/', { replace: false });
            setTimeout(() => scrollToSection(sectionId), 100);
        }
        setIsMobileMenuOpen(false);
    }, [navigate, scrollToSection]);

    // Preload landing page on hover
    const handleNavLinkHover = useCallback(() => {
        if (window.location.pathname !== '/') {
            import('../../../pages/landing/LandingPage');
        }
    }, []);

    return (
        <>
            {/* Scroll Sentinel - Invisible element to trigger scroll effects */}
            <div ref={sentinelRef} className="absolute top-0 left-0 w-full h-[1px] pointer-events-none opacity-0" aria-hidden="true" />

            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{
                    y: 0,
                    opacity: 1
                }}
                transition={{
                    duration: 0.8,
                    type: "spring",
                    stiffness: 200,
                    damping: 25
                }}
                className="fixed top-0 left-0 right-0 z-[100] flex justify-center w-full pointer-events-none"
                style={{ contain: 'layout paint style' }}
            >
                <div
                    ref={headerRef}
                    className={`
                        pointer-events-auto
                        flex items-center gap-2 p-2 w-full
                        transition-all duration-500
                        will-change-transform
                        bg-white/50 dark:bg-black/30 border-b border-transparent backdrop-blur-md
                    `}
                >
                    {/* Center Container */}
                    <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-4">
                        {/* Logo Segment */}
                        <Link
                            to="/"
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white tracking-tight block">
                                Votely
                            </span>
                        </Link>

                        {/* Desktop Nav - Centered */}
                        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                            <nav className="flex items-center gap-1">
                                {NAV_LINKS_CONFIG.map((link, i) => (
                                    <AdvancedNavLink
                                        key={link.href}
                                        {...link}
                                        index={i}
                                        onClick={handleNavLinkClick(link.sectionId)}
                                        onMouseEnter={handleNavLinkHover}
                                    />
                                ))}
                            </nav>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 pl-1">
                            <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

                            {user ? (
                                <div className="flex items-center gap-2 ml-1">
                                    <Link to="/profile">
                                        {getBestProfilePhoto(user, null, null, false) ? (
                                            <img
                                                src={getBestProfilePhoto(user, null, null, false)}
                                                alt="Profile"
                                                className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm transition-transform hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 font-medium text-sm">
                                                {user.firstName?.[0] || 'U'}
                                            </div>
                                        )}
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 ml-1 rounded-full bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
                                >
                                    Login
                                </Link>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors ml-1"
                                aria-label="Toggle mobile menu"
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="mobile-menu"
                            >
                                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <NavbarMobileMenu
                isOpen={isMobileMenuOpen}
                setIsOpen={setIsMobileMenuOpen}
                navLinks={NAV_LINKS_CONFIG}
                onLinkClick={handleNavLinkClick}
                user={user}
                handleLogout={handleLogout}
            />
        </>
    );
};

export default Navbar;