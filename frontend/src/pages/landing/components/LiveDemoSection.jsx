import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

// Define steps data outside component to prevent recreation on render
const STEPS = [
    {
        number: 1,
        title: "Create Your Election",
        description: "Set up your election in minutes with our intuitive interface. Customize settings, add candidates, and set voting parameters.",
        icon: (
            <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="3" className="stroke-current" />
                <path d="M8 10h8M8 14h5" className="stroke-current" strokeLinecap="round" />
            </svg>
        ),
        highlight: "Fast & Flexible"
    },
    {
        number: 2,
        title: "Invite Voters",
        description: "Send secure invitations to your voters. They'll receive unique access codes to ensure one vote per person.",
        icon: (
            <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M16 12a4 4 0 1 0-8 0 4 4 0 0 0 8 0Z" className="stroke-current" />
                <path d="M2 20c0-2.21 3.582-4 8-4s8 1.79 8 4" className="stroke-current" strokeLinecap="round" />
                <path d="M19 8v2m0 0v2m0-2h2m-2 0h-2" className="stroke-current" strokeLinecap="round" />
            </svg>
        ),
        highlight: "Secure & Private"
    },
    {
        number: 3,
        title: "Cast Votes",
        description: "Voters can securely cast their votes from any device. Our platform ensures accessibility and ease of use.",
        icon: (
            <svg className="w-7 h-7 text-purple-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="8" rx="2" className="stroke-current" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" className="stroke-current" strokeLinecap="round" />
                <path d="M12 15v2" className="stroke-current" strokeLinecap="round" />
            </svg>
        ),
        highlight: "Accessible Anywhere"
    },
    {
        number: 4,
        title: "View Results",
        description: "Watch results come in real-time with our live analytics dashboard. Generate detailed reports instantly.",
        icon: (
            <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <rect x="4" y="13" width="3" height="7" rx="1" className="stroke-current" />
                <rect x="10.5" y="9" width="3" height="11" rx="1" className="stroke-current" />
                <rect x="17" y="5" width="3" height="15" rx="1" className="stroke-current" />
                <path d="M4 4h16" className="stroke-current" strokeLinecap="round" />
            </svg>
        ),
        highlight: "Live Analytics"
    }
];

