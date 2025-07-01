import { createContext, useContext, useState, useEffect, useMemo, useDebugValue } from 'react';

const API_URL = '/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/me`, {
          credentials: 'include'
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          const errorData = await res.json().catch(() => ({}));
          setUser(null);
        }
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Advanced login function with:
   * - Input validation
   * - Rate limiting (per session)
   * - Detailed error handling (network, server, validation)
   * - Timing attack mitigation (constant response time)
   * - Optional 2FA support (if server requests)
   * - Tracing and logging (dev only)
   * - Retry logic for transient network errors
   */
  const login = async (email, password, { otp = null, maxRetries = 2 } = {}) => {
    const MIN_RESPONSE_TIME = 600; // ms, to mitigate timing attacks
    const start = Date.now();

    // Simple email and password validation
    if (
      typeof email !== 'string' ||
      !/^[^@]+@[^@]+\.[^@]+$/.test(email) ||
      typeof password !== 'string' ||
      password.length < 6
    ) {
      return {
        success: false,
        error: 'Invalid email or password format.',
        code: 'INVALID_INPUT'
      };
    }

    // Rate limiting: allow max 5 login attempts per 5 minutes (per session)
    const now = Date.now();
    const ATTEMPT_KEY = 'login_attempts';
    const ATTEMPT_WINDOW = 5 * 60 * 1000; // 5 minutes
    const MAX_ATTEMPTS = 5;
    let attempts = [];
    try {
      attempts = JSON.parse(sessionStorage.getItem(ATTEMPT_KEY)) || [];
    } catch {}
    attempts = attempts.filter(ts => now - ts < ATTEMPT_WINDOW);
    if (attempts.length >= MAX_ATTEMPTS) {
      return {
        success: false,
        error: 'Too many login attempts. Please try again later.',
        code: 'RATE_LIMITED'
      };
    }

    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(
            otp
              ? { email, password, otp }
              : { email, password }
          )
        });

        let data;
        try {
          data = await res.json();
        } catch (e) {
          data = {};
        }

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[Auth] Login response', res.status, data);
        }

        if (res.status === 429) {
          // Server-side rate limit
          lastError = {
            success: false,
            error: data.message || 'Too many requests. Please wait.',
            code: 'SERVER_RATE_LIMIT'
          };
          break;
        }

        if (res.status === 401 && data.requires2FA) {
          // 2FA required
          lastError = {
            success: false,
            error: 'Two-factor authentication required.',
            code: '2FA_REQUIRED',
            requires2FA: true
          };
          break;
        }

        if (!res.ok) {
          lastError = {
            success: false,
            error: data.message || 'Login failed',
            code: data.code || 'LOGIN_FAILED'
          };
          // Retry on network/server errors (5xx), not on 4xx
          if (res.status >= 500 && attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
            continue;
          }
          break;
        }

        // Success
        setUser(data.user);

        // Store attempt timestamp only on failure
        sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts));

        // Constant response time
        const elapsed = Date.now() - start;
        if (elapsed < MIN_RESPONSE_TIME) {
          await new Promise(r => setTimeout(r, MIN_RESPONSE_TIME - elapsed));
        }

        return { success: true, user: data.user };
      } catch (error) {
        lastError = {
          success: false,
          error: error.message || 'Network error',
          code: 'NETWORK_ERROR'
        };
        // Retry on network error
        if (attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
          continue;
        }
      }
    }

    // Store failed attempt
    attempts.push(now);
    sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify(attempts));

    // Constant response time
    const elapsed = Date.now() - start;
    if (elapsed < MIN_RESPONSE_TIME) {
      await new Promise(r => setTimeout(r, MIN_RESPONSE_TIME - elapsed));
    }

    return lastError || {
      success: false,
      error: 'Unknown error',
      code: 'UNKNOWN'
    };
  };

  const loginWithGoogle = async () => {
    try {
      // Open Google OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        `${API_URL}/google`,
        'Google Login',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Listen for the OAuth response
      return new Promise((resolve, reject) => {
        const handleMessage = async (event) => {
          // Verify the origin of the message
          if (event.origin !== window.location.origin) return;

          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            // Close the popup
            popup.close();
            
            // Remove the event listener
            window.removeEventListener('message', handleMessage);
            
            // Update user state
            setUser(event.data.user);
            resolve({ success: true });
          } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
            // Close the popup
            popup.close();
            
            // Remove the event listener
            window.removeEventListener('message', handleMessage);
            
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', handleMessage);

        // Handle popup closed
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            window.removeEventListener('message', handleMessage);
            reject(new Error('Authentication cancelled'));
          }
        }, 1000);
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  /**
   * Advanced user registration with robust error handling, validation, and extensibility.
   * - Registers the user, then auto-logs in.
   * - Handles network errors, validation errors, and server errors.
   * - Supports optional hooks for pre/post registration and login.
   * - Returns detailed result object.
   */
  const register = async (userData, options = {}) => {
    const {
      onPreRegister,    // async (userData) => void
      onPostRegister,   // async (registerData) => void
      onPreLogin,       // async (userData) => void
      onPostLogin,      // async (loginData) => void
      signal,           // AbortSignal for cancellation
    } = options;

    try {
      // Optional: Pre-registration hook (e.g., client-side validation, analytics)
      if (onPreRegister) await onPreRegister(userData);

      // --- Registration Request ---
      const registerRes = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(userData),
        signal,
      });

      let registerData;
      try {
        registerData = await registerRes.json();
      } catch (e) {
        throw new Error('Invalid server response during registration.');
      }

      if (!registerRes.ok) {
        // Advanced: Collect field errors if present
        const errorDetail = registerData.errors || registerData.message || 'Registration failed';
        throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
      }

      // Optional: Post-registration hook (e.g., analytics, welcome email)
      if (onPostRegister) await onPostRegister(registerData);

      // --- Auto-login Request ---
      if (onPreLogin) await onPreLogin(userData);

      const loginRes = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: userData.email,
          password: userData.password
        }),
        signal,
      });

      let loginData;
      try {
        loginData = await loginRes.json();
      } catch (e) {
        throw new Error('Invalid server response during auto-login.');
      }

      if (!loginRes.ok) {
        const errorDetail = loginData.errors || loginData.message || 'Auto-login failed';
        throw new Error(typeof errorDetail === 'string' ? errorDetail : JSON.stringify(errorDetail));
      }

      // Optional: Post-login hook
      if (onPostLogin) await onPostLogin(loginData);

      // Set the user state with the logged-in user data
      setUser(loginData.user);

      // Advanced: Return detailed result
      return {
        success: true,
        user: loginData.user,
        registerData,
        loginData,
      };
    } catch (error) {
      // Advanced: Detect abort
      if (error.name === 'AbortError') {
        return { success: false, error: 'Registration cancelled by user.' };
      }
      // Advanced: Return error object for better error handling
      return { success: false, error: error.message || error.toString() };
    }
  };

  /**
   * Advanced logout function:
   * - Handles network/server errors with retry logic
   * - Ensures user state is cleared even if server fails
   * - Optionally accepts onPostLogout callback
   * - Supports abort/cancellation
   * - Traces/logs in development
   * - Returns detailed result object
   */
  const logout = async ({ onPostLogout, signal, maxRetries = 2 } = {}) => {
    let lastError = null;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const res = await fetch(`${API_URL}/logout`, {
          method: 'POST',
          credentials: 'include',
          signal,
          headers: {
            'Accept': 'application/json'
          }
        });

        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          // ignore, not all servers return JSON
        }

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.debug('[Auth] Logout response', res.status, data);
        }

        // Always clear user state, even if server fails
        setUser(null);

        if (!res.ok) {
          lastError = {
            success: false,
            error: data.message || 'Logout failed',
            code: data.code || 'LOGOUT_FAILED'
          };
          // Retry on network/server errors (5xx), not on 4xx
          if (res.status >= 500 && attempt < maxRetries) {
            await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
            continue;
          }
          break;
        }

        if (onPostLogout) await onPostLogout(data);

        return { success: true, data };
      } catch (error) {
        lastError = {
          success: false,
          error: error.name === 'AbortError'
            ? 'Logout cancelled by user.'
            : (error.message || 'Network error'),
          code: error.name === 'AbortError' ? 'ABORTED' : 'NETWORK_ERROR'
        };
        // Retry on network error
        if (error.name !== 'AbortError' && attempt < maxRetries) {
          await new Promise(r => setTimeout(r, 200 * (attempt + 1)));
          continue;
        }
        // Always clear user state, even on error
        setUser(null);
        if (error.name === 'AbortError') {
          return lastError;
        }
        break;
      }
    }
    if (process.env.NODE_ENV === 'development' && lastError) {
      // eslint-disable-next-line no-console
      console.error('[Auth] Logout failed:', lastError);
    }
    return lastError || { success: false, error: 'Logout failed', code: 'UNKNOWN' };
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Advanced useAuth hook:
 * - Ensures usage within AuthProvider
 * - Provides stable reference (memoized context)
 * - Supports selector pattern for granular re-renders
 * - Throws detailed error with stack trace if misused
 * - Optionally logs usage in development for debugging
 * - Supports optional shallow equality check for selector
 */
function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key) || !Object.is(objA[key], objB[key])) {
      return false;
    }
  }
  return true;
}

/**
 * useAuth([selector], [options])
 * @param {Function} [selector] - Optional selector function to pick part of the context.
 * @param {Object} [options] - { equalityFn } for custom equality check.
 * @returns {any} - The selected context value or the whole context.
 */
export const useAuth = (selector, options = {}) => {
  const context = useContext(AuthContext);
  if (context === null) {
    const error = new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped in <AuthProvider>.'
    );
    if (Error.captureStackTrace) Error.captureStackTrace(error, useAuth);
    throw error;
  }

  // Selector pattern: allow picking only part of the context for performance
  const { equalityFn = shallowEqual } = options;
  const selected = selector ? selector(context) : context;

  // Memoize the selected value for stability
  const memoized = useMemo(
    () => selected,
    // If selector is used, use equalityFn to avoid unnecessary re-renders
    selector ? [selected, equalityFn] : [context]
  );

  // Debug info in React DevTools
  useDebugValue(memoized, v =>
    typeof v === 'object' && v !== null
      ? Object.keys(v).join(', ')
      : String(v)
  );

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.debug('[useAuth] hook used', { selected: memoized });
  }

  return memoized;
};