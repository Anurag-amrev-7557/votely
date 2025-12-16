import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { toast } from '../../utils/toastUtils';
import { ArrowLeft, Lock, Mail, ChevronRight, Fingerprint } from 'lucide-react';

// --- Assets ---
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

// --- 3D Background Component ---
const ParticleField = ({ color }) => {
  const ref = useRef();
  const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={color}
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const AuthBackground = ({ isDarkMode }) => {
  const particleColor = isDarkMode ? '#ffffff' : '#111827';
  const bgColor = isDarkMode ? '#000000' : '#ffffff';

  return (
    <div className="absolute inset-0 z-0 overflow-hidden transition-colors duration-500" style={{ backgroundColor: bgColor }} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <ParticleField color={particleColor} />
      </Canvas>
      <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-black via-transparent to-black' : 'from-white via-transparent to-white'} opacity-80 pointer-events-none transition-colors duration-500`} />
      <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-black/50 via-transparent to-black/50' : 'from-white/50 via-transparent to-white/50'} pointer-events-none transition-colors duration-500`} />
    </div>
  );
};

// --- LoginPage Component ---
const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const { requestMagicLink, loginWithGoogle } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await requestMagicLink(formData.email);
    if (result.success) {
      toast.custom((t) => (
        <div role="alert" aria-live="polite" className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white dark:bg-zinc-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}>
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5" aria-hidden="true">
                <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-zinc-900 dark:text-white" />
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Magic Link Sent.
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Check your inbox at {formData.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      ));
    } else {
      toast.error(result.error || 'Failed to send link');
    }
    setIsSubmitting(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // For useGoogleLogin, credentialResponse will contain access_token instead of credential
    // We might need to adjust loginWithGoogle in AuthContext if it expects specific format
    // But standard React OAuth hook returns tokenResponse which has access_token
    try {
      const result = await loginWithGoogle(credentialResponse);
      if (result.success) {
        toast.success('Identity Verified.');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Google login failed');
      }
    } catch (err) {
      toast.error('Authentication Error');
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error('Google Login connection failed'),
  });

  return (
    <main className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>

      {/* 1. Background Layer (Decorative) */}
      <AuthBackground isDarkMode={isDarkMode} />

      {/* 2. Interactive Blob/Glow - Monochrome (Decorative) */}
      <div
        aria-hidden="true"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none animate-pulse-slow z-0 transition-colors duration-500 ${isDarkMode ? 'bg-zinc-800/20' : 'bg-gray-200/50'}`}
      />

      {/* 3. Main Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Glassmorphism Card */}
        <div className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-2xl transition-all duration-500 ${isDarkMode ? 'bg-zinc-900/40 border-white/10 ring-white/5' : 'bg-white/40 border-black/5 ring-black/5'}`}>

          {/* Header / Brand */}
          <div className="flex flex-col items-center pt-12 pb-8 px-8 text-center relative">
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-colors duration-500 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
            >
              <Lock className="w-8 h-8" />
            </motion.div>

            <h1 className={`text-3xl font-bold tracking-tight mb-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-zinc-900'}`}>
              Welcome back
            </h1>
            <p className={`text-sm transition-colors duration-500 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Enter your credentials to access the terminal.
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="relative group">
                <label
                  htmlFor="email"
                  className={`absolute left-4 transition-all duration-300 pointer-events-none ${focusedInput === 'email' || formData.email
                      ? `-top-2.5 text-xs px-2 rounded font-semibold ${isDarkMode ? 'bg-zinc-900/90 text-white' : 'bg-white/90 text-black'}`
                      : `top-3.5 font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-3 h-3" aria-hidden="true" />
                    Email Address
                  </span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  aria-required="true"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput('email')}
                  onBlur={() => setFocusedInput(null)}
                  className={`w-full border rounded-xl px-4 py-3.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-all duration-300 placeholder-transparent
                                ${isDarkMode
                      ? 'bg-zinc-950/50 border-white/10 text-white focus:border-white focus:ring-white/50 focus-visible:ring-white focus-visible:ring-offset-zinc-900'
                      : 'bg-white/50 border-black/10 text-zinc-900 focus:border-black focus:ring-black/50 focus-visible:ring-black focus-visible:ring-offset-white'
                    }`}
                  placeholder="you@company.com"
                />
                {/* Animated Border Line - Monochrome (Decorative) */}
                <div aria-hidden="true" className={`absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-transparent via-zinc-500 to-transparent transition-all duration-500 ${focusedInput === 'email' ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full overflow-hidden rounded-xl py-3.5 font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                            ${isDarkMode
                    ? 'bg-white text-black focus-visible:ring-white focus-visible:ring-offset-zinc-900'
                    : 'bg-black text-white focus-visible:ring-black focus-visible:ring-offset-white'
                  }
                        `}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <svg aria-hidden="true" className={`animate-spin h-5 w-5 ${isDarkMode ? 'text-black' : 'text-white'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span role="status">Processing...</span>
                    </>
                  ) : (
                    <>
                      Send Magic Link
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </>
                  )}
                </span>
              </button>
            </form>

            <div className="relative my-8" role="separator">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className={`w-full border-t ${isDarkMode ? 'border-white/10' : 'border-black/10'}`}></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase tracking-widest">
                <span className={`px-4 rounded-full font-medium ${isDarkMode ? 'bg-[#121215] text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}>
                  Or Connect With
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <motion.button
                onClick={() => googleLogin()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl border font-bold transition-all duration-300 shadow-md hover:shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                          ${isDarkMode
                    ? 'bg-zinc-900/50 border-white/10 text-white hover:bg-zinc-800 focus-visible:ring-white focus-visible:ring-offset-zinc-900'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white focus-visible:ring-black focus-visible:ring-offset-white'
                  }
                        `}
              >
                <GoogleIcon className="w-5 h-5" />
                <span>Continue with Google</span>
                {/* Shine effect on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-r ${isDarkMode ? 'from-transparent via-white to-transparent' : 'from-transparent via-black to-transparent'}`} />
              </motion.button>
            </div>
          </div>

          {/* Footer / Back Link */}
          <div className={`px-8 py-4 backdrop-blur-md flex justify-between items-center ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <button
              onClick={() => navigate('/')}
              className={`text-xs flex items-center gap-1 group transition-colors focus-visible:outline-none focus-visible:underline ${isDarkMode ? 'text-zinc-300 hover:text-white' : 'text-zinc-700 hover:text-black'}`}
              aria-label="Return to Home Page"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
              Return Home
            </button>
            <div className={`flex items-center gap-2 text-xs font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`} aria-label="Security Status: Secure Connection">
              <Fingerprint className="w-3 h-3" aria-hidden="true" />
              <span>Secure Connection </span>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginPage;