import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Client-side validation
  const validate = () => {
    const errs = [];
    if (!formData.name.trim()) errs.push('Name is required');
    else if (formData.name.length < 2 || formData.name.length > 50) errs.push('Name must be 2-50 characters');
    
    if (!formData.email.trim()) errs.push('Email is required');
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) errs.push('Invalid email address');
    
    if (!formData.password) errs.push('Password is required');
    else if (formData.password.length < 8) errs.push('Password must be at least 8 characters');
    else if (!/[A-Z]/.test(formData.password)) errs.push('Password must contain at least one uppercase letter');
    else if (!/[a-z]/.test(formData.password)) errs.push('Password must contain at least one lowercase letter');
    else if (!/[0-9]/.test(formData.password)) errs.push('Password must contain at least one number');
    else if (!/[!@#$%^&*]/.test(formData.password)) errs.push('Password must contain at least one special character');
    
    if (!formData.confirmPassword) errs.push('Confirm password is required');
    else if (formData.confirmPassword !== formData.password) errs.push('Passwords do not match');
    
    if (!formData.agreeToTerms) errs.push('You must agree to the Terms of Service and Privacy Policy');
    
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
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      if (!result.success) {
        setErrors([result.error || 'Registration failed']);
        setIsLoading(false);
        return;
      }
      // Registration successful
      setIsLoading(false);
      navigate('/');
    } catch (err) {
      setErrors(['Network error. Please try again.']);
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    try {
      const result = await loginWithGoogle();
      if (result.success) {
        navigate('/');
      } else {
        setErrors([result.error || 'Google sign-up failed']);
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
      className={`relative flex size-full min-h-screen flex-col ${isDarkMode ? 'bg-[#15191e]' : 'bg-gray-50'} transition-colors duration-200`}
    >
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
                      Create Account
                    </h2>
                    <p className={`text-base font-medium leading-normal pb-2 pt-1 px-4 text-center ${
                      isDarkMode ? 'text-white' : 'text-gray-700'
                    }`}>
                      Join VoteSafe to participate in secure voting
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
                <div className="w-full max-w-[480px] px-4 pb-2">
                  {errors.map((err, idx) => (
                    <div key={idx} className="text-red-500 text-sm font-medium py-1">
                      {err}
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="w-full max-w-[480px]">
                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <input
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl ${
                          isDarkMode ? 'text-white bg-[#2c353f]' : 'text-gray-900 bg-white'
                        } focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-[#a0acbb] p-4 pl-10 text-base font-normal leading-normal`}
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('name')) && (
                      <div className="text-red-500 text-sm font-medium mt-1">
                        {errors.find(err => err.toLowerCase().includes('name'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl ${
                          isDarkMode ? 'text-white bg-[#2c353f]' : 'text-gray-900 bg-white'
                        } focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-[#a0acbb] p-4 pl-10 text-base font-normal leading-normal`}
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('email')) && (
                      <div className="text-red-500 text-sm font-medium mt-1">
                        {errors.find(err => err.toLowerCase().includes('email'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl ${
                          isDarkMode ? 'text-white bg-[#2c353f]' : 'text-gray-900 bg-white'
                        } focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-[#a0acbb] p-4 pl-10 text-base font-normal leading-normal`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('password')) && (
                      <div className="text-red-500 text-sm font-medium mt-1">
                        {errors.find(err => err.toLowerCase().includes('password'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl ${
                          isDarkMode ? 'text-white bg-[#2c353f]' : 'text-gray-900 bg-white'
                        } focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-[#a0acbb] p-4 pl-10 text-base font-normal leading-normal`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.some(err => err.toLowerCase().includes('confirm')) && (
                      <div className="text-red-500 text-sm font-medium mt-1">
                        {errors.find(err => err.toLowerCase().includes('confirm'))}
                      </div>
                    )}
                  </label>
                </div>

                <div className="px-4">
                  <label className="flex gap-x-3 py-3 flex-row items-center">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div
                        onClick={() => setFormData(prev => ({ ...prev, agreeToTerms: !prev.agreeToTerms }))}
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center cursor-pointer ${
                          isDarkMode ? 'border-[#3f4c5a] bg-transparent' : 'border-gray-300 bg-transparent'
                        } ${formData.agreeToTerms ? 'bg-blue-600 border-blue-600' : ''}`}
                      >
                        {formData.agreeToTerms && (
                          <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className={`text-base font-normal leading-normal ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-700">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-700">
                        Privacy Policy
                      </Link>
                    </p>
                  </label>
                  {errors.some(err => err.toLowerCase().includes('agree')) && (
                    <div className="text-red-500 text-sm font-medium mt-1">
                      {errors.find(err => err.toLowerCase().includes('agree'))}
                    </div>
                  )}
                </div>

                <div className="flex px-4 py-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isLoading}
                    className={`relative flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 flex-1 \
                      bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 \
                      text-white shadow-lg transition-all duration-200 \
                      text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 \
                      active:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
                  >
                    {/* Ripple effect */}
                    <span className="absolute inset-0 pointer-events-none" id="ripple-container"></span>
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                      <span className="truncate">Create Account</span>
                    )}
                  </motion.button>
                </div>
              </form>

              <p className={`flex items-center justify-center gap-2 text-sm font-medium leading-normal pb-3 pt-1 px-4 text-center transition-colors duration-150 ${
                isDarkMode ? 'text-[#a0acbb]' : 'text-gray-600'
              }`}>
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Log in
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterPage;