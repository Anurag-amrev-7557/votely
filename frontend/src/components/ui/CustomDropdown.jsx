import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export const CustomDropdown = ({
    options = [],
    value,
    onChange,
    placeholder = "Select an option",
    label,
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle selection
    const handleSelect = (option) => {
        const selectedValue = typeof option === 'string' ? option : option.value;
        onChange(selectedValue);
        setIsOpen(false);
    };

    // Get display text for current value
    const getDisplayValue = () => {
        if (!value) return placeholder;
        const selectedOption = options.find(opt =>
            (typeof opt === 'string' ? opt : opt.value) === value
        );
        if (!selectedOption) return value; // Fallback if regular string value
        return typeof selectedOption === 'string' ? selectedOption : selectedOption.label;
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-zinc-400 mb-1.5" id={`label-${label?.replace(/\s+/g, '-').toLowerCase()}`}>
                    {label}
                </label>
            )}

            {/* Trigger Button */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border transition-all duration-200 ${isOpen
                    ? 'border-gray-900 dark:border-white ring-1 ring-gray-900 dark:ring-white'
                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                    } focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 dark:focus-visible:ring-offset-zinc-900`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? `label-${label?.replace(/\s+/g, '-').toLowerCase()}` : undefined}
                aria-label={!label ? placeholder : undefined}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {Icon && (
                        <Icon className="w-5 h-5 text-gray-400 dark:text-zinc-600 shrink-0" />
                    )}
                    <span className={`text-sm font-medium truncate ${value ? 'text-gray-900 dark:text-white' : 'text-gray-600 font-normal'
                        }`}>
                        {getDisplayValue()}
                    </span>
                </div>
                <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-gray-900 dark:text-white' : ''
                        }`}
                />
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 overflow-hidden bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl ring-1 ring-black/5"
                        role="listbox"
                        tabIndex={-1}
                    >
                        <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                            {options.map((option, index) => {
                                const optValue = typeof option === 'string' ? option : option.value;
                                const optLabel = typeof option === 'string' ? option : option.label;
                                const isSelected = value === optValue;

                                return (
                                    <motion.button
                                        key={index}
                                        type="button"
                                        onClick={() => handleSelect(option)}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors group ${isSelected
                                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-900'
                                            } focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-zinc-900 focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-blue-500`}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <div className="flex items-center gap-2">
                                            {typeof option !== 'string' && option.icon && (
                                                <option.icon className={`w-4 h-4 ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-400 group-hover:text-gray-600 dark:text-zinc-500'
                                                    }`} />
                                            )}
                                            <span>{optLabel}</span>
                                        </div>
                                        {isSelected && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="text-green-500"
                                            >
                                                <Check className="w-4 h-4" />
                                            </motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}

                            {options.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center italic">
                                    No options available
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
