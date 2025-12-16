import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';
import {
  BuildingOffice2Icon,
  BuildingOfficeIcon,
  FlagIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  RocketLaunchIcon,
  CpuChipIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
  CheckIcon,
  MinusIcon,
  PlayIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  ServerIcon,
  CloudIcon,
  ShieldExclamationIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  GlobeAmericasIcon,
  CogIcon,
  ChartPieIcon,
  UserPlusIcon,
  KeyIcon,
  EyeIcon,
  DocumentCheckIcon,
  ServerStackIcon,
  WifiIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Enterprise Security",
    description: "Bank-grade security with SOC 2 Type II compliance, end-to-end encryption, and advanced threat protection.",
    benefits: ["Multi-factor authentication", "Role-based access control", "Audit trails", "Compliance reporting"],
    color: "from-red-500 to-pink-600"
  },
  {
    icon: ChartBarIcon,
    title: "Advanced Analytics",
    description: "Comprehensive insights and reporting with real-time dashboards and custom analytics.",
    benefits: ["Real-time voting analytics", "Custom reporting", "Data visualization", "Export capabilities"],
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: UserGroupIcon,
    title: "Team Management",
    description: "Robust user management with hierarchical permissions and team collaboration tools.",
    benefits: ["User provisioning", "Role management", "Team collaboration", "Workflow automation"],
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: GlobeAltIcon,
    title: "Global Deployment",
    description: "Multi-region deployment with 99.9% uptime SLA and global CDN for optimal performance.",
    benefits: ["Multi-region hosting", "Global CDN", "99.9% uptime SLA", "24/7 support"],
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Cog6ToothIcon,
    title: "Custom Integrations",
    description: "Seamless integration with your existing enterprise systems and workflows.",
    benefits: ["API-first architecture", "SSO integration", "Custom workflows", "Third-party tools"],
    color: "from-orange-500 to-red-600"
  },
  {
    icon: DocumentCheckIcon,
    title: "Compliance & Audit",
    description: "Built-in compliance features for regulatory requirements and audit trails.",
    benefits: ["GDPR compliance", "SOX compliance", "Audit logs", "Data retention"],
    color: "from-indigo-500 to-blue-600"
  }
];

const plans = [
  {
    name: "Starter",
    price: "$2,999",
    period: "/month",
    description: "Perfect for growing organizations",
    features: [
      "Up to 10,000 voters",
      "Basic security features",
      "Standard support",
      "Core analytics",
      "Email support",
      "Basic integrations"
    ],
    popular: false,
    color: "from-gray-500 to-gray-600"
  },
  {
    name: "Professional",
    price: "$7,999",
    period: "/month",
    description: "Ideal for established enterprises",
    features: [
      "Up to 100,000 voters",
      "Advanced security suite",
      "Priority support",
      "Advanced analytics",
      "Phone & email support",
      "Custom integrations",
      "SLA guarantees"
    ],
    popular: true,
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large-scale deployments",
    features: [
      "Unlimited voters",
      "Custom security features",
      "Dedicated support",
      "Custom analytics",
      "24/7 phone support",
      "Custom integrations",
      "On-premise option",
      "White-label solution"
    ],
    popular: false,
    color: "from-purple-500 to-pink-600"
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "CTO",
    company: "TechCorp Inc.",
    content: "Votely's enterprise solution transformed our voting process. The security features and analytics are unmatched.",
    rating: 5,
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Head of IT",
    company: "Global Solutions",
    content: "The team management features and compliance reporting have made our governance processes much more efficient.",
    rating: 5,
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Operations Director",
    company: "Innovate Labs",
    content: "Outstanding support and the global deployment options ensure our international teams can vote seamlessly.",
    rating: 5,
    avatar: "ER"
  },
  {
    name: "David Thompson",
    role: "Security Officer",
    company: "SecureBank",
    content: "The compliance features and audit trails give us complete confidence in our voting processes.",
    rating: 5,
    avatar: "DT"
  },
  {
    name: "Lisa Wang",
    role: "VP Engineering",
    company: "TechFlow",
    content: "The API integrations and custom workflows have streamlined our entire decision-making process.",
    rating: 5,
    avatar: "LW"
  },
  {
    name: "Robert Kim",
    role: "IT Director",
    company: "Global Manufacturing",
    content: "24/7 support and the on-premise option made this the perfect solution for our enterprise needs.",
    rating: 5,
    avatar: "RK"
  }
];

