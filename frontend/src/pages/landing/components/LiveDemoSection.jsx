import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const StepIllustration = ({ step, isActive }) => {
    const illustrations = {
        0: (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
            >
                <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-full mx-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Browser Window */}
                    <motion.rect
                        layoutId="container"
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
                        layoutId="header"
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
                        layoutId="dot1"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        cx="70"
                        cy="70"
                        r="4"
                        fill="#ef4444"
                    />
                    <motion.circle
                        layoutId="dot2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4 }}
                        cx="85"
                        cy="70"
                        r="4"
                        fill="#f59e0b"
                    />
                    <motion.circle
                        layoutId="dot3"
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
                        layoutId="form1"
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
                        layoutId="form2"
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
                        layoutId="form3"
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
                            layoutId="buttonBg"
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
                            layoutId="buttonInner"
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
                            layoutId="buttonText"
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
        ),
        1: (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
            >
                <svg viewBox="0 0 400 300" className="w-full max-w-[400px] h-full mx-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Email Interface */}
                    <motion.rect
                        layoutId="container"
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
                    {/* Email Header */}
                    <motion.rect
                        layoutId="header"
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
                    {/* Email Icon */}
                    <motion.path
                        layoutId="icon"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1 }}
                        d="M70,70 L330,70 L330,230 L70,230 Z M70,70 L200,150 L330,70"
                        stroke="currentColor"
                        className="stroke-blue-500 dark:stroke-blue-400"
                        strokeWidth="2"
                        fill="none"
                    />
                    {/* Email List */}
                    {[...Array(3)].map((_, i) => (
                        <motion.g key={i}>
                            <motion.rect
                                layoutId={`email${i}`}
                                initial={{ x: -100 }}
                                animate={{ x: 70 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                y={100 + i * 40}
                                width="260"
                                height="30"
                                rx="4"
                                fill="currentColor"
                                stroke="currentColor"
                                className="text-gray-50 dark:text-gray-700 stroke-gray-200 dark:stroke-gray-600"
                            />
                            <motion.circle
                                layoutId={`avatar${i}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 + i * 0.2 }}
                                cx="90"
                                cy={115 + i * 40}
                                r="8"
                                fill="currentColor"
                                className="text-blue-500/20 dark:text-blue-400/20"
                            />
                            <motion.rect
                                layoutId={`text${i}`}
                                initial={{ width: 0 }}
                                animate={{ width: 180 }}
                                transition={{ delay: 0.8 + i * 0.2 }}
                                x="110"
                                y={110 + i * 40}
                                height="10"
                                rx="2"
                                fill="currentColor"
                                className="text-gray-400 dark:text-gray-500"
                            />
                        </motion.g>
                    ))}
                    {/* Send Button */}
                    <motion.g>
                        <motion.rect
                            layoutId="buttonBg"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.3 }}
                            x="140"
                            y="260"
                            width="100"
                            height="36"
                            rx="18"
                            fill="#3b82f6"
                        />
                        <motion.rect
                            layoutId="buttonInner"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.15, duration: 0.3 }}
                            x="142"
                            y="262"
                            width="96"
                            height="32"
                            rx="16"
                            fill="#2563eb"
                        />
                        <motion.text
                            layoutId="buttonText"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            x="190"
                            y="282"
                            fill="white"
                            fontSize="14"
                            fontWeight="500"
                            textAnchor="middle"
                        >
                            Send
                        </motion.text>
                    </motion.g>
                </svg>
            </motion.div>
        ),
        2: (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
            >
                <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-full mx-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Mobile Device */}
                    <motion.rect
                        layoutId="container"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        x="100"
                        y="50"
                        width="200"
                        height="300"
                        rx="20"
                        fill="currentColor"
                        stroke="currentColor"
                        className="text-white dark:text-gray-800 stroke-gray-200 dark:stroke-gray-700"
                        strokeWidth="2"
                    />
                    {/* Screen Content */}
                    <motion.rect
                        layoutId="screen"
                        initial={{ height: 0 }}
                        animate={{ height: 200 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        x="120"
                        y="70"
                        width="160"
                        rx="8"
                        fill="currentColor"
                        className="text-gray-100 dark:text-gray-700"
                    />
                    {/* Mobile Header */}
                    <motion.rect
                        layoutId="header"
                        initial={{ width: 0 }}
                        animate={{ width: 160 }}
                        transition={{ duration: 0.5 }}
                        x="120"
                        y="70"
                        height="40"
                        rx="8"
                        fill="currentColor"
                        className="text-gray-100 dark:text-gray-700"
                    />
                    {/* Candidate Cards */}
                    {[...Array(2)].map((_, i) => (
                        <motion.g key={i}>
                            <motion.rect
                                layoutId={`card${i}`}
                                initial={{ y: -50 }}
                                animate={{ y: 80 + i * 100 }}
                                transition={{ delay: 0.5 + i * 0.2 }}
                                x="130"
                                width="140"
                                height="80"
                                rx="8"
                                fill="currentColor"
                                stroke="currentColor"
                                className="text-white dark:text-gray-800 stroke-gray-200 dark:stroke-gray-700"
                            />
                            <motion.circle
                                layoutId={`avatar${i}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.7 + i * 0.2 }}
                                cx="153"
                                cy={110 + i * 100}
                                r="15"
                                fill="currentColor"
                                className="text-blue-500/20 dark:text-blue-400/20"
                            />
                            <motion.rect
                                layoutId={`name${i}`}
                                initial={{ width: 0 }}
                                animate={{ width: 80 }}
                                transition={{ delay: 0.8 + i * 0.2 }}
                                x="175"
                                y={95 + i * 100}
                                height="10"
                                rx="2"
                                fill="currentColor"
                                className="text-gray-400 dark:text-gray-500"
                            />
                            <motion.rect
                                layoutId={`desc${i}`}
                                initial={{ width: 0 }}
                                animate={{ width: 60 }}
                                transition={{ delay: 0.9 + i * 0.2 }}
                                x="175"
                                y={115 + i * 100}
                                height="8"
                                rx="2"
                                fill="currentColor"
                                className="text-gray-300 dark:text-gray-600"
                            />
                        </motion.g>
                    ))}
                    {/* Vote Button */}
                    <motion.g>
                        <motion.rect
                            layoutId="buttonBg"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.1, duration: 0.3 }}
                            x="150"
                            y="285"
                            width="100"
                            height="36"
                            rx="18"
                            fill="#3b82f6"
                        />
                        <motion.rect
                            layoutId="buttonInner"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.15, duration: 0.3 }}
                            x="152"
                            y="287"
                            width="96"
                            height="32"
                            rx="16"
                            fill="#2563eb"
                        />
                        <motion.text
                            layoutId="buttonText"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            x="200"
                            y="307"
                            fill="white"
                            fontSize="14"
                            fontWeight="500"
                            textAnchor="middle"
                        >
                            Vote Now
                        </motion.text>
                    </motion.g>
                </svg>
            </motion.div>
        ),
        3: (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                className="relative w-full aspect-[4/3] flex items-center justify-center overflow-visible"
            >
                <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-full mx-auto" preserveAspectRatio="xMidYMid meet">
                    {/* Dashboard */}
                    <motion.rect
                        layoutId="container"
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
                    {/* Header */}
                    <motion.rect
                        layoutId="header"
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
                    {/* Chart Area */}
                    <motion.rect
                        layoutId="chartArea"
                        initial={{ height: 0 }}
                        animate={{ height: 150 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        x="70"
                        y="100"
                        width="260"
                        rx="4"
                        fill="currentColor"
                        className="text-gray-50 dark:text-gray-700"
                    />
                    {/* Bar Chart */}
                    {[...Array(4)].map((_, i) => (
                        <motion.g key={i}>
                            <motion.rect
                                layoutId={`bar${i}`}
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
                                fill="currentColor"
                                className="text-blue-500/60 dark:text-blue-400/60"
                            />
                            <motion.text
                                layoutId={`label${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 + i * 0.2 }}
                                x={115 + i * 50}
                                y="265"
                                fill="currentColor"
                                className="text-gray-500 dark:text-gray-400"
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
                            layoutId={`percent${i}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 + i * 0.2 }}
                            x={115 + i * 50}
                            y={150 + i * 20}
                            fill="currentColor"
                            className="text-blue-500 dark:text-blue-400"
                            fontSize="12"
                            textAnchor="middle"
                        >
                            {[75, 60, 45, 30][i]}%
                        </motion.text>
                    ))}
                    {/* Export Button */}
                    <motion.g>
                        <motion.rect
                            layoutId="buttonBg"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.3, duration: 0.3 }}
                            x="125"
                            y="275"
                            width="120"
                            height="36"
                            rx="18"
                            fill="#3b82f6"
                        />
                        <motion.rect
                            layoutId="buttonInner"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.35, duration: 0.3 }}
                            x="127"
                            y="277"
                            width="116"
                            height="32"
                            rx="16"
                            fill="#2563eb"
                        />
                        <motion.text
                            layoutId="buttonText"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.4 }}
                            x="185"
                            y="297"
                            fill="white"
                            fontSize="14"
                            fontWeight="500"
                            textAnchor="middle"
                        >
                            Export Results
                        </motion.text>
                    </motion.g>
                </svg>
            </motion.div>
        )
    };

    return illustrations[step] || null;
};

