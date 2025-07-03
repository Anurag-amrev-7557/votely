import toast from 'react-hot-toast';

// Toast configuration types
const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading',
  CUSTOM: 'custom'
};

// Ultra-Enhanced Toast themes with advanced styling, accessibility, dark mode, and animation support
const TOAST_THEMES = {
  success: {
    background: 'linear-gradient(135deg, #059669 0%, #10b981 60%, #047857 100%)',
    borderColor: '#10b981',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#bbf7d0',
    shadow: '0 6px 32px 0 rgba(16,185,129,0.18), 0 1.5px 8px 0 rgba(16,185,129,0.10)',
    ariaRole: 'status',
    animation: 'fadeInUp 0.5s cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)',
      textColor: '#d1fae5',
      subtextColor: '#6ee7b7',
      borderColor: '#34d399',
      shadow: '0 6px 32px 0 rgba(16,185,129,0.28), 0 1.5px 8px 0 rgba(16,185,129,0.18)',
    }
  },
  error: {
    background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 60%, #b91c1c 100%)',
    borderColor: '#ef4444',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#fecaca',
    shadow: '0 6px 32px 0 rgba(239,68,68,0.18), 0 1.5px 8px 0 rgba(239,68,68,0.10)',
    ariaRole: 'alert',
    animation: 'shake 0.6s cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 100%)',
      textColor: '#fecaca',
      subtextColor: '#fca5a5',
      borderColor: '#f87171',
      shadow: '0 6px 32px 0 rgba(239,68,68,0.28), 0 1.5px 8px 0 rgba(239,68,68,0.18)',
    }
  },
  warning: {
    background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 60%, #b45309 100%)',
    borderColor: '#f59e0b',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#fef3c7',
    shadow: '0 6px 32px 0 rgba(245,158,11,0.18), 0 1.5px 8px 0 rgba(245,158,11,0.10)',
    ariaRole: 'alert',
    animation: 'bounceIn 0.6s cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #78350f 0%, #f59e0b 100%)',
      textColor: '#fde68a',
      subtextColor: '#fcd34d',
      borderColor: '#fbbf24',
      shadow: '0 6px 32px 0 rgba(245,158,11,0.28), 0 1.5px 8px 0 rgba(245,158,11,0.18)',
    }
  },
  info: {
    background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #1e3a8a 100%)',
    borderColor: '#3b82f6',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#dbeafe',
    shadow: '0 6px 32px 0 rgba(59,130,246,0.18), 0 1.5px 8px 0 rgba(59,130,246,0.10)',
    ariaRole: 'status',
    animation: 'fadeIn 0.5s cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #1e293b 0%, #1e40af 100%)',
      textColor: '#dbeafe',
      subtextColor: '#60a5fa',
      borderColor: '#60a5fa',
      shadow: '0 6px 32px 0 rgba(59,130,246,0.28), 0 1.5px 8px 0 rgba(59,130,246,0.18)',
    }
  },
  loading: {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 60%, #4f46e5 100%)',
    borderColor: '#8b5cf6',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#e0e7ff',
    shadow: '0 6px 32px 0 rgba(139,92,246,0.18), 0 1.5px 8px 0 rgba(139,92,246,0.10)',
    ariaRole: 'status',
    animation: 'pulse 1.2s infinite cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #312e81 0%, #6366f1 100%)',
      textColor: '#e0e7ff',
      subtextColor: '#a5b4fc',
      borderColor: '#a5b4fc',
      shadow: '0 6px 32px 0 rgba(139,92,246,0.28), 0 1.5px 8px 0 rgba(139,92,246,0.18)',
    }
  },
  custom: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 60%, #7c3aed 100%)',
    borderColor: '#a78bfa',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#ede9fe',
    shadow: '0 6px 32px 0 rgba(167,139,250,0.18), 0 1.5px 8px 0 rgba(167,139,250,0.10)',
    ariaRole: 'status',
    animation: 'fadeIn 0.5s cubic-bezier(0.4,0,0.2,1)',
    dark: {
      background: 'linear-gradient(135deg, #4c1d95 0%, #a78bfa 100%)',
      textColor: '#ede9fe',
      subtextColor: '#c4b5fd',
      borderColor: '#c4b5fd',
      shadow: '0 6px 32px 0 rgba(167,139,250,0.28), 0 1.5px 8px 0 rgba(167,139,250,0.18)',
    }
  }
};

