import { memo } from 'react';
import { motion } from 'framer-motion';
import { FEATURES_DATA } from './HeroConstants';
import { EncryptionIcon, ResultsIcon, SupportIcon } from './HeroIcons';
import { featuresContainer, featureItem } from './animations';

const iconMap = {
    encryption: <EncryptionIcon />,
    results: <ResultsIcon />,
    support: <SupportIcon />
};

const HeroFeatures = () => {
    return (
        <motion.div
            className="relative grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[96px] py-2 px-1 sm:px-0"
            aria-label="Platform Features"
            variants={featuresContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.7 }}
        >
            {FEATURES_DATA.map((feature) => (
                <motion.div
                    key={feature.key}
                    className="group relative flex items-center justify-center gap-3 rounded-xl bg-white/70 dark:bg-gray-900/60 dark:border-0 transition-all duration-300 cursor-pointer"
                    variants={featureItem}
                    tabIndex={0}
                    aria-label={feature.text}
                    role="listitem"
                >
                    <div className="flex-shrink-0">{iconMap[feature.key]}</div>
                    <div className="flex-1 min-w-0">
                        <span className="truncate block">{feature.text}</span>
                    </div>
                    {/* Tooltip on hover/focus */}
                    {feature.tooltip && (
                        <span
                            className="pointer-events-none absolute left-1/2 w-full -translate-x-1/2 top-full mt-2 z-30 px-3 py-1.5 rounded-lg bg-gray-900 text-xs text-white opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 shadow-lg whitespace-pre-line"
                            role="tooltip"
                        >
                            {feature.tooltip}
                        </span>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
};

export default memo(HeroFeatures);
