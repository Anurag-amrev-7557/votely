import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if theme preference is stored in localStorage
    const savedTheme = localStorage.getItem('theme');
    // Only use dark mode if explicitly set
    return savedTheme === 'dark';
  });

  // Memoize theme toggle function
  const toggleTheme = useCallback(() => {
    // Add transition class before changing theme
    document.documentElement.classList.add('theme-transition');
    
    // Use requestAnimationFrame to ensure smooth transition
    requestAnimationFrame(() => {
      setIsDarkMode(prev => !prev);
    });
  }, []);

  // Memoize theme value
  const themeValue = useMemo(() => ({
    isDarkMode,
    toggleTheme
  }), [isDarkMode, toggleTheme]);

  useEffect(() => {
    // Update localStorage when theme changes
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document class
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(isDarkMode ? 'dark' : 'light');

    // Remove transition class after transition completes
    const timeoutId = setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 300); // Match this with the CSS transition duration

    return () => clearTimeout(timeoutId);
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={themeValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 