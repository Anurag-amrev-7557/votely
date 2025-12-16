import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import * as THREE from 'three';
import { ShieldCheck, Lock, Eye, Server, Key, Fingerprint, Activity, FileCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useInViewPause } from '../../../hooks/useInViewPause';

// --- 2D SCHEMATIC VISUALIZATIONS ---

const EncryptionVisual = ({ isPaused }) => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Core Lock Symbol */}
        <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isPaused ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d="M160 160 V120 C160 97.9086 177.909 80 200 80 C222.091 80 240 97.9086 240 120 V160"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        />
        <motion.rect
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            x="140" y="160" width="120" height="100" rx="8"
            fill="none" stroke="currentColor" strokeWidth="2"
        />

        {/* Rotating Rings */}
        {[100, 140, 180].map((r, i) => (
            <motion.circle
                key={i}
                initial={{ rotate: 0, opacity: 0 }}
                animate={isPaused ? { rotate: 0, opacity: 0.3 } : { rotate: i % 2 === 0 ? 360 : -360, opacity: 0.3 - (i * 0.05) }}
                transition={{ duration: 10 + i * 5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                cx="200" cy="200" r={r}
                fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="10 10"
            />
        ))}

        {/* Data Bits */}
        {[...Array(8)].map((_, i) => (
            <motion.circle
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                cx={200 + Math.cos(i * Math.PI / 4) * 160}
                cy={200 + Math.sin(i * Math.PI / 4) * 160}
                r="2" fill="currentColor"
            />
        ))}
    </svg>
);

const IntegrityVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Merkle Tree Structure */}
        {/* Level 3 (Roots) */}
        {[0, 1, 2, 3].map((i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    cx={80 + i * 80} cy="320" r="6" stroke="currentColor" fill="none"
                />
                <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                    x1={80 + i * 80} y1="314"
                    x2={120 + Math.floor(i / 2) * 160} y2="226"
                    stroke="currentColor" strokeWidth="1" opacity="0.3"
                />
            </motion.g>
        ))}

        {/* Level 2 -- Corrected coords to match lines */}
        {[0, 1].map((i) => (
            <motion.g key={i}>
                <motion.circle
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + i * 0.2 }}
                    cx={120 + i * 160} cy="220" r="8" stroke="currentColor" fill="none"
                />
                <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5 + i * 0.2, duration: 0.8 }}
                    x1={120 + i * 160} y1="212"
                    x2="200" y2="108"
                    stroke="currentColor" strokeWidth="1" opacity="0.3"
                />
            </motion.g>
        ))}

        {/* Level 1 (Root) */}
        <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, type: 'spring' }}
            cx="200" cy="100" r="12" stroke="currentColor" strokeWidth="2" fill="none"
        />

        {/* Verification Check */}
        <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 2.5 }}
            d="M194 100 L198 104 L206 96"
            fill="none" stroke="currentColor" strokeWidth="1.5"
        />
    </svg>
);

