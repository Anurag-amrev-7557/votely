import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../context/ThemeContext';

const StarRating = ({ rating }) => (
    <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
            <motion.div 
                key={index} 
                className={`${index < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M234.5,114.38l-45.1,39.36,13.51,58.6a16,16,0,0,1-23.84,17.34l-51.11-31-51,31a16,16,0,0,1-23.84-17.34L66.61,153.8,21.5,114.38a16,16,0,0,1,9.11-28.06l59.46-5.15,23.21-55.36a15.95,15.95,0,0,1,29.44,0h0L166,81.17l59.44,5.15a16,16,0,0,1,9.11,28.06Z"></path>
                </svg>
            </motion.div>
        ))}
    </div>
);

const TestimonialCard = ({ testimonial, isActive }) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`flex flex-col gap-3 sm:gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ${
            isActive ? 'ring-2 ring-blue-500' : ''
        }`}
    >
        <div className="flex items-center gap-3">
            <motion.div
                whileHover={{ scale: 1.1 }}
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 sm:size-12"
                style={{ backgroundImage: `url("${testimonial.avatar}")` }}
            ></motion.div>
            <div className="flex-1">
                <p className="text-gray-900 dark:text-white text-sm sm:text-base font-medium leading-normal">{testimonial.name}</p>
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm font-normal leading-normal">{testimonial.date}</p>
            </div>
        </div>
        <StarRating rating={testimonial.rating} />
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base font-normal leading-normal">{testimonial.content}</p>
        <div className="flex gap-4 sm:gap-6 text-gray-500 dark:text-gray-400">
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs sm:text-sm"
                aria-label="Read full testimonial"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M234,80.12A24,24,0,0,0,216,72H160V56a40,40,0,0,0-40-40,8,8,0,0,0-7.16,4.42L75.06,96H32a16,16,0,0,0-16,16v88a16,16,0,0,0,16,16H204a24,24,0,0,0,23.82-21l12-96A24,24,0,0,0,234,80.12ZM32,112H72v88H32ZM223.94,97l-12,96a8,8,0,0,1-7.94,7H88V105.89l36.71-73.43A24,24,0,0,1,144,56V80a8,8,0,0,0,8,8h64a8,8,0,0,1,7.94,9Z"></path>
                </svg>
                <span>{testimonial.likes}</span>
            </motion.button>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 sm:gap-2 hover:text-red-600 dark:hover:text-red-400 transition-colors text-xs sm:text-sm"
                aria-label="Dislike testimonial"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M239.82,157l-12-96A24,24,0,0,0,204,40H32A16,16,0,0,0,16,56v88a16,16,0,0,0,16,16H75.06l37.78,75.58A8,8,0,0,0,120,240a40,40,0,0,0,40-40V184h56a24,24,0,0,0,23.82-27ZM72,144H32V56H72Zm150,21.29a7.88,7.88,0,0,1-6,2.71H152a8,8,0,0,0-8,8v24a24,24,0,0,1-19.29,23.54L88,150.11V56H204a8,8,0,0,1,7.94,7l12,96A7.87,7.87,0,0,1,222,165.29Z"></path>
                </svg>
                <span>{testimonial.dislikes}</span>
            </motion.button>
        </div>
    </motion.div>
);

const TestimonialForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        content: '',
        rating: 5
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', content: '', rating: 5 });
    };

    return (
        <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm"
            onSubmit={handleSubmit}
        >
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900 dark:text-white">Share Your Experience</h3>
            <div className="space-y-3 sm:space-y-4">
                <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-2 sm:p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <textarea
                    placeholder="Your Testimonial"
                    className="w-full p-2 sm:p-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm sm:text-base"
                    rows="4"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                />
                <div className="flex items-center gap-2">
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Rating:</span>
                    <StarRating rating={formData.rating} />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 sm:py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                    Submit Testimonial
                </motion.button>
            </div>
        </motion.form>
    );
};

const TestimonialSection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [testimonials, setTestimonials] = useState([
        {
            name: "Clara Bennett",
            date: "2023-09-15",
            rating: 5,
            content: "Votely made voting so easy and secure. I felt confident that my vote was counted correctly.",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf3zqVSAUI20IcSizwq8xxXpU4nQtoaK5lbCPcuAahLYtW3EZX7KKE36Vur3NGpet2HH-olWn2OUwPfZUqQj4ot91dOPH2eFWnzWeVz3Nyz7XQ-O767eJ17h4734-E89-bXaxNfXDcdzeuJ5QphBVlT2b1ndLVO4quzPDhknKYCP40E_j5xF6kkQLbz3cbaK16Qt7raRjcmutayWty6zaDLutoeSjEC7gAIjCEsi2ZW9OEJua6yREDT6y1SUTGv1Q7yNscRCTvKp8",
            likes: 10,
            dislikes: 2
        },
        {
            name: "James Wilson",
            date: "2023-09-10",
            rating: 5,
            content: "The accessibility features are outstanding. As someone with visual impairments, I found the platform incredibly easy to use.",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf3zqVSAUI20IcSizwq8xxXpU4nQtoaK5lbCPcuAahLYtW3EZX7KKE36Vur3NGpet2HH-olWn2OUwPfZUqQj4ot91dOPH2eFWnzWeVz3Nyz7XQ-O767eJ17h4734-E89-bXaxNfXDcdzeuJ5QphBVlT2b1ndLVO4quzPDhknKYCP40E_j5xF6kkQLbz3cbaK16Qt7raRjcmutayWty6zaDLutoeSjEC7gAIjCEsi2ZW9OEJua6yREDT6y1SUTGv1Q7yNscRCTvKp8",
            likes: 15,
            dislikes: 1
        },
        {
            name: "Sarah Martinez",
            date: "2023-09-05",
            rating: 4,
            content: "The real-time results feature is fantastic. It's great to see the voting progress as it happens.",
            avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf3zqVSAUI20IcSizwq8xxXpU4nQtoaK5lbCPcuAahLYtW3EZX7KKE36Vur3NGpet2HH-olWn2OUwPfZUqQj4ot91dOPH2eFWnzWeVz3Nyz7XQ-O767eJ17h4734-E89-bXaxNfXDcdzeuJ5QphBVlT2b1ndLVO4quzPDhknKYCP40E_j5xF6kkQLbz3cbaK16Qt7raRjcmutayWty6zaDLutoeSjEC7gAIjCEsi2ZW9OEJua6yREDT6y1SUTGv1Q7yNscRCTvKp8",
            likes: 8,
            dislikes: 3
        }
    ]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handleSubmitTestimonial = (newTestimonial) => {
        setTestimonials([
            {
                ...newTestimonial,
                date: new Date().toISOString().split('T')[0],
                avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf3zqVSAUI20IcSizwq8xxXpU4nQtoaK5lbCPcuAahLYtW3EZX7KKE36Vur3NGpet2HH-olWn2OUwPfZUqQj4ot91dOPH2eFWnzWeVz3Nyz7XQ-O767eJ17h4734-E89-bXaxNfXDcdzeuJ5QphBVlT2b1ndLVO4quzPDhknKYCP40E_j5xF6kkQLbz3cbaK16Qt7raRjcmutayWty6zaDLutoeSjEC7gAIjCEsi2ZW9OEJua6yREDT6y1SUTGv1Q7yNscRCTvKp8",
                likes: 0,
                dislikes: 0
            },
            ...testimonials
        ]);
        setShowForm(false);
    };

    return (
        <section className={`max-w-7xl mx-auto ${sectionBg} transition-all duration-500 will-change-[background-color,color,box-shadow,filter]`} aria-labelledby="testimonial-main-heading" role="region" tabIndex={0}>
            <h2 id="testimonial-main-heading" className="sr-only">User Testimonials</h2>
            <div className="flex flex-col gap-6 sm:gap-8 px-4 py-10 sm:py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:gap-6 text-center max-w-3xl mx-auto"
                >
                    <div
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-500 will-change-[background-color,color,box-shadow] mx-auto"
                        tabIndex={0}
                        role="status"
                        aria-label="Testimonials"
                    >
                        <span
                            className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                            style={{
                                animation: "pulse-orb 2.8s ease-in-out infinite"
                            }}
                            aria-hidden="true"
                        />
                        <svg
                            className="relative z-10 w-5 h-5 text-blue-500 dark:text-blue-300 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                            >
                                <animate
                                    attributeName="opacity"
                                    values="0.7;1;0.7"
                                    dur="2.2s"
                                    repeatCount="indefinite"
                                />
                            </path>
                            <g>
                                <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                                <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                            </g>
                        </svg>
                        <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent text-xs sm:text-sm">
                            Success Stories
                        </span>
                        <div
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                            role="tooltip"
                        >
                            See what our users are saying!
                        </div>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-3 sm:gap-4 text-center max-w-2xl mx-auto"
                    >
                        <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[28px] font-bold leading-tight tracking-[-0.015em] @[480px]:text-3xl">
                            What Our Users Say
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                            Join thousands of satisfied users who trust Votely for their voting needs.
                        </p>
                    </motion.div>
                </motion.div>

                <div className="relative">
                    <div className="relative h-[400px] overflow-visible">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="absolute w-full z-10 px-4 sm:px-0"
                            >
                                <TestimonialCard 
                                    testimonial={testimonials[currentIndex]} 
                                    isActive={true}
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                            className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Previous testimonial"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M168.49,199.51a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,0-17l80-80a12,12,0,0,1,17,17L97,128l71.51,71.51A12,12,0,0,1,168.49,199.51Z"></path>
                            </svg>
                        </motion.button>

                        <div className="flex gap-1.5 sm:gap-2">
                            {testimonials.map((_, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${
                                        index === currentIndex ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                                    onClick={() => setCurrentIndex(index)}
                                    aria-label={`Read full testimonial ${testimonials[index].name}`}
                                />
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
                            className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Next testimonial"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                                <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,0,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>
                            </svg>
                        </motion.button>
                    </div>
                </div>

                <div className="flex justify-center gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                        onClick={() => setShowForm(!showForm)}
                        aria-label={showForm ? 'Hide form' : 'Share your experience'}
                    >
                        {showForm ? 'Hide Form' : 'Share Your Experience'}
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showForm && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="px-4 sm:px-0"
                        >
                            <TestimonialForm onSubmit={handleSubmitTestimonial} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default React.memo(TestimonialSection);