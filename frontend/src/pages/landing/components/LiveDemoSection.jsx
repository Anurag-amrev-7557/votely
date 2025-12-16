import React, { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { ArrowRight } from 'lucide-react';
import { useInViewPause } from '../../../hooks/useInViewPause';

// --- DATA ---
const STEPS = [
    {
        id: 1,
        title: "Genesis.",
        description: "Initialize your election on the blockchain. Define parameters, candidates, and access controls in seconds.",
        label: "Create",
    },
    {
        id: 2,
        title: "Propagation.",
        description: "Securely distribute unique, cryptographic tokens to your electorate via encrypted channels.",
        label: "Invite",
    },
    {
        id: 3,
        title: "Consensus.",
        description: "Voters cast their ballots. Zero-knowledge proofs ensure privacy while guaranteeing mathematical validity.",
        label: "Vote",
    },
    {
        id: 4,
        title: "Revelation.",
        description: "Results are computed in real-time. Verify the integrity of every single vote against the immutable ledger.",
        label: "Verify",
    },
];

// --- ABSTRACT VISUALS ---

const CreationVisual = ({ isPaused }) => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Central Core */}
        <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={isPaused ? { scale: 1, opacity: 1 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            cx="200" cy="200" r="40"
            fill="currentColor"
        />

        {/* Orbiting Elements - representing parameters */}
        {[...Array(4)].map((_, i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ opacity: 0, r: 0, cx: 200, cy: 200 }}
                    animate={isPaused ? { opacity: 1, r: 4 } : {
                        opacity: [0, 1, 0.5],
                        r: 4,
                        cx: 200 + Math.cos(i * Math.PI / 2) * 100,
                        cy: 200 + Math.sin(i * Math.PI / 2) * 100
                    }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 1 }}
                    fill="currentColor"
                />
                <motion.line
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.2 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 1 }}
                    x1="200" y1="200"
                    x2={200 + Math.cos(i * Math.PI / 2) * 100}
                    y2={200 + Math.sin(i * Math.PI / 2) * 100}
                    stroke="currentColor" strokeWidth="1"
                />
            </motion.g>
        ))}

        {/* Outer Ring */}
        <motion.circle
            initial={{ scale: 0.5, opacity: 0, strokeWidth: 0 }}
            animate={{ scale: 1, opacity: 0.1, strokeWidth: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            cx="200" cy="200" r="120"
            fill="none" stroke="currentColor"
        />
    </svg>
);

const InviteVisual = ({ isPaused }) => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Source */}
        <circle cx="200" cy="200" r="10" fill="currentColor" />

        {/* Particles emitting */}
        {[...Array(12)].map((_, i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ cx: 200, cy: 200, opacity: 0 }}
                    animate={isPaused ? { opacity: 0 } : {
                        cx: 200 + Math.cos(i * 30 * Math.PI / 180) * 140,
                        cy: 200 + Math.sin(i * 30 * Math.PI / 180) * 140,
                        opacity: [0, 1, 0]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: "easeOut"
                    }}
                    r="3" fill="currentColor"
                />
            </motion.g>
        ))}
    </svg>
);

const VoteVisual = ({ isPaused }) => {
    // Pre-computed initial X positions to avoid Math.random() issues during render
    const initialPositions = [50, -80, 120, -50, 100, -100];

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
            {/* Ballot Box / Shield */}
            <path d="M200 100 L200 300 M100 200 L300 200" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
            <motion.rect
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                x="160" y="160" width="80" height="80" rx="10"
                fill="none" stroke="currentColor" strokeWidth="2"
            />

            {/* Incoming Votes */}
            {initialPositions.map((offset, i) => (
                <motion.circle
                    key={i}
                    initial={{
                        opacity: 0,
                        cx: 200 + offset,
                        cy: 0
                    }}
                    animate={isPaused ? { opacity: 0, cx: 200, cy: 0 } : {
                        opacity: [0, 1, 0],
                        cx: 200,
                        cy: 200
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.5,
                        ease: "easeInOut"
                    }}
                    r="4" fill="currentColor"
                />
            ))}
        </svg>
    );
};