// Extracted memoized components for each step illustration
const BrowserDemo = memo(({ isActive }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
    >
        <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-full mx-auto" preserveAspectRatio="xMidYMid meet">
            {/* Browser Window */}
            <motion.rect
                layoutId="browser-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                width="300"
                height="200"
                rx="8"
                fill="currentColor"
                stroke="currentColor"
                className="text-white dark:text-gray-800 stroke-gray-200 dark:stroke-gray-700"
                strokeWidth="2"
            />
            {/* Browser Header */}
            <motion.rect
                layoutId="browser-header"
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                height="40"
                rx="8"
                fill="currentColor"
                className="text-gray-100 dark:text-gray-700"
            />
            {/* Browser Dots */}
            <motion.circle
                layoutId="browser-dot1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                cx="70"
                cy="70"
                r="4"
                fill="#ef4444"
            />
            <motion.circle
                layoutId="browser-dot2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                cx="85"
                cy="70"
                r="4"
                fill="#f59e0b"
            />
            <motion.circle
                layoutId="browser-dot3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                cx="100"
                cy="70"
                r="4"
                fill="#10b981"
            />
            {/* Form Elements */}
            <motion.rect
                layoutId="browser-form1"
                initial={{ width: 0 }}
                animate={{ width: 260 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                x="70"
                y="110"
                height="12"
                rx="6"
                fill="currentColor"
                className="text-gray-200 dark:text-gray-600"
            />
            <motion.rect
                layoutId="browser-form2"
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                x="70"
                y="140"
                height="12"
                rx="6"
                fill="currentColor"
                className="text-gray-200 dark:text-gray-600"
            />
            <motion.rect
                layoutId="browser-form3"
                initial={{ width: 0 }}
                animate={{ width: 180 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                x="70"
                y="170"
                height="12"
                rx="6"
                fill="currentColor"
                className="text-gray-200 dark:text-gray-600"
            />
            {/* Create Button */}
            <motion.g>
                <motion.rect
                    layoutId="browser-buttonBg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.3 }}
                    x="70"
                    y="200"
                    width="120"
                    height="36"
                    rx="18"
                    fill="#3b82f6"
                />
                <motion.rect
                    layoutId="browser-buttonInner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.95, duration: 0.3 }}
                    x="72"
                    y="202"
                    width="116"
                    height="32"
                    rx="16"
                    fill="#2563eb"
                />
                <motion.text
                    layoutId="browser-buttonText"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    x="130"
                    y="222"
                    fill="white"
                    fontSize="14"
                    fontWeight="500"
                    textAnchor="middle"
                >
                    Create Election
                </motion.text>
            </motion.g>
        </svg>
    </motion.div>
));
BrowserDemo.displayName = 'BrowserDemo';

const EmailDemo = memo(({ isActive }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
    >
        <svg
            viewBox="0 0 400 300"
            className="w-full max-w-[400px] h-full mx-auto"
            preserveAspectRatio="xMidYMid meet"
            style={{
                '--email-bg': 'var(--color-email-bg, #fff)',
                '--email-bg-dark': 'var(--color-email-bg-dark, #1e293b)',
                '--email-header': 'var(--color-email-header, #f3f4f6)',
                '--email-header-dark': 'var(--color-email-header-dark, #334155)',
                '--email-border': 'var(--color-email-border, #e5e7eb)',
                '--email-border-dark': 'var(--color-email-border-dark, #334155)',
                '--email-list': 'var(--color-email-list, #f9fafb)',
                '--email-list-dark': 'var(--color-email-list-dark, #334155)',
                '--email-avatar': 'var(--color-email-avatar, #3b82f6)',
                '--email-avatar-dark': 'var(--color-email-avatar-dark, #60a5fa)',
                '--email-avatar-bg': 'var(--color-email-avatar-bg, #3b82f633)',
                '--email-avatar-bg-dark': 'var(--color-email-avatar-bg-dark, #60a5fa33)',
                '--email-text': 'var(--color-email-text, #9ca3af)',
                '--email-text-dark': 'var(--color-email-text-dark, #6b7280)',
            }}
        >
            {/* Email Interface */}
            <motion.rect
                layoutId="email-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                width="300"
                height="200"
                rx="8"
                fill="var(--email-bg)"
                stroke="var(--email-border)"
                className="dark:fill-[var(--email-bg-dark)] dark:stroke-[var(--email-border-dark)]"
                strokeWidth="2"
            />
            {/* Email Header */}
            <motion.rect
                layoutId="email-header"
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                height="40"
                rx="8"
                fill="var(--email-header)"
                className="dark:fill-[var(--email-header-dark)]"
            />
            {/* Email Icon */}
            <motion.path
                layoutId="email-icon"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1 }}
                d="M70,70 L330,70 L330,230 L70,230 Z M70,70 L200,150 L330,70"
                stroke="#3b82f6"
                className="dark:stroke-blue-400"
                strokeWidth="2"
                fill="none"
            />
            {/* Email List */}
            {[...Array(3)].map((_, i) => (
                <motion.g key={i}>
                    <motion.rect
                        layoutId={`email-list-item-${i}`}
                        initial={{ x: -100 }}
                        animate={{ x: 70 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        y={100 + i * 40}
                        width="260"
                        height="30"
                        rx="4"
                        fill="var(--email-list)"
                        stroke="var(--email-border)"
                        className="dark:fill-[var(--email-list-dark)] dark:stroke-[var(--email-border-dark)]"
                    />
                    <motion.circle
                        layoutId={`email-avatar-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.2 }}
                        cx="90"
                        cy={115 + i * 40}
                        r="8"
                        fill="var(--email-avatar-bg)"
                        className="dark:fill-[var(--email-avatar-bg-dark)]"
                    />
                    <motion.rect
                        layoutId={`email-text-${i}`}
                        initial={{ width: 0 }}
                        animate={{ width: 180 }}
                        transition={{ delay: 0.8 + i * 0.2 }}
                        x="110"
                        y={110 + i * 40}
                        height="10"
                        rx="2"
                        fill="var(--email-text)"
                        className="dark:fill-[var(--email-text-dark)]"
                    />
                </motion.g>
            ))}
            {/* Send Button */}
            <motion.g>
                <motion.rect
                    layoutId="email-buttonBg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                    x="140"
                    y="260"
                    width="100"
                    height="36"
                    rx="18"
                    fill="#3b82f6"
                    className="dark:fill-blue-600"
                />
                <motion.rect
                    layoutId="email-buttonInner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.15, duration: 0.3 }}
                    x="142"
                    y="262"
                    width="96"
                    height="32"
                    rx="16"
                    fill="#2563eb"
                    className="dark:fill-blue-700"
                />
                <motion.text
                    layoutId="email-buttonText"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    x="190"
                    y="282"
                    fill="white"
                    className="dark:fill-white"
                    fontSize="14"
                    fontWeight="500"
                    textAnchor="middle"
                >
                    Send
                </motion.text>
            </motion.g>
        </svg>
    </motion.div>
));
EmailDemo.displayName = 'EmailDemo';

const MobileDemo = memo(({ isActive }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
    >
        <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[400px] h-full mx-auto"
            preserveAspectRatio="xMidYMid meet"
            style={{
                '--mobile-bg': 'var(--color-mobile-bg, #fff)',
                '--mobile-bg-dark': 'var(--color-mobile-bg-dark, #1e293b)',
                '--mobile-border': 'var(--color-mobile-border, #e5e7eb)',
                '--mobile-border-dark': 'var(--color-mobile-border-dark, #334155)',
                '--screen-bg': 'var(--color-screen-bg, #f9fafb)',
                '--screen-bg-dark': 'var(--color-screen-bg-dark, #334155)',
                '--header-bg': 'var(--color-header-bg, #f3f4f6)',
                '--header-bg-dark': 'var(--color-header-bg-dark, #334155)',
                '--card-bg': 'var(--color-card-bg, #fff)',
                '--card-bg-dark': 'var(--color-card-bg-dark, #1e293b)',
                '--card-border': 'var(--color-card-border, #e5e7eb)',
                '--card-border-dark': 'var(--color-card-border-dark, #334155)',
                '--avatar-bg': 'var(--color-avatar-bg, #3b82f633)',
                '--avatar-bg-dark': 'var(--color-avatar-bg-dark, #60a5fa33)',
                '--avatar': 'var(--color-avatar, #3b82f6)',
                '--avatar-dark': 'var(--color-avatar-dark, #60a5fa)',
                '--name-text': 'var(--color-name-text, #9ca3af)',
                '--name-text-dark': 'var(--color-name-text-dark, #6b7280)',
                '--desc-text': 'var(--color-desc-text, #d1d5db)',
                '--desc-text-dark': 'var(--color-desc-text-dark, #6b7280)',
                '--button-bg': 'var(--color-button-bg, #3b82f6)',
                '--button-bg-dark': 'var(--color-button-bg-dark, #2563eb)',
                '--button-inner': 'var(--color-button-inner, #2563eb)',
                '--button-inner-dark': 'var(--color-button-inner-dark, #1d4ed8)',
                '--button-text': 'var(--color-button-text, #fff)',
                '--button-text-dark': 'var(--color-button-text-dark, #fff)',
            }}
        >
            {/* Mobile Device */}
            <motion.rect
                layoutId="mobile-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x="100"
                y="50"
                width="200"
                height="300"
                rx="20"
                fill="var(--mobile-bg)"
                stroke="var(--mobile-border)"
                className="dark:fill-[var(--mobile-bg-dark)] dark:stroke-[var(--mobile-border-dark)]"
                strokeWidth="2"
            />
            {/* Screen Content */}
            <motion.rect
                layoutId="mobile-screen"
                initial={{ height: 0 }}
                animate={{ height: 200 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                x="120"
                y="70"
                width="160"
                rx="8"
                fill="var(--screen-bg)"
                className="dark:fill-[var(--screen-bg-dark)]"
            />
            {/* Mobile Header */}
            <motion.rect
                layoutId="mobile-header"
                initial={{ width: 0 }}
                animate={{ width: 160 }}
                transition={{ duration: 0.5 }}
                x="120"
                y="70"
                height="40"
                rx="8"
                fill="var(--header-bg)"
                className="dark:fill-[var(--header-bg-dark)]"
            />
            {/* Candidate Cards */}
            {[...Array(2)].map((_, i) => (
                <motion.g key={i}>
                    <motion.rect
                        layoutId={`mobile-card${i}`}
                        initial={{ y: -50 }}
                        animate={{ y: 80 + i * 100 }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                        x="130"
                        width="140"
                        height="80"
                        rx="8"
                        fill="var(--card-bg)"
                        stroke="var(--card-border)"
                        className="dark:fill-[var(--card-bg-dark)] dark:stroke-[var(--card-border-dark)]"
                    />
                    <motion.circle
                        layoutId={`mobile-avatar${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.2 }}
                        cx="153"
                        cy={110 + i * 100}
                        r="15"
                        fill="var(--avatar-bg)"
                        className="dark:fill-[var(--avatar-bg-dark)]"
                    />
                    <motion.circle
                        layoutId={`mobile-avatarInner${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.75 + i * 0.2 }}
                        cx="153"
                        cy={110 + i * 100}
                        r="10"
                        fill="var(--avatar)"
                        className="dark:fill-[var(--avatar-dark)]"
                    />
                    <motion.rect
                        layoutId={`mobile-name${i}`}
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ delay: 0.8 + i * 0.2 }}
                        x="175"
                        y={95 + i * 100}
                        height="10"
                        rx="2"
                        fill="var(--name-text)"
                        className="dark:fill-[var(--name-text-dark)]"
                    />
                    <motion.rect
                        layoutId={`mobile-desc${i}`}
                        initial={{ width: 0 }}
                        animate={{ width: 60 }}
                        transition={{ delay: 0.9 + i * 0.2 }}
                        x="175"
                        y={115 + i * 100}
                        height="8"
                        rx="2"
                        fill="var(--desc-text)"
                        className="dark:fill-[var(--desc-text-dark)]"
                    />
                </motion.g>
            ))}
            {/* Vote Button */}
            <motion.g>
                <motion.rect
                    layoutId="mobile-buttonBg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1, duration: 0.3 }}
                    x="150"
                    y="285"
                    width="100"
                    height="36"
                    rx="18"
                    fill="var(--button-bg)"
                    className="dark:fill-[var(--button-bg-dark)]"
                />
                <motion.rect
                    layoutId="mobile-buttonInner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.15, duration: 0.3 }}
                    x="152"
                    y="287"
                    width="96"
                    height="32"
                    rx="16"
                    fill="var(--button-inner)"
                    className="dark:fill-[var(--button-inner-dark)]"
                />
                <motion.text
                    layoutId="mobile-buttonText"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    x="200"
                    y="307"
                    fill="var(--button-text)"
                    className="dark:fill-[var(--button-text-dark)]"
                    fontSize="14"
                    fontWeight="500"
                    textAnchor="middle"
                >
                    Vote Now
                </motion.text>
            </motion.g>
        </svg>
    </motion.div>
));
MobileDemo.displayName = 'MobileDemo';

const DashboardDemo = memo(({ isActive }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
    >
        <svg
            viewBox="0 0 400 400"
            className="w-full max-w-[400px] h-full mx-auto"
            preserveAspectRatio="xMidYMid meet"
            style={{
                '--dashboard-bg': 'var(--color-dashboard-bg, #fff)',
                '--dashboard-bg-dark': 'var(--color-dashboard-bg-dark, #1e293b)',
                '--dashboard-border': 'var(--color-dashboard-border, #e5e7eb)',
                '--dashboard-border-dark': 'var(--color-dashboard-border-dark, #334155)',
                '--header-bg': 'var(--color-header-bg, #f3f4f6)',
                '--header-bg-dark': 'var(--color-header-bg-dark, #334155)',
                '--chart-bg': 'var(--color-chart-bg, #f9fafb)',
                '--chart-bg-dark': 'var(--color-chart-bg-dark, #334155)',
                '--bar': 'var(--color-bar, #3b82f6)',
                '--bar-dark': 'var(--color-bar-dark, #60a5fa)',
                '--label': 'var(--color-label, #6b7280)',
                '--label-dark': 'var(--color-label-dark, #d1d5db)',
                '--percent': 'var(--color-percent, #3b82f6)',
                '--percent-dark': 'var(--color-percent-dark, #60a5fa)',
                '--button-bg': 'var(--color-button-bg, #3b82f6)',
                '--button-bg-dark': 'var(--color-button-bg-dark, #2563eb)',
                '--button-inner': 'var(--color-button-inner, #2563eb)',
                '--button-inner-dark': 'var(--color-button-inner-dark, #1d4ed8)',
                '--button-text': 'var(--color-button-text, #fff)',
                '--button-text-dark': 'var(--color-button-text-dark, #fff)',
            }}
        >
            {/* Dashboard */}
            <motion.rect
                layoutId="dashboard-container"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                width="300"
                height="200"
                rx="8"
                fill="var(--dashboard-bg)"
                stroke="var(--dashboard-border)"
                className="dark:fill-[var(--dashboard-bg-dark)] dark:stroke-[var(--dashboard-border-dark)]"
                strokeWidth="2"
            />
            {/* Header */}
            <motion.rect
                layoutId="dashboard-header"
                initial={{ width: 0 }}
                animate={{ width: 300 }}
                transition={{ duration: 0.5 }}
                x="50"
                y="50"
                height="40"
                rx="8"
                fill="var(--header-bg)"
                className="dark:fill-[var(--header-bg-dark)]"
            />
            {/* Chart Area */}
            <motion.rect
                layoutId="dashboard-chartArea"
                initial={{ height: 0 }}
                animate={{ height: 150 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                x="70"
                y="100"
                width="260"
                rx="4"
                fill="var(--chart-bg)"
                className="dark:fill-[var(--chart-bg-dark)]"
            />
            {/* Bar Chart */}
            {[...Array(4)].map((_, i) => (
                <motion.g key={i}>
                    <motion.rect
                        layoutId={`dashboard-bar${i}`}
                        initial={{ height: 0, y: 250 }}
                        animate={{
                            height: [0, 100, 80],
                            y: [250, 150, 170]
                        }}
                        transition={{
                            delay: 0.5 + i * 0.2,
                            duration: 1,
                            times: [0, 0.6, 1]
                        }}
                        x={100 + i * 50}
                        width="30"
                        rx="4"
                        fill="var(--bar)"
                        className="dark:fill-[var(--bar-dark)]"
                    />
                    <motion.text
                        layoutId={`dashboard-label${i}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.2 }}
                        x={115 + i * 50}
                        y="265"
                        fill="var(--label)"
                        className="dark:fill-[var(--label-dark)]"
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {['A', 'B', 'C', 'D'][i]}
                    </motion.text>
                </motion.g>
            ))}
            {/* Percentage Labels */}
            {[...Array(4)].map((_, i) => (
                <motion.text
                    key={i}
                    layoutId={`dashboard-percent${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    x={115 + i * 50}
                    y={150 + i * 20}
                    fill="var(--percent)"
                    className="dark:fill-[var(--percent-dark)]"
                    fontSize="12"
                    textAnchor="middle"
                >
                    {[75, 60, 45, 30][i]}%
                </motion.text>
            ))}
            {/* Export Button */}
            <motion.g>
                <motion.rect
                    layoutId="dashboard-buttonBg"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.3, duration: 0.3 }}
                    x="125"
                    y="275"
                    width="120"
                    height="36"
                    rx="18"
                    fill="var(--button-bg)"
                    className="dark:fill-[var(--button-bg-dark)]"
                />
                <motion.rect
                    layoutId="dashboard-buttonInner"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.35, duration: 0.3 }}
                    x="127"
                    y="277"
                    width="116"
                    height="32"
                    rx="16"
                    fill="var(--button-inner)"
                    className="dark:fill-[var(--button-inner-dark)]"
                />
                <motion.text
                    layoutId="dashboard-buttonText"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 }}
                    x="185"
                    y="297"
                    fill="var(--button-text)"
                    className="dark:fill-[var(--button-text-dark)]"
                    fontSize="14"
                    fontWeight="500"
                    textAnchor="middle"
                >
                    Export Results
                </motion.text>
            </motion.g>
        </svg>
    </motion.div>
));
DashboardDemo.displayName = 'DashboardDemo';

// Optimized wrapper component
const StepIllustration = memo(({ step, isActive }) => {
    switch (step) {
        case 0: return <BrowserDemo isActive={isActive} />;
        case 1: return <EmailDemo isActive={isActive} />;
        case 2: return <MobileDemo isActive={isActive} />;
        case 3: return <DashboardDemo isActive={isActive} />;
        default: return null;
    }
});
StepIllustration.displayName = 'StepIllustration';

const StepCard = memo(({ step, isActive, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl cursor-pointer transition-all duration-300 ${isActive
                ? 'ring-2 ring-blue-500 shadow-lg dark:shadow-blue-500/20'
                : 'hover:shadow-md dark:hover:shadow-gray-700/50'
            }`}
    >
        {/* Enhanced Active Indicator */}
        {isActive && (
            <motion.div
                layoutId="activeStep"
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-14 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 shadow-lg rounded-full flex items-center justify-center z-10"
                initial={{ opacity: 0, scaleY: 0.7 }}
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0.7 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
                {/* Animated pulse effect */}
                <motion.span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-400 rounded-full opacity-60"
                    initial={{ scale: 0.7, opacity: 0.4 }}
                    animate={{ scale: [0.7, 1.2, 0.7], opacity: [0.4, 0.2, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                />
                {/* Subtle glow */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-400/20 rounded-full blur-md pointer-events-none" />
            </motion.div>
        )}

        <div className="flex items-center gap-4">
            <motion.div
                className={`relative flex items-center justify-center size-12 rounded-full ${isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <motion.span
                    className="text-xl font-bold"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {step.number}
                </motion.span>
                {isActive && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-2 border-blue-500"
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                )}
            </motion.div>

            <div className="flex-1">
                <motion.h3
                    className={`text-lg font-semibold ${isActive
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {step.title}
                </motion.h3>
                <motion.p
                    className={`mt-1 text-sm ${isActive
                            ? 'text-gray-700 dark:text-gray-300'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {step.description}
                </motion.p>
            </div>
        </div>

        {/* Enhanced Progress Indicator */}
        <motion.div
            className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-b-xl shadow-md"
            initial={{ width: 0, opacity: 0.5 }}
            animate={{ width: isActive ? '100%' : '0%', opacity: isActive ? 1 : 0.5 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
        >
            {/* Animated shimmer effect */}
            {isActive && (
                <motion.div
                    className="absolute top-0 left-0 h-full w-1/4 bg-white/30 rounded-b-xl blur-sm"
                    initial={{ x: '-100%' }}
                    animate={{ x: '400%' }}
                    transition={{
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 1.2,
                        ease: "linear"
                    }}
                />
            )}
        </motion.div>

        {/* Enhanced Hover Effect */}
        <motion.div
            className="absolute inset-0 rounded-xl bg-blue-500/10 dark:bg-blue-400/10 pointer-events-none"
            initial={{ opacity: 0, scale: 0.98 }}
            whileHover={{ opacity: 1, scale: 1 }}
            animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
                boxShadow: isActive
                    ? "0 4px 24px 0 rgba(59,130,246,0.10), 0 1.5px 6px 0 rgba(59,130,246,0.08)"
                    : undefined
            }}
        />
        {/* Subtle border highlight for active step */}
        {isActive && (
            <motion.div
                className="absolute inset-0 rounded-xl border-2 border-blue-400/60 dark:border-blue-500/60 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            />
        )}
    </motion.div>
));
StepCard.displayName = 'StepCard';

const LiveDemoSection = () => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);
    const [activeStep, setActiveStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Enhanced: Pause autoplay on user interaction, resume after inactivity, and allow keyboard navigation
    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % STEPS.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying]); // STEPS.length is constant now

    // Resume autoplay after 15s of inactivity
    useEffect(() => {
        if (!isAutoPlaying) {
            const timeout = setTimeout(() => {
                setIsAutoPlaying(true);
            }, 15000);
            return () => clearTimeout(timeout);
        }
    }, [isAutoPlaying, activeStep]);

    // Keyboard navigation for accessibility
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "ArrowRight") {
                setActiveStep((prev) => (prev + 1) % STEPS.length);
                setIsAutoPlaying(false);
            } else if (e.key === "ArrowLeft") {
                setActiveStep((prev) => (prev - 1 + STEPS.length) % STEPS.length);
                setIsAutoPlaying(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Enhanced: Support keyboard and mouse interaction, focus management, and analytics event
    const handleStepClick = (index, event) => {
        setActiveStep(index);
        setIsAutoPlaying(false);

        // Optionally focus the step for accessibility
        if (event && event.currentTarget) {
            event.currentTarget.focus();
        }

        // Example: Track step click for analytics (pseudo-code)
        if (window?.gtag) {
            window.gtag('event', 'live_demo_step_click', {
                step_index: index,
                step_title: STEPS[index]?.title || '',
            });
        }
    };

    return (
        <section aria-labelledby="howitworks-main-heading" role="region" tabIndex={0} className={`relative w-full max-w-7xl mx-auto px-4 py-12 ${sectionBg}`}>
            <h2 id="howitworks-main-heading" className="sr-only">How Votely Works</h2>
            <div className="flex flex-col gap-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-6 text-center max-w-3xl mx-auto"
                >
                    {/* How It Works Tag */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow] mx-auto"
                        tabIndex={0}
                        role="status"
                        aria-label="How It Works"
                    >
                        {/* Animated Glow Effect */}
                        <span
                            className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        {/* Animated Icon */}
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
                                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
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
                                <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                                <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                            </g>
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                            How It Works
                        </span>
                        {/* Tooltip on focus/hover for accessibility */}
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            See how Votely makes online elections easy!
                        </div>
                    </div>

                    {/* Title */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <h2 className="text-gray-900 dark:text-white text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl @[640px]:text-4xl">
                            How Votely Works
                        </h2>
                        <motion.div
                            className="h-1 w-20 bg-blue-500 mx-auto mt-4 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 80 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                        />
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative"
                    >
                        <p className="text-gray-600 dark:text-gray-300 text-base @[480px]:text-lg max-w-2xl mx-auto">
                            A simple, secure, and efficient way to conduct your elections online.
                        </p>
                        <motion.div
                            className="absolute -right-4 top-1/2 -translate-y-1/2 flex gap-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {[...Array(3)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="size-1.5 rounded-full bg-blue-500/50 dark:bg-blue-400/50"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.5, 1, 0.5]
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                        {STEPS.map((step, index) => (
                            <StepCard
                                key={index}
                                step={step}
                                isActive={index === activeStep}
                                onClick={(e) => handleStepClick(index, e)}
                            />
                        ))}
                    </div>

                    <div className="relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-xl p-8"
                            >
                                <StepIllustration step={activeStep} isActive={true} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

LiveDemoSection.displayName = 'LiveDemoSection';
export default memo(LiveDemoSection);