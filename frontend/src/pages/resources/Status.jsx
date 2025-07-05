import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  SignalIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  WifiIcon,
  ServerIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  BellIcon,
  EnvelopeIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const services = [
  {
    name: 'API',
    status: 'operational',
    uptime: '99.99%',
    responseTime: '45ms',
    icon: ServerIcon,
    description: 'REST API and GraphQL endpoints'
  },
  {
    name: 'Web Application',
    status: 'operational',
    uptime: '99.98%',
    responseTime: '120ms',
    icon: GlobeAltIcon,
    description: 'Main web application and dashboard'
  },
  {
    name: 'Database',
    status: 'operational',
    uptime: '99.99%',
    responseTime: '8ms',
    icon: ServerIcon,
    description: 'Primary and replica databases'
  },
  {
    name: 'Authentication',
    status: 'operational',
    uptime: '99.97%',
    responseTime: '65ms',
    icon: ShieldCheckIcon,
    description: 'User authentication and authorization'
  },
  {
    name: 'File Storage',
    status: 'operational',
    uptime: '99.95%',
    responseTime: '180ms',
    icon: WifiIcon,
    description: 'File upload and storage services'
  },
  {
    name: 'Email Service',
    status: 'operational',
    uptime: '99.90%',
    responseTime: '250ms',
    icon: EnvelopeIcon,
    description: 'Email notifications and delivery'
  }
];

const incidents = [
  {
    id: 1,
    title: 'Scheduled Maintenance - Database Optimization',
    status: 'resolved',
    severity: 'maintenance',
    startTime: '2025-01-10T02:00:00Z',
    endTime: '2025-01-10T04:00:00Z',
    description: 'Routine database maintenance and optimization. Some services may experience brief interruptions.',
    updates: [
      {
        time: '2025-01-10T04:15:00Z',
        message: 'Maintenance completed successfully. All services are operational.',
        status: 'resolved'
      },
      {
        time: '2025-01-10T03:45:00Z',
        message: 'Maintenance is progressing as expected. Estimated completion in 15 minutes.',
        status: 'monitoring'
      },
      {
        time: '2025-01-10T02:00:00Z',
        message: 'Scheduled maintenance has begun. Database optimization in progress.',
        status: 'investigating'
      }
    ]
  },
  {
    id: 2,
    title: 'API Response Time Degradation',
    status: 'resolved',
    severity: 'minor',
    startTime: '2025-01-08T14:30:00Z',
    endTime: '2025-01-08T16:45:00Z',
    description: 'Increased API response times affecting some endpoints. Service remains functional.',
    updates: [
      {
        time: '2025-01-08T16:45:00Z',
        message: 'Issue resolved. API response times have returned to normal levels.',
        status: 'resolved'
      },
      {
        time: '2025-01-08T15:30:00Z',
        message: 'Identified the root cause. Implementing fix now.',
        status: 'identified'
      },
      {
        time: '2025-01-08T14:30:00Z',
        message: 'Investigating increased API response times.',
        status: 'investigating'
      }
    ]
  },
  {
    id: 3,
    title: 'Email Delivery Delays',
    status: 'resolved',
    severity: 'minor',
    startTime: '2025-01-05T09:00:00Z',
    endTime: '2025-01-05T11:30:00Z',
    description: 'Some email notifications experiencing delivery delays.',
    updates: [
      {
        time: '2025-01-05T11:30:00Z',
        message: 'Email delivery has returned to normal. All delayed emails have been sent.',
        status: 'resolved'
      },
      {
        time: '2025-01-05T10:15:00Z',
        message: 'Working with email provider to resolve delivery issues.',
        status: 'identified'
      },
      {
        time: '2025-01-05T09:00:00Z',
        message: 'Investigating email delivery delays.',
        status: 'investigating'
      }
    ]
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'operational':
      return 'text-green-600 dark:text-green-400';
    case 'degraded':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'outage':
      return 'text-red-600 dark:text-red-400';
    case 'maintenance':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'operational':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
    case 'degraded':
      return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
    case 'outage':
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    case 'maintenance':
      return <ClockIcon className="w-5 h-5 text-blue-500" />;
    default:
      return <InformationCircleIcon className="w-5 h-5 text-gray-500" />;
  }
};

const getSeverityColor = (severity) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    case 'major':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
    case 'minor':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    case 'maintenance':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300';
  }
};

export default function Status() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1000);
  };

  const overallStatus = services.every(service => service.status === 'operational') 
    ? 'operational' 
    : services.some(service => service.status === 'outage') 
      ? 'outage' 
      : 'degraded';

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
              <SignalIcon className="w-4 h-4" />
              System Status
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
            >
              System
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Status
              </span>
            </motion.h1>

            {/* Overall Status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              {getStatusIcon(overallStatus)}
              <span className={`text-2xl font-semibold ${getStatusColor(overallStatus)}`}>
                {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </span>
            </motion.div>

            {/* Last Updated */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 text-gray-600 dark:text-gray-300"
            >
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Status Section */}
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
              Service Status
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Real-time status of all Votely services
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <service.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {service.description}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(service.status)}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                    <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                      {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.uptime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Response Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.responseTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incident History Section */}
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
              Incident History
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Recent incidents and maintenance updates
            </p>
          </motion.div>

          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <motion.div
                key={incident.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          incident.status === 'resolved' 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                        }`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {incident.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(incident.startTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" />
                          {new Date(incident.startTime).toLocaleTimeString()} - {new Date(incident.endTime).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Updates</h4>
                  <div className="space-y-4">
                    {incident.updates.map((update, updateIndex) => (
                      <div key={updateIndex} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(update.time).toLocaleString()}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              update.status === 'resolved' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                : update.status === 'identified'
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                            }`}>
                              {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 text-sm">
                            {update.message}
                          </p>
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

      {/* Performance Metrics Section */}
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
              Performance Metrics
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              System performance and reliability metrics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                99.98%
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Overall Uptime
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <SignalIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                45ms
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Average Response Time
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ServerIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                6
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Active Services
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                0
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                Active Incidents
              </div>
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
              Stay Updated
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Get notified about system status and incidents
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                <BellIcon className="w-5 h-5" />
                Subscribe to Updates
              </button>
              <button className="inline-flex items-center gap-3 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                <EnvelopeIcon className="w-5 h-5" />
                Contact Support
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
} 