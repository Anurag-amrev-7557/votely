import { memo, useMemo, useState, useCallback } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import HeroText from './hero/HeroText';
import HeroActions from './hero/HeroActions';
import HeroFeatures from './hero/HeroFeatures';
import HeroSocialProof from './hero/HeroSocialProof';
import HeroImage from './hero/HeroImage';
import ScrollIndicator from './hero/ScrollIndicator';

const HeroSection = ({ isVisible }) => {
  const { isDarkMode } = useTheme();

  // Memoize theme-dependent classes
  const headlineColor = useMemo(() => isDarkMode ? 'text-white' : 'text-gray-900', [isDarkMode]);

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true);
  }, []);

  return (
    <section aria-labelledby="hero-main-heading" role="region" tabIndex={0} className="relative w-full flex flex-col items-center justify-center min-h-[85vh] pb-24">
      <h2 id="hero-main-heading" className="sr-only">Welcome to Votely Hero Section</h2>
      <div className="w-full flex flex-col-reverse @[864px]:flex-row gap-6 @[480px]:gap-8 px-6 py-4 @[480px]:py-8 sm:px-8 transition-all duration-500">
        {/* Text Section */}
        <div className={`flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center flex-1 text-center @[864px]:text-left ${headlineColor}`}>

          <HeroText headlineColor={headlineColor} isVisible={isVisible} />

          {/* Advanced Features Grid */}
          <HeroFeatures />

          <HeroActions />

          <HeroSocialProof />

        </div>

        {/* Advanced Image Section */}
        <HeroImage onImageLoad={handleImageLoad} />
      </div>

      {/* Advanced Scroll Indicator */}
      <ScrollIndicator />
    </section>
  );
};

HeroSection.displayName = 'HeroSection';
export default memo(HeroSection);