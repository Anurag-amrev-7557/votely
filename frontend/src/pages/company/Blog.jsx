import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DocumentTextIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  TagIcon,
  BookOpenIcon,
  SparklesIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  GlobeAltIcon,
  HeartIcon,
  ShareIcon,
  ChevronDownIcon,
  EnvelopeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';

const featuredPost = {
  title: "The Future of Digital Voting: How Votely is Revolutionizing Democracy",
  excerpt: "Explore how modern technology is transforming the way we vote, from blockchain security to real-time analytics. Discover the innovations that make Votely the most secure and transparent voting platform available.",
  author: "Sarah Johnson",
  date: "2025-01-15",
  readTime: "8 min read",
  category: "Technology",
  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  tags: ["Digital Voting", "Democracy", "Technology", "Security"]
};

const blogPosts = [
  {
    id: 1,
    title: "Building Secure Voting Systems: Best Practices for Developers",
    excerpt: "Learn the essential security practices and architectural patterns for building robust voting systems that can withstand modern threats.",
    author: "Michael Chen",
    date: "2025-01-12",
    readTime: "12 min read",
    category: "Development",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    tags: ["Security", "Development", "Best Practices"],
    featured: false
  },
  {
    id: 2,
    title: "Enterprise Voting Solutions: Scaling Democracy for Large Organizations",
    excerpt: "Discover how enterprise organizations are implementing Votely to conduct secure, transparent elections at scale.",
    author: "Emily Rodriguez",
    date: "2025-01-10",
    readTime: "6 min read",
    category: "Enterprise",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["Enterprise", "Scaling", "Organizations"],
    featured: false
  },
  {
    id: 3,
    title: "The Psychology of Voting: Understanding User Behavior in Digital Elections",
    excerpt: "Explore the psychological factors that influence voting behavior and how digital platforms can enhance voter engagement.",
    author: "Dr. James Wilson",
    date: "2025-01-08",
    readTime: "10 min read",
    category: "Research",
    image: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["Psychology", "User Behavior", "Research"],
    featured: false
  },
  {
    id: 4,
    title: "API Design Patterns for Voting Applications",
    excerpt: "A comprehensive guide to designing robust APIs for voting applications, covering authentication, rate limiting, and data integrity.",
    author: "Alex Thompson",
    date: "2025-01-05",
    readTime: "15 min read",
    category: "Development",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["API", "Development", "Design Patterns"],
    featured: false
  },
  {
    id: 5,
    title: "Compliance and Regulations in Digital Voting",
    excerpt: "Understanding the legal and regulatory landscape for digital voting systems across different jurisdictions.",
    author: "Lisa Park",
    date: "2025-01-03",
    readTime: "9 min read",
    category: "Compliance",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["Compliance", "Regulations", "Legal"],
    featured: false
  },
  {
    id: 6,
    title: "Real-time Analytics in Voting Systems",
    excerpt: "How real-time analytics and data visualization are transforming the way we understand and improve voting processes.",
    author: "David Kim",
    date: "2024-12-30",
    readTime: "7 min read",
    category: "Analytics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    tags: ["Analytics", "Data Visualization", "Real-time"],
    featured: false
  }
];

const categories = [
  { name: "All", count: 7 },
  { name: "Technology", count: 2 },
  { name: "Development", count: 2 },
  { name: "Enterprise", count: 1 },
  { name: "Research", count: 1 },
  { name: "Compliance", count: 1 },
  { name: "Analytics", count: 1 }
];

