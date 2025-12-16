import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Twitter, Github, Linkedin, Globe, ArrowUpRight, Heart, Shield, CheckCircle } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';

// --- DATA ---
const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#" },
            { label: "Security", href: "#security" },
            { label: "Integrations", href: "#" },
            { label: "Enterprise", href: "#" },
            { label: "Changelog", href: "#" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "#" },
            { label: "API Reference", href: "#" },
            { label: "Community", href: "#" },
            { label: "Case Studies", href: "#" },
            { label: "Help Center", href: "#" },
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About", href: "#" },
            { label: "Careers", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Contact", href: "#" },
            { label: "Partners", href: "#" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Cookie Policy", href: "#" },
            { label: "Security Audit", href: "#" },
        ]
    }
];

const SOCIALS = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Globe, href: "#", label: "Website" },
];

const MagneticButton = ({ children, className }) => {
    const ref = useRef(null);
    const { mouseX, mouseY } = { mouseX: 0, mouseY: 0 }; // Simplified for now, can be complex if needed

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={className}
        >
            {children}
        </motion.button>
    );
};

const Footer = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const isDarkMode = true; // Force dark mode aesthetic specifically for footer if desired, or use context
    // const { isDarkMode } = useTheme(); 

    const y = useTransform(scrollYProgress, [0, 1], [-100, 0]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <footer
            ref={containerRef}
            className="relative w-full bg-white dark:bg-black text-gray-900 dark:text-white pt-32 pb-12 px-4 md:px-16 overflow-hidden z-40 border-t border-gray-300 dark:border-zinc-900"
        >
            {/* Massive Parallax Text Background */}
            <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05] select-none">
                <motion.div style={{ y }} className="whitespace-nowrap">
                    <span className="text-[20vw] font-black tracking-tighter leading-none">
                        VOTELY SECURE VOTING
                    </span>
                </motion.div>
            </div>

            <div className="max-w-8xl mx-auto relative z-10 flex flex-col h-full">

                {/* Top Section: CTA & Logo */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 gap-12">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]"
                        >
                            Ready to <br />
                            <span className="text-gray-700 dark:text-zinc-400">
                                upgrade democracy?
                            </span>
                        </motion.h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button className="group relative px-8 py-4 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg tracking-tight overflow-hidden hover:scale-105 transition-transform duration-300">
                                <span className="relative z-10 flex items-center gap-2">
                                    Start a Poll
                                    <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
                                </span>
                            </button>
                            <button className="px-8 py-4 border border-gray-400 dark:border-zinc-700 rounded-full font-medium text-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors duration-300 text-gray-900 dark:text-gray-100">
                                Contact Sales
                            </button>
                        </motion.div>
                    </div>

                    {/* Status Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 px-4 py-2 rounded-full bg-green-500/10 border border-green-600/30 backdrop-blur-sm"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-600"></span>
                        </span>
                        <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            All Systems Operational
                        </span>
                    </motion.div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-300 dark:bg-zinc-800 mb-20" />

                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-24">
                    {/* Branding Column */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
                                <span className="text-white dark:text-black font-bold text-xl">V</span>
                            </div>
                            <span className="font-bold text-2xl tracking-tight">Votely</span>
                        </div>
                        <p className="text-gray-800 dark:text-gray-300 text-sm leading-relaxed mb-6">
                            Cryptographically secure voting infrastructure for the modern internet. Built for scale, security, and transparency.
                        </p>
                        <div className="flex gap-4">
                            {SOCIALS.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.href}
                                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-900 flex items-center justify-center text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all duration-300"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {FOOTER_LINKS.map((group, idx) => (
                        <div key={idx} className="col-span-1">
                            <h4 className="font-bold text-gray-950 dark:text-white mb-6 tracking-wide">
                                {group.title}
                            </h4>
                            <ul className="space-y-4">
                                {group.links.map((link, linkIdx) => (
                                    <li key={linkIdx}>
                                        <a
                                            href={link.href}
                                            className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1 group"
                                        >
                                            {link.label}
                                            {/* Subtle arrow on hover */}
                                            <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                <ArrowUpRight className="w-3 h-3" />
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-300 dark:border-zinc-800">
                    <p className="text-gray-700 dark:text-gray-400 text-sm">
                        © {new Date().getFullYear()} Votely Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="text-sm text-gray-600 dark:text-gray-500 flex items-center gap-1">
                            Designed with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Anurag
                        </span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
