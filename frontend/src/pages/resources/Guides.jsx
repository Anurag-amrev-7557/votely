import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon,
  BookOpenIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  GlobeAltIcon,
  ArrowRightIcon,
  PlayIcon,
  ClockIcon,
  StarIcon,
  CheckCircleIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const learningPaths = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'New to Votely? Start here',
    color: 'from-green-500 to-blue-600',
    icon: RocketLaunchIcon,
    duration: '2-3 hours',
    guides: [
      {
        title: 'Getting Started with Votely',
        description: 'Learn the basics of creating and managing polls',
        time: '15 min',
        type: 'video',
        difficulty: 'Beginner',
        popular: true
      },
      {
        title: 'Creating Your First Poll',
        description: 'Step-by-step guide to creating your first voting poll',
        time: '10 min',
        type: 'interactive',
        difficulty: 'Beginner'
      },
      {
        title: 'Understanding the Dashboard',
        description: 'Navigate and understand the Votely dashboard',
        time: '12 min',
        type: 'guide',
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    description: 'Ready to explore advanced features',
    color: 'from-blue-500 to-purple-600',
    icon: UserGroupIcon,
    duration: '4-5 hours',
    guides: [
      {
        title: 'Advanced Poll Configuration',
        description: 'Learn about advanced poll settings and options',
        time: '20 min',
        type: 'video',
        difficulty: 'Intermediate',
        popular: true
      },
      {
        title: 'User Management & Permissions',
        description: 'Manage users and set up role-based access',
        time: '18 min',
        type: 'interactive',
        difficulty: 'Intermediate'
      },
      {
        title: 'Analytics & Reporting',
        description: 'Understand voting analytics and generate reports',
        time: '25 min',
        type: 'guide',
        difficulty: 'Intermediate'
      },
      {
        title: 'Integrations Setup',
        description: 'Connect Votely with your existing tools',
        time: '15 min',
        type: 'video',
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Master enterprise features and customization',
    color: 'from-purple-500 to-pink-600',
    icon: Cog6ToothIcon,
    duration: '6-8 hours',
    guides: [
      {
        title: 'API Integration Deep Dive',
        description: 'Build custom integrations using our API',
        time: '45 min',
        type: 'interactive',
        difficulty: 'Advanced',
        popular: true
      },
      {
        title: 'Custom Branding & White-labeling',
        description: 'Customize Votely to match your brand',
        time: '30 min',
        type: 'guide',
        difficulty: 'Advanced'
      },
      {
        title: 'Security Best Practices',
        description: 'Implement enterprise-grade security measures',
        time: '35 min',
        type: 'video',
        difficulty: 'Advanced'
      },
      {
        title: 'Performance Optimization',
        description: 'Optimize Votely for large-scale deployments',
        time: '40 min',
        type: 'interactive',
        difficulty: 'Advanced'
      }
    ]
  }
];

const featuredGuides = [
  {
    title: 'Complete Votely Masterclass',
    description: 'Comprehensive guide covering everything from basics to advanced features',
    time: '2 hours',
    type: 'video',
    difficulty: 'All Levels',
    instructor: 'Sarah Johnson',
    rating: 4.9,
    students: 1247,
    popular: true
  },
  {
    title: 'Security & Compliance Guide',
    description: 'Everything you need to know about Votely security and compliance',
    time: '1.5 hours',
    type: 'interactive',
    difficulty: 'Intermediate',
    instructor: 'Michael Chen',
    rating: 4.8,
    students: 892,
    popular: true
  },
  {
    title: 'API Integration Workshop',
    description: 'Hands-on workshop for developers integrating with Votely API',
    time: '3 hours',
    type: 'interactive',
    difficulty: 'Advanced',
    instructor: 'Emily Rodriguez',
    rating: 4.7,
    students: 567
  }
];

const getTypeIcon = (type) => {
  switch (type) {
    case 'video':
      return (
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, 10] }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <VideoCameraIcon className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
          <motion.div
            className="absolute -inset-1 bg-red-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      );
    case 'interactive':
      return (
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -10] }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <ComputerDesktopIcon className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors" />
          <motion.div
            className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.div>
      );
    case 'guide':
      return (
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, 8] }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <DocumentTextIcon className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors" />
          <motion.div
            className="absolute -inset-1 bg-green-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </motion.div>
      );
    default:
      return (
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, 5] }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <BookOpenIcon className="w-4 h-4 text-purple-500 group-hover:text-purple-600 transition-colors" />
          <motion.div
            className="absolute -inset-1 bg-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
        </motion.div>
      );
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-gradient-to-r from-green-100 via-emerald-100 to-green-100 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-green-900/40 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 shadow-sm hover:shadow-md transition-all duration-300';
    case 'Intermediate':
      return 'bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 shadow-sm hover:shadow-md transition-all duration-300';
    case 'Advanced':
      return 'bg-gradient-to-r from-purple-100 via-violet-100 to-purple-100 dark:from-purple-900/40 dark:via-violet-900/40 dark:to-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 shadow-sm hover:shadow-md transition-all duration-300';
    default:
      return 'bg-gradient-to-r from-gray-100 via-slate-100 to-gray-100 dark:from-gray-900/40 dark:via-slate-900/40 dark:to-gray-900/40 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm hover:shadow-md transition-all duration-300';
  }
};

