import React from 'react';
import toast from 'react-hot-toast';
import { motion, useIsPresent, useMotionTemplate, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Loader2,
  Terminal,
  ShieldCheck,
  Zap,
  ChevronDown,
} from 'lucide-react';

// --- Premium Design System Tokens ---
const TOAST_VARIANTS = {
  success: {
    icon: Check,
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-500',
    border: 'border-emerald-500/20',
  },
  error: {
    icon: X,
    gradient: 'from-rose-500 to-red-600',
    shadow: 'shadow-rose-500/20',
    bg: 'bg-rose-500/10',
    text: 'text-rose-500',
    border: 'border-rose-500/20',
  },
  warning: {
    icon: AlertTriangle,
    gradient: 'from-amber-400 to-orange-500',
    shadow: 'shadow-amber-500/20',
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/20',
  },
  info: {
    icon: Info,
    gradient: 'from-blue-500 to-indigo-600',
    shadow: 'shadow-blue-500/20',
    bg: 'bg-blue-500/10',
    text: 'text-blue-500',
    border: 'border-blue-500/20',
  },
  loading: {
    icon: Loader2,
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/20',
    bg: 'bg-violet-500/10',
    text: 'text-violet-500',
    border: 'border-violet-500/20',
  },
  custom: {
    icon: Terminal,
    gradient: 'from-gray-700 to-gray-900 dark:from-gray-200 dark:to-gray-400',
    shadow: 'shadow-gray-500/20',
    bg: 'bg-gray-500/10',
    text: 'text-gray-900 dark:text-white',
    border: 'border-gray-500/20',
  },
  // Special variant for Security/Admin actions
  security: {
    icon: ShieldCheck,
    gradient: 'from-slate-700 to-black dark:from-white dark:to-slate-200',
    shadow: 'shadow-black/20 dark:shadow-white/20',
    bg: 'bg-black/5 dark:bg-white/10',
    text: 'text-slate-900 dark:text-white',
    border: 'border-slate-900/10 dark:border-white/20',
  }
};

/**
 * Premium "Glass Stack" Toast Component
 * Incorporates:
 * - Ultra-smooth Framer Motion springs
 * - Glassmorphism (Backdrop blur)
 * - Animated gradient progress bar
 * - Dynamic Icon container
 * - Shine effects
 */