const tags = [
  "Digital Voting", "Democracy", "Technology", "Security", "Development",
  "Best Practices", "Enterprise", "Scaling", "Psychology", "User Behavior",
  "API", "Design Patterns", "Compliance", "Regulations", "Analytics"
];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-8">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/15 via-indigo-400/10 to-purple-400/15 dark:from-blue-500/15 dark:via-indigo-500/10 dark:to-purple-500/15 rounded-full blur-3xl"
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
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/15 via-pink-400/10 to-indigo-400/15 dark:from-purple-500/15 dark:via-pink-500/10 dark:to-indigo-500/15 rounded-full blur-3xl"
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

          {/* Secondary decorative elements */}
          <motion.div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 dark:from-cyan-500/20 dark:to-blue-500/20 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.5, 0.7, 1],
              opacity: [0.4, 0.8, 0.1, 0.4],
              y: [0, -20, 10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-indigo-400/25 to-purple-400/25 dark:from-indigo-500/25 dark:to-purple-500/25 rounded-full blur-xl"
            animate={{
              scale: [0.8, 1.3, 0.6, 0.8],
              opacity: [0.3, 0.7, 0.2, 0.3],
              x: [0, 15, -10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />

          {/* Floating particles */}
          <motion.div
            className="absolute top-20 left-1/2 w-2 h-2 bg-blue-400/40 dark:bg-blue-500/40 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div
            className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-purple-400/50 dark:bg-purple-500/50 rounded-full"
            animate={{
              y: [0, -25, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5
            }}
          />
          <motion.div
            className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-indigo-400/35 dark:bg-indigo-500/35 rounded-full"
            animate={{
              y: [0, 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.5
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
            {/* Enhanced Blog Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{
                scale: 1.05,
                y: -2,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <DocumentTextIcon className="w-5 h-5" />
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="relative z-10 font-bold text-base">Votely Blog</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                className="inline-block relative"
              >
                Votely
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative"
              >
                Blog
                <motion.div
                  className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
                  animate={{
                    scale: [1, 1.5, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute inset-0.5 bg-white rounded-full"
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.span>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.8, 0.8, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 180, 360, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-2 -right-6 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"
                animate={{
                  scale: [0.8, 1.5, 0.6, 0.8],
                  opacity: [0.5, 0.1, 0.7, 0.5],
                  y: [0, -10, 0]
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
              <div className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Dive into{' '}
                <motion.span
                  className="inline-flex mb-3 items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 rounded-2xl font-bold shadow-lg border border-blue-200/60 dark:border-blue-700/60 hover:shadow-xl transition-all duration-300"
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    rotate: [-3, 3]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <BookOpenIcon className="w-6 h-6" />
                  </motion.div>
                  <span className="relative z-10">insights</span>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.span>
                , unlock{' '}
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-100 via-pink-100 to-purple-200 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 rounded-2xl font-bold shadow-lg border border-purple-200/60 dark:border-purple-700/60 hover:shadow-xl transition-all duration-300"
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    rotate: [3, -3]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, -15, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <SparklesIcon className="w-6 h-6" />
                  </motion.div>
                  <span className="relative z-10">innovations</span>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />
                </motion.span>
                , and stay ahead with cutting-edge{' '}
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 dark:from-green-900/40 dark:via-emerald-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 rounded-2xl font-bold shadow-lg border border-green-200/60 dark:border-green-700/60 hover:shadow-xl transition-all duration-300"
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    rotate: [-2, 2]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 400
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  >
                    <GlobeAltIcon className="w-6 h-6" />
                  </motion.div>
                  <span className="relative z-10">democracy tech</span>
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                  />
                </motion.span>
                .
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post Section */}
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
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.2, 0.8, 1],
                opacity: [0.3, 0.6, 0.2, 0.3],
                rotate: [0, 180, 360, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-indigo-400/10 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-indigo-500/10 rounded-full blur-lg"
              animate={{
                scale: [0.8, 1.3, 0.6, 0.8],
                opacity: [0.4, 0.7, 0.1, 0.4],
                rotate: [0, -180, -360, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />

            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{
                scale: 1.05,
                y: -3,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 via-orange-100 to-yellow-100 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200/50 dark:border-amber-700/50 hover:border-amber-300 dark:hover:border-amber-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <SparklesIcon className="w-4 h-4" />
                <motion.div
                  className="absolute -inset-1 bg-amber-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="relative z-10 font-bold">Featured</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block relative"
              >
                Featured
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent relative"
              >
                Article
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-md"
                  animate={{
                    scale: [1, 1.8, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute inset-0.5 bg-white rounded-full"
                    animate={{ scale: [1, 0.7, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.span>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-3 -left-3 w-1.5 h-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-60"
                animate={{
                  scale: [1, 1.6, 0.7, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 180, 360, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-1 -right-4 w-1 h-1 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full opacity-50"
                animate={{
                  scale: [0.8, 1.4, 0.5, 0.8],
                  opacity: [0.5, 0.1, 0.7, 0.5],
                  y: [0, -8, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.h2>

            {/* Enhanced Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Our latest{' '}
                <motion.span
                  className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-100 via-indigo-100 to-blue-200 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 rounded-xl font-semibold shadow-md border border-blue-200/60 dark:border-blue-700/60 hover:shadow-lg transition-all duration-300"
                  whileHover={{
                    scale: 1.08,
                    y: -3,
                    rotate: [-2, 2]
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 400
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 8, -8, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  >
                    <BookOpenIcon className="w-5 h-5" />
                  </motion.div>
                  <span className="relative z-10">insights</span>
                </motion.span>
                {' '}and stories from the world of digital democracy
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            whileHover={{
              y: -8,
              scale: 1.02
            }}
            className="group relative bg-white dark:bg-gray-800 rounded-3xl border border-gray-200/60 dark:border-gray-700/60 overflow-hidden hover:shadow-2xl transition-all duration-500 backdrop-blur-sm"
          >
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Floating decorative elements */}
            <motion.div
              className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60"
              animate={{
                scale: [1, 1.5, 0.8, 1],
                opacity: [0.6, 0.2, 0.8, 0.6],
                rotate: [0, 180, 360, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"
              animate={{
                scale: [0.8, 1.3, 0.6, 0.8],
                opacity: [0.5, 0.1, 0.7, 0.5],
                y: [0, -8, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className="md:flex relative z-10">
              <div className="md:w-1/2 relative overflow-hidden">
                <motion.img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Featured badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg"
                >
                  FEATURED
                </motion.div>
              </div>

              <div className="md:w-1/2 p-8 relative">
                <div className="flex items-center gap-3 mb-6">
                  <motion.span
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold border border-blue-200/60 dark:border-blue-700/60 shadow-sm"
                  >
                    {featuredPost.category}
                  </motion.span>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
                  >
                    <ClockIcon className="w-3 h-3" />
                    {featuredPost.readTime}
                  </motion.div>
                </div>

                <motion.h3
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {featuredPost.title}
                </motion.h3>

                <motion.p
                  className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {featuredPost.excerpt}
                </motion.p>

                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <UserIcon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-lg">
                        {featuredPost.author}
                      </p>
                      <motion.p
                        className="text-sm text-gray-500 dark:text-gray-400"
                        whileHover={{ color: "#3B82F6" }}
                        transition={{ duration: 0.3 }}
                      >
                        {new Date(featuredPost.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>

                <div className="flex items-center gap-4">
                  <motion.button
                    className="group/btn relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    whileHover={{
                      scale: 1.05,
                      y: -3
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10">Read Article</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRightIcon className="w-5 h-5" />
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.button>

                  <motion.button
                    className="inline-flex items-center gap-2 px-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 border border-gray-200 dark:border-gray-600"
                    whileHover={{
                      scale: 1.05,
                      y: -2,
                      backgroundColor: "#E5E7EB"
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Filters Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-16 px-4 sm:px-8 bg-gradient-to-br from-gray-50/90 via-blue-50/70 to-indigo-50/50 dark:from-gray-800/90 dark:via-blue-900/50 dark:to-indigo-900/40 relative overflow-hidden"
      >
        {/* Enhanced decorative background elements */}
        <motion.div
          className="absolute top-0 left-1/4 w-40 h-40 bg-gradient-to-br from-blue-400/15 via-indigo-400/15 to-purple-400/15 dark:from-blue-500/15 dark:via-indigo-500/15 dark:to-purple-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 0.9, 1],
            opacity: [0.4, 0.7, 0.3, 0.4],
            rotate: [0, 180, 360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-32 h-32 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-indigo-400/20 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-indigo-500/20 rounded-full blur-2xl"
          animate={{
            scale: [0.9, 1.3, 0.7, 0.9],
            opacity: [0.5, 0.8, 0.2, 0.5],
            rotate: [0, -180, -360, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-green-400/10 via-teal-400/10 to-blue-400/10 dark:from-green-500/10 dark:via-teal-500/10 dark:to-blue-500/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 0.8, 1],
            opacity: [0.3, 0.6, 0.1, 0.3],
            rotate: [0, 90, 180, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="max-w-8xl mx-auto relative z-10">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, type: "spring", stiffness: 100 }}
            className="text-center mb-16 relative"
          >
            {/* Enhanced decorative elements */}
            <motion.div
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 rounded-full blur-xl"
              animate={{
                scale: [1, 1.3, 0.8, 1],
                opacity: [0.3, 0.6, 0.2, 0.3],
                rotate: [0, 180, 360, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-br from-purple-400/10 via-pink-400/10 to-indigo-400/10 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-indigo-500/10 rounded-full blur-lg"
              animate={{
                scale: [0.8, 1.2, 0.6, 0.8],
                opacity: [0.4, 0.7, 0.1, 0.4],
                rotate: [0, -180, -360, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />

            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              whileHover={{
                scale: 1.05,
                y: -3,
                rotate: [0, 2]
              }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-semibold mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <BookOpenIcon className="w-4 h-4" />
                <motion.div
                  className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="relative z-10 font-bold">Article Collection</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-block relative"
              >
                Discover Our
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent relative"
              >
                Articles
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-md"
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
            </motion.h2>

            {/* Enhanced Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="inline-block"
              >
                Filter through our collection of insightful articles and find exactly what you're looking for
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-emerald-400/50 via-teal-400/50 to-cyan-400/50 rounded-full blur-sm"
                animate={{
                  scaleX: [0.5, 1, 0.5],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Main Filters Container */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-8"
            layout
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.2 }}
          >
            {/* Left Side - Filters */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 w-full lg:w-auto"
              layout
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/60 dark:border-gray-700/60 rounded-xl hover:border-blue-400/60 dark:hover:border-blue-500/60 transition-all duration-200 shadow-sm hover:shadow-md"
                layout
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <TagIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</span>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChevronDownIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Category Pills Container */}
              <AnimatePresence mode="wait">
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.8 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
                    className="flex flex-wrap gap-4 w-full sm:w-auto"
                    layout
                    layoutId="category-pills"
                  >
                    {categories.map((category, index) => (
                      <motion.button
                        key={category.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                        onClick={() => setSelectedCategory(category.name)}
                        whileHover={{
                          scale: 1.02,
                          y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${selectedCategory === category.name
                          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-md'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/80'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          {category.name}
                          <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${selectedCategory === category.name
                            ? 'bg-white/20 dark:bg-gray-900/20 text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                            {category.count}
                          </span>
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-xl border border-gray-200/60 dark:border-gray-700/60 backdrop-blur-sm shadow-md"
              layout
              transition={{ duration: 0.4, ease: "easeInOut", delay: 0.3 }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <DocumentTextIcon className="w-5 h-5 text-blue-700 dark:text-blue-400" />
              </motion.div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                <span className="text-blue-700 dark:text-blue-400 font-bold">{filteredPosts.length}</span> articles found
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                role="listitem"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {post.author}
                      </span>
                    </div>

                    <button className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                      Read
                      <ArrowRightIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-12"
            >
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your search or filter criteria
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Join the Community Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="py-24 px-4 sm:px-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-900 dark:via-blue-900/20 dark:to-indigo-900/10 relative overflow-hidden"
      >
        {/* Enhanced background elements */}
        <motion.div
          className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-400/8 via-indigo-400/8 to-purple-400/8 dark:from-blue-500/8 dark:via-indigo-500/8 dark:to-purple-500/8 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 0.9, 1],
            opacity: [0.3, 0.5, 0.2, 0.3],
            rotate: [0, 90, 180, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/3 w-24 h-24 bg-gradient-to-br from-purple-400/6 via-pink-400/6 to-indigo-400/6 dark:from-purple-500/6 dark:via-pink-500/6 dark:to-indigo-500/6 rounded-full blur-xl"
          animate={{
            scale: [0.9, 1.1, 0.8, 0.9],
            opacity: [0.4, 0.6, 0.1, 0.4],
            rotate: [0, -90, -180, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative"
          >
            {/* Enhanced decorative background elements */}
            <motion.div
              className="absolute -top-12 -left-12 w-24 h-24 bg-gradient-to-br from-blue-400/8 via-indigo-400/8 to-purple-400/8 dark:from-blue-500/8 dark:via-indigo-500/8 dark:to-purple-500/8 rounded-full blur-2xl"
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
              className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-purple-400/6 via-pink-400/6 to-indigo-400/6 dark:from-purple-500/6 dark:via-pink-500/6 dark:to-indigo-500/6 rounded-full blur-xl"
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

            {/* Enhanced Badge with Interactive Elements */}
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
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/40 dark:via-indigo-900/40 dark:to-purple-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <UserGroupIcon className="w-5 h-5" />
                <motion.div
                  className="absolute -inset-1 bg-blue-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="relative z-10 font-bold text-base">Community</span>
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading with Interactive Elements */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block"
              >
                Join the
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent relative"
              >
                Votely Community
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
            </motion.h2>

            {/* Enhanced Description with Animated Elements */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed relative"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="inline-block"
              >
                Connect with fellow developers, share insights, and help shape the future of
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 300 }}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  rotate: [-1, 1]
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-3 py-1 mx-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold border border-green-200/50 dark:border-green-700/50 hover:border-green-300 dark:hover:border-green-600 transition-all duration-300"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <GlobeAltIcon className="w-4 h-4" />
                </motion.div>
                <span>digital democracy</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="inline-block"
              >
                .
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Community Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Discord Community */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-blue-300/80 dark:hover:border-blue-600/80 transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden"
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

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                  Discord Community
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Join 15,000+ developers and voting enthusiasts in our active Discord server. Get help, share ideas, and stay updated.
                </p>

                <motion.button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Join Discord</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* Documentation Hub */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-green-300/80 dark:hover:border-green-600/80 transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  rotate: [0, -360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <BookOpenIcon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Documentation Hub
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Explore comprehensive guides, API references, and best practices to build secure voting solutions.
                </p>

                <motion.button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>Browse Docs</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>

            {/* GitHub Repository */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-gray-700/60 hover:border-gray-300/80 dark:hover:border-gray-600/80 transition-all duration-500 hover:shadow-2xl cursor-pointer overflow-hidden"
            >
              {/* Animated background gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-500/5 via-slate-500/5 to-zinc-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <div className="relative z-10">
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-gray-600 to-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg"
                  whileHover={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <CodeBracketIcon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors">
                  Open Source
                </h3>

                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  Contribute to our open-source projects, report issues, and help improve voting technology for everyone.
                </p>

                <motion.button
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-slate-700 text-white font-semibold rounded-xl hover:from-gray-700 hover:to-slate-800 transition-all duration-300 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>View on GitHub</span>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center mt-12"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserGroupIcon className="w-5 h-5" />
              <span>Become a Contributor</span>
              <ArrowRightIcon className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
} 