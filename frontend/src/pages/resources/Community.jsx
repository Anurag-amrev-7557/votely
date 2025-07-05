import { motion } from 'framer-motion';
import { 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon,
  RocketLaunchIcon,
  GlobeAltIcon,
  CalendarIcon,
  MapPinIcon,
  ArrowRightIcon,
  PlayIcon,
  BookOpenIcon,
  CodeBracketIcon,
  LightBulbIcon,
  TrophyIcon,
  UsersIcon,
  MegaphoneIcon,
  ClockIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  CheckCircleIcon
} from '../../components/ui/icons';

const communityStats = [
  { 
    label: 'Active Members', 
    value: '15,000+', 
    icon: UsersIcon, 
    color: 'from-blue-500 to-purple-600',
    description: 'Engaged community members',
    trend: '+12% this month'
  },
  { 
    label: 'Discussions', 
    value: '2,500+', 
    icon: ChatBubbleLeftRightIcon, 
    color: 'from-green-500 to-blue-600',
    description: 'Active conversations',
    trend: '+8% this week'
  },
  { 
    label: 'Countries', 
    value: '45+', 
    icon: GlobeAltIcon, 
    color: 'from-purple-500 to-pink-600',
    description: 'Global reach',
    trend: '+3 new countries'
  },
  { 
    label: 'Events', 
    value: '120+', 
    icon: CalendarIcon, 
    color: 'from-orange-500 to-red-600',
    description: 'Community gatherings',
    trend: '+15 this quarter'
  },
  { 
    label: 'Contributors', 
    value: '850+', 
    icon: CodeBracketIcon, 
    color: 'from-indigo-500 to-cyan-600',
    description: 'Code contributors',
    trend: '+25 this month'
  },
  { 
    label: 'Solutions', 
    value: '3,200+', 
    icon: LightBulbIcon, 
    color: 'from-yellow-500 to-orange-600',
    description: 'Shared solutions',
    trend: '+18% this week'
  }
];

const upcomingEvents = [
  {
    title: 'Votely Community Meetup',
    date: '2025-02-15',
    time: '6:00 PM EST',
    location: 'Virtual',
    type: 'Meetup',
    attendees: 45,
    description: 'Join us for an evening of networking, demos, and discussions about the future of voting technology.',
    featured: true,
    tags: ['Networking', 'Demos', 'Future Tech'],
    registrationUrl: 'https://meetup.votely.com/community-feb15',
    maxCapacity: 100,
    speakers: ['Sarah Chen', 'David Lee'],
    duration: '2 hours',
    timezone: 'America/New_York'
  },
  {
    title: 'API Workshop: Building Scalable Voting Solutions',
    date: '2025-02-22',
    time: '2:00 PM EST',
    location: 'Virtual',
    type: 'Workshop',
    attendees: 32,
    description: 'Learn how to build powerful integrations with the Votely API. Perfect for developers looking to create scalable voting solutions.',
    featured: false,
    tags: ['API', 'Development', 'Hands-on'],
    registrationUrl: 'https://workshop.votely.com/api-feb22',
    maxCapacity: 50,
    speakers: ['Alex Johnson', 'Maria Rodriguez'],
    duration: '3 hours',
    timezone: 'America/New_York',
    prerequisites: ['Basic JavaScript knowledge', 'API concepts']
  },
  {
    title: 'Security Best Practices for Enterprise Voting Systems',
    date: '2025-03-01',
    time: '1:00 PM EST',
    location: 'Virtual',
    type: 'Webinar',
    attendees: 78,
    description: 'Deep dive into security best practices for enterprise voting systems. Learn from industry experts about protecting your voting infrastructure.',
    featured: true,
    tags: ['Security', 'Enterprise', 'Best Practices'],
    registrationUrl: 'https://webinar.votely.com/security-mar01',
    maxCapacity: 200,
    speakers: ['Michael Chen', 'Security Expert Panel'],
    duration: '1.5 hours',
    timezone: 'America/New_York',
    certification: 'Security Certificate available'
  },
  {
    title: 'Votely Hackathon 2025',
    date: '2025-03-15',
    time: '9:00 AM EST',
    location: 'Hybrid (Virtual + NYC)',
    type: 'Hackathon',
    attendees: 0,
    description: 'Build innovative voting solutions in our 48-hour hackathon. Compete for prizes and recognition in the Votely ecosystem.',
    featured: true,
    tags: ['Hackathon', 'Innovation', 'Competition'],
    registrationUrl: 'https://hackathon.votely.com/2025',
    maxCapacity: 500,
    speakers: ['All Votely Team'],
    duration: '48 hours',
    timezone: 'America/New_York',
    prizes: ['$10,000 Grand Prize', 'API Credits', 'Mentorship']
  },
  {
    title: 'Community Office Hours',
    date: '2025-02-28',
    time: '4:00 PM EST',
    location: 'Virtual',
    type: 'Office Hours',
    attendees: 12,
    description: 'Drop-in session for community questions, feedback, and casual discussions with the Votely team.',
    featured: false,
    tags: ['Q&A', 'Feedback', 'Casual'],
    registrationUrl: 'https://officehours.votely.com/feb28',
    maxCapacity: 30,
    speakers: ['Community Team'],
    duration: '1 hour',
    timezone: 'America/New_York',
    recurring: 'Every last Friday'
  }
];

