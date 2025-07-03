import { Suspense, lazy, useState, useEffect, memo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();

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
        <div className="layout-container flex grow flex-col min-h-screen transition-all duration-500 will-change-[background-color,color,box-shadow,filter]">
            {/* Skip to main content link for keyboard users (Section 508) */}
            <a href="#main-content" className="sr-only focus:not-sr-only absolute top-2 left-2 bg-blue-600 text-white px-4 py-2 rounded z-50" tabIndex="0" aria-label="Skip to main content">Skip to main content</a>
            <div 
                className={`px-4 sm:px-6 lg:px-8 flex justify-center py-5 bg-white dark:bg-gray-900 w-full transition-all duration-500 will-change-[background-color,color,box-shadow,filter]`}
            >
                <div className="layout-content-container flex flex-col max-w-7xl flex-1">
                    <main id="main-content" tabIndex={-1} className="focus:outline-none" role="main" aria-label="Landing page main content">
                        <div className="@container space-y-16 sm:space-y-24">
                            {/* Hero Section */}
                            <div className="min-h-[80vh] flex items-center justify-center" aria-labelledby="hero-heading" role="region" tabIndex="0">
                                <h2 id="hero-heading" className="sr-only">Hero Section</h2>
                                <Suspense fallback={<div className="h-40 flex items-center justify-center" role="status" aria-live="polite">Loading hero...</div>}>
                                    <HeroSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Features Section */}
                            <div className="min-h-[50vh] flex items-center justify-center" aria-labelledby="features-heading" role="region" tabIndex="0">
                                <h2 id="features-heading" className="sr-only">Features</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <FeaturesSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* How It Works Section */}
                            <div id="how-it-works" className="min-h-[60vh] flex items-center justify-center" aria-labelledby="howitworks-heading" role="region" tabIndex="0">
                                <h2 id="howitworks-heading" className="sr-only">How It Works</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <HowItWorksSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Security Section */}
                            <div id="security" className="min-h-[50vh] flex items-center justify-center" aria-labelledby="security-heading" role="region" tabIndex="0">
                                <h2 id="security-heading" className="sr-only">Security</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <SecuritySection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Accessibility Section */}
                            <div id="accessibility" className="min-h-[50vh] flex items-center justify-center" aria-labelledby="accessibility-heading" role="region" tabIndex="0">
                                <h2 id="accessibility-heading" className="sr-only">Accessibility</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <AccessibilitySection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Testimonial Section */}
                            <div className="min-h-[50vh] flex items-center justify-center" aria-labelledby="testimonial-heading" role="region" tabIndex="0">
                                <h2 id="testimonial-heading" className="sr-only">Testimonials</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <TestimonialSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Pricing Section */}
                            <div id="pricing" className="min-h-[60vh] flex items-center justify-center" aria-labelledby="pricing-heading" role="region" tabIndex="0">
                                <h2 id="pricing-heading" className="sr-only">Pricing</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <PriceSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* FAQ Section */}
                            <div className="min-h-[50vh] flex items-center justify-center" aria-labelledby="faq-heading" role="region" tabIndex="0">
                                <h2 id="faq-heading" className="sr-only">Frequently Asked Questions</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <FaqSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                            {/* Call To Action Section */}
                            <div className="min-h-[40vh] flex items-center justify-center" aria-labelledby="cta-heading" role="region" tabIndex="0">
                                <h2 id="cta-heading" className="sr-only">Call To Action</h2>
                                <Suspense fallback={<SectionSkeleton role="status" aria-live="polite" />}> 
                                    <CallToActionSection t={t} isVisible={isVisible} />
                                </Suspense>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default memo(LandingPage);