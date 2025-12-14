import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { useTheme } from '../../../context/ThemeContext';

const AnimatedCheckIcon = React.memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="text-green-500 drop-shadow-[0_1px_2px_rgba(34,197,94,0.15)]"
        aria-hidden="true"
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            fill="#dcfce7"
            className="animate-pulse"
            opacity="0.5"
        />
        <path
            d="M7 13l3 3 7-7"
            stroke="#22c55e"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <animate
                attributeName="stroke-dasharray"
                from="0,24"
                to="24,0"
                dur="0.7s"
                fill="freeze"
                begin="0.1s"
            />
        </path>
    </svg>
));

const AnimatedCrossIcon = React.memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        fill="none"
        viewBox="0 0 24 24"
        className="text-gray-400 dark:text-gray-600"
        aria-hidden="true"
    >
        <circle
            cx="12"
            cy="12"
            r="10"
            fill="#f3f4f6"
            className="animate-fade"
            opacity="0.4"
        />
        <path
            d="M8 8l8 8M16 8l-8 8"
            stroke="#9ca3af"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <animate
                attributeName="stroke-dasharray"
                from="0,24"
                to="24,0"
                dur="0.7s"
                fill="freeze"
                begin="0.1s"
            />
        </path>
    </svg>
));

const PricingFeature = ({
    text,
    included = true,
    tooltip = '',
    highlight = false,
    animation = true,
}) => {
    return (
        <div
            className={`relative group/tooltip text-[13px] font-normal leading-normal flex gap-3 items-center transition-all duration-300 ${highlight
                ? 'bg-blue-50 dark:bg-blue-900/30 rounded-lg px-2 py-1 shadow-sm'
                : ''
                }`}
            tabIndex={tooltip ? 0 : -1}
            aria-label={tooltip ? `${text}: ${tooltip}` : text}
        >
            <span
                className={`flex items-center justify-center min-w-[22px] min-h-[22px] ${included
                    ? 'text-green-500'
                    : 'text-gray-400 dark:text-gray-600'
                    }`}
            >
                {included ? (
                    animation ? <AnimatedCheckIcon /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                        </svg>
                    )
                ) : (
                    animation ? <AnimatedCrossIcon /> : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
                    )
                )}
            </span>
            <span
                className={`transition-colors duration-200 ${!included
                    ? 'text-gray-400 dark:text-gray-600 line-through'
                    : highlight
                        ? 'font-semibold text-blue-700 dark:text-blue-300'
                        : 'text-gray-600 dark:text-gray-300'
                    }`}
            >
                {text}
            </span>
            {tooltip && (
                <span className="relative flex items-center ml-1">
                    <svg
                        className="w-4 h-4 text-blue-400 dark:text-blue-300 cursor-pointer"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-3a1 1 0 100 2 1 1 0 000-2zm2 8a1 1 0 01-2 0v-1a1 1 0 012 0v1z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span
                        className="absolute left-1/2 top-full z-20 mt-2 w-max min-w-[180px] max-w-xs px-3 py-2 rounded-lg bg-gray-900/90 text-xs text-white shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-focus/tooltip:opacity-100 group-focus/tooltip:visible transition-all duration-200 pointer-events-none"
                        role="tooltip"
                    >
                        {tooltip}
                    </span>
                </span>
            )}
        </div>
    );
};

