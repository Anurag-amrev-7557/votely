import { motion } from 'framer-motion';
import { 
  StarIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  PlayIcon,
  BookOpenIcon,
  CodeBracketIcon,
  TrophyIcon,
  MegaphoneIcon,
  UserGroupIcon,
  GlobeAltIcon,
  CalendarIcon,
  MapPinIcon,
  LightBulbIcon,
  UsersIcon,
  ShieldCheckIcon,
  ClockIcon
} from '../../components/ui/icons';

import { 
  AcademicCapIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  CogIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Custom icons for partner tiers
const CrownIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const DiamondIcon = ({ className = "w-6 h-6", ...props }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const partnerTiers = [
  {
    name: 'Bronze Partner',
    description: 'Perfect for small agencies and consultants',
    requirements: ['5+ successful implementations', 'Basic certification', 'Active community participation'],
    benefits: [
      'Partner badge and listing',
      'Basic marketing materials',
      'Community forum access',
      'Quarterly partner calls'
    ],
    icon: StarIcon,
    color: 'from-amber-500 to-orange-600'
  },
  {
    name: 'Silver Partner',
    description: 'Ideal for growing agencies and system integrators',
    requirements: ['15+ successful implementations', 'Advanced certification', 'Dedicated support contact'],
    benefits: [
      'Enhanced partner badge',
      'Custom marketing materials',
      'Priority support access',
      'Monthly partner calls',
      'Co-marketing opportunities',
      'Early access to features'
    ],
    icon: TrophyIcon,
    color: 'from-gray-400 to-gray-600'
  },
  {
    name: 'Gold Partner',
    description: 'For established enterprise solution providers',
    requirements: ['50+ successful implementations', 'Expert certification', 'Dedicated account manager'],
    benefits: [
      'Premium partner badge',
      'Custom integrations support',
      '24/7 priority support',
      'Weekly partner calls',
      'Exclusive events access',
      'Revenue sharing program',
      'Custom training programs'
    ],
    icon: CrownIcon,
    color: 'from-yellow-500 to-amber-600'
  },
  {
    name: 'Platinum Partner',
    description: 'For strategic enterprise partners',
    requirements: ['100+ successful implementations', 'Strategic partnership agreement', 'Executive sponsorship'],
    benefits: [
      'Exclusive partner badge',
      'Custom development support',
      'Dedicated technical team',
      'Strategic planning sessions',
      'Exclusive partner events',
      'Revenue sharing program',
      'Custom training programs',
      'Joint go-to-market initiatives'
    ],
    icon: DiamondIcon,
    color: 'from-purple-500 to-pink-600'
  }
];

const currentPartners = [
  {
    name: 'TechCorp Solutions',
    tier: 'Gold',
    logo: 'TC',
    industry: 'System Integration',
    location: 'San Francisco, CA',
    specialties: ['Enterprise', 'Healthcare', 'Education'],
    description: 'Leading system integrator specializing in enterprise voting solutions for healthcare and educational institutions.'
  },
  {
    name: 'Digital Democracy Inc.',
    tier: 'Silver',
    logo: 'DD',
    industry: 'Consulting',
    location: 'Washington, DC',
    specialties: ['Government', 'Non-profit', 'Compliance'],
    description: 'Specialized consulting firm focused on digital transformation for government and non-profit organizations.'
  },
  {
    name: 'SecureVote Systems',
    tier: 'Bronze',
    logo: 'SV',
    industry: 'Technology',
    location: 'Austin, TX',
    specialties: ['Security', 'Fintech', 'Startups'],
    description: 'Innovative technology company building secure voting solutions for fintech and startup ecosystems.'
  },
  {
    name: 'Global Integration Partners',
    tier: 'Platinum',
    logo: 'GI',
    industry: 'Enterprise Solutions',
    location: 'New York, NY',
    specialties: ['Enterprise', 'Global', 'Multi-national'],
    description: 'Global enterprise solutions provider with expertise in multi-national voting implementations.'
  }
];

const partnershipBenefits = [
  {
    title: 'Revenue Opportunities',
    description: 'Earn competitive commissions and revenue sharing on successful implementations',
    icon: CurrencyDollarIcon,
    color: 'from-green-500 to-emerald-600'
  },
  {
    title: 'Technical Support',
    description: 'Access to our technical team for implementation support and custom integrations',
    icon: CodeBracketIcon,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    title: 'Marketing Support',
    description: 'Co-marketing opportunities, case studies, and marketing materials',
    icon: MegaphoneIcon,
    color: 'from-purple-500 to-pink-600'
  },
  {
    title: 'Training & Certification',
    description: 'Comprehensive training programs and certification paths for your team',
    icon: AcademicCapIcon,
    color: 'from-orange-500 to-red-600'
  },
  {
    title: 'Early Access',
    description: 'Get early access to new features and product roadmap insights',
    icon: RocketLaunchIcon,
    color: 'from-indigo-500 to-purple-600'
  },
  {
    title: 'Community Access',
    description: 'Join our exclusive partner community and networking events',
    icon: UsersIcon,
    color: 'from-teal-500 to-cyan-600'
  }
];

export default function Partners() {
  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 dark:bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Enhanced Partnership Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                rotate: [0, 2, -2, 0]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <UserGroupIcon className="w-5 h-5" />
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="relative z-10">Partnership Program</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block"
              >
                Votely
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative"
              >
                Partners
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative mb-8 max-w-4xl mx-auto"
            >
              <div className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Join our{' '}
                <motion.span
                  className="inline-flex mb-4 items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 rounded-xl font-semibold shadow-sm border border-blue-200 dark:border-blue-700/50"
                  whileHover={{ 
                    scale: 1.08, 
                    y: -3,
                    rotate: [-2, 2]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <GlobeAltIcon className="w-5 h-5" />
                  global network
                </motion.span>
                {' '}of partners and help organizations worldwide implement{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 rounded-xl font-semibold shadow-sm border border-green-200 dark:border-green-700/50"
                  whileHover={{ 
                    scale: 1.08, 
                    y: -3,
                    rotate: [2, -2]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <ShieldCheckIcon className="w-5 h-5" />
                  secure
                </motion.span>
                ,{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 rounded-xl font-semibold shadow-sm border border-purple-200 dark:border-purple-700/50"
                  whileHover={{ 
                    scale: 1.08, 
                    y: -3,
                    rotate: [-1, 1]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ 
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <TrophyIcon className="w-5 h-5" />
                  transparent
                </motion.span>
                {' '}voting solutions.
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <UserGroupIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Become a Partner
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105">
                <BookOpenIcon className="w-5 h-5" />
                Partner Resources
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Partnership Benefits Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Partner with Votely?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join a growing ecosystem of trusted partners worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnershipBenefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Tiers Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Partner Tiers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Choose the partnership level that fits your business
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${tier.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <tier.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tier.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {tier.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Requirements:</h4>
                    <ul className="space-y-1">
                      {tier.requirements.map((req, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Benefits:</h4>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Partners Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Partners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Meet some of our trusted partners worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {partner.logo}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {partner.name}
                </h3>
                <p className={`text-sm font-medium mb-2 ${
                  partner.tier === 'Platinum' ? 'text-purple-600 dark:text-purple-400' :
                  partner.tier === 'Gold' ? 'text-yellow-600 dark:text-yellow-400' :
                  partner.tier === 'Silver' ? 'text-gray-600 dark:text-gray-400' :
                  'text-amber-600 dark:text-amber-400'
                }`}>
                  {partner.tier} Partner
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {partner.industry}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                  {partner.location}
                </p>
                <div className="flex flex-wrap gap-1 justify-center mb-4">
                  {partner.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-xs">
                  {partner.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Become a Partner Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How to Become a Partner
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple steps to join our partner program
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Apply
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Submit your partnership application with company details and experience
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Review
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Our team reviews your application and determines the appropriate tier
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Onboard
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Complete training and certification to get started with implementations
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Grow
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Start implementing solutions and grow your partnership benefits
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Partner with Votely?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join our global network of partners and help organizations implement secure voting solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                <UserGroupIcon className="w-5 h-5" />
                Apply Now
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                <BookOpenIcon className="w-5 h-5" />
                Partner Resources
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 