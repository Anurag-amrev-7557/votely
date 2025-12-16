import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { Eye, Code, Cpu, Scan, CheckCircle2 } from 'lucide-react';
import { useInViewPause } from '../../../hooks/useInViewPause';

// --- SHARED UI COMPONENT (The "Subject") ---
// This component renders twice: once for the look, once for the code.
const AccessibilityDemoUI = ({ mode = 'visual' }) => {
    const isSemantic = mode === 'semantic';

    return (
        <div className={`w-full max-w-xl mx-auto p-8 rounded-2xl border transition-all duration-300 relative overflow-hidden
            ${isSemantic
                ? 'bg-black border-green-500/50 font-mono text-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]'
                : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 shadow-2xl'
            }`}
        >
            {/* Semantic Grid / Background overlay */}
            {isSemantic && (
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                    style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(34, 197, 94, .3) 25%, rgba(34, 197, 94, .3) 26%, transparent 27%, transparent 74%, rgba(34, 197, 94, .3) 75%, rgba(34, 197, 94, .3) 76%, transparent 77%, transparent)', backgroundSize: '30px 30px' }}
                />
            )}

            <div className="relative z-10 flex flex-col gap-6">

                {/* Header Area */}
                <div className="flex items-center justify-between border-b pb-4 border-gray-300 dark:border-zinc-800/50">
                    <div className="flex items-center gap-3">
                        {isSemantic ? (
                            <div className="text-xs border border-green-500 px-2 py-1 rounded bg-green-900/20">
                                &lt;h3 role="status"&gt;
                            </div>
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <Scan className="w-5 h-5" />
                            </div>
                        )}

                        <div className="flex flex-col">
                            <span className={`font-bold text-lg ${isSemantic ? 'text-green-400' : 'text-gray-900 dark:text-white'}`}>
                                {isSemantic ? 'DOM_NODE_342' : 'Vote Confirmation'}
                            </span>
                            {isSemantic && <span className="text-[10px] opacity-70">CONFIDENCE: 99.8%</span>}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl ${isSemantic ? 'border border-dashed border-green-500/30 bg-green-900/10' : 'bg-gray-50 dark:bg-zinc-800/50'}`}>
                        {isSemantic ? (
                            <div className="text-xs space-y-1 opacity-80">
                                <p>&lt;p aria-live="polite"&gt;</p>
                                <p className="pl-4 text-green-300">"Your voice is encrypted..."</p>
                                <p>&lt;/p&gt;</p>
                                <p className="mt-2 text-[10px] text-green-600">CONTRAST: 21.05 (AAA)</p>
                            </div>
                        ) : (
                            <p className="text-gray-800 dark:text-gray-200 leading-relaxed">
                                Your voice is encrypted and permanently recorded on the immutable ledger.
                            </p>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button className={`flex-1 py-3 rounded-xl font-semibold transition-all
                            ${isSemantic
                                ? 'border border-green-500 text-green-500 hover:bg-green-500/10'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
                            }`}
                        >
                            {isSemantic ? (
                                <span className="flex flex-col items-center">
                                    <span className="text-xs">&lt;button tabindex="0"&gt;</span>
                                    <span className="text-[10px] mt-0.5 opacity-70">ACTION: SUBMIT</span>
                                </span>
                            ) : (
                                "Verify Record"
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Metadata */}
                {isSemantic && (
                    <div className="flex justify-between text-[10px] pt-2 border-t border-green-500/30 opacity-60">
                        <span>NODE_ID: #8x2A</span>
                        <span>WCAG: PASS</span>
                    </div>
                )}
            </div>
        </div>
    );
};


const AccessibilitySection = () => {
    const sectionRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    // Mouse Metrics
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth physics for the lens
    const springConfig = { damping: 25, stiffness: 120, mass: 0.5 };
    const lensX = useSpring(mouseX, springConfig);
    const lensY = useSpring(mouseY, springConfig);

    const handleMouseMove = (e) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    const [containerRef, isPaused] = useInViewPause({ threshold: 0.1 });

    // Auto-scan animation when not hovering and not paused
    useEffect(() => {
        if (isHovering || isPaused) return;

        const startTime = Date.now();
        const animate = () => {
            if (isHovering) return;
            const now = Date.now();
            const t = (now - startTime) * 0.001;

            // Lissajous figure for auto-scan path
            if (sectionRef.current) {
                const rect = sectionRef.current.getBoundingClientRect();
                const cx = rect.width / 2;
                const cy = rect.height / 2;
                const rx = rect.width * 0.3;
                const ry = rect.height * 0.2;

                mouseX.set(cx + Math.cos(t) * rx);
                mouseY.set(cy + Math.sin(t * 1.5) * ry);
            }
            requestAnimationFrame(animate);
        };
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [isHovering, mouseX, mouseY, isPaused]);


    return (
        <section
            ref={(node) => {
                sectionRef.current = node;
                if (containerRef) containerRef.current = node;
            }}
            id="accessibility"
            className="relative w-full py-16 bg-zinc-950 overflow-hidden cursor-crosshair selection:bg-green-500/30"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`, backgroundSize: '40px 40px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">

                {/* Header - Industrial/Technical */}
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-6 uppercase tracking-widest"
                    >
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        System Integrity: Verified
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6"
                    >
                        INVISIBLE <span className="text-transparent bg-clip-text bg-gradient-to-b from-zinc-500 to-zinc-800">ENGINEERING</span>
                    </motion.h2>

                    <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
                        True accessibility isn't just about colors. It's built into the <span className="text-white font-mono">DOM Architecture</span>.
                        <br />We engineer the semantic layer first, visual layer second.
                    </p>
                </div>

                {/* THE SCANNER INTERACTION */}
                <div
                    ref={sectionRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="relative min-h-[500px] flex items-center justify-center"
                >

                    {/* Layer 1: Visual (Base) */}
                    <div className="relative z-10 w-full flex justify-center opacity-40 blur-[2px] grayscale transition-all duration-500 hover:blur-none hover:grayscale-0 hover:opacity-100">
                        <AccessibilityDemoUI mode="visual" />
                    </div>

                    {/* Layer 2: Semantic (Revealed by Scanner) */}
                    <motion.div
                        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        style={{
                            maskImage: useTransform(
                                [lensX, lensY],
                                ([x, y]) => `radial-gradient(circle 180px at ${x}px ${y}px, black 100%, transparent 100%)`
                            ),
                            WebkitMaskImage: useTransform(
                                [lensX, lensY],
                                ([x, y]) => `radial-gradient(circle 180px at ${x}px ${y}px, black 100%, transparent 100%)`
                            )
                        }}
                    >
                        <AccessibilityDemoUI mode="semantic" />
                    </motion.div>

                    {/* Scanner Visual Ring (Follows Mouse) */}
                    <motion.div
                        className="absolute top-0 left-0 w-[360px] h-[360px] rounded-full border border-green-500/50 z-30 pointer-events-none flex items-center justify-center"
                        style={{
                            x: useTransform(lensX, (x) => x - 180),
                            y: useTransform(lensY, (y) => y - 180),
                        }}
                    >
                        {/* Scanner Decor */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-green-500/20 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute top-0 left-1/2 -ml-[1px] h-4 w-[2px] bg-green-500" />
                        <div className="absolute bottom-0 left-1/2 -ml-[1px] h-4 w-[2px] bg-green-500" />
                        <div className="absolute left-0 top-1/2 -mt-[1px] w-4 h-[2px] bg-green-500" />
                        <div className="absolute right-0 top-1/2 -mt-[1px] w-4 h-[2px] bg-green-500" />

                        <div className="absolute bottom-4 right-8 text-[10px] font-mono text-green-500 bg-black/80 px-1">
                            SCANNING_LAYER_02
                        </div>
                    </motion.div>

                </div>

                {/* Metric Strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 border-t border-zinc-900 pt-12" role="list">
                    {[
                        { label: "ARIA Coverage", value: "100%", icon: CheckCircle2 },
                        { label: "Keyboard Nav", value: "NATIVE", icon: Cpu },
                        { label: "Color Contrast", value: "AAA", icon: Eye },
                        { label: "Semantics", value: "VALID", icon: Code },
                    ].map((metric, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start p-4 hover:bg-zinc-900/50 rounded-xl transition-colors group" role="listitem">
                            <metric.icon className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors mb-3" />
                            <div className="text-3xl font-black text-white mb-1 group-hover:scale-105 transition-transform origin-left">{metric.value}</div>
                            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{metric.label}</div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

AccessibilitySection.displayName = 'AccessibilitySection';
export default React.memo(AccessibilitySection);