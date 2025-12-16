import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, Check } from 'lucide-react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    isToday,
    setHours,
    setMinutes,
    isBefore,
    isAfter,
    isValid,
    parseISO
} from 'date-fns';

export const CustomDateTimePicker = ({
    value,
    onChange,
    label,
    name, // Add name prop
    min,
    max,
    required = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const popupRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, left: 0, width: 0, placement: 'bottom' });

    // Parse initial value or default to now
    const initialDate = value ? new Date(value) : new Date();

    // State for the picker
    const [viewDate, setViewDate] = useState(isValid(initialDate) ? initialDate : new Date());
    const [selectedDate, setSelectedDate] = useState(isValid(initialDate) ? initialDate : null);
    const [is24Hour, setIs24Hour] = useState(false);
    const [period, setPeriod] = useState(isValid(initialDate) ? (parseInt(format(initialDate, 'H')) >= 12 ? 'PM' : 'AM') : 'AM');
    const [time, setTime] = useState({
        hours: isValid(initialDate) ? format(initialDate, is24Hour ? 'HH' : 'hh') : (is24Hour ? '12' : '12'),
        minutes: isValid(initialDate) ?
            String(Math.round(parseInt(format(initialDate, 'mm')) / 5) * 5).padStart(2, '0') : '00'
    });

    // Calculate position logic
    useLayoutEffect(() => {
        if (isOpen && containerRef.current) {
            const updatePosition = () => {
                const rect = containerRef.current.getBoundingClientRect();
                const POPUP_HEIGHT = 400;
                const spaceBelow = window.innerHeight - rect.bottom;

                let placement = 'bottom';
                // For fixed portal, we use viewport coordinates directly
                let top = rect.bottom + 8;

                if (spaceBelow < POPUP_HEIGHT && rect.top > POPUP_HEIGHT) {
                    placement = 'top';
                    top = rect.top - 8;
                }

                setPosition({
                    top: top, // Viewport relative
                    left: rect.left, // Viewport relative
                    width: rect.width,
                    placement
                });
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen]);


    // Reset internal state when value prop changes externally
    useEffect(() => {
        if (value) {
            const date = new Date(value);
            if (isValid(date)) {
                setSelectedDate(date);
                setViewDate(date);
                setTime({
                    hours: format(date, is24Hour ? 'HH' : 'hh'),
                    minutes: format(date, 'mm')
                });
                setPeriod(parseInt(format(date, 'H')) >= 12 ? 'PM' : 'AM');
            }
        }
    }, [value]);

    // Close when clicking outside - Note: Logic needs to handle portal clicks too
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if click is inside container (trigger) OR inside popup (portal)
            const isInsideTrigger = containerRef.current && containerRef.current.contains(event.target);
            const isInsidePopup = document.getElementById('datetime-picker-portal')?.contains(event.target);

            if (!isInsideTrigger && !isInsidePopup) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Calendar Logic
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate
    });

    const handleDayClick = (day) => {
        const newDate = new Date(day);
        // Preserve current time selection
        newDate.setHours(parseInt(time.hours), parseInt(time.minutes));

        setSelectedDate(newDate);
    };

    const handleTimeChange = (type, val) => {
        let newTime = { ...time, [type]: val };
        setTime(newTime);

        if (selectedDate) {
            const newDate = new Date(selectedDate);
            let hours = parseInt(newTime.hours);

            if (!is24Hour) {
                if (period === 'PM' && hours !== 12) hours += 12;
                if (period === 'AM' && hours === 12) hours = 0;
            }

            newDate.setHours(hours, parseInt(newTime.minutes));
            setSelectedDate(newDate);
        }
    };

    const toggleFormat = () => {
        const newIs24Hour = !is24Hour;
        setIs24Hour(newIs24Hour);

        // Convert current display time
        let currentHours = parseInt(time.hours);
        if (newIs24Hour) {
            // 12h -> 24h
            if (period === 'PM' && currentHours !== 12) currentHours += 12;
            if (period === 'AM' && currentHours === 12) currentHours = 0;
        } else {
            // 24h -> 12h
            const isPM = currentHours >= 12;
            setPeriod(isPM ? 'PM' : 'AM');
            if (currentHours > 12) currentHours -= 12;
            if (currentHours === 0) currentHours = 12;
        }
        setTime(prev => ({ ...prev, hours: String(currentHours).padStart(2, '0') }));
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            let hours = parseInt(time.hours);
            if (newPeriod === 'PM' && hours !== 12) hours += 12;
            if (newPeriod === 'AM' && hours === 12) hours = 0;
            newDate.setHours(hours, parseInt(time.minutes));
            setSelectedDate(newDate);
        }
    };

    const handleApply = () => {
        if (selectedDate) {
            const formatted = format(selectedDate, "yyyy-MM-dd'T'HH:mm");
            onChange({
                target: {
                    name: name || (label ? label.toLowerCase().replace(/\s/g, '') : 'datetime'), // Use name if provided
                    value: formatted // Pass full formatted string
                }
            });
        }
        setIsOpen(false);
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        setSelectedDate(null);
        onChange({
            target: {
                name: name || (label ? label.toLowerCase().replace(/\s/g, '') : 'datetime'),
                value: ''
            }
        });
    };

    const hours = Array.from({ length: is24Hour ? 24 : 12 }, (_, i) => {
        const val = is24Hour ? i : i + 1;
        return val.toString().padStart(2, '0');
    });
    const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));

    return (
        <div className="relative w-full" ref={containerRef}>
            {label && (
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            {/* Trigger Button */}
            <motion.button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-900 border transition-all duration-200 ${isOpen || value
                    ? 'border-gray-900 dark:border-white ring-1 ring-gray-900 dark:ring-white'
                    : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                    } focus:outline-none`}
            >
                <div className="flex items-center gap-3">
                    <CalendarIcon className={`w-5 h-5 shrink-0 ${value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-zinc-600'}`} />
                    <span className={`text-sm font-medium ${value ? 'text-gray-900 dark:text-white' : 'text-gray-500 font-normal'}`}>
                        {value ? format(new Date(value), 'PPP p') : 'Select Date & Time'}
                    </span>
                </div>
                {value ? (
                    <div
                        onClick={clearSelection}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-500" />
                    </div>
                ) : (
                    <div className="p-1">
                        <Clock className="w-4 h-4 text-gray-400 opacity-50" />
                    </div>
                )}
            </motion.button>

            {/* Styled Popup using Portal */}
            {createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div
                            id="datetime-picker-portal"
                            className="fixed inset-0 z-[9999] pointer-events-none"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: position.placement === 'top' ? 8 : -8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: position.placement === 'top' ? 8 : -8, scale: 0.96 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                    position: 'absolute', // Relative to the fixed container
                                    top: position.placement === 'top' ? 'auto' : position.top,
                                    bottom: position.placement === 'top' ? (window.innerHeight - position.top) : 'auto',
                                    left: position.left,
                                    minWidth: '320px',
                                    pointerEvents: 'auto'
                                }}
                                className={`
                    p-0 bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl ring-1 ring-black/5
                    ${position.placement === 'top' ? 'origin-bottom-left' : 'origin-top-left'}
                  `}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-zinc-800 rounded-t-2xl">
                                    <button type="button" onClick={() => setViewDate(subMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                    <span className="font-bold text-gray-900 dark:text-white transition-all">
                                        {format(viewDate, 'MMMM yyyy')}
                                    </span>
                                    <button type="button" onClick={() => setViewDate(addMonths(viewDate, 1))} className="p-1 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg">
                                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>

                                <div className="p-4">
                                    {/* Day Names */}
                                    <div className="grid grid-cols-7 mb-2">
                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                            <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Days Grid */}
                                    <div className="grid grid-cols-7 gap-1 mb-4">
                                        {calendarDays.map((mobileDay, idx) => {
                                            const isSelected = selectedDate && isSameDay(mobileDay, selectedDate);
                                            const isCurrentMonth = isSameMonth(mobileDay, viewDate);
                                            const isMobileToday = isToday(mobileDay);

                                            let isDisabled = false;
                                            if (min && isBefore(mobileDay, new Date(min)) && !isSameDay(mobileDay, new Date(min))) isDisabled = true;

                                            return (
                                                <button
                                                    key={idx}
                                                    type="button"
                                                    disabled={isDisabled}
                                                    onClick={() => !isDisabled && handleDayClick(mobileDay)}
                                                    className={`
                                h-9 w-9 rounded-full flex items-center justify-center text-sm transition-all relative
                                ${isDisabled ? 'opacity-20 cursor-not-allowed text-gray-400' : 'hover:scale-110'}
                                ${isSelected
                                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black font-bold shadow-lg'
                                                            : isCurrentMonth
                                                                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800'
                                                                : 'text-gray-300 dark:text-zinc-700'
                                                        }
                                ${!isSelected && isMobileToday ? 'ring-1 ring-gray-900 dark:ring-white ring-inset' : ''}
                              `}
                                                >
                                                    {format(mobileDay, 'd')}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="h-px bg-gray-100 dark:bg-zinc-800 my-4" />

                                    {/* Time Selector - Redesigned */}
                                    <div className="flex justify-center mb-2">
                                        <div className="inline-flex items-center p-1 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800">
                                            <div className="flex items-center">
                                                <TimeSelect
                                                    value={time.hours}
                                                    onChange={(val) => handleTimeChange('hours', val)}
                                                    options={hours}
                                                />
                                                <span className="text-gray-300 dark:text-zinc-700 font-bold px-1">:</span>
                                                <TimeSelect
                                                    value={time.minutes}
                                                    onChange={(val) => handleTimeChange('minutes', val)}
                                                    options={minutes}
                                                />
                                            </div>

                                            {!is24Hour && (
                                                <>
                                                    <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700 mx-2" />
                                                    <TimeSelect
                                                        value={period}
                                                        onChange={(val) => handlePeriodChange(val)}
                                                        options={['AM', 'PM']}
                                                    />
                                                </>
                                            )}

                                            <div className="w-px h-4 bg-gray-200 dark:bg-zinc-700 mx-2" />

                                            <button
                                                onClick={toggleFormat}
                                                className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                            >
                                                {is24Hour ? '24H' : '12H'}
                                            </button>
                                        </div>
                                    </div>
                                </div>



                                {/* Footer */}
                                <div className="p-3 bg-gray-50 dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-2 rounded-b-2xl">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApply}
                                        disabled={!selectedDate}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${selectedDate
                                            ? 'bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-105 shadow-md'
                                            : 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Check className="w-3 h-3" />
                                        Apply
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )
                    }
                </AnimatePresence >,
                document.body
            )}
        </div >
    );
};

const TimeSelect = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-[46px] px-0 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-base font-bold text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-zinc-700 tabular-nums"
            >
                {value}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-20 max-h-48 overflow-y-auto custom-scrollbar bg-white dark:bg-[#111] border border-gray-100 dark:border-zinc-800 rounded-xl shadow-xl z-50 py-1"
                    >
                        {options.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-center py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 ${value === opt ? 'text-gray-900 dark:text-white bg-gray-50 dark:bg-zinc-900 font-bold' : 'text-gray-500 dark:text-zinc-500'
                                    }`}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
