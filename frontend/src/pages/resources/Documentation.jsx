import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  BookOpenIcon,
  CodeBracketIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  PlayIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const categories = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: RocketLaunchIcon,
    color: 'from-blue-500 to-purple-600',
    description: 'Quick start guides and basic setup',
    articles: [
      { title: 'Quick Start Guide', time: '5 min read', popular: true },
      { title: 'Creating Your First Poll', time: '3 min read' },
      { title: 'Understanding the Dashboard', time: '4 min read' },
      { title: 'User Roles and Permissions', time: '6 min read' }
    ]
  },
  {
    id: 'api',
    title: 'API Reference',
    icon: CodeBracketIcon,
    color: 'from-green-500 to-blue-600',
    description: 'Complete API documentation and examples',
    articles: [
      { title: 'Authentication', time: '8 min read', popular: true },
      { title: 'Polls API', time: '12 min read' },
      { title: 'Votes API', time: '10 min read' },
      { title: 'Webhooks', time: '7 min read' },
      { title: 'Rate Limits', time: '4 min read' }
    ]
  },
  {
    id: 'security',
    title: 'Security',
    icon: ShieldCheckIcon,
    color: 'from-red-500 to-orange-600',
    description: 'Security best practices and compliance',
    articles: [
      { title: 'Security Overview', time: '6 min read' },
      { title: 'Data Encryption', time: '8 min read' },
      { title: 'Access Control', time: '7 min read' },
      { title: 'Compliance (GDPR, SOC 2)', time: '10 min read', popular: true }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: ChartBarIcon,
    color: 'from-purple-500 to-pink-600',
    description: 'Analytics and reporting features',
    articles: [
      { title: 'Analytics Dashboard', time: '5 min read' },
      { title: 'Custom Reports', time: '8 min read' },
      { title: 'Data Export', time: '4 min read' },
      { title: 'Real-time Metrics', time: '6 min read' }
    ]
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: Cog6ToothIcon,
    color: 'from-indigo-500 to-purple-600',
    description: 'Third-party integrations and plugins',
    articles: [
      { title: 'Slack Integration', time: '6 min read' },
      { title: 'Microsoft Teams', time: '5 min read' },
      { title: 'Google Workspace', time: '7 min read' },
      { title: 'Custom Webhooks', time: '9 min read' }
    ]
  },
  {
    id: 'deployment',
    title: 'Deployment',
    icon: GlobeAltIcon,
    color: 'from-teal-500 to-blue-600',
    description: 'Deployment and infrastructure guides',
    articles: [
      { title: 'Cloud Deployment', time: '15 min read' },
      { title: 'On-Premise Setup', time: '20 min read' },
      { title: 'Docker Configuration', time: '12 min read' },
      { title: 'Performance Optimization', time: '10 min read' }
    ]
  }
];