const PricingCard = ({ plan, price, features, isPopular, buttonText, buttonVariant, description, savings }) => (
    <div className={`flex flex-1 flex-col gap-4 rounded-xl border border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 relative transition-all duration-300 hover:shadow-lg ${isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
        } text-center sm:text-left`}>
        {isPopular && (
            <div
                className="absolute -top-5 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full shadow-xl bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 dark:from-blue-700 dark:via-blue-600 dark:to-blue-800 text-white text-xs font-extrabold tracking-wide flex items-center gap-2 animate-bounce-slow group transition-all duration-500"
                tabIndex={0}
                role="status"
                aria-label="Most Popular Plan"
            >
                {/* Animated Glow */}
                <span
                    className="absolute -inset-2 rounded-full bg-blue-400/30 dark:bg-blue-700/30 blur-xl pointer-events-none z-0"
                    style={{
                        animation: "pulse-orb 2.5s ease-in-out infinite"
                    }}
                    aria-hidden="true"
                />
                {/* Star Icon with Sparkle Animation */}
                <svg
                    className="relative z-10 w-4 h-4 text-yellow-300 drop-shadow-[0_1px_2px_rgba(253,224,71,0.25)] animate-spin-slow"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                >
                    <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z" />
                </svg>
                <span className="relative z-10 font-bold tracking-wider bg-gradient-to-r from-yellow-200 via-white to-yellow-100 bg-clip-text text-transparent drop-shadow">
                    Most Popular
                </span>
                {/* Tooltip on focus/hover for accessibility */}
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-4 py-2 rounded bg-gray-900/95 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-30"
                    role="tooltip"
                >
                    This plan is chosen by most of our customers for its best value and features!
                </div>
            </div>
        )}
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <h1 className="text-gray-900 dark:text-white text-base font-bold leading-tight">{plan}</h1>
                {isPopular && (
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        Best Value
                    </span>
                )}
            </div>
            <div className="flex items-baseline gap-1 mt-2">
                <span className="text-gray-900 dark:text-white text-3xl font-semibold leading-tight tracking-[-0.033em]">{price}</span>
                <span className="text-gray-600 dark:text-gray-400 text-sm font-medium leading-tight">/election</span>
            </div>
            {savings && (
                <div className="mt-1 flex items-center gap-1 justify-center sm:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="text-green-500">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                    </svg>
                    <span className="text-green-600 dark:text-green-400 text-sm font-medium">
                        Save {savings}
                    </span>
                </div>
            )}
            {description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{description}</p>
            )}
        </div>
        <button className={`flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${buttonVariant === 'primary'
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
            } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 mx-auto sm:mx-0`}
            aria-label={`Choose ${plan} plan`}>
            <span className="truncate">{buttonText}</span>
        </button>
        <div className="flex flex-col gap-2">
            {features.map((feature, index) => (
                <PricingFeature
                    key={index}
                    text={feature.text}
                    included={feature.included}
                />
            ))}
        </div>
        {isPopular && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="text-blue-500">
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm48-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h40A8,8,0,0,1,176,128Z"></path>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">30-day money-back guarantee</span>
                    </p>
                </div>
            </div>
        )}
    </div>
);

