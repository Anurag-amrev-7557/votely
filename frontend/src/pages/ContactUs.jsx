import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ContactUs = () => {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    alert('Thank you for contacting us!');
  };

  return (
    <div
      className={`relative flex size-full min-h-screen flex-col bg-gray-50 dark:bg-gray-900 group/design-root overflow-x-hidden ${isDarkMode ? 'dark' : ''}`}
      style={{ fontFamily: 'Inter, Noto Sans, sans-serif' }}
      role="main"
      aria-label="Contact Votely main content"
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container mt-16 flex flex-col md:flex-row max-w-[960px] flex-1 gap-8">
            <div className="flex-1 flex flex-col">
              <div className="flex flex-wrap justify-between gap-3 p-4">
                <div className="flex min-w-72 flex-col gap-3">
                  <p className="text-gray-900 dark:text-white tracking-light text-[32px] font-bold leading-tight">Contact Us</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal">We're here to help. Reach out to us through any of the channels below.</p>
                </div>
              </div>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Contact Form</h3>
              <form onSubmit={handleSubmit}>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Your Name</p>
                    <input
                      placeholder="Enter your name"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-400 h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      aria-label="Your Name"
                    />
                  </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Your Email</p>
                    <input
                      placeholder="Enter your email"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-400 h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      aria-label="Your Email"
                    />
                  </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Subject</p>
                    <input
                      placeholder="Enter the subject"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-400 h-14 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      aria-label="Subject"
                    />
                  </label>
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <p className="text-gray-900 dark:text-white text-base font-medium leading-normal pb-2">Message</p>
                    <textarea
                      placeholder="Enter your message"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-gray-900 dark:text-white focus:outline-0 focus:ring-0 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:border-blue-400 min-h-36 placeholder:text-gray-400 dark:placeholder:text-gray-500 p-[15px] text-base font-normal leading-normal"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      aria-label="Message"
                    />
                  </label>
                </div>
                <div className="flex px-4 py-3 justify-start">
                  <button
                    type="submit"
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    aria-label="Submit Contact Form"
                  >
                    <span className="truncate">Submit</span>
                  </button>
                </div>
              </form>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Email</h3>
              <p className="text-gray-900 dark:text-gray-200 text-base font-normal leading-normal pb-3 pt-1 px-4">For general inquiries, email us at <a href="mailto:support@votely.com" className="text-blue-600 dark:text-blue-400 hover:underline">support@votely.com</a></p>
              <h3 className="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Social Media</h3>
              <div className="@container">
                <div className="gap-2 px-4 flex flex-wrap justify-start">
                  <div className="flex flex-col items-center gap-2 py-2.5 text-center w-20">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2.5">
                      <div className="text-gray-900 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Twitter</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 py-2.5 text-center w-20">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2.5">
                      <div className="text-gray-900 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Facebook</p>
                  </div>
                  <div className="flex flex-col items-center gap-2 py-2.5 text-center w-20">
                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-2.5">
                      <div className="text-gray-900 dark:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-900 dark:text-white text-sm font-medium leading-normal">Instagram</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex flex-1 items-center justify-center">
              <motion.svg
                width="380"
                height="320"
                viewBox="0 0 380 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full max-w-md drop-shadow-xl text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                aria-hidden="true"
                focusable="false"
              >
                {/* Desktop window */}
                <motion.rect
                  x="40" y="60" width="300" height="180" rx="18"
                  fill="currentColor" stroke="currentColor" strokeWidth="2.5"
                  className="text-white dark:text-gray-800"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.6 }}
                />
                {/* Header bar */}
                <motion.rect
                  x="40" y="60" width="300" height="36" rx="10"
                  fill="currentColor"
                  className="text-gray-100 dark:text-gray-700"
                  initial={{ width: 0 }}
                  animate={{ width: 300 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                />
                {/* Dots */}
                <motion.circle cx="60" cy="78" r="5" fill="currentColor" className="text-blue-500 dark:text-blue-400" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} />
                <motion.circle cx="75" cy="78" r="5" fill="currentColor" className="text-yellow-500 dark:text-yellow-400" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 }} />
                <motion.circle cx="90" cy="78" r="5" fill="currentColor" className="text-green-500 dark:text-green-400" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
                {/* Contact form fields */}
                <motion.rect x="70" y="110" width="220" height="16" rx="8" fill="currentColor" className="text-gray-100 dark:text-gray-700" initial={{ width: 0 }} animate={{ width: 220 }} transition={{ delay: 0.6, duration: 0.5 }} />
                <motion.rect x="70" y="140" width="180" height="14" rx="7" fill="currentColor" className="text-gray-100 dark:text-gray-700" initial={{ width: 0 }} animate={{ width: 180 }} transition={{ delay: 0.7, duration: 0.5 }} />
                <motion.rect x="70" y="165" width="140" height="12" rx="6" fill="currentColor" className="text-gray-100 dark:text-gray-700" initial={{ width: 0 }} animate={{ width: 140 }} transition={{ delay: 0.8, duration: 0.5 }} />
                {/* Send button */}
                <motion.rect x="70" y="195" width="100" height="32" rx="16" fill="currentColor" className="text-blue-500 dark:text-blue-400" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1, duration: 0.3 }} />
                <motion.text x="120" y="215" fill="currentColor" className="text-white dark:text-white" fontSize="14" fontWeight="500" textAnchor="middle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
                  Send
                </motion.text>
                {/* Floating envelope */}
                <motion.g
                  initial={{ y: 0 }}
                  animate={{ y: [0, -18, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <rect x="250" y="30" width="60" height="36" rx="8" fill="currentColor" className="text-indigo-500 dark:text-indigo-400" />
                  <polygon points="250,30 280,60 310,30" fill="currentColor" className="text-white dark:text-white" opacity="0.7" />
                  <polygon points="250,66 280,46 310,66" fill="currentColor" className="text-white dark:text-white" opacity="0.9" />
                  <rect x="250" y="30" width="60" height="36" rx="8" fill="none" stroke="currentColor" className="text-indigo-500 dark:text-indigo-400" strokeWidth="2" />
                </motion.g>
                {/* Animated chat bubbles */}
                <motion.ellipse
                  cx="90" cy="260" rx="28" ry="16" fill="currentColor" className="text-blue-500 dark:text-blue-400" opacity="0.18"
                  animate={{ cy: [260, 250, 260] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.ellipse
                  cx="90" cy="260" rx="18" ry="10" fill="currentColor" className="text-blue-500 dark:text-blue-400" opacity="0.32"
                  animate={{ cy: [260, 250, 260] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                />
                <motion.ellipse
                  cx="300" cy="270" rx="22" ry="12" fill="currentColor" className="text-indigo-500 dark:text-indigo-400" opacity="0.18"
                  animate={{ cy: [270, 260, 270] }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.ellipse
                  cx="300" cy="270" rx="12" ry="7" fill="currentColor" className="text-indigo-500 dark:text-indigo-400" opacity="0.32"
                  animate={{ cy: [270, 260, 270] }}
                  transition={{ duration: 2.7, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
                />
              </motion.svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs; 