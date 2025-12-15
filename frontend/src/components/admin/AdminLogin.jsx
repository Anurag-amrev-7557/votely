import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { startAuthentication } from '@simplewebauthn/browser';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import axiosInstance from '../../utils/api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  // Enhanced state management
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false
  });



  const [securityState, setSecurityState] = useState({
    error: '',
    isLoading: false,
    isValidating: false,
    showPassword: false,
    showTwoFactor: false,
    attempts: 0,
    lockoutTime: null,
    lastLoginAttempt: null,
    passwordStrength: 0,
    isBiometricAvailable: false,
    biometricSupported: false,
    showSecurityTips: false,
    loginHistory: [],
    deviceFingerprint: null,
    geoLocation: null,
    networkInfo: null
  });

  const [validationState, setValidationState] = useState({
    emailValid: false,
    passwordValid: false,
    twoFactorValid: false,
    formValid: false,
    realTimeValidation: true
  });

  // Refs for advanced functionality
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const twoFactorRef = useRef(null);
  const formRef = useRef(null);
  const biometricRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { login: adminLogin, validateSession, logout } = useAdminAuth();
  const { login: authLogin } = useAuth();

  // Constants
  const from = location.state?.from?.pathname || '/admin';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const PASSWORD_MIN_LENGTH = 8;
  const TWO_FACTOR_LENGTH = 6;

  // Advanced validation patterns
  const VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    // Modified to allow ANY SPECIAL CHARACTER (non-alphanumeric)
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
    twoFactor: /^\d{6}$/
  };

  // Security scoring system
  const calculateSecurityScore = useCallback((data) => {
    let score = 0;

    // Email validation
    if (VALIDATION_PATTERNS.email.test(data.email)) score += 20;

    // Password strength
    if (data.password.length >= PASSWORD_MIN_LENGTH) score += 20;
    if (VALIDATION_PATTERNS.password.test(data.password)) score += 30;

    // Two-factor authentication
    if (data.twoFactorCode && VALIDATION_PATTERNS.twoFactor.test(data.twoFactorCode)) score += 30;

    return Math.min(score, 100);
  }, []);

  // Enhanced form validation with real-time feedback
  const validateForm = useCallback((data = formData) => {
    const errors = [];
    const warnings = [];

    // Email validation
    if (!data.email.trim()) {
      errors.push('Email is required');
    } else if (!VALIDATION_PATTERNS.email.test(data.email)) {
      errors.push('Please enter a valid email address');
    } else if (data.email.includes('+')) {
      warnings.push('Email aliases may not work with admin accounts');
    }

    // Password validation
    if (!data.password) {
      errors.push('Password is required');
    } else {
      if (data.password.length < PASSWORD_MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      }
      if (!VALIDATION_PATTERNS.password.test(data.password)) {
        warnings.push('Password should contain uppercase, lowercase, number, and special character');
      }
    }

    // Two-factor validation
    if (securityState.showTwoFactor && data.twoFactorCode) {
      if (!VALIDATION_PATTERNS.twoFactor.test(data.twoFactorCode)) {
        errors.push('Two-factor code must be 6 digits');
      }
    }

    return { errors, warnings };
  }, [formData, securityState.showTwoFactor]);

  // Device fingerprinting
  const generateDeviceFingerprint = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);

    const fingerprint = {
      canvas: canvas.toDataURL(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
      date: new Date().toISOString()
    };

    return btoa(JSON.stringify(fingerprint));
  }, []);

  // Canvas fingerprinting for additional security
  const generateCanvasFingerprint = useCallback(async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Canvas fingerprint', 2, 2);
    return canvas.toDataURL();
  }, []);

  // Geolocation detection
  const getGeoLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        () => resolve(null),
        { timeout: 5000, enableHighAccuracy: false }
      );
    });
  }, []);

  // Network information
  const getNetworkInfo = useCallback(async () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }, []);

  // Advanced security checks
  const performSecurityChecks = useCallback(async () => {
    const [deviceFingerprint, geoLocation, networkInfo, canvasFingerprint] = await Promise.all([
      generateDeviceFingerprint(),
      getGeoLocation(),
      getNetworkInfo(),
      generateCanvasFingerprint()
    ]);
    const checks = {
      deviceFingerprint,
      geoLocation,
      networkInfo,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      plugins: Array.from(navigator.plugins).map(p => p.name),
      canvasFingerprint
    };
    setSecurityState(prev => ({ ...prev, ...checks }));
    return checks;
  }, [generateDeviceFingerprint, getGeoLocation, getNetworkInfo, generateCanvasFingerprint]);

  // Biometric authentication support
  const checkBiometricSupport = useCallback(async () => {
    if (!window.PublicKeyCredential) {
      return false;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      setSecurityState(prev => ({
        ...prev,
        isBiometricAvailable: available,
        biometricSupported: true
      }));
      return available;
    } catch (error) {
      return false;
    }
  }, []);

  // Advanced password strength calculation
  const calculatePasswordStrength = useCallback((password) => {
    if (!password) return 0;

    let strength = 0;

    // Length contribution
    strength += Math.min(password.length * 4, 40);

    // Character variety contribution
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/\d/.test(password)) strength += 10;
    if (/[@$!%*?&]/.test(password)) strength += 10;

    // Complexity bonus
    if (password.length >= 16) strength += 20;
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) strength += 20;

    return Math.min(strength, 100);
  }, []);

  // Enhanced input handling with real-time validation
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (validationState.realTimeValidation) {
      const newData = { ...formData, [field]: value };
      const { errors } = validateForm(newData);

      setValidationState(prev => ({
        ...prev,
        [`${field}Valid`]: !errors.some(e => e.toLowerCase().includes(field)),
        formValid: errors.length === 0
      }));
    }

    setSecurityState(prev => ({ ...prev, error: '' }));
  }, [formData, validationState.realTimeValidation, validateForm]);

  // Enhanced security measures
  useEffect(() => {
    const initializeSecurity = async () => {
      // Check lockout status
      const storedLockout = localStorage.getItem('adminLoginLockout');
      if (storedLockout) {
        const lockoutData = JSON.parse(storedLockout);
        const now = Date.now();
        if (now < lockoutData.until) {
          setSecurityState(prev => ({
            ...prev,
            lockoutTime: lockoutData.until,
            attempts: lockoutData.attempts
          }));
        } else {
          localStorage.removeItem('adminLoginLockout');
        }
      }
      // Validate existing session
      try {
        const sessionValid = await validateSession();
        if (sessionValid) {
          navigate(from, { replace: true });
        }
      } catch (error) {
        console.warn('Session validation failed:', error);
      }
    };

    initializeSecurity();

    // Defer heavy checks to after render
    setTimeout(() => {
      checkBiometricSupport();
      performSecurityChecks();
    }, 0);
  }, [checkBiometricSupport, performSecurityChecks, validateSession, navigate, from]);

  // Auto-focus and accessibility
  useEffect(() => {
    if (emailRef.current && !securityState.lockoutTime) {
      emailRef.current.focus();
    }
  }, [securityState.lockoutTime]);

  // Password strength monitoring
  useEffect(() => {
    const strength = calculatePasswordStrength(formData.password);
    setSecurityState(prev => ({ ...prev, passwordStrength: strength }));
  }, [formData.password, calculatePasswordStrength]);

  // Enhanced submit handler with comprehensive security
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (securityState.isLoading || securityState.lockoutTime) {
      return;
    }

    const { errors, warnings } = validateForm();
    if (errors.length > 0) {
      setSecurityState(prev => ({ ...prev, error: errors[0] }));
      return;
    }

    setSecurityState(prev => ({
      ...prev,
      error: '',
      isLoading: true,
      isValidating: true,
      lastLoginAttempt: Date.now()
    }));

    try {
      // Perform additional security checks
      const securityChecks = await performSecurityChecks();

      // Simulate network delay for better UX
      // Authenticate via main AuthContext first
      const authResult = await authLogin(formData.email.trim(), formData.password);

      if (!authResult.success) {
        throw new Error(authResult.error || 'Authentication failed');
      }

      // Then verify admin access
      const loginPromise = adminLogin(
        formData.email.trim(),
        formData.password,
        formData.twoFactorCode || undefined,
        securityChecks,
        authResult.user // Pass explicit user for immediate validation
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );

      const result = await Promise.race([loginPromise, timeoutPromise]);

      if (result.success) {
        // Clear lockout on successful login
        localStorage.removeItem('adminLoginLockout');

        // Store login history
        const loginRecord = {
          timestamp: Date.now(),
          ip: result.ip || 'unknown',
          userAgent: navigator.userAgent,
          success: true
        };

        setSecurityState(prev => ({
          ...prev,
          attempts: 0,
          lockoutTime: null,
          loginHistory: [...prev.loginHistory, loginRecord].slice(-10)
        }));

        // Note: authLogin already sets the token in localStorage and AuthContext state
        // So the manual axios calls below were redundant/backwards and have been removed.

        // Add success feedback before navigation
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        const newAttempts = securityState.attempts + 1;

        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION;
          setSecurityState(prev => ({ ...prev, lockoutTime: lockoutUntil }));

          localStorage.setItem('adminLoginLockout', JSON.stringify({
            attempts: newAttempts,
            until: lockoutUntil
          }));

          setSecurityState(prev => ({
            ...prev,
            error: `Too many failed attempts. Account locked for 15 minutes.`,
            attempts: newAttempts
          }));
        } else {
          setSecurityState(prev => ({
            ...prev,
            error: result.error || `Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`,
            attempts: newAttempts
          }));
        }
      }
    } catch (err) {
      const newAttempts = securityState.attempts + 1;

      if (err.message === 'Request timeout') {
        setSecurityState(prev => ({
          ...prev,
          error: 'Request timed out. Please check your connection and try again.',
          attempts: newAttempts
        }));
      } else {
        setSecurityState(prev => ({
          ...prev,
          error: 'An unexpected error occurred. Please try again later.',
          attempts: newAttempts
        }));
      }

      console.error('Login error:', err);
    } finally {
      setSecurityState(prev => ({
        ...prev,
        isLoading: false,
        isValidating: false
      }));
    }
  };

  // Enhanced submit handler
  const handleFormSubmit = (e) => {
    handleSubmit(e);
  };

  // Handle biometric login
  const handleBiometricLogin = useCallback(async () => {
    setSecurityState(prev => ({ ...prev, isLoading: true }));

    try {
      // 1. Get options from backend (requires email to find user, or user interaction)
      const optionsResp = await axiosInstance.post('/auth/webauthn/login/options', {
        email: formData.email.trim()
      });
      const options = optionsResp.data;

      // 2. Start authentication with browser
      const asseResp = await startAuthentication({ optionsJSON: options });

      // 3. Verify with backend
      const verifyResp = await axiosInstance.post('/auth/webauthn/login/verify', {
        email: formData.email.trim(),
        output: asseResp
      });
      console.log('Biometric verify response:', verifyResp.data); // Debug Log

      const { success, token, ...userData } = verifyResp.data;

      const adminResult = await adminLogin(userData.email, null, null, await performSecurityChecks(), userData);

      if (adminResult.success || (adminResult.then && (await adminResult).success)) {
        toast.success('Biometric login successful');
        navigate(from, { replace: true });
      } else {
        toast.error('Biometric verified, but admin access denied.');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      const serverError = error.response?.data?.error;
      const serverDetails = error.response?.data?.details;
      toast.error(`Biometric failed: ${serverError || error.message} `);
      if (serverDetails) console.error('Server error details:', serverDetails);
    } finally {
      setSecurityState(prev => ({ ...prev, isLoading: false }));
    }
  }, [adminLogin, navigate, from, performSecurityChecks, formData.email]);

  // Enhanced keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !securityState.isLoading && !securityState.lockoutTime) {
      handleSubmit(e);
    }

    // Tab navigation enhancement
    if (e.key === 'Tab') {
      const focusableElements = formRef.current?.querySelectorAll(
        'input, button, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [securityState.isLoading, securityState.lockoutTime, handleSubmit]);

  // Password visibility toggle
  const togglePasswordVisibility = useCallback(() => {
    setSecurityState(prev => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  // Two-factor authentication toggle
  const toggleTwoFactor = useCallback(() => {
    setSecurityState(prev => ({ ...prev, showTwoFactor: !prev.showTwoFactor }));
  }, []);

  // Security tips toggle
  const toggleSecurityTips = useCallback(() => {
    setSecurityState(prev => ({ ...prev, showSecurityTips: !prev.showSecurityTips }));
  }, []);

  // Computed values
  const isLockedOut = securityState.lockoutTime && Date.now() < securityState.lockoutTime;
  const remainingAttempts = MAX_ATTEMPTS - securityState.attempts;
  const lockoutRemaining = securityState.lockoutTime ?
    Math.ceil((securityState.lockoutTime - Date.now()) / 1000 / 60) : 0;

  const securityScore = useMemo(() => calculateSecurityScore(formData), [formData, calculateSecurityScore]);
  const passwordStrengthColor = useMemo(() => {
    if (securityState.passwordStrength < 40) return 'text-red-500';
    if (securityState.passwordStrength < 70) return 'text-yellow-500';
    return 'text-green-500';
  }, [securityState.passwordStrength]);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-[#0f1419] dark:via-[#1a1f2e] dark:to-[#15191e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-8">
        {/* Ultra-Advanced Header */}
        <div className="text-center relative">
          {/* Animated Security Icon with Glow */}
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 rounded-full flex items-center justify-center mb-4 shadow-lg relative group">
            <span className="absolute inset-0 rounded-full animate-pulse bg-blue-400/20 group-hover:bg-blue-500/30 transition" />
            <ShieldCheckIcon className="h-10 w-10 text-white drop-shadow-lg z-10 relative" />
            {/* Accessibility: Security Icon */}
            <span className="sr-only">Enterprise Security Shield</span>
          </div>
          {/* Animated Title with Gradient Text */}
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 bg-clip-text text-transparent tracking-tight drop-shadow-sm animate-fade-in">
            Admin Portal
          </h2>
          <p className="mt-2 text-base text-gray-600 dark:text-gray-400 flex items-center justify-center gap-1 animate-fade-in-slow whitespace-nowrap">
            Secure access to administrative dashboard
          </p>
          {/* Security Score Indicator with Tooltip and Animation */}
          <div className="mt-5">
            <div className="flex items-center justify-center space-x-2 whitespace-nowrap">
              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 whitespace-nowrap">
                <span>Security Score</span>
                <svg className="w-3 h-3 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
                </svg>
                {/* Tooltip */}
                <span className="relative group">
                  <span className="sr-only">Security Score Info</span>
                  <span className="absolute left-1/2 -translate-x-1/2 top-6 z-20 hidden group-hover:block bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs text-gray-700 dark:text-gray-200 min-w-[220px] whitespace-normal">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Security Score:</span>
                    {"\n"}Calculated based on password strength, two-factor authentication, and email validity.
                    <br />
                    <span className="text-gray-500 dark:text-gray-400">
                      Aim for 100% for maximum protection.
                    </span>
                  </span>
                </span>
              </div>
              <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-3 relative overflow-hidden shadow-inner">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ease-out ${securityScore < 40
                    ? 'bg-red-500 animate-pulse'
                    : securityScore < 70
                      ? 'bg-yellow-500 animate-pulse-slow'
                      : 'bg-green-500'
                    } `}
                  style={{ width: `${securityScore}% ` }}
                  aria-valuenow={securityScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
                {/* Animated marker */}
                <span
                  className="absolute top-1/2 -translate-y-1/2 left-0 transition-all duration-500"
                  style={{ left: `calc(${securityScore}% - 8px)` }}
                >
                  <svg className="w-4 h-4 text-blue-500 dark:text-blue-300 drop-shadow" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" />
                  </svg>
                </span>
              </div>
              <span
                className={`text-xs font-bold ${securityScore < 40
                  ? 'text-red-500'
                  : securityScore < 70
                    ? 'text-yellow-500'
                    : 'text-green-500'
                  } animate-fade-in `}
                aria-live="polite"
              >
                {securityScore}%
              </span>
            </div>
            {/* Security Score Description */}
            <div className="mt-1 text-[11px] text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1 whitespace-nowrap">
              <span>
                {securityScore < 40
                  ? "Weak: Improve your password and enable 2FA"
                  : securityScore < 70
                    ? "Moderate: Consider enabling all security features"
                    : "Strong: Your account is well protected"}
              </span>
              {securityScore === 100 && (
                <span className="ml-1 px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-semibold animate-bounce">
                  Perfect!
                </span>
              )}
            </div>
          </div>
          {/* Live Security Audit Info */}
          {typeof securityState.lastSecurityAudit === 'string' && (
            <div className="mt-2 flex items-center justify-center gap-1 text-[11px] text-gray-400 dark:text-gray-500 animate-fade-in-slow whitespace-nowrap">
              <svg className="w-3.5 h-3.5 text-blue-400 dark:text-blue-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Last security audit: <span className="font-medium">{securityState.lastSecurityAudit}</span>
              </span>
            </div>
          )}
        </div>

        {/* Enhanced Form */}
        <form ref={formRef} className="mt-8 space-y-6" onSubmit={handleFormSubmit} onKeyDown={handleKeyDown}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  ref={emailRef}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark: placeholder-gray-400 text-gray-900 dark: text-white focus: outline-none focus: ring-2 focus: ring-offset-2 transition-all duration-200 sm: text-sm bg-white dark: bg-[#2c353f] ${validationState.emailValid ? 'border-green-500 focus:ring-green-500' :
                    formData.email ? 'border-red-500 focus:ring-red-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } `}
                  placeholder="admin@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isLockedOut}
                />
                {validationState.emailValid && (
                  <CheckCircleIcon className="absolute right-3 top-1/2 transform-translate-y-1/2 h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type={securityState.showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className={`appearance-none relative block w-full px-4 py-3 pr-12 border rounded-lg placeholder-gray-500 dark: placeholder-gray-400 text-gray-900 dark: text-white focus: outline-none focus: ring-2 focus: ring-offset-2 transition-all duration-200 sm: text-sm bg-white dark: bg-[#2c353f] ${validationState.passwordValid ? 'border-green-500 focus:ring-green-500' :
                    formData.password ? 'border-red-500 focus:ring-red-500' :
                      'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                    } `}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={isLockedOut}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform-translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={togglePasswordVisibility}
                  disabled={isLockedOut}
                >
                  {securityState.showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Advanced Password Strength & Feedback */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2">
                    {/* Animated Progress Bar with Tooltip */}
                    <div className="flex-1 relative group">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`
                        h-2 rounded-full transition-all duration-500
                        ${securityState.passwordStrength < 40
                              ? 'bg-red-500'
                              : securityState.passwordStrength < 70
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                            }
                        ${securityState.passwordStrength === 100 ? 'shadow-lg shadow-green-400/40' : ''}
                        `}
                          style={{
                            width: `${securityState.passwordStrength}% `,
                            transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)'
                          }}
                        />
                      </div>
                      {/* Tooltip on hover for details */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-7 z-10 hidden group-hover:block bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs text-gray-700 dark:text-gray-200 whitespace-pre-line min-w-[180px]">
                        {securityState.passwordStrength < 40 && (
                          <>
                            <span className="font-semibold text-red-500">Weak:</span>
                            {"\n"}Use a longer password with uppercase, lowercase, numbers, and symbols.
                          </>
                        )}
                        {securityState.passwordStrength >= 40 && securityState.passwordStrength < 70 && (
                          <>
                            <span className="font-semibold text-yellow-500">Medium:</span>
                            {"\n"}Add more unique characters and avoid common words.
                          </>
                        )}
                        {securityState.passwordStrength >= 70 && (
                          <>
                            <span className="font-semibold text-green-500">Strong:</span>
                            {"\n"}Your password is strong. Avoid reusing it elsewhere.
                          </>
                        )}
                      </div>
                    </div>
                    {/* Animated Strength Label with Icon */}
                    <span
                      className={`
                    text-xs font-semibold flex items-center gap-1
                    ${securityState.passwordStrength < 40
                          ? 'text-red-600 dark:text-red-400'
                          : securityState.passwordStrength < 70
                            ? 'text-yellow-600 dark:text-yellow-400'
                            : 'text-green-600 dark:text-green-400'
                        }
                    transition-colors duration-300
                    `}
                    >
                      {securityState.passwordStrength < 40 && (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Weak
                        </>
                      )}
                      {securityState.passwordStrength >= 40 && securityState.passwordStrength < 70 && (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Medium
                        </>
                      )}
                      {securityState.passwordStrength >= 70 && (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Strong
                        </>
                      )}
                    </span>
                  </div>
                  {/* Password Requirements Checklist */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {[
                      { label: '8+ chars', valid: formData.password.length >= 8 },
                      { label: 'Uppercase', valid: /[A-Z]/.test(formData.password) },
                      { label: 'Lowercase', valid: /[a-z]/.test(formData.password) },
                      { label: 'Number', valid: /\d/.test(formData.password) },
                      { label: 'Symbol', valid: /[^A-Za-z0-9]/.test(formData.password) }
                    ].map((req, idx) => (
                      <span
                        key={req.label}
                        className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium
                          ${req.valid
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                          }
      transition-all duration-200
        `}
                      >
                        {req.valid ? (
                          <svg className="w-3 h-3 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                        {req.label}
                      </span>
                    ))}
                  </div>
                  {/* Password Breach Check (if available) */}
                  {securityState.passwordBreachChecked && (
                    <div className="flex items-center gap-1 mt-1 text-xs">
                      {securityState.passwordBreached ? (
                        <>
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="text-red-600 dark:text-red-400 font-semibold">
                            This password has appeared in data breaches!
                          </span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-600 dark:text-green-400 font-semibold">
                            No known breaches detected.
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>


          </div>

          {/* Two-Factor Authentication */}
          {securityState.showTwoFactor && (
            <div>
              <label htmlFor="two-factor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Two-Factor Code
              </label>
              <input
                ref={twoFactorRef}
                id="two-factor"
                name="twoFactorCode"
                type="text"
                maxLength={TWO_FACTOR_LENGTH}
                className={`appearance-none relative block w-full px-4 py-3 border rounded-lg placeholder-gray-500 dark: placeholder-gray-400 text-gray-900 dark: text-white focus: outline-none focus: ring-2 focus: ring-offset-2 transition-all duration-200 sm: text-sm bg-white dark: bg-[#2c353f] ${validationState.twoFactorValid ? 'border-green-500 focus:ring-green-500' :
                  formData.twoFactorCode ? 'border-red-500 focus:ring-red-500' :
                    'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  } `}
                placeholder="000000"
                value={formData.twoFactorCode}
                onChange={(e) => handleInputChange('twoFactorCode', e.target.value.replace(/\D/g, ''))}
                disabled={isLockedOut}
              />
            </div>
          )}

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              disabled={isLockedOut}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Remember this device for 30 days
            </label>
          </div>

          {/* Error Display */}
          {securityState.error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                    Authentication Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    {securityState.error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lockout Warning */}
          {isLockedOut && (
            <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Account Temporarily Locked
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                    Too many failed attempts. Please try again in {lockoutRemaining} minutes.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={securityState.isLoading || isLockedOut || !validationState.formValid}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              aria-label="Admin Login"
            >
              {securityState.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <span>Sign In</span>
              )}
            </button>



            {/* Advanced Biometric Login Button */}
            {securityState.biometricSupported && (
              <button
                type="button"
                ref={biometricRef}
                onClick={handleBiometricLogin}
                disabled={
                  securityState.isLoading ||
                  isLockedOut ||
                  !securityState.isBiometricAvailable
                }
                aria-label={
                  securityState.isBiometricAvailable
                    ? "Sign in with biometric authentication"
                    : "Biometric authentication unavailable"
                }
                className={`
              w-full flex justify-center items-center py-3 px-4 border
              border-gray-300 dark: border-gray-600 text-sm font-medium rounded-lg
              text-gray-700 dark: text-gray-300 bg-white dark: bg-[#2c353f]
              hover: bg-gray-50 dark: hover: bg-[#3a4551]
              focus: outline-none focus: ring-2 focus: ring-offset-2 focus: ring-blue-500
              disabled: opacity-50 disabled: cursor-not-allowed
              transition-all duration-200 relative shadow-md
              group
                        `}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (
                      !securityState.isLoading &&
                      !isLockedOut &&
                      securityState.isBiometricAvailable
                    ) {
                      handleBiometricLogin();
                    }
                  }
                }}
              >
                <span className="flex items-center space-x-2">
                  {/* Animated biometric icon */}
                  <span className="relative flex items-center">
                    <svg
                      className={`w-6 h-6 transition-transform duration-300 ${securityState.isBiometricAvailable
                        ? "text-blue-600 dark:text-blue-400 group-hover:scale-110"
                        : "text-gray-400 dark:text-gray-600"
                        } `}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 11.5v2.5m0 0v2m0-2h2m-2 0h-2m8-2.5a8 8 0 11-16 0 8 8 0 0116 0zm-8-4a4 4 0 014 4"
                      />
                    </svg>
                    {/* Pulse animation if available */}
                    {securityState.isBiometricAvailable && (
                      <span className="absolute-right-2-top-2 flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                    )}
                  </span>
                  <span>
                    {securityState.isBiometricAvailable
                      ? "Sign in with Biometric"
                      : "Biometric Unavailable"}
                  </span>
                </span>
                {/* Tooltip for biometric info */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-20 hidden group-hover:block bg-white dark:bg-[#23272f] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-lg text-xs text-gray-700 dark:text-gray-200 min-w-[220px]">
                  {securityState.isBiometricAvailable ? (
                    <>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">Biometric Ready:</span>
                      {"\n"}Use your device's fingerprint, Face ID, or Windows Hello for instant login.
                      <br />
                      <span className="text-gray-500 dark:text-gray-400">
                        Your biometric data never leaves your device.
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-red-500">Not Available:</span>
                      {"\n"}Biometric authentication is not supported or enabled on this device.
                    </>
                  )}
                </div>
              </button>
            )}

            {/* Two-Factor Toggle */}
            <button
              type="button"
              onClick={toggleTwoFactor}
              className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200"
              aria-label={securityState.showTwoFactor ? 'Hide Two-Factor Authentication' : 'Enable Two-Factor Authentication'}
            >
              {securityState.showTwoFactor ? 'Hide Two-Factor' : 'Enable Two-Factor Authentication'}
            </button>
          </div>
        </form>

        {/* Security Tips */}
        < div className="mt-6" >
          <button
            type="button"
            onClick={toggleSecurityTips}
            className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
            aria-label={securityState.showSecurityTips ? 'Hide Security Tips' : 'Show Security Tips'}
          >
            {securityState.showSecurityTips ? 'Hide Security Tips' : 'Show Security Tips'}
          </button>

          {
            securityState.showSecurityTips && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Security Best Practices:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Use a strong, unique password</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Never share your credentials</li>
                  <li>• Log out from shared devices</li>
                  <li>• Report suspicious activity immediately</li>
                </ul>
              </div>
            )
          }
        </div >

        {/* Advanced Security Footer */}
        < div className="text-center mt-8" >
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center justify-center gap-1.5">
              <svg
                className="w-4 h-4 text-blue-500 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2m6.364 1.636l-1.414 1.414M21 12h-2m-1.636 6.364l-1.414-1.414M12 21v-2m-6.364-1.636l1.414-1.414M3 12h2m1.636-6.364l1.414 1.414M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Protected by <span className="font-semibold text-blue-600 dark:text-blue-300">enterprise-grade security</span>
              </span>
              <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-[10px] font-semibold tracking-wide">
                AES-256
              </span>
              <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-[10px] font-semibold tracking-wide">
                2FA
              </span>
              <span className="inline-flex items-center ml-1 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-semibold tracking-wide">
                Biometric
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-1 mt-1">
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                <span className="font-medium">Session Monitoring</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">|</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                <span className="font-medium">Brute-force Protection</span>
              </span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">|</span>
              <span className="text-[10px] text-gray-400 dark:text-gray-500">
                <span className="font-medium">End-to-End Encryption</span>
              </span>
            </div>
            {typeof securityState.lastSecurityAudit === 'string' && (
              <div className="mt-1">
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                  Last security audit: <span className="font-medium">{securityState.lastSecurityAudit}</span>
                </span>
              </div>
            )}
          </div>
          {
            remainingAttempts < MAX_ATTEMPTS && (
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l2 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-orange-600 dark:text-orange-400">
                  <span className="font-semibold">{remainingAttempts}</span> login attempt{remainingAttempts !== 1 && 's'} remaining
                </p>
                {remainingAttempts === 1 && (
                  <span className="ml-2 px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-semibold animate-pulse">
                    Last Attempt!
                  </span>
                )}
              </div>
            )
          }
          {
            isLockedOut && (
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-red-500 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                  Account temporarily locked for security. Please try again later.
                </p>
              </div>
            )
          }
        </div >
      </div >
    </div >
  );
};

export default AdminLogin; 