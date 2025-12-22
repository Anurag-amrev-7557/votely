import { memo } from 'react';
import landingHero from '../../../../assets/landing-hero.webp';

const HeroImage = ({ onImageLoad }) => {
    return (
        <div className="flex-1 flex items-center justify-center">
            <img
                src={landingHero}
                alt="Online voting platform hero"
                className="max-w-full h-auto rounded-xl transition-all duration-500 shadow-2xl"
                loading="eager"
                width={500}
                height={400}
                style={{ objectFit: 'cover' }}
                onLoad={onImageLoad}
                decoding="sync"
                fetchpriority="high"
            />
        </div>
    );
};

export default memo(HeroImage);
