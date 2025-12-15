import React from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Loader2,
  Terminal,
  X
} from 'lucide-react';

// Modern, minimalist color palette with refined gradients
const TOAST_VARIANTS = {
  success: {
    icon: CheckCircle2,
    primary: '#10b981', // emerald-500
    secondary: '#d1fae5', // emerald-100
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-500',
  },
  error: {
    icon: XCircle,
    primary: '#ef4444', // red-500
    secondary: '#fee2e2', // red-100
    gradient: 'from-red-500/10 to-red-500/5',
    border: 'border-red-500/20',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    primary: '#f59e0b', // amber-500
    secondary: '#fef3c7', // amber-100
    gradient: 'from-amber-500/10 to-amber-500/5',
    border: 'border-amber-500/20',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: Info,
    primary: '#3b82f6', // blue-500
    secondary: '#dbeafe', // blue-100
    gradient: 'from-blue-500/10 to-blue-500/5',
    border: 'border-blue-500/20',
    iconColor: 'text-blue-500',
  },
  loading: {
    icon: Loader2,
    primary: '#8b5cf6', // violet-500
    secondary: '#ede9fe', // violet-100
    gradient: 'from-violet-500/10 to-violet-500/5',
    border: 'border-violet-500/20',
    iconColor: 'text-violet-500',
  },
  custom: {
    icon: Terminal,
    primary: '#6366f1', // indigo-500
    secondary: '#e0e7ff', // indigo-100
    gradient: 'from-indigo-500/10 to-indigo-500/5',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-500',
  }
};

/**
 * Modern Toast Component using Framer Motion
 */
const ModernToast = ({ t, type, title, subtitle, icon }) => {
  const variant = TOAST_VARIANTS[type] || TOAST_VARIANTS.custom;
  const Icon = icon || variant.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
        mass: 1
      }}
      className={`
        relative w-full max-w-sm overflow-hidden rounded-2xl 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl 
        border ${variant.border} shadow-[0_8px_30px_rgb(0,0,0,0.12)]
        dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]
        p-4 pointer-events-auto flex items-start gap-3
        ring-1 ring-black/5 dark:ring-white/10
      `}
      role="alert"
    >
      {/* Decorative gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${variant.gradient} opacity-50`} />

      {/* Icon Section */}
      <div className={`relative flex-shrink-0 mt-0.5 ${variant.iconColor}`}>
        <Icon
          className={`w-5 h-5 ${type === 'loading' ? 'animate-spin' : ''}`}
          strokeWidth={2.5}
        />
      </div>

      {/* Content Section */}
      <div className="relative flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="relative flex-shrink-0 -mr-1 -mt-1 p-1.5 rounded-full 
                   text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 
                   hover:bg-slate-100 dark:hover:bg-slate-800 
                   transition-colors duration-200"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar (optional, can be added if needed, kept minimal for now) */}
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

  return toast.custom((t) => (
    <ModernToast
      t={t}
      type={type}
      title={title}
      subtitle={subtitle}
      {...finalOptions}
    />
  ), {
    duration: finalOptions.duration || 4000,
    position: finalOptions.position || 'top-right',
    ...finalOptions,
  });
};

// Exported tailored functions
export const showSuccessToast = (title, subtitle, options) => toastAdapter('success', title, subtitle, options);
export const showErrorToast = (title, subtitle, options) => toastAdapter('error', title, subtitle, options);
export const showWarningToast = (title, subtitle, options) => toastAdapter('warning', title, subtitle, options);
export const showInfoToast = (title, subtitle, options) => toastAdapter('info', title, subtitle, options);
export const showLoadingToast = (title, subtitle, options) => toastAdapter('loading', title, subtitle, options);
export const showCustomToast = (title, subtitle, options) => toastAdapter('custom', title, subtitle, options);

// Legacy compatibility shim for `showNotification`
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

  // Map simplified types to functions
  const map = {
    success: showSuccessToast,
    error: showErrorToast,
    warning: showWarningToast,
    info: showInfoToast,
    loading: showLoadingToast,
    custom: showCustomToast,
  };

  const fn = map[toastType.toLowerCase()] || showSuccessToast;
  return fn(title, subtitle, options);
};

export const dismissToast = (toastId) => toast.dismiss(toastId);
export const dismissAllToasts = () => toast.dismiss();
export { toast };