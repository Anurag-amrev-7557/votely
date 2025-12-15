import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';
import { ShieldCheck, Accessibility, Sparkles, ArrowRight, Lock, Eye, Zap, Fingerprint } from 'lucide-react';

// --- DATA ---
const FEATURES = [
  {
    id: 'security',
    title: "Cryptographic Integrity.",
    description: "AES-256 encryption. TLS 1.3 transmission. Zero-knowledge proofs. Your vote is mathematically secure.",
    icon: ShieldCheck,
    span: "md:col-span-2",
  },
  {
    id: 'accessibility',
    title: "Universally Inclusive.",
    description: "WCAG 2.2 compliant. Screen reader optimized. High contrast modes.",
    icon: Accessibility,
    span: "md:col-span-1",
  },
  {
    id: 'ux',
    title: "Frictionless Flow.",
    description: "Zero learning curve. Guided participation. Instant confirmation.",
    icon: Sparkles,
    span: "md:col-span-1",
  },
  {
    id: 'audit',
    title: "Total Transparency.",
    description: "Real-time audit logs. Verifiable results. Immutable ledger.",
    icon: Eye,
    span: "md:col-span-2",
  }
];

// --- COMPONENTS ---

const BentoCard = ({ title, description, icon: Icon, span, index }) => {
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
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col justify-between p-8 md:p-12 overflow-hidden bg-gray-50 dark:bg-zinc-900/50 border border-transparent dark:border-zinc-800/50 hover:border-gray-200 dark:hover:border-zinc-700 transition-all duration-700 rounded-3xl ${span}`}
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

      <div className="relative z-10 flex flex-col h-full justify-between gap-12">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm border border-gray-100 dark:border-zinc-700/50 group-hover:scale-110 transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)">
          <Icon className="w-5 h-5 text-gray-900 dark:text-white" strokeWidth={1.5} />
        </div>

        <div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-gray-900 dark:text-white mb-4 leading-[0.9]">
            {title}
          </h3>
          <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm text-balance">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="relative w-full py-32 px-4 md:px-16 bg-white dark:bg-black overflow-hidden selection:bg-gray-200 dark:selection:bg-zinc-800">

      {/* Massive Header */}
      <div className="max-w-8xl mx-auto mb-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="h-px w-12 bg-gray-300 dark:bg-zinc-700"></span>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-500">
              System Architecture
            </h2>
          </div>

          <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.8] mb-12 -ml-1 md:-ml-2">
            Vote with <br /> <span className="text-gray-400 dark:text-zinc-600">confidence.</span>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 md:col-start-8">
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed tracking-tight text-balance">
                A minimalist fortress for democracy. We stripped away the noise to focus on what matters: <span className="text-gray-900 dark:text-white font-medium">Integrity, Accessibility,</span> and <span className="text-gray-900 dark:text-white font-medium">Speed.</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {FEATURES.map((feature, idx) => (
          <BentoCard key={feature.id} {...feature} index={idx} />
        ))}
      </div>

      {/* Professional Footer */}
      <div className="max-w-8xl mx-auto mt-8 border-t border-gray-100 dark:border-zinc-900 pt-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-zinc-800"></div>
              ))}
            </div>
            <p className="text-sm text-gray-400 font-mono tracking-wider uppercase">
              Secure Voting Infrastructure V2.0
            </p>
          </div>

          <a href="#demo" className="group flex items-center gap-4 text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <span className="relative">
              View Technical Specs
              <span className="absolute left-0 -bottom-1 w-full h-px bg-current scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
            </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1 duration-300" />
          </a>
        </div>
      </div>

    </section>
  );
};

FeaturesSection.displayName = 'FeaturesSection';
export default FeaturesSection; 