const popularArticles = [
  {
    title: 'Quick Start Guide',
    category: 'Getting Started',
    time: '5 min read',
    description: 'Get up and running with Votely in minutes',
    icon: RocketLaunchIcon
  },
  {
    title: 'API Authentication',
    category: 'API Reference',
    time: '8 min read',
    description: 'Learn how to authenticate with our API',
    icon: LockClosedIcon
  },
  {
    title: 'Security Compliance',
    category: 'Security',
    time: '10 min read',
    description: 'Understanding GDPR and SOC 2 compliance',
    icon: ShieldCheckIcon
  },
  {
    title: 'Creating Advanced Polls',
    category: 'Getting Started',
    time: '7 min read',
    description: 'Master advanced poll creation features',
    icon: UserGroupIcon
  }
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.articles.some(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orb */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/10 dark:from-blue-500/20 dark:via-purple-500/15 dark:to-indigo-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 0.8, 1],
              opacity: [0.2, 0.6, 0.3, 0.2],
              rotate: [0, 180, 360, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary floating orb */}
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-blue-400/10 dark:from-purple-500/20 dark:via-pink-500/15 dark:to-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.8, 1.4, 1.2],
              opacity: [0.4, 0.2, 0.7, 0.4],
              rotate: [360, 180, 0, 360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          {/* Tertiary floating orb for added depth */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400/15 via-blue-400/10 to-purple-400/15 dark:from-indigo-500/15 dark:via-blue-500/10 dark:to-purple-500/15 rounded-full blur-2xl"
            animate={{
              scale: [0.9, 1.1, 0.7, 0.9],
              opacity: [0.1, 0.4, 0.2, 0.1],
              rotate: [180, 0, 360, 180],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
          />
          
          {/* Subtle particle effects */}
          <motion.div
            className="absolute top-20 left-20 w-2 h-2 bg-blue-400/30 dark:bg-blue-500/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-40 right-32 w-1 h-1 bg-purple-400/40 dark:bg-purple-500/40 rounded-full"
            animate={{
              y: [0, -15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
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
            {/* Enhanced Badge with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 dark:from-blue-900/40 dark:via-blue-800/30 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <BookOpenIcon className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </motion.div>
              <span className="relative">
                Documentation
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                />
              </span>
              <motion.div
                className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>

            {/* Enhanced Main Heading with Interactive Elements */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 relative group"
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Documentation
              </motion.span>
              <motion.span 
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent relative"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                & Guides
                {/* Animated underline effect */}
                <motion.div
                  className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-full opacity-0 group-hover:opacity-100"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </motion.span>
              {/* Floating particles effect */}
              <motion.div
                className="absolute -top-4 -right-4 w-2 h-2 bg-blue-400 rounded-full opacity-60"
                animate={{ 
                  y: [-4, 4, -4],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"
                animate={{ 
                  y: [4, -4, 4],
                  opacity: [0.6, 1, 0.6]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.h1>

            {/* Enhanced Subtitle with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center mb-8 max-w-4xl mx-auto"
            >
              <motion.div
                className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 leading-relaxed"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                Everything you need to know about{' '}
                <motion.span 
                  className="font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  Votely
                </motion.span>
                . From quick start guides to advanced API documentation.
              </motion.div>
              
              {/* Interactive Feature Highlights */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400"
              >
                <motion.span
                  className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800"
                  whileHover={{ scale: 1.05, backgroundColor: '#dbeafe' }}
                  transition={{ duration: 0.2 }}
                >
                  <DocumentTextIcon className="w-4 h-4" />
                  Step-by-step guides
                </motion.span>
                <motion.span
                  className="flex items-center gap-1 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-200 dark:border-purple-800"
                  whileHover={{ scale: 1.05, backgroundColor: '#f3e8ff' }}
                  transition={{ duration: 0.2 }}
                >
                  <CodeBracketIcon className="w-4 h-4" />
                  API references
                </motion.span>
                <motion.span
                  className="flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800"
                  whileHover={{ scale: 1.05, backgroundColor: '#dcfce7' }}
                  transition={{ duration: 0.2 }}
                >
                  <PlayIcon className="w-4 h-4" />
                  Interactive examples
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Enhanced Search Bar with Advanced Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <motion.div 
                className="relative group"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Animated Search Icon */}
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                  animate={{ 
                    scale: searchQuery ? [1, 1.1, 1] : 1,
                    rotate: searchQuery ? [0, 5, -5, 0] : 0
                  }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                </motion.div>
                
                {/* Enhanced Input Field */}
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-16 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 dark:focus:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl"
                />
                
                {/* Clear Button */}
                {searchQuery && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                )}
                
                {/* Search Suggestions Indicator */}
                <motion.div
                  className="absolute right-12 top-1/2 transform -translate-y-1/2"
                  animate={{ 
                    opacity: searchQuery ? [0.5, 1, 0.5] : 0,
                    scale: searchQuery ? [1, 1.05, 1] : 1
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                    <span>⌘K</span>
                    <span className="hidden sm:inline">to search</span>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Search Results Preview */}
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-2xl z-50 max-h-64 overflow-y-auto"
                >
                  <div className="p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Searching for "{searchQuery}"...
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                        <div className="font-medium text-gray-900 dark:text-white">Quick Start Guide</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Getting Started • 5 min read</div>
                      </div>
                      <div className="p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors duration-200">
                        <div className="font-medium text-gray-900 dark:text-white">API Authentication</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">API Reference • 8 min read</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Popular Articles Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Popular Articles
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              Start with these frequently accessed guides
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-6 flex justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
                <StarIcon className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Most helpful resources
                </span>
              </div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularArticles.map((article, index) => (
              <motion.div
                key={article.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/80 dark:hover:border-blue-600/80 transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-blue-400/40 dark:bg-blue-500/40 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.6 }
                      }}
                    >
                      <article.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.p 
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {article.category}
                      </motion.p>
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1 h-1 bg-green-400 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            delay: index * 0.3
                          }}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {article.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <motion.h3 
                    className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {article.title}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {article.description}
                  </motion.p>
                  
                  <motion.div 
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Read more</span>
                    <motion.div
                      className="flex items-center"
                      animate={{ x: [0, 2, 0] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.1
                      }}
                    >
                      <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            {/* Enhanced decorative background elements */}
            <motion.div
              className="absolute inset-0 -z-10"
              aria-hidden="true"
            >
              <motion.div
                className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>

            {/* Enhanced badge with interactive elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6 shadow-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChartBarIcon className="w-4 h-4" />
              </motion.div>
              <span>Organized Topics</span>
              <motion.div
                className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              />
            </motion.div>

            {/* Enhanced heading with gradient text and interactive elements */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.span
                className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent"
                whileHover={{ 
                  backgroundPosition: "200% center",
                  transition: { duration: 0.5 }
                }}
              >
                Browse by Category
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-500"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
              />
            </motion.h2>

            {/* Enhanced description with animated elements */}
            <motion.div 
              className="text-xl text-gray-600 dark:text-gray-300 relative"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Find the information you need organized by topic
              </motion.span>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </motion.div>

            {/* Subtle particle effects */}
            <motion.div
              className="absolute top-4 right-8 w-1 h-1 bg-blue-400/40 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-4 left-8 w-1 h-1 bg-purple-400/40 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100
                }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer backdrop-blur-sm"
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              >
                {/* Enhanced gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-indigo-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.1 }}
                />
                
                {/* Floating particles effect */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0, 1, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                />

                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <motion.div 
                      className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ 
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.6 }
                      }}
                    >
                      <category.icon className="w-6 h-6 text-white drop-shadow-sm" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3 
                        className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        {category.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600 dark:text-gray-300 text-sm"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {category.description}
                      </motion.p>
                    </div>
                    <motion.div
                      animate={{ 
                        rotate: selectedCategory === category.id ? 90 : 0,
                        scale: selectedCategory === category.id ? 1.1 : 1
                      }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <ChevronRightIcon 
                        className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" 
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Articles List with enhanced animations */}
                <motion.div 
                  className="overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ 
                    height: selectedCategory === category.id ? "auto" : 0,
                    opacity: selectedCategory === category.id ? 1 : 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <div className="p-6 space-y-3">
                    {category.articles.map((article, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ 
                          opacity: selectedCategory === category.id ? 1 : 0,
                          x: selectedCategory === category.id ? 0 : -20
                        }}
                        transition={{ 
                          duration: 0.4,
                          delay: selectedCategory === category.id ? idx * 0.1 : 0
                        }}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 cursor-pointer group/article"
                        whileHover={{ 
                          x: 8,
                          scale: 1.02,
                          transition: { duration: 0.2 }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <DocumentTextIcon className="w-4 h-4 text-gray-400 group-hover/article:text-blue-500 transition-colors duration-300" />
                          </motion.div>
                          <span className="text-gray-700 dark:text-gray-300 text-sm font-medium group-hover/article:text-gray-900 dark:group-hover/article:text-white transition-colors duration-300">
                            {article.title}
                          </span>
                          {article.popular && (
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <StarIcon className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                            </motion.div>
                          )}
                        </div>
                        <motion.span 
                          className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {article.time}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Enhanced hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Examples Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            {/* Enhanced decorative background elements */}
            <motion.div
              className="absolute inset-0 -z-10"
              aria-hidden="true"
            >
              <motion.div
                className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>

            {/* Enhanced badge with interactive elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/40 dark:to-blue-900/40 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-6 shadow-lg border border-green-200/50 dark:border-green-700/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlayIcon className="w-4 h-4" />
              </motion.div>
              <span>Interactive Learning</span>
              <motion.div
                className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
            </motion.div>

            {/* Enhanced main heading with interactive elements */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative group"
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Interactive Examples
              </motion.span>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </motion.h2>

            {/* Enhanced description with interactive elements */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 relative group"
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Try out our API and features with interactive examples
              </motion.span>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2.5
                }}
              />
            </motion.div>

            {/* Subtle particle effects */}
            <motion.div
              className="absolute top-4 right-8 w-1 h-1 bg-green-400/40 rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-4 left-8 w-1 h-1 bg-purple-400/40 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5
              }}
            />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <CodeBracketIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  API Playground
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Test our API endpoints directly in your browser. No setup required.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                <PlayIcon className="w-4 h-4" />
                Open Playground
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <RocketLaunchIcon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Quick Start Demo
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                See Votely in action with our interactive demo. Create polls and vote in real-time.
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                <PlayIcon className="w-4 h-4" />
                Launch Demo
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50/30 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-indigo-900/10 relative overflow-hidden">
        {/* Enhanced decorative background elements */}
        <motion.div
          className="absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <motion.div
            className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-2xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </motion.div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Enhanced badge with interactive elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6 shadow-lg border border-blue-200/50 dark:border-blue-700/50 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserGroupIcon className="w-4 h-4" />
              </motion.div>
              <span>Support</span>
            </motion.div>

            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                Need More Help?
              </motion.span>
              <motion.div
                className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              Can't find what you're looking for? Our support team is here to help.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <motion.button 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <UserGroupIcon className="w-5 h-5" />
                </motion.div>
                <span>Contact Support</span>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.button>
              
              <motion.button 
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <BookOpenIcon className="w-5 h-5" />
                </motion.div>
                <span>View All Guides</span>
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 