// Enhanced default toast configuration
const DEFAULT_CONFIG = {
  duration: 4000, // Slightly longer for better readability
  position: 'top-right',
  dismissible: true,
  pauseOnHover: true,
  closeOnClick: true,
  showProgress: true,
  animation: {
    in: 'fadeInUp',
    out: 'fadeOutDown',
    duration: 400,
  },
  style: {
    borderRadius: '16px',
    padding: '18px 28px',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.16), 0 4px 16px rgba(0, 0, 0, 0.10)',
    border: '1.5px solid rgba(255, 255, 255, 0.18)',
    backdropFilter: 'blur(16px) saturate(120%)',
    background: 'rgba(255,255,255,0.85)',
    maxWidth: '440px',
    minWidth: '320px',
    fontSize: '15px',
    lineHeight: '1.6',
    color: '#22223b',
    letterSpacing: '0.01em',
    transform: 'translateZ(0) scale(1.01)',
    transition: 'box-shadow 0.2s, background 0.2s, border 0.2s',
    zIndex: 9999,
  },
  ariaLive: 'polite',
  role: 'status',
};

// Enhanced icon components for different toast types with subtle gradients, drop shadows, and accessibility improvements
const ToastIcons = {
  success: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg"
      aria-label="Success"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="success-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bbf7d0" />
            <stop offset="1" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#success-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M5 13l4 4L19 7"
        />
      </svg>
    </span>
  ),
  error: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg"
      aria-label="Error"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="error-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fecaca" />
            <stop offset="1" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#error-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </span>
  ),
  warning: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg"
      aria-label="Warning"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="warning-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fde68a" />
            <stop offset="1" stopColor="#f59e42" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#warning-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    </span>
  ),
  info: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg"
      aria-label="Info"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="info-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#bae6fd" />
            <stop offset="1" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#info-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </span>
  ),
  loading: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg"
      aria-label="Loading"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white animate-spin drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="loading-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ddd6fe" />
            <stop offset="1" stopColor="#a21caf" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#loading-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    </span>
  ),
  custom: (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-violet-600 shadow-lg"
      aria-label="Custom"
      role="img"
    >
      <svg
        className="w-4 h-4 text-white drop-shadow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="custom-stroke" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c7d2fe" />
            <stop offset="1" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <path
          stroke="url(#custom-stroke)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2.5"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    </span>
  ),
};

/**
 * Create a toast notification with enhanced styling and animations
 * @param {string} type - The type of toast (success, error, warning, info, loading, custom)
 * @param {string} title - The main title of the toast
 * @param {string} subtitle - Optional subtitle for additional context
 * @param {Object} options - Additional toast options
 * @returns {string} Toast ID
 */
