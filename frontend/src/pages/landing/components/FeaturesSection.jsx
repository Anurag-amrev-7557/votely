import React from 'react';

const FeatureCard = ({ icon, title, description, imageUrl, index }) => (
  <div className="group relative flex flex-col gap-3 pb-3 transition-all duration-300 hover:scale-[1.02] sm:min-h-[400px]">
    
    
    {/* Image Container */}
    <div className="relative aspect-video">
      <div
        className="w-full h-full bg-center bg-no-repeat bg-cover rounded-xl transition-all duration-300 group-hover:shadow-lg overflow-hidden"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-100 transition-opacity duration-300 group-hover:from-black/50 group-hover:opacity-100"></div>
      </div>
      
      {/* Feature Number Badge */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-[2px] rounded-full text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1.5 transition-colors duration-300 will-change-[background-color]">
        <span className="w-5 h-5 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold transition-colors duration-300 will-change-[background-color]">
          {index + 1}
        </span>
        Feature
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
    </div>

    {/* Content Container */}
    <div className="relative flex items-start gap-3 p-4 flex-1">
      {/* Icon Container */}
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300 will-change-[background-color] flex-shrink-0">
        {icon}
      </div>

      {/* Text Content */}
      <div className="flex-1 min-h-[80px]">
        <p className="text-gray-900 dark:text-white text-base font-semibold leading-normal mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 will-change-[color]">
          {title}
        </p>
        <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal transition-colors duration-300 will-change-[color]">
          {description}
        </p>
      </div>
    </div>

    {/* Learn More Link */}
    <div className="px-4 pb-4 min-h-[40px]">
      <a href="#" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Learn more
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>

    {/* Decorative Elements */}
    <div className="absolute -right-2 -top-2 w-24 h-24 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
    <div className="absolute -left-2 -bottom-2 w-24 h-24 bg-indigo-200 dark:bg-indigo-900/20 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
  </div>
);

const FeaturesSection = () => (
  <div className="w-full flex flex-col gap-8 sm:gap-12 px-4 @container rounded-xl relative overflow-hidden">

    <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto relative min-h-[120px] w-full">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mx-auto mb-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Powerful Features
      </div>
      <h1 className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
        Everything You Need for Secure Voting
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-normal">
        Votely offers a comprehensive suite of features designed to enhance the voting experience and ensure the integrity of every vote.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative w-full">
      <FeatureCard
        index={0}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 dark:text-blue-400"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            <path d="M9 12l2 2 4-4" />
            <path d="M12 2v4" />
            <path d="M12 18v4" />
          </svg>
        }
        title="End-to-End Security"
        description="Advanced encryption and security measures to protect the integrity of every vote."
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCImRpMJbw6NJe3sKp-VwJSkIZEx3qS859OjXDQay1ID6trYEDjwE4uUZLB-N6AInzS_FdPNM71YGUk0jndqKi7OFlqxyKb24dAFd3gIoIQmDIf-oAKE2btPc53ZGDYueyvtgq07EoWkEYHc_CoU8JhFZFLN5_7ROYRoHcsZ4FDnSMlimGbeT1B30Rm7er0En3phHH9RyLyXWeTDzHySfwDZDgY_Jw0bdipVfYTepktEt3CTLQ-KlA159St8iBhkiV0TKW8fV8isfg"
      />
      <FeatureCard
        index={1}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 dark:text-blue-400"
          >
            <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
            <path d="M8.5 8.5v.01" />
            <path d="M16 15.5v.01" />
            <path d="M12 12v.01" />
            <path d="M11 17v.01" />
            <path d="M7 14v.01" />
          </svg>
        }
        title="Universal Accessibility"
        description="Designed for everyone with support for screen readers, keyboard navigation, and high contrast modes."
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuCEmbNMcibtHC0idiNIshqEceQlpt00c5onlLbHmKYJuOJIL4D71lJ7ker7-FtRssWO03uNQ7vFbPeO4NKsL-dmqED8axLmzhdTbVfabs83-fFmSZdL7qGZEP0UJSlQLPP01UFEQzZKABYSARRwODsyePkFncsWvkLqK_hIwEVhaPehPXkMqw5NgTJ8Wfnh_fEYw3OOYQlq4c7ZklSvclmbY4vLFNolTgfVpWnvA1vDqM74tOiXgthO05GM34mYxOC6OQVFe_5HuxA"
      />
      <FeatureCard
        index={2}
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-blue-600 dark:text-blue-400"
          >
            <path d="M12 2v4" />
            <path d="M12 18v4" />
            <path d="M4.93 4.93l2.83 2.83" />
            <path d="M16.24 16.24l2.83 2.83" />
            <path d="M2 12h4" />
            <path d="M18 12h4" />
            <path d="M4.93 19.07l2.83-2.83" />
            <path d="M16.24 7.76l2.83-2.83" />
          </svg>
        }
        title="Intuitive Experience"
        description="Simple and straightforward interface that makes voting easy for everyone, from first-time users to administrators."
        imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuBksrhtFAIdg2kwABWsJP1BiX8s23v42Jp5alMqjEJFDr1pMwV2ZOjNlFZh_1ogdqeaz0xyXNXpM9Wa3SbnbGVwcq0_ObkfmaF6xr98PA1I_sfJFL4YmmU9geX707-hvegI8mVjjCl4oi2lg8t9_753ymVMFjHMWpMMjJZzIyx-lJqspSpr-sHHKeM07TptJu_Stk2RuNlcL0WpcB7Pp-TbAq2xe1fegKn3v7rxmJ7_6tpHDJmrYwOK7rxqOFwwDCdb_LQIYCwtA4Y"
      />
    </div>

    {/* Additional Features List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 w-full">
      {[
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          ),
          text: "End-to-End Encryption"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          ),
          text: "Real-time Analytics"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          ),
          text: "Multi-language Support"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          ),
          text: "Mobile Responsive"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          text: "Instant Results"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          text: "Fraud Prevention"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          ),
          text: "Custom Ballots"
        },
        { 
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
          text: "Automated Notifications"
        }
      ].map((feature, index) => (
        <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 min-h-[48px]">
          <div className="text-blue-600 dark:text-blue-400 flex-shrink-0">
            {feature.icon}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">{feature.text}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FeaturesSection; 