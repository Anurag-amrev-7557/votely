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

// Toast themes with consistent styling
const TOAST_THEMES = {
  success: {
    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    borderColor: '#10b981',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#d1fae5'
  },
  error: {
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    borderColor: '#ef4444',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#fecaca'
  },
  warning: {
    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
    borderColor: '#f59e0b',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#fed7aa'
  },
  info: {
    background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
    borderColor: '#3b82f6',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#dbeafe'
  },
  loading: {
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    borderColor: '#8b5cf6',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#e0e7ff'
  },
  custom: {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    borderColor: '#a78bfa',
    iconColor: '#ffffff',
    textColor: '#ffffff',
    subtextColor: '#ede9fe'
  }
};

// Default toast configuration
const DEFAULT_CONFIG = {
  duration: 3000,
  position: 'top-right',
  style: {
    borderRadius: '12px',
    padding: '16px 20px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(12px)',
    maxWidth: '400px',
    minWidth: '320px',
    fontSize: '14px',
    lineHeight: '1.5',
    transform: 'translateZ(0)',
  }
};

// Icon components for different toast types
const ToastIcons = {
  success: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  loading: (
    <svg className="w-4 h-4 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  custom: (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
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

  const toastConfig = {
    ...DEFAULT_CONFIG,
    ...options,
    style: {
      ...DEFAULT_CONFIG.style,
      background: theme.background,
      color: theme.textColor,
      borderLeft: `4px solid ${theme.borderColor}`,
      ...options.style
    },
    iconTheme: {
      primary: theme.iconColor,
      secondary: theme.borderColor,
      ...options.iconTheme
    },
    className: `toast-${type}-notification`,
  };

  if (type === TOAST_TYPES.SUCCESS) {
    return toast.success(toastContent, toastConfig);
  } else if (type === TOAST_TYPES.ERROR) {
    return toast.error(toastContent, toastConfig);
  } else if (type === TOAST_TYPES.LOADING) {
    return toast.loading(toastContent, toastConfig);
  } else {
    return toast(toastContent, toastConfig);
  }
};

/**
 * Create a success toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showSuccessToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.SUCCESS, title, subtitle, options);
};

/**
 * Create an error toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showErrorToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.ERROR, title, subtitle, options);
};

/**
 * Create a warning toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showWarningToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.WARNING, title, subtitle, options);
};

/**
 * Create an info toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showInfoToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.INFO, title, subtitle, options);
};

/**
 * Create a loading toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showLoadingToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.LOADING, title, subtitle, options);
};

/**
 * Create a custom toast notification
 * @param {string} title - The main title
 * @param {string} subtitle - Optional subtitle
 * @param {Object} options - Additional options
 */
export const showCustomToast = (title, subtitle = '', options = {}) => {
  return createToast(TOAST_TYPES.CUSTOM, title, subtitle, options);
};

/**
 * Dismiss a specific toast by ID
 * @param {string} toastId - The toast ID to dismiss
 */
export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

/**
 * Dismiss all toasts
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Export the toast instance for direct use if needed
export { toast };

// Export types for TypeScript support
export { TOAST_TYPES, TOAST_THEMES }; 