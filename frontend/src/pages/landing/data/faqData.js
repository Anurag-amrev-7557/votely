import React from 'react';

export const categories = [
    {
        id: 'all',
        label: 'All Questions',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                <circle cx="128" cy="128" r="104" fill="url(#allGradient)" />
                <circle cx="128" cy="128" r="88" fill="white" fillOpacity="0.7" />
                <defs>
                    <radialGradient id="allGradient" cx="0.5" cy="0.5" r="0.7">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#1e3a8a" />
                    </radialGradient>
                </defs>
            </svg>
        ),
        color: "from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40",
        tooltip: "Browse all frequently asked questions"
    },
    {
        id: 'security',
        label: 'Security',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                <rect x="32" y="40" width="192" height="176" rx="16" fill="url(#securityGradient)" />
                <circle cx="120" cy="180" r="12" fill="#fff" fillOpacity="0.8" />
                <rect x="104" y="112" width="16" height="32" rx="8" fill="#fff" fillOpacity="0.8" />
                <defs>
                    <linearGradient id="securityGradient" x1="32" y1="40" x2="224" y2="216" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#059669" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        color: "from-green-100 via-green-200 to-green-100 dark:from-green-900/40 dark:via-green-800/30 dark:to-green-900/40",
        tooltip: "Learn about security, privacy, and encryption"
    },
    {
        id: 'features',
        label: 'Features',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                <circle cx="128" cy="128" r="104" fill="url(#featuresGradient)" />
                <path d="M128 72v48h40" stroke="#fff" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                    <linearGradient id="featuresGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#fbbf24" />
                        <stop offset="1" stopColor="#f59e42" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        color: "from-yellow-100 via-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:via-yellow-800/30 dark:to-yellow-900/40",
        tooltip: "Explore platform features and capabilities"
    },
    {
        id: 'pricing',
        label: 'Pricing',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                <circle cx="128" cy="128" r="104" fill="url(#pricingGradient)" />
                <text x="128" y="148" textAnchor="middle" fontSize="48" fontWeight="bold" fill="#fff" fontFamily="Arial">$</text>
                <defs>
                    <linearGradient id="pricingGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#38bdf8" />
                        <stop offset="1" stopColor="#0ea5e9" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        color: "from-sky-100 via-sky-200 to-sky-100 dark:from-sky-900/40 dark:via-sky-800/30 dark:to-sky-900/40",
        tooltip: "Questions about plans, billing, and refunds"
    },
    {
        id: 'support',
        label: 'Support',
        icon: (
            <svg width="24" height="24" fill="none" viewBox="0 0 256 256" aria-hidden="true">
                <circle cx="128" cy="128" r="104" fill="url(#supportGradient)" />
                <path d="M88 168h80v-16a40 40 0 00-80 0v16z" fill="#fff" fillOpacity="0.8" />
                <circle cx="128" cy="120" r="16" fill="#fff" fillOpacity="0.9" />
                <defs>
                    <linearGradient id="supportGradient" x1="24" y1="24" x2="232" y2="232" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#a78bfa" />
                        <stop offset="1" stopColor="#6366f1" />
                    </linearGradient>
                </defs>
            </svg>
        ),
        color: "from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/30 dark:to-purple-900/40",
        tooltip: "Get help and support resources"
    }
];

export const faqs = [
    {
        question: "How does Votely ensure the security of votes?",
        answer: "Votely employs multiple layers of security including end-to-end encryption, blockchain technology, and regular security audits. Each vote is encrypted and can only be decrypted by authorized parties. We also implement multi-factor authentication and DDoS protection to ensure the integrity of the voting process.",
        category: "security",
        tags: ["security", "encryption", "authentication"]
    },
    {
        question: "Is Votely accessible to voters with disabilities?",
        answer: "Yes, Votely is fully accessible and compliant with WCAG 2.1 AA standards. We support screen readers, keyboard navigation, high contrast mode, and text scaling. Our platform is designed to be usable by everyone, regardless of their abilities.",
        category: "features",
        tags: ["accessibility", "compliance", "usability"]
    },
    {
        question: "What support options are available?",
        answer: "We offer various support options including email support, live chat, and priority support for enterprise customers. Our support team is available 24/7 for critical issues, and we provide comprehensive documentation and training resources.",
        category: "support",
        tags: ["support", "help", "documentation"]
    },
    {
        question: "Can I customize the voting interface?",
        answer: "Yes, Votely offers extensive customization options. You can customize the branding, colors, and layout of the voting interface. Enterprise customers can also access our API for deeper integration and customization.",
        category: "features",
        tags: ["customization", "branding", "api"]
    },
    {
        question: "How does the pricing work?",
        answer: "Votely offers flexible pricing plans based on your needs. We have a free plan for small organizations, a standard plan for growing businesses, and enterprise solutions for large organizations. All plans include our core features, with additional capabilities available in higher tiers.",
        category: "pricing",
        tags: ["pricing", "plans", "features"]
    },
    {
        question: "What happens if there's a technical issue during voting?",
        answer: "Votely has built-in redundancy and failover systems to prevent technical issues. In the rare case of an incident, our system automatically saves progress and can resume voting sessions. We also provide real-time monitoring and immediate support response for any issues.",
        category: "support",
        tags: ["technical", "support", "reliability"]
    },
    {
        question: "How is voter privacy protected?",
        answer: "We implement strict privacy measures including anonymous voting options, data encryption, and secure storage. Voter information is never shared with third parties, and we comply with global data protection regulations.",
        category: "security",
        tags: ["privacy", "security", "compliance"]
    },
    {
        question: "Can I get a refund if I'm not satisfied?",
        answer: "Yes, we offer a 30-day money-back guarantee on all paid plans. If you're not satisfied with our service, you can request a full refund within 30 days of your purchase.",
        category: "pricing",
        tags: ["refund", "guarantee", "satisfaction"]
    }
];
