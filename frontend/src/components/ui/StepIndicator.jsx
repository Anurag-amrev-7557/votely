import React from 'react';
import { motion } from 'framer-motion';

export const StepIndicator = ({ steps, currentStep }) => {
    return (
        <div className="w-full">
            <div className="flex w-full gap-2">
                {steps.map((step, index) => {
                    const isCompleted = currentStep > index;
                    const isCurrent = currentStep === index;
                    const isActive = isCompleted || isCurrent;

                    return (
                        <div key={index} className="flex-1 flex flex-col gap-2 group cursor-default">
                            {/* Segment Bar */}
                            <div className="relative h-1.5 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-gray-900 dark:bg-white"
                                    initial={{ x: '-100%' }}
                                    animate={{
                                        x: isActive ? '0%' : '-100%'
                                    }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>

                            {/* Label */}
                            <motion.span
                                animate={{
                                    opacity: isActive ? 1 : 0.4,
                                    y: isActive ? 0 : 2
                                }}
                                className={`
                                    text-[10px] font-bold uppercase tracking-wider truncate transition-colors duration-300
                                    ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-600'}
                                `}
                            >
                                {step}
                            </motion.span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
