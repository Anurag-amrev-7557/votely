import { Suspense, lazy, useState, useEffect, memo } from 'react';
import { useTheme } from '../../context/ThemeContext';

const HeroSection = lazy(() => import('./components/HeroSection'));
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const HowItWorksSection = lazy(() => import('./components/LiveDemoSection'));
const SecuritySection = lazy(() => import('./components/SecuritySection'));
const AccessibilitySection = lazy(() => import('./components/AccessibilitySection'));
const TestimonialSection = lazy(() => import('./components/TestimonialSection'));
const PriceSection = lazy(() => import('./components/PriceSection'));
const FaqSection = lazy(() => import('./components/FaqSection'));
const CallToActionSection = lazy(() => import('./components/CallToActionSection'));

// Add a simple skeleton loader component
const SectionSkeleton = () => (
  <div className="w-full h-48 flex items-center justify-center animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-xl">
    <span className="text-gray-400 dark:text-gray-500 text-lg font-medium">Loading section...</span>
  </div>
);

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        // Fade in the landing page with a slight delay for a smoother UX
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        // Mark as loaded after a slightly longer delay to allow for initial animations
        const loadTimer = setTimeout(() => {
            setIsLoaded(true);
        }, 300);

        // Clean up timers on unmount
        return () => {
            clearTimeout(showTimer);
            clearTimeout(loadTimer);
        };
    }, []);

    return (
        <div className="layout-container flex grow flex-col min-h-screen">
            <div 
                className={`px-4 sm:px-6 lg:px-8 flex justify-center py-5 bg-white dark:bg-gray-900 mt-16 w-full transition-colors duration-300 will-change-[background-color]`}
            >
                <div className="layout-content-container flex flex-col max-w-7xl flex-1">
                    <div className="@container space-y-16 sm:space-y-24">
                        <div className="min-h-[80vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <HeroSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <FeaturesSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div id="how-it-works" className="min-h-[60vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <HowItWorksSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div id="security" className="min-h-[50vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <SecuritySection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div id="accessibility" className="min-h-[50vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <AccessibilitySection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <TestimonialSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div id="pricing" className="min-h-[60vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <PriceSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <FaqSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                        <div className="min-h-[40vh] flex items-center justify-center">
                            <Suspense fallback={<SectionSkeleton />}>
                                <CallToActionSection isVisible={isVisible} />
                            </Suspense>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(LandingPage);