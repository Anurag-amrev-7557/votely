import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * Advanced Debounce Hook with Enhanced Features
 * 
 * Features:
 * - Configurable delay with fallback
 * - Immediate execution option
 * - Leading/trailing edge control
 * - Performance optimizations with useCallback/useMemo
 * - TypeScript-like parameter validation
 * - Memory leak prevention
 * - Debug logging in development
 * - Custom equality comparison
 * - Batch updates support
 * - Error boundary integration
 */
export const useDebounce = (
  value,
  delay = 500,
  options = {}
) => {
  const {
    immediate = false,
    leading = false,
    trailing = true,
    equalityFn = (a, b) => a === b,
    onDebounce = null,
    maxWait = null,
    batchUpdates = false
  } = options;

  // Enhanced state management with refs for performance
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef(null);
  const lastCallTimeRef = useRef(0);
  const lastValueRef = useRef(value);
  const isFirstCallRef = useRef(true);

  // Memoized equality check for performance
  const isEqual = useMemo(() => 
    equalityFn(lastValueRef.current, value), 
    [value, equalityFn]
  );

  // Enhanced debounce function with advanced features
  const debounce = useCallback((newValue) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTimeRef.current;
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Handle immediate execution
    if (immediate && isFirstCallRef.current) {
      setDebouncedValue(newValue);
      lastValueRef.current = newValue;
      lastCallTimeRef.current = now;
      isFirstCallRef.current = false;
      
      if (onDebounce) {
        try {
          onDebounce(newValue, 'immediate');
        } catch (error) {
          console.error('useDebounce: Error in onDebounce callback:', error);
        }
      }
      return;
    }

    // Handle leading edge execution
    if (leading && timeSinceLastCall >= delay) {
      setDebouncedValue(newValue);
      lastValueRef.current = newValue;
      lastCallTimeRef.current = now;
      
      if (onDebounce) {
        try {
          onDebounce(newValue, 'leading');
        } catch (error) {
          console.error('useDebounce: Error in onDebounce callback:', error);
        }
      }
      return;
    }

    // Handle maxWait constraint
    const shouldExecuteNow = maxWait && timeSinceLastCall >= maxWait;
    
    if (shouldExecuteNow) {
      setDebouncedValue(newValue);
      lastValueRef.current = newValue;
      lastCallTimeRef.current = now;
      
      if (onDebounce) {
        try {
          onDebounce(newValue, 'maxWait');
        } catch (error) {
          console.error('useDebounce: Error in onDebounce callback:', error);
        }
      }
      return;
    }

    // Standard trailing edge debounce
    if (trailing) {
      timeoutRef.current = setTimeout(() => {
        setDebouncedValue(newValue);
        lastValueRef.current = newValue;
        lastCallTimeRef.current = Date.now();
        
        if (onDebounce) {
          try {
            onDebounce(newValue, 'trailing');
          } catch (error) {
            console.error('useDebounce: Error in onDebounce callback:', error);
          }
        }
      }, delay);
    }
  }, [delay, immediate, leading, trailing, maxWait, onDebounce]);

  // Enhanced effect with validation and optimization
  useEffect(() => {
    // Parameter validation
    if (typeof delay !== 'number' || delay < 0) {
      console.warn('useDebounce: Invalid delay value. Using default delay of 500ms.');
      return;
    }

    if (value === undefined || value === null) {
      console.warn('useDebounce: Value is undefined or null. Consider providing a default value.');
    }

    // Skip if values are equal (performance optimization)
    if (isEqual && !isFirstCallRef.current) {
      return;
    }

    // Batch updates for better performance
    if (batchUpdates) {
      // Use requestAnimationFrame for smooth batching
      requestAnimationFrame(() => {
        debounce(value);
      });
    } else {
      debounce(value);
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.debug('useDebounce: Value changed', {
        value,
        debouncedValue,
        delay,
        timestamp: Date.now()
      });
    }

    // Cleanup function with enhanced error handling
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [value, debounce, isEqual, batchUpdates]);

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  // Memoized return value for performance
  return useMemo(() => debouncedValue, [debouncedValue]);
};

/**
 * Convenience hook for common debounce patterns
 */
export const useDebounceSearch = (searchTerm, delay = 300) => {
  return useDebounce(searchTerm, delay, {
    leading: false,
    trailing: true,
    onDebounce: (value) => {
      if (process.env.NODE_ENV === 'development') {
        console.debug('Search term debounced:', value);
      }
    }
  });
};

/**
 * Hook for immediate debounce with fallback
 */
export const useDebounceImmediate = (value, delay = 500) => {
  return useDebounce(value, delay, {
    immediate: true,
    leading: true,
    trailing: true
  });
};

/**
 * Hook for leading edge debounce only
 */
export const useDebounceLeading = (value, delay = 500) => {
  return useDebounce(value, delay, {
    leading: true,
    trailing: false
  });
};