export default function Guides() {
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const filteredPaths = selectedDifficulty === 'all' 
    ? learningPaths 
    : learningPaths.filter(path => path.id === selectedDifficulty);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orb - Blue */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/8 dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-purple-500/8 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.3, 0.8, 1],
              opacity: [0.3, 0.7, 0.2, 0.3],
              rotate: [0, 180, 360, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary floating orb - Purple */}
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/12 via-pink-400/8 to-indigo-400/10 dark:from-purple-500/12 dark:via-pink-500/8 dark:to-indigo-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.9, 1.4, 1.2],
              opacity: [0.6, 0.2, 0.8, 0.6],
              rotate: [0, -180, -360, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
            }}
          />
          
          {/* Tertiary floating orb - Green accent */}
          <motion.div
            className="absolute top-1/2 -right-20 w-60 h-60 bg-gradient-to-br from-green-400/8 via-emerald-400/6 to-teal-400/5 dark:from-green-500/8 dark:via-emerald-500/6 dark:to-teal-500/5 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.1, 0.6, 0.8],
              opacity: [0.2, 0.5, 0.1, 0.2],
              rotate: [0, 90, 180, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 6
            }}
          />
          
          {/* Floating particles */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 dark:bg-blue-500/30 rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-purple-400/40 dark:bg-purple-500/40 rounded-full"
            animate={{
              y: [0, -15, 0],
              opacity: [0.4, 0.9, 0.4],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-green-400/50 dark:bg-green-500/50 rounded-full"
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
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
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.05, 
                y: -2,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-yellow-900/40 dark:via-orange-900/40 dark:to-red-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-orange-200/50 dark:border-orange-700/50 hover:border-orange-300 dark:hover:border-orange-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <StarIcon className="w-4 h-4" />
              </motion.div>
              <span>Curated Selection</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>

            {/* Enhanced Main Heading with Interactive Elements */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                Learning
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent relative"
              >
                Guides
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full shadow-md"
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced Subtitle with Animated Elements */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="inline-block"
              >
                Master Votely with our comprehensive guides, tutorials, and interactive learning paths. 
                From beginner basics to advanced enterprise features.
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scaleX: [0, 1, 0],
                  opacity: [0, 0.7, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </motion.div>

            {/* Difficulty Filter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {[
                { id: 'all', label: 'All Levels' },
                { id: 'beginner', label: 'Beginner' },
                { id: 'intermediate', label: 'Intermediate' },
                { id: 'advanced', label: 'Advanced' }
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedDifficulty(level.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedDifficulty === level.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Guides Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 relative"
          >
            {/* Enhanced decorative background elements */}
            <motion.div
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400/8 via-indigo-400/8 to-purple-400/8 dark:from-blue-500/8 dark:via-indigo-500/8 dark:to-purple-500/8 rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 0.8, 1],
                opacity: [0.3, 0.6, 0.2, 0.3],
                rotate: [0, 180, 360, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-400/6 via-pink-400/6 to-indigo-400/6 dark:from-purple-500/6 dark:via-pink-500/6 dark:to-indigo-500/6 rounded-full blur-xl"
              animate={{
                scale: [0.8, 1.2, 0.6, 0.8],
                opacity: [0.4, 0.7, 0.1, 0.4],
                rotate: [0, -180, -360, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            />

            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm hover:shadow-blue-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <RocketLaunchIcon className="w-5 h-5" />
              </motion.div>
              <span>Choose your journey</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="inline-block"
              >
                Featured
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-1 mx-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <BookOpenIcon className="w-4 h-4" />
                </motion.div>
                <span>Guides</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.span>
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="inline-block"
              >
                Most popular and highly-rated
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-1 mx-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <AcademicCapIcon className="w-4 h-4" />
                </motion.div>
                <span>learning resources</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredGuides.map((guide, index) => (
              <motion.div
                key={guide.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                />
                
                {guide.popular && (
                  <motion.div 
                    className="relative z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold px-3 py-1 text-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-yellow-300/50 to-orange-400/50"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                    <span className="relative z-10">Most Popular</span>
                  </motion.div>
                )}
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div 
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: [0, 15] }}
                      transition={{ duration: 0.6 }}
                    >
                      {getTypeIcon(guide.type)}
                    </motion.div>
                    <div className="flex-1">
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)} border border-current/20`}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        {guide.difficulty}
                      </motion.span>
                    </div>
                  </div>
                  
                  <motion.h3 
                    className="text-xl font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {guide.title}
                  </motion.h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    {guide.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <motion.span 
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ClockIcon className="w-4 h-4" />
                        {guide.time}
                      </motion.span>
                      <motion.span 
                        className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg"
                        whileHover={{ scale: 1.05, y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <UserGroupIcon className="w-4 h-4" />
                        {guide.students}
                      </motion.span>
                    </div>
                    <motion.div 
                      className="flex items-center gap-2 px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200/50 dark:border-yellow-700/50"
                      whileHover={{ scale: 1.05, rotate: [0, 10] }}
                      transition={{ duration: 0.3 }}
                    >
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {guide.rating}
                      </span>
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <motion.span 
                      className="text-sm text-gray-600 dark:text-gray-400 px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      by {guide.instructor}
                    </motion.span>
                    <motion.button 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span>Start Learning</span>
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ArrowRightIcon className="w-4 h-4" />
                      </motion.div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Title with Animated Elements */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
              >
                Learning Paths
              </motion.span>
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            
            {/* Enhanced Description with Interactive Elements */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block"
              >
                Structured learning paths designed for your
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-1 mx-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <AcademicCapIcon className="w-4 h-4" />
                </motion.div>
                <span>skill level</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="inline-block"
              >
                .
              </motion.span>
            </motion.div>
            
            {/* Enhanced Badge with Interactive Elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              whileHover={{ 
                scale: 1.05, 
                y: -3,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm hover:shadow-blue-500/30"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <RocketLaunchIcon className="w-5 h-5" />
              </motion.div>
              <span>Choose your journey</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </motion.div>
          </motion.div>

          <div className="space-y-8">
            {filteredPaths.map((path, index) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Path Header */}
                <div 
                  className="p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer"
                  onClick={() => setSelectedPath(selectedPath === path.id ? null : path.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${path.color} rounded-xl flex items-center justify-center`}>
                        <path.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {path.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {path.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{path.duration}</p>
                      </div>
                      <ChevronRightIcon 
                        className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                          selectedPath === path.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {/* Guides List */}
                <div className={`overflow-hidden transition-all duration-300 ${
                  selectedPath === path.id ? 'max-h-96' : 'max-h-0'
                }`}>
                  <div className="p-6 space-y-4">
                    {path.guides.map((guide, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            {getTypeIcon(guide.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {guide.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {guide.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {guide.time}
                          </span>
                          {guide.popular && (
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          )}
                          <button className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">
                            <PlayIcon className="w-3 h-3" />
                            Start
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Learning Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Title with Animated Elements */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
            >
              <motion.span
                className="inline-block"
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
              >
                Interactive Learning
              </motion.span>
              {/* Animated underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </motion.h2>
            
            {/* Enhanced Description with Interactive Elements */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-block"
              >
                Learn by doing with our hands-on
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 300 }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-1 mx-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 15] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <ComputerDesktopIcon className="w-4 h-4" />
                </motion.div>
                <span>tutorials and workshops</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <VideoCameraIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Video Tutorials
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Step-by-step video guides covering all aspects of Votely
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105">
                Browse Videos
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ComputerDesktopIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Interactive Workshops
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Hands-on workshops with real-time feedback and guidance
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105">
                Join Workshop
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Live Sessions
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join live Q&A sessions with Votely experts and community
              </p>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105">
                Schedule Session
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 px-4 sm:px-8 overflow-hidden">
        {/* Modern Light Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/20" />
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-30 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          }} />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            {/* Enhanced Title */}
            <motion.div className="mb-10">
              <motion.h2 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    filter: "drop-shadow(0 8px 25px rgba(59, 130, 246, 0.2))"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Ready to Master
                </motion.span>
                <br />
                <motion.span
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    filter: "drop-shadow(0 8px 25px rgba(59, 130, 246, 0.3))"
                  }}
                >
                  Votely?
                </motion.span>
              </motion.h2>
              
              {/* Animated underline */}
              <motion.div
                className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </motion.div>

            {/* Enhanced Description */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Start your learning journey today and unlock the full potential of Votely with our comprehensive resources and expert guidance.
              </motion.span>
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button 
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <RocketLaunchIcon className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">Start Learning Path</span>
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>

              <motion.button 
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
                whileHover={{ 
                  scale: 1.05,
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <UserGroupIcon className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">Join Community</span>
                <motion.div
                  className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
              </motion.button>
            </motion.div>

            {/* Additional Info */}
            <motion.div 
              className="mt-12 text-gray-500 dark:text-gray-400 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <span>Join 10,000+ developers already learning with Votely</span>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 