export const createToast = (type, title, subtitle = '', options = {}) => {
  const theme = TOAST_THEMES[type] || TOAST_THEMES.custom;
  const icon = ToastIcons[type] || ToastIcons.custom;
  
  const toastContent = (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${theme.borderColor}40 0%, ${theme.borderColor}20 100%)` }}
        >
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: theme.subtextColor }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  // Enhanced toastConfig with accessibility, animation, and dark mode support
  const toastConfig = {
    ...DEFAULT_CONFIG,
    ...options,
    style: {
      ...DEFAULT_CONFIG.style,
      background: theme.background,
      color: theme.textColor,
      borderLeft: `4px solid ${theme.borderColor}`,
      boxShadow: theme.shadow,
      animation: theme.animation,
      transition: 'box-shadow 0.2s, background 0.2s, border 0.2s, color 0.2s',
      ...options.style,
    },
    iconTheme: {
      primary: theme.iconColor,
      secondary: theme.borderColor,
      ...options.iconTheme,
    },
    className: `toast-${type}-notification ${options.className || ''}`.trim(),
    role: theme.ariaRole || DEFAULT_CONFIG.role,
    'aria-live': theme.ariaRole === 'alert' ? 'assertive' : 'polite',
    // Add dark mode support if user prefers dark
    ...(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? {
          style: {
            ...DEFAULT_CONFIG.style,
            ...options.style,
            background: 'rgba(30, 41, 59, 0.95)', // dark:slate-800/95
            color: '#f1f5f9', // dark:text-slate-100
            borderLeft: `4px solid ${theme.borderColor}`,
            boxShadow: theme.shadow,
            animation: theme.animation,
            transition: 'box-shadow 0.2s, background 0.2s, border 0.2s, color 0.2s',
          },
        }
      : {}),
  };

  // Add focus ring for accessibility
  toastConfig.style.outline = 'none';
  toastConfig.style.boxShadow += ', 0 0 0 2px rgba(59,130,246,0.15)';

  // Animate toast in/out using react-hot-toast's built-in animation support
  toastConfig.className += ' animate-toast-fade';

  // Optionally add progress bar if enabled
  if (toastConfig.showProgress) {
    toastConfig.className += ' toast-has-progress';
  }

  // Optionally add close button if dismissible
  if (toastConfig.dismissible) {
    toastConfig.className += ' toast-dismissible';
  }

  // Use the correct toast method for type, and add aria-label for screen readers
  if (type === TOAST_TYPES.SUCCESS) {
    return toast.success(
      <div aria-label="Success notification">{toastContent}</div>,
      toastConfig
    );
  } else if (type === TOAST_TYPES.ERROR) {
    return toast.error(
      <div aria-label="Error notification">{toastContent}</div>,
      toastConfig
    );
  } else if (type === TOAST_TYPES.LOADING) {
    return toast.loading(
      <div aria-label="Loading notification">{toastContent}</div>,
      toastConfig
    );
  } else if (type === TOAST_TYPES.WARNING) {
    // react-hot-toast does not have a built-in warning, so use custom
    return toast(
      <div aria-label="Warning notification">{toastContent}</div>,
      { ...toastConfig, icon: ToastIcons.warning }
    );
  } else if (type === TOAST_TYPES.INFO) {
    return toast(
      <div aria-label="Info notification">{toastContent}</div>,
      { ...toastConfig, icon: ToastIcons.info }
    );
  } else {
    return toast(
      <div aria-label="Notification">{toastContent}</div>,
      toastConfig
    );
  }
};

/**
 * Enhanced: Create a success toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showSuccessToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    // Allow passing a config object: { title, subtitle, ... }
    return createToast(TOAST_TYPES.SUCCESS, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.SUCCESS, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.SUCCESS, title, subtitleOrOptions, options);
};

/**
 * Enhanced: Create an error toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showErrorToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    return createToast(TOAST_TYPES.ERROR, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.ERROR, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.ERROR, title, subtitleOrOptions, options);
};

/**
 * Enhanced: Create a warning toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showWarningToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    return createToast(TOAST_TYPES.WARNING, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.WARNING, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.WARNING, title, subtitleOrOptions, options);
};

/**
 * Enhanced: Create an info toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showInfoToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    return createToast(TOAST_TYPES.INFO, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.INFO, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.INFO, title, subtitleOrOptions, options);
};

/**
 * Enhanced: Create a loading toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showLoadingToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    return createToast(TOAST_TYPES.LOADING, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.LOADING, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.LOADING, title, subtitleOrOptions, options);
};

/**
 * Enhanced: Create a custom toast notification with flexible arguments and accessibility.
 * @param {string|object} title - The main title or config object
 * @param {string|object} [subtitleOrOptions] - Optional subtitle or options object
 * @param {object} [options] - Additional options
 * @returns {string} Toast ID
 */
export const showCustomToast = (title, subtitleOrOptions = '', options = {}) => {
  if (typeof title === 'object' && title !== null) {
    return createToast(TOAST_TYPES.CUSTOM, title.title || title.message, title.subtitle || '', { ...title.options, ...subtitleOrOptions });
  }
  if (typeof subtitleOrOptions === 'object' && subtitleOrOptions !== null) {
    return createToast(TOAST_TYPES.CUSTOM, title, '', subtitleOrOptions);
  }
  return createToast(TOAST_TYPES.CUSTOM, title, subtitleOrOptions, options);
};

/**
 * Dismiss a specific toast by ID, with enhanced safety.
 * @param {string} toastId - The toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  if (toastId) toast.dismiss(toastId);
};

/**
 * Dismiss all toasts, with enhanced logging for debugging.
 */
export const dismissAllToasts = () => {
  toast.dismiss();
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[Toast] All toasts dismissed');
  }
};

/**
 * Utility: Check if a toast is active by ID.
 * @param {string} toastId
 * @returns {boolean}
 */
export const isToastActive = (toastId) => {
  return toast.isActive ? toast.isActive(toastId) : false;
};

// Export the toast instance for direct use if needed
export { toast };

// Export types and themes for TypeScript and advanced usage
export { TOAST_TYPES, TOAST_THEMES };

/**
 * Enhanced generic showNotification for compatibility and flexibility.
 * Supports:
 *   - Passing a subtitle as a second argument (string)
 *   - Passing options as third argument, or duration as a number
 *   - Accepts type as string or as an object with { type, title, subtitle, ... }
 *   - Returns the toast ID for further control
 *   - Handles fallback and unknown types gracefully
 *   - Adds accessibility and logging for debugging
 *
 * @param {string|object} messageOrConfig - The main message string, or a config object { type, title, subtitle, ... }
 * @param {string} [type='success'] - Type: 'success', 'error', 'warning', 'info', 'loading', 'custom'
 * @param {string|number|object} [subtitleOrOptionsOrDuration] - Subtitle string, duration in ms, or options object
 * @param {object|number} [optionsOrDuration] - Options object or duration in ms
 * @returns {string} Toast ID
 */
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
    // Allow duration override
    if (typeof messageOrConfig.duration === 'number') {
      options.duration = messageOrConfig.duration;
    }
    // Allow extra options from 2nd/3rd arg
    if (typeof subtitleOrOptionsOrDuration === 'object') {
      options = { ...options, ...subtitleOrOptionsOrDuration };
    } else if (typeof subtitleOrOptionsOrDuration === 'number') {
      options.duration = subtitleOrOptionsOrDuration;
    }
    if (typeof optionsOrDuration === 'object') {
      options = { ...options, ...optionsOrDuration };
    } else if (typeof optionsOrDuration === 'number') {
      options.duration = optionsOrDuration;
    }
  } else {
    // messageOrConfig is a string (message)
    title = messageOrConfig;
    toastType = type || 'success';
    // If subtitle is a string, use as subtitle
    if (typeof subtitleOrOptionsOrDuration === 'string') {
      subtitle = subtitleOrOptionsOrDuration;
    }
    // If subtitle is an object, treat as options
    if (typeof subtitleOrOptionsOrDuration === 'object' && subtitleOrOptionsOrDuration !== null) {
      options = { ...subtitleOrOptionsOrDuration };
    }
    // If subtitle is a number, treat as duration
    if (typeof subtitleOrOptionsOrDuration === 'number') {
      options.duration = subtitleOrOptionsOrDuration;
    }
    // If 4th arg is object, merge as options
    if (typeof optionsOrDuration === 'object' && optionsOrDuration !== null) {
      options = { ...options, ...optionsOrDuration };
    }
    // If 4th arg is number, treat as duration
    if (typeof optionsOrDuration === 'number') {
      options.duration = optionsOrDuration;
    }
  }

  // Normalize type
  const normalizedType = (toastType || '').toLowerCase();
  let toastFn;
  switch (normalizedType) {
    case 'success':
      toastFn = showSuccessToast;
      break;
    case 'error':
      toastFn = showErrorToast;
      break;
    case 'warning':
      toastFn = showWarningToast;
      break;
    case 'info':
      toastFn = showInfoToast;
      break;
    case 'loading':
      toastFn = showLoadingToast;
      break;
    case 'custom':
      toastFn = showCustomToast;
      break;
    default:
      // Fallback to success, but log warning
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`[showNotification] Unknown toast type "${normalizedType}", falling back to "success".`);
      }
      toastFn = showSuccessToast;
      break;
  }

  // Add ARIA live region if not present
  if (!options.role && !options['aria-live']) {
    options.role = ['error', 'warning'].includes(normalizedType) ? 'alert' : 'status';
    options['aria-live'] = ['error', 'warning'].includes(normalizedType) ? 'assertive' : 'polite';
  }

  // Optionally log for debugging
  if (process.env.NODE_ENV !== 'production' && options.debug) {
    // eslint-disable-next-line no-console
    console.debug('[showNotification]', { type: normalizedType, title, subtitle, options });
  }

  // Call the appropriate toast function and return toast ID
  return toastFn(title, subtitle, options);
};