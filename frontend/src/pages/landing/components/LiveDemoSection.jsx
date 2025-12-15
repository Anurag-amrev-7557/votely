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

const CreationVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Central Core */}
        <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            cx="200" cy="200" r="40"
            fill="currentColor"
        />

        {/* Orbiting Elements - representing parameters */}
        {[...Array(4)].map((_, i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ opacity: 0, r: 0 }}
                    animate={{
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

const InviteVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Source */}
        <circle cx="200" cy="200" r="10" fill="currentColor" />

        {/* Particles emitting */}
        {[...Array(12)].map((_, i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ cx: 200, cy: 200, opacity: 0 }}
                    animate={{
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

const VoteVisual = () => (
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
        {[...Array(6)].map((_, i) => (
            <motion.circle
                key={i}
                initial={{
                    opacity: 0,
                    cx: 200 + (Math.random() - 0.5) * 300,
                    cy: 0
                }}
                animate={{
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

const ResultsVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Grid Lines */}
        <motion.line x1="50" y1="350" x2="350" y2="350" stroke="currentColor" strokeWidth="1" opacity="0.2" />

        {/* Bars */}
        {[0.6, 0.8, 0.4, 0.9].map((h, i) => (
            <motion.rect
                key={i}
                initial={{ height: 0, y: 350 }}
                animate={{ height: h * 250, y: 350 - (h * 250) }}
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
        <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-50 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex items-center justify-center">
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
                    className="w-full h-full p-12 md:p-24"
                >
                    {activeStep === 1 && <CreationVisual />}
                    {activeStep === 2 && <InviteVisual />}
                    {activeStep === 3 && <VoteVisual />}
                    {activeStep === 4 && <ResultsVisual />}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};


const LiveDemoSection = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [containerRef, isPaused] = useInViewPause({ threshold: 0.2 });

    return (
        <section ref={containerRef} className="relative w-full px-4 md:px-16 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800">

            <div className="max-w-8xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8"
                >
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <span className="h-px w-12 bg-gray-300 dark:bg-zinc-700"></span>
                            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500">
                                Process Flow
                            </h2>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.9]">
                            How it <br /> works.
                        </h1>
                    </div>
                    <p className="max-w-md text-xl text-gray-500 dark:text-zinc-400 leading-relaxed text-balance">
                        Democracy, distilled. A four-step protocol designed for maximum integrity and minimal friction.
                    </p>
                </motion.div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

                    {/* Left: Steps List */}
                    <div className="lg:col-span-5 flex flex-col justify-center h-full">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                onMouseEnter={() => setActiveStep(step.id)}
                                className={`group cursor-pointer py-6 border-t border-gray-100 dark:border-zinc-800 transition-all duration-500 ${activeStep === step.id ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                            >
                                <div className="flex items-baseline justify-between mb-4">
                                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {step.title}
                                    </h3>
                                    <span className="font-mono text-sm text-gray-400 dark:text-zinc-600">0{step.id}</span>
                                </div>
                                <div className="block">
                                    <p className="text-lg text-gray-500 dark:text-zinc-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {/* Final Border */}
                        <div className="w-full h-px bg-gray-100 dark:bg-zinc-800 md:hidden"></div>
                    </div>

                    {/* Right: Visual */}
                    <div className="lg:col-span-7 sticky top-24">
                        <VisualContainer activeStep={activeStep} isPaused={isPaused} />
                    </div>

                </div>
            </div>
        </section>
    );
};

LiveDemoSection.displayName = 'LiveDemoSection';
export default memo(LiveDemoSection);