const ResultsVisual = ({ isPaused }) => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Grid Lines */}
        <motion.line x1="50" y1="350" x2="350" y2="350" stroke="currentColor" strokeWidth="1" opacity="0.2" />

        {/* Bars */}
        {[0.6, 0.8, 0.4, 0.9].map((h, i) => (
            <motion.rect
                key={i}
                initial={{ height: 0, y: 350 }}
                animate={isPaused ? { height: 0, y: 350 } : { height: h * 250, y: 350 - (h * 250) }}
                transition={{ duration: 1, delay: i * 0.2, type: "spring" }}
                x={80 + i * 70}
                width="40"
                fill="currentColor"
                opacity={0.8}
            />
        ))}

        {/* Data Points */}
        {[...Array(3)].map((_, i) => (
            <motion.circle
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.2 }}
                cx={320} cy={100 + i * 20} r="2" fill="currentColor"
            />
        ))}
    </svg>
);

const VisualContainer = ({ activeStep, isPaused }) => {
    return (
        <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-50 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-gray-300 dark:border-zinc-800 flex items-center justify-center">
            {/* Ambient Background Noise/Grain */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full p-8 md:p-24"
                >
                    {activeStep === 1 && <CreationVisual isPaused={isPaused} />}
                    {activeStep === 2 && <InviteVisual isPaused={isPaused} />}
                    {activeStep === 3 && <VoteVisual isPaused={isPaused} />}
                    {activeStep === 4 && <ResultsVisual isPaused={isPaused} />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


const LiveDemoSection = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [containerRef, isPaused] = useInViewPause({ threshold: 0.2 });

    return (
        <section ref={containerRef} className="relative w-full px-4 md:px-16 py-16 md:py-32 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800">

            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                            <span className="h-px w-8 md:w-12 bg-gray-400 dark:bg-zinc-700"></span>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-zinc-500">
                                Process Flow
                            </h2>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                            How it <br /> works.
                        </h1>
                    </div>
                    <p className="max-w-md text-lg md:text-xl text-gray-700 dark:text-zinc-400 leading-relaxed text-balance">
                        Democracy, distilled. A four-step protocol designed for maximum integrity and minimal friction.
                    </p>
                </motion.div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-24 items-start">

                    {/* Left: Steps List - Mobile: Cards Row, Desktop: Vertical List */}
                    <div className="lg:col-span-5 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 lg:gap-0 pb-4 pt-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory no-scrollbar justify-start lg:justify-center h-full order-2 lg:order-1">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                onClick={() => setActiveStep(step.id)}
                                onMouseEnter={() => setActiveStep(step.id)}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveStep(step.id)}
                                role="button"
                                tabIndex={0}
                                aria-pressed={activeStep === step.id}
                                aria-labelledby={`step-title-${step.id}`}
                                className={`group cursor-pointer flex-shrink-0 min-w-[200px] md:min-w-0 snap-center p-4 md:py-6 md:px-0 bg-gray-50 dark:bg-zinc-900 md:bg-transparent md:dark:bg-transparent border md:border-0 md:border-t border-gray-300 dark:border-zinc-800 rounded-2xl md:rounded-none transition-all duration-500 ${activeStep === step.id ? 'opacity-100 ring-1 md:ring-0 ring-gray-900 dark:ring-white scale-[1.02] md:scale-100' : 'opacity-100 md:opacity-40 hover:opacity-100 md:hover:opacity-70 opacity-60'}`}
                            >
                                <div className="flex items-center md:items-baseline justify-between mb-0 md:mb-4 gap-4">
                                    <h3 id={`step-title-${step.id}`} className="text-lg md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-nowrap">
                                        {step.title}
                                    </h3>
                                    <span className="font-mono text-sm text-gray-600 dark:text-zinc-600" aria-hidden="true">0{step.id}</span>
                                </div>
                                <div className="block hidden md:block">
                                    <p className="text-base md:text-lg text-gray-700 dark:text-zinc-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {/* Final Border */}
                        <div className="w-full h-px bg-gray-300 dark:bg-zinc-800 hidden lg:block"></div>
                    </div>

                    {/* Right: Visual */}
                    <div className="lg:col-span-7 relative lg:sticky order-1 lg:order-2">
                        <VisualContainer activeStep={activeStep} isPaused={isPaused} />
                    </div>

                </div>
            </div>
        </section>
    );
};

LiveDemoSection.displayName = 'LiveDemoSection';
export default memo(LiveDemoSection);