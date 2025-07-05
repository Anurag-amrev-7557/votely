import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { 
  UserGroupIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  HeartIcon,
  StarIcon,
  GlobeAltIcon,
  ClockIcon,
  ArrowRightIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  CodeBracketIcon,
  TrophyIcon,
  UsersIcon,
  CheckCircleIcon,
  SparklesIcon
} from '../components/ui/icons';
import { FaLinkedin, FaGithub, FaInstagram, FaXTwitter, FaReddit } from 'react-icons/fa6';

const team = [
  {
    name: 'Anurag Verma',
    role: 'CEO, Founder & Lead Developer',
    img: '/src/assets/owner.gif',
    bio: 'Visionary entrepreneur and full-stack developer with a passion for democratizing voting technology. Single-handedly built Votely from concept to reality, combining technical expertise with strategic vision.',
    expertise: ['Full-Stack Development', 'Strategic Vision', 'Product Architecture', 'Security Engineering', 'Business Strategy'],
    social: 
    { 
      linkedin: 'https://www.linkedin.com/in/anurag-verma-18645b280/', 
      github: 'https://github.com/Anurag-amrev-7557', 
      instagram: 'https://www.instagram.com/verma.anurag__/',
      x: 'https://x.com/Ansh1776657',
      reddit: 'https://www.reddit.com/user/Nervous-Ad2104/'
    }
  }
];

const milestones = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Votely was founded with a vision to democratize voting technology',
    icon: RocketLaunchIcon,
    color: 'from-blue-500 to-purple-600'
  },
  {
    year: '2021',
    title: 'First Election',
    description: 'Successfully conducted our first major online election with 10,000+ voters',
    icon: CheckCircleIcon,
    color: 'from-green-500 to-blue-600'
  },
  {
    year: '2022',
    title: 'Enterprise Launch',
    description: 'Launched enterprise solutions serving Fortune 500 companies',
    icon: TrophyIcon,
    color: 'from-purple-500 to-pink-600'
  },
  {
    year: '2023',
    title: 'Global Expansion',
    description: 'Expanded to 45+ countries with multi-language support',
    icon: GlobeAltIcon,
    color: 'from-orange-500 to-red-600'
  },
  {
    year: '2024',
    title: 'AI Integration',
    description: 'Introduced AI-powered fraud detection and analytics',
    icon: SparklesIcon,
    color: 'from-indigo-500 to-cyan-600'
  }
];

