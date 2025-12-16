import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { startAuthentication } from '@simplewebauthn/browser';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ShieldCheckIcon, CheckCircleIcon, KeyIcon, FingerPrintIcon } from '@heroicons/react/24/outline';
import axiosInstance from '../../utils/api/axiosConfig';
import { useTheme } from '../../context/ThemeContext';
import { toast } from '../../utils/toastUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// --- Visual Components ---

// 3D Background - Darker, more "Admin/Security" feel (Deep Violet/Gold accents)
const AdminParticleField = ({ isDarkMode }) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(6000), { radius: 1.8 })); // Denser field

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 15;
      ref.current.rotation.y -= delta / 20;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={isDarkMode ? '#ffd700' : '#4f46e5'} // Gold in dark mode, Indigo in light
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isDarkMode ? 0.4 : 0.6}
        />
      </Points>
    </group>
  );
};

const AdminBackground = ({ isDarkMode }) => {
  const bgColor = isDarkMode ? '#050505' : '#f8fafc'; // Deep black vs off-white

  return (
    <div className="absolute inset-0 z-0 overflow-hidden transition-colors duration-500" style={{ backgroundColor: bgColor }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <AdminParticleField isDarkMode={isDarkMode} />
      </Canvas>
      {/* Vignette & Gradients */}
      <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black via-transparent to-black/80' : 'from-slate-100 via-transparent to-white/80'} pointer-events-none transition-colors duration-500`} />
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none`} />
    </div>
  );
};

// Abstract Semantic Visual for Security Score
const SecurityVisual = ({ score }) => {
  // Normalize score to 0-1
  const normalized = score / 100;

  return (
    <div className="relative w-16 h-16 flex items-center justify-center" role="img" aria-label={`Security Score: ${score}%`}>
      {/* Outer Glow Ring */}
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
          scale: [1, 1.05, 1],
          borderColor: score < 40 ? '#ef4444' : score < 70 ? '#eab308' : '#22c55e'
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{
          boxShadow: `0 0 ${normalized * 20}px ${score < 40 ? '#ef4444' : score < 70 ? '#eab308' : '#22c55e'}40`
        }}
      />

      {/* Progress Circle SVG */}
      <svg className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2" fill="none" className="text-gray-200 dark:text-gray-800" />
        <motion.circle
          cx="32" cy="32" r="28"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          className={`${score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500'} transition-colors duration-500`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: normalized }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ strokeDasharray: 176, strokeDashoffset: 0 }} // 2 * PI * 28 ≈ 176
        />
      </svg>

      {/* Inner Icon */}
      <ShieldCheckIcon className={`w-6 h-6 ${score < 40 ? 'text-red-500' : score < 70 ? 'text-yellow-500' : 'text-green-500'} transition-colors duration-500`} />
    </div>
  );
};

const AdminLogin = () => {
  // --- STATE MANAGEMENT ---
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
    passwordStrength: 0,
    isBiometricAvailable: false,
    biometricSupported: false,
    showSecurityTips: false,
    loginHistory: [],
    // Fingerprinting
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

  const [focusedInput, setFocusedInput] = useState(null);

  // Refs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const formRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();
  const { login: adminLogin, validateSession } = useAdminAuth();
  const { login: authLogin } = useAuth();

  // Constants
  const from = location.state?.from?.pathname || '/admin';
  const MAX_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000;
  const PASSWORD_MIN_LENGTH = 8;
  const VALIDATION_PATTERNS = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/,
    twoFactor: /^\d{6}$/
  };

  // --- LOGIC & HELPERS ---

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

    // Detailed security context for the backend
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

    // Update local state for debugging/display
    setSecurityState(prev => ({ ...prev, deviceFingerprint, geoLocation, networkInfo }));

    return checks;
  }, [generateDeviceFingerprint, getGeoLocation, getNetworkInfo, generateCanvasFingerprint]);

  // Handle biometric login - Full WebAuthn Flow
  const handleBiometricLogin = useCallback(async () => {
    if (!formData.email.trim()) {
      setSecurityState(prev => ({ ...prev, error: 'Please enter your email to identify account' }));
      emailRef.current?.focus();
      return;
    }

    setSecurityState(prev => ({ ...prev, isLoading: true, error: '' }));
    const loadingToast = toast.loading("Initializing secure handshake...");

    try {
      // 1. Get options from backend 
      const optionsResp = await axiosInstance.post('/auth/webauthn/login/options', {
        email: formData.email.trim()
      });
      const options = optionsResp.data;

      // 2. Start authentication with browser
      const asseResp = await startAuthentication({ optionsJSON: options });

      // 3. Verify with backend
      toast.loading("Verifying cryptographic signature...", { id: loadingToast });
      const verifyResp = await axiosInstance.post('/auth/webauthn/login/verify', {
        email: formData.email.trim(),
        output: asseResp
      });

      const { success, token, ...userData } = verifyResp.data;

      // 4. Finalize Admin Login with Context
      const checks = await performSecurityChecks();
      toast.dismiss(loadingToast);

      const adminResult = await adminLogin(userData.email, null, null, checks, userData);

      if (adminResult.success || (adminResult.then && (await adminResult).success)) {
        toast.success('Biometric Identity Verified');
        localStorage.removeItem('adminLoginLockout');
        navigate(from, { replace: true });
      } else {
        toast.error('Identity verified, but admin access was denied.');
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      toast.dismiss(loadingToast);
      const serverError = error.response?.data?.error;
      toast.error(`Biometric validation failed: ${serverError || error.message}`);
    } finally {
      setSecurityState(prev => ({ ...prev, isLoading: false }));
    }
  }, [adminLogin, navigate, from, performSecurityChecks, formData.email]);


  const calculateSecurityScore = useCallback((data) => {
    let score = 0;
    if (VALIDATION_PATTERNS.email.test(data.email)) score += 20;
    if (data.password.length >= PASSWORD_MIN_LENGTH) score += 20;
    if (VALIDATION_PATTERNS.password.test(data.password)) score += 30;
    if (data.twoFactorCode && VALIDATION_PATTERNS.twoFactor.test(data.twoFactorCode)) score += 30;
    return Math.min(score, 100);
  }, []);

  const validateForm = useCallback((data = formData) => {
    const errors = [];
    if (!data.email.trim()) errors.push('Email is required');
    else if (!VALIDATION_PATTERNS.email.test(data.email)) errors.push('Invalid email format');

    if (!data.password) errors.push('Password is required');
    else if (data.password.length < PASSWORD_MIN_LENGTH) errors.push(`Password too short`);

    if (securityState.showTwoFactor && data.twoFactorCode && !VALIDATION_PATTERNS.twoFactor.test(data.twoFactorCode)) {
      errors.push('Invalid 2FA code');
    }
    return { errors };
  }, [formData, securityState.showTwoFactor]);

  // Fingerprinting & Support Checks (Simplified for brevity but retaining logic)

  const checkBiometricSupport = useCallback(async () => {
    if (window.PublicKeyCredential) {
      try {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setSecurityState(prev => ({ ...prev, isBiometricAvailable: available, biometricSupported: true }));
      } catch (e) { /* ignore */ }
    }
  }, []);

  const calculatePasswordStrength = useCallback((password) => {
    if (!password) return 0;
    let strength = 0;
    strength += Math.min(password.length * 4, 40);
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/\d/.test(password)) strength += 10;
    if (/[@$!%*?&]/.test(password)) strength += 10;
    if (password.length >= 16) strength += 20;
    return Math.min(strength, 100);
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationState.realTimeValidation) {
      // Quick local feedback logic
      if (field === 'email') setValidationState(prev => ({ ...prev, emailValid: VALIDATION_PATTERNS.email.test(value) }));
      if (field === 'password') setValidationState(prev => ({ ...prev, passwordValid: value.length >= PASSWORD_MIN_LENGTH }));
    }
    setSecurityState(prev => ({ ...prev, error: '' }));
  }, [validationState.realTimeValidation]);

  // Effects
  useEffect(() => {
    const storedLockout = localStorage.getItem('adminLoginLockout');
    if (storedLockout) {
      const data = JSON.parse(storedLockout);
      if (Date.now() < data.until) {
        setSecurityState(prev => ({ ...prev, lockoutTime: data.until, attempts: data.attempts }));
      } else {
        localStorage.removeItem('adminLoginLockout');
      }
    }
    validateSession().then(valid => {
      if (valid) navigate(from, { replace: true });
    }).catch(() => { });

    setTimeout(() => {
      checkBiometricSupport();
      performSecurityChecks();
    }, 0);
  }, [validateSession, navigate, from, checkBiometricSupport, performSecurityChecks]);

  useEffect(() => {
    setSecurityState(prev => ({ ...prev, passwordStrength: calculatePasswordStrength(formData.password) }));
  }, [formData.password, calculatePasswordStrength]);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (securityState.isLoading || securityState.lockoutTime) return;

    const { errors } = validateForm();
    if (errors.length > 0) {
      setSecurityState(prev => ({ ...prev, error: errors[0] }));
      return;
    }

    setSecurityState(prev => ({ ...prev, error: '', isLoading: true, isValidating: true }));

    try {
      // Use REAL security checks now
      const checks = await performSecurityChecks();

      // DECOUPLED LOGIN: Direct API Call instead of useAuth()
      // This prevents the user from being logged in to the main site
      let authUser = null;
      try {
        const authResponse = await axiosInstance.post('/auth/login', {
          email: formData.email.trim(),
          password: formData.password
        });
        // We do NOT store 'token' in localStorage here to avoid overwriting user session
        // We pass the data to adminLogin context which will save 'adminToken'
        authUser = authResponse.data;
      } catch (authErr) {
        throw new Error(authErr.response?.data?.error || 'Authentication failed');
      }

      const result = await adminLogin(
        formData.email.trim(),
        formData.password,
        formData.twoFactorCode || undefined,
        checks,
        authUser // Pass the authenticated user object
      );

      if (result.success) {
        localStorage.removeItem('adminLoginLockout');
        setSecurityState(prev => ({ ...prev, attempts: 0, lockoutTime: null }));
        toast.success('Admin Session Established');
        setTimeout(() => navigate(from, { replace: true }), 800);
      } else {
        const newAttempts = securityState.attempts + 1;
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutUntil = Date.now() + LOCKOUT_DURATION;
          localStorage.setItem('adminLoginLockout', JSON.stringify({ attempts: newAttempts, until: lockoutUntil }));
          setSecurityState(prev => ({ ...prev, lockoutTime: lockoutUntil, attempts: newAttempts, error: 'Maximum attempts exceeded. Account locked.' }));
        } else {
          setSecurityState(prev => ({ ...prev, attempts: newAttempts, error: result.error || 'Access Denied. Check credentials.' }));
        }
      }
    } catch (err) {
      setSecurityState(prev => ({ ...prev, error: err.message || 'Authentication failed', attempts: securityState.attempts + 1 }));
    } finally {
      setSecurityState(prev => ({ ...prev, isLoading: false, isValidating: false }));
    }
  };

  const isLockedOut = securityState.lockoutTime && Date.now() < securityState.lockoutTime;
  const securityScore = useMemo(() => calculateSecurityScore(formData), [formData, calculateSecurityScore]);

  // --- RENDER ---

  const inputClass = (valid, hasValue, isDark) => `
    w-full bg-transparent border-b-2 px-4 py-3 outline-none transition-all duration-300
    font-mono text-sm tracking-wide placeholder-transparent
    focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:rounded-lg
    ${isDark ? 'text-white' : 'text-zinc-900'}
    ${valid
      ? 'border-green-500/50 focus:border-green-400'
      : hasValue
        ? 'border-red-500/50 focus:border-red-400'
        : isDark ? 'border-zinc-700 focus:border-white' : 'border-zinc-300 focus:border-black'
    }
  `;

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>

      {/* 1. Background */}
      <AdminBackground isDarkMode={isDarkMode} />

      {/* 2. Main Layout - Split or Centered Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[480px] mx-4"
      >
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-2xl border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-black/60 border-white/10 shadow-black/50' : 'bg-white/70 border-white/40 shadow-xl'}`}>

          {/* Header Area */}
          <div className="pt-12 pb-8 px-8 text-center relative border-b border-gray-200/10 dark:border-white/5">

            <div className="flex justify-center mb-6">
              <SecurityVisual score={securityScore} />
            </div>

            <h1 className={`text-4xl font-black tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              ADMIN_GATE
            </h1>
            <p className={`text-xs font-mono uppercase tracking-widest opacity-60`}>
              Restricted Access Protocol
            </p>

            {/* Lockout Warning */}
            <AnimatePresence>
              {isLockedOut && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-xs font-mono text-red-500 dark:text-red-400"
                >
                  SYSTEM LOCKED. RETRY LATER.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {securityState.error && !isLockedOut && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-center justify-center gap-2"
                  role="alert"
                >
                  <ShieldCheckIcon className="w-4 h-4" />
                  {securityState.error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} ref={formRef} className="p-8 space-y-8" noValidate>

            {/* Email Input */}
            <div className="relative group">
              <input
                ref={emailRef}
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
                disabled={isLockedOut}
                className={inputClass(validationState.emailValid, !!formData.email, isDarkMode)}
                placeholder="ADMIN IDENTITY"
                aria-required="true"
                aria-invalid={!validationState.emailValid && !!formData.email}
              />
              <label
                htmlFor="email"
                className={`absolute left-4 top-3 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedInput === 'email' || formData.email
                  ? '-top-3 left-0 text-[10px] opacity-70'
                  : 'opacity-60'
                  } ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
              >
                Identifier
              </label>
              {validationState.emailValid && (
                <CheckCircleIcon className="absolute right-4 top-3 w-5 h-5 text-green-500/80" />
              )}
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                ref={passwordRef}
                id="password"
                type={securityState.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
                disabled={isLockedOut}
                className={inputClass(validationState.passwordValid, !!formData.password, isDarkMode)}
                placeholder="PASSPHRASE"
                aria-required="true"
              />
              <label
                htmlFor="password"
                className={`absolute left-4 top-3 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedInput === 'password' || formData.password
                  ? '-top-3 left-0 text-[10px] opacity-70'
                  : 'opacity-60'
                  } ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
              >
                Cipher
              </label>
              <button
                type="button"
                onClick={() => setSecurityState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-4 top-3 text-gray-400 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
                aria-label={securityState.showPassword ? "Hide password" : "Show password"}
              >
                {securityState.showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* 2FA Section (Conditional) */}
            <AnimatePresence>
              {(securityState.showTwoFactor || securityState.passwordStrength > 60) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative group overflow-hidden"
                >
                  <input
                    id="2fa"
                    type="text"
                    maxLength={6}
                    value={formData.twoFactorCode}
                    onChange={(e) => handleInputChange('twoFactorCode', e.target.value.replace(/\D/g, ''))}
                    onFocus={() => setFocusedInput('2fa')}
                    onBlur={() => setFocusedInput(null)}
                    className={inputClass(VALIDATION_PATTERNS.twoFactor.test(formData.twoFactorCode), !!formData.twoFactorCode, isDarkMode)}
                    placeholder="000000"
                  />
                  <label
                    htmlFor="2fa"
                    className={`absolute left-4 top-3 transition-all duration-300 pointer-events-none text-xs font-bold uppercase tracking-widest ${focusedInput === '2fa' || formData.twoFactorCode
                      ? '-top-3 left-0 text-[10px] opacity-70'
                      : 'opacity-40'
                      } ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}
                  >
                    Auth Code
                  </label>
                  <KeyIcon className="absolute right-4 top-3 w-5 h-5 text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="pt-4 space-y-4">
              <button
                type="submit"
                disabled={securityState.isLoading || isLockedOut}
                className={`
                                relative w-full py-4 rounded-xl font-bold uppercase tracking-wider text-sm
                                transition-all duration-300 overflow-hidden group
                                ${isDarkMode
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800'
                  }
                                disabled:opacity-50 disabled:cursor-not-allowed
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900
                            `}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {securityState.isLoading ? 'Authenticating...' : 'Initialize Session'}
                </span>
                {/* Hover Shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>

              {/* Biometric Option */}
              {securityState.biometricSupported && (
                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  className={`w-full py-3 flex items-center justify-center gap-2 text-xs font-mono uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity ${isDarkMode ? 'text-white' : 'text-black'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg`}
                >
                  <FingerPrintIcon className="w-4 h-4" />
                  <span>Biometric Handshake</span>
                </button>
              )}
            </div>
          </form>

          {/* Footer Info */}
          <div className="bg-black/5 dark:bg-white/5 p-4 flex justify-between items-center text-[10px] font-mono uppercase tracking-wider opacity-60">
            <button onClick={() => navigate('/')} className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded">
              &larr; Return to Surface
            </button>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Secure Connection: TLS 1.3
            </span>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default AdminLogin;