const StepCard = ({ step, isActive, onClick }) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative flex flex-col gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl cursor-pointer transition-all duration-300 ${
            isActive 
                ? 'ring-2 ring-blue-500 shadow-lg dark:shadow-blue-500/20' 
                : 'hover:shadow-md dark:hover:shadow-gray-700/50'
        }`}
    >
        {/* Active Indicator */}
        {isActive && (
            <motion.div
                layoutId="activeStep"
                className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-12 bg-blue-500 rounded-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}
        
        <div className="flex items-center gap-4">
            <motion.div 
                className={`relative flex items-center justify-center size-12 rounded-full ${
                    isActive 
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
                    className={`text-lg font-semibold ${
                        isActive 
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
                    className={`mt-1 text-sm ${
                        isActive 
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

        {/* Progress Indicator */}
        <motion.div 
            className="absolute bottom-0 left-0 h-1 bg-blue-500 rounded-b-xl"
            initial={{ width: 0 }}
            animate={{ width: isActive ? '100%' : '0%' }}
            transition={{ duration: 0.3 }}
        />

        {/* Hover Effect */}
        <motion.div
            className="absolute inset-0 rounded-xl bg-blue-500/5 dark:bg-blue-400/5"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
        />
    </motion.div>
);

const HowItWorksSection = () => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);
    const [activeStep, setActiveStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const containerRef = useRef(null);

    const steps = [
        {
            number: 1,
            title: "Create Your Election",
            description: "Set up your election in minutes with our intuitive interface. Customize settings, add candidates, and set voting parameters.",
        },
        {
            number: 2,
            title: "Invite Voters",
            description: "Send secure invitations to your voters. They'll receive unique access codes to ensure one vote per person.",
        },
        {
            number: 3,
            title: "Cast Votes",
            description: "Voters can securely cast their votes from any device. Our platform ensures accessibility and ease of use.",
        },
        {
            number: 4,
            title: "View Results",
            description: "Watch results come in real-time with our live analytics dashboard. Generate detailed reports instantly.",
        }
    ];

    useEffect(() => {
        let interval;
        if (isAutoPlaying) {
            interval = setInterval(() => {
                setActiveStep((prev) => (prev + 1) % steps.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, steps.length]);

    const handleStepClick = (index) => {
        setActiveStep(index);
        setIsAutoPlaying(false);
    };

    return (
        <div className={`how-it-works-section ${sectionBg}`}>
            <section className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-8 px-4 py-12">
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
                            {steps.map((step, index) => (
                                <StepCard
                                    key={index}
                                    step={step}
                                    isActive={index === activeStep}
                                    onClick={() => handleStepClick(index)}
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

                    <div className="flex justify-center mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            Try It Now
                        </motion.button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default React.memo(HowItWorksSection);