import { useState, useEffect, memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/LiveDemoSection';
import SecuritySection from './components/SecuritySection';
import AccessibilitySection from './components/AccessibilitySection';
import TestimonialSection from './components/TestimonialSection';
import PriceSection from './components/PriceSection';
import FaqSection from './components/FaqSection';
import CallToActionSection from './components/CallToActionSection';

// Memoize sections to prevent unnecessary re-renders
const MemoizedHeroSection = memo(HeroSection);
const MemoizedFeaturesSection = memo(FeaturesSection);
const MemoizedHowItWorksSection = memo(HowItWorksSection);
const MemoizedSecuritySection = memo(SecuritySection);
const MemoizedAccessibilitySection = memo(AccessibilitySection);
const MemoizedTestimonialSection = memo(TestimonialSection);
const MemoizedPriceSection = memo(PriceSection);
const MemoizedFaqSection = memo(FaqSection);
const MemoizedCallToActionSection = memo(CallToActionSection);

const LandingPage = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const { isDarkMode } = useTheme();

    useEffect(() => {
        // Set initial visibility
        setIsVisible(true);
        
        // Mark as loaded after initial render
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="layout-container flex grow flex-col min-h-screen">
            <div 
                className={`px-4 sm:px-6 lg:px-8 flex justify-center py-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 mt-16 w-full transition-colors duration-300 will-change-[background-color]`}
            >
                <div className="layout-content-container flex flex-col max-w-7xl flex-1">
                    <div className="@container space-y-16 sm:space-y-24">
                        <div className="min-h-[80vh] flex items-center justify-center">
                            <MemoizedHeroSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <MemoizedFeaturesSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <MemoizedHowItWorksSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <MemoizedSecuritySection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <MemoizedAccessibilitySection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <MemoizedTestimonialSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[60vh] flex items-center justify-center">
                            <MemoizedPriceSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <MemoizedFaqSection isVisible={isVisible} />
                        </div>
                        <div className="min-h-[40vh] flex items-center justify-center">
                            <MemoizedCallToActionSection isVisible={isVisible} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(LandingPage);