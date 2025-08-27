import { createContext, useContext, useEffect, useState, useCallback, useMemo, useSyncExternalStore, useRef, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ThemeContext = createContext();

ThemeContext.displayName = 'ThemeContext';

export const ThemeProvider = ({ children }) => {
  // Track theme mode: 'light', 'dark', or 'system'
  const [mode, setMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return 'light';
  });

  const location = useLocation();
  const isLandingPage = location.pathname === '/';

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

  // Ultra-Enhanced helper to apply theme to DOM with accessibility, animation, palette, prefers-color-scheme, and contrast support
  const applyTheme = useCallback(
    (theme, options = {}) => {
      const {
        animate = true,
        duration = 400,
        easing = 'cubic-bezier(0.4,0,0.2,1)',
        announce = true,
        palette = {},
        customVars = {},
        contrast = 'normal', // 'normal' | 'high'
        focusRing = true,    // show focus ring for accessibility
        scrollbars = true,   // style scrollbars for theme
        metaThemeColor = true, // set <meta name="theme-color">
      } = options;

      // Remove all known theme classes, add current
      const customThemes = palette?.customThemes || [];
      document.documentElement.classList.remove('light', 'dark', ...customThemes, 'high-contrast');
      if (!isLandingPage) {
        document.documentElement.classList.add(theme);
        if (contrast === 'high') {
          document.documentElement.classList.add('high-contrast');
        }
      }

      // Animate background and color transitions for smoothness
      if (animate) {
        document.documentElement.style.transition = `background-color ${duration}ms ${easing}, color ${duration}ms ${easing}`;
        document.body.style.transition = `background-color ${duration}ms ${easing}, color ${duration}ms ${easing}`;
        setTimeout(() => {
          document.documentElement.style.transition = '';
          document.body.style.transition = '';
        }, duration + 50);
      }

      // Set color-scheme meta tag for system color scheme integration
      let colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');
      if (!colorSchemeMeta) {
        colorSchemeMeta = document.createElement('meta');
        colorSchemeMeta.setAttribute('name', 'color-scheme');
        document.head.appendChild(colorSchemeMeta);
      }
      colorSchemeMeta.setAttribute('content', theme === 'dark' ? 'dark light' : 'light dark');

      // Set <meta name="theme-color"> for mobile browser UI
      if (metaThemeColor) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (!themeColorMeta) {
          themeColorMeta = document.createElement('meta');
          themeColorMeta.setAttribute('name', 'theme-color');
          document.head.appendChild(themeColorMeta);
        }
        // We'll set this below after picking the palette
      }

      // Theme palettes (extendable, with high-contrast support)
      const palettes = {
        light: {
          bg: '#f8fafc',
          text: '#1e293b',
          border: '#d1d5db',
          accent: '#3b82f6',
          muted: '#f1f5f9',
          scrollbar: '#e5e7eb',
          focus: '#2563eb',
        },
        dark: {
          bg: '#181f29',
          text: '#e2e8f0',
          border: '#3a4552',
          accent: '#2563eb',
          muted: '#232b36',
          scrollbar: '#232b36',
          focus: '#60a5fa',
        },
        'high-contrast-light': {
          bg: '#ffffff',
          text: '#000000',
          border: '#000000',
          accent: '#ff0000',
          muted: '#f5f5f5',
          scrollbar: '#cccccc',
          focus: '#ff0000',
        },
        'high-contrast-dark': {
          bg: '#000000',
          text: '#ffffff',
          border: '#ffffff',
          accent: '#ffff00',
          muted: '#222222',
          scrollbar: '#222222',
          focus: '#ffff00',
        },
        ...(palette || {}),
      };

      // Pick palette for theme, fallback to light, support high-contrast
      let paletteKey = theme;
      if (contrast === 'high') {
        paletteKey = `high-contrast-${theme}`;
      }
      const currentPalette = palettes[paletteKey] || palettes[theme] || palettes.light;

      // Set background and text color for both modes for smooth transitions
      document.body.style.backgroundColor = currentPalette.bg;
      document.body.style.color = currentPalette.text;

      // Set CSS variables for enhanced theming
      document.documentElement.style.setProperty('--theme-bg', currentPalette.bg);
      document.documentElement.style.setProperty('--theme-text', currentPalette.text);
      document.documentElement.style.setProperty('--theme-border', currentPalette.border);
      document.documentElement.style.setProperty('--theme-accent', currentPalette.accent);
      document.documentElement.style.setProperty('--theme-muted', currentPalette.muted);
      document.documentElement.style.setProperty('--theme-scrollbar', currentPalette.scrollbar);
      document.documentElement.style.setProperty('--theme-focus', currentPalette.focus);

      // Set any custom CSS variables
      if (customVars && typeof customVars === 'object') {
        Object.entries(customVars).forEach(([key, value]) => {
          document.documentElement.style.setProperty(key, value);
        });
      }

      // Set <meta name="theme-color"> for browser UI
      if (metaThemeColor) {
        let themeColorMeta = document.querySelector('meta[name="theme-color"]');
        if (themeColorMeta) {
          themeColorMeta.setAttribute('content', currentPalette.bg);
        }
      }

      // Accessibility: Announce theme change for screen readers
      if (announce) {
        let liveRegion = document.getElementById('theme-live-region');
        if (!liveRegion) {
          liveRegion = document.createElement('div');
          liveRegion.id = 'theme-live-region';
          liveRegion.setAttribute('aria-live', 'polite');
          liveRegion.setAttribute('role', 'status');
          liveRegion.style.position = 'absolute';
          liveRegion.style.width = '1px';
          liveRegion.style.height = '1px';
          liveRegion.style.overflow = 'hidden';
          liveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
          liveRegion.style.whiteSpace = 'nowrap';
          liveRegion.style.border = '0';
          document.body.appendChild(liveRegion);
        }
        liveRegion.textContent = `Theme changed to ${contrast === 'high' ? 'high-contrast ' : ''}${theme}`;
      }

      // Accessibility: Focus ring for keyboard navigation
      if (focusRing) {
        // Only show focus ring when using keyboard (not mouse)
        const handleKeyDown = (e) => {
          if (e.key === 'Tab') {
            document.body.classList.add('show-focus-outline');
          }
        };
        const handleMouseDown = () => {
          document.body.classList.remove('show-focus-outline');
        };
        window.addEventListener('keydown', handleKeyDown, { passive: true });
        window.addEventListener('mousedown', handleMouseDown, { passive: true });
        // Clean up on theme change
        setTimeout(() => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('mousedown', handleMouseDown);
        }, duration + 100);
      }

      // Style scrollbars for theme
      if (scrollbars) {
        const styleId = 'theme-scrollbar-style';
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = styleId;
          document.head.appendChild(styleTag);
        }
        styleTag.textContent = `
          ::-webkit-scrollbar {
            width: 12px;
            background: var(--theme-scrollbar, ${currentPalette.scrollbar});
          }
          ::-webkit-scrollbar-thumb {
            background: var(--theme-border, ${currentPalette.border});
            border-radius: 6px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--theme-accent, ${currentPalette.accent});
          }
          html {
            scrollbar-color: var(--theme-border, ${currentPalette.border}) var(--theme-scrollbar, ${currentPalette.scrollbar});
            scrollbar-width: thin;
          }
        `;
      }

      // Dev: Log theme changes
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.debug(`[Theme] Applied theme: ${theme}${contrast === 'high' ? ' (high-contrast)' : ''}`, { palette: currentPalette });
      }
    },
    [isLandingPage]
  );

  /**
   * Ultra-Advanced Infinity Toggle Theme
   * Features:
   * - Cycles through 'light', 'dark', and 'system' (if enabled)
   * - Supports custom theme palettes (future-proof)
   * - Animates transitions with configurable duration and easing
   * - Persists user preference in localStorage/sessionStorage/cookies (configurable)
   * - Broadcasts theme changes across tabs/windows (via storage event and custom event)
   * - Integrates with OS-level theme (system)
   * - Supports accessibility: announces theme change for screen readers
   * - Accepts config: { allowSystem, animate, duration, easing, storage, announce, onThemeChange }
   * - Debounces rapid toggles to prevent flicker
   * - Logs theme changes in dev mode for debugging
   */
  const toggleTheme = useCallback(
    (config = {}) => {
      const {
        allowSystem = false,
        animate = true,
        duration = 500,
        easing = 'ease-in-out',
        storage = 'local', // 'local' | 'session' | 'cookie'
        announce = true,
        onThemeChange = null,
        debounceMs = 200,
        customThemes = [], // e.g. ['solarized', ...]
      } = config;

      // Debounce rapid toggles
      if (!toggleTheme._lastToggle) toggleTheme._lastToggle = 0;
      const now = Date.now();
      if (now - toggleTheme._lastToggle < debounceMs) return;
      toggleTheme._lastToggle = now;

      // Compose theme cycle
      const baseThemes = ['light', 'dark'];
      const themeCycle = allowSystem
        ? [...baseThemes, 'system', ...customThemes]
        : [...baseThemes, ...customThemes];

      // Animate transition
      if (animate) {
        document.documentElement.style.transition = `background-color ${duration}ms ${easing}, color ${duration}ms ${easing}`;
        document.documentElement.classList.add('theme-transition', 'theme-transitioning');
      }

      requestAnimationFrame(() => {
        setMode((prev) => {
          // Find next theme in cycle
          let idx = themeCycle.indexOf(prev);
          if (idx === -1) {
            // If unknown, use current effective theme
            const eff = getEffectiveTheme();
            idx = themeCycle.indexOf(eff);
          }
          let next = themeCycle[(idx + 1) % themeCycle.length];

          // Fallback: if next is not valid, default to 'light'
          if (!next || !themeCycle.includes(next)) next = 'light';

          // Persist preference
          if (storage === 'local') {
            if (next === 'system') localStorage.removeItem('theme');
            else localStorage.setItem('theme', next);
          } else if (storage === 'session') {
            if (next === 'system') sessionStorage.removeItem('theme');
            else sessionStorage.setItem('theme', next);
          } else if (storage === 'cookie') {
            document.cookie = next === 'system'
              ? 'theme=; Max-Age=0; path=/'
              : `theme=${next}; path=/; max-age=31536000`;
          }

          // Apply theme (handle 'system' and custom themes)
          let toApply = next;
          if (next === 'system') toApply = getEffectiveTheme();
          applyTheme(toApply);

          // Broadcast theme change (storage event for cross-tab, custom event for in-app)
          try {
            window.dispatchEvent(
              new CustomEvent('theme-changed', { detail: { theme: next, applied: toApply } })
            );
            if (storage === 'local') {
              localStorage.setItem('__theme_broadcast', JSON.stringify({ theme: next, ts: Date.now() }));
            }
          } catch {}

          // Accessibility: announce theme change for screen readers
          if (announce) {
            let liveRegion = document.getElementById('theme-live-region');
            if (!liveRegion) {
              liveRegion = document.createElement('div');
              liveRegion.id = 'theme-live-region';
              liveRegion.setAttribute('aria-live', 'polite');
              liveRegion.setAttribute('role', 'status');
              liveRegion.style.position = 'absolute';
              liveRegion.style.left = '-9999px';
              liveRegion.style.height = '1px';
              liveRegion.style.width = '1px';
              liveRegion.style.overflow = 'hidden';
              document.body.appendChild(liveRegion);
            }
            liveRegion.textContent = `Theme changed to ${next}`;
          }

          // Dev logging
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.debug(`[ThemeContext] Theme toggled: ${prev} → ${next} (applied: ${toApply})`);
          }

          // Callback
          if (typeof onThemeChange === 'function') {
            try {
              onThemeChange(next, toApply);
            } catch (err) {
              // eslint-disable-next-line no-console
              console.error('[ThemeContext] onThemeChange error:', err);
            }
          }

          // Remove transition after duration
          if (animate) {
            setTimeout(() => {
              document.documentElement.classList.remove('theme-transition', 'theme-transitioning');
              document.documentElement.style.transition = '';
            }, duration);
          }

          return next;
        });
      });
    },
    [applyTheme, getEffectiveTheme]
  );

  // Set theme directly: 'dark', 'light', or 'system'
  const setTheme = useCallback(
    (theme) => {
      if (theme !== 'dark' && theme !== 'light' && theme !== 'system') return;
      document.documentElement.classList.add('theme-transition', 'theme-transitioning');
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

  // Enhanced: Apply theme on mount, on effectiveTheme changes, and handle accessibility, cross-tab sync, and reduced motion
  useEffect(() => {
    // Respect reduced motion for transitions
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    applyTheme(effectiveTheme, { animate: !prefersReducedMotion });

    // Remove transition class after transition completes (duration matches applyTheme default)
    const timeoutId = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition', 'theme-transitioning');
    }, prefersReducedMotion ? 0 : 500);

    // Accessibility: Announce theme change for screen readers
    let liveRegion;
    if (typeof window !== 'undefined') {
      liveRegion = document.getElementById('theme-live-region');
      if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'theme-live-region';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('role', 'status');
        liveRegion.style.position = 'absolute';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.overflow = 'hidden';
        liveRegion.style.clip = 'rect(1px, 1px, 1px, 1px)';
        liveRegion.style.whiteSpace = 'nowrap';
        liveRegion.style.border = '0';
        document.body.appendChild(liveRegion);
      }
      liveRegion.textContent = `Theme set to ${effectiveTheme}`;
    }

    // Cross-tab/theme sync: Listen for storage events
    const handleStorage = (e) => {
      if (e.key === 'theme') {
        // If theme changed in another tab, update here
        const newTheme = e.newValue || 'system';
        if (newTheme !== effectiveTheme) {
          // Use setTimeout to avoid React state update in event handler warning
          setTimeout(() => {
            applyTheme(newTheme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : newTheme);
          }, 0);
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('storage', handleStorage);
      if (liveRegion) {
        liveRegion.textContent = '';
      }
    };
  }, [effectiveTheme, applyTheme]);

  // Enhanced: Listen for system color scheme changes if mode is 'system', and update theme accordingly
  useEffect(() => {
    if (mode !== 'system') return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Optionally animate only if not reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      applyTheme(e.matches ? 'dark' : 'light', { animate: !prefersReducedMotion });
      // Announce for accessibility
      const liveRegion = document.getElementById('theme-live-region');
      if (liveRegion) {
        liveRegion.textContent = `Theme set to ${e.matches ? 'dark' : 'light'} (system preference)`;
      }
    };
    media.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      media.removeEventListener('change', handleChange);
    };
  }, [mode, applyTheme]);

  // Enhanced: Expose more info, helpers, and utilities for theme context consumers
  const themeValue = useMemo(() => {
    // Helper: Get current system preference (live)
    const getSystemPref = () =>
      window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;

    // Helper: Get user theme from localStorage (may be null)
    const getUserTheme = () => localStorage.getItem('theme');

    // Helper: Set theme with validation and event dispatch
    const safeSetTheme = (theme) => {
      if (!['dark', 'light', 'system'].includes(theme)) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`setTheme: invalid theme "${theme}"`);
        }
        return;
      }
      setTheme(theme);
      // Dispatch a custom event for listeners (e.g., for analytics or cross-tab sync)
      window.dispatchEvent(new CustomEvent('theme:change', { detail: { theme } }));
    };

    // Helper: Toggle between dark/light only (ignores system)
    const toggleDarkLight = () => {
      safeSetTheme(isDarkMode ? 'light' : 'dark');
    };

    // Helper: Reset to system theme
    const resetToSystem = () => safeSetTheme('system');

    // Helper: For cross-tab sync, listen to theme changes
    const onThemeChange = (cb) => {
      window.addEventListener('theme:change', cb);
      return () => window.removeEventListener('theme:change', cb);
    };

    // Helper: For debugging
    const debug = () => ({
      mode,
      effectiveTheme,
      isDarkMode,
      isLightMode,
      isSystemTheme,
      systemPrefersDark: getSystemPref(),
      userTheme: getUserTheme(),
    });

    return {
      isDarkMode,
      isLightMode,
      isSystemTheme,
      mode, // 'dark' | 'light' | 'system'
      effectiveTheme, // 'dark' | 'light'
      toggleTheme,
      setTheme: safeSetTheme,
      toggleDarkLight,
      resetToSystem,
      systemPrefersDark: getSystemPref(),
      userTheme: getUserTheme(), // 'dark' | 'light' | null
      onThemeChange,
      debug,
    };
  }, [
    isDarkMode,
    isLightMode,
    isSystemTheme,
    mode,
    effectiveTheme,
    toggleTheme,
    setTheme,
  ]);

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        className={isLandingPage ? (isDarkMode ? 'dark' : 'light') : ''}
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

