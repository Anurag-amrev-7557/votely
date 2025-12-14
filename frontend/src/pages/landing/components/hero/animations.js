export const featuresContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.18
        }
    }
};

export const featureItem = {
    hidden: { opacity: 0, y: 16, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1 }
};

export const badgesContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.12
        }
    }
};

export const badgeItem = {
    hidden: { opacity: 0, y: 12, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1 }
};
