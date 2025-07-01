import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Track theme mode: 'light', 'dark', or 'system'
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return 'system';
  });

  // Compute effective theme: respects system if mode is 'system'
  const getEffectiveTheme = useCallback(() => {
    if (mode === 'dark' || mode === 'light') return mode;
    // system mode
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }, [mode]);

  const effectiveTheme = getEffectiveTheme();
  const isDarkMode = effectiveTheme === 'dark';
  const isLightMode = effectiveTheme === 'light';
  const isSystemTheme = mode === 'system';

  // Helper to apply theme to DOM
  const applyTheme = useCallback(
    (theme) => {
      // Remove both theme classes before adding the new one
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);

      // Set color-scheme meta tag for system color scheme integration
      let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
      if (!colorSchemeMeta) {
        colorSchemeMeta = document.createElement('meta');
        colorSchemeMeta.setAttribute('name', 'color-scheme');
        document.head.appendChild(colorSchemeMeta);
      }
      // Always prefer current mode first for color-scheme
      colorSchemeMeta.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');

      // Set background and text color for both modes for smooth transitions
      if (theme === 'dark') {
        document.body.style.backgroundColor = '#181f29';
        document.body.style.color = '#e2e8f0';
      } else {
        document.body.style.backgroundColor = '#f8fafc';
        document.body.style.color = '#1e293b';
      }

      // Set CSS variables for enhanced theming
      document.documentElement.style.setProperty('--theme-bg', theme === 'dark' ? '#181f29' : '#f8fafc');
      document.documentElement.style.setProperty('--theme-text', theme === 'dark' ? '#e2e8f0' : '#1e293b');
      document.documentElement.style.setProperty('--theme-border', theme === 'dark' ? '#3a4552' : '#d1d5db');
      document.documentElement.style.setProperty('--theme-accent', theme === 'dark' ? '#2563eb' : '#3b82f6');
      document.documentElement.style.setProperty('--theme-muted', theme === 'dark' ? '#232b36' : '#f1f5f9');
    },
    []
  );

  // Toggle between light and dark mode (never sets to 'system')
  const toggleTheme = useCallback(() => {
    document.documentElement.classList.add('theme-transition');
    requestAnimationFrame(() => {
      setMode((prev) => {
        let next;
        if (prev === 'dark') next = 'light';
        else if (prev === 'light') next = 'dark';
        else next = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        return next;
      });
    });
  }, [applyTheme, getEffectiveTheme]);

  // Set theme directly: 'dark', 'light', or 'system'
  const setTheme = useCallback(
    (theme) => {
      if (theme !== 'dark' && theme !== 'light' && theme !== 'system') return;
      document.documentElement.classList.add('theme-transition');
      requestAnimationFrame(() => {
        if (theme === 'system') {
          localStorage.removeItem('theme');
        } else {
          localStorage.setItem('theme', theme);
        }
        setMode(theme);
        // Apply the correct theme immediately
        const toApply = theme === 'system' ? getEffectiveTheme() : theme;
        applyTheme(toApply);
      });
    },
    [applyTheme, getEffectiveTheme]
  );

  // Apply theme on mount and when effectiveTheme changes
  useEffect(() => {
    applyTheme(effectiveTheme);

    // Remove transition class after transition completes
    const timeoutId = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [effectiveTheme, applyTheme]);

  // Listen for system color scheme changes if mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      applyTheme(e.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, [mode, applyTheme]);

  // Expose more info and helpers
  const themeValue = useMemo(
    () => ({
      isDarkMode,
      isLightMode,
      isSystemTheme,
      mode, // 'dark' | 'light' | 'system'
      effectiveTheme, // 'dark' | 'light'
      toggleTheme,
      setTheme,
      systemPrefersDark: window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
      userTheme: localStorage.getItem('theme'), // 'dark' | 'light' | null
    }),
    [isDarkMode, isLightMode, isSystemTheme, mode, effectiveTheme, toggleTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        className={isDarkMode ? 'dark' : 'light'}
        style={{
          minHeight: '100vh',
          backgroundColor: isDarkMode ? '#181f29' : '#f8fafc',
          color: isDarkMode ? '#e2e8f0' : '#1e293b',
          transition: 'background-color 0.2s, color 0.2s',
        }}
        data-theme={mode}
        data-effective-theme={effectiveTheme}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  const { isDarkMode, isLightMode, mode, toggleTheme } = context;

  // Enhanced: Provide helpers for querying and setting theme, and system preference
  const systemPrefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

  // Set theme to a specific value ('dark' | 'light' | 'system')
  const setTheme = (theme) => {
    if (theme === 'system') {
      localStorage.removeItem('theme');
      // Set according to system preference
      if (systemPrefersDark && !isDarkMode) {
        toggleTheme();
      } else if (!systemPrefersDark && isDarkMode) {
        toggleTheme();
      }
    } else if (theme === 'dark' && !isDarkMode) {
      toggleTheme();
    } else if (theme === 'light' && isDarkMode) {
      toggleTheme();
    }
  };

  // Query if theme is set by user or system
  const userTheme = localStorage.getItem('theme');
  const isSystemTheme = !userTheme;

  // Enhanced: Expose more helpers and info
  return {
    ...context,
    mode: isDarkMode ? 'dark' : 'light',
    setTheme,
    toggleTheme,
    isDarkMode,
    isLightMode: !isDarkMode,
    isSystemTheme,
    systemPrefersDark,
    userTheme, // 'dark' | 'light' | null
  };
};