const ModernToast = ({ t, type, title, subtitle, icon, duration, action, details }) => {
  const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.custom;
  const Icon = icon || variant.icon;
  const [isExpanded, setIsExpanded] = React.useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Handle unique "loading" spin
  const isSpinning = type === 'loading';

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9, filter: 'blur(10px)' }}
      animate={{
        opacity: t.visible ? 1 : 0,
        y: t.visible ? 0 : -20,
        scale: t.visible ? 1 : 0.9,
        filter: t.visible ? 'blur(0px)' : 'blur(10px)'
      }}
      exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
      transition={{
        default: { type: "spring", stiffness: 400, damping: 30, mass: 1 },
        filter: { type: "tween", duration: 0.2, ease: "easeOut" } // Avoid negative blur values from spring overshoot
      }}
      onMouseMove={handleMouseMove}
      style={{ pointerEvents: 'auto' }}
      className={`
        relative overflow-hidden w-full max-w-[26rem] rounded-[1.25rem]
        bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl
        border border-gray-200/50 dark:border-white/10
        shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]
        ring-1 ring-black/5 dark:ring-white/5
        ring-1 ring-black/5 dark:ring-white/5
        group
      `}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Dynamic Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
        style={{
          background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 80%
              )
            `,
        }}
      />

      {/* Progress Bar */}
      {type !== 'loading' && duration !== Infinity && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: t.visible ? '0%' : '100%' }}
          transition={{ duration: duration ? duration / 1000 : 4, ease: 'linear' }}
          className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${variant.gradient} opacity-50`}
        />
      )}

      <div className="p-4 flex items-start gap-4 z-10 relative">

        {/* Icon Container */}
        <div className={`
            relative flex-shrink-0 w-10 h-10 rounded-[1rem] flex items-center justify-center
            ${variant.bg} ${variant.border} border
            shadow-sm group-hover:scale-105 transition-transform duration-300
          `}>
          <Icon
            className={`w-5 h-5 ${variant.text} ${isSpinning ? 'animate-spin' : ''}`}
            strokeWidth={2.5}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[0.9rem] font-bold text-gray-900 dark:text-gray-100 leading-5 tracking-tight">
              {title}
            </h3>
            <span className="text-[10px] uppercase tracking-wider font-mono text-gray-400 dark:text-gray-600 flex-shrink-0">
              Now
            </span>
          </div>

          {title && subtitle && <div className="h-1" />}

          {subtitle && (
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
              {subtitle}
            </p>
          )}

          {/* Action Buttons & Details Toggle */}
          {(action || details) && (
            <div className="mt-3 flex items-center gap-2">
              {action && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                    if (action.dismiss !== false) toast.dismiss(t.id);
                  }}
                  className={`
                      px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors
                      bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20
                      text-gray-900 dark:text-white
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 dark:focus-visible:ring-white
                    `}
                >
                  {action.label}
                </button>
              )}

              {details && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  {isExpanded ? 'Hide' : 'View'} Details
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <ChevronDown className="w-3 h-3" />
                  </motion.div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={() => toast.dismiss(t.id)}
          className="flex-shrink-0 -mr-1 -mt-1 p-2 rounded-xl
                     text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-white/5
                     transition-all duration-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>

      {/* Expanded Details Section */}
      <AnimatePresence>
        {isExpanded && details && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pb-4"
          >
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 text-[11px] font-mono text-gray-600 dark:text-gray-400 break-all overflow-x-auto">
              {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Generic toaster function that renders the custom component
const toastAdapter = (type, title, subtitleOrOptions = '', options = {}) => {
  let subtitle = '';
  let finalOptions = {};

  if (typeof subtitleOrOptions === 'object') {
    finalOptions = { ...options, ...subtitleOrOptions };
  } else {
    subtitle = subtitleOrOptions;
    finalOptions = options;
  }

  // Set default duration if not provided
  const duration = finalOptions.duration || (type === 'error' ? 8000 : 4000); // Longer for errors

  return toast.custom((t) => (
    <ModernToast
      t={t}
      type={type}
      title={title}
      subtitle={subtitle}
      duration={duration}
      {...finalOptions}
    />
  ), {
    duration: duration,
    position: finalOptions.position || 'top-right',
    id: finalOptions.id,
    // Override potential global styles from App.jsx
    style: {
      background: 'transparent',
      padding: 0,
      boxShadow: 'none',
      border: 'none',
      minWidth: 'auto',
      pointerEvents: 'none', // Let the component handle pointer events
    },
    ...finalOptions,
  });
};

export const showSuccessToast = (title, subtitle, options) => toastAdapter('success', title, subtitle, options);
export const showErrorToast = (title, subtitle, options) => toastAdapter('error', title, subtitle, options);
export const showWarningToast = (title, subtitle, options) => toastAdapter('warning', title, subtitle, options);
export const showInfoToast = (title, subtitle, options) => toastAdapter('info', title, subtitle, options);
export const showLoadingToast = (title, subtitle, options) => toastAdapter('loading', title, subtitle, options);
export const showCustomToast = (title, subtitle, options) => toastAdapter('custom', title, subtitle, options);
export const showSecurityToast = (title, subtitle, options) => toastAdapter('security', title, subtitle, options);

// Legacy compatibility shim
export const showNotification = (
  messageOrConfig,
  type = 'success',
  subtitleOrOptionsOrDuration,
  optionsOrDuration
) => {
  let title = '';
  let subtitle = '';
  let toastType = 'success';
  let options = {};

  // Support object config: { type, title, subtitle, ... }
  if (typeof messageOrConfig === 'object' && messageOrConfig !== null) {
    toastType = messageOrConfig.type || type || 'success';
    title = messageOrConfig.title || messageOrConfig.message || '';
    subtitle = messageOrConfig.subtitle || '';
    options = { ...messageOrConfig.options };
    // Handle varying argument structures
    if (typeof subtitleOrOptionsOrDuration === 'object') {
      options = { ...options, ...subtitleOrOptionsOrDuration };
    }
  } else {
    title = messageOrConfig;
    toastType = type || 'success';
    if (typeof subtitleOrOptionsOrDuration === 'string') {
      subtitle = subtitleOrOptionsOrDuration;
    } else if (typeof subtitleOrOptionsOrDuration === 'object') {
      options = { ...subtitleOrOptionsOrDuration };
    }
    if (typeof optionsOrDuration === 'object') {
      options = { ...options, ...optionsOrDuration };
    }
  }

  const map = {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
    info: showInfoToast,
    loading: showLoadingToast,
    custom: showCustomToast,
    security: showSecurityToast,
  };

  const fn = map[toastType.toLowerCase()] || showSuccessToast;
  return fn(title, subtitle, options);
};

// Wrapped toast object to enforce the new UI
const toastProxy = (message, options) => {
  // Allow direct calls like toast('message') to use our custom UI
  if (typeof message === 'function' || React.isValidElement(message)) {
    return toast.custom(message, options);
  }
  // Default to custom variant for generic messages (preserves glass UI)
  return showCustomToast(message, options?.subtitle, options);
};

// Assign methods to the function
Object.assign(toastProxy, {
  ...toast,
  success: (message, options) => showSuccessToast(message, options?.subtitle, options),
  error: (message, options) => showErrorToast(message, options?.subtitle, options),
  warning: (message, options) => showWarningToast(message, options?.subtitle, options),
  info: (message, options) => showInfoToast(message, options?.subtitle, options),
  loading: (message, options) => showLoadingToast(message, options?.subtitle, options),
  custom: (message, options) => {
    if (typeof message === 'function' || React.isValidElement(message)) {
      return toast.custom(message, options);
    }
    return showCustomToast(message, options?.subtitle, options);
  },
  dismiss: toast.dismiss,
  remove: toast.remove,
  promise: toast.promise,
});

export const dismissToast = (toastId) => toast.dismiss(toastId);
export const dismissAllToasts = () => toast.dismiss();
export { toastProxy as toast };