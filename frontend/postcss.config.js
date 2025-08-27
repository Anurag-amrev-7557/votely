import tailwindcssNesting from 'tailwindcss/nesting/index.js';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import postcssPresetEnv from 'postcss-preset-env';
import postcssCustomMedia from 'postcss-custom-media';
import postcssColorFunction from 'postcss-color-function';
import postcssReporter from 'postcss-reporter';

// Custom plugin to suppress :is() pseudo-class warnings
const suppressIsWarnings = () => {
  return (root, result) => {
    if (result.messages) {
      result.messages = result.messages.filter(message => {
        // Filter out :is() pseudo-class warnings
        if (message.type === 'warning' && 
            message.text && 
            message.text.includes(':is()')) {
          return false;
        }
        return true;
      });
    }
  };
};

// Custom plugin to handle cssRules null error
const safeColorFunction = () => {
  return (root, result) => {
    // Check if we're in a browser environment and stylesheets are available
    if (typeof document !== 'undefined') {
      const stylesheets = Array.from(document.styleSheets);
      const hasValidStylesheets = stylesheets.some(sheet => {
        try {
          return sheet && sheet.cssRules;
        } catch (e) {
          return false;
        }
      });
      
      if (!hasValidStylesheets) {
        console.warn('PostCSS Color Function: No valid stylesheets available, skipping color function processing');
        return;
      }
    }
    
    try {
      return postcssColorFunction()(root, result);
    } catch (error) {
      if (error.message.includes('cssRules') || error.message.includes('VariablesStore') || error.message.includes('Cannot read properties of null')) {
        console.warn('PostCSS Color Function: Skipping due to stylesheet loading issue:', error.message);
        return;
      }
      throw error;
    }
  };
};

export default {
  plugins: [
    postcssImport(),
    tailwindcssNesting(),
    tailwindcss(),
    autoprefixer(),
    postcssPresetEnv({
      stage: 0, // Use stage 0 for more modern features
      features: {
        'nesting-rules': false, // handled by tailwindcss/nesting
        'custom-media-queries': true,
        'color-function': { unresolved: 'warn' },
        'is-pseudo-class': true, // Enable :is() pseudo-class support
      },
      autoprefixer: { grid: true },
    }),
    postcssCustomMedia(),
    safeColorFunction(),
    suppressIsWarnings(),
    postcssReporter({ clearReportedMessages: true }),
  ],
  map: process.env.NODE_ENV !== 'production',
};