// Advanced, extensible, and feature-rich pricing plan configuration
const pricingPlans = [
    {
        plan: "Basic",
        price: "Free",
        priceDetails: {
            currency: "INR",
            amount: 0,
            billingCycle: "per election",
            originalAmount: null,
            discount: null,
        },
        description: "Perfect for small organizations, clubs, and testing. No credit card required.",
        features: [
            { text: "Up to 100 voters", included: true, tooltip: "Invite up to 100 unique voters per election." },
            { text: "Basic security features", included: true, tooltip: "SSL encryption, secure ballot storage." },
            { text: "Email support", included: true, tooltip: "Response within 48 hours." },
            { text: "Basic analytics", included: true, tooltip: "View participation and turnout." },
            { text: "Single election at a time", included: true, tooltip: "Run one election concurrently." },
            { text: "Custom branding", included: false, tooltip: "Add your logo and colors." },
            { text: "API access", included: false, tooltip: "Integrate with your own systems." },
            { text: "Priority support", included: false, tooltip: "Faster response times and onboarding." },
            { text: "End-to-end encryption", included: false, tooltip: "Ballots are encrypted at every stage." },
            { text: "24/7 uptime SLA", included: false, tooltip: "Guaranteed service availability." }
        ],
        isPopular: false,
        badge: null,
        buttonText: "Get Started",
        buttonVariant: "secondary",
        ctaLink: "/signup?plan=basic",
        animation: {
            gradient: "from-gray-100 via-gray-200 to-gray-100 dark:from-gray-900/40 dark:via-gray-800/30 dark:to-gray-900/40",
            icon: "🟢",
        },
        support: {
            type: "Email",
            responseTime: "48h",
        },
        trial: false,
        faqs: [
            {
                question: "Is the Basic plan really free?",
                answer: "Yes! No credit card required. You can upgrade anytime."
            }
        ]
    },
    {
        plan: "Standard",
        price: "₹7,499",
        priceDetails: {
            currency: "INR",
            amount: 7499,
            billingCycle: "per election",
            originalAmount: 9499,
            discount: "20% with annual billing",
        },
        description: "Ideal for growing organizations. Includes advanced features and priority support.",
        savings: "20% with annual billing",
        features: [
            { text: "Up to 500 voters", included: true, tooltip: "Scale up for larger elections." },
            { text: "Advanced security features", included: true, tooltip: "2FA, audit logs, and more." },
            { text: "Priority email support", included: true, tooltip: "Response within 12 hours." },
            { text: "Advanced analytics", included: true, tooltip: "Exportable reports, voter segmentation." },
            { text: "Multiple concurrent elections", included: true, tooltip: "Run up to 5 elections at once." },
            { text: "Custom branding", included: true, tooltip: "Add your logo, colors, and custom domain." },
            { text: "API access", included: false, tooltip: "Upgrade to Premium for API access." },
            { text: "Priority support", included: true, tooltip: "Faster response and onboarding." },
            { text: "End-to-end encryption", included: true, tooltip: "Ballots are encrypted at every stage." },
            { text: "24/7 uptime SLA", included: true, tooltip: "Guaranteed service availability." }
        ],
        isPopular: true,
        badge: {
            text: "Most Popular",
            color: "blue",
            icon: "⭐"
        },
        buttonText: "Start Free Trial",
        buttonVariant: "primary",
        ctaLink: "/signup?plan=standard",
        animation: {
            gradient: "from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40",
            icon: "🔵",
        },
        support: {
            type: "Priority Email",
            responseTime: "12h",
        },
        trial: {
            available: true,
            duration: "14 days",
            note: "No credit card required"
        },
        faqs: [
            {
                question: "Can I upgrade from Basic to Standard?",
                answer: "Yes, you can upgrade at any time and your data will be preserved."
            },
            {
                question: "Is there a free trial?",
                answer: "Yes, enjoy a 14-day free trial with no credit card required."
            }
        ]
    },
    {
        plan: "Premium",
        price: "₹22,499",
        priceDetails: {
            currency: "INR",
            amount: 22499,
            billingCycle: "per election",
            originalAmount: 31999,
            discount: "30% with annual billing",
        },
        description: "For large organizations with advanced needs. Includes all features, integrations, and dedicated support.",
        savings: "30% with annual billing",
        features: [
            { text: "Unlimited voters", included: true, tooltip: "No cap on the number of voters." },
            { text: "Enhanced security features", included: true, tooltip: "SAML SSO, custom roles, advanced audit logs." },
            { text: "Dedicated support", included: true, tooltip: "Personal onboarding and 24/7 support." },
            { text: "Enterprise analytics", included: true, tooltip: "Custom dashboards, API exports." },
            { text: "Unlimited concurrent elections", included: true, tooltip: "Run as many elections as you need." },
            { text: "Custom branding", included: true, tooltip: "Full white-labeling, custom domain, and more." },
            { text: "API access", included: true, tooltip: "RESTful API for full automation and integration." },
            { text: "Priority support", included: true, tooltip: "Dedicated account manager." },
            { text: "End-to-end encryption", included: true, tooltip: "Ballots are encrypted at every stage." },
            { text: "24/7 uptime SLA", included: true, tooltip: "Guaranteed service availability." }
        ],
        isPopular: false,
        badge: {
            text: "Best Value",
            color: "purple",
            icon: "💎"
        },
        buttonText: "Contact Sales",
        buttonVariant: "primary",
        ctaLink: "/contact-sales?plan=premium",
        animation: {
            gradient: "from-purple-100 via-purple-200 to-purple-100 dark:from-purple-900/40 dark:via-purple-800/30 dark:to-purple-900/40",
            icon: "🟣",
        },
        support: {
            type: "Dedicated",
            responseTime: "2h",
            contact: "24/7 hotline, Slack channel"
        },
        trial: {
            available: true,
            duration: "Custom",
            note: "Contact sales for a tailored trial"
        },
        faqs: [
            {
                question: "Can I get a custom quote?",
                answer: "Yes, contact our sales team for volume pricing and custom requirements."
            },
            {
                question: "Is onboarding included?",
                answer: "Yes, a dedicated specialist will guide your team through setup and best practices."
            }
        ],
        enterprise: {
            integrations: [
                "SAML/SSO",
                "Custom API integrations",
                "Audit exports",
                "Custom SLAs"
            ],
            compliance: [
                "GDPR",
                "SOC 2",
                "ISO 27001"
            ]
        }
    }
];

