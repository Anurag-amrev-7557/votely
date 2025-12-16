import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Quote, CheckCircle2, Hash, User, Building2, Fingerprint } from 'lucide-react';

// --- DATA ---
const TESTIMONIALS = [
    {
        id: 't1',
        quote: "The consensus mechanism is not just secure; it's a mathematical masterpiece. Finally, a governance tool that respects intelligence.",
        author: "Clara Bennett",
        role: "Global Systems Admin",
        org: "TechFlow DAO",
        hash: "0x7f...3a2",
        span: "md:col-span-2",
        delay: 0
    },
    {
        id: 't2',
        quote: "Zero friction, absolute precision. Votely broke the barrier between security and usability.",
        author: "James Wilson",
        role: "DAO Architect",
        org: "Nexus Protocol",
        hash: "0x9c...1b4",
        span: "md:col-span-1",
        delay: 0.1
    },
    {
        id: 't3',
        quote: "Inclusive design is no longer optional. This is the new benchmark for accessible governance.",
        author: "Sarah Martinez",
        role: "UX Principles Lead",
        org: "OpenWeb Foundation",
        hash: "0x2d...9e1",
        span: "md:col-span-1",
        delay: 0.2
    },
    {
        id: 't4',
        quote: "Verifiable integrity at this scale shouldn't be possible. The cryptographic proofs are irrefutable.",
        author: "David Chen",
        role: "Security Auditor",
        org: "BlockGuard",
        hash: "0x4a...f7c",
        span: "md:col-span-2",
        delay: 0.3
    },
    {
        id: 't5',
        quote: "A fortress for democracy. We stripped away the noise to focus on what matters.",
        author: "Elena Rodriguez",
        role: "Community Lead",
        org: "Civic Chain",
        hash: "0x1e...5d9",
        span: "md:col-span-3",
        delay: 0.4
    }
];

// --- COMPONENTS ---

const VerifiedBadge = ({ hash }) => (
    <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-white border border-gray-300 dark:bg-zinc-800 dark:border-zinc-700/50">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-mono text-gray-700 dark:text-zinc-500 uppercase tracking-wider">
            Verified: {hash}
        </span>
    </div>
);

const TestimonialCard = ({ quote, author, role, org, hash, span, delay }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
            onMouseMove={handleMouseMove}
            className={`group relative h-full flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-gray-50 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800/50 hover:border-gray-300 dark:hover:border-zinc-700 transition-all duration-700 rounded-3xl ${span}`}
        >
            {/* Subtle Noise Texture */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* Hover Spotlight Effect */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.08),
              transparent 80%
            )
          `,
                }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
                {/* Header: Verified Hash */}
                <div className="flex justify-between items-start">
                    <VerifiedBadge hash={hash} />
                    <Quote className="w-5 h-5 text-gray-400 dark:text-zinc-700" />
                </div>

                {/* Main Content */}
                <div>
                    <h3 className="text-xl md:text-3xl font-medium tracking-tight text-gray-900 dark:text-white leading-tight mb-8">
                        "{quote}"
                    </h3>
                </div>

                {/* Footer: Identity */}
                <div className="flex items-center gap-4 border-t border-gray-300/50 dark:border-zinc-800 pt-6">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 flex items-center justify-center text-gray-900 dark:text-white font-bold">
                        {author.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{author}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-700 dark:text-zinc-500 font-mono uppercase tracking-wide">
                            <span>{role}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-400 dark:bg-zinc-700" />
                            <span>{org}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const TestimonialSection = () => {
    return (
        <section className="relative w-full py-32 px-4 md:px-16 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800">

            <div className="max-w-8xl mx-auto mb-32">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <span className="h-px w-12 bg-gray-400 dark:bg-zinc-700"></span>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-700 dark:text-zinc-500">
                            Community Consensus
                        </h2>
                    </div>

                    <h1 className="text-5xl md:text-[10rem] font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.8] mb-12 -ml-1 md:-ml-2">
                        Trusted by <br /> <span className="text-gray-600 dark:text-zinc-600">builders.</span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-5 md:col-start-8">
                            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-400 leading-relaxed tracking-tight text-balance">
                                Join thousands of organizations verifying their decisions on the immutable ledger. <span className="text-gray-900 dark:text-white font-medium">Real voices. Real impact.</span>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Grid / Mobile Carousel */}
            <div className="max-w-8xl mx-auto flex md:grid overflow-x-auto md:overflow-visible snap-x snap-mandatory md:grid-cols-3 gap-4 md:gap-6 pb-8 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 no-scrollbar" role="list">
                {TESTIMONIALS.map((t) => (
                    <div key={t.id} className={`flex-shrink-0 min-w-full md:min-w-0 md:w-auto snap-center ${t.span}`} role="listitem">
                        <TestimonialCard {...t} span="" /> {/* Pass empty span to card, handle layout in wrapper if needed, or let card be flexible */}
                    </div>
                ))}
            </div>

            {/* Professional Footer */}
            <div className="max-w-8xl mx-auto mt-8 border-t border-gray-300 dark:border-zinc-900 pt-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-zinc-800"></div>
                            ))}
                        </div>
                        <p className="text-sm text-gray-600 font-mono tracking-wider uppercase">
                            Global Verification Nodes Active
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default TestimonialSection;