import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import * as THREE from 'three';
import { ShieldCheck, Lock, Eye, Server, Key, Fingerprint, Activity, FileCheck } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import { useInViewPause } from '../../../hooks/useInViewPause';

// --- 2D SCHEMATIC VISUALIZATIONS ---

const EncryptionVisual = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full text-gray-900 dark:text-white">
        {/* Core Lock Symbol */}
        <motion.path
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
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
                animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: 0.3 - (i * 0.05) }}
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

const PrivacyVisual = () => (
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
        {[...Array(20)].map((_, i) => (
            <motion.rect
                key={i}
                initial={{ x: 100 + Math.random() * 200, y: 100 + Math.random() * 200, opacity: 0 }}
                animate={{
                    x: [null, 100 + Math.random() * 200],
                    y: [null, 100 + Math.random() * 200],
                    opacity: [0, 0.5, 0]
                }}
                transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, ease: "linear" }}
                width="4" height="4" fill="currentColor"
            />
        ))}
    </svg>
);

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

const SecurityVisualizer = ({ activeData }) => {
    return (
        <div className="w-full h-full p-12 md:p-24">
            {activeData.id === 'encryption' && <EncryptionVisual />}
            {activeData.id === 'integrity' && <IntegrityVisual />}
            {activeData.id === 'privacy' && <PrivacyVisual />}
            {activeData.id === 'auth' && <AuthVisual />}
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
        className={`group relative p-6 rounded-2xl cursor-pointer border transition-all duration-500 overflow-hidden ${isActive
            ? 'bg-gray-50 dark:bg-zinc-800/80 border-gray-200 dark:border-zinc-700'
            : 'bg-transparent border-transparent hover:bg-gray-50/50 dark:hover:bg-zinc-800/30'
            }`}
    >
        {isActive && (
            <motion.div
                layoutId="activeGlow"
                className="absolute inset-0 bg-gradient-to-r from-gray-200/50 to-transparent dark:from-zinc-700/50 opacity-100"
                transition={{ duration: 0.3 }}
            />
        )}

        <div className="relative flex items-start gap-4 z-10">
            <div className={`p-3 rounded-xl transition-colors duration-300 ${isActive ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 group-hover:bg-white dark:group-hover:bg-zinc-700'}`}>
                <feature.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>

            <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                    <h3 className={`text-lg font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-zinc-400'}`}>
                        {feature.title}
                    </h3>
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-1.5 text-xs font-mono text-black dark:text-white font-medium px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10"
                        >
                            <Activity className="w-3 h-3" />
                            ACTIVE
                        </motion.div>
                    )}
                </div>
                <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 mb-2 uppercase tracking-wider">{feature.subtitle}</p>
                <div className={`grid transition-all duration-300 ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-60'}`}>
                    <p className="overflow-hidden text-sm leading-relaxed text-gray-500 dark:text-zinc-400">
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
                        className='flex justify-between w-full items-center'
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="h-px w-12 bg-gray-300 dark:bg-zinc-700"></span>
                                <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500">
                                    Zero Trust Architecture
                                </span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6">
                                Unbreakable <br />
                                <span className="text-gray-400 dark:text-zinc-600">
                                    Consensus.
                                </span>
                            </h2>
                        </div>
                        <p className="text-xl text-gray-500 dark:text-zinc-400 leading-relaxed max-w-lg">
                            We don't just secure your vote. We mathematically prove its existence and integrity using simplified cryptographic primitives.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left: Feature List */}
                    <div className="flex flex-col gap-4 relative z-10">
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
                    <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-gray-50 dark:bg-zinc-900/50 rounded-3xl overflow-hidden border border-gray-100 dark:border-zinc-800 flex items-center justify-center">
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
                                <SecurityVisualizer activeData={activeFeature} />
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
