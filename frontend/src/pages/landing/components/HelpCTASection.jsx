import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Plus, Minus, ArrowRight, ArrowUpRight, Activity } from 'lucide-react';

// --- DATA ---
const FAQS = [
    {
        id: '1',
        question: "Is my vote truly anonymous?",
        answer: "Yes. Votely uses Zero-Knowledge Proofs (zk-SNARKs) to cryptographic decouple your identity from your ballot. Even system administrators cannot link a specific vote back to you."
    },
    {
        id: '2',
        question: "How do I verify the election results?",
        answer: "Every vote is recorded on a public, immutable ledger. After the election closes, you can use the provided Merkle Root to mathematical verify that your specific ballot was counted correctly without revealing your choice."
    },
    {
        id: '3',
        question: "Is this free for universities?",
        answer: "We offer a generous free tier for student organizations and departmental elections. For university-wide governance with custom integration needs, we provide dedicated enterprise support."
    },
    {
        id: '4',
        question: "Can I run a poll for my DAO?",
        answer: "Absolutely. Votely supports token-gated voting and snapshot integration, making it perfect for decentralized autonomous organizations requiring high-integrity off-chain signaling."
    },
    {
        id: '5',
        question: "How secure is the platform?",
        answer: "Security is our core product. We employ a Zero Trust architecture, end-to-end encryption, and regular third-party audits. Your data is protected by the same standards used in financial cryptography."
    }
];

// --- COMPONENTS ---

const FaqItem = ({ item, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-300 dark:border-zinc-800">
            <button
                onClick={() => onClick(item.id)}
                className="w-full py-6 flex items-center justify-between text-left group focus:outline-none"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${item.id}`}
            >
                <span className={`text-lg md:text-xl font-medium tracking-tight transition-colors duration-200 ${isOpen ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-zinc-400 group-hover:text-gray-900 dark:group-hover:text-zinc-200'}`}>
                    {item.question}
                </span>
                <span className={`flex items-center justify-center ml-4 w-6 h-6 rounded-full border transition-all duration-200 ${isOpen ? 'bg-gray-900 border-gray-900 text-white dark:bg-white dark:border-white dark:text-black rotate-45' : 'border-gray-400 dark:border-zinc-700 text-gray-600 dark:text-zinc-500 group-hover:border-gray-900 dark:group-hover:border-white'}`}>
                    <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
                </span>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id={`faq-answer-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 text-base text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl">
                            {item.answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- IMMERSIVE CTA COMPONENT ---

const ImmersiveCTA = React.memo(() => {
    // 3D Tilt Physics
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth spring physics for the tilt
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 150, damping: 20 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 150, damping: 20 });

    // Glare effect
    const glareX = useTransform(x, [-0.5, 0.5], [0, 100]);
    const glareY = useTransform(y, [-0.5, 0.5], [0, 100]);
    const glareOpacity = useTransform(x, [-0.5, 0, 0.5], [0, 0.4, 0]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Particle Simulation Data
    const particles = React.useMemo(() => Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2
    })), []);

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            className="w-full h-full min-h-[500px] relative flex items-center justify-center p-2"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-full bg-black dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-2xl group border border-white/10"
            >
                {/* --- THE LIVING LEDGER: VISUALIZATION LAYER --- */}

                {/* 1. The Void (Background) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900 to-black z-0" />

                {/* 2. The Grid (Floor) */}
                <div className="absolute inset-0 opacity-20 z-0"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px',
                        transform: 'perspective(500px) rotateX(60deg) translateY(100px) scale(2)'
                    }}
                />

                {/* 3. The Mempool (Floating Particles) */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                            initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
                            animate={{
                                y: [`${p.y}%`, `${p.y - 20}%`, `${p.y}%`],
                                opacity: [0, 0.8, 0],
                                scale: [0, 1.5, 0]
                            }}
                            transition={{
                                duration: p.duration,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: p.delay
                            }}
                        />
                    ))}
                </div>

                {/* 4. The Genesis Block (Center Object) */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/20 z-20 flex items-center justify-center backdrop-blur-sm bg-white/5 rounded-xl"
                    style={{ transformStyle: "preserve-3d", translateZ: "50px" }}
                    animate={{ rotateZ: 360 }}
                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute inset-0 border border-white/10 rounded-xl scale-125 animate-pulse" />
                    <Activity className="w-12 h-12 text-white opacity-50" />
                </motion.div>

                {/* --- CONTENT LAYER --- */}
                <motion.div
                    className="relative z-30 h-full flex flex-col justify-between p-8 md:p-12"
                    style={{ transformStyle: "preserve-3d", translateZ: "80px" }}
                >
                    <div className="flex justify-between items-start">
                        <div className="inline-flex flex-col">
                            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 mix-blend-difference">
                                Initialize<br />Governance.
                            </h3>
                            <p className="text-blue-400 font-mono text-xs tracking-widest uppercase">
                                /// Genesis Block Ready
                            </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse" />
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-xl flex items-center justify-between group-hover:bg-white/20 transition-colors duration-300">
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-lg">Start Voting</span>
                            <span className="text-white/60 text-xs">Free Tier • No Credit Card</span>
                        </div>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <ArrowUpRight className="text-black w-5 h-5" />
                        </div>
                    </div>
                </motion.div>

                {/* --- GLARE FX --- */}
                <motion.div
                    className="absolute inset-0 z-40 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
                    style={{
                        opacity: glareOpacity,
                        backgroundPosition: useTransform(
                            [glareX, glareY],
                            ([xVal, yVal]) => `${xVal}% ${yVal}%`
                        )
                    }}
                />

                {/* Custom Cursor Follower within the card */}
                <motion.div
                    className="absolute w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none z-0"
                    style={{
                        x: useTransform(x, [-0.5, 0.5], [-100, 100]),
                        y: useTransform(y, [-0.5, 0.5], [-100, 100]),
                    }}
                />

            </motion.div>
        </motion.div>
    );
});

const HelpCTASection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (id) => {
        setOpenIndex(prev => prev === id ? null : id);
    };

    return (
        <section className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-white dark:bg-black selection:bg-gray-200 dark:selection:bg-zinc-800 transition-colors duration-300" style={{ contentVisibility: 'auto' }}>
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="mb-20">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white mb-6">
                        Questions & Support
                    </h2>
                    <p className="text-xl text-gray-700 dark:text-zinc-500 max-w-xl leading-relaxed">
                        Everything you need to know about secure, verifiable governance.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

                    {/* Left: FAQ List */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col">
                            {FAQS.map((item) => (
                                <FaqItem
                                    key={item.id}
                                    item={item}
                                    isOpen={openIndex === item.id}
                                    onClick={handleToggle}
                                />
                            ))}
                        </div>
                        <div className="mt-12">
                            <a href="#" className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white border-b border-gray-300 dark:border-zinc-800 pb-1 hover:border-gray-900 dark:hover:border-white transition-colors duration-200">
                                View full documentation <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Right: Immersive CTA */}
                    <div className="lg:col-span-5 relative">
                        <ImmersiveCTA />
                    </div>

                </div>
            </div>
        </section>
    );
};

HelpCTASection.displayName = 'HelpCTASection';
export default React.memo(HelpCTASection);
