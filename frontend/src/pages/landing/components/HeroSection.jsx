import { memo } from 'react';
import { motion } from 'framer-motion';
import landingHero from '../../../assets/landing-hero.png'; // Adjust the path as necessary
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../../context/AdminAuthContext';

const HeroSection = ({ isVisible }) => {
  const { isAdmin } = useAdminAuth();
  const navigate = useNavigate();

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative mb-16">
      <div className="w-full flex flex-col-reverse @[864px]:flex-row gap-8 @[480px]:gap-10 px-6 py-6 @[480px]:py-10 sm:px-8 transition-colors duration-300 will-change-[background-color]">
        {/* Text Section */}
        <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center flex-1 text-center @[864px]:text-left">
          {/* Badge */}
          <motion.div 
            className="hidden @[480px]:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium w-fit transition-colors duration-300 will-change-[background-color,color]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.svg
              className="w-4 h-4 transition-colors duration-300 will-change-[color]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </motion.svg>
            Trusted by Organizations Worldwide
          </motion.div>

          <div className="flex flex-col gap-4 text-left">
            <div className="relative min-h-[120px] @[480px]:min-h-[140px]">
              <motion.h1 
                className="text-4xl @[480px]:text-5xl @[864px]:text-6xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight transition-colors duration-300 will-change-[color]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Secure Online Voting
                <br />
                <span className="text-blue-600 dark:text-blue-400 transition-colors duration-300 will-change-[color]">
                  Made Simple
                </span>
              </motion.h1>
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-2xl opacity-50" />
            </div>
            <motion.p 
              className="text-lg @[480px]:text-xl text-gray-600 dark:text-gray-300 max-w-2xl transition-colors duration-300 will-change-[color]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Conduct secure, transparent, and efficient elections online. Our platform ensures the integrity of your voting process while making it accessible to all participants.
            </motion.p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-h-[80px]">
            {[
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "End-to-End Encryption" },
              { icon: "M9 19v-6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2zm0 0V9a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10m-6 0a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z", text: "Real-time Results" },
              { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", text: "24/7 Support" }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap transition-colors duration-300 will-change-[color]"
              >
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                </svg>
                <span className="truncate">{feature.text}</span>
              </div>
            ))}
          </div>

          <motion.div 
            className="flex flex-col @[480px]:flex-row flex-wrap gap-3 min-h-[48px] justify-center @[864px]:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/polls">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full @[480px]:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:shadow-xl transform transition-all duration-200 group"
              >
                <span className="truncate">Get Started</span>
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </motion.button>
            </Link>
            <motion.button
              onClick={handleAdminClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full @[480px]:w-auto min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg hover:shadow-xl transform transition-all duration-200 gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="truncate">{isAdmin ? 'Admin Dashboard' : 'Admin Access'}</span>
            </motion.button>
          </motion.div>

          <div className="flex flex-col @[480px]:flex-row items-center gap-4 mt-4 justify-center @[864px]:justify-start">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 will-change-[background-color]"
                  style={{
                    backgroundImage: `url('https://i.pravatar.cc/150?img=${i + 10}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                  aria-label={`Voter avatar ${i}`}
                />
              ))}
            </div>
            <div className="flex flex-col">
              <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300 will-change-[color]">
                Join <span className="font-semibold text-blue-600 dark:text-blue-400">1,000+</span> active voters
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300 will-change-[color]">
                Trusted by organizations worldwide
              </p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <motion.div 
          className="flex-1 min-h-[300px] @[480px]:min-h-[400px] @[864px]:min-h-[500px] hidden @[864px]:flex"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.img
            src={landingHero}
            alt="People voting online illustration"
            className="w-full h-full object-contain drop-shadow-2xl"
            draggable="false"
            loading="eager"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center gap-2 mt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <motion.div
          className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors duration-300 will-change-[color]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Scroll to explore
        </motion.div>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-start justify-center p-1 transition-colors duration-300 will-change-[border-color]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 transition-colors duration-300 will-change-[background-color]"
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default memo(HeroSection); 