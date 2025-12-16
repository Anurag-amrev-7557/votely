import React, { useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// Shared Admin Dashboard Widgets

export const DashboardWidget = ({ title, children, className = "", span = "col-span-1" }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`group relative flex flex-col justify-between p-5 overflow-hidden bg-white dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-700/80 hover:border-gray-400 dark:hover:border-zinc-500 ring-1 ring-gray-100 dark:ring-zinc-800 hover:ring-gray-200 dark:hover:ring-zinc-600 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-lg dark:shadow-lg dark:shadow-black/20 ${span} ${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900`}
            role="region"
            aria-label={title}
            tabIndex={0}
        >
            <NoiseTexture />
            <SpotlightEffect mouseX={mouseX} mouseY={mouseY} />

            <div className="relative z-10 flex flex-col h-full">
                {title && (
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-300 mb-3">
                        {title}
                    </h3>
                )}
                {children}
            </div>
        </motion.div>
    );
};

export const StatValue = ({ value, label, trend, icon: Icon }) => (
    <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm border border-gray-200 dark:border-zinc-700/50">
                {Icon && <Icon className="w-4 h-4 text-gray-900 dark:text-white" strokeWidth={1.5} />}
            </div>
            {trend && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trend > 0
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
            )}
        </div>
        <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-none mt-1">
            {value}
        </span>
        <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">
            {label}
        </span>
    </div>
);

// Visual Effects Helper Components
export const NoiseTexture = () => (
    <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

export const SpotlightEffect = ({ mouseX, mouseY }) => (
    <motion.div
        className="absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
            background: useMotionValueTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(59, 130, 246, 0.04), transparent 40%)`
        }}
    />
);

// Helper for template string
function useMotionValueTemplate(strings, ...values) {
    const value = useMotionValue('');

    React.useEffect(() => {
        const update = () => {
            let result = '';
            for (let i = 0; i < strings.length; i++) {
                result += strings[i];
                if (i < values.length) {
                    result += values[i].get();
                }
            }
            value.set(result);
        };

        const unsubscribers = values.map(v => v.on('change', update));
        update();

        return () => unsubscribers.forEach(u => u());
    }, [strings, values, value]);

    return value;
}
