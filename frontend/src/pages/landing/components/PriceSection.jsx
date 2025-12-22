import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Check, ArrowRight, Minus } from 'lucide-react';
import React, { useState } from 'react';

// --- VISUALS ---
// Abstract tech-minimalist visuals matching the "LiveDemo" style
const VisualUnit = ({ type }) => {
    return (
        <div className="w-full h-32 relative overflow-hidden flex items-center justify-center">
            {type === 'basic' && (
                <svg viewBox="0 0 100 100" className="w-full h-full text-current opacity-20">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    <circle cx="50" cy="50" r="10" fill="currentColor" />
                </svg>
            )}
            {type === 'pro' && (
                <svg viewBox="0 0 100 100" className="w-full h-full text-current opacity-20">
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    {[0, 45, 90, 135].map(r => (
                        <line key={r} x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" transform={`rotate(${r} 50 50)`} />
                    ))}
                    <circle cx="50" cy="50" r="15" fill="currentColor" />
                </svg>
            )}
            {type === 'enterprise' && (
                <svg viewBox="0 0 100 100" className="w-full h-full text-current opacity-20">
                    <defs>
                        <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <circle cx="50" cy="50" r="40" fill="url(#grid)" />
                    <circle cx="50" cy="50" r="20" fill="currentColor" />
                </svg>
            )}
        </div>
    );
};

// --- DATA ---
const TIERS = [
    {
        id: 'protocol',
        name: "Protocol",
        description: "Local Consensus",
        price: "0",
        features: [
            { name: "Single Election Instance", included: true },
            { name: "AES-256 Encryption", included: true },
            { name: "Basic Audit Logs", included: true },
            { name: "Custom Domain Mapping", included: false },
        ],
    },
    {
        id: 'federation',
        name: "Federation",
        description: "Org Governance",
        price: "29",
        features: [
            { name: "Unlimited Instances", included: true },
            { name: "Zero-Knowledge Proofs", included: true },
            { name: "Real-time Chaos Auditing", included: true },
            { name: "Custom Domain Mapping", included: true },
        ],
    },
    {
        id: 'empire',
        name: "Empire",
        description: "Sovereign Scale",
        price: "Custom",
        features: [
            { name: "Dedicated Nodes", included: true },
            { name: "Quantum-Resistant Sig", included: true },
            { name: "Sovereign Identity Integ", included: true },
            { name: "White-label Solution", included: true },
        ],
    }
];

// --- CARD COMPONENT ---
// Exact replica of BentoCard styling from FeaturesSection
const PriceCard = React.memo(({ tier, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const isEnterprise = tier.id === 'empire';
    const accentColor = isEnterprise ? 'bg-white text-black' : 'bg-transparent text-gray-900 dark:text-white border border-gray-300 dark:border-zinc-800 hover:border-gray-400 dark:hover:border-zinc-700';

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            onMouseMove={handleMouseMove}
            className="group relative flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-gray-50 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800/50 transition-all duration-700 rounded-3xl h-full"
        >
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* Hover Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.05),
              transparent 80%
            )
          `,
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">

                {/* Visual Header */}
                <div className="mb-8">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                        {tier.name}.
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-mono tracking-wide uppercase">
                        {tier.description}
                    </p>
                </div>

                {/* Price */}
                <div className="mb-12">
                    <div className="flex items-baseline gap-1">
                        <span className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white">
                            {tier.price === 'Custom' ? 'Custom' : `$${tier.price}`}
                        </span>
                        {tier.price !== 'Custom' && <span className="text-sm text-gray-600 dark:text-gray-400">/mo</span>}
                    </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-auto">
                    <div className="h-px w-full bg-gray-200 dark:bg-zinc-800 mb-6" />
                    {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                            {feat.included ? (
                                <Check className="w-4 h-4 text-gray-900 dark:text-white mt-0.5 shrink-0" />
                            ) : (
                                <Minus className="w-4 h-4 text-gray-300 dark:text-zinc-700 mt-0.5 shrink-0" />
                            )}
                            <span className={`${feat.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-zinc-600'}`}>
                                {feat.name}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Action Button */}
                <div className="mt-12">
                    <button className={`w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 ${accentColor}`}>
                        {tier.price === 'Custom' ? 'Contact Engineering' : 'Deploy Node'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    {isEnterprise && (
                        <div className="mt-4 text-center">
                            <span className="text-[10px] font-mono uppercase text-gray-600 dark:text-zinc-600">
                                24/7 Priority Support Included
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
});

PriceCard.displayName = 'PriceCard';

const PriceSection = () => {
    const [billing, setBilling] = useState('monthly');

    return (
        <section className="relative w-full py-32 px-4 md:px-16 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800" style={{ contentVisibility: 'auto' }}>

            {/* Massive Header - EXACT Match of FeaturesSection */}
            <div className="max-w-8xl mx-auto mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="h-px w-12 bg-gray-400 dark:bg-zinc-700" />
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-zinc-500">
                            Resource Allocation
                        </h2>
                    </div>

                    <h1 className="text-5xl md:text-[10rem] font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.8] mb-12 -ml-1 md:-ml-2">
                        Proof of <br /> <span className="text-gray-600 dark:text-zinc-600">Scale.</span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-12 flex justify-between items-end border-b border-gray-300 dark:border-zinc-900 pb-12">
                            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-400 leading-relaxed tracking-tight max-w-2xl">
                                Select the computational density required for your governance model.
                            </p>

                            {/* Minimal Toggle */}
                            <div className="flex bg-gray-100 dark:bg-zinc-900 p-1 rounded-full">
                                {['monthly', 'yearly'].map((cycle) => (
                                    <button
                                        key={cycle}
                                        onClick={() => setBilling(cycle)}
                                        className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${billing === cycle
                                            ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm'
                                            : 'text-gray-600 dark:text-zinc-600 hover:text-gray-800'
                                            }`}
                                    >
                                        {cycle}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Cards Grid / Mobile Carousel */}
            <div className="max-w-8xl mx-auto flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid-cols-3 gap-4 md:gap-6 items-stretch pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 no-scrollbar" role="list">
                {TIERS.map((tier, idx) => (
                    <div key={tier.id} className="flex-shrink-0 min-w-full md:min-w-0 md:w-auto snap-center" role="listitem">
                        <PriceCard tier={tier} index={idx} />
                    </div>
                ))}
            </div>

            {/* Footer Info */}
            <div className="max-w-8xl mx-auto mt-24 flex flex-col md:flex-row justify-between text-gray-600 dark:text-zinc-600 font-mono text-xs tracking-wider uppercase border-t border-gray-300 dark:border-zinc-900 pt-8">
                <div>* Prices exclude VAT</div>
                <div className="flex gap-8">
                    <span>Docs</span>
                    <span>API</span>
                    <span>SLA</span>
                </div>
            </div>

        </section>
    );
};

PriceSection.displayName = 'PriceSection';
export default PriceSection;