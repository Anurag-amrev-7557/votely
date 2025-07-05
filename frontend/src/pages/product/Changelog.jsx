import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  BugIcon, 
  WrenchScrewdriverIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  MinusIcon,
  ArrowUpIcon,
  FireIcon,
  StarIcon,
  RocketLaunchIcon,
  ShieldCheckIcon
} from '../../components/ui/icons';

const versions = [
  {
    version: "2.1.0",
    date: "2025-01-15",
    type: "major",
    title: "Enterprise Security Suite",
    description: "Major security enhancements and enterprise features",
    changes: {
      new: [
        "Advanced role-based access control (RBAC)",
        "Multi-factor authentication (MFA) for all users",
        "Audit trail and compliance reporting",
        "Enterprise SSO integration (SAML, OAuth)",
        "Custom branding and white-label options"
      ],
      improved: [
        "Enhanced encryption algorithms (AES-256)",
        "Improved performance for large-scale voting",
        "Better mobile responsiveness",
        "Streamlined user onboarding process"
      ],
      fixed: [
        "Fixed rare race condition in vote counting",
        "Resolved accessibility issues in dark mode",
        "Fixed email notification delivery delays"
      ]
    },
    highlights: ["Security", "Enterprise", "Performance"]
  },
  {
    version: "2.0.5",
    date: "2024-12-20",
    type: "patch",
    title: "Performance & Stability",
    description: "Performance improvements and bug fixes",
    changes: {
      improved: [
        "Reduced page load times by 40%",
        "Optimized database queries",
        "Enhanced caching mechanisms"
      ],
      fixed: [
        "Fixed memory leak in analytics dashboard",
        "Resolved intermittent connection issues",
        "Fixed vote validation edge cases"
      ]
    },
    highlights: ["Performance", "Stability"]
  },
  {
    version: "2.0.0",
    date: "2024-11-10",
    type: "major",
    title: "Votely 2.0 - Complete Platform Overhaul",
    description: "Complete redesign with new features and improved UX",
    changes: {
      new: [
        "Completely redesigned user interface",
        "Real-time voting analytics dashboard",
        "Advanced poll creation wizard",
        "Mobile app for iOS and Android",
        "API v2 with comprehensive documentation",
        "Webhook support for integrations"
      ],
      improved: [
        "10x faster vote processing",
        "Enhanced accessibility (WCAG 2.1 AA)",
        "Improved internationalization support",
        "Better error handling and user feedback"
      ],
      breaking: [
        "API v1 deprecated - migration guide available",
        "Updated authentication flow",
        "Changed database schema structure"
      ]
    },
    highlights: ["Major", "Redesign", "API"]
  },
  {
    version: "1.8.3",
    date: "2024-10-05",
    type: "patch",
    title: "Security Update",
    description: "Critical security patches and improvements",
    changes: {
      improved: [
        "Enhanced input validation",
        "Improved session management",
        "Updated security headers"
      ],
      fixed: [
        "Fixed XSS vulnerability in comment system",
        "Resolved CSRF token validation issue",
        "Fixed privilege escalation bug"
      ]
    },
    highlights: ["Security", "Critical"]
  },
  {
    version: "1.8.0",
    date: "2024-09-15",
    type: "minor",
    title: "Analytics & Reporting",
    description: "New analytics features and reporting capabilities",
    changes: {
      new: [
        "Advanced voting analytics dashboard",
        "Custom report builder",
        "Export functionality (PDF, CSV, Excel)",
        "Real-time voting statistics",
        "Voter engagement metrics"
      ],
      improved: [
        "Enhanced data visualization",
        "Better performance for large datasets",
        "Improved report generation speed"
      ],
      fixed: [
        "Fixed chart rendering issues",
        "Resolved data export formatting problems"
      ]
    },
    highlights: ["Analytics", "Reporting"]
  }
];

const getTypeIcon = (type) => {
  switch (type) {
    case 'major':
      return <RocketLaunchIcon className="w-5 h-5 text-purple-500" />;
    case 'minor':
      return <PlusIcon className="w-5 h-5 text-blue-500" />;
    case 'patch':
      return <WrenchScrewdriverIcon className="w-5 h-5 text-green-500" />;
    default:
      return <SparklesIcon className="w-5 h-5 text-gray-500" />;
  }
};

const getTypeColor = (type) => {
  switch (type) {
    case 'major':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700';
    case 'minor':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
    case 'patch':
      return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700';
  }
};

export default function Changelog() {
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
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8"
            >
              <SparklesIcon className="w-4 h-4" />
              Product Updates
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Changelog
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                & Updates
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto"
            >
              Stay up to date with the latest features, improvements, and fixes in Votely. 
              We're constantly working to make your voting experience better.
            </motion.p>

            {/* Current Version Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 rounded-full text-lg font-semibold"
            >
              <StarIcon className="w-5 h-5" />
              Current Version: 2.1.0
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Legend Section */}
      <section className="py-8 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Version Types
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <RocketLaunchIcon className="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Major</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Breaking changes, new features</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <PlusIcon className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Minor</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New features, improvements</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <WrenchScrewdriverIcon className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Patch</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bug fixes, security updates</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Changelog Timeline */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-gray-300 dark:to-gray-600" />

            {versions.map((version, index) => (
              <motion.div
                key={version.version}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-12"
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 w-4 h-4 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full z-10" />

                {/* Version Card */}
                <div className="ml-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getTypeColor(version.type)}`}>
                          {version.type.toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            v{version.version}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(version.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(version.type)}
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {version.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {version.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {version.description}
                      </p>
                    </div>

                    {/* Highlights */}
                    {version.highlights && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {version.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Changes */}
                  <div className="p-6">
                    {version.changes.new && version.changes.new.length > 0 && (
                      <div className="mb-6">
                        <h5 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                          <PlusIcon className="w-5 h-5" />
                          New Features
                        </h5>
                        <ul className="space-y-2">
                          {version.changes.new.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                              <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {version.changes.improved && version.changes.improved.length > 0 && (
                      <div className="mb-6">
                        <h5 className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300 mb-3">
                          <ArrowUpIcon className="w-5 h-5" />
                          Improvements
                        </h5>
                        <ul className="space-y-2">
                          {version.changes.improved.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                              <ArrowUpIcon className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {version.changes.fixed && version.changes.fixed.length > 0 && (
                      <div className="mb-6">
                        <h5 className="flex items-center gap-2 text-lg font-semibold text-green-700 dark:text-green-300 mb-3">
                          <WrenchScrewdriverIcon className="w-5 h-5" />
                          Bug Fixes
                        </h5>
                        <ul className="space-y-2">
                          {version.changes.fixed.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                              <WrenchScrewdriverIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {version.changes.breaking && version.changes.breaking.length > 0 && (
                      <div className="mb-6">
                        <h5 className="flex items-center gap-2 text-lg font-semibold text-red-700 dark:text-red-300 mb-3">
                          <ExclamationTriangleIcon className="w-5 h-5" />
                          Breaking Changes
                        </h5>
                        <ul className="space-y-2">
                          {version.changes.breaking.map((change, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                              <ExclamationTriangleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                              <span>{change}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RSS Feed Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Never miss an update. Subscribe to our changelog feed or follow us on social media.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                <FireIcon className="w-5 h-5" />
                Subscribe to RSS Feed
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 transform hover:scale-105">
                <ShieldCheckIcon className="w-5 h-5" />
                Security Updates
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 