import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Check, Info, User, Award, FileText, Globe, Twitter, Instagram } from 'lucide-react';
import PropTypes from 'prop-types';

const CandidateDetailView = ({ option, isSelected, onSelect, index, disabled }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ clientX, clientY, currentTarget }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const handleKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            onSelect(option.text);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            onMouseMove={handleMouseMove}
            onClick={() => !disabled && onSelect(option.text)}
            onKeyDown={handleKeyDown}
            role="radio"
            aria-checked={isSelected}
            tabIndex={disabled ? -1 : 0}
            className={`
        group relative w-full overflow-hidden rounded-3xl border transition-all duration-300 isolate
        ${isSelected
                    ? 'border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/10 shadow-xl ring-2 ring-blue-600/20'
                    : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-gray-300 dark:hover:border-zinc-700 hover:shadow-lg'
                }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
        >
            {/* Selection Tab Interaction */}
            <div className={`absolute top-0 right-0 p-0 overflow-hidden transition-all duration-300 ${isSelected ? 'w-24 h-24' : 'w-0 h-0'}`}>
                <div className="absolute top-0 right-0 bg-blue-600 w-[150%] h-[150%] origin-bottom-left rotate-45 transform translate-x-[-20%] translate-y-[-70%] shadow-sm"></div>
                <Check className="absolute top-4 right-4 w-6 h-6 text-white" strokeWidth={3} />
            </div>

            <div className="flex flex-col md:flex-row gap-0 ">

                {/* Left Column: Image & Key Info */}
                <div className="md:w-1/3 min-w-[280px] bg-gray-50 dark:bg-black/20 p-6 flex flex-col items-center text-center gap-4 relative">
                    <div className="relative w-full aspect-[3/4] max-w-[200px] shadow-md rounded-xl overflow-hidden group-hover:shadow-xl transition-all duration-500">
                        {option.image ? (
                            <div className={`
                    w-full h-full transition-all duration-300
                    ${isSelected ? 'ring-4 ring-blue-500' : 'ring-0'}
                  `}>
                                <img
                                    src={option.image}
                                    alt={option.text}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        ) : (
                            <div className={`
                    w-full h-full flex items-center justify-center transition-all duration-300
                    ${isSelected ? 'bg-blue-100 ring-4 ring-blue-500 text-blue-600' : 'bg-gray-200 dark:bg-zinc-800 text-gray-400'}
                  `}>
                                <User className="w-20 h-20" />
                            </div>
                        )}

                        {option.party && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                                {option.party}
                            </div>
                        )}
                    </div>

                    <div className="mt-2 w-full">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
                            {option.text}
                        </h3>
                        {option.role && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{option.role}</p>
                        )}
                    </div>

                    {/* Social Links / Connect (Mock data checks) */}
                    <div className="flex items-center gap-2 mt-auto pt-4 md:pt-0">
                        {option.website && <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Globe className="w-4 h-4" /></button>}
                        {option.twitter && <button className="p-2 text-gray-400 hover:text-[#1DA1F2] transition-colors"><Twitter className="w-4 h-4" /></button>}
                        {option.instagram && <button className="p-2 text-gray-400 hover:text-[#E1306C] transition-colors"><Instagram className="w-4 h-4" /></button>}
                    </div>
                </div>

                {/* Right Column: Detailed Bio/Manifesto */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">

                    {/* Manifesto Section */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-2 text-primary-600 dark:text-primary-400">
                            <FileText className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Biography / Manifesto</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                            {option.description || "No detailed manifesto provided for this candidate. Please review their external campaign materials for more specific policy positions and background information."}
                        </p>
                    </div>

                    {/* Platform / Vision (If data exists, otherwise generic placeholder for "Ultra Detail" feel) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-auto">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Award className="w-4 h-4 text-orange-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Key Focus</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.focus || "Community Leadership"}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-zinc-800">
                            <div className="flex items-center gap-2 mb-1">
                                <Info className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Experience</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {option.experience || "Verified Candidate"}
                            </p>
                        </div>
                    </div>

                    {/* Action Button (Visible on Hover or Selected) */}
                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800 flex justify-end">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                !disabled && onSelect(option.text);
                            }}
                            className={`
                        px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300
                        ${isSelected
                                    ? 'bg-blue-600 text-white shadow-lg pointer-events-none'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'
                                }
                    `}
                        >
                            {isSelected ? 'Candidate Selected' : 'Select Candidate'}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

CandidateDetailView.propTypes = {
    option: PropTypes.object.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onSelect: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
};

export default CandidateDetailView;