const PrivacyVisual = () => {
    // Pre-computed positions to avoid Math.random() issues during render
    const noisePositions = [
        { x: 120, y: 140, tx: 180, ty: 220 },
        { x: 200, y: 110, tx: 150, ty: 180 },
        { x: 280, y: 160, tx: 220, ty: 250 },
        { x: 140, y: 200, tx: 260, ty: 140 },
        { x: 240, y: 180, tx: 130, ty: 200 },
        { x: 160, y: 250, tx: 200, ty: 120 },
        { x: 220, y: 130, tx: 170, ty: 280 },
        { x: 300, y: 200, tx: 240, ty: 160 },
        { x: 180, y: 280, tx: 110, ty: 230 },
        { x: 260, y: 220, tx: 290, ty: 170 },
        { x: 130, y: 170, tx: 210, ty: 270 },
        { x: 210, y: 260, tx: 140, ty: 150 },
        { x: 270, y: 140, tx: 180, ty: 210 },
        { x: 150, y: 230, tx: 250, ty: 130 },
        { x: 230, y: 150, tx: 120, ty: 260 },
        { x: 190, y: 190, tx: 270, ty: 190 },
        { x: 250, y: 250, tx: 160, ty: 140 },
        { x: 170, y: 120, tx: 230, ty: 240 },
        { x: 290, y: 180, tx: 140, ty: 180 },
        { x: 110, y: 240, tx: 200, ty: 150 },
    ];
    const durations = [2.5, 3.0, 2.8, 3.2, 2.6, 3.1, 2.9, 2.7, 3.3, 2.4, 2.8, 3.0, 2.6, 3.2, 2.9, 2.5, 3.1, 2.7, 2.8, 3.0];

    return (
        <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
            {/* The Secret Core (Hidden) */}
            <motion.circle
                cx="200" cy="200" r="40"
                fill="currentColor"
                opacity="0.1"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Wave Interference / Veil */}
            {[...Array(8)].map((_, i) => (
                <motion.path
                    key={i}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 2, delay: i * 0.1, ease: 'linear' }}
                    d={`M 50 ${100 + i * 25} Q 125 ${50 + i * 25} 200 ${100 + i * 25} T 350 ${100 + i * 25}`}
                    fill="none" stroke="currentColor" strokeWidth="1"
                />
            ))}

            {/* Floating "Noise" particles obscuring view */}
            {noisePositions.map((pos, i) => (
                <motion.rect
                    key={i}
                    initial={{ x: pos.x, y: pos.y, opacity: 0 }}
                    animate={{
                        x: [null, pos.tx],
                        y: [null, pos.ty],
                        opacity: [0, 0.5, 0]
                    }}
                    transition={{ duration: durations[i], repeat: Infinity, ease: "linear" }}
                    width="4" height="4" fill="currentColor"
                />
            ))}
        </svg>
    );
};

const AuthVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Fingerprint / Grid Pattern */}
        <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
        </defs>

        <rect x="100" y="100" width="200" height="200" fill="url(#grid)" opacity="0.5" />

        {/* Frame Markers */}
        <path d="M100 130 V100 H130" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M270 100 H300 V130" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M100 270 V300 H130" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M270 300 H300 V270" fill="none" stroke="currentColor" strokeWidth="2" />

        {/* Scanning Beam */}
        <motion.rect
            initial={{ y: 100, opacity: 0.5 }}
            animate={{ y: 300, opacity: 0.5 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            x="100" width="200" height="4" fill="currentColor"
        />

        {/* Verified Icon appearing */}
        <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
            <circle cx="200" cy="200" r="30" fill="currentColor" />
            <path d="M190 200 L196 206 L210 192" fill="none" stroke="white" strokeWidth="3" className="dark:stroke-black" />
        </motion.g>
    </svg>
);

const SecurityVisualizer = ({ activeData, isPaused }) => {
    return (
        <div className="w-full h-full p-12 md:p-24">
            {activeData.id === 'encryption' && <EncryptionVisual isPaused={isPaused} />}
            {activeData.id === 'integrity' && <IntegrityVisual isPaused={isPaused} />}
            {activeData.id === 'privacy' && <PrivacyVisual isPaused={isPaused} />}
            {activeData.id === 'auth' && <AuthVisual isPaused={isPaused} />}
        </div>
    );
};


// --- UI COMPONENTS ---

const FEATURES = [
    {
        id: 'encryption',
        title: 'AES-256 GCM',
        subtitle: 'Military-Grade Encryption',
        description: 'Every vote is sealed with quantum-resistant cryptographic protocols before it even leaves your device.',
        icon: Lock,
        color: '#71717a', // Zinc-500
    },
    {
        id: 'integrity',
        title: 'Immutable Ledger',
        subtitle: 'Blockchain Verification',
        description: 'Votes are hashed and chained. Any attempt to tamper with history breaks the cryptographic chain immediately.',
        icon: FileCheck,
        color: '#71717a', // Zinc-500
    },
    {
        id: 'privacy',
        title: 'Zero-Knowledge',
        subtitle: 'Absolute Anonymity',
        description: 'Prove you have the right to vote without revealing who you are or who you voted for.',
        icon: Eye,
        color: '#71717a', // Zinc-500
    },
    {
        id: 'auth',
        title: 'Biometric Gate',
        subtitle: 'Multi-Factor Auth',
        description: 'Hardware-backed security keys and biometric verification ensure only YOU can cast your ballot.',
        icon: Fingerprint,
        color: '#71717a', // Zinc-500
    }
];

const FeatureItem = React.memo(({ feature, isActive, onHover, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        onMouseEnter={() => onHover(feature)}
        onClick={() => onHover(feature)}
        className={`group relative flex-shrink-0 min-w-[120px] md:min-w-0 snap-center p-2 md:p-6 rounded-2xl cursor-pointer border transition-all duration-500 overflow-hidden ${isActive
            ? 'bg-gray-100 dark:bg-zinc-800/80 border-gray-300 dark:border-zinc-700 ring-1 md:ring-0 ring-gray-900 dark:ring-white scale-[1.02] md:scale-100'
            : 'bg-transparent border-gray-300 dark:border-zinc-800 md:border-transparent hover:bg-gray-50/50 dark:hover:bg-zinc-800/30 opacity-60 md:opacity-100'
            }`}
        role="button"
        tabIndex={0}
        aria-pressed={isActive}
        onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onHover(feature);
            }
        }}
    >
        {isActive && (
            <motion.div
                layoutId="activeGlow"
                className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-transparent dark:from-zinc-700/50 opacity-100 hidden md:block"
                transition={{ duration: 0.3 }}
            />
        )}

        <div className="relative flex items-start gap-3 md:gap-4 z-10">
            <div className={`p-2 md:p-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10' : 'bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700'}`}>
                <feature.icon className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
            </div>

            <div className="flex-1">
                <div className="flex items-center md:items-baseline justify-between mb-1 gap-2">
                    <h3 className={`text-sm md:text-lg font-bold tracking-tight transition-colors duration-300 whitespace-nowrap md:whitespace-normal ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-zinc-400'}`}>
                        {feature.title}
                    </h3>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-xs font-mono text-black dark:text-white font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10"
                        >
                            <Activity className="w-3 h-3" />
                            <span className="hidden md:inline">ACTIVE</span>
                        </motion.div>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-500 mb-2 uppercase tracking-wider">{feature.subtitle}</p>
                <div className={`grid transition-all duration-300 ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-60'} hidden md:grid`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-gray-700 dark:text-zinc-400">
                        {feature.description}
                    </p>
                </div>
            </div>
        </div>
    </motion.div>
));

