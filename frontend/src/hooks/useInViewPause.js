import { useState, useEffect, useRef } from 'react';

/**
 * Hook to determine if we should pause animations based on viewport visibility.
 * Returns { startRef, isPaused }
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - 0 to 1, how much needs to be visible
 * @param {string} options.rootMargin - Margin around root
 * @returns {Array} [ref, isPaused]
 */
export const useInViewPause = (options = { threshold: 0.1 }) => {
    const [isPaused, setIsPaused] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            // If not intersecting, we pause (isPaused = true)
            // If intersecting, we play (isPaused = false)
            setIsPaused(!entry.isIntersecting);
        }, options);

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [ref, options.threshold, options.rootMargin]);

    return [ref, isPaused];
};