const AboutUs = () => {
  const { isDarkMode } = useTheme();

  return (
    <main 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-[#15191e] dark:via-[#1a1f26]/50 dark:to-[#1e242c]/30 relative overflow-hidden"
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
      role="main"
      aria-label="About Votely main content"
    >
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary floating orb */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/10 dark:from-blue-500/20 dark:via-purple-500/15 dark:to-indigo-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.2, 0.6, 0.3, 0.2],
            rotate: [0, 360],
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
            rotate: [360, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
        
        {/* Tertiary floating orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/15 via-blue-400/10 to-purple-400/15 dark:from-indigo-500/15 dark:via-blue-500/10 dark:to-purple-500/15 rounded-full blur-2xl"
          animate={{
            scale: [0.8, 1.2, 0.6, 0.8],
            opacity: [0.1, 0.4, 0.2, 0.1],
            rotate: [180, 540],
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
        <motion.div
          className="absolute bottom-40 left-1/4 w-1.5 h-1.5 bg-indigo-400/35 dark:bg-indigo-500/35 rounded-full"
          animate={{
            y: [0, 25, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              {/* Enhanced About Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 20] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <HeartIcon className="w-6 h-6" />
                  <motion.div
                    className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
                <span className="font-bold text-base">Our Story & Mission</span>
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full shadow-lg"
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    className="absolute inset-1 bg-white rounded-full"
                    animate={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.div>
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
                  Empowering
                </motion.span>
                <motion.span 
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent relative"
                >
                  Democracy
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
                  Discover our{' '}
                  <motion.span
                    className="inline-flex mb-3 items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 text-blue-700 dark:text-blue-300 rounded-xl font-semibold shadow-sm border border-blue-200 dark:border-blue-700/50"
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
                    mission
                  </motion.span>
                  , meet our{' '}
                  <motion.span
                    className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 text-purple-700 dark:text-purple-300 rounded-xl font-semibold shadow-sm border border-purple-200 dark:border-purple-700/50"
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
                    <UsersIcon className="w-5 h-5" />
                    passionate team
                  </motion.span>
                  , and learn how we're{' '}
                  <motion.span
                    className="inline-flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 text-green-700 dark:text-green-300 rounded-xl font-semibold shadow-sm border border-green-200 dark:border-green-700/50"
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
                    <RocketLaunchIcon className="w-5 h-5" />
                    revolutionizing voting
                  </motion.span>
                  .
                </div>
              </motion.div>

              {/* Enhanced floating decorative elements */}
              <motion.div
                className="absolute -top-4 -left-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-60 shadow-lg"
                animate={{ 
                  scale: [1, 1.8, 0.8, 1],
                  opacity: [0.6, 0.2, 0.8, 0.6],
                  rotate: [0, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -bottom-2 -right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 shadow-lg"
                animate={{ 
                  scale: [1, 2.2, 0.6, 1],
                  opacity: [0.6, 0.1, 0.9, 0.6],
                  rotate: [0, -360]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
            </motion.div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100/50 dark:border-gray-700/50 hover:shadow-3xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 hover:scale-[1.02] overflow-hidden">
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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
                  <div className="flex items-center mb-8">
                    <motion.div 
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, 15]
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <RocketLaunchIcon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-2">
                        Our Mission
                      </h2>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">Driving democratic innovation</p>
                    </div>
                  </div>
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    At Votely, our mission is to empower individuals and organizations with a secure, accessible, and transparent online voting platform. We believe that every vote
                    should be counted accurately and fairly, and we are committed to providing a solution that ensures the integrity of the voting process while making democracy more accessible to everyone.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Journey Timeline */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-6 border border-green-200 dark:border-green-700"
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Our Journey</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Milestones That Define Us
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From humble beginnings to global impact - our journey of innovation and growth
              </p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 rounded-full"></div>
              
              <div className="space-y-12">
                {milestones.map((milestone, index) => {
                  const Icon = milestone.icon;
                  return (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                        <div className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100/50 dark:border-gray-700/50">
                          <div className="flex items-center mb-4">
                            <motion.div 
                              className={`w-12 h-12 bg-gradient-to-r ${milestone.color} rounded-xl flex items-center justify-center mr-4 shadow-lg`}
                              whileHover={{ scale: 1.1, rotate: 360 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Icon className="w-6 h-6 text-white" />
                            </motion.div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{milestone.title}</h3>
                              <p className="text-blue-600 dark:text-blue-400 font-semibold">{milestone.year}</p>
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Timeline dot */}
                      <div className="relative z-10">
                        <motion.div 
                          className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg border-4 border-white dark:border-gray-800"
                          whileHover={{ scale: 1.3 }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      
                      <div className="w-1/2"></div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6 border border-purple-200 dark:border-purple-700"
              >
                <motion.div
                  className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Meet Our Founder</span>
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  The Mind Behind Votely
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                A passionate solo entrepreneur driving innovation in digital democracy
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              <div className="max-w-2xl w-full">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative backdrop-blur-xl rounded-2xl transition-all duration-300 overflow-hidden"
                >
                  
                  <div className="relative z-10 p-8 md:p-10">
                    {/* Enhanced Header Section */}
                    <div className="text-center mb-10">
                      <div className="relative mb-8">
                        <motion.div 
                          className="w-36 h-36 mx-auto relative group"
                          whileHover={{ scale: 1.05, rotate: [0, 10] }}
                          transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
                        >
                          {/* Glowing background effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                          
                          <img
                            src={member.img}
                            alt={member.name}
                            className="relative z-10 w-full h-full object-cover rounded-full border-3 border-gradient-to-br from-blue-400 to-purple-500 group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300 shadow-lg group-hover:shadow-xl"
                            loading="lazy"
                            onError={(e) => {
                              console.log('Image failed to load:', e.target.src);
                            }}
                          />
                          
                          {/* Enhanced status indicator with pulse effect */}
                          <motion.div
                            className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white dark:border-gray-900 shadow-lg"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              boxShadow: [
                                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                                "0 0 0 10px rgba(34, 197, 94, 0)",
                                "0 0 0 0 rgba(34, 197, 94, 0)"
                              ]
                            }}
                            transition={{ 
                              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                            }}
                          />
                          
                          {/* Floating achievement badge */}
                          <motion.div
                            className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                            animate={{ 
                              y: [0, -5, 0],
                              rotate: [0, 15]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <TrophyIcon className="w-4 h-4 text-white" />
                          </motion.div>
                        </motion.div>
                      </div>
                      
                      {/* Enhanced name with gradient text effect */}
                      <motion.h3 
                        className="text-3xl font-bold mb-3 relative"
                        whileHover={{ 
                          scale: 1.02,
                          filter: "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                          {member.name}
                        </span>
                        {/* Animated underline */}
                        <motion.div
                          className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.h3>
                      
                      {/* Enhanced role with icon */}
                      <motion.div 
                        className="flex items-center justify-center gap-2 mb-6"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.div
                          className="w-5 h-5 text-blue-500"
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        >
                          <CodeBracketIcon />
                        </motion.div>
                        <motion.p 
                          className="text-lg text-gray-600 dark:text-gray-400 font-medium"
                        >
                          {member.role}
                        </motion.p>
                      </motion.div>
                      
                      {/* Enhanced availability status */}
                      <motion.div
                        className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium border border-green-200 dark:border-green-700 shadow-sm"
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 4px 12px rgba(34, 197, 94, 0.3)"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                          animate={{ 
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.7, 1]
                          }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="font-semibold">Available for Collaboration</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <ArrowRightIcon className="w-3 h-3" />
                        </motion.div>
                      </motion.div>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-8">
                      <motion.p 
                        className="text-base text-gray-600 dark:text-gray-400 leading-relaxed text-center max-w-lg mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {member.bio}
                      </motion.p>
                    </div>

                    {/* Enhanced Expertise Section */}
                    <div className="mb-8">
                      <motion.h4 
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center relative"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.span
                          className="inline-block"
                          whileHover={{ 
                            scale: 1.05,
                            y: -1,
                            filter: "drop-shadow(0 4px 8px rgba(59, 130, 246, 0.2))"
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          Expertise
                        </motion.span>
                      </motion.h4>
                      
                      <div className="flex flex-wrap gap-3 justify-center">
                        {member.expertise.map((skill, skillIndex) => (
                          <motion.span
                            key={skill}
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ 
                              delay: skillIndex * 0.1,
                              type: "spring",
                              stiffness: 200,
                              damping: 15
                            }}
                            whileHover={{ 
                              scale: 1.1,
                              y: -2,
                              rotate: [0, 15],
                              boxShadow: "0 8px 25px -5px rgba(59, 130, 246, 0.3)"
                            }}
                            whileTap={{ scale: 0.95 }}
                            viewport={{ once: true }}
                            className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold border border-gray-200/50 dark:border-gray-600/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300 shadow-sm hover:shadow-md relative overflow-hidden group"
                          >
                            {/* Animated background effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100"
                              initial={{ x: "-100%" }}
                              whileHover={{ x: "100%" }}
                              transition={{ duration: 0.6 }}
                            />
                            <span className="relative z-10 flex items-center gap-2">
                              <motion.div
                                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
                                animate={{ 
                                  scale: [1, 1.3, 1],
                                  opacity: [0.7, 1, 0.7]
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity, 
                                  delay: skillIndex * 0.2 
                                }}
                              />
                              {skill}
                            </span>
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mb-8">
                      <motion.h4 
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        Highlights
                      </motion.h4>
                      <div className="grid grid-cols-3 gap-3">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">100%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Solo Built</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">24/7</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Uptime</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                          className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">∞</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Innovation</div>
                        </motion.div>
                      </div>
                    </div>

                    {/* Enhanced Social Links Section */}
                    <div className="text-center">
                      <motion.h4 
                        className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        Connect & Collaborate
                        <motion.div
                          className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                        />
                      </motion.h4>
                      
                      <div className="flex justify-center gap-4">
                        {/* Show all available social icons for the member */}
                        {Object.entries(member.social).map(([platform, url], index) => {
                          if (!url) return null;

                          // Icon components (replace with your icon imports if needed)
                          const icons = {
                            linkedin: <FaLinkedin className="w-6 h-6" />, 
                            github: <FaGithub className="w-6 h-6" />, 
                            instagram: <FaInstagram className="w-6 h-6" />, 
                            x: <FaXTwitter className="w-6 h-6" />, 
                            reddit: <FaReddit className="w-6 h-6" />
                          };

                          // fallback for unknown platforms
                          const icon = icons[platform] || (
                            <span className="text-xs font-semibold capitalize">{platform}</span>
                          );

                          return (
                            <motion.a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ 
                                delay: 0.9 + index * 0.15,
                                type: "spring",
                                stiffness: 200
                              }}
                              whileHover={{ 
                                scale: 1.15,
                                y: -5,
                                rotate: 10
                              }}
                              whileTap={{ scale: 0.9 }}
                              className="group relative w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl flex items-center justify-center text-gray-700 dark:text-gray-300 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-300 border border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-500"
                            >
                              {/* Glowing background effect on hover */}
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 blur-sm pointer-events-none"
                                animate={false}
                                transition={{ duration: 0.3 }}
                              />
                              {/* Platform icon with enhanced styling */}
                              <motion.span 
                                className="relative z-10"
                                whileHover={{ scale: 1.1 }}
                              >
                                {icon}
                              </motion.span>
                            </motion.a>
                          );
                        })}
                      </div>
                      
                      {/* Enhanced call-to-action text */}
                      <motion.p 
                        className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        Let's build the future of voting together
                      </motion.p>
                    </div>
                  </div>
                </motion.div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 md:p-12 text-center overflow-hidden"
            >
              {/* Animated Background Elements */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 20, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
              />
              
              <div className="relative z-10 max-w-3xl mx-auto">
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold text-white mb-6"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  Ready to Get Started?
                </motion.h2>
                <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                  If you have any questions or would like to learn more about Votely, please don't hesitate to contact us. We're here to help you make your voting process secure and efficient.
                </p>
                <Link to="/contact">
                  <motion.button
                    className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Contact Us"
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5" />
                    Contact Us
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AboutUs; 