const PriceSection = ({ isVisible }) => {
    const { isDarkMode } = useTheme();
    const sectionBg = useMemo(() => isDarkMode ? 'dark:bg-gray-900' : 'bg-white', [isDarkMode]);

    return (
        <section aria-labelledby="pricing-main-heading" role="region" tabIndex={0}>
            <h2 id="pricing-main-heading" className="sr-only">Pricing Plans</h2>
            <div className={`max-w-7xl mx-auto ${sectionBg} transition-colors duration-300`}>
                <div className="flex flex-col gap-6 sm:gap-8 px-4 py-10 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4 sm:gap-6 text-center max-w-3xl mx-auto"
                    >
                        {/* Advanced Animated Pricing Badge */}
                        <div
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-4 relative group transition-all duration-300 mx-auto"
                            tabIndex={0}
                            role="status"
                            aria-label="Pricing Plans"
                        >
                            {/* Animated Glow Effect */}
                            <span
                                className="absolute -inset-1.5 rounded-full bg-blue-400/20 dark:bg-blue-700/20 blur-xl pointer-events-none z-0"
                                style={{
                                    animation: "pulse-orb 2.8s ease-in-out infinite"
                                }}
                                aria-hidden="true"
                            />
                            {/* Animated Pricing Tag Icon */}
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
                                    d="M6 3h12M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3"
                                >
                                    <animate
                                        attributeName="opacity"
                                        values="0.7;1;0.7"
                                        dur="2.2s"
                                        repeatCount="indefinite"
                                    />
                                </path>
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 7v10"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 10h6"
                                />
                                {/* Sparkle effect */}
                                <g>
                                    <circle className="animate-float-sparkle sparkle-0" cx="19" cy="6" r="1.1" fill="#60a5fa" opacity="0.7" />
                                    <circle className="animate-float-sparkle sparkle-1" cx="6" cy="5" r="0.7" fill="#818cf8" opacity="0.6" />
                                    <circle className="animate-float-sparkle sparkle-2" cx="12" cy="3.5" r="0.6" fill="#a78bfa" opacity="0.5" />
                                </g>
                            </svg>
                            <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent text-xs sm:text-sm">
                                Flexible Plans
                            </span>
                            {/* Tooltip on focus/hover for accessibility */}
                            <div
                                className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                                role="tooltip"
                            >
                                Choose the plan that fits your needs!
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-2 sm:gap-3">
                            <h2 className="text-gray-900 dark:text-white text-2xl sm:text-[32px] font-bold leading-tight tracking-[-0.02em] @[480px]:text-4xl">
                                Simple, Transparent Pricing
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                                Choose the perfect plan for your voting needs. All plans include our core features and are backed by our 30-day money-back guarantee.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 sm:mt-8 mb-10">
                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 justify-center sm:justify-start">
                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-green-600 dark:text-green-400">
                                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">No Hidden Fees</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Transparent pricing</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 justify-center sm:justify-start">
                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-blue-600 dark:text-blue-400">
                                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">Cancel Anytime</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap sm:text-sm">No long-term commitment</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 justify-center sm:justify-start">
                                <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" className="text-purple-600 dark:text-purple-400">
                                        <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="text-gray-900 dark:text-white font-medium text-sm sm:text-base">30-Day Guarantee</span>
                                    <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Risk-free trial</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-4 min-w-0">
                        {pricingPlans.map((plan, index) => (
                            <PricingCard key={index} {...plan} />
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="flex flex-col items-center gap-8 sm:gap-10 mt-8 sm:mt-12 relative z-10"
                    >
                        {/* Animated Glow Background */}
                        <span
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none z-0"
                        >
                            <span className="block absolute left-1/2 top-0 -translate-x-1/2 w-[340px] h-[120px] sm:w-[480px] sm:h-[180px] bg-gradient-to-r from-blue-400/20 via-blue-200/30 to-blue-400/20 blur-2xl rounded-full opacity-70 animate-pulse-orb" />
                        </span>
                        <div className="flex flex-col items-center gap-4 sm:gap-5 text-center max-w-2xl relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold shadow-lg ring-1 ring-blue-200 dark:ring-blue-900/40 mb-2 relative group transition-all duration-300">
                                {/* Animated Icon */}
                                <motion.svg
                                    initial={{ scale: 0.85, rotate: -8 }}
                                    animate={{ scale: [0.85, 1.1, 1], rotate: [-8, 8, 0] }}
                                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 2.8, ease: "easeInOut" }}
                                    className="w-5 h-5 text-blue-500 dark:text-blue-300 drop-shadow-[0_1px_2px_rgba(59,130,246,0.15)]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 19v-6m0 0l-3 3m3-3l3 3M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0Z"
                                    />
                                    {/* Sparkle */}
                                    <motion.circle
                                        className="origin-center"
                                        cx="19"
                                        cy="7"
                                        r="1"
                                        fill="#60a5fa"
                                        opacity="0.7"
                                        animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                        transition={{ repeat: Infinity, duration: 2.2, delay: 0.5, repeatType: "reverse" }}
                                    />
                                </motion.svg>
                                <span className="relative z-10 font-semibold tracking-wide bg-gradient-to-r from-blue-700 via-blue-500 to-blue-400 dark:from-blue-300 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent">
                                    Enterprise & Custom
                                </span>
                                {/* Tooltip on focus/hover for accessibility */}
                                <div
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-gray-900/90 text-xs text-white shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-200 z-20"
                                    role="tooltip"
                                >
                                    Advanced solutions for unique needs.
                                </div>
                            </div>
                            <h3 className="text-gray-900 dark:text-white text-xl sm:text-2xl font-bold leading-tight tracking-[-0.015em]">
                                Need a Custom Solution?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                                Unlock the full potential of Votely with bespoke features, integrations, and support. Our team partners with organizations of all sizes to deliver secure, scalable, and compliant voting solutions tailored to your exact requirements.
                            </p>
                            <ul className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-2 text-sm sm:text-base">
                                <li className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l4 4L15 7" /></svg>
                                    SSO & Custom Auth
                                </li>
                                <li className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l4 4L15 7" /></svg>
                                    Dedicated Support
                                </li>
                                <li className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l4 4L15 7" /></svg>
                                    Custom Integrations
                                </li>
                                <li className="flex items-center gap-1 px-2 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l4 4L15 7" /></svg>
                                    Advanced Security
                                </li>
                            </ul>
                        </div>
                        <Link to="/contact" tabIndex={-1} className="relative z-10">
                            <motion.button
                                whileHover={{ scale: 1.045, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)" }}
                                whileTap={{ scale: 0.97 }}
                                className="flex w-full sm:w-auto min-w-[120px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 sm:h-14 px-5 sm:px-7 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-600 text-white text-base sm:text-lg font-bold leading-normal tracking-[0.015em] shadow-xl hover:shadow-2xl transform transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2"
                                aria-label="Contact Sales for Custom Solution"
                            >
                                <span className="truncate flex items-center gap-2">
                                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7.79a2 2 0 0 0 1.42-.59l5.2-5.2a2 2 0 0 0 .59-1.42Z" /></svg>
                                    Contact Sales
                                </span>
                            </motion.button>
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center max-w-xs">
                            Response within 1 business day. <span className="inline-block align-middle animate-pulse text-blue-400">●</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

PriceSection.displayName = 'PriceSection';
export default React.memo(PriceSection);