const communityForums = [
  {
    name: 'General Discussion',
    description: 'Connect with the community and discuss all things Votely. Share experiences, ask questions, and engage in meaningful conversations.',
    topics: 156,
    posts: 892,
    icon: ChatBubbleLeftRightIcon,
    color: 'from-blue-500 to-purple-600',
    activeUsers: 342,
    lastActivity: '2 hours ago',
    category: 'Community',
    featured: true,
    rules: ['Be respectful', 'Stay on topic', 'No spam'],
    moderators: ['Sarah Johnson', 'Community Team']
  },
  {
    name: 'Technical Support',
    description: 'Get expert help with technical issues, API integration problems, and troubleshooting. Our community experts are here to assist you.',
    topics: 234,
    posts: 1245,
    icon: CodeBracketIcon,
    color: 'from-green-500 to-blue-600',
    activeUsers: 567,
    lastActivity: '15 minutes ago',
    category: 'Support',
    featured: true,
    rules: ['Search before posting', 'Include error details', 'Use code blocks'],
    moderators: ['Michael Chen', 'Technical Team'],
    responseTime: '< 2 hours'
  },
  {
    name: 'Feature Requests',
    description: 'Shape the future of Votely! Suggest new features, vote on ideas, and help prioritize what gets built next.',
    topics: 89,
    posts: 456,
    icon: LightBulbIcon,
    color: 'from-yellow-500 to-orange-600',
    activeUsers: 234,
    lastActivity: '1 day ago',
    category: 'Product',
    featured: false,
    rules: ['Check existing requests', 'Provide use cases', 'Be specific'],
    moderators: ['Product Team'],
    votingEnabled: true,
    topRequests: ['Dark Mode', 'Mobile SDK', 'Analytics Dashboard']
  },
  {
    name: 'Showcase',
    description: 'Celebrate success! Share your Votely implementations, case studies, and inspire others with your innovative solutions.',
    topics: 67,
    posts: 234,
    icon: TrophyIcon,
    color: 'from-purple-500 to-pink-600',
    activeUsers: 189,
    lastActivity: '3 days ago',
    category: 'Community',
    featured: false,
    rules: ['Include screenshots', 'Share code snippets', 'Describe impact'],
    moderators: ['Emily Rodriguez'],
    showcaseAwards: ['Best Integration', 'Most Innovative', 'Community Choice'],
    featuredProjects: ['Election Dashboard', 'Mobile Voting App', 'Analytics Platform']
  },
  {
    name: 'Developer Resources',
    description: 'Access tutorials, code samples, best practices, and development guides to accelerate your Votely integration.',
    topics: 123,
    posts: 678,
    icon: DocumentTextIcon,
    color: 'from-indigo-500 to-cyan-600',
    activeUsers: 445,
    lastActivity: '4 hours ago',
    category: 'Resources',
    featured: true,
    rules: ['Share working code', 'Include explanations', 'Update regularly'],
    moderators: ['Developer Team'],
    resources: ['API Tutorials', 'SDK Examples', 'Best Practices'],
    skillLevels: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    name: 'Events & Meetups',
    description: 'Stay updated on upcoming events, meetups, webinars, and conferences. Connect with fellow developers in person and virtually.',
    topics: 45,
    posts: 189,
    icon: CalendarDaysIcon,
    color: 'from-red-500 to-pink-600',
    activeUsers: 156,
    lastActivity: '1 week ago',
    category: 'Events',
    featured: false,
    rules: ['Post event details', 'Include registration links', 'Share photos'],
    moderators: ['Events Team'],
    upcomingEvents: ['Hackathon 2025', 'API Workshop', 'Community Meetup'],
    eventTypes: ['Virtual', 'In-Person', 'Hybrid']
  }
];