// --- Ultra-Advanced useTheme Hook: Robust, Reactive, Cross-Tab, and Dev-Optimized ---

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  // --- System preference subscription (reacts to system changes, concurrent-safe) ---
  const getSystemPrefSnapshot = useCallback(() => {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }, []);
  const subscribeSystemPref = useCallback((cb) => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', cb);
    return () => mql.removeEventListener('change', cb);
  }, []);
  const systemPrefersDark = useSyncExternalStore(subscribeSystemPref, getSystemPrefSnapshot, getSystemPrefSnapshot);

  // --- Cross-tab theme sync (listen to storage and custom events) ---
  const [crossTabTheme, setCrossTabTheme] = useState(() => localStorage.getItem('theme'));
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'theme') setCrossTabTheme(e.newValue);
    };
    const onThemeChange = () => setCrossTabTheme(localStorage.getItem('theme'));
    window.addEventListener('storage', onStorage);
    window.addEventListener('themechange', onThemeChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('themechange', onThemeChange);
    };
  }, []);

  // --- Robust setTheme: validation, event dispatch, cross-tab, dev logging, async support ---
  const setTheme = useCallback(
    async (theme, { force = false } = {}) => {
      if (!['dark', 'light', 'system'].includes(theme)) {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.warn(`[useTheme] setTheme: invalid theme "${theme}"`);
        }
        return;
      }
      // Only update if different or force
      const current = localStorage.getItem('theme');
      if (!force && current === theme) return;

      if (theme === 'system') {
        localStorage.removeItem('theme');
      } else {
        localStorage.setItem('theme', theme);
      }
      // Dispatch a custom event for cross-tab sync
      window.dispatchEvent(new Event('themechange'));

      // Optionally, update context if needed (for advanced SSR/hydration)
      if (typeof context.setTheme === 'function') {
        context.setTheme(theme);
      }
    },
    [context]
  );

  // --- Toggle theme: cycles through dark, light, system, with optional custom order ---
  const toggleTheme = useCallback(
    (order = ['light', 'dark', 'system']) => {
      const userTheme = localStorage.getItem('theme') || 'system';
      const idx = order.indexOf(userTheme);
      const next = order[(idx + 1) % order.length];
      setTheme(next, { force: true });
    },
    [setTheme]
  );

  // --- User theme detection, helpers, and advanced info ---
  const userTheme = useMemo(() => {
    // Prefer cross-tab value for instant sync
    return crossTabTheme || localStorage.getItem('theme');
  }, [crossTabTheme, context.mode]);

  const isSystemTheme = useMemo(() => !userTheme || userTheme === 'system', [userTheme]);
  const effectiveTheme = useMemo(() => {
    if (isSystemTheme) return systemPrefersDark ? 'dark' : 'light';
    return userTheme;
  }, [isSystemTheme, userTheme, systemPrefersDark]);

  // --- Advanced: expose full context, helpers, and utilities ---
  // Includes: next theme, sync, debug, SSR/hydration support, and more
  const getNextTheme = useCallback(
    (order = ['light', 'dark', 'system']) => {
      const current = userTheme || 'system';
      const idx = order.indexOf(current);
      return order[(idx + 1) % order.length];
    },
    [userTheme]
  );

  // --- Advanced: force sync with system (for programmatic triggers) ---
  const syncWithSystem = useCallback(() => setTheme('system', { force: true }), [setTheme]);

  // --- Advanced: Debug info for development ---
  const debug = useMemo(() => {
    if (process.env.NODE_ENV !== 'development') return undefined;
    return {
      userTheme,
      isSystemTheme,
      systemPrefersDark,
      effectiveTheme,
      contextMode: context.mode,
      contextEffectiveTheme: context.effectiveTheme,
      crossTabTheme,
      now: new Date().toISOString(),
    };
  }, [userTheme, isSystemTheme, systemPrefersDark, effectiveTheme, context, crossTabTheme]);

  // --- Advanced: SSR/hydration support (optional) ---
  // Optionally, you could add logic here to support SSR/Next.js hydration mismatches

  // --- Advanced: Accessibility helpers ---
  const prefersDark = systemPrefersDark;
  const prefersLight = !systemPrefersDark;

  // --- Advanced: Expose everything in a stable object ---
  return useMemo(
    () => ({
      ...context,
      mode: userTheme || 'system',
      setTheme,
      toggleTheme,
      isDarkMode: effectiveTheme === 'dark',
      isLightMode: effectiveTheme === 'light',
      isSystemTheme,
      systemPrefersDark,
      userTheme, // 'dark' | 'light' | null
      prefersDark,
      prefersLight,
      effectiveTheme,
      getNextTheme,
      syncWithSystem,
      debug,
      // For advanced consumers:
      _internal: {
        crossTabTheme,
        context,
      },
    }),
    [
      context,
      setTheme,
      toggleTheme,
      isSystemTheme,
      systemPrefersDark,
      userTheme,
      prefersDark,
      prefersLight,
      effectiveTheme,
      getNextTheme,
      syncWithSystem,
      debug,
      crossTabTheme,
    ]
  );
};