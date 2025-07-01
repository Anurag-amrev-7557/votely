import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/auth';

const LoginPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  // Client-side validation
  const validate = () => {
    const errs = [];
    if (!formData.email.trim()) errs.push('Email is required');
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) errs.push('Invalid email address');
    if (!formData.password) errs.push('Password is required');
    return errs;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setErrors([result.error || 'Login failed']);
        setIsLoading(false);
        return;
      }
      // Login successful
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setErrors(['Network error. Please try again.']);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setErrors([result.error || 'Google login failed']);
      }
    } catch (err) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`relative flex size-full min-h-screen flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}
    >
      {/* Subtle background pattern */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          className="opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            filter: isDarkMode
              ? 'drop-shadow(0 0 1px #1e293b)'
              : 'drop-shadow(0 0 1px #cbd5e1)',
            transition: 'filter 0.3s'
          }}
        >
          <defs>
            <pattern
              id="dots-login"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="1"
                cy="1"
                r="1"
                fill={isDarkMode ? '#a0aec0' : '#64748b'}
                opacity={isDarkMode ? '0.7' : '0.4'}
              />
            </pattern>
            <linearGradient id="bg-gradient-login" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDarkMode ? "#232946" : "#e0e7ef"} />
              <stop offset="100%" stopColor={isDarkMode ? "#15191e" : "#f8fafc"} />
            </linearGradient>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#bg-gradient-login)"
          />
          <rect
            width="100%"
            height="100%"
            fill="url(#dots-login)"
          />
        </svg>
      </div>
      <div className="layout-container flex h-full grow flex-col">

        <div className="px-4 md:px-40 flex flex-1 justify-center items-center py-5">
          <div className="layout-content-container flex flex-col max-w-[480px] flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                  <div className="flex flex-col items-center">
                    <h2 className={`tracking-light text-4xl font-extrabold leading-tight px-4 text-center pb-3 pt-5 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                      Welcome Back
                    </h2>
                    <p className={`text-base font-medium leading-normal pb-2 pt-1 px-4 text-center ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>
                      Log in to your VoteSafe account
                    </p>
                    <p className={`text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center ${
                      isDarkMode ? 'text-[#a0acbb]' : 'text-gray-500'
                    }`}>
                      Your secure gateway to democratic participation
                    </p>
                  </div>
                </div>
              </div>

              {/* Error messages */}
              {errors.length > 0 && (
                <div className="w-full max-w-[480px] px-4 pb-2" aria-live="assertive">
                  {errors.map((err, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 text-red-500 text-sm font-medium py-1"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                      </svg>
                      {err}
                    </motion.div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        placeholder="Username or Email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl
                          ${isDarkMode
                            ? 'text-white bg-[#232a32] border border-[#3a4654] placeholder:text-[#a0acbb] focus:bg-[#232a32] focus:border-blue-500'
                            : 'text-gray-900 bg-white border border-gray-300 placeholder:text-gray-500 focus:bg-white focus:border-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-400 h-14 p-4 pl-10 text-base font-normal leading-normal transition-colors duration-150`}
                        autoComplete="username"
                      />
                      <svg
                        className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                          isDarkMode ? 'text-[#a0acbb]' : 'text-gray-400'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('email')) && (
                      <div className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                        {errors.find(err => err.toLowerCase().includes('email'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className={`h-5 w-5 ${
                            isDarkMode ? 'text-[#a0acbb]' : 'text-gray-400'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl
                          ${isDarkMode
                            ? 'text-white bg-[#232a32] border border-[#3a4654] placeholder:text-[#a0acbb] focus:bg-[#232a32] focus:border-blue-500'
                            : 'text-gray-900 bg-white border border-gray-300 placeholder:text-gray-500 focus:bg-white focus:border-blue-500'
                          }
                          focus:outline-none focus:ring-2 focus:ring-blue-400 h-14 p-4 pl-10 text-base font-normal leading-normal transition-colors duration-150`}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        tabIndex={-1}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg
                            className={`h-5 w-5 ${
                              isDarkMode
                                ? 'text-[#a0acbb] hover:text-blue-400'
                                : 'text-gray-400 hover:text-blue-600'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className={`h-5 w-5 ${
                              isDarkMode
                                ? 'text-[#a0acbb] hover:text-blue-400'
                                : 'text-gray-400 hover:text-blue-600'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              clipRule="evenodd"
                            />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('password')) && (
                      <div className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>
                        {errors.find(err => err.toLowerCase().includes('password'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="px-4">
                  <label className="flex gap-x-3 py-3 flex-row items-center select-none">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="sr-only"
                        id="rememberMe"
                        aria-checked={formData.rememberMe}
                        tabIndex={0}
                      />
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }))}
                        onKeyDown={e => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            setFormData(prev => ({ ...prev, rememberMe: !prev.rememberMe }));
                          }
                        }}
                        role="checkbox"
                        aria-checked={formData.rememberMe}
                        tabIndex={0}
                        htmlFor="rememberMe"
                        className={`
                          h-5 w-5 rounded transition-colors duration-200 border-2 flex items-center justify-center cursor-pointer
                          ${isDarkMode
                            ? formData.rememberMe
                              ? 'border-blue-500 bg-blue-600'
                              : 'border-[#3f4c5a] bg-[#232b34] hover:bg-[#2a3440]'
                            : formData.rememberMe
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300 bg-white hover:bg-gray-100'
                          }
                          shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                        `}
                        style={{
                          boxShadow: isDarkMode && formData.rememberMe
                            ? '0 0 0 2px #2563eb33'
                            : undefined
                        }}
                      >
                        {formData.rememberMe && (
                          <svg
                            className={`h-3 w-3 ${isDarkMode ? 'text-white' : 'text-white'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className={`text-base font-normal leading-normal transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-gray-100 hover:text-blue-300'
                        : 'text-gray-900 hover:text-blue-700'
                    }`}>
                      Remember me
                    </p>
                    <span
                      className={`
                        text-xs ml-1 transition-colors duration-200
                        ${isDarkMode
                          ? 'text-gray-500 hover:text-blue-400'
                          : 'text-gray-400 hover:text-blue-600'
                        }
                      `}
                      title="Keep me signed in on this device"
                      aria-label="Keep me signed in on this device"
                    >
                      ⓘ
                    </span>
                  </label>
                </div>

                <div className="flex px-4 py-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className={`
                      relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1
                      bg-gradient-to-r
                      ${isDarkMode
                        ? 'from-blue-700 via-blue-800 to-blue-900'
                        : 'from-blue-500 via-blue-600 to-blue-700'
                      }
                      ${isDarkMode
                        ? 'text-gray-100 shadow-blue-900/40'
                        : 'text-white shadow-lg'
                      }
                      transition-all duration-200
                      text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50
                      active:shadow-md focus:outline-none
                      focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
                      ${isDarkMode ? 'focus:ring-offset-[#15191e]' : 'focus:ring-offset-white'}
                    `}
                    style={{
                      boxShadow: isDarkMode
                        ? '0 4px 24px 0 rgba(30, 64, 175, 0.25)'
                        : undefined
                    }}
                  >
                    {/* Ripple effect */}
                    <span className="absolute inset-0 pointer-events-none" id="ripple-container"></span>
                    {isLoading ? (
                      <div className={`animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 ${isDarkMode ? 'border-gray-200' : 'border-white'}`} />
                    ) : (
                      <span className="truncate">Login</span>
                    )}
                  </motion.button>
                </div>
              </form>

              <Link to="/forgot-password" className={`flex items-center justify-center gap-2 text-sm font-medium leading-normal pb-3 pt-1 px-4 text-center underline transition-colors duration-150 hover:text-blue-600 focus:text-blue-700 ${
                isDarkMode ? 'text-[#a0acbb]' : 'text-gray-600'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657-1.343-3-3-3s-3 1.343-3 3c0 1.657 1.343 3 3 3s3-1.343 3-3zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                Forgot your password? <span className="font-semibold underline">Reset it</span>
              </Link>

              <p className={`flex items-center justify-center gap-2 text-sm font-medium leading-normal pb-3 pt-1 px-4 text-center transition-colors duration-150 ${
                isDarkMode ? 'text-[#a0acbb]' : 'text-gray-600'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-blue-600 underline hover:text-blue-700">
                  Sign up now
                </Link>
              </p>

              <h3 className={`text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Or login with
              </h3>

              <div className="flex justify-center">
                <div className="flex flex-1 gap-4 flex-wrap px-4 py-3 max-w-[480px] justify-center">
                  {/* Google Login */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sign in with Google"
                    className={`
                      flex items-center justify-center rounded-full h-12 w-12
                      bg-transparent
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      focus:bg-gray-200 dark:focus:bg-gray-700
                      border border-gray-200 dark:border-gray-700
                      transition-all duration-150 p-0 shadow-none focus:outline-none
                    `}
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400 dark:border-gray-300" />
                    ) : (
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21.8055 10.0415H21V10H12V14H17.6515C16.827 16.3285 14.6115 18 12 18C8.6865 18 6 15.3135 6 12C6 8.6865 8.6865 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C6.4775 2 2 6.4775 2 12C2 17.5225 6.4775 22 12 22C17.5225 22 22 17.5225 22 12C22 11.3295 21.931 10.0415 21.8055 10.0415Z" fill={isDarkMode ? "#e5e7eb" : "#4B5563"}/>
                        <path d="M3.15295 7.3455L6.43845 9.755C7.32745 7.554 9.48045 6 12 6C13.5295 6 14.921 6.577 15.9805 7.5195L18.809 4.691C17.023 3.0265 14.634 2 12 2C8.15895 2 4.82795 4.1685 3.15295 7.3455Z" fill={isDarkMode ? "#e5e7eb" : "#4B5563"}/>
                        <path d="M12 22C14.583 22 16.93 21.0115 18.7045 19.404L15.6095 16.785C14.5718 17.5742 13.3038 18.0011 12 18C9.39903 18 7.19053 16.3415 6.35853 14.027L3.09753 16.5395C4.75253 19.778 8.11353 22 12 22Z" fill={isDarkMode ? "#e5e7eb" : "#4B5563"}/>
                        <path d="M21.8055 10.0415H21V10H12V14H17.6515C17.2571 15.1082 16.5467 16.0766 15.608 16.7855L15.6095 16.7845L18.7045 19.4035C18.4855 19.6025 22 17 22 12C22 11.3295 21.931 10.675 21.8055 10.0415Z" fill={isDarkMode ? "#e5e7eb" : "#4B5563"}/>
                      </svg>
                    )}
                  </motion.button>
                  {/* Facebook Login */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sign in with Facebook"
                    className={`
                      flex items-center justify-center rounded-full h-12 w-12
                      bg-transparent
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      focus:bg-gray-200 dark:focus:bg-gray-700
                      border border-gray-200 dark:border-gray-700
                      transition-all duration-150 p-0 shadow-none focus:outline-none
                    `}
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isDarkMode ? "#e5e7eb" : "#4B5563"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </motion.button>
                  {/* Twitter Login */}
                  <motion.button
                    whileHover={{ scale: 1.12 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Sign in with Twitter"
                    className={`
                      flex items-center justify-center rounded-full h-12 w-12
                      bg-transparent
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      focus:bg-gray-200 dark:focus:bg-gray-700
                      border border-gray-200 dark:border-gray-700
                      transition-all duration-150 p-0 shadow-none focus:outline-none
                    `}
                    disabled={isLoading}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill={isDarkMode ? "#e5e7eb" : "#4B5563"}/>
                    </svg>
                  </motion.button>
                </div>
              </div>
              {/* Continue as Guest Button */}
              <div className="flex justify-center w-full max-w-[480px] px-4 mt-2">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className={`
                    relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center
                    overflow-hidden rounded-xl h-10 px-4 flex-1
                    bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600
                    dark:from-gray-700 dark:via-gray-800 dark:to-gray-900
                    text-white dark:text-gray-100
                    shadow-lg dark:shadow-gray-900/40
                    transition-all duration-200 text-sm font-bold leading-normal tracking-[0.015em]
                    active:shadow-md focus:outline-none
                    focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600
                    focus:ring-offset-2 dark:focus:ring-offset-gray-900
                    hover:bg-gradient-to-r hover:from-gray-500 hover:via-gray-600 hover:to-gray-700
                    dark:hover:from-gray-800 dark:hover:via-gray-900 dark:hover:to-gray-950
                  `}
                  onClick={() => navigate('/')}
                >
                  Continue as Guest
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginPage; 