const ambassadors = [
  {
    name: 'Sarah Johnson',
    role: 'Community Lead',
    avatar: 'SJ',
    location: 'San Francisco, CA',
    contributions: 156,
    specialties: ['API', 'Integrations', 'Enterprise'],
    bio: 'Passionate about building inclusive developer communities and fostering meaningful connections.',
    expertise: 'Full-stack development, community building, technical leadership',
    achievements: ['Community Champion 2024', 'Top Contributor Award', 'Mentor of the Year'],
    socialLinks: {
      twitter: '@sarahjohnson',
      linkedin: 'sarah-johnson-dev',
      github: 'sarahjohnson'
    },
    availability: 'Available for 1:1 mentoring',
    languages: ['JavaScript', 'Python', 'Go', 'Rust'],
    certifications: ['AWS Solutions Architect', 'Google Cloud Professional'],
    projects: ['Votely Mobile SDK', 'Community Analytics Dashboard', 'Integration Templates']
  },
  {
    name: 'Michael Chen',
    role: 'Technical Ambassador',
    avatar: 'MC',
    location: 'New York, NY',
    contributions: 234,
    specialties: ['Security', 'Performance', 'Architecture'],
    bio: 'Security-first developer with deep expertise in scalable systems and performance optimization.',
    expertise: 'System architecture, security engineering, performance tuning',
    achievements: ['Security Excellence Award', 'Performance Optimization Champion', 'Architecture Innovation Prize'],
    socialLinks: {
      twitter: '@michaelchen',
      linkedin: 'michael-chen-tech',
      github: 'michaelchen'
    },
    availability: 'Available for technical reviews',
    languages: ['Java', 'C++', 'Rust', 'Assembly'],
    certifications: ['CISSP', 'AWS Security Specialty', 'Kubernetes CKA'],
    projects: ['Secure Voting Protocol', 'Performance Benchmarking Suite', 'Architecture Patterns Library']
  },
  {
    name: 'Emily Rodriguez',
    role: 'Developer Advocate',
    avatar: 'ER',
    location: 'Austin, TX',
    contributions: 189,
    specialties: ['SDKs', 'Documentation', 'Tutorials'],
    bio: 'Developer experience enthusiast creating intuitive tools and comprehensive learning resources.',
    expertise: 'Developer tooling, technical writing, educational content creation',
    achievements: ['Best Documentation Award', 'Developer Experience Champion', 'Content Creator of the Year'],
    socialLinks: {
      twitter: '@emilyrodriguez',
      linkedin: 'emily-rodriguez-dev',
      github: 'emilyrodriguez'
    },
    availability: 'Available for content collaboration',
    languages: ['TypeScript', 'React', 'Node.js', 'Python'],
    certifications: ['Google Developer Expert', 'Microsoft MVP', 'Content Strategy Professional'],
    projects: ['Interactive API Playground', 'Video Tutorial Series', 'Developer Onboarding Kit']
  },
  {
    name: 'David Kim',
    role: 'Integration Specialist',
    avatar: 'DK',
    location: 'Seattle, WA',
    contributions: 312,
    specialties: ['Third-party Integrations', 'Webhooks', 'API Design'],
    bio: 'Integration expert helping developers seamlessly connect Votely with their existing systems.',
    expertise: 'API design, webhook systems, third-party platform integration',
    achievements: ['Integration Excellence Award', 'Most Helpful Community Member', 'Innovation Catalyst'],
    socialLinks: {
      twitter: '@davidkim',
      linkedin: 'david-kim-integrations',
      github: 'davidkim'
    },
    availability: 'Available for integration consulting',
    languages: ['JavaScript', 'Python', 'PHP', 'Ruby'],
    certifications: ['API Design Professional', 'Webhook Security Expert', 'Integration Architecture'],
    projects: ['Universal Webhook Handler', 'Integration Templates Gallery', 'API Design Guidelines']
  },
  {
    name: 'Lisa Wang',
    role: 'Mobile Development Lead',
    avatar: 'LW',
    location: 'Toronto, Canada',
    contributions: 198,
    specialties: ['Mobile SDKs', 'React Native', 'iOS/Android'],
    bio: 'Mobile development specialist focused on creating smooth, native-like voting experiences.',
    expertise: 'Cross-platform development, mobile UX, performance optimization',
    achievements: ['Mobile Innovation Award', 'Cross-platform Excellence', 'User Experience Champion'],
    socialLinks: {
      twitter: '@lisawang',
      linkedin: 'lisa-wang-mobile',
      github: 'lisawang'
    },
    availability: 'Available for mobile development guidance',
    languages: ['Swift', 'Kotlin', 'React Native', 'Flutter'],
    certifications: ['Apple Developer Program', 'Google Play Console', 'React Native Certified'],
    projects: ['Votely Mobile SDK', 'Cross-platform Templates', 'Mobile Performance Toolkit']
  }
];