const comparisonData = [
  {
    feature: "Voter Capacity",
    starter: "10,000",
    professional: "100,000",
    enterprise: "Unlimited"
  },
  {
    feature: "Security Level",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Custom"
  },
  {
    feature: "Support",
    starter: "Email",
    professional: "Phone + Email",
    enterprise: "24/7 Dedicated"
  },
  {
    feature: "Analytics",
    starter: "Core",
    professional: "Advanced",
    enterprise: "Custom"
  },
  {
    feature: "Integrations",
    starter: "Basic",
    professional: "Custom",
    enterprise: "Full Custom"
  },
  {
    feature: "Compliance",
    starter: "Basic",
    professional: "Advanced",
    enterprise: "Full Suite"
  },
  {
    feature: "SLA",
    starter: "99%",
    professional: "99.5%",
    enterprise: "99.9%"
  },
  {
    feature: "On-Premise",
    starter: "No",
    professional: "No",
    enterprise: "Yes"
  }
];

const faqs = [
  {
    question: "What security certifications does Votely have?",
    answer: "Votely is SOC 2 Type II compliant, GDPR compliant, and follows industry best practices for data protection. We also undergo regular security audits and penetration testing."
  },
  {
    question: "Can we integrate Votely with our existing systems?",
    answer: "Yes! Votely offers comprehensive API access and supports SSO integration with major identity providers. We can also build custom integrations for your specific needs."
  },
  {
    question: "What kind of support do you provide?",
    answer: "Enterprise customers receive dedicated support with guaranteed response times. We offer 24/7 phone support, dedicated account managers, and custom training programs."
  },
  {
    question: "Is on-premise deployment available?",
    answer: "Yes, our Enterprise plan includes on-premise deployment options for organizations with strict data residency requirements or air-gapped environments."
  },
  {
    question: "How do you handle data backup and recovery?",
    answer: "We implement automated daily backups with point-in-time recovery capabilities. Data is encrypted at rest and in transit, with geo-redundant storage for maximum reliability."
  },
  {
    question: "What compliance features are included?",
    answer: "Our platform includes comprehensive audit trails, data retention policies, role-based access control, and compliance reporting for GDPR, SOX, and other regulatory requirements."
  }
];

const stats = [
  { number: "99.9%", label: "Uptime SLA", icon: ServerIcon },
  { number: "24/7", label: "Support", icon: ClockIcon },
  { number: "SOC 2", label: "Compliance", icon: ShieldCheckIcon },
  { number: "50+", label: "Integrations", icon: CogIcon }
];