const SecuritySection = ({ isVisible }) => {
    const [activeFeature, setActiveFeature] = useState(FEATURES[0]);
    const { isDarkMode } = useTheme();
    const [containerRef, isPaused] = useInViewPause({ threshold: 0.2 });

    // Auto-cycle features if user isn't interacting and NOT PAUSED
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setActiveFeature(prev => {
                const currentIndex = FEATURES.findIndex(f => f.id === prev.id);
                return FEATURES[(currentIndex + 1) % FEATURES.length];
            });
        }, 5000); // Cycle every 5 seconds
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section ref={containerRef} className="relative w-full py-32 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800">

            <div className="mx-auto px-4 md:px-16">

                {/* Header */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-24'
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4 md:mb-6">
                                <span className="h-px w-8 md:w-12 bg-gray-400 dark:bg-zinc-700"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-zinc-500">
                                    Zero Trust Architecture
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white">
                                Unbreakable <br />
                                <span className="text-gray-600 dark:text-zinc-600">
                                    Consensus.
                                </span>
                            </h2>
                        </div>
                        <p className="text-lg md:text-xl text-gray-700 dark:text-zinc-400 leading-relaxed max-w-lg text-balance">
                            We don't just secure your vote. We mathematically prove its existence and integrity using simplified cryptographic primitives.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    {/* Left: Feature List - Mobile: Cards Row, Desktop: Vertical List */}
                    <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-3 lg:gap-4 pb-4 pt-2 lg:pb-0 -mx-4 lg:mx-0 px-4 lg:px-0 snap-x snap-mandatory no-scrollbar relative z-10 order-2 lg:order-1">
                        {FEATURES.map((feature, idx) => (
                            <FeatureItem
                                key={feature.id}
                                feature={feature}
                                isActive={activeFeature.id === feature.id}
                                onHover={setActiveFeature}
                                index={idx}
                            />
                        ))}
                    </div>

                    {/* Right: 3D Visualization */}
                    <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-50 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-gray-300 dark:border-zinc-800 flex items-center justify-center order-1 lg:order-2 lg:sticky">
                        {/* Ambient Background Noise/Grain */}
                        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeFeature.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full"
                            >
                                <SecurityVisualizer activeData={activeFeature} isPaused={isPaused} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </section>
    );
};

SecuritySection.displayName = 'SecuritySection';
export default React.memo(SecuritySection);