export default function Community() {
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
          
          {/* Tertiary floating orb */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-indigo-400/15 via-blue-400/10 to-purple-400/15 dark:from-indigo-500/15 dark:via-blue-500/10 dark:to-purple-500/15 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.2, 0.6, 0.8],
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
            {/* Enhanced Community Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100 via-purple-100 to-indigo-100 dark:from-blue-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-blue-200/50 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <UserGroupIcon className="w-6 h-6" />
                <motion.div
                  className="absolute -inset-2 bg-blue-500/20 rounded-full blur-sm"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
              <span className="font-bold text-base">Join Our Thriving Community</span>
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
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-indigo-400/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
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
                Community
                <motion.div
                  className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.span>
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  className="absolute inset-1 bg-white rounded-full"
                  animate={{ scale: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </motion.h1>

                         {/* Enhanced Subtitle with Interactive Elements */}
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="relative mb-8 max-w-4xl mx-auto"
             >
               <div className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 leading-relaxed">
                 Connect with fellow{' '}
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
                   <CodeBracketIcon className="w-5 h-5" />
                   developers
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     animate={{ rotate: [0, 360] }}
                     transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                   />
                 </motion.span>
                 , share{' '}
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
                   <LightBulbIcon className="w-5 h-5" />
                   knowledge
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     animate={{ rotate: [0, -360] }}
                     transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                   />
                 </motion.span>
                 , and help shape the future of{' '}
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
                   <ShieldCheckIcon className="w-5 h-5" />
                   voting technology
                   <motion.div
                     className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     animate={{ rotate: [0, 360] }}
                     transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                   />
                 </motion.span>
                 .
               </div>
              
              {/* Enhanced floating decorative elements */}
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
                className="absolute -bottom-2 -right-4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 shadow-lg"
                animate={{ 
                  scale: [1, 2.2, 0.6, 1],
                  opacity: [0.6, 0.1, 0.9, 0.6],
                  rotate: [0, -180, -360, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute top-1/2 -right-8 w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full opacity-60 shadow-lg"
                animate={{ 
                  scale: [1, 1.6, 0.7, 1],
                  opacity: [0.6, 0.3, 0.7, 0.6],
                  rotate: [0, 90, 270, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              <motion.div
                className="absolute top-1/4 -left-6 w-1 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50 shadow-md"
                animate={{ 
                  scale: [1, 2.5, 0.5, 1],
                  opacity: [0.5, 0.1, 0.8, 0.5],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-2 w-0.5 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-40 shadow-sm"
                animate={{ 
                  scale: [1, 3, 0.3, 1],
                  opacity: [0.4, 0.05, 0.6, 0.4],
                  x: [0, 8, 0]
                }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
              />
            </motion.div>

            {/* Modern CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {/* Primary CTA */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-medium rounded-lg transition-all duration-300 hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
                <span>Join Discord</span>
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent text-gray-900 dark:text-white font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>Browse Forums</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Community Stats Section */}
      <section className="py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-200 dark:border-blue-700"
            >
              <motion.div
                className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span>Live Statistics</span>
            </motion.div>

            {/* Enhanced Heading with Gradient */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                Community by the Numbers
              </span>
            </motion.h2>

            {/* Enhanced Description with Animation */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
            >
              Our growing global community of developers and voting enthusiasts
            </motion.p>

            {/* Animated Decorative Elements */}
            <motion.div
              className="relative mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="absolute left-1/4 top-0 w-1 h-1 bg-blue-400 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 2, 1],
                  opacity: [0.6, 0.2, 0.6],
                  y: [0, -10, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute right-1/4 top-2 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 3, 1],
                  opacity: [0.6, 0.1, 0.6],
                  y: [0, 8, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute left-1/2 bottom-0 w-0.5 h-0.5 bg-indigo-400 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 2.5, 1],
                  opacity: [0.6, 0.15, 0.6],
                  x: [0, 5, 0]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {communityStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-300 hover:scale-105 hover:border-blue-300 dark:hover:border-blue-600 relative overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Floating Particles */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-60"
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 0.2, 0.6],
                    y: [0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400 rounded-full opacity-60"
                  animate={{ 
                    scale: [1, 2, 1],
                    opacity: [0.6, 0.1, 0.6],
                    x: [0, 3, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />

                <motion.div 
                  className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                  {/* Icon Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                
                <motion.div 
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {stat.value}
                </motion.div>
                
                <div className="text-gray-600 dark:text-gray-300 mb-3 font-medium">
                  {stat.label}
                </div>
                
                {/* Enhanced Description */}
                <motion.div 
                  className="text-sm text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {stat.description}
                </motion.div>
                
                {/* Trend Indicator */}
                <motion.div 
                  className="text-xs text-green-600 dark:text-green-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {stat.trend}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Forums Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span className="relative">
                Active Discussions
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Community
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Forums
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join vibrant discussions, get expert help, and share your knowledge with our global community of developers and voting enthusiasts.
            </motion.p>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <UsersIcon className="w-4 h-4" />
                Expert Community
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <ClockIcon className="w-4 h-4" />
                24/7 Support
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <LightBulbIcon className="w-4 h-4" />
                Knowledge Sharing
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {communityForums.map((forum, index) => (
              <motion.div
                key={forum.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
              >
                {/* Enhanced Background Effects */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-indigo-50/50 dark:from-blue-900/20 dark:via-purple-900/15 dark:to-indigo-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={false}
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                
                <div className="relative z-10 flex items-start gap-4">
                  <motion.div 
                    className={`w-12 h-12 bg-gradient-to-br ${forum.color} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <forum.icon className="w-6 h-6 text-white relative z-10" />
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h3 
                      className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {forum.name}
                    </motion.h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {forum.description}
                    </p>
                    
                    {/* Enhanced Stats Display */}
                    <div className="flex items-center gap-6 text-sm">
                      <motion.div 
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <DocumentTextIcon className="w-4 h-4" />
                        <span className="font-medium">{forum.topics} topics</span>
                      </motion.div>
                      <motion.div 
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChatBubbleLeftRightIcon className="w-4 h-4" />
                        <span className="font-medium">{forum.posts} posts</span>
                      </motion.div>
                    </div>
                    
                    {/* Interactive Join Button */}
                    <motion.button
                      className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 hover:shadow-lg hover:scale-105"
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ArrowRightIcon className="w-4 h-4" />
                      Join Discussion
                    </motion.button>
                  </div>
                </div>
                
                {/* Corner Decoration */}
                <motion.div
                  className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-bl-2xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 via-pink-100 to-indigo-100 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-purple-200/50 dark:border-purple-700/50"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <CalendarDaysIcon className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">Mark Your Calendar</span>
              <motion.div
                className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Upcoming
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                Events
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join our vibrant community at exclusive virtual and in-person events. 
              Connect with fellow developers, learn from experts, and discover the latest 
              innovations in voting technology.
            </motion.p>

            {/* Enhanced Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <UsersIcon className="w-4 h-4" />
                Networking
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <BookOpenIcon className="w-4 h-4" />
                Learning
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <TrophyIcon className="w-4 h-4" />
                Prizes
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      event.type === 'Meetup' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                      event.type === 'Workshop' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {event.attendees} attending
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  
                  <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <CalendarIcon className="w-4 h-4" />
                    Register Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Ambassadors Section */}
      <section className="py-20 px-4 sm:px-8 bg-gradient-to-br from-gray-100/50 to-blue-100/30 dark:from-gray-800/50 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 via-blue-100 to-indigo-100 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-indigo-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-200/50 dark:border-purple-700/50"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <StarIcon className="w-4 h-4" />
              </motion.div>
              Community Leaders
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Meet Our
              <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Ambassadors
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Connect with our community leaders and experts who are passionate about helping developers succeed with Votely
            </motion.p>

            {/* Enhanced Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CheckCircleIcon className="w-4 h-4" />
                Expert Guidance
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <UserGroupIcon className="w-4 h-4" />
                Active Community
              </motion.span>
              <motion.span 
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
              >
                <HeartIcon className="w-4 h-4" />
                Dedicated Support
              </motion.span>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {ambassadors.map((ambassador, index) => (
              <motion.div
                key={ambassador.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {ambassador.avatar}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {ambassador.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                  {ambassador.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {ambassador.location}
                </p>
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {ambassador.contributions} contributions
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {ambassador.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Message
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            {/* Enhanced Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 dark:from-emerald-900/40 dark:via-teal-900/40 dark:to-cyan-900/40 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium mb-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-emerald-200/50 dark:border-emerald-700/50"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <HeartIcon className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">Community Engagement</span>
              <motion.div
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Heading */}
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 dark:from-white dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
                Get Involved
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover meaningful ways to contribute, learn, and grow alongside our vibrant community of developers, creators, and innovators
            </motion.p>

            {/* Enhanced Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 mb-8"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <UsersIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">15,000+ Members</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-2 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-200 dark:border-green-700"
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">2,500+ Discussions</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex items-center gap-3 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700"
              >
                <TrophyIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">500+ Contributors</span>
              </motion.div>
            </motion.div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="group relative text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-green-500/10 dark:hover:shadow-green-400/10 transition-all duration-500 hover:scale-105 hover:border-green-300 dark:hover:border-green-600 overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Floating Particles */}
              <motion.div
                className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-60"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 0.2, 0.6],
                  y: [0, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <ChatBubbleLeftRightIcon className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Join Discussions
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Participate in forum discussions and help other community members with their questions and challenges.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="group relative text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-400/10 transition-all duration-500 hover:scale-105 hover:border-purple-300 dark:hover:border-purple-600 overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
              
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                whileHover={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <LightBulbIcon className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Share Ideas
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Suggest new features and vote on community ideas to help shape the future of Votely.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="group relative text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-orange-500/10 dark:hover:shadow-orange-400/10 transition-all duration-500 hover:scale-105 hover:border-orange-300 dark:hover:border-orange-600 overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 3, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                whileHover={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 0.5 }}
              >
                <BookOpenIcon className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Write Content
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Contribute tutorials, guides, and documentation to help others learn and grow.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="group relative text-center p-8 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/10 transition-all duration-500 hover:scale-105 hover:border-indigo-300 dark:hover:border-indigo-600 overflow-hidden"
            >
              {/* Animated Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, -3, 0]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              />
              
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 relative group-hover:scale-110 transition-transform duration-300 shadow-lg group-hover:shadow-xl"
                whileHover={{ rotate: [0, 3, -3, 0] }}
                transition={{ duration: 0.5 }}
              >
                <MegaphoneIcon className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{ rotate: [0, -360] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              <motion.h3 
                className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                Host Events
              </motion.h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Organize local meetups and community events to bring developers together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative overflow-hidden py-24 px-4 sm:px-8 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Primary floating orb */}
          <motion.div
            className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/5 via-indigo-500/8 to-purple-500/5 dark:from-blue-400/10 dark:via-indigo-400/15 dark:to-purple-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.4, 0.8, 1],
              opacity: [0.1, 0.4, 0.2, 0.1],
              rotate: [0, 180, 360, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Secondary floating orb */}
          <motion.div
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-blue-500/5 dark:from-indigo-400/15 dark:via-purple-400/10 dark:to-blue-400/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 0.8, 1.3, 1.2],
              opacity: [0.2, 0.5, 0.1, 0.2],
              rotate: [360, 180, 0, 360],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
          />
          
          {/* Floating particles */}
          <motion.div
            className="absolute top-20 left-20 w-2 h-2 bg-blue-500/30 dark:bg-blue-400/40 rounded-full"
            animate={{
              y: [0, -30, 0],
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
            className="absolute top-40 right-32 w-1 h-1 bg-indigo-500/40 dark:bg-indigo-400/50 rounded-full"
            animate={{
              y: [0, -20, 0],
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

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            {/* Enhanced Community Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-900 dark:text-white rounded-full text-sm font-medium mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <UserGroupIcon className="w-5 h-5" />
              </motion.div>
              <span className="font-semibold">Join Our Thriving Community</span>
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Enhanced Main Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Ready to Join the{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Community?
              </span>
            </motion.h2>

            {/* Enhanced Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with thousands of developers and voting enthusiasts worldwide. 
              Share knowledge, build amazing projects, and shape the future of voting technology together.
            </motion.p>

            {/* Enhanced Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-blue-600/20"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChatBubbleLeftRightIcon className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">Join Discord</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  <CalendarIcon className="w-6 h-6" />
                </motion.div>
                <span className="text-lg">View Events</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-gray-200/20 via-blue-400/20 to-indigo-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
              </motion.button>
            </motion.div>

            {/* Enhanced Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
            >
              <motion.div 
                className="text-center p-6 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  15,000+
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Active Members</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                >
                  2,500+
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Discussions</div>
              </motion.div>
              <motion.div 
                className="text-center p-6 bg-white/10 dark:bg-gray-800/20 backdrop-blur-sm rounded-2xl border border-white/20 dark:border-gray-700/50"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  45+
                </motion.div>
                <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">Countries</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}