export default function Enterprise() {
  const [selectedPlan, setSelectedPlan] = useState('professional');
  const [openFaq, setOpenFaq] = useState(null);
  const [showVideo, setShowVideo] = useState(false);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Enhanced Animated Background Elements */}
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
          <motion.div
            className="absolute top-1/2 left-1/4 w-60 h-60 bg-green-400/10 dark:bg-green-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4
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
            {/* Enhanced Badge with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                transition: { duration: 0.3 }
              }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
            >
              {/* Animated icon with glow effect */}
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <BuildingOffice2Icon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <motion.div
                  className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <span className="font-bold text-base">Enterprise Solutions</span>

              {/* Enhanced "New" badge with animation */}
              <motion.div
                className="relative"
                whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.3 }}
              >
                <span className="px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full text-xs font-bold shadow-lg border border-green-300">
                  New
                </span>
                <motion.div
                  className="absolute -inset-1 bg-green-400/30 rounded-full blur-sm"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.8, 0.8, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 180, 360, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.5, 0.7, 1],
                  opacity: [0.6, 0.3, 0.7, 0.6],
                  rotate: [0, -180, -360, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>

            {/* Enhanced Main Heading with Interactive Elements */}
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
                Enterprise-Grade
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative group"
              >
                Voting Platform
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.span>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 shadow-lg"
                animate={{
                  scale: [1, 1.8, 0.8, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 180, 360, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 shadow-lg"
                animate={{
                  scale: [1, 1.5, 0.7, 1],
                  opacity: [0.6, 0.3, 0.7, 0.6],
                  rotate: [0, -180, -360, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.h1>

            {/* Enhanced Subtitle with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative mb-8 max-w-4xl mx-auto"
            >
              <div className="text-lg md:text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                <motion.span
                  className="inline-flex mb-4 items-center gap-1 px-1.5 py-1 bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 text-green-700 dark:text-green-300 rounded-xl font-semibold shadow-sm border border-green-200 dark:border-green-700/50"
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
                  <ShieldCheckIcon className="w-5 h-5" />
                  Secure
                </motion.span>
                ,{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-blue-100 to-indigo-200 dark:from-blue-900/40 dark:to-indigo-800/40 text-blue-700 dark:text-blue-300 rounded-xl font-semibold shadow-sm border border-blue-200 dark:border-blue-700/50"
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
                  <ChartBarIcon className="w-5 h-5" />
                  scalable
                </motion.span>
                , and{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-purple-100 to-violet-200 dark:from-purple-900/40 dark:to-violet-800/40 text-purple-700 dark:text-purple-300 rounded-xl font-semibold shadow-sm border border-purple-200 dark:border-purple-700/50"
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
                  <CheckCircleIcon className="w-5 h-5" />
                  compliant
                </motion.span>
                {' '}voting solutions designed for{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-orange-100 to-amber-200 dark:from-orange-900/40 dark:to-amber-800/40 text-orange-700 dark:text-orange-300 rounded-xl font-semibold shadow-sm border border-orange-200 dark:border-orange-700/50"
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                    rotate: [1, -1]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  <BuildingOfficeIcon className="w-5 h-5" />
                  large organizations
                </motion.span>
                ,{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-red-100 to-rose-200 dark:from-red-900/40 dark:to-rose-800/40 text-red-700 dark:text-red-300 rounded-xl font-semibold shadow-sm border border-red-200 dark:border-red-700/50"
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
                  <FlagIcon className="w-5 h-5" />
                  government agencies
                </motion.span>
                , and{' '}
                <motion.span
                  className="inline-flex items-center gap-1 px-1 py-1 bg-gradient-to-r from-indigo-100 to-blue-200 dark:from-indigo-900/40 dark:to-blue-800/40 text-indigo-700 dark:text-indigo-300 rounded-xl font-semibold shadow-sm border border-indigo-200 dark:border-indigo-700/50"
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
                  <GlobeAltIcon className="w-5 h-5" />
                  enterprises worldwide
                </motion.span>
                .
              </div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-2 -left-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 shadow-lg"
                animate={{
                  scale: [1, 1.5, 0.8, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 180, 360, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-2 -right-2 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 shadow-lg"
                animate={{
                  scale: [1, 1.3, 0.7, 1],
                  opacity: [0.6, 0.3, 0.7, 0.6],
                  rotate: [0, -180, -360, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>

            {/* Enhanced CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <RocketLaunchIcon className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Get Enterprise Demo
                <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => setShowVideo(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <PlayIcon className="w-5 h-5" />
                Watch Demo Video
              </button>
              <button className="group inline-flex items-center gap-3 px-8 py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105">
                <DocumentTextIcon className="w-5 h-5" />
                View Documentation
              </button>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  className="text-center p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Features
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Built for scale, security, and compliance with enterprise-grade features that organizations trust.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-400">
                          <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
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

      {/* Enhanced Pricing Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Enterprise Plans
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the plan that scales with your organization's needs and growth.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${plan.popular
                    ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {plan.period}
                    </span>
                  </div>
                  <div className={`w-16 h-1 bg-gradient-to-r ${plan.color} rounded-full mx-auto`}></div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${plan.popular
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}>
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Comparison Table Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Plan Comparison
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Compare features across all enterprise plans to find the perfect fit.
            </p>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-6 text-left text-lg font-semibold text-gray-900 dark:text-white">Feature</th>
                  <th className="p-6 text-center text-lg font-semibold text-gray-900 dark:text-white">Starter</th>
                  <th className="p-6 text-center text-lg font-semibold text-blue-600 dark:text-blue-400">Professional</th>
                  <th className="p-6 text-center text-lg font-semibold text-gray-900 dark:text-white">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="p-6 font-medium text-gray-900 dark:text-white">{row.feature}</td>
                    <td className="p-6 text-center text-gray-700 dark:text-gray-300">{row.starter}</td>
                    <td className="p-6 text-center text-blue-600 dark:text-blue-400 font-semibold">{row.professional}</td>
                    <td className="p-6 text-center text-gray-700 dark:text-gray-300">{row.enterprise}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Enterprise Leaders
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              See what enterprise customers say about Votely's platform and support.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-semibold">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New FAQ Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Get answers to common questions about our enterprise solutions.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Voting Process?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of organizations that trust Votely for their critical voting needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <RocketLaunchIcon className="w-5 h-5" />
                Start Free Trial
              </Link>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                <PhoneIcon className="w-5 h-5" />
                Schedule Demo
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                <EnvelopeIcon className="w-5 h-5" />
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video Modal */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideo(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <PlayIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-700 dark:text-gray-300">Demo video would be embedded here</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </main>
  );
} 