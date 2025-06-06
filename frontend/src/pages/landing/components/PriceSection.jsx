import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PricingFeature = ({ text, included = true }) => (
                                    <div className="text-[13px] font-normal leading-normal flex gap-3 text-gray-600 dark:text-gray-300">
        <div className={`${included ? 'text-green-500' : 'text-gray-400 dark:text-gray-600'}`}>
            {included ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path>
                        </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                        </svg>
            )}
                      </div>
        <span className={!included ? 'text-gray-400 dark:text-gray-600' : ''}>{text}</span>
                    </div>
);

const PricingCard = ({ plan, price, features, isPopular, buttonText, buttonVariant, description, savings }) => (
    <div className={`flex flex-1 flex-col gap-4 rounded-xl border border-solid border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 relative transition-all duration-300 hover:shadow-lg ${
        isPopular ? 'ring-2 ring-blue-500 scale-105' : ''
    } text-center sm:text-left`}>
        {isPopular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Most Popular
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
        <button className={`flex w-full max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 ${
            buttonVariant === 'primary' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        } text-sm font-bold leading-normal tracking-[0.015em] transition-all duration-300 hover:scale-105 mx-auto sm:mx-0`}>
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

const PriceSection = () => {
    const pricingPlans = [
        {
            plan: "Basic",
            price: "Free",
            description: "Perfect for small organizations and testing",
            features: [
                { text: "Up to 100 voters", included: true },
                { text: "Basic security features", included: true },
                { text: "Email support", included: true },
                { text: "Basic analytics", included: true },
                { text: "Single election at a time", included: true },
                { text: "Custom branding", included: false },
                { text: "API access", included: false },
                { text: "Priority support", included: false }
            ],
            isPopular: false,
            buttonText: "Get Started",
            buttonVariant: "secondary"
        },
        {
            plan: "Standard",
            price: "₹7,499",
            description: "Ideal for growing organizations",
            savings: "20% with annual billing",
            features: [
                { text: "Up to 500 voters", included: true },
                { text: "Advanced security features", included: true },
                { text: "Priority email support", included: true },
                { text: "Advanced analytics", included: true },
                { text: "Multiple concurrent elections", included: true },
                { text: "Custom branding", included: true },
                { text: "API access", included: false },
                { text: "Priority support", included: true }
            ],
            isPopular: true,
            buttonText: "Start Free Trial",
            buttonVariant: "primary"
        },
        {
            plan: "Premium",
            price: "₹22,499",
            description: "For large organizations with advanced needs",
            savings: "30% with annual billing",
            features: [
                { text: "Unlimited voters", included: true },
                { text: "Enhanced security features", included: true },
                { text: "Dedicated support", included: true },
                { text: "Enterprise analytics", included: true },
                { text: "Unlimited concurrent elections", included: true },
                { text: "Custom branding", included: true },
                { text: "API access", included: true },
                { text: "Priority support", included: true }
            ],
            isPopular: false,
            buttonText: "Contact Sales",
            buttonVariant: "primary"
        }
    ];

    return (
        <section className="max-w-7xl mx-auto">
            <div className="flex flex-col gap-6 sm:gap-8 px-4 py-10 sm:py-12">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4 sm:gap-6 text-center max-w-3xl mx-auto"
                >
                    {/* Pricing Tag */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-full mx-auto"
                    >
                        <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500 dark:text-blue-400"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <path d="M6 3h12M6 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3" />
                            <path d="M12 7v10" />
                            <path d="M9 10h6" />
                        </motion.svg>
                        <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">
                            Flexible Plans
                        </span>
                    </motion.div>

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

                <div className="flex flex-col items-center gap-6 sm:gap-8 mt-6 sm:mt-8">
                    <div className="flex flex-col items-center gap-3 sm:gap-4 text-center max-w-2xl">
                        <h3 className="text-gray-900 dark:text-white text-lg sm:text-xl font-semibold">
                            Need a Custom Solution?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                            We offer tailored solutions for enterprises with specific requirements. Get in touch with our sales team to discuss your needs.
                    </p>
                  </div>

                    <Link to="/contact">
                        <button className="flex w-full sm:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-11 sm:h-12 px-4 sm:px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:shadow-xl transform transition-all duration-200">
                            <span className="truncate">Contact Sales</span>
                        </button>
                    </Link>
                </div>
              </div>
        </section>
    